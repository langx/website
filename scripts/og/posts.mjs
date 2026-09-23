// Cuts a social card for every blog post that names one it does not have yet:
// a post whose front matter says `coverImage: /images/posts/<file>.png` and
// whose file is missing from static/ gets it drawn from `post-card.html`.
// Existing images are never overwritten; delete one to redraw it.
//
//   node scripts/og/posts.mjs
//
// CHROME=/path/to/binary overrides the lookup below, as in render.mjs.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(here, '../..');
const posts = join(root, 'src/routes/(blog-article)');
const template = join(here, 'post-card.html');

// The headless shell first where it exists: new-headless Chrome keeps part of
// the window for browser UI, so the page gets a viewport shorter than the
// screenshot and the bottom of the card comes out blank.
const chrome = [
	process.env.CHROME,
	'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/Applications/Chromium.app/Contents/MacOS/Chromium',
	'/usr/bin/google-chrome',
	'/usr/bin/chromium'
]
	.filter(Boolean)
	.find((path) => existsSync(path));

if (!chrome) {
	console.error('No Chrome found. Set CHROME=/path/to/chrome and run again.');
	process.exit(1);
}

/** The first matching front-matter line, unquoted. Enough for these files. */
const field = (src, name) => {
	const m = src.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
	if (!m) return undefined;
	let v = m[1].trim();
	if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1).replace(/''/g, "'");
	else if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
	return v;
};

/** The eyebrow says what kind of post it is, from its tags. */
const eyebrowFor = (src) => {
	if (/^\s+- Comparison$/m.test(src)) return 'Comparison';
	if (/^\s+- Vocabulary$/m.test(src)) return 'Words';
	if (/^\s+- Guide$/m.test(src)) return 'Guide';
	return 'LangX Blog';
};

let drawn = 0;
for (const dir of readdirSync(posts, { withFileTypes: true })) {
	if (!dir.isDirectory()) continue;
	const file = join(posts, dir.name, '+page.md');
	if (!existsSync(file)) continue;
	const src = readFileSync(file, 'utf8');
	const cover = field(src, 'coverImage');
	const title = field(src, 'title');
	if (!cover || !title || !cover.startsWith('/images/posts/') || !cover.endsWith('.png')) continue;
	const out = join(root, 'static', cover);
	if (existsSync(out)) continue;

	const profile = mkdtempSync(join(tmpdir(), 'langx-og-'));
	const shot = join(profile, 'shot.png');
	const url = `file://${template}?${new URLSearchParams({ title, eyebrow: eyebrowFor(src) })}`;
	try {
		try {
			execFileSync(
				chrome,
				[
					...(chrome.includes('headless_shell') ? [] : ['--headless=new']),
					`--user-data-dir=${profile}`,
					'--no-sandbox',
					'--no-first-run',
					'--hide-scrollbars',
					'--disable-background-networking',
					'--disable-component-update',
					'--disable-sync',
					'--allow-file-access-from-files',
					'--window-size=1200,630',
					'--virtual-time-budget=3000',
					`--screenshot=${shot}`,
					url
				],
				{ stdio: ['ignore', 'ignore', 'ignore'], timeout: 45_000 }
			);
		} catch (error) {
			if (!existsSync(shot)) throw error;
		}
		copyFileSync(shot, out);
		drawn++;
		console.log(`Wrote ${cover}`);
	} finally {
		rmSync(profile, { recursive: true, force: true });
	}
}
console.log(drawn ? `${drawn} card(s) drawn.` : 'Every post already has its card.');
