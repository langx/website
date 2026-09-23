import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Each language's pronunciations, keyed by lowercased word: the fourth column
 * of its list, written by scripts/wordlists/build-ipa.ts. Pages that take their
 * words from somewhere else — the pair files, the search index — look the
 * pronunciation up here rather than carrying a copy of it.
 *
 * Kept for the whole prerender: the /tools/say pages alone ask about every
 * language a thousand times over.
 */
const cache = new Map<string, Promise<Map<string, string>>>();

export function ipaMap(slug: string): Promise<Map<string, string>> {
	let pending = cache.get(slug);
	if (!pending) {
		pending = readFile(
			path.join(process.cwd(), 'static/data/most-common-words', `${slug}.tsv`),
			'utf8'
		).then((text) => {
			const map = new Map<string, string>();
			for (const line of text.split('\n').slice(1)) {
				const [, word, , ipa] = line.split('\t');
				if (word && ipa && !map.has(word.toLowerCase())) map.set(word.toLowerCase(), ipa);
			}
			return map;
		});
		cache.set(slug, pending);
	}
	return pending;
}
