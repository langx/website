import { appStoreUrl, playStoreUrl, siteBaseUrl } from '$lib/data/meta';
import { faqObjects } from '$lib/data/faq';
import { filteredPosts } from '$lib/data/blog-posts';
import { WORD_LISTS, totalWords } from '$lib/data/most-common-words';
import { ALPHABETS } from '$lib/data/alphabets';
import { WORD_GAME_LANGUAGES } from '$lib/data/word-game';
import { LANGUAGE_PAIRS } from '$lib/data/language-pairs';
import { SAY_WORDS } from '$lib/data/say-words';

// The site described for language models, in the llms.txt format
// (https://llmstxt.org): a title, a one-paragraph summary, then sections of
// links. Built from the same data as the pages, so a new post or a new word
// list turns up here without anyone remembering to add it.

export const prerender = true;

export async function GET() {
	return new Response(body(), {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
}

const nf = new Intl.NumberFormat('en-US');

/**
 * A page on this site, as the URL of its Markdown twin: /plans is also
 * /plans.md, and / is /index.md (scripts/markdown.mjs writes them). The
 * llms.txt proposal asks for exactly that, and an agent reading this file
 * wants the Markdown anyway. Files (/rss.xml) and other sites stay as they are.
 */
const url = (path: string) => {
	if (!path.startsWith('/')) return path;
	const [page, fragment] = path.split('#');
	const twin = page === '/' ? '/index.md' : /\.[a-z]+$/.test(page) ? page : `${page}.md`;
	return `${siteBaseUrl}${twin}${fragment ? `#${fragment}` : ''}`;
};

/** An FAQ answer is HTML; here it becomes plain text with markdown links. */
const plain = (html: string) =>
	html
		.replace(
			/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g,
			(_, href: string, text: string) => `[${text}](${url(href)})`
		)
		.replace(/<[^>]+>/g, '');

const link = (title: string, path: string, note?: string) =>
	`- [${title}](${url(path)})${note ? `: ${note}` : ''}`;

const comparison = (tags: string[] | undefined) => tags?.includes('Comparison') ?? false;

const body = () =>
	[
		'# LangX',
		'',
		'> LangX is a free, open source language exchange app. It matches you with people who speak the language you are learning and are learning yours, and gives the conversation the tools that make it teach: corrections on any message, translation inside the chat, voice and photo messages and a daily streak. No ads. On iOS, Android and the web.',
		'',
		'Matching runs in both directions, so every conversation helps both people. Replies and corrections are unlimited on every plan, including the free one. The app and its API are open source (BSD-3) and can be self-hosted. LangX is made by New Chapter Technology LLC; contact hi@langx.io.',
		'',
		`Every page on langx.io is also Markdown: the links below go to it, any page URL with .md added gives it, and so does asking any page for \`Accept: text/markdown\`. The whole site's writing in one file, the app pages, guides and comparisons, is [llms-full.txt](${siteBaseUrl}/llms-full.txt).`,
		'',
		'## The app',
		'',
		link('Home', '/', 'what LangX is, how matching and corrections work, and the FAQ'),
		link(
			'Plans',
			'/plans',
			'what Free and Pro each include, and the ways to get Pro free: invites, streaks and gift codes'
		),
		link(
			'Tokens',
			'/tokens',
			'in-app points earned by helping others; not money, never bought or sold'
		),
		link('Compare', '/compare', 'LangX next to Tandem, HelloTalk, Duolingo and other apps'),
		link('Welcome back', '/welcome-back', 'what changed for people who used LangX v1'),
		link('Blog', '/blog', 'every guide and comparison, by topic'),
		link('iPhone app', appStoreUrl),
		link('Android app', playStoreUrl),
		link('Web app', 'https://app.langx.io'),
		'',
		'## Questions',
		'',
		...faqObjects.flatMap((f) => [`### ${f.title}`, '', plain(f.content), '']),
		'## Comparisons',
		'',
		...filteredPosts
			.filter((p) => comparison(p.tags))
			.map((p) => link(p.title, `/${p.slug}`, p.excerpt)),
		'',
		'## Guides',
		'',
		...filteredPosts
			.filter((p) => !comparison(p.tags))
			.map((p) => link(p.title, `/${p.slug}`, p.excerpt)),
		'',
		'## Free tools',
		'',
		link('All tools', '/tools', 'word lists, quizzes and games; no account needed'),
		link(
			'Most common words',
			'/tools/most-common-words',
			`frequency-ranked word lists for ${WORD_LISTS.length} languages, ${nf.format(totalWords)} words with English meanings`
		),
		link(
			'Words in different languages',
			'/tools/say',
			`${nf.format(SAY_WORDS.length)} everyday words translated into each language`
		),
		link(
			'Alphabet charts',
			'/tools/alphabet',
			`every letter of ${ALPHABETS.length} writing systems`
		),
		link(
			'Vocabulary test',
			'/tools/vocabulary-test',
			`how many words you know, in ${WORD_LISTS.length} languages`
		),
		link('Vocabulary quiz', '/tools/meaning-quiz', 'ten common words a day, four meanings each'),
		link(
			'Word game',
			'/tools/word-game',
			`a daily five-letter puzzle in ${WORD_GAME_LANGUAGES.length} languages`
		),
		link('Similar languages', '/tools/similar', `${LANGUAGE_PAIRS.length} pairs that share words`),
		link('Guess the language', '/tools/guess-the-language', 'a daily ten-word quiz'),
		'',
		'## Optional',
		'',
		link('Source code', 'https://github.com/langx'),
		link('Blog feed', '/rss.xml'),
		link('Privacy policy', '/privacy-policy'),
		link('Terms and conditions', '/terms-conditions'),
		link('Community guidelines', '/community-guidelines'),
		link('Cookie policy', '/cookie-policy'),
		link('Data deletion', '/data-deletion', 'how to delete an account and everything in it'),
		''
	].join('\n');
