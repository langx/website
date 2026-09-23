/**
 * Languages whose alphabet has a long-form beginner's guide on the blog, by
 * word-list slug. The post lives at `/<slug>-alphabet-guide`; add the slug
 * here when a new guide is published.
 */
export const ALPHABET_GUIDES = new Set([
	'arabic',
	'armenian',
	'bengali',
	'bulgarian',
	'georgian',
	'greek',
	'hebrew',
	'hindi',
	'korean',
	'malayalam',
	'persian',
	'russian',
	'ukrainian'
]);

export const alphabetGuide = (slug: string | undefined): string | null =>
	slug && ALPHABET_GUIDES.has(slug) ? `/${slug}-alphabet-guide` : null;

/**
 * The letter that stands for a script in a picture: the post's thumbnail in
 * the lists and the art above the guide. The first letter of the language's
 * own name works for most (한, ह, ব, മ), but Greek, Russian and Bulgarian open
 * with Ε, Р and Б, which read as Latin at a glance, so those get a letter only
 * their script has.
 *
 * Georgian keeps its letter as it is: Unicode gives ქ a capital, Ქ, from
 * Mtavruli, an all-caps style that ordinary text never uses and most fonts
 * do not draw.
 */
const SIGNATURE: Record<string, string> = {
	el: 'Ω',
	ru: 'Ж',
	bg: 'Щ',
	uk: 'Ї',
	sr: 'Ђ',
	mk: 'Ѓ'
};

export const signatureLetter = (code: string, nativeName: string): string => {
	if (SIGNATURE[code]) return SIGNATURE[code];
	const first = [...nativeName].find((c) => /\p{L}/u.test(c)) ?? '';
	return code === 'ka' ? first : first.toLocaleUpperCase(code);
};
