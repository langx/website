/**
 * Icelandic pronunciations from the Icelandic Pronunciation Dictionary for
 * Language Technology (Grammatek, for the Language Technology Programme for
 * Icelandic): 48,000 word forms, transcribed by hand, CC BY 4.0.
 * https://github.com/grammatek/iceprondict
 *
 * The standard pronunciation, in IPA. The dictionary writes one sound per
 * space-separated symbol and no stress, because Icelandic stress is always on
 * the first syllable; the mark is added here, as Wiktionary writes it.
 *
 * Pinned to one commit, so a rebuild reads the same file.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const COMMIT = '467223848d7acd09fd59fbdb6272e3f3dfa94747';
const URL = `https://raw.githubusercontent.com/grammatek/iceprondict/${COMMIT}/dictionaries/ice_pron_dict_standard_clear_IPA.csv`;

const VOWEL = /[aeiouyæøœɛɔɪʏ]/;

async function dictFor(cache: string) {
	const file = path.join(cache, 'iceprondict', `${COMMIT.slice(0, 12)}-standard-ipa.csv`);
	try {
		return await readFile(file, 'utf8');
	} catch {
		// not downloaded yet
	}
	const res = await fetch(URL);
	if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${URL}`);
	const text = await res.text();
	await mkdir(path.dirname(file), { recursive: true });
	await writeFile(file, text);
	return text;
}

export async function iceprondict(words: Set<string>, cache: string) {
	const out = new Map<string, string>();
	for (const line of (await dictFor(cache)).split('\n')) {
		const [word, phones] = line.split('\t');
		if (!word || !phones || !words.has(word) || out.has(word)) continue;
		const sounds = phones.trim().split(/\s+/);
		// A diphthong is one symbol, so the vowel symbols are the syllables.
		const syllables = sounds.filter((s) => VOWEL.test(s)).length;
		out.set(word, `/${syllables > 1 ? 'ˈ' : ''}${sounds.join('')}/`);
	}
	return out;
}
