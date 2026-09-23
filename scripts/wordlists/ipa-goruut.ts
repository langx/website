/**
 * Pronunciations from goruut's word lists — the last resort, for the words no
 * dictionary, rule set or eSpeak voice has covered.
 *
 * goruut (https://github.com/neurlang/goruut, MIT) is an IPA phonemiser for
 * 140 languages. Next to each trained model it ships `missing.all.zlib`: the
 * words it keeps a transcription for rather than guess, which for several
 * languages is most of the vocabulary — 95,000 Arabic words, 1.2 million
 * Bulgarian forms. Only that list is used here, never the model: it is data
 * that can be checked, the same way every other source is, against Wiktionary.
 *
 * goruut does not say where each list comes from, so nothing here assumes it
 * is right. The agreement test in build-ipa.ts decides per language, and the
 * lists that fail it (Arabic, among others) fill nothing.
 *
 * Pinned to one commit, so a rebuild reads the same lists.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';
import path from 'node:path';

const COMMIT = '6f069c604dcbf564df19f4638b5f35fc406d4661';

async function listFor(dir: string, cache: string) {
	const file = path.join(cache, 'goruut', `${COMMIT.slice(0, 12)}-${dir}.zlib`);
	try {
		return await readFile(file);
	} catch {
		// not downloaded yet
	}
	const url = `https://raw.githubusercontent.com/neurlang/goruut/${COMMIT}/dicts/${dir}/missing.all.zlib`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
	const body = Buffer.from(await res.arrayBuffer());
	await mkdir(path.dirname(file), { recursive: true });
	await writeFile(file, body);
	return body;
}

/**
 * The transcriptions goruut keeps for the words asked for, bracketed. Its
 * stress mark stands before the stressed vowel, as eSpeak's does, and is left
 * for build-ipa.ts to move; the first transcription of a word is the one used.
 */
export async function goruut(dir: string, words: Set<string>, cache: string) {
	const text = inflateSync(await listFor(dir, cache)).toString('utf8');
	const out = new Map<string, string>();
	for (const line of text.split('\n')) {
		const tab = line.indexOf('\t');
		if (tab < 1) continue;
		const word = line.slice(0, tab).toLowerCase();
		if (!words.has(word) || out.has(word)) continue;
		const ipa = line
			.slice(tab + 1)
			.split('\t')[0]
			.trim();
		if (ipa) out.set(word, ipa);
	}
	return out;
}
