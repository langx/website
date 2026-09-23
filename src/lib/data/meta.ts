// Base values for meta tags
// So they can be added as suffixes on different pages
// Via <svelte:head>

export const siteBaseUrl = 'https://langx.io';

export const description =
	'The social language app: practice with real native speakers who are learning your language. Like Duolingo, but with people. Free on iOS, Android and web.';

/**
 * The homepage title, and the only page where the brand is not a suffix. It
 * names the category people search for; the old slogan on its own told a
 * results page nothing about what LangX is.
 */
export const title = 'LangX – Social Language Exchange App | Practice with Real People';

// The social card, cut to the 1200x630 every scraper expects by
// `scripts/og/render.mjs`. Declaring the size stops X and Slack from guessing
// at the crop before they have finished downloading it.
export const image = `${siteBaseUrl}/images/site-preview.png`;
export const imageWidth = 1200;
export const imageHeight = 630;
export const imageAlt =
	'LangX: the friendly way to practise a language with real people. A phone shows a Spanish chat with a correction from the other person.';

// Search engines have ignored `meta keywords` for well over a decade, so this
// list is kept short on purpose: it used to run past 200 entries, with repeats
// and machine-translated phrases that were not real words in their language.
// These mirror the App Store keyword field in `langx/docs/store/listing.md`.
export const keywords = [
	'language exchange',
	'language learning',
	'language practice',
	'conversation partner',
	'speaking practice',
	'tandem',
	'learn a language',
	'speak with natives',
	'open source language exchange',
	'social language app',
	'duolingo alternative',
	'blog'
];

// Structured data shared by every page that talks about LangX itself. Only
// profiles the site already links to are listed: `sameAs` is a claim that the
// account is ours.
export const logo = `${siteBaseUrl}/favicons/android-chrome-512x512.png`;
export const appStoreUrl = 'https://apps.apple.com/app/languagexchange/id6474187141';
export const playStoreUrl =
	'https://play.google.com/store/apps/details?id=tech.newchapter.languageXchange';

export const organization = {
	'@type': 'Organization',
	'@id': `${siteBaseUrl}/#organization`,
	name: 'LangX',
	legalName: 'New Chapter Technology LLC',
	url: siteBaseUrl,
	logo,
	email: 'hi@langx.io',
	sameAs: [
		'https://github.com/langx',
		'https://discord.langx.io',
		'https://reddit.com/r/langx',
		appStoreUrl,
		playStoreUrl
	]
};
