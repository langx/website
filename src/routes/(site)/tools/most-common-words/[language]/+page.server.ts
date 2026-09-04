import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { WORD_LISTS } from '$lib/data/most-common-words';

/**
 * How many rows go into the HTML. The rest is fetched when the reader asks for
 * it. This is the number that matters for search: a crawler indexes what is in
 * the markup, and a thousand rows is both the bulk of the search intent and
 * about 20 KB gzipped.
 */
const RENDERED = 1000;

/**
 * Without this the page is not prerendered, and adapter-static leaves the route
 * to Cloudflare Pages, which answers a dynamic path with a 404 status and a
 * body that looks fine. Humans would not notice; Google would.
 */
export function entries() {
	return WORD_LISTS.map((l) => ({ language: l.slug }));
}

export async function load({ params }) {
	const meta = WORD_LISTS.find((l) => l.slug === params.language);
	if (!meta) throw error(404, 'No word list for that language');

	const file = path.join(process.cwd(), 'static/data/most-common-words', `${meta.slug}.tsv`);
	const rows = (await readFile(file, 'utf8'))
		.split('\n')
		.slice(1, RENDERED + 1)
		.filter(Boolean)
		.map((line) => {
			const [rank, word, english] = line.split('\t');
			return { rank: Number(rank), word, english: english ?? '' };
		});

	return {
		meta,
		rows,
		rendered: RENDERED,
		others: WORD_LISTS.filter((l) => l.slug !== meta.slug).map((l) => ({
			slug: l.slug,
			name: l.name,
			count: l.count
		}))
	};
}
