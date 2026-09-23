/**
 * Danish pronunciations from the NST pronunciation lexicon: 238,000 entries
 * transcribed by Nordisk Språkteknologi, now kept by the National Library of
 * Norway's Språkbanken under CC0.
 * https://www.nb.no/sprakbanken/en/resource-catalogue/oai-nb-no-sbr-26/
 *
 * Danish spelling is further from its sound than Norwegian — eSpeak agreed
 * with Wiktionary on 27% of words — and Wiktionary covers under half the list.
 *
 * The lexicon is in NST's Danish SAMPA, converted here to IPA in Wiktionary's
 * notation: `"` and `%` are primary and secondary stress, `?` is stød /ˀ/,
 * `s'` is /ɕ/, `6` is the vowel an "r" leaves (/ɐ̯ ɐ ʌ/ by position), `$` is a
 * syllable break and goes, and `¤`, a phrase-level weak stress, goes too.
 * Entries of several words (`_`) are not used.
 */
import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const URL = 'https://www.nb.no/sbfil/leksikalske_databaser/leksikon/da_leksikon.tar.gz';
const ENTRY = 'dan030224NST.pron/dan030224NST.pron';

const SOUND: Record<string, string> = {
	i: 'i',
	e: 'e',
	E: 'ɛ',
	a: 'a',
	A: 'ɑ',
	'{': 'æ',
	y: 'y',
	'2': 'ø',
	'9': 'œ',
	u: 'u',
	o: 'o',
	O: 'ɔ',
	Q: 'ɒ',
	'@': 'ə',
	p: 'p',
	t: 't',
	k: 'k',
	b: 'b',
	d: 'd',
	g: 'ɡ',
	f: 'f',
	v: 'v',
	s: 's',
	h: 'h',
	D: 'ð',
	R: 'ʁ',
	N: 'ŋ',
	j: 'j',
	w: 'w',
	l: 'l',
	m: 'm',
	n: 'n',
	'?': 'ˀ',
	':': 'ː',
	'"': 'ˈ',
	'%': 'ˌ'
};

/** One SAMPA transcription as IPA, or null for a symbol this does not know. */
function toIpa(sampa: string): string | null {
	const s = sampa.replace(/¤/g, '');
	let out = '';
	for (let i = 0; i < s.length; i++) {
		const c = s[i];
		if (c === '$') continue;
		if (c === 's' && s[i + 1] === "'") {
			out += 'ɕ';
			i++;
		} else if (c === '6') {
			// The vowel an "r" leaves: after a vowel it is the second half of a
			// diphthong, "tur" /ˈtuɐ̯ˀ/; as a syllable of its own /ɐ/, "kommer"
			// /ˈkʌmˀɐ/; before a consonant, the vowel /ʌ/ of "godt" /ˈɡʌd/.
			const prev = s[i - 1];
			const next = s[i + 1];
			if (prev && /[ieEaA{y29uoOQ@:]/.test(prev)) out += 'ɐ̯';
			else if (next === undefined || next === '$') out += 'ɐ';
			else out += 'ʌ';
		} else if (c in SOUND) out += SOUND[c];
		else return null;
	}
	return `/${out}/`;
}

async function archiveFor(cache: string) {
	const file = path.join(cache, 'da_leksikon.tar.gz');
	try {
		if ((await stat(file)).size > 0) return file;
	} catch {
		// not downloaded yet
	}
	await mkdir(cache, { recursive: true });
	const res = await fetch(URL);
	if (!res.ok || !res.body) throw new Error(`${res.status} ${res.statusText} — ${URL}`);
	await pipeline(Readable.fromWeb(res.body as never), createWriteStream(file));
	return file;
}

/** Pronunciations for the words asked for; the first entry of a word is used. */
export async function nstDanish(words: Set<string>, cache: string) {
	const archive = await archiveFor(path.join(cache, 'nst-da'));
	// The lexicon is Latin-1, one entry per line, fields separated by ";":
	// the word first, its SAMPA transcription twelfth.
	const tar = spawn('tar', ['-xzOf', archive, ENTRY]);
	tar.stdout.setEncoding('latin1');
	const rl = createInterface({ input: tar.stdout, crlfDelay: Infinity });
	const out = new Map<string, string>();
	for await (const line of rl) {
		const fields = line.split(';');
		const word = fields[0]?.toLowerCase();
		if (!word || !words.has(word) || out.has(word)) continue;
		const sampa = fields[11];
		if (!sampa || sampa.includes('_')) continue;
		const ipa = toIpa(sampa);
		if (ipa) out.set(word, ipa);
	}
	return out;
}
