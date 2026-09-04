import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { WORD_LISTS } from '$lib/data/most-common-words';

/** Ten questions is a game; twenty is homework. */
const ROUNDS = 10;
const OPTIONS = 4;
/** Answers come from here — a word nobody has met is not a fair question. */
const DEPTH = 1500;

export function entries() {
	return WORD_LISTS.map((l) => ({ language: l.slug }));
}

export async function load({ params }) {
	const meta = WORD_LISTS.find((l) => l.slug === params.language);
	if (!meta) throw error(404, 'No quiz for that language');

	const rows = (
		await readFile(
			path.join(process.cwd(), 'static/data/most-common-words', `${meta.slug}.tsv`),
			'utf8'
		)
	)
		.split('\n')
		.slice(1, DEPTH + 1)
		.filter(Boolean)
		.map((line) => {
			const [rank, word, english] = line.split('\t');
			return { rank: Number(rank), word, english };
		})
		// A gloss that describes rather than translates makes a poor multiple
		// choice, and two rows with the same gloss make an unanswerable one.
		.filter((r) => r.english && r.english.length <= 40 && !r.english.includes('…'));

	const seen = new Set<string>();
	const usable = rows.filter((r) => {
		const k = r.english.toLowerCase();
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});

	if (usable.length < ROUNDS * OPTIONS) throw error(404, 'Not enough usable words for a quiz');

	return { meta, pool: usable, rounds: ROUNDS, options: OPTIONS };
}
