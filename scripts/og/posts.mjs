// Cuts a social card for every blog post that names one it does not have yet:
// a post whose front matter says `coverImage: /images/posts/<file>.png` and
// whose file is missing from static/ gets it drawn from `post-card.html`.
// Existing images are never overwritten; delete one to redraw it. Each drawn
// card also gets a square `<file>-thumb.png` for post lists (a wide card
// cropped square cuts its title in half), written into the post as
// `thumbnail:`.
//
//   node scripts/og/posts.mjs            every post
//   node scripts/og/posts.mjs slug ...   only these posts
//
// CHROME=/path/to/binary overrides the lookup below, as in render.mjs.
import { execFileSync } from 'node:child_process';
import {
	copyFileSync,
	existsSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(here, '../..');
const posts = join(root, 'src/routes/(blog-article)');
const template = join(here, 'post-card.html');
const thumbTemplate = join(here, 'post-thumb.html');

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

/** Screenshots `url` at `width`x`height` into `out`. */
const shoot = (url, width, height, out) => {
	const profile = mkdtempSync(join(tmpdir(), 'langx-og-'));
	const shot = join(profile, 'shot.png');
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
					`--window-size=${width},${height}`,
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
	} finally {
		rmSync(profile, { recursive: true, force: true });
	}
};

const kindFor = (eyebrow) =>
	eyebrow === 'Comparison' ? 'compare' : eyebrow === 'Words' ? 'words' : 'guide';

const only = process.argv.slice(2);

let drawn = 0;
for (const dir of readdirSync(posts, { withFileTypes: true })) {
	if (!dir.isDirectory()) continue;
	if (only.length && !only.includes(dir.name)) continue;
	const file = join(posts, dir.name, '+page.md');
	if (!existsSync(file)) continue;
	let src = readFileSync(file, 'utf8');
	const cover = field(src, 'coverImage');
	const title = field(src, 'title');
	if (!cover || !title || !cover.startsWith('/images/posts/') || !cover.endsWith('.png')) continue;
	const out = join(root, 'static', cover);
	if (existsSync(out)) continue;

	const eyebrow = eyebrowFor(src);
	shoot(`file://${template}?${new URLSearchParams({ title, eyebrow })}`, 1200, 630, out);
	console.log(`Wrote ${cover}`);

	// A drawn card also gets a square for post lists, and the post says so.
	const thumb = cover.replace(/\.png$/, '-thumb.png');
	shoot(
		`file://${thumbTemplate}?${new URLSearchParams({ kind: kindFor(eyebrow) })}`,
		176,
		176,
		join(root, 'static', thumb)
	);
	if (!/^thumbnail:/m.test(src)) {
		src = src.replace(/^coverImage:.*$/m, (line) => `${line}\nthumbnail: ${thumb}`);
		writeFileSync(file, src);
	}
	drawn++;
}
console.log(drawn ? `${drawn} card(s) drawn.` : 'Every post already has its card.');
