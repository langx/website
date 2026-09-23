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
 * Four sources, in this order:
 *
 *   - Wiktionary, through kaikki.org — a transcription a person wrote, with the
 *     stress where it belongs. The same dumps build.ts reads for meanings, but
 *     the gzipped per-language files: a tenth of the size, and the only part of
 *     them this needs is `sounds`.
 *   - For Norwegian and Danish, the pronunciation dictionaries linguists made
 *     for the National Library of Norway: NB Uttale (ipa-nb-uttale.ts) and
 *     NST's Danish lexicon (ipa-nst-danish.ts).
 *   - eSpeak NG, or for six languages rules of our own (ipa-turkish.ts,
 *     ipa-rules.ts), for the words Wiktionary has no transcription for —
 *     mostly inflected forms ("hablamos"), which Wiktionary files under their
 *     lemma. Rules are good where the spelling is regular, and eSpeak's
 *     dictionaries cover the common irregulars of a frequency list.
 *   - goruut's word lists (ipa-goruut.ts), for what is left.
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
import { nbUttale } from './ipa-nb-uttale.ts';
import { nstDanish } from './ipa-nst-danish.ts';
import { goruut } from './ipa-goruut.ts';
import { albanianIpa, estonianIpa, galicianIpa, georgianIpa, malayIpa } from './ipa-rules.ts';

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
	/**
	 * Rewrites of eSpeak's reading into the notation Wiktionary uses for the
	 * same sound — its German "ɜ" is everyone else's "ɐ" — or out of it, where
	 * what it marks it marks in the wrong place.
	 */
	fix?: [RegExp, string][];
	/**
	 * Spelling rules of our own, used instead of eSpeak where they read the
	 * language better. Held to the same test against Wiktionary.
	 */
	rules?: (word: string) => string | null;
	/**
	 * A pronunciation dictionary to fill the gaps before rules or eSpeak are
	 * asked, given the words wanted and the cache directory.
	 */
	/**
	 * Differences of notation only, for comparing this language's sources:
	 * applied to both sides of the agreement test, never to what is shown.
	 */
	same?: [RegExp, string][];
	lexicon?: {
		name: string;
		/**
		 * A lexicon linguists wrote, used whatever its agreement: the test
		 * then measures Wiktionary as much as it. Danish is the case — much of
		 * Wiktionary's Danish is spelling, "hage" /haːɡə/ for [ˈhaːə], and NST
		 * agrees on 54%; of the disagreements read by hand on 23 September 2026,
		 * NST was right or the word a homograph ("kvarter") in every one.
		 */
		trusted?: boolean;
		read: (words: Set<string>, cache: string) => Promise<Map<string, string>>;
	};
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
	// Wiktionary writes much Danish close to its spelling — "bakke" /bakə/,
	// "tur" /tuːr/ — where NST writes what is said, [ˈbɑɡə] and [ˈtuɐ̯ˀ]: a stop
	// after a vowel is unaspirated, and an "r" after one is a vowel. Those
	// count as the same when the two are compared.
	da: {
		espeak: 'da',
		fix: [[/ʔ/g, '']],
		lexicon: { name: 'NST', read: nstDanish, trusted: true },
		same: [
			[/(?<=[aeiouyæøœəɒʌ])p/g, 'b'],
			[/(?<=[aeiouyæøœəɒʌ])t/g, 'd'],
			[/(?<=[aeiouyæøœəɒʌ])k/g, 'g'],
			[/(?<=[aeiouyæøœəɒ])r/g, 'a'],
			[/ʌ/g, 'o'],
			[/ɣ/g, '']
		]
	},
	// "-er" as a vowel: eSpeak writes it "ɜ", Wiktionary and Duden "ɐ".
	de: { espeak: 'de', prefer: ['Standard'], fix: [[/ɜ/g, 'ɐ']] },
	el: { espeak: 'el' },
	en: { espeak: 'en-us', prefer: ['General-American', 'US'] },
	eo: { espeak: 'eo' },
	es: { espeak: 'es-419', prefer: ['Latin-America'] },
	// eSpeak writes Estonian "õ" as "ɵ" and doubles long vowels; the rules in
	// ipa-rules.ts read it as Wiktionary does.
	et: { espeak: 'et', rules: estonianIpa },
	eu: { espeak: 'eu' },
	fa: { espeak: 'fa', prefer: ['Iranian-Persian', 'Iran'] },
	fi: { espeak: 'fi' },
	fr: { espeak: 'fr-fr', prefer: ['France'] },
	gl: { espeak: null, rules: galicianIpa },
	he: { espeak: null, prefer: ['Modern-Israeli-Hebrew'] },
	hi: { espeak: 'hi' },
	hr: { espeak: 'sr' },
	hu: { espeak: 'hu' },
	hy: { espeak: 'hy', prefer: ['Eastern-Armenian'] },
	id: { espeak: 'id' },
	is: { espeak: 'is' },
	it: { espeak: 'it' },
	ka: { espeak: 'ka', rules: georgianIpa },
	kk: { espeak: 'kk' },
	ko: { espeak: 'ko', prefer: ['Seoul'] },
	lt: { espeak: 'lt' },
	lv: { espeak: 'lv' },
	mk: { espeak: 'mk' },
	ml: { espeak: 'ml' },
	ms: { espeak: 'ms', rules: malayIpa },
	nl: { espeak: 'nl', prefer: ['Netherlands'] },
	no: {
		espeak: 'nb',
		prefer: ['Urban-East-Norwegian'],
		lexicon: { name: 'NB Uttale', read: nbUttale, trusted: true }
	},
	pl: { espeak: 'pl' },
	// eSpeak's Brazilian notation, rewritten into Wiktionary's: "y" for an
	// unstressed final "i" (livre /ˈlivri/), "æ" for a final "ɐ", "x" for the
	// "rr" written "ʁ", a nasal vowel as vowel-plus-"ŋ" ("vindo" /ˈviŋdʊ/ for
	// /ˈvĩdu/), "aʊ" for "aw", "lj" for "lh" /ʎ/, and a "ə" after "r" that
	// Brazilian Portuguese does not have.
	pt: {
		espeak: 'pt-br',
		prefer: ['Brazil'],
		fix: [
			[/y/g, 'i'],
			[/æ/g, 'ɐ'],
			[/x/g, 'ʁ'],
			[/ɐ̃ʊ̃/g, 'ɐ̃w̃'],
			[/eɪŋ/g, 'ẽ'],
			[/([aeiouɐ])\u0303?ŋ(?![aeiouɐɛɔ])/g, '$1\u0303'],
			[/([aeiouɛɔ])ʊ/g, '$1w'],
			[/ʊ/g, 'u'],
			[/lj/g, 'ʎ'],
			[/ə/g, '']
		]
	},
	ro: { espeak: 'ro' },
	ru: { espeak: 'ru' },
	si: { espeak: 'si' },
	sk: { espeak: 'sk' },
	sl: { espeak: 'sl' },
	// eSpeak reads "ë" as /ʌ/ and "gj", "q" as /dʑ tɕ/.
	sq: { espeak: 'sq', rules: albanianIpa },
	sr: { espeak: 'sr' },
	sv: { espeak: 'sv', prefer: ['Central-Swedish'], fix: [[/ə/g, 'ɛ']] },
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
function fromEspeak(voice: string, words: string[], fix: [RegExp, string][] = []) {
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
			for (const [from, to] of fix) ipa = ipa.replace(from, to);
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
			// A syllabic consonant or a schwa before it: German "sitzen" is
			// /ˈzɪtsn̩/ in Wiktionary and /ˈzɪtsən/ in Duden.
			.replace(/ə(?=[nlm](?![aeiouyæøœəɔɛɜɞɘɵɶʏɯɨʉʌɤ]))/g, '')
			// Stress compared by the vowel it lands on, not by where the syllable
			// starts: "misˈteik" and "miˈsteik" stress the same vowel.
			.replace(/ˈ([^aeiouyæøœəɔɛɜɞɘɵɶʏɯɨʉʌɤ]*)/g, '$1ˈ')
			// A long consonant written twice or with a length mark: Telugu "amma"
			// is /amːa/ in Wiktionary and /amma/ in eSpeak.
			.replace(/(\p{L})\1+/gu, '$1')
	);
}

/** How many sample words eSpeak is checked against. */
const SAMPLE = 1000;
/**
 * The share of those it must get right, sound for sound, to be trusted with
 * the words Wiktionary does not cover. Measured on 23 September 2026:
 * Esperanto 100%, Finnish 98%, Serbo-Croatian 96%, French 93%, Portuguese 86%
 * and German 72% clear it — the last two once their notation is rewritten
 * (`fix`); Russian (17%) and Norwegian (42%) put the stress or the vowel wrong
 * too often. The rules in ipa-turkish.ts and ipa-rules.ts clear it too:
 * Georgian 94%, Albanian 90%, Estonian 85%, Turkish 81%, Galician 78% and
 * Malay 67%, where eSpeak managed at most 58%.
 */
const TRUST = 0.6;

/**
 * goruut's name for each language's word list (ipa-goruut.ts). Hebrew is
 * `hebrew3`, the list keyed by unvowelled spelling as the word lists are.
 */
const GORUUT: Record<string, string> = {
	af: 'afrikaans',
	ar: 'arabic',
	bg: 'bulgarian',
	bn: 'bengali',
	bs: 'bosnian',
	ca: 'catalan',
	cs: 'czech',
	da: 'danish',
	de: 'german',
	el: 'greek',
	en: 'english',
	eo: 'esperanto',
	es: 'spanish',
	et: 'estonian',
	eu: 'basque',
	fa: 'farsi',
	fi: 'finnish',
	fr: 'french',
	gl: 'galician',
	he: 'hebrew3',
	hi: 'hindi',
	hr: 'croatian',
	hu: 'hungarian',
	hy: 'armenian',
	id: 'indonesian',
	is: 'icelandic',
	it: 'italian',
	ka: 'georgian',
	ko: 'korean',
	lt: 'lithuanian',
	lv: 'latvian',
	mk: 'macedonian',
	ml: 'malayalam',
	ms: 'malay',
	nl: 'dutch',
	no: 'norwegian',
	pl: 'polish',
	pt: 'portuguese',
	ro: 'romanian',
	ru: 'russian',
	sk: 'slovak',
	sl: 'slovenian',
	sq: 'albanian',
	sr: 'serbian',
	sv: 'swedish',
	ta: 'tamil',
	te: 'telugu',
	tl: 'tagalog',
	tr: 'turkish',
	uk: 'ukrainian',
	ur: 'urdu',
	vi: 'vietnamese',
	zh: 'chinese'
};

/** The entries of a dictionary for these words, as a reader would return them. */
function pick(dict: Map<string, string>, words: string[]) {
	return new Map(words.flatMap((w) => (dict.has(w) ? [[w, dict.get(w) as string] as const] : [])));
}

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
	return voice ? (words: string[]) => fromEspeak(voice, words, accent.fix) : null;
}

/**
 * Whether the fallback reads this language well enough, judged on words
 * Wiktionary does transcribe. The words it would fill in are rarer forms of
 * the same spelling rules, so agreement here is the best estimate of accuracy
 * there.
 */
function agreement(
	read: (words: string[]) => Map<string, string>,
	wiki: Map<string, string>,
	same: [RegExp, string][] = []
) {
	const skel = (ipa: string, stress: boolean) =>
		same.reduce((s, [from, to]) => s.replace(from, to), skeleton(ipa, stress));
	const sample = [...wiki].filter((_, i) => i % Math.max(1, Math.floor(wiki.size / SAMPLE)) === 0);
	const guesses = read(sample.map(([w]) => w));
	let agreed = 0;
	for (const [w, ipa] of sample) {
		const guess = guesses.get(w);
		// A word of one syllable has nowhere else to put the stress, and
		// Wiktionary marks it on some of them and not others.
		const syllabic = skeleton(ipa, false).match(/[aeiouyæøœəɔɛɜɯɨʉʌɤ]+/g)?.length ?? 0;
		// Nor is a reading that makes no claim about stress marked down for it:
		// the Albanian and Georgian rules leave stress out, and the page shows
		// what they say, not what they do not.
		const marked = ipa.includes('ˈ') && syllabic > 1 && Boolean(guess?.includes('ˈ'));
		if (guess && skel(guess, marked) === skel(ipa, marked)) agreed++;
		// IPA_DEBUG=1 prints every disagreement, for tuning a language's notation.
		else if (process.env.IPA_DEBUG)
			console.log(
				`MISS\t${w}\t${ipa}\t${guess}\t${skel(ipa, marked)}\t${guess ? skel(guess, marked) : ''}`
			);
	}
	return sample.length ? agreed / sample.length : 0;
}

async function buildLanguage(lang: WordlistLanguage, slug: string) {
	const file = path.join(DATA, `${slug}.tsv`);
	const lines = (await readFile(file, 'utf8')).split('\n').filter(Boolean);
	const rows = lines.slice(1).map((l) => l.split('\t').slice(0, 3));
	const words = new Set(rows.map((r) => r[1].toLowerCase()));

	const wiki = await fromWiktionary(lang, words);
	const accent = ACCENTS[lang.code];

	// A second dictionary, where there is one, goes before any guessing — held
	// to the same test, so a notation that drifts from Wiktionary's shows up.
	const lexicon = accent?.lexicon
		? await accent.lexicon.read(words, path.join(ROOT, '.cache/wordlists'))
		: new Map<string, string>();
	const lexAgrees = lexicon.size ? agreement((ws) => pick(lexicon, ws), wiki, accent?.same) : 0;
	const lexOk = lexAgrees >= TRUST || Boolean(accent?.lexicon?.trusted);
	const fromLex = new Map([...lexicon].filter(([w]) => !wiki.has(w) && lexOk));

	const read = accent ? readerFor(accent) : null;
	const agrees = read ? agreement(read, wiki, accent?.same) : 0;
	const by = accent?.rules ? 'rules' : 'eSpeak';
	// A clitic cut off by the tokeniser ("'t", "c'") is not a word eSpeak can
	// read: it spells the letter.
	const missing = [...words].filter(
		(w) => !wiki.has(w) && !fromLex.has(w) && !/^['’]|['’]$/.test(w)
	);
	const machine = read && agrees >= TRUST ? read(missing) : new Map<string, string>();

	// Last, goruut's word lists, for whatever is still empty — and only where
	// the list agrees with Wiktionary as well as any other source must.
	const left = new Set(missing.filter((w) => !machine.has(w)));
	let last = new Map<string, string>();
	let lastAgrees = 0;
	if (left.size && GORUUT[lang.code]) {
		try {
			const raw = await goruut(GORUUT[lang.code], words, path.join(ROOT, '.cache/wordlists'));
			const list = new Map([...raw].map(([w, ipa]) => [w, `/${cleanEspeak(ipa)}/`]));
			lastAgrees = agreement((ws) => pick(list, ws), wiki, accent?.same);
			if (lastAgrees >= TRUST) last = new Map([...list].filter(([w]) => left.has(w)));
		} catch {
			// no list for this language
		}
	}

	let fromWiki = 0;
	let fromDict = 0;
	let fromMachine = 0;
	let fromLast = 0;
	const out = ['rank\tword\tenglish\tipa'];
	for (const [rank, word, english] of rows) {
		const key = word.toLowerCase();
		const ipa = wiki.get(key) ?? fromLex.get(key) ?? machine.get(key) ?? last.get(key) ?? '';
		if (wiki.has(key)) fromWiki++;
		else if (fromLex.has(key)) fromDict++;
		else if (machine.has(key)) fromMachine++;
		else if (ipa) fromLast++;
		out.push(`${rank}\t${word}\t${english ?? ''}\t${ipa}`);
	}
	await writeFile(file, out.join('\n') + '\n');
	const pct = (n: number) => Math.round((n / rows.length) * 100);
	console.log(
		`  ${lang.code} ${lang.name}: ${pct(fromWiki)}% Wiktionary, ` +
			(accent?.lexicon
				? `${pct(fromDict)}% ${accent.lexicon.name} (agrees on ${Math.round(lexAgrees * 100)}%), `
				: '') +
			`${pct(fromMachine)}% ${by}` +
			(read ? ` (agrees on ${Math.round(agrees * 100)}%), ` : ', ') +
			(lastAgrees
				? `${pct(fromLast)}% goruut (agrees on ${Math.round(lastAgrees * 100)}%), `
				: '') +
			`${rows.length - fromWiki - fromDict - fromMachine - fromLast} words without`
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
