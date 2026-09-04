import { error } from '@sveltejs/kit';
import { ALPHABETS } from '$lib/data/alphabets';
import { WORD_LISTS } from '$lib/data/most-common-words';

export function entries() {
	return ALPHABETS.map((a) => {
		const l = WORD_LISTS.find((w) => w.code === a.code);
		return { language: l ? l.slug : a.code };
	});
}

export function load({ params }) {
	const lang = WORD_LISTS.find((l) => l.slug === params.language);
	const alphabet = ALPHABETS.find((a) => a.code === lang?.code);
	if (!lang || !alphabet) throw error(404, 'No alphabet page for that language');

	/** Other languages using the same script — the letters mostly carry over. */
	const cousins = ALPHABETS.filter((a) => a.script === alphabet.script && a.code !== alphabet.code)
		.map((a) => WORD_LISTS.find((l) => l.code === a.code))
		.filter(Boolean);

	const others = ALPHABETS.filter((a) => a.script !== alphabet.script)
		.map((a) => ({ alphabet: a, lang: WORD_LISTS.find((l) => l.code === a.code) }))
		.filter((x) => x.lang);

	return { lang, alphabet, cousins, others };
}
