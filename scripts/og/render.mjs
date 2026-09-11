// Cuts `static/images/site-preview.png` from `site-preview.html`.
//
// Headless Chrome is the whole toolchain — no image library, nothing to keep
// installed beyond a browser — and it rasterises the card at 1:1, which reads
// sharper than rendering at 2x and scaling back down. Run it after editing the
// template:
//
//   node scripts/og/render.mjs
//
// CHROME=/path/to/binary overrides the lookup below.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const template = join(here, 'site-preview.html');
const out = resolve(here, '../../static/images/site-preview.png');

// The 1.91:1 every scraper crops to. `src/lib/data/meta.ts` declares the same
// numbers to the scrapers, so the two move together.
const WIDTH = 1200;
const HEIGHT = 630;

const chrome = [
	process.env.CHROME,
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

// A throwaway profile keeps the render out of the user's own Chrome.
const profile = mkdtempSync(join(tmpdir(), 'langx-og-'));
const shot = join(profile, 'shot.png');

try {
	try {
		execFileSync(
			chrome,
			[
				'--headless=new',
				`--user-data-dir=${profile}`,
				'--no-sandbox',
				'--no-first-run',
				'--no-default-browser-check',
				'--hide-scrollbars',
				// Without these the browser wakes its updater and sits there long
				// after the PNG is on disk.
				'--disable-background-networking',
				'--disable-component-update',
				'--disable-sync',
				'--disable-default-apps',
				// The template pulls Nunito and the avatar off disk.
				'--allow-file-access-from-files',
				`--window-size=${WIDTH},${HEIGHT}`,
				// Long enough for the webfont and the avatar to land before the shot.
				'--virtual-time-budget=4000',
				`--screenshot=${shot}`,
				`file://${template}`
			],
			{ stdio: ['ignore', 'ignore', 'ignore'], timeout: 45_000 }
		);
	} catch (error) {
		// Chrome writes the PNG and then sometimes declines to exit. The file is
		// what we came for, so only a missing one is a real failure.
		if (!existsSync(shot)) throw error;
	}

	copyFileSync(shot, out);
	console.log(`Wrote ${out} — ${WIDTH}x${HEIGHT}, ${(statSync(out).size / 1024).toFixed(0)} KB`);
} finally {
	rmSync(profile, { recursive: true, force: true });
}
