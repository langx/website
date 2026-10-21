// Guards on what `npm run build` writes to build/. The redesign moves every
// page's markup, and these are the things a redesign must not move: the URLs
// that are already indexed, the feed readers' links, one canonical per page,
// and the no-JS pages' promise that nothing on them starts hidden.
//
// They read build/, so they run after a build (CI builds first) and are
// skipped when there is none. The fixtures are the sitemap and the feed as
// they stood at fcf49ea, before the redesign started.
import { describe, expect, it } from 'vitest';
import {
	closeSync,
	existsSync,
	openSync,
	readFileSync,
	readSync,
	readdirSync,
	statSync
} from 'node:fs';
import { join } from 'node:path';

const BUILD = 'build';
const built = existsSync(join(BUILD, 'index.html')) && existsSync(join(BUILD, 'sitemap.xml'));
const fixture = (name) =>
	readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8')
		.trim()
		.split('\n');

/** Every redirect source in _redirects, with and without its trailing slash. */
function redirectSources() {
	const file = join(BUILD, '_redirects');
	if (!existsSync(file)) return new Set();
	return new Set(
		readFileSync(file, 'utf8')
			.split('\n')
			.filter((l) => l.trim() && !l.startsWith('#'))
			.map((l) => l.trim().split(/\s+/)[0].replace(/\/$/, '') || '/')
	);
}

/** The file Cloudflare Pages would serve for a path, if there is one. */
function fileFor(path) {
	if (path === '/') return join(BUILD, 'index.html');
	const base = join(BUILD, decodeURIComponent(path));
	for (const f of [`${base}.html`, join(base, 'index.html')]) if (existsSync(f)) return f;
	return null;
}

/** The start of a file: enough for its <head>, without reading 140 MB of pages. */
function head(file, bytes = 48 * 1024) {
	const fd = openSync(file, 'r');
	const buf = Buffer.alloc(bytes);
	const n = readSync(fd, buf, 0, bytes, 0);
	closeSync(fd);
	const text = buf.subarray(0, n).toString('utf8');
	const end = text.indexOf('</head>');
	return end === -1 ? readFileSync(file, 'utf8') : text.slice(0, end);
}

function htmlFiles(dir) {
	const out = [];
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (name === '_app' || name === 'audio' || name === 'images') continue;
		if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
		else if (name.endsWith('.html')) out.push(p);
	}
	return out;
}

// The pages that ship no JavaScript (`csr = dev` in their +page.ts).
const NO_JS_PAGES = [
	'privacy-policy',
	'community-guidelines',
	'cookie-policy',
	'terms-conditions',
	'data-deletion',
	'welcome-back',
	'tokens',
	'download'
];

describe.skipIf(!built)('build output', () => {
	it('still answers every URL the sitemap had at fcf49ea', () => {
		const redirects = redirectSources();
		const missing = fixture('sitemap-fcf49ea.txt')
			.map((url) => new URL(url).pathname)
			.filter((path) => !fileFor(path) && !redirects.has(path.replace(/\/$/, '') || '/'));
		expect(missing).toEqual([]);
	});

	it('keeps every RSS item, with the same links', () => {
		const xml = readFileSync(join(BUILD, 'rss.xml'), 'utf8');
		const links = [...xml.matchAll(/<item>[\s\S]*?<link>([^<]*)<\/link>/g)].map((m) => m[1]);
		expect(links.length).toBeGreaterThanOrEqual(103);
		const gone = fixture('rss-links-fcf49ea.txt').filter((l) => !links.includes(l));
		expect(gone).toEqual([]);
	});

	it('gives every page one canonical, without a trailing slash', () => {
		const wrong = [];
		for (const file of htmlFiles(BUILD)) {
			if (file.endsWith('404.html')) continue;
			const html = head(file);
			const canonicals = [...html.matchAll(/rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
			const bad =
				canonicals.length !== 1 ||
				(canonicals[0] !== 'https://langx.io/' && canonicals[0].endsWith('/'));
			if (bad) wrong.push(`${file}: ${canonicals.join(', ') || 'none'}`);
		}
		expect(wrong).toEqual([]);
	}, 60_000);

	it.each(NO_JS_PAGES)('starts nothing hidden on /%s, which ships no JS', (page) => {
		const html = readFileSync(join(BUILD, `${page}.html`), 'utf8');
		const body = html.slice(html.indexOf('<body'));
		expect(body).not.toMatch(/data-reveal/);
		expect(body).not.toMatch(/class="[^"]*\b(is-in|rise|building)\b/);
		expect(body).not.toMatch(/style="[^"]*opacity:\s*0(?![.\d])/);
		expect(body).not.toMatch(/<(?!input)[a-z]+[^>]*\shidden(?=[\s>=])/);
	});
});
