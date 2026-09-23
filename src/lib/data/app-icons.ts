/**
 * App icons for the apps LangX is compared with, and LangX's own, as the App
 * Store serves them (160px PNGs in static/images/apps/, fetched from the
 * iTunes lookup API). Conversation Exchange has no app, so its icon is the
 * website's own apple-touch-icon; Bilingua has left the stores and has none.
 *
 * The icons are the other apps' trademarks, shown only to name them next to a
 * comparison. Refresh them when an app redesigns its icon.
 */
const HAVE = new Set([
	'babbel',
	'busuu',
	'cambly',
	'conversationexchange',
	'duolingo',
	'hellotalk',
	'interpals',
	'italki',
	'langx',
	'lingbe',
	'memrise',
	'praktika',
	'preply',
	'slowly',
	'speak',
	'speaky',
	'tandem'
]);

/** The icon's path for an app name as written in competitors.ts, or null. */
export const appIcon = (name: string): string | null => {
	const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
	return HAVE.has(key) ? `/images/apps/${key}.png` : null;
};
