import { error } from '@sveltejs/kit';
import { WORD_GAME_LANGUAGES } from '$lib/data/word-game';
import { WORD_LISTS } from '$lib/data/most-common-words';

export function entries() {
	return WORD_GAME_LANGUAGES.map((l) => ({ language: l.slug }));
}

export function load({ params }) {
	const game = WORD_GAME_LANGUAGES.find((l) => l.slug === params.language);
	const meta = WORD_LISTS.find((l) => l.slug === params.language);
	if (!game || !meta) throw error(404, 'No word game for that language');

	const others = WORD_GAME_LANGUAGES.filter((l) => l.slug !== game.slug);
	return { game, meta, others };
}
