import { describe, expect, it } from 'vitest';
import { htmlToMarkdown } from './html-to-markdown.mjs';

/** A page as the build writes one, around the given <main>. */
const page = (main, head = '') => `<!doctype html><html lang="en"><head>
	<title>Plans | LangX</title>
	<meta name="description" content="What Pro adds: &quot;more&quot;.">
	<link rel="canonical" href="https://langx.io/plans">${head}
</head><body><header><a href="/">LangX</a></header><main id="main">${main}</main>
<footer><a href="/privacy-policy">Privacy</a></footer></body></html>`;

const body = (main) => htmlToMarkdown(page(main))?.markdown.split('---\n\n')[1];

describe('htmlToMarkdown', () => {
	it('keeps <main>, with the head as frontmatter', () => {
		expect(htmlToMarkdown(page('<h1>Plans</h1>'))).toEqual({
			url: 'https://langx.io/plans',
			markdown:
				'---\ntitle: "Plans | LangX"\ndescription: "What Pro adds: \\"more\\"."\n' +
				'url: "https://langx.io/plans"\n---\n\n# Plans\n'
		});
	});

	it('skips a page that asks not to be indexed', () => {
		const html = page('<h1>Nothing here</h1>', '<meta name="robots" content="noindex, follow">');
		expect(htmlToMarkdown(html)).toBeUndefined();
	});

	it('makes links and images absolute', () => {
		expect(body('<p><a href="/tokens">Tokens</a> <img src="/a.png" alt="A chart"></p>')).toBe(
			'[Tokens](https://langx.io/tokens) ![A chart](https://langx.io/a.png)\n'
		);
	});

	it('drops what a screen reader is not given', () => {
		const main = `<p>Kept</p><p hidden>Hidden</p><span aria-hidden="true">✓</span>
			<img src="/face.webp" alt=""><button>Copy</button><input type="search">
			<label>Search <input type="search"></label><label for="x">I know this</label>`;
		expect(body(main)).toBe('Kept\n');
	});

	it('keeps a button in a heading, and a checkbox label', () => {
		const main = `<h3><button aria-expanded="false">Is LangX free?</button></h3>
			<ul><li><label><input type="checkbox"> <span>de</span></label></li></ul>`;
		expect(body(main)).toBe('### Is LangX free?\n\n- de\n');
	});

	it('reads role="img" as its label', () => {
		const main = `<div role="img" aria-label="A LangX chat"><p>Hola</p><p>09:12</p></div>
			<p>Rated <span role="img" aria-label="5 out of 5 stars">★★★★★</span></p>`;
		expect(body(main)).toBe('A LangX chat\n\nRated 5 out of 5 stars\n');
	});

	it('drops a table of contents but not links elsewhere', () => {
		const main = `<nav aria-label="On this page"><a href="#faq">FAQ</a></nav>
			<nav aria-label="Other languages"><a href="/tools/say/hola">Spanish</a></nav>`;
		expect(body(main)).toBe('[Spanish](https://langx.io/tools/say/hola)\n');
	});

	it('titles a card link and puts the rest after it', () => {
		const main = `<a href="/is-tandem-free"><span class="body">
			<span class="title">Is Tandem Free? What You Get Without Pro</span>
			<span class="excerpt">Chat, calls and corrections are free.</span>
			<span class="meta"><span>9 min read</span><span class="tag">Comparison</span></span>
		</span></a>`;
		expect(body(main)).toBe(
			'[Is Tandem Free? What You Get Without Pro](https://langx.io/is-tandem-free)' +
				' — Chat, calls and corrections are free. 9 min read Comparison\n'
		);
	});

	it('sets apart inline elements that touch', () => {
		const main = '<p><span>Guide</span><span>Vocabulary</span></p><h1>Tools for<br>you</h1>';
		expect(body(main)).toBe('Guide Vocabulary\n\n# Tools for you\n');
	});

	it('writes a table caption above the table', () => {
		const main = `<table><caption>Words in both</caption><thead><tr><th>Word</th><th>Rank</th></tr>
			</thead><tbody><tr><td>en</td><td>#10</td></tr></tbody></table>`;
		expect(body(main)).toBe('Words in both\n\n| Word | Rank |\n| - | - |\n| en | #10 |\n');
	});

	it('refuses a page with no <main>', () => {
		expect(() => htmlToMarkdown('<html><head></head><body></body></html>')).toThrow('<main>');
	});
});
