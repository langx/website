// Markdown for agents: every page on langx.io also answers in Markdown, to a
// client that asks for it with `Accept: text/markdown`. This is what
// Cloudflare's own "Markdown for Agents" setting does, and that setting needs
// a Pro plan; langx.io is on Free, so the site does it itself, in three parts.
//
// 1. This script, run after the build (`postbuild`), writes a Markdown twin
//    beside every prerendered page: build/blog.html gets build/blog.md,
//    build/index.html gets build/index.md. The conversion is in
//    html-to-markdown.mjs. The twins are ordinary files, so /blog.md is also
//    a URL anyone can fetch.
//
// 2. Two URL Rewrite Rules on the langx.io zone, in the Cloudflare dashboard
//    under Rules, send a request that accepts Markdown to the twin. The
//    visitor's URL does not change; Pages is asked for the .md.
//
//      "Markdown for agents: home"
//        http.host eq "langx.io" and http.request.uri.path eq "/"
//        and any(http.request.headers["accept"][*] contains "text/markdown")
//        → path rewritten (static) to /index.md
//
//      "Markdown for agents: pages"
//        http.host eq "langx.io"
//        and any(http.request.headers["accept"][*] contains "text/markdown")
//        and http.request.uri.path.extension eq ""
//        and not ends_with(http.request.uri.path, "/")
//        and not starts_with(http.request.uri.path, "/relay/")
//        → path rewritten (dynamic) to concat(http.request.uri.path, ".md")
//
//    Files with an extension (scripts, images, sitemap.xml, llms.txt) are
//    left alone, and so is a path ending in a slash: Pages answers /blog/
//    with a 308 to /blog, where the rule then applies.
//
// 3. static/_headers gives the twins `Vary: Accept` and the content signal
//    Cloudflare sends with its own Markdown. Pages already serves .md files
//    as text/markdown; charset=utf-8.
//
// Why a rewrite at the edge, and not a Pages Function choosing between the
// two: the zone's cache rule keeps every langx.io response for a day, keyed
// by URL alone. A Function that answered /blog in HTML to one client and in
// Markdown to the next would have whichever came first cached and served to
// both, and browsers would be handed Markdown. A rewrite happens before the
// cache, so /blog and /blog.md are two entries and neither can stand in for
// the other. It also costs nothing per request, where a Function counts
// against the Free plan's daily allowance.
//
// If the rules are ever removed, agents get the HTML again, as they did
// before; nothing else depends on them. If they are added before a deploy
// with the twins, agents get 404s until it lands.
//
// Last, redirects. A redirected path has no twin — /pro became /plans — so
// the rule would send an agent's /pro to a /pro.md that 404s. Each plain
// redirect in _redirects gets a copy for its .md: /pro.md goes to /plans, and
// the agent asks /plans for Markdown in turn.
//
// And llms-full.txt: the twins of every page at the top level of the site
// (the app pages, the guides and comparisons, the legal pages, the blog and
// tools indexes) in one file, for an agent that would rather read the site
// than crawl it. /llms.txt points to it. The tool pages, a thousand of them,
// stay out; their indexes say where they are.
import { appendFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { htmlToMarkdown } from './html-to-markdown.mjs';

const SITE = 'https://langx.io';
const BUILD = fileURLToPath(new URL('../build/', import.meta.url));

/** Every .html under build/, as paths relative to it. @param {string} dir */
function pages(dir) {
	/** @type {string[]} */
	const found = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			// The JavaScript and CSS bundles, which hold no pages.
			if (relative(BUILD, path) !== '_app') found.push(...pages(path));
		} else if (entry.name.endsWith('.html')) {
			found.push(relative(BUILD, path));
		}
	}
	return found;
}

/**
 * Write the twins of some pages.
 * @param {string[]} files
 * @returns {{ written: number, htmlBytes: number, markdownBytes: number }}
 */
function convert(files) {
	const totals = { written: 0, htmlBytes: 0, markdownBytes: 0 };
	for (const file of files) {
		const html = readFileSync(join(BUILD, file), 'utf8');
		let result;
		try {
			result = htmlToMarkdown(html);
		} catch (error) {
			throw new Error(`build/${file}: ${/** @type {Error} */ (error).message}`);
		}
		if (!result) continue;

		// The edge rule maps /x to /x.md, so the twin has to sit where the page
		// is served from, and every page is served at its canonical URL.
		const route = file
			.split(sep)
			.join('/')
			.replace(/\.html$/, '');
		const path = route === 'index' ? '/' : `/${route}`;
		if (result.url !== `${SITE}${path}`) {
			throw new Error(`build/${file} is served at ${path} but its canonical URL is ${result.url}`);
		}

		writeFileSync(join(BUILD, file.replace(/\.html$/, '.md')), result.markdown);
		totals.written++;
		totals.htmlBytes += Buffer.byteLength(html);
		totals.markdownBytes += Buffer.byteLength(result.markdown);
	}
	return totals;
}

// 141 MB of HTML takes the better part of a minute on one core, so the pages
// are dealt out to a worker per core. Each worker is this file again.
if (!isMainThread) {
	parentPort?.postMessage(convert(workerData));
} else {
	const started = performance.now();
	const files = pages(BUILD);
	const workers = Math.min(availableParallelism(), 8);
	/** @param {string[]} share @returns {Promise<ReturnType<typeof convert>>} */
	const run = (share) =>
		new Promise((resolve, reject) => {
			const worker = new Worker(new URL(import.meta.url), { workerData: share });
			worker.once('message', resolve);
			worker.once('error', reject);
		});
	// Dealt round-robin, so the fifty-odd 1 MB word lists, which sit together
	// in one directory, are spread over every worker.
	const totals = await Promise.all(
		Array.from({ length: workers }, (_, w) => run(files.filter((_, i) => i % workers === w)))
	);
	const sum = (/** @type {'written' | 'htmlBytes' | 'markdownBytes'} */ key) =>
		totals.reduce((total, t) => total + t[key], 0);

	// The home page first, then the rest in path order.
	const full = files
		.filter((file) => !file.includes(sep) && file !== '404.html')
		.map((file) => file.replace(/\.html$/, '.md'))
		.sort((x, y) => (x === 'index.md' ? -1 : y === 'index.md' ? 1 : x.localeCompare(y)))
		.map((file) => readFileSync(join(BUILD, file), 'utf8'));
	writeFileSync(
		join(BUILD, 'llms-full.txt'),
		[
			'# LangX, in full',
			'',
			`> Every page at the top level of ${SITE}, as Markdown, one after another; each starts with its title, description and URL. The index is ${SITE}/llms.txt.`,
			'',
			...full
		].join('\n')
	);

	const redirectsFile = join(BUILD, '_redirects');
	const redirects = existsSync(redirectsFile) ? readFileSync(redirectsFile, 'utf8') : '';
	const MARK = '# Added by scripts/markdown.mjs';
	const twins = redirects
		.split('\n')
		.map((line) => line.trim().split(/\s+/))
		// A plain page path: the rule leaves slashes and extensions alone, and a
		// splat or placeholder has no single .md to point at.
		.filter(([from]) => from.startsWith('/') && !from.endsWith('/') && !/[*:.]/.test(from))
		.map(([from, ...rest]) => `${from}.md  ${rest.join('  ')}`);
	// Once per build, should the script be run again by hand.
	if (twins.length && !redirects.includes(MARK)) {
		appendFileSync(
			redirectsFile,
			[
				'',
				`${MARK}: the same redirects for an agent asking for`,
				'# Markdown, whose /pro reaches Pages as /pro.md.',
				...twins,
				''
			].join('\n')
		);
	}

	const mb = (/** @type {number} */ bytes) => `${(bytes / 1e6).toFixed(1)} MB`;
	console.log(
		`Markdown: ${sum('written')} pages, ${mb(sum('htmlBytes'))} of HTML as ` +
			`${mb(sum('markdownBytes'))}, ${full.length} in llms-full.txt, ${twins.length} redirects, ` +
			`in ${((performance.now() - started) / 1000).toFixed(1)}s`
	);
}
