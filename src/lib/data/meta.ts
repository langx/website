// Base values for meta tags
// So they can be added as suffixes on different pages
// Via <svelte:head>

export const siteBaseUrl = 'https://langx.io';

export const description =
	'LangX matches you with people who speak the language you are learning and are learning the language you speak. Real conversations, message corrections, and built-in translation.';

export const title = 'Practice, Learn, Succeed!';

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
	'blog'
];
