/**
 * Echo, the app's spaced-repetition tab, as the site may describe it. Mirror
 * of `langx/docs/echo.md`, `langx/content/echo/ATTRIBUTION.md` and the
 * `echo*` rows of `PLAN_LIMITS` in `langx/packages/shared/src/limits.ts`
 * (read 23 September 2026).
 *
 * The facts, in the order they matter to somebody comparing apps:
 *
 *  - Eighteen curated packs of phrases, six languages, three levels each,
 *    4,910 items, every one read aloud. Free on every plan: new cards and
 *    reviews are unlimited on every tier (`echoNewCardsPerDay` and
 *    `echoReviewsPerDay` are null on Free), and a pack's own readings cost
 *    nothing. What a plan meters is how many cards a *synthetic* voice reads
 *    for you a day — see `plans.ts`.
 *  - The card you make from a real message is the product: one tap on a
 *    message, a correction or a feed post makes a card; the packs are what
 *    make the tab worth opening before you have any.
 *  - "Free on every plan" is what the app does today. The docs say nothing
 *    about forever, so neither does the site.
 */
export const echo = {
	name: 'Echo',
	packs: 18,
	phrases: 4910,
	/** The pack languages, in the order the packs were built. */
	languages: ['English', 'Spanish', 'German', 'French', 'Russian', 'Italian'],
	levels: ['Absolute beginner', 'Beginner', 'Intermediate'],
	/** One line, for a row or a chip. */
	line: 'Free packs of phrases to review, in six languages, read aloud',
	/** Two sentences, for a card or an answer. */
	what: 'Echo is spaced repetition, free on every plan: eighteen packs of phrases in six languages at three levels, every one read aloud, so a new account has something to learn from before anyone replies. One tap turns any message, correction or feed post into a card of your own.'
};
