/**
 * Norwegian pronunciations from NB Uttale, the National Library of Norway's
 * pronunciation lexicon: 785,000 Bokmål word forms transcribed by linguists,
 * CC0. https://www.nb.no/sprakbanken/en/resource-catalogue/oai-nb-no-sbr-79/
 *
 * Norwegian spelling says too little about vowels and stress for rules or
 * eSpeak to read it (eSpeak agreed with Wiktionary on 42% of words), and
 * Wiktionary transcribes only the commonest tenth of the list. This fills the
 * rest from a dictionary that covers practically every form.
 *
 * The file used is the East Norwegian "written" one — the careful reading of
 * Bokmål, the same standard as Wiktionary's Urban East Norwegian. Its IPA is
 * rewritten into Wiktionary's notation: both tones become the ordinary stress
 * mark (Wiktionary writes tone on some entries and not others), its "ɪː" is
 * the "iː" everyone else writes, its Latin "g" the IPA "ɡ", and the syllable
 * dots go. It agrees with Wiktionary on 71% of the words both have.
 */
import { spawn } from 'node:child_process';
import { mkdir, stat } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const URL = 'https://www.nb.no/sbfil/uttaleleksikon/nb_uttale_leksika.zip';
const ENTRY = 'nb_uttale_leksika/e_written_pronunciation_lexicon.csv';

async function zipFor(cache: string) {
	const file = path.join(cache, 'nb_uttale_leksika.zip');
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

/** The lexicon's IPA in Wiktionary's notation, with its brackets. */
function tidy(ipa: string): string {
	return `/${ipa
		.replace(/^"|"$/g, '')
		.replace(/"/g, 'ˈ') // tone 2
		.replace(/'/g, 'ˈ') // tone 1
		.replace(/ɪː/g, 'iː')
		.replace(/g/g, 'ɡ') // the IPA letter, not the Latin one
		.replace(/\./g, '')}/`;
}

/**
 * Pronunciations for the words asked for. Where the lexicon lists several,
 * the first stressed one: "det" is /də/ unstressed and /ˈdeː/ on its own, and
 * a word list shows a word on its own.
 */
export async function nbUttale(words: Set<string>, cache: string) {
	const zip = await zipFor(path.join(cache, 'nb-uttale'));
	// unzip streams the one file out of the archive; the other nine dialect
	// files are never unpacked.
	const unzip = spawn('unzip', ['-p', zip, ENTRY]);
	const rl = createInterface({ input: unzip.stdout, crlfDelay: Infinity });
	const found = new Map<string, { ipa: string; stressed: boolean }>();
	for await (const line of rl) {
		const word = line.slice(0, line.indexOf(',')).toLowerCase();
		if (!words.has(word)) continue;
		// Columns: wordform, pos, feats, id, update_info, nofabet, ipa, sampa.
		// The IPA is a quoted field when it holds the tone-2 mark, which is a
		// double quote, so split on commas outside quotes.
		const cols = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g)?.map((c) => c.replace(/,$/, '')) ?? [];
		const raw = cols[6]?.replace(/""/g, '"');
		if (!raw) continue;
		const stressed = /['"]/.test(raw.replace(/^"|"$/g, ''));
		const prev = found.get(word);
		if (!prev || (stressed && !prev.stressed)) found.set(word, { ipa: tidy(raw), stressed });
	}
	return new Map([...found].map(([w, v]) => [w, v.ipa]));
}
