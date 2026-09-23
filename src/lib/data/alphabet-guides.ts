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
