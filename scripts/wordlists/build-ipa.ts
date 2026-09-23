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
 * Five sources, in this order, each used only for the words the ones before
 * it left empty:
 *
 *   - Wiktionary, through kaikki.org — a transcription a person wrote, with the
 *     stress where it belongs. The same dumps build.ts reads for meanings, but
 *     the gzipped per-language files: a tenth of the size, and the only part of
 *     them this needs is `sounds`. A word is also looked up under its other
 *     spellings (ipa-variants.ts): Russian "еще" is Wiktionary's "ещё".
 *   - Pronunciation dictionaries linguists made: NB Uttale for Norwegian
 *     (ipa-nb-uttale.ts), NST's lexicon for Danish (ipa-nst-danish.ts) and the
 *     Icelandic Pronunciation Dictionary (ipa-iceprondict.ts).
 *   - Wiktionary's romanisations and stress-marked spellings, read by rules
 *     (ipa-spelled.ts, ipa-translit.ts): they carry the vowels and stress the
 *     plain spelling leaves out, for Arabic, Hebrew, Persian, Hindi, Urdu,
 *     Bengali, Malayalam, Bulgarian, Lithuanian, Russian and Mandarin.
 *   - eSpeak NG, or for seven languages rules of our own (ipa-turkish.ts,
 *     ipa-rules.ts) — mostly for inflected forms ("hablamos"), which Wiktionary
 *     files under their lemma. Rules are good where the spelling is regular,
 *     and eSpeak's dictionaries cover the common irregulars of a word list.
 *   - goruut's word lists (ipa-goruut.ts), for what is left.
 *
 * Everything that guesses — the romanisation readers, the rules, eSpeak,
 * goruut — is used for a language only if it agrees with Wiktionary on the
 * words both cover (see TRUST). A missing pronunciation is better than a wrong
 * one said with confidence, so what none of them can read keeps an empty
 * column: chat abbreviations, slang, and a few hundred words across 53 lists.
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
import { iceprondict } from './ipa-iceprondict.ts';
import { goruut } from './ipa-goruut.ts';
import { syllableStress } from './ipa-stress.ts';
import { russianVariants, vietnameseVariants } from './ipa-variants.ts';
import { spelledFor, type Spelled } from './ipa-spelled.ts';
import {
	arabicIpa,
	bengaliIpa,
	bulgarianIpa,
	chineseIpa,
	hebrewIpa,
	hebrewPointedIpa,
	hindustaniIpa,
	lithuanianIpa,
	malayalamIpa,
	persianIpa,
	russianIpa
} from './ipa-translit.ts';
import {
	albanianIpa,
	estonianIpa,
	galicianIpa,
	georgianIpa,
	koreanIpa,
	malayIpa
} from './ipa-rules.ts';

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
	 * A word no source has is read as the run of shorter words it is written
	 * with, each from whichever source has it: Chinese 所有人 is 所有 and 人.
	 */
	compose?: boolean;
	/** Other spellings to look the word up under in Wiktionary (ipa-variants.ts). */
	variants?: (word: string) => string[];
	/**
	 * Reads Wiktionary's romanisation or stress-marked spelling of a word
	 * (ipa-spelled.ts) as IPA, for the words it gives no IPA of their own.
	 */
	spelled?: (s: Spelled) => string | null;
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
	ar: { espeak: null, spelled: arabicIpa },
	bg: { espeak: 'bg', spelled: bulgarianIpa },
	bn: { espeak: 'bn', spelled: bengaliIpa },
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
	fa: { espeak: 'fa', prefer: ['Iranian-Persian', 'Iran'], spelled: persianIpa },
	fi: { espeak: 'fi' },
	fr: { espeak: 'fr-fr', prefer: ['France'] },
	gl: { espeak: null, rules: galicianIpa },
	// The romanisation where there is one; the vowel points otherwise.
	he: {
		espeak: null,
		prefer: ['Modern-Israeli-Hebrew'],
		spelled: (s) => hebrewIpa(s) ?? hebrewPointedIpa(s)
	},
	hi: { espeak: 'hi', spelled: hindustaniIpa },
	hr: { espeak: 'sr' },
	hu: { espeak: 'hu' },
	hy: { espeak: 'hy', prefer: ['Eastern-Armenian'] },
	id: { espeak: 'id' },
	is: {
		espeak: 'is',
		lexicon: { name: 'Icelandic Pronunciation Dictionary', read: iceprondict, trusted: true }
	},
	it: { espeak: 'it' },
	ka: { espeak: 'ka', rules: georgianIpa },
	kk: { espeak: 'kk' },
	ko: { espeak: 'ko', prefer: ['Seoul'], rules: koreanIpa },
	lt: { espeak: 'lt', spelled: lithuanianIpa },
	lv: { espeak: 'lv' },
	mk: { espeak: 'mk' },
	ml: { espeak: 'ml', spelled: malayalamIpa },
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
	// Wiktionary writes stressed "ё" after a soft consonant [ɵ], which is the
	// same vowel as /o/ there; and "ы" is sometimes [ɨ], sometimes [ɨ̞].
	ru: {
		espeak: 'ru',
		variants: russianVariants,
		spelled: russianIpa,
		same: [[/ɵ/g, 'o']]
	},
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
	ur: { espeak: 'ur', spelled: hindustaniIpa },
	vi: { espeak: 'vi', prefer: ['Hà-Nội'], variants: vietnameseVariants },
	// Pinyin read as IPA for words with pinyin and no IPA. Compared without
	// tone numbers: Wiktionary writes the sandhi ("²¹⁴⁻³⁵") and the pinyin
	// does not, and the tone itself comes from Wiktionary's pinyin anyway.
	zh: {
		espeak: null,
		require: ['Mandarin'],
		prefer: ['Standard-Chinese', 'Sinological-IPA'],
		spelled: chineseIpa,
		compose: true,
		same: [[/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻\s]/g, '']]
	}
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

/**
 * A word as the fewest pieces that each have a transcription, joined: the
 * longest words a source knows, not a character at a time where it can help.
 */
function composeFrom(chars: string[], piece: (p: string) => string | undefined) {
	const best: (string[] | null)[] = [[]];
	for (let j = 1; j <= chars.length; j++) {
		best[j] = null;
		for (let i = 0; i < j; i++) {
			const prev = best[i];
			const ipa = prev && piece(chars.slice(i, j).join(''));
			if (!prev || !ipa) continue;
			if (!best[j] || prev.length + 1 < (best[j] as string[]).length) best[j] = [...prev, ipa];
		}
	}
	const parts = best[chars.length];
	return parts && parts.length > 1
		? `/${parts.map((p) => p.replace(/^[/[]|[/\]]$/g, '')).join(' ')}/`
		: null;
}

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

	const accent = ACCENTS[lang.code];
	// Other spellings are looked up in the same pass; a word Wiktionary has
	// under another spelling takes that spelling's pronunciation.
	const variantsOf = new Map(
		[...words].map((w) => [w, accent?.variants ? accent.variants(w) : []])
	);
	// For composing: every shorter run of characters in every word.
	const parts = new Set<string>();
	if (accent?.compose)
		for (const w of words) {
			const cs = [...w];
			for (let i = 0; i < cs.length; i++)
				for (let j = i + 1; j <= cs.length; j++)
					if (j - i < cs.length) parts.add(cs.slice(i, j).join(''));
		}
	const found = await fromWiktionary(
		lang,
		new Set([...words, ...parts, ...[...variantsOf.values()].flat()])
	);
	const wiki = new Map<string, string>();
	for (const w of words) {
		const ipa =
			found.get(w) ??
			variantsOf
				.get(w)
				?.map((v) => found.get(v))
				.find(Boolean);
		if (ipa) wiki.set(w, ipa);
	}

	// A second dictionary, where there is one, goes before any guessing — held
	// to the same test, so a notation that drifts from Wiktionary's shows up.
	const lexicon = accent?.lexicon
		? await accent.lexicon.read(words, path.join(ROOT, '.cache/wordlists'))
		: new Map<string, string>();
	const lexAgrees = lexicon.size ? agreement((ws) => pick(lexicon, ws), wiki, accent?.same) : 0;
	const lexOk = lexAgrees >= TRUST || Boolean(accent?.lexicon?.trusted);
	const fromLex = new Map([...lexicon].filter(([w]) => !wiki.has(w) && lexOk));

	// Then Wiktionary's own romanisation or stressed spelling, read by rules.
	let fromSpelled = new Map<string, string>();
	let spelledAgrees = 0;
	if (accent?.spelled) {
		const glosses = new Map<string, string>([...[...parts].map((p) => [p, ''] as const)]);
		for (const r of rows) glosses.set(r[1].toLowerCase(), r[2] ?? '');
		const spelled = await spelledFor(await dumpFor(lang), glosses);
		const convert = accent.spelled;
		const all = new Map(
			[...spelled].flatMap(([w, candidates]) => {
				for (const c of candidates) {
					const ipa = convert(c);
					if (ipa) return [[w, ipa] as const];
				}
				return [];
			})
		);
		spelledAgrees = agreement((ws) => pick(all, ws), wiki, accent.same);
		if (spelledAgrees >= TRUST)
			fromSpelled = new Map(
				[...all].filter(([w]) => words.has(w) && !wiki.has(w) && !fromLex.has(w))
			);
		if (accent.compose && spelledAgrees >= TRUST) {
			// Pieces: whatever Wiktionary transcribes, then what its pinyin gives.
			const piece = (p: string) => found.get(p) ?? all.get(p);
			for (const w of words) {
				if (wiki.has(w) || fromSpelled.has(w)) continue;
				const ipa = composeFrom([...w], piece);
				if (ipa) fromSpelled.set(w, ipa);
			}
		}
	}

	const read = accent ? readerFor(accent) : null;
	const agrees = read ? agreement(read, wiki, accent?.same) : 0;
	const by = accent?.rules ? 'rules' : 'eSpeak';
	// A clitic cut off by the tokeniser with no vowel of its own ("'t", "c'")
	// is not a word eSpeak can read: it spells the letter. An elided word with
	// one ("dell'", "quell'") it reads as it is said.
	const missing = [...words].filter(
		(w) =>
			!wiki.has(w) &&
			!fromLex.has(w) &&
			!fromSpelled.has(w) &&
			!/^['’]/.test(w) &&
			!(/['’]$/.test(w) && !/[aeiouàèéìòù]/.test(w))
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
	let fromSpell = 0;
	let fromMachine = 0;
	let fromLast = 0;
	const out = ['rank\tword\tenglish\tipa'];
	for (const [rank, word, english] of rows) {
		const key = word.toLowerCase();
		const ipa =
			wiki.get(key) ??
			fromLex.get(key) ??
			fromSpelled.get(key) ??
			machine.get(key) ??
			last.get(key) ??
			'';
		if (wiki.has(key)) fromWiki++;
		else if (fromLex.has(key)) fromDict++;
		else if (fromSpelled.has(key)) fromSpell++;
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
			(accent?.spelled
				? `${pct(fromSpell)}% romanised (agrees on ${Math.round(spelledAgrees * 100)}%), `
				: '') +
			`${pct(fromMachine)}% ${by}` +
			(read ? ` (agrees on ${Math.round(agrees * 100)}%), ` : ', ') +
			(lastAgrees
				? `${pct(fromLast)}% goruut (agrees on ${Math.round(lastAgrees * 100)}%), `
				: '') +
			`${rows.length - fromWiki - fromDict - fromSpell - fromMachine - fromLast} words without`
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
