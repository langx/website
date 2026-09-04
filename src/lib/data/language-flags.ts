/**
 * A flag for a language, where one country is the defensible answer.
 *
 * Deliberately incomplete. Arabic would have to pick one of twenty-two
 * countries, Esperanto belongs to none, and Basque, Catalan and Galician have
 * flags that Unicode does not encode. Malayalam, Tamil and Telugu would all
 * land on the same Indian flag as Hindi, which tells the reader nothing. Those
 * keep the language's own first character instead, which is always correct.
 *
 * Where a language is spoken in many countries the choice is the one its
 * English name points at — Spanish to Spain, Portuguese to Portugal, English
 * to the United Kingdom — not a judgement about where it is spoken most.
 */
export const LANGUAGE_FLAGS: Record<string, string> = {
	af: '🇿🇦',
	sq: '🇦🇱',
	hy: '🇦🇲',
	bn: '🇧🇩',
	bs: '🇧🇦',
	bg: '🇧🇬',
	zh: '🇨🇳',
	hr: '🇭🇷',
	cs: '🇨🇿',
	da: '🇩🇰',
	nl: '🇳🇱',
	en: '🇬🇧',
	et: '🇪🇪',
	fi: '🇫🇮',
	fr: '🇫🇷',
	ka: '🇬🇪',
	de: '🇩🇪',
	el: '🇬🇷',
	he: '🇮🇱',
	hi: '🇮🇳',
	hu: '🇭🇺',
	is: '🇮🇸',
	id: '🇮🇩',
	it: '🇮🇹',
	ko: '🇰🇷',
	lv: '🇱🇻',
	lt: '🇱🇹',
	mk: '🇲🇰',
	ms: '🇲🇾',
	no: '🇳🇴',
	fa: '🇮🇷',
	pl: '🇵🇱',
	pt: '🇵🇹',
	ro: '🇷🇴',
	ru: '🇷🇺',
	sr: '🇷🇸',
	sk: '🇸🇰',
	sl: '🇸🇮',
	es: '🇪🇸',
	sv: '🇸🇪',
	tl: '🇵🇭',
	tr: '🇹🇷',
	uk: '🇺🇦',
	ur: '🇵🇰',
	vi: '🇻🇳'
};
