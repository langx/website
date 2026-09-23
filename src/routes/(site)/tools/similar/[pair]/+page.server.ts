import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { LANGUAGE_PAIRS } from '$lib/data/language-pairs';
import { WORD_LISTS } from '$lib/data/most-common-words';
import { ipaMap } from '$lib/server/ipa';

/** Enough to make the case; the file has the rest. */
const SHOWN = 200;

export function entries() {
	return LANGUAGE_PAIRS.map((p) => ({ pair: p.slug }));
}

export async function load({ params }) {
	const pair = LANGUAGE_PAIRS.find((p) => p.slug === params.pair);
	if (!pair) throw error(404, 'No page for that pair');

	const a = WORD_LISTS.find((l) => l.code === pair.a);
	const b = WORD_LISTS.find((l) => l.code === pair.b);
	if (!a || !b) throw error(404, 'Unknown language in that pair');

	const rows = (
		await readFile(
			path.join(process.cwd(), 'static/data/most-common-words/pairs', `${pair.slug}.tsv`),
			'utf8'
		)
	)
		.split('\n')
		.slice(1)
		.filter(Boolean)
		.map((line) => {
			const [word, rankA, rankB, english] = line.split('\t');
			return { word, rankA: Number(rankA), rankB: Number(rankB), english };
		})
		// Commonest in the first language first: that is the order they are met in.
		.sort((x, y) => x.rankA - y.rankA);

	const others = LANGUAGE_PAIRS.filter(
		(p) =>
			p.slug !== pair.slug && (p.a === pair.a || p.b === pair.a || p.a === pair.b || p.b === pair.b)
	).slice(0, 8);

	// Spelled the same is not said the same, so each language keeps its own.
	const [ipaA, ipaB] = await Promise.all([ipaMap(a.slug), ipaMap(b.slug)]);
	const listed = rows.slice(0, SHOWN).map((r) => ({
		...r,
		ipaA: ipaA.get(r.word.toLowerCase()) ?? '',
		ipaB: ipaB.get(r.word.toLowerCase()) ?? ''
	}));

	return { pair, a, b, rows: listed, total: rows.length, shown: SHOWN, others };
}
