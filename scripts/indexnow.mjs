// Tells IndexNow (Bing, Yandex, Seznam, Naver and the other engines that read
// it) which langx.io pages changed, so they recrawl them without waiting.
// Google does not take part; it finds changes through the sitemap in
// robots.txt.
//
//   node scripts/indexnow.mjs --changed <from-sha> <to-sha>   pages a push changed
//   node scripts/indexnow.mjs --all                           every page in the live sitemap
//   node scripts/indexnow.mjs https://langx.io/compare ...    these pages
//
// The key is public by design: IndexNow checks it by fetching
// https://langx.io/<key>.txt, which is the file in static/ named after it.
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HOST = 'langx.io';
const SITE = `https://${HOST}`;
const staticDir = fileURLToPath(new URL('../static/', import.meta.url));
const keyFile = readdirSync(staticDir).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('No IndexNow key file in static/.');
const key = keyFile.slice(0, -4);

/** Source files a push touched, mapped to the pages they build. */
function changedPages(from, to) {
	const files = execFileSync('git', ['diff', '--name-only', `${from}..${to}`], {
		encoding: 'utf8'
	})
		.split('\n')
		.filter(Boolean);
	const urls = new Set();
	for (const f of files) {
		const post = f.match(/^src\/routes\/\(blog-article\)\/([^/+][^/]*)\/\+page\.md$/);
		if (post) {
			urls.add(`${SITE}/${post[1]}`);
			urls.add(`${SITE}/blog`);
			continue;
		}
		const page = f.match(/^src\/routes\/\(site\)\/([a-z-]+)\/\+page\.(svelte|server\.ts)$/);
		if (page) urls.add(`${SITE}/${page[1]}`);
		if (f === 'src/routes/(site)/+page.svelte' || f === 'src/lib/data/faq.ts') urls.add(`${SITE}/`);
	}
	return [...urls];
}

async function allPages() {
	const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const urls =
	args[0] === '--changed'
		? changedPages(args[1], args[2])
		: args[0] === '--all'
		? await allPages()
		: args;

if (!urls.length) {
	console.log('No pages to submit.');
	process.exit(0);
}

// One request takes up to 10,000 URLs.
for (let i = 0; i < urls.length; i += 10000) {
	const urlList = urls.slice(i, i + 10000);
	const res = await fetch('https://api.indexnow.org/indexnow', {
		method: 'POST',
		headers: { 'content-type': 'application/json; charset=utf-8' },
		body: JSON.stringify({ host: HOST, key, keyLocation: `${SITE}/${keyFile}`, urlList })
	});
	// 200 and 202 both mean accepted; anything else is worth reading.
	console.log(`IndexNow: ${res.status} for ${urlList.length} URL(s)`);
	if (res.status >= 300) console.log(await res.text());
}
