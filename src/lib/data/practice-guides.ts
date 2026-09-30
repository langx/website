/**
 * Languages with a "best apps to practice <language> with native speakers"
 * post on the blog, by word-list slug. The post lives at
 * `/best-apps-to-practice-<slug>-with-native-speakers`; add the slug here when
 * a new one is published. Japanese has a post but no word list, so no tool
 * page to link it from.
 *
 * The tool pages for a language link here because the posts sat on the
 * second and third results pages in their first week (German at 21, French
 * at 20, week to 25 September 2026) with nothing but other posts linking to
 * them, while the word lists for the same languages already ranked.
 */
export const PRACTICE_GUIDES = new Set([
	'arabic',
	'chinese',
	'english',
	'french',
	'german',
	'italian',
	'korean',
	'portuguese',
	'russian',
	'spanish',
	'turkish'
]);

export const practiceGuide = (slug: string | undefined): string | null =>
	slug && PRACTICE_GUIDES.has(slug) ? `/best-apps-to-practice-${slug}-with-native-speakers` : null;
