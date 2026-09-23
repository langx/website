/**
 * Adds a pronunciation, in IPA, to every word in the lists behind /tools.
 *
 *   node scripts/wordlists/build-ipa.ts            # every language
 *   node scripts/wordlists/build-ipa.ts es fr      # just these
 *
 * Run it after build.ts, which rewrites the .tsv files without this column, and
 * before build-index.ts, build-pairs.ts and build-games.ts, which copy it on.
 * It writes a fourth column, `ipa`, into static/data/most-common-words/*.tsv
 * and updates the byte counts in src/lib/data/most-common-words.ts.
 *
 * Two sources, in this order:
 *
 *   - Wiktionary, through kaikki.org — a transcription a person wrote, with the
 *     stress where it belongs. The same dumps build.ts reads for meanings, but
 *     the gzipped per-language files: a tenth of the size, and the only part of
 *     them this needs is `sounds`.
 *   - eSpeak NG, or for Turkish rules of our own (ipa-turkish.ts), for the
 *     words Wiktionary has no transcription for — mostly inflected forms
 *     ("hablamos"), which Wiktionary files under their lemma.
 *     Its rules are good where the spelling is regular and its dictionaries
 *     cover the common irregulars, which is the whole of a frequency list.
 *
 * Some languages get no eSpeak fallback at all: it has no voice for Galician or
 * Tagalog, and it cannot read unvowelled Arabic or Hebrew or tell which of a
 * character's Mandarin readings is meant. A missing pronunciation is better
 * than a wrong one said with confidence, so those rows keep an empty column.
 */
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGunzip } from 'node:zlib';
import path from 'node:path';
import { WORDLIST_LANGUAGES, type WordlistLanguage } from './languages.ts';
import { turkishIpa } from './ipa-turkish.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DATA = path.join(ROOT, 'static/data/most-common-words');
const CACHE = path.join(ROOT, '.cache/wordlists/kaikki');
const MANIFEST = path.join(ROOT, 'src/lib/data/most-common-words.ts');

interface Accent {
	/** eSpeak NG voice, or null where its reading would be wrong more than right. */
	espeak: string | null;
	/**
	 * Wiktionary tags naming the accent to prefer where it gives several — the
	 * one the page's audio speaks, where there is audio.
	 */
	prefer?: string[];
	/** A transcription must carry one of these tags to count at all. */
	require?: string[];
	/** Taken out of eSpeak's reading: what it marks, it marks in the wrong place. */
	strip?: RegExp;
	/**
	 * Spelling rules of our own, used instead of eSpeak where they read the
	 * language better. Held to the same test against Wiktionary.
	 */
	rules?: (word: string) => string | null;
}

const ACCENTS: Record<string, Accent> = {
	af: { espeak: 'af' },
	ar: { espeak: null },
	bg: { espeak: 'bg' },
	bn: { espeak: 'bn' },
	// eSpeak's Serbian reads Bosnian and Croatian Latin spelling right 94% of the
	// time; its own Bosnian and Croatian voices, under half.
	bs: { espeak: 'sr' },
	ca: { espeak: 'ca', prefer: ['Central'] },
	cs: { espeak: 'cs' },
	// Stød sits after the vowel; eSpeak writes it before, and a transcription
	// without it is one plenty of dictionaries print.
	da: { espeak: 'da', strip: /ʔ/g },
	de: { espeak: 'de', prefer: ['Standard'] },
	el: { espeak: 'el' },
	en: { espeak: 'en-us', prefer: ['General-American', 'US'] },
	eo: { espeak: 'eo' },
	es: { espeak: 'es-419', prefer: ['Latin-America'] },
	et: { espeak: 'et' },
	eu: { espeak: 'eu' },
	fa: { espeak: 'fa', prefer: ['Iranian-Persian', 'Iran'] },
	fi: { espeak: 'fi' },
	fr: { espeak: 'fr-fr', prefer: ['France'] },
	gl: { espeak: null },
	he: { espeak: null, prefer: ['Modern-Israeli-Hebrew'] },
	hi: { espeak: 'hi' },
	hr: { espeak: 'sr' },
	hu: { espeak: 'hu' },
	hy: { espeak: 'hy', prefer: ['Eastern-Armenian'] },
	id: { espeak: 'id' },
	is: { espeak: 'is' },
	it: { espeak: 'it' },
	ka: { espeak: 'ka' },
	kk: { espeak: 'kk' },
	ko: { espeak: 'ko', prefer: ['Seoul'] },
	lt: { espeak: 'lt' },
	lv: { espeak: 'lv' },
	mk: { espeak: 'mk' },
	ml: { espeak: 'ml' },
	ms: { espeak: 'ms' },
	nl: { espeak: 'nl', prefer: ['Netherlands'] },
	no: { espeak: 'nb', prefer: ['Urban-East-Norwegian'] },
	pl: { espeak: 'pl' },
	pt: { espeak: 'pt-br', prefer: ['Brazil'] },
	ro: { espeak: 'ro' },
	ru: { espeak: 'ru' },
	si: { espeak: 'si' },
	sk: { espeak: 'sk' },
	sl: { espeak: 'sl' },
	sq: { espeak: 'sq' },
	sr: { espeak: 'sr' },
	sv: { espeak: 'sv', prefer: ['Central-Swedish'] },
	ta: { espeak: 'ta' },
	te: { espeak: 'te' },
	tl: { espeak: null },
	// eSpeak gets Turkish sounds right and its stress wrong ("fakat" on the last
	// syllable): 55%. The rules in ipa-turkish.ts do better.
	tr: { espeak: 'tr', rules: turkishIpa },
	uk: { espeak: 'uk' },
	ur: { espeak: 'ur' },
	vi: { espeak: 'vi', prefer: ['Hà-Nội'] },
	zh: { espeak: null, require: ['Mandarin'], prefer: ['Standard-Chinese', 'Sinological-IPA'] }
};

/**
 * A tag containing any of these marks a pronunciation nobody speaks today, or
 * only some region does: Tiberian Hebrew, Classical Persian, Western Armenian,
 * Parisian French "de" as /dø/. Such a transcription is not used at all, even
 * when it is the only one — English "to" has none but the Indian English
 * particle's /t̪oː/, and a learner is better served by eSpeak's /tə/.
 */
const DATED =
	/Classical|Tiberian|Biblical|Ecclesiastical|Medieval|Early|Middle|Old|obsolete|archaic|dated|Western-Armenian|Cantonese|Hokkien|Hakka|Wu|Min|Taiwan|India|Pakistan|Nigeria|Singapore|Philippines|Scotland|Scottish|Ireland|Irish|Wales|Welsh|Northern-England|Geordie|Louisiana|Quebec|Paris|Belgium|Switzerland|Africa|Australia|New-Zealand|Jamaica|Caribbean|Hong-Kong|dialect/;

function kaikkiUrl(lang: WordlistLanguage) {
	const dir = encodeURIComponent(lang.wiktionary);
	const file = encodeURIComponent(lang.wiktionary.replace(/[ -]/g, ''));
	return `https://kaikki.org/dictionary/${dir}/kaikki.org-dictionary-${file}.jsonl.gz`;
}

/** Downloaded once; Bosnian, Croatian and Serbian share the Serbo-Croatian file. */
async function dumpFor(lang: WordlistLanguage) {
	const url = kaikkiUrl(lang);
	const file = path.join(CACHE, decodeURIComponent(path.basename(url)));
	try {
		if ((await stat(file)).size > 0) return file;
	} catch {
		// not cached yet
	}
	await mkdir(CACHE, { recursive: true });
	const res = await fetch(url);
	if (!res.ok || !res.body) throw new Error(`${res.status} ${res.statusText} — ${url}`);
	await pipeline(Readable.fromWeb(res.body as never), createWriteStream(`${file}.part`));
	await rename(`${file}.part`, file);
	return file;
}

type Sound = { ipa?: string; tags?: string[]; raw_tags?: string[] };

function scoreSound(s: Sound, accent: Accent): number | null {
	if (!s.ipa) return null;
	const tags = [...(s.tags ?? []), ...(s.raw_tags ?? [])].map((t) => t.replace(/ /g, '-'));
	if (accent.require && !tags.some((t) => accent.require?.includes(t))) return null;
	if (tags.some((t) => DATED.test(t) && !accent.require?.includes(t))) return null;
	// The sound a letter stands for, or its name: Spanish "y" is /ʝ/ as a
	// letter and /i/ as the word "and".
	if (tags.includes('phoneme') || tags.includes('letter')) return null;
	let score = 0;
	if (accent.prefer && tags.some((t) => accent.prefer?.includes(t))) score += 10;
	// English "it" is /ɪt/ in General American, Received Pronunciation and
	// Australian at once, and /ət/ in General American alone: the reading more
	// accents share is the one to show.
	if (tags.length > 1) score += 1;
	// A phonemic /transcription/ is what a learner reads; a [phonetic] one is
	// a second choice, taken only when it is all there is.
	if (s.ipa.trim().startsWith('/')) score += 2;
	return score;
}

/** One transcription, trimmed to a single form and given its brackets. */
function tidyIpa(raw: string): string | null {
	let ipa = raw.trim();
	// "/a/, /b/" and "/a/ ~ /b/" list variants; the first will do.
	const first = ipa.match(/^([/[])[^/\]]+[/\]]/);
	if (first) ipa = first[0];
	if (!/^[/[]/.test(ipa)) ipa = `/${ipa}/`;
	if (ipa.length > 48 || /[A-Z0-9]/.test(ipa.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, ''))) return null;
	return ipa;
}

/**
 * Entries for the letter, the symbol or a name rather than the word spelled
 * the same: English "To", a surname, is /toʊ/.
 */
const LETTER_POS = new Set(['character', 'letter', 'symbol', 'name']);

/** The best Wiktionary transcription for each word we need. */
async function fromWiktionary(lang: WordlistLanguage, words: Set<string>) {
	const accent = ACCENTS[lang.code];
	const best = new Map<string, { ipa: string; score: number }>();
	const file = await dumpFor(lang);
	const rl = createInterface({
		input: createReadStream(file).pipe(createGunzip()),
		crlfDelay: Infinity
	});
	for await (const line of rl) {
		// Cheap test first: most entries have no transcription. The headword
		// cannot be fished out the same way, because "derived" and "synonyms"
		// carry "word" keys of their own and can come first.
		if (!line.includes('"ipa"')) continue;
		let rec: { word?: string; pos?: string; sounds?: Sound[] };
		try {
			rec = JSON.parse(line);
		} catch {
			continue; // a stray carriage return inside a gloss splits the line
		}
		const head = rec.word;
		if (!head) continue;
		const key = head.toLowerCase();
		if (!words.has(key)) continue;
		if (rec.pos && LETTER_POS.has(rec.pos)) continue;

		for (const s of rec.sounds ?? []) {
			let score = scoreSound(s, accent);
			if (score === null) continue;
			const ipa = tidyIpa(s.ipa as string);
			if (!ipa) continue;
			// "us" is not "US"; the spelling the list has wins over a capitalised
			// entry for another word.
			if (rec.word === head && head === key) score += 5;
			const prev = best.get(key);
			if (!prev || score > prev.score) best.set(key, { ipa, score });
		}
	}
	return new Map([...best].map(([k, v]) => [k, v.ipa]));
}

const VOWEL = /[aeiouyɑɐɒæɛəɜɞɘɵøœɶɪʏʊʌɔɤɯɨʉɚɝ]/;
const APPROXIMANT = /^[lɾrɹjwʎʁʀɫʋɥ]/;
/** Diacritics and modifier letters that belong to the letter before them. */
const MODIFIER = /[\p{M}ʰʲʷˠˤⁿˡːˑ̃]/u;

/**
 * eSpeak puts the stress mark before the stressed vowel ("aβlˈamos"); IPA and
 * Wiktionary put it before the syllable ("aˈβlamos"). Moves it back over the
 * consonants that open the syllable: all of them at the start of a word, else
 * one — two when the second is a liquid or glide, as in "bl", "tr", "kw".
 */
function syllableStress(ipa: string): string {
	const segs: string[] = [];
	for (const ch of ipa) {
		const last = segs.length - 1;
		if (last >= 0 && (MODIFIER.test(ch) || segs[last].endsWith('͡'))) segs[last] += ch;
		else if (ch === '͡' && last >= 0) segs[last] += ch;
		else segs.push(ch);
	}
	const isCons = (s: string) => !VOWEL.test(s[0]) && !/[ˈˌ\s.‿-]/.test(s[0]) && !s.includes('̩');
	for (let i = 0; i < segs.length; i++) {
		if (segs[i] !== 'ˈ' && segs[i] !== 'ˌ') continue;
		let j = i;
		while (j > 0 && isCons(segs[j - 1])) j--;
		const cluster = i - j;
		if (!cluster) continue;
		const atStart = j === 0 || /[\s‿-]/.test(segs[j - 1]);
		let onset = 1;
		if (atStart) onset = cluster;
		else if (cluster >= 2 && APPROXIMANT.test(segs[i - 1]) && !APPROXIMANT.test(segs[i - 2]))
			onset = 2;
		const mark = segs.splice(i, 1)[0];
		segs.splice(i - onset, 0, mark);
	}
	return segs.join('');
}

function cleanEspeak(out: string): string {
	return syllableStress(
		out
			.replace(/\([a-z-]+\)/g, '') // "(en)ɡˈʊɡəl(es)": a switch of voice mid-word
			.replace(/[_]/g, '')
			.trim()
	);
}

/** eSpeak NG, a few hundred words per call: one process per word would take an hour. */
function fromEspeak(voice: string, words: string[], strip?: RegExp) {
	const out = new Map<string, string>();
	const run = (batch: string[]) =>
		spawnSync('espeak-ng', ['-q', '--ipa', '-v', voice], {
			input: batch.join('\n'),
			encoding: 'utf8',
			maxBuffer: 64 * 1024 * 1024
		}).stdout.split('\n');
	for (let i = 0; i < words.length; i += 400) {
		const batch = words.slice(i, i + 400);
		let lines = run(batch);
		while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
		// One line out per line in is the usual case, not a guarantee: a word
		// eSpeak splits in two throws the whole batch out of step.
		if (lines.length !== batch.length) lines = batch.map((w) => run([w]).join(' '));
		batch.forEach((w, k) => {
			let ipa = cleanEspeak(lines[k] ?? '');
			if (strip) ipa = ipa.replace(strip, '');
			if (ipa && !/[A-Z0-9]/.test(ipa)) out.set(w, `/${ipa}/`);
		});
	}
	return out;
}

/**
 * Reduces a transcription to the sounds it names and where the stress falls,
 * so two notations of the same word compare equal: no brackets, length,
 * syllable breaks or diacritics, and the handful of letters Wiktionary and
 * eSpeak pick differently for one sound. The primary stress mark stays — a
 * reading with every sound right and the stress on the wrong syllable is
 * wrong — unless `stress` is false, for a source that did not mark it.
 */
function skeleton(ipa: string, stress = true): string {
	return (
		ipa
			.normalize('NFD')
			.replace(stress ? /[\p{M}/[\]ˌ.‿ːˑ()ʰʲʷˠˤʔˀˣ¹²͡-]/gu : /[\p{M}/[\]ˈˌ.‿ːˑ()ʰʲʷˠˤʔˀˣ¹²͡-]/gu, '')
			// Diphthongs written with a glide or a non-syllabic vowel; "ɪ ʊ" for an
			// unstressed "i u"; Finnish "v" as the approximant it is.
			.replace(/j/g, 'i')
			.replace(/ɪ/g, 'i')
			.replace(/ʊ/g, 'u')
			.replace(/ʋ/g, 'v')
			.replace(/[ɾɹʁʀrɻ]/g, 'r')
			// Allophones one source writes and the other does not: Spanish and Basque
			// "b d g" between vowels, "h" voiced or not, "x" or "χ".
			.replace(/[ɡɣ]/g, 'g')
			.replace(/β/g, 'b')
			.replace(/ð/g, 'd')
			.replace(/ɦ/g, 'h')
			.replace(/χ/g, 'x')
			.replace(/ɫ/g, 'l')
			.replace(/[ɛe]/g, 'e')
			.replace(/[ɔo]/g, 'o')
			.replace(/[ɑaɐ]/g, 'a')
			// Stress compared by the vowel it lands on, not by where the syllable
			// starts: "misˈteik" and "miˈsteik" stress the same vowel.
			.replace(/ˈ([^aeiouyæøœəɔɛɜɞɘɵɶʏɯɨʉʌɤ]*)/g, '$1ˈ')
	);
}

function distance(a: string, b: string): number {
	const x = [...a];
	const y = [...b];
	let prev = Array.from({ length: y.length + 1 }, (_, i) => i);
	for (let i = 1; i <= x.length; i++) {
		const cur = [i];
		for (let j = 1; j <= y.length; j++)
			cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
		prev = cur;
	}
	return prev[y.length];
}

/** How many sample words eSpeak is checked against. */
const SAMPLE = 1000;
/**
 * The share of those it must get right, sound for sound, to be trusted with
 * the words Wiktionary does not cover. Measured on 23 September 2026:
 * Esperanto 100%, Serbo-Croatian and Catalan 94%, French 90%, Finnish 79% and
 * Spanish 76% clear it; Russian (17%) puts the stress on the wrong syllable too
 * often, and Albanian (58%) reads "ë" as another vowel. Turkish failed with
 * eSpeak (55%) and passes with ipa-turkish.ts (81%).
 */
const TRUST = 0.6;

/** The fallback reader for a language: its own rules if it has them, else eSpeak. */
function readerFor(accent: Accent) {
	if (accent.rules) {
		const rules = accent.rules;
		return (words: string[]) =>
			new Map(
				words.flatMap((w) => {
					const ipa = rules(w);
					return ipa ? [[w, ipa] as const] : [];
				})
			);
	}
	const voice = accent.espeak;
	return voice ? (words: string[]) => fromEspeak(voice, words, accent.strip) : null;
}

/**
 * Whether the fallback reads this language well enough, judged on words
 * Wiktionary does transcribe. The words it would fill in are rarer forms of
 * the same spelling rules, so agreement here is the best estimate of accuracy
 * there.
 */
function agreement(read: (words: string[]) => Map<string, string>, wiki: Map<string, string>) {
	const sample = [...wiki].filter((_, i) => i % Math.max(1, Math.floor(wiki.size / SAMPLE)) === 0);
	const guesses = read(sample.map(([w]) => w));
	let same = 0;
	for (const [w, ipa] of sample) {
		const guess = guesses.get(w);
		// A word of one syllable has nowhere else to put the stress, and
		// Wiktionary marks it on some of them and not others.
		const syllabic = skeleton(ipa, false).match(/[aeiouyæøœəɔɛɜɯɨʉʌɤ]+/g)?.length ?? 0;
		const marked = ipa.includes('ˈ') && syllabic > 1;
		if (guess && distance(skeleton(guess, marked), skeleton(ipa, marked)) === 0) same++;
	}
	return sample.length ? same / sample.length : 0;
}

async function buildLanguage(lang: WordlistLanguage, slug: string) {
	const file = path.join(DATA, `${slug}.tsv`);
	const lines = (await readFile(file, 'utf8')).split('\n').filter(Boolean);
	const rows = lines.slice(1).map((l) => l.split('\t').slice(0, 3));
	const words = new Set(rows.map((r) => r[1].toLowerCase()));

	const wiki = await fromWiktionary(lang, words);
	const accent = ACCENTS[lang.code];
	const read = accent ? readerFor(accent) : null;
	const agrees = read ? agreement(read, wiki) : 0;
	const by = accent?.rules ? 'rules' : 'eSpeak';
	// A clitic cut off by the tokeniser ("'t", "c'") is not a word eSpeak can
	// read: it spells the letter.
	const missing = [...words].filter((w) => !wiki.has(w) && !/^['’]|['’]$/.test(w));
	const machine = read && agrees >= TRUST ? read(missing) : new Map<string, string>();

	let fromWiki = 0;
	let fromMachine = 0;
	const out = ['rank\tword\tenglish\tipa'];
	for (const [rank, word, english] of rows) {
		const key = word.toLowerCase();
		const ipa = wiki.get(key) ?? machine.get(key) ?? '';
		if (wiki.has(key)) fromWiki++;
		else if (ipa) fromMachine++;
		out.push(`${rank}\t${word}\t${english ?? ''}\t${ipa}`);
	}
	await writeFile(file, out.join('\n') + '\n');
	const pct = (n: number) => Math.round((n / rows.length) * 100);
	console.log(
		`  ${lang.code} ${lang.name}: ${pct(fromWiki)}% Wiktionary, ${pct(fromMachine)}% ${by}, ` +
			`${pct(rows.length - fromWiki - fromMachine)}% none` +
			(read ? ` (${by} agrees on ${Math.round(agrees * 100)}%)` : '')
	);
	return (await stat(file)).size;
}

const manifest = await readFile(MANIFEST, 'utf8');
const listed = new Map(
	[...manifest.matchAll(/code: '([^']+)', slug: '([^']+)'/g)].map((m) => [m[1], m[2]])
);
const only = process.argv.slice(2);
const targets = WORDLIST_LANGUAGES.filter(
	(l) => listed.has(l.code) && (!only.length || only.includes(l.code))
);

console.log(`Transcribing ${targets.length} language(s)…`);
let updated = manifest;
// Four at a time: each one is a gunzip and a JSON parse, and the downloads are
// the slow part the first time round.
for (let i = 0; i < targets.length; i += 4) {
	const sizes = await Promise.all(
		targets.slice(i, i + 4).map(async (lang) => {
			try {
				return [lang, await buildLanguage(lang, listed.get(lang.code) as string)] as const;
			} catch (err) {
				console.error(`  ${lang.code} ${lang.name}: FAILED — ${(err as Error).message}`);
				return [lang, null] as const;
			}
		})
	);
	for (const [lang, bytes] of sizes) {
		if (bytes === null) continue;
		updated = updated.replace(
			new RegExp(`(code: '${lang.code}',[^\\n]*bytes: )\\d+`),
			`$1${bytes}`
		);
	}
}
await writeFile(MANIFEST, updated);
