import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { WORD_LISTS } from '$lib/data/most-common-words';

/**
 * Fixed bands rather than an even split of the range. A geometric split put the
 * first band at ranks 1–3, which asks five questions of a slice three words
 * wide and tells you nothing: everyone knows the first three words of any
 * language. These boundaries are the ones a learner already thinks in, and they
 * match the tiers on the word list itself.
 */
const BANDS: [number, number][] = [
	[1, 100],
	[100, 500],
	[500, 1000],
	[1000, 2500],
	[2500, 5000],
	[5000, 10000]
];
const PER_BAND = 7;

export function entries() {
	return WORD_LISTS.map((l) => ({ language: l.slug }));
}

export async function load({ params }) {
	const meta = WORD_LISTS.find((l) => l.slug === params.language);
	if (!meta) throw error(404, 'No word list for that language');

	const file = path.join(process.cwd(), 'static/data/most-common-words', `${meta.slug}.tsv`);
	const rows = (await readFile(file, 'utf8'))
		.split('\n')
		.slice(1)
		.filter(Boolean)
		.map((line) => {
			const [rank, word, english] = line.split('\t');
			return { rank: Number(rank), word, english: english ?? '' };
		});

	// A deterministic spread: the same page always offers the same words, so a
	// shared result is the same test for whoever opens it.
	const bands: { from: number; to: number; words: typeof rows }[] = [];
	for (const [from, rawTo] of BANDS) {
		if (from > meta.count) break;
		const to = Math.min(rawTo, meta.count);
		const slice = rows.slice(from - 1, to);
		if (slice.length < 2) continue;
		const step = Math.max(1, Math.floor(slice.length / PER_BAND));
		const picked = [];
		for (let i = 0; i < PER_BAND && i * step < slice.length; i++) picked.push(slice[i * step]);
		bands.push({ from, to, words: picked });
	}

	return { meta, bands };
}
