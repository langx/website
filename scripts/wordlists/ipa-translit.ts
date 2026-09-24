/**
 * Reading Wiktionary's romanisations and stress-marked spellings (see
 * ipa-spelled.ts) as IPA. A romanisation already says what the plain spelling
 * leaves out — Hebrew and Arabic vowels, Hindi's dropped schwas, Russian and
 * Bulgarian stress — so what is left is a table per language, written to
 * Wiktionary's own IPA conventions for it. Each one is held to the usual test
 * in build-ipa.ts before it fills anything.
 *
 * A romanisation or spelling with a letter a table does not know gives null:
 * better an empty cell than a guess.
 */
import type { Spelled } from './ipa-spelled.ts';
import { syllableStress } from './ipa-stress.ts';

const ACUTE = '\u0301';
const GRAVE = '\u0300';
const TILDE = '\u0303';

/**
 * Longest match first through `table`; a vowel followed by an acute accent is
 * stressed, and gets "ˈ" before it for syllableStress() to move back.
 */
function read(text: string, table: Record<string, string>, vowels: string): string | null {
	// By decomposed length: "ā" is two code points once decomposed, and must
	// be tried before "a" or the macron is left over.
	const keys = Object.keys(table).sort(
		(a, b) => b.normalize('NFD').length - a.normalize('NFD').length
	);
	const s = text.normalize('NFD');
	let out = '';
	for (let i = 0; i < s.length; ) {
		if (s[i] === ACUTE) {
			i++;
			continue;
		}
		const key = keys.find((k) => s.startsWith(k.normalize('NFD'), i));
		if (!key) return null;
		const len = key.normalize('NFD').length;
		const stressed = s[i + len] === ACUTE && vowels.includes(key[0]);
		out += (stressed ? 'ˈ' : '') + table[key];
		i += len;
	}
	return `/${syllableStress(out)}/`;
}

/** Hyphens, spaces and the like that romanisations use between morphemes. */
const clean = (roman: string) => roman.toLowerCase().replace(/[-‐.\s]/g, '');

// — Hebrew ————————————————————————————————————————————————————————————

const HE: Record<string, string> = {
	a: 'a',
	e: 'e',
	i: 'i',
	o: 'o',
	u: 'u',
	b: 'b',
	v: 'v',
	g: 'ɡ',
	d: 'd',
	h: 'h',
	w: 'w',
	z: 'z',
	kh: 'χ',
	t: 't',
	y: 'j',
	k: 'k',
	l: 'l',
	m: 'm',
	n: 'n',
	s: 's',
	p: 'p',
	f: 'f',
	ts: 't͡s',
	tz: 't͡s',
	q: 'k',
	r: 'ʁ',
	sh: 'ʃ',
	ch: 't͡ʃ',
	zh: 'ʒ',
	j: 'd͡ʒ',
	"'": 'ʔ',
	ʼ: 'ʔ',
	ʻ: 'ʔ',
	// Older, Biblical-style romanisations Wiktionary keeps on some entries.
	ḥ: 'χ',
	ḵ: 'χ',
	ḳ: 'k',
	ṭ: 't',
	ṣ: 't͡s',
	ś: 's',
	š: 'ʃ',
	ṯ: 't',
	ḏ: 'd',
	ḇ: 'v',
	ḡ: 'ɡ',
	ā: 'a',
	ă: 'a',
	â: 'a',
	ē: 'e',
	ə: 'e',
	ɛ: 'e',
	ī: 'i',
	î: 'i',
	ō: 'o',
	ô: 'o',
	ŏ: 'o',
	ɔ: 'o',
	ū: 'u',
	c: 't͡s',
	ʿ: 'ʔ',
	ʾ: 'ʔ',
	ʕ: 'ʔ',
	ʔ: 'ʔ'
};

/**
 * Modern Hebrew from Wiktionary's romanisation, which marks the stress:
 * "yadá'ti" /jaˈdaʔti/. The glottal stop is kept where it is written, as
 * Wiktionary's own IPA keeps it.
 */
export function hebrewIpa({ roman }: Spelled): string | null {
	// An apostrophe after a consonant only parts two letters that would
	// otherwise read as one sound, "ts'rikhá" /t͡sʁiˈχa/; elsewhere it is a
	// glottal stop, "'ómer" /ˈʔomeʁ/.
	return roman
		? read(clean(roman).replace(/(?<=[bcdfghklmnpqrstvwxyzšṣṭḥḵ])'/g, ''), HE, 'aeiou')
		: null;
}

// — Arabic ————————————————————————————————————————————————————————————

const AR: Record<string, string> = {
	a: 'a',
	i: 'i',
	u: 'u',
	e: 'e',
	o: 'o',
	ā: 'aː',
	ī: 'iː',
	ū: 'uː',
	ē: 'eː',
	ō: 'oː',
	ʔ: 'ʔ',
	ʕ: 'ʕ',
	b: 'b',
	t: 't',
	ṯ: 'θ',
	j: 'd͡ʒ',
	ḥ: 'ħ',
	ḵ: 'x',
	d: 'd',
	ḏ: 'ð',
	r: 'r',
	z: 'z',
	s: 's',
	š: 'ʃ',
	ṣ: 'sˤ',
	ḍ: 'dˤ',
	ṭ: 'tˤ',
	ẓ: 'ðˤ',
	ḡ: 'ɣ',
	f: 'f',
	q: 'q',
	k: 'k',
	l: 'l',
	m: 'm',
	n: 'n',
	h: 'h',
	w: 'w',
	y: 'j',
	g: 'ɡ',
	p: 'p',
	v: 'v',
	č: 't͡ʃ',
	ʾ: 'ʔ',
	'‘': 'ʕ'
};

/**
 * Modern Standard Arabic from Wiktionary's romanisation, which writes every
 * vowel the script leaves out: "ʔaqsama" /ʔaqsama/. Unstressed, as
 * Wiktionary writes Arabic.
 */
export function arabicIpa({ roman }: Spelled): string | null {
	return roman ? read(clean(roman), AR, '') : null;
}

// — Persian ———————————————————————————————————————————————————————————

const FA: Record<string, string> = {
	â: 'ɒː',
	a: 'æ',
	e: 'e',
	o: 'o',
	i: 'iː',
	u: 'uː',
	ey: 'ej',
	ow: 'ow',
	b: 'b',
	p: 'p',
	t: 't',
	s: 's',
	j: 'd͡ʒ',
	ch: 't͡ʃ',
	h: 'h',
	kh: 'x',
	x: 'x',
	š: 'ʃ',
	ž: 'ʒ',
	č: 't͡ʃ',
	ġ: 'ɢ',
	d: 'd',
	z: 'z',
	r: 'ɾ',
	zh: 'ʒ',
	sh: 'ʃ',
	gh: 'ɢ',
	q: 'ɢ',
	f: 'f',
	k: 'k',
	g: 'ɡ',
	l: 'l',
	m: 'm',
	n: 'n',
	v: 'v',
	w: 'v',
	y: 'j',
	"'": 'ʔ',
	ʼ: 'ʔ',
	ʻ: 'ʔ',
	// The Classical romanisation, read the Iranian way, where it is all there is.
	ā: 'ɒː',
	ī: 'iː',
	ū: 'uː',
	ō: 'uː',
	ē: 'iː',
	ô: 'o',
	ê: 'e',
	ĭ: 'e',
	ŭ: 'o',
	û: 'uː',
	ʿ: 'ʔ',
	ʾ: 'ʔ'
};

/**
 * Iranian Persian from Wiktionary's romanisation: "farzand-ân" /fæɾzændɒːn/.
 * Where it gives the Classical reading too, the Iranian one, which it always
 * gives last: "xudā / xodâ", "čarxa / čarxe".
 */
export function persianIpa({ roman, romans }: Spelled): string | null {
	const iranian = (romans?.at(-1) ?? roman)?.split(/\s*[/,]\s*/).at(-1);
	return iranian ? read(clean(iranian), FA, '') : null;
}

// — Hindi and Urdu ————————————————————————————————————————————————————

const HINDUSTANI: Record<string, string> = {
	a: 'ə',
	ā: 'ɑː',
	i: 'ɪ',
	ī: 'iː',
	u: 'ʊ',
	ū: 'uː',
	e: 'eː',
	ai: 'ɛː',
	o: 'oː',
	au: 'ɔː',
	ṛ: 'ɽ',
	ṛh: 'ɽʱ',
	k: 'k',
	kh: 'kʰ',
	g: 'ɡ',
	gh: 'ɡʱ',
	ṅ: 'ŋ',
	c: 't͡ʃ',
	ch: 't͡ʃʰ',
	j: 'd͡ʒ',
	jh: 'd͡ʒʱ',
	ñ: 'ɲ',
	ṭ: 'ʈ',
	ṭh: 'ʈʰ',
	ḍ: 'ɖ',
	ḍh: 'ɖʱ',
	ṇ: 'ɳ',
	t: 't̪',
	th: 't̪ʰ',
	d: 'd̪',
	dh: 'd̪ʱ',
	n: 'n',
	p: 'p',
	ph: 'pʰ',
	b: 'b',
	bh: 'bʱ',
	m: 'm',
	y: 'j',
	r: 'ɾ',
	l: 'l',
	v: 'ʋ',
	w: 'ʋ',
	ś: 'ʃ',
	š: 'ʃ',
	ṣ: 'ʂ',
	s: 's',
	h: 'ɦ',
	q: 'q',
	x: 'x',
	ġ: 'ɣ',
	z: 'z',
	ž: 'ʒ',
	f: 'f',
	ṃ: '̃',
	ṁ: '̃',
	ṉ: '̃',
	[TILDE]: '̃',
	ʻ: '',
	ʼ: '',
	"'": '',
	ō: 'oː',
	ē: 'eː',
	ŏ: 'ɔ',
	ŕ: 'ɾ',
	ḥ: 'ɦ',
	ḵ: 'x',
	ğ: 'ɣ',
	č: 't͡ʃ',
	ẓ: 'z',
	ẕ: 'z',
	'\u0360': '\u0303', // a double tilde, for a nasal diphthong
	'\u0324': '', // breathy-voice mark
	ʿ: '',
	'‘': '',
	'’': ''
};

/**
 * Hindi and Urdu from Wiktionary's romanisation, which already drops the
 * schwas that are not said: "samandar" /səmənd̪əɾ/, "mīṭar" /miːʈəɾ/.
 */
export function hindustaniIpa({ roman }: Spelled): string | null {
	return roman ? read(clean(roman), HINDUSTANI, '') : null;
}

// — Bengali ———————————————————————————————————————————————————————————

const BN: Record<string, string> = {
	a: 'a',
	o: 'o',
	ô: 'ɔ',
	i: 'i',
	ī: 'i',
	u: 'u',
	ū: 'u',
	e: 'e',
	ê: 'æ',
	æ: 'æ',
	oi: 'oi̯',
	ou: 'ou̯',
	k: 'k',
	kh: 'kʰ',
	g: 'ɡ',
	gh: 'ɡʱ',
	ṅ: 'ŋ',
	ng: 'ŋ',
	c: 't͡ʃ',
	ch: 't͡ʃʰ',
	j: 'd͡ʒ',
	jh: 'd͡ʒʱ',
	ñ: 'n',
	ṭ: 'ʈ',
	ṭh: 'ʈʰ',
	ḍ: 'ɖ',
	ḍh: 'ɖʱ',
	ṛ: 'ɾ',
	ṛh: 'ɾ',
	ṇ: 'n',
	t: 't̪',
	th: 't̪ʰ',
	d: 'd̪',
	dh: 'd̪ʱ',
	n: 'n',
	p: 'p',
	ph: 'pʰ',
	f: 'f',
	b: 'b',
	bh: 'bʱ',
	v: 'bʱ',
	m: 'm',
	y: 'j',
	r: 'ɾ',
	l: 'l',
	ś: 'ʃ',
	sh: 'ʃ',
	ṣ: 'ʃ',
	s: 's',
	h: 'h',
	ḥ: 'h',
	z: 'd͡ʒ',
	w: 'w',
	ṃ: 'ŋ',
	ṁ: 'ŋ',
	[TILDE]: '̃',
	ā: 'a',
	ō: 'o',
	ē: 'e',
	ẏ: 'j',
	ẇ: 'w',
	ţ: 'ʈ',
	ḑ: 'ɖ',
	ḓ: 'ɖ',
	ŗ: 'ɾ',
	ŕ: 'ɾ',
	ɾ: 'ɾ',
	q: 'k',
	ʰ: 'ʰ',
	'\u0325': ''
};

/** Bengali from Wiktionary's romanisation, which is written as it is said: "hobe" /hobe/. */
export function bengaliIpa({ roman }: Spelled): string | null {
	return roman ? read(clean(roman), BN, '') : null;
}

// — Malayalam —————————————————————————————————————————————————————————

const ML: Record<string, string> = {
	a: 'ɐ',
	ā: 'aː',
	i: 'i',
	ī: 'iː',
	u: 'u',
	ū: 'uː',
	ŭ: 'ɨ',
	e: 'e',
	ē: 'eː',
	ai: 'ɐi̯',
	o: 'o',
	ō: 'oː',
	au: 'ɐu̯',
	ṛ: 'rɨ',
	k: 'k',
	kh: 'kʰ',
	g: 'ɡ',
	gh: 'ɡʱ',
	ṅ: 'ŋ',
	c: 't͡ʃ',
	ch: 't͡ʃʰ',
	j: 'd͡ʒ',
	jh: 'd͡ʒʱ',
	ñ: 'ɲ',
	ṭ: 'ʈ',
	ṭh: 'ʈʰ',
	ḍ: 'ɖ',
	ḍh: 'ɖʱ',
	ṇ: 'ɳ',
	t: 't̪',
	th: 't̪ʰ',
	d: 'd̪',
	dh: 'd̪ʱ',
	n: 'n',
	ṉ: 'n',
	p: 'p',
	ph: 'pʰ',
	b: 'b',
	bh: 'bʱ',
	m: 'm',
	y: 'j',
	r: 'ɾ',
	ṟ: 'r',
	ṯ: 't',
	l: 'l',
	ḷ: 'ɭ',
	ḻ: 'ɻ',
	v: 'ʋ',
	ś: 'ʃ',
	ṣ: 'ʂ',
	s: 's',
	h: 'h',
	ṁ: 'm',
	ṃ: 'm',
	ḥ: 'h',
	f: 'f',
	z: 'z',
	'\u0325': ''
};

/** Malayalam from Wiktionary's ISO 15919 romanisation: "nāśaṁ" /naːʃɐm/. */
export function malayalamIpa({ roman }: Spelled): string | null {
	return roman ? read(clean(roman), ML, '') : null;
}

// — Bulgarian —————————————————————————————————————————————————————————

const BG_VOWELS = 'аъоуеияю';
const BG_SOFT = 'еиьяю';
const BG_DEVOICE: Record<string, string> = { б: 'п', в: 'ф', г: 'к', д: 'т', ж: 'ш', з: 'с' };
const BG: Record<string, string> = {
	б: 'b',
	в: 'v',
	г: 'ɡ',
	д: 'd',
	ж: 'ʒ',
	з: 'z',
	й: 'j',
	к: 'k',
	м: 'm',
	н: 'n',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	ф: 'f',
	х: 'x',
	ц: 't͡s',
	ч: 't͡ʃ',
	ш: 'ʃ',
	щ: 'ʃt',
	ь: 'ʲ'
};

/**
 * Bulgarian from Wiktionary's stress-marked spelling, "е́зерото" [ˈɛzɛroto]:
 * an unstressed "а ъ" is /ɐ/ and an unstressed "о" /o/, "л" is dark before a
 * back vowel, and a voiced consonant at the end of a word is said voiceless.
 * A word of two syllables or more with no stress mark is not read.
 */
export function bulgarianIpa({ canon }: Spelled): string | null {
	if (!canon) return null;
	const s = canon.toLowerCase().normalize('NFD').replace(new RegExp(GRAVE, 'g'), ACUTE);
	const letters: { c: string; stressed: boolean }[] = [];
	for (const ch of s) {
		if (ch === ACUTE) {
			if (letters.length) letters[letters.length - 1].stressed = true;
		} else letters.push({ c: ch.normalize('NFC'), stressed: false });
	}
	const syllables = letters.filter((l) => BG_VOWELS.includes(l.c)).length;
	if (!syllables || (syllables > 1 && !letters.some((l) => l.stressed))) return null;

	let out = '';
	letters.forEach(({ c, stressed }, i) => {
		const prev = letters[i - 1]?.c;
		const next = letters[i + 1]?.c;
		const afterCons =
			prev !== undefined && !BG_VOWELS.includes(prev) && prev !== 'ь' && prev !== 'й';
		if (stressed && syllables > 1) out += 'ˈ';
		switch (c) {
			case 'а':
				out += stressed ? 'a' : 'ɐ';
				break;
			case 'ъ':
				out += stressed ? 'ɤ' : 'ɐ';
				break;
			case 'о':
				out += stressed ? 'ɔ' : 'o';
				break;
			case 'у':
				out += 'u';
				break;
			case 'е':
				out += 'ɛ';
				break;
			case 'и':
				out += 'i';
				break;
			case 'я':
				out += (afterCons ? 'ʲ' : 'j') + (stressed ? 'a' : 'ɐ');
				break;
			case 'ю':
				out += (afterCons ? 'ʲ' : 'j') + 'u';
				break;
			case 'л':
				out += next && BG_SOFT.includes(next) ? 'l' : 'ɫ';
				break;
			case 'д':
				if (next === 'ж') {
					out += 'd͡ʒ';
					letters[i + 1].c = '';
					break;
				}
			// falls through
			default: {
				if (c === '') break;
				const final = i === letters.length - 1 && BG_DEVOICE[c];
				const sound = BG[final || c];
				if (sound === undefined) {
					out += '\u0000'; // unknown letter: poisons the result below
					break;
				}
				out += sound;
			}
		}
	});
	if (out.includes('\u0000')) return null;
	return `/${syllableStress(out)}/`;
}

// — Lithuanian ————————————————————————————————————————————————————————

const LT_LONG: Record<string, string> = {
	ą: 'aː',
	ę: 'æː',
	ė: 'eː',
	į: 'iː',
	y: 'iː',
	ų: 'uː',
	ū: 'uː',
	o: 'oː'
};
const LT_CONS: Record<string, string> = {
	b: 'b',
	c: 't͡s',
	č: 't͡ʃ',
	d: 'd',
	f: 'f',
	g: 'ɡ',
	h: 'ɣ',
	j: 'j',
	k: 'k',
	l: 'l',
	m: 'm',
	n: 'n',
	p: 'p',
	r: 'r',
	s: 's',
	š: 'ʃ',
	t: 't',
	v: 'v',
	z: 'z',
	ž: 'ʒ'
};

/**
 * Lithuanian from Wiktionary's accented spelling, which marks the stressed
 * syllable ("kàs", "vãkaras"): "a e" are long under an acute or circumflex
 * accent and short otherwise, "ie uo" are diphthongs, "ch" is /x/, "dž"
 * /d͡ʒ/, and an "i" between a consonant and a vowel only softens the
 * consonant. The pitch accent itself is not written.
 */
export function lithuanianIpa({ canon }: Spelled): string | null {
	if (!canon) return null;
	const s = canon.toLowerCase().normalize('NFD');
	const letters: { c: string; accent: string }[] = [];
	for (const ch of s) {
		if (ch === ACUTE || ch === GRAVE || ch === TILDE) {
			if (letters.length) letters[letters.length - 1].accent = ch;
		} else if (ch === '\u0307' && /^[iį]/.test(letters[letters.length - 1]?.c ?? '')) {
			// The dot an accented "i" keeps in Lithuanian print: "mi̇̀rus".
		} else if (/\p{M}/u.test(ch)) {
			// an ogonek or a dot belongs to the letter: put it back
			if (letters.length)
				letters[letters.length - 1].c = (letters[letters.length - 1].c + ch).normalize('NFC');
		} else letters.push({ c: ch, accent: '' });
	}
	const isV = (c?: string) => c !== undefined && /[aeiouyąęėįųū]/.test(c);
	if (!letters.some((l) => isV(l.c))) return null;
	const vowels = letters.filter((l) => isV(l.c)).length;
	if (vowels > 1 && !letters.some((l) => l.accent)) return null;

	let out = '';
	for (let i = 0; i < letters.length; i++) {
		const { c, accent } = letters[i];
		const next = letters[i + 1];
		const mark = accent && vowels > 1 ? 'ˈ' : '';
		const two = c + (next?.c ?? '');
		// The accent of a diphthong sits on either half; the mark goes before it.
		const diphthongAccent = accent || next?.accent ? 'ˈ' : '';
		if (two === 'ch') {
			out += 'x';
			i++;
		} else if (two === 'dž') {
			out += 'd͡ʒ';
			i++;
		} else if (two === 'dz') {
			out += 'd͡z';
			i++;
		} else if (two === 'ie' || two === 'uo') {
			out += (vowels > 1 ? diphthongAccent : '') + (two === 'ie' ? 'iə' : 'uə');
			i++;
		} else if (/^(ai|ei|au|ui)$/.test(two)) {
			out += (vowels > 1 ? diphthongAccent : '') + { ai: 'ɐɪ', ei: 'ɛɪ', au: 'ɐʊ', ui: 'ʊɪ' }[two];
			i++;
		} else if (c === 'i' && i > 0 && !isV(letters[i - 1].c) && isV(next?.c) && !accent) {
			out += 'ʲ';
		} else if (isV(c)) {
			if (c in LT_LONG) out += mark + LT_LONG[c];
			else if (c === 'a') out += mark + (accent === ACUTE || accent === TILDE ? 'aː' : 'ɐ');
			else if (c === 'e') out += mark + (accent === ACUTE || accent === TILDE ? 'æː' : 'ɛ');
			else if (c === 'i') out += mark + 'ɪ';
			else if (c === 'u') out += mark + 'ʊ';
			else return null;
		} else if (c in LT_CONS) out += LT_CONS[c];
		else return null;
	}
	return `/${syllableStress(out)}/`;
}

// — Russian ———————————————————————————————————————————————————————————

const RU_VOWELS = 'аеёиоуыэюя';
const RU_SOFTENING = 'еёиюяь';
const RU_HARD_ONLY = 'жшц';
const RU_SOFT_ONLY = 'чщй';
const RU_DEVOICE: Record<string, string> = { б: 'п', в: 'ф', г: 'к', д: 'т', ж: 'ш', з: 'с' };
const RU_CONS: Record<string, string> = {
	б: 'b',
	в: 'v',
	г: 'ɡ',
	д: 'd',
	ж: 'ʐ',
	з: 'z',
	й: 'j',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	ф: 'f',
	х: 'x',
	ц: 't͡s',
	ч: 't͡ɕ',
	ш: 'ʂ',
	щ: 'ɕː'
};

/**
 * Russian from Wiktionary's stress-marked spelling, "кото́рые" /kɐˈtorɨjɪ/:
 * a consonant is soft before "е ё и ю я ь"; an unstressed "о а" is /ɐ/ just
 * before the stress or at the start of a word and /ə/ elsewhere, and after a
 * soft consonant /ɪ/; the "г" of "-ого, -его" is /v/; a voiced consonant at
 * the end of a word is said voiceless. "ё" is always stressed.
 */
export function russianIpa({ canon }: Spelled): string | null {
	if (!canon) return null;
	const s = canon
		.toLowerCase()
		.normalize('NFD')
		.replace(/\u0300/g, ACUTE);
	const letters: { c: string; stressed: boolean }[] = [];
	for (const ch of s) {
		if (ch === ACUTE) {
			if (letters.length) letters[letters.length - 1].stressed = true;
		} else if (ch === '\u0308' && letters.length) {
			letters[letters.length - 1] = { c: 'ё', stressed: true }; // е + diaeresis
		} else if (ch === '\u0306' && letters.length) {
			letters[letters.length - 1].c = 'й'; // и + breve
		} else letters.push({ c: ch.normalize('NFC'), stressed: false });
	}
	const vowelAt = letters.flatMap((l, i) => (RU_VOWELS.includes(l.c) ? [i] : []));
	if (!vowelAt.length) return null;
	let stressAt = letters.findIndex((l) => l.stressed || l.c === 'ё');
	if (stressAt < 0) {
		if (vowelAt.length > 1) return null;
		stressAt = vowelAt[0];
	}
	const word = letters.map((l) => l.c).join('');
	// The genitive ending: "которого" /kɐˈtorəvə/, "его" /jɪˈvo/.
	const ogo = /[ое]го$/.test(word) ? letters.length - 2 : -1;
	const pretonic = vowelAt[vowelAt.indexOf(stressAt) - 1];

	let out = '';
	for (let i = 0; i < letters.length; i++) {
		const { c } = letters[i];
		const prev = letters[i - 1]?.c;
		const next = letters[i + 1]?.c;
		if (RU_VOWELS.includes(c)) {
			const stressed = i === stressAt;
			const afterSoftOnly = prev !== undefined && 'чщ'.includes(prev);
			const iotated =
				'еёюя'.includes(c) &&
				(prev === undefined || RU_VOWELS.includes(prev) || prev === 'ъ' || prev === 'ь');
			const glide = iotated ? 'j' : '';
			if (stressed && vowelAt.length > 1) out += 'ˈ';
			if (stressed) {
				out +=
					glide +
					(
						{
							а: 'a',
							о: 'o',
							у: 'u',
							ы: 'ɨ',
							э: 'ɛ',
							е: 'e',
							ё: 'o',
							и: 'i',
							ю: 'u',
							я: 'a'
						} as Record<string, string>
					)[c];
				continue;
			}
			const strong = i === pretonic || i === 0 || (iotated && i === vowelAt[0]);
			let v: string;
			if ('ао'.includes(c)) v = afterSoftOnly ? 'ɪ' : strong ? 'ɐ' : 'ə';
			else if ('еяё'.includes(c)) v = i === letters.length - 1 && c === 'я' ? 'ə' : 'ɪ';
			else if (c === 'э') v = 'ɨ';
			else if (c === 'и') v = RU_HARD_ONLY.includes(prev ?? '') ? 'ɨ' : 'ɪ';
			else if (c === 'ы') v = 'ɨ';
			else v = 'ʊ'; // у, ю
			out += glide + v;
			continue;
		}
		if (c === 'ь') {
			if (!out.endsWith('ʲ') && !/[ʐʂɕj]$|t͡ɕ$/.test(out)) out += 'ʲ';
			continue;
		}
		if (c === 'ъ') continue;
		let key = c;
		if (i === ogo) key = 'в';
		if (i === letters.length - 1 && RU_DEVOICE[c]) key = RU_DEVOICE[c];
		const sound = RU_CONS[key];
		if (sound === undefined) return null;
		const soft =
			next !== undefined &&
			RU_SOFTENING.includes(next) &&
			!RU_HARD_ONLY.includes(c) &&
			!RU_SOFT_ONLY.includes(c);
		out += sound + (soft && next !== 'ь' ? 'ʲ' : '');
	}
	return `/${syllableStress(out)}/`;
}

// — Mandarin ——————————————————————————————————————————————————————————

const ZH_INITIALS: [string, string][] = [
	['zh', 'ʈ͡ʂ'],
	['ch', 'ʈ͡ʂʰ'],
	['sh', 'ʂ'],
	['b', 'p'],
	['p', 'pʰ'],
	['m', 'm'],
	['f', 'f'],
	['d', 't'],
	['t', 'tʰ'],
	['n', 'n'],
	['l', 'l'],
	['g', 'k'],
	['k', 'kʰ'],
	['h', 'x'],
	['j', 't͡ɕ'],
	['q', 't͡ɕʰ'],
	['x', 'ɕ'],
	['r', 'ʐ'],
	['z', 't͡s'],
	['c', 't͡sʰ'],
	['s', 's'],
	['y', ''],
	['w', '']
];

/** Finals in Wiktionary's Sinological IPA, keyed by their spelling after the initial. */
const ZH_FINALS: Record<string, string> = {
	a: 'a',
	o: 'u̯ɔ',
	e: 'ɤ',
	ai: 'aɪ̯',
	ei: 'eɪ̯',
	ao: 'ɑʊ̯',
	ou: 'oʊ̯',
	an: 'an',
	en: 'ən',
	ang: 'ɑŋ',
	eng: 'ɤŋ',
	ong: 'ʊŋ',
	er: 'ɑɻ',
	i: 'i',
	ia: 'i̯a',
	ie: 'i̯ɛ',
	iao: 'i̯ɑʊ̯',
	iu: 'i̯oʊ̯',
	ian: 'i̯ɛn',
	in: 'in',
	iang: 'i̯ɑŋ',
	ing: 'iŋ',
	iong: 'i̯ʊŋ',
	u: 'u',
	ua: 'u̯a',
	uo: 'u̯ɔ',
	uai: 'u̯aɪ̯',
	ui: 'u̯eɪ̯',
	uan: 'u̯an',
	un: 'u̯ən',
	uang: 'u̯ɑŋ',
	ü: 'y',
	üe: 'y̯ɛ',
	üan: 'y̯ɛn',
	ün: 'yn'
};

/** The finals "y-" and "w-" spell out: "ya" is final "ia", "wu" is "u", "yu" is "ü". */
const ZH_GLIDE: Record<string, Record<string, string>> = {
	y: { i: 'i', in: 'in', ing: 'iŋ', u: 'ü', ue: 'üe', uan: 'üan', un: 'ün' },
	w: { u: 'u' }
};

const ZH_TONES: Record<string, string> = {
	'̄': '⁵⁵',
	'́': '³⁵',
	'̌': '²¹⁴',
	'̀': '⁵¹'
};

/** One pinyin syllable, tone mark removed, as IPA; null if it is not one. */
function zhSyllable(syl: string): string | null {
	const init = ZH_INITIALS.find(([p]) => syl.startsWith(p));
	let rest = init ? syl.slice(init[0].length) : syl;
	const initial = init?.[1] ?? '';
	if (init && (init[0] === 'y' || init[0] === 'w')) {
		const spelled = ZH_GLIDE[init[0]][rest];
		rest = spelled ?? (init[0] === 'y' ? `i${rest}` : `u${rest}`);
		rest = rest.replace(/^ii/, 'i').replace(/^uu/, 'u');
		if (init[0] === 'y' && rest === 'io') rest = 'i';
		if (rest === 'ie' || ZH_FINALS[rest]) return ZH_FINALS[rest] ?? null;
		return ZH_FINALS[rest] ?? null;
	}
	// "zhi", "si": the "i" is a syllabic consonant, as Wiktionary writes it.
	if (rest === 'i' && /^(zh|ch|sh|r)$/.test(init?.[0] ?? '')) return `${initial}ɻ̩`;
	if (rest === 'i' && /^(z|c|s)$/.test(init?.[0] ?? '')) return `${initial}ɹ̩`;
	// After j, q, x a written "u" is "ü".
	if (/^(j|q|x)$/.test(init?.[0] ?? '') && rest.startsWith('u')) rest = `ü${rest.slice(1)}`;
	rest = rest.replace(/^v/, 'ü');
	const final = ZH_FINALS[rest];
	return final === undefined ? null : initial + final;
}

/** Every way to cut a pinyin run into valid syllables; the first that works. */
function zhSplit(run: string): string[] | null {
	if (!run) return [];
	for (let len = Math.min(6, run.length); len >= 1; len--) {
		const head = run.slice(0, len);
		const bare = head
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, (m) => (m === '̈' ? m : ''))
			.normalize('NFC');
		if (zhSyllable(bare) === null) continue;
		const tail = zhSplit(run.slice(len));
		if (tail) return [head, ...tail];
	}
	return null;
}

/**
 * Mandarin from Wiktionary's pinyin, for words it gives pinyin and no IPA:
 * "shūfu" /ʂu⁵⁵ fu/. Tones as Wiktionary writes them, 55, 35, 214 and 51; a
 * neutral tone has no number. Tone sandhi is not applied.
 */
/** The tone-marked syllables of a pinyin spelling, or null if it will not split. */
export function pinyinSyllables(py: string): string[] | null {
	const out: string[] = [];
	for (const part of py
		.toLowerCase()
		.split(/[\s'’-]+/)
		.filter(Boolean)) {
		const syls = zhSplit(part.normalize('NFC'));
		if (!syls) return null;
		out.push(...syls);
	}
	return out;
}

export function chineseIpa({ romans }: Spelled): string | null {
	const py = romans?.find((r) => /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüa-z]/.test(r));
	if (!py) return null;
	const out: string[] = [];
	for (const part of py
		.toLowerCase()
		.split(/[\s'’-]+/)
		.filter(Boolean)) {
		const syls = zhSplit(part.normalize('NFC'));
		if (!syls) return null;
		for (const syl of syls) {
			const d = syl.normalize('NFD');
			const tone = [...d].map((c) => ZH_TONES[c]).find(Boolean) ?? '';
			const bare = d.replace(/[̀-ͯ]/g, (m) => (m === '̈' ? m : '')).normalize('NFC');
			const ipa = zhSyllable(bare);
			if (ipa === null) return null;
			out.push(ipa + tone);
		}
	}
	return out.length ? `/${out.join(' ')}/` : null;
}

// — Hebrew, from the vowel points —————————————————————————————————————

const HE_LETTER: Record<string, [string, string]> = {
	// letter: [with dagesh, without]
	א: ['ʔ', 'ʔ'],
	ב: ['b', 'v'],
	ג: ['ɡ', 'ɡ'],
	ד: ['d', 'd'],
	ה: ['h', 'h'],
	ו: ['v', 'v'],
	ז: ['z', 'z'],
	ח: ['χ', 'χ'],
	ט: ['t', 't'],
	י: ['j', 'j'],
	כ: ['k', 'χ'],
	ך: ['k', 'χ'],
	ל: ['l', 'l'],
	מ: ['m', 'm'],
	ם: ['m', 'm'],
	נ: ['n', 'n'],
	ן: ['n', 'n'],
	ס: ['s', 's'],
	ע: ['ʔ', 'ʔ'],
	פ: ['p', 'f'],
	ף: ['p', 'f'],
	צ: ['t͡s', 't͡s'],
	ץ: ['t͡s', 't͡s'],
	ק: ['k', 'k'],
	ר: ['ʁ', 'ʁ'],
	ש: ['ʃ', 'ʃ'],
	ת: ['t', 't']
};
const HE_VOWEL: Record<string, string> = {
	'ִ': 'i', // hiriq
	'ֵ': 'e', // tsere
	'ֶ': 'e', // segol
	'ַ': 'a', // patah
	'ָ': 'a', // qamats
	'ֹ': 'o', // holam
	'ֺ': 'o',
	'ֻ': 'u', // qubuts
	'ֱ': 'e', // hataf segol
	'ֲ': 'a', // hataf patah
	'ֳ': 'o' // hataf qamats
};

/**
 * Modern Hebrew from the vowel points, for words Wiktionary vowels and does
 * not romanise: "עוֹשֶׂה" /ʔose/. Dagesh hardens "ב כ פ"; the shin and sin
 * dots tell "ש" apart; "וּ" is /u/ and "וֹ" /o/; a vowel-less "א ה ע" at the end
 * is silent; shva is left unsaid, which is how it is mostly said. No stress
 * mark: the points do not say where it falls.
 */
export function hebrewPointedIpa({ canon }: Spelled): string | null {
	if (!canon || !/[ְ-ּ]/.test(canon)) return null;
	const chars = [...canon.normalize('NFD')];
	const groups: { letter: string; marks: string[] }[] = [];
	for (const c of chars) {
		if (HE_LETTER[c]) groups.push({ letter: c, marks: [] });
		else if (/[֑-ׇ]/.test(c) && groups.length) groups[groups.length - 1].marks.push(c);
		else if (!/[־'׳"״]/.test(c)) return null;
	}
	let out = '';
	groups.forEach(({ letter, marks }, i) => {
		const dagesh = marks.includes('ּ');
		const vowel = marks.map((m) => HE_VOWEL[m]).find(Boolean);
		const last = i === groups.length - 1;
		if (letter === 'ו' && dagesh && !vowel) return void (out += 'u'); // shuruk
		if (letter === 'ו' && marks.includes('ֹ') && !dagesh) return void (out += 'o'); // holam male
		if (letter === 'ש') out += marks.includes('ׂ') ? 's' : 'ʃ';
		else if ((letter === 'א' || letter === 'ה' || letter === 'ע') && !vowel && (last || !dagesh)) {
			// silent: a guttural with no vowel of its own
		} else if (letter === 'י' && !vowel && !dagesh && i > 0 && /[ie]$/.test(out)) {
			// silent: the "י" that only lengthens a preceding "i" or "e"
		} else out += HE_LETTER[letter][dagesh ? 0 : 1];
		if (vowel) out += vowel;
	});
	return out ? `/${out}/` : null;
}
