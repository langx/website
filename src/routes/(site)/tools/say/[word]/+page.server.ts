import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { SAY_WORDS } from '$lib/data/say-words';
import { WORD_LISTS } from '$lib/data/most-common-words';
import { bucket } from '$lib/utils/wordSearch';

const IDX = () => path.join(process.cwd(), 'static/data/most-common-words/idx/e');

/**
 * Loaded once for the whole prerender rather than once per page: there are
 * nearly a thousand of these and they share a few hundred shards.
 */
const shards = new Map<string, Record<string, [string, string, number, string][]>>();
let split: string[] | null = null;

async function rowsFor(word: string) {
	if (!split) {
		const stats = JSON.parse(await readFile(path.join(IDX(), '../stats.json'), 'utf8'));
		split = stats.split.e as string[];
	}
	const name = bucket(word, split);
	if (!shards.has(name)) {
		shards.set(
			name,
			JSON.parse(await readFile(path.join(IDX(), `${encodeURIComponent(name)}.json`), 'utf8'))
		);
	}
	return shards.get(name)?.[word] ?? [];
}

export function entries() {
	return SAY_WORDS.map((w) => ({ word: w.slug }));
}

export async function load({ params }) {
	const entry = SAY_WORDS.find((w) => w.slug === params.word);
	if (!entry) throw error(404, 'No page for that word');

	const byCode = new Map(WORD_LISTS.map((l) => [l.code, l]));
	const rows = (await rowsFor(entry.word))
		.map(([code, word, rank, gloss]) => {
			const lang = byCode.get(code);
			return lang
				? { code, word, rank, gloss, name: lang.name, native: lang.nativeName, slug: lang.slug }
				: null;
		})
		.filter(Boolean)
		.sort((a, b) => (a as { name: string }).name.localeCompare((b as { name: string }).name));

	// Neighbours in the alphabetical list, so every page links onward.
	const i = SAY_WORDS.indexOf(entry);
	const nearby = SAY_WORDS.slice(Math.max(0, i - 6), i + 7).filter((w) => w.slug !== entry.slug);

	return { entry, rows, nearby };
}
