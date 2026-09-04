/**
 * Builds the word lists behind /tools/most-common-words.
 *
 * Run by hand, not from `vite build` — it streams gigabytes and needs the
 * network, neither of which belongs in a deploy:
 *
 *   node scripts/wordlists/build.ts            # every language
 *   node scripts/wordlists/build.ts es fr      # just these
 *
 * Node 24 runs this file directly; it strips the types and needs no tsx.
 *
 * Two sources, both CC BY-SA 4.0, both credited in
 * static/data/most-common-words/ATTRIBUTION.md:
 *
 *   - hermitdave/FrequencyWords — OpenSubtitles 2018 frequency counts.
 *   - kaikki.org — Wiktextract's parse of the English Wiktionary, which is
 *     where the English meanings come from.
 *
 * The dictionary is not only the source of glosses, it is the main filter. A
 * subtitle corpus is full of English ("ok", "tv", "show") and character names
 * ("john", "michael"), and no script or frequency rule separates those from
 * real Spanish, because they are Latin letters at plausible frequencies. Having
 * an entry in that language's Wiktionary does separate them.
 */
import { createWriteStream } from 'node:fs';
import { mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { Readable } from 'node:stream';
import path from 'node:path';
import { WORDLIST_LANGUAGES, type WordlistLanguage } from './languages.ts';
import { GLOSS_OVERRIDES } from './overrides.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT_DIR = path.join(ROOT, 'static/data/most-common-words');
const CACHE_DIR = path.join(ROOT, '.cache/wordlists');

/** How many words a page shows at most. */
const TARGET = 10_000;
/** Below this a page would be too thin to be worth having. */
const FLOOR = 1_000;

/**
 * Tokens that are subtitle furniture rather than words. Deliberately tiny and
 * unambiguous: "com", "net" and "sub" are real words in several of these
 * languages, and blocking them globally would put an obvious hole near the top
 * of the Portuguese and Catalan lists.
 */
const ARTEFACTS = new Set([
	'opensubtitles',
	'subtitles',
	'subtitle',
	'subrip',
	'dvdrip',
	'brrip',
	'webrip',
	'hdtv',
	'bluray',
	'xvid',
	'divx',
	'yify',
	'www',
	'http',
	'https'
]);

/** Parts of speech we will show a gloss for. `name` is excluded on purpose. */
const USABLE_POS = new Set([
	'verb',
	'noun',
	'adj',
	'adv',
	'pron',
	'det',
	'prep',
	'conj',
	'num',
	'particle',
	'intj',
	'article',
	'postp',
	'contraction',
	'phrase'
]);

interface Entry {
	gloss: string;
	pos: string;
	formOf?: string;
}

function freqUrl(lang: WordlistLanguage, variant: '50k' | 'full') {
	return `https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/${lang.freq}/${lang.freq}_${variant}.txt`;
}

function wiktionaryUrl(lang: WordlistLanguage) {
	// The directory keeps the spaces and hyphens, the filename drops them:
	// .../Serbo-Croatian/kaikki.org-dictionary-SerboCroatian.jsonl
	const dir = encodeURIComponent(lang.wiktionary);
	const file = encodeURIComponent(lang.wiktionary.replace(/[ -]/g, ''));
	return `https://kaikki.org/dictionary/${dir}/kaikki.org-dictionary-${file}.jsonl`;
}

async function fetchOk(url: string) {
	const res = await fetch(url);
	if (!res.ok || !res.body) throw new Error(`${res.status} ${res.statusText} — ${url}`);
	return res;
}

/** The frequency list, most frequent first, before any filtering. */
async function loadFrequencies(lang: WordlistLanguage): Promise<[string, number][]> {
	let res: Response;
	try {
		res = await fetchOk(freqUrl(lang, '50k'));
	} catch {
		// hi, kk and ja have no _50k file — their corpus never reached 50k words.
		res = await fetchOk(freqUrl(lang, 'full'));
	}
	const text = await res.text();
	const rows: [string, number][] = [];
	for (const line of text.split('\n')) {
		const sep = line.lastIndexOf(' ');
		if (sep < 1) continue;
		const word = line.slice(0, sep).trim();
		const count = Number(line.slice(sep + 1));
		if (word && Number.isFinite(count)) rows.push([word, count]);
	}
	return rows;
}

/** Trim a Wiktionary gloss down to something that fits a table cell. */
function tidyGloss(raw: string): string {
	let g = raw
		.replace(/\([^)]*\)/g, ' ') // "(transitive) to eat" -> "to eat"
		.replace(/\[[^\]]*\]/g, ' ')
		.replace(/[()]/g, ' ') // leftovers from nested or unbalanced parentheses
		.replace(/\s+/g, ' ')
		// Removing a parenthetical leaves the space that preceded it:
		// "to be (colloquial), to end up" -> "to be , to end up".
		.replace(/\s+([,;:])/g, '$1')
		.replace(/([,;:])(?:\s*\1)+/g, '$1')
		.replace(/^[;,:.\s]+|[;,:.\s]+$/g, '')
		.trim();
	if (g.length > 60) {
		const cut = g.slice(0, 60);
		const space = cut.lastIndexOf(' ');
		g = (space > 30 ? cut.slice(0, space) : cut).trim() + '…';
	}
	return g;
}

/**
 * Wiktionary lists senses in its own order, which is frequently not the one a
 * learner wants: Spanish "de" opens with the name of the letter D, "a" with the
 * chess bishop, "no" with an abbreviation of "noroeste". Picking the first
 * sense produces a list that is wrong exactly where everybody looks. So every
 * candidate sense is scored and the best one wins.
 */
const METALINGUISTIC =
	/^(the name of the|the [a-z]+ (numeral symbol|letter) of|abbreviation of|initialism of|acronym of|symbol for|alternative (form|spelling|letter-case form) of|obsolete (form|spelling) of|misspelling of|eye dialect of|superseded spelling of|archaic (form|spelling) of)/i;

const WEAK_TAGS = new Set([
	'obsolete',
	'archaic',
	'rare',
	'dialectal',
	'dated',
	'poetic',
	'nonstandard',
	'informal-vulgar',
	'historical'
]);

/** Function words carry the head of every frequency list. */
const FUNCTION_POS = new Set([
	'prep',
	'pron',
	'det',
	'article',
	'conj',
	'particle',
	'adv',
	'postp',
	'contraction',
	'num'
]);

/** Longer than this and the page truncates it with an ellipsis. */
const READABLE = 60;

function scoreSense(
	pos: string,
	gloss: string,
	tags: string[] | undefined,
	lemmaRank: number | undefined,
	isForm: boolean,
	word: string
): number {
	let score = 0;
	if (METALINGUISTIC.test(gloss)) score -= 100;
	if (tags?.some((t) => WEAK_TAGS.has(t))) score -= 50;
	if (pos === 'name') score -= 60;
	// "forms the present perfect tenses of certain verbs" is what German "sein"
	// does, not what it means; the copula sense is the one a learner wants.
	if (/^(forms |used to |used for |used with |used in |indicates |marks )/i.test(gloss)) score -= 6;
	// A gloss that repeats the word says nothing: "champán" -> "champan".
	if (gloss.toLowerCase() === word.toLowerCase()) score -= 40;
	// Only a tie-breaker, and only against a gloss the page would cut off. A
	// bonus for shortness was tried and picked "furthermore" over "more"; a
	// penalty for being unreadably long does not have that failure mode.
	if (gloss.length > READABLE) score -= 3;
	// Only for a sense that is a word in its own right, never for an inflected
	// form. Polish "nie" is the negation particle, not the accusative of "ono",
	// and Turkish "de" is the clitic "too", not a form of "demek" — in both
	// cases the inflection points at a commoner lemma and would win otherwise.
	if (FUNCTION_POS.has(pos) && !isForm) score += 14;
	else if (!USABLE_POS.has(pos)) score -= 40;
	// French "est" is both the noun "east" and the third person of "être", and
	// Spanish "es" is a form of both "ser" and "e". At the top of a frequency
	// list the inflection of a common verb is nearly always the right reading,
	// so how common the lemma is decides it.
	if (lemmaRank !== undefined) score += lemmaRank < 500 ? 12 : lemmaRank < 3000 ? 8 : 0;
	return score;
}

/**
 * Streams the language's Wiktextract file, keeping only what we need:
 * the best gloss for every candidate word, plus a gloss for every lemma so
 * that inflected forms ("hablamos") can borrow their lemma's meaning.
 */
async function loadDictionary(
	lang: WordlistLanguage,
	candidates: Set<string>,
	ranks: Map<string, number>
) {
	const entries = new Map<string, Entry & { score: number }>();
	// Keyed by `word|pos`: German "sein" is both the verb "to be" and the
	// determiner "his", and "ist" must reach the verb.
	const lemmas = new Map<string, { gloss: string; score: number }>();

	const res = await fetchOk(wiktionaryUrl(lang));
	const rl = createInterface({
		input: Readable.fromWeb(res.body as never),
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		if (!line) continue;
		let rec: {
			word?: string;
			pos?: string;
			senses?: { glosses?: string[]; form_of?: { word?: string }[]; tags?: string[] }[];
		};
		try {
			rec = JSON.parse(line);
		} catch {
			continue;
		}
		const word = rec.word;
		if (!word || !rec.senses?.length) continue;
		const pos = rec.pos ?? '';
		const key = word.toLowerCase();
		const wanted = candidates.has(key);

		for (const sense of rec.senses) {
			// `glosses` runs general -> specific. Russian prepositions are
			// ["[with prepositional]", "in, at"]; the first element is the case
			// it governs, and only the last one is the meaning.
			const glossRaw = sense.glosses?.[sense.glosses.length - 1];
			if (!glossRaw) continue;
			const gloss = tidyGloss(glossRaw);
			if (!gloss) continue;
			const formOf = sense.form_of?.[0]?.word;
			const score = scoreSense(
				pos,
				gloss,
				sense.tags,
				formOf ? ranks.get(formOf.toLowerCase()) : undefined,
				Boolean(formOf),
				word
			);

			// A lemma gloss is a real definition, never "plural of x".
			if (!formOf && USABLE_POS.has(pos)) {
				for (const k of [`${key}|${pos}`, key]) {
					const prev = lemmas.get(k);
					if (!prev || score > prev.score) lemmas.set(k, { gloss, score });
				}
			}

			if (wanted && (USABLE_POS.has(pos) || formOf)) {
				// A form-of sense is slightly weaker: it only tells us where to look.
				const effective = formOf ? score - 2 : score;
				const prev = entries.get(key);
				if (!prev || effective > prev.score) {
					entries.set(key, { gloss, pos, formOf: formOf?.toLowerCase(), score: effective });
				}
			}
		}
	}
	return { entries, lemmas };
}

/** Cached so that re-running the filter does not re-download a gigabyte. */
async function dictionaryFor(
	lang: WordlistLanguage,
	candidates: Set<string>,
	ranks: Map<string, number>
) {
	const cache = path.join(CACHE_DIR, `${lang.code}.json`);
	try {
		const raw = JSON.parse(await readFile(cache, 'utf8'));
		if (raw.version === 6) {
			return {
				entries: new Map<string, Entry>(raw.entries),
				lemmas: new Map<string, string>(raw.lemmas),
				cached: true
			};
		}
	} catch {
		// no usable cache; fall through and download
	}
	const { entries: scored, lemmas: scoredLemmas } = await loadDictionary(lang, candidates, ranks);
	const entries = new Map<string, Entry>(
		[...scored].map(([k, v]) => [k, { gloss: v.gloss, pos: v.pos, formOf: v.formOf }])
	);
	const lemmas = new Map<string, string>([...scoredLemmas].map(([k, v]) => [k, v.gloss]));
	await mkdir(CACHE_DIR, { recursive: true });
	// Only lemmas a candidate actually points at are worth keeping on disk.
	const needed = new Set<string>();
	for (const e of entries.values()) if (e.formOf) needed.add(e.formOf);
	const slimLemmas = [...lemmas].filter(([w]) => {
		const base = w.split('|')[0];
		return needed.has(base) || entries.has(base);
	});
	await writeFile(cache, JSON.stringify({ version: 6, entries: [...entries], lemmas: slimLemmas }));
	return { entries, lemmas, cached: false };
}

/** Build one language's list. Returns the manifest row, or null if too thin. */
async function buildLanguage(lang: WordlistLanguage) {
	const scriptRe = new RegExp(`^[\\p{Script=${lang.script}}\\p{Mn}'’ʼ-]+$`, 'u');

	const freqs = await loadFrequencies(lang);
	// Only the shape-level filters here; the dictionary decides the rest.
	const shaped = freqs.filter(([word]) => {
		if (word.length > 40) return false;
		if (/[0-9]/.test(word)) return false;
		if (word.includes('.')) return false;
		if (ARTEFACTS.has(word)) return false;
		return scriptRe.test(word);
	});

	const candidates = new Set(shaped.map(([w]) => w.toLowerCase()));
	const ranks = new Map<string, number>();
	shaped.forEach(([w], i) => {
		const k = w.toLowerCase();
		if (!ranks.has(k)) ranks.set(k, i);
	});
	const { entries, lemmas, cached } = await dictionaryFor(lang, candidates, ranks);

	const rows: { word: string; gloss: string }[] = [];
	const seenWord = new Set<string>();
	for (const [word] of shaped) {
		if (rows.length >= TARGET) break;
		const key = word.toLowerCase();
		if (seenWord.has(key)) continue;
		const entry = entries.get(key);
		// No entry in this language's dictionary means it is not a word in this
		// language: an English import, a character name, or corpus noise.
		if (!entry) continue;
		seenWord.add(key);
		let gloss = entry.gloss;
		if (entry.formOf) {
			gloss = lemmas.get(`${entry.formOf}|${entry.pos}`) ?? lemmas.get(entry.formOf) ?? entry.gloss;
		}
		// The hand-checked table wins over whatever the scorer chose.
		gloss = GLOSS_OVERRIDES[`${lang.code}:${key}`] ?? gloss;
		rows.push({ word, gloss });
	}

	if (rows.length < FLOOR) {
		console.log(`  ${lang.code}: only ${rows.length} words survived — skipping`);
		return null;
	}

	await mkdir(OUT_DIR, { recursive: true });
	const out = createWriteStream(path.join(OUT_DIR, `${lang.slug}.tsv`));
	out.write('rank\tword\tenglish\n');
	rows.forEach((r, i) => out.write(`${i + 1}\t${r.word}\t${r.gloss}\n`));
	await new Promise((res) => out.end(res));

	const withGloss = rows.filter((r) => r.gloss).length;
	const bytes = (await stat(path.join(OUT_DIR, `${lang.slug}.tsv`))).size;
	console.log(
		`  ${lang.code} ${lang.name}: ${rows.length} words, ` +
			`${Math.round((withGloss / rows.length) * 100)}% glossed, ` +
			`${Math.round(bytes / 1024)} KB${cached ? ' (cached dict)' : ''}`
	);
	return {
		code: lang.code,
		slug: lang.slug,
		name: lang.name,
		nativeName: lang.nativeName,
		count: rows.length,
		bytes,
		glossCoverage: Math.round((withGloss / rows.length) * 100)
	};
}

const only = process.argv.slice(2);
const targets = only.length
	? WORDLIST_LANGUAGES.filter((l) => only.includes(l.code))
	: WORDLIST_LANGUAGES;

if (!targets.length) {
	console.error(`No language matched ${only.join(', ')}`);
	process.exit(1);
}

console.log(`Building ${targets.length} language(s)…`);
const manifest = [];
for (const lang of targets) {
	try {
		const row = await buildLanguage(lang);
		if (row) manifest.push(row);
	} catch (err) {
		console.error(`  ${lang.code} ${lang.name}: FAILED — ${(err as Error).message}`);
	}
}

console.log(`\nDone: ${manifest.length}/${targets.length} languages`);
if (only.length === 0) {
	manifest.sort((a, b) => a.name.localeCompare(b.name));
	const rows = manifest
		.map(
			(m) =>
				`\t{ code: '${m.code}', slug: '${m.slug}', name: ${JSON.stringify(m.name)}, ` +
				`nativeName: ${JSON.stringify(m.nativeName)}, count: ${m.count}, ` +
				`bytes: ${m.bytes}, glossCoverage: ${m.glossCoverage} }`
		)
		.join(',\n');
	await writeFile(
		path.join(ROOT, 'src/lib/data/most-common-words.ts'),
		`// GENERATED by scripts/wordlists/build.ts — do not edit by hand.\n` +
			`// One row per language that has a page under /tools/most-common-words.\n` +
			`// The word lists themselves are in static/data/most-common-words/.\n\n` +
			`export interface WordListMeta {\n` +
			`\t/** ISO 639-1, matching packages/shared/src/languages.ts. */\n\tcode: string\n` +
			`\t/** URL segment, e.g. 'spanish'. */\n\tslug: string\n` +
			`\tname: string\n\tnativeName: string\n` +
			`\t/** How many words the list actually has. Not always 10,000. */\n\tcount: number\n` +
			`\t/** Size of the .tsv, for the download link. */\n\tbytes: number\n` +
			`\t/** Percentage of rows carrying an English meaning. */\n\tglossCoverage: number\n}\n\n` +
			`export const WORD_LISTS: WordListMeta[] = [\n${rows}\n]\n\n` +
			`export const totalWords = WORD_LISTS.reduce((n, l) => n + l.count, 0)\n`
	);
	console.log(`Manifest written for ${manifest.length} languages`);
}
