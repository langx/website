// Makes the WebP copies of every photo cover — a post whose front matter has a
// `coverImage:` that is a PNG or a JPEG and no drawn `thumbnail:` — that the
// pages show in its place:
//
//   <file>.webp          the cover at full size, above the post
//   <file>-square.webp   176px square, for the 88px tile in post lists
//
// The original stays where it is: social cards and the feed still point at it,
// and a scraper that cannot read WebP is not worth losing a preview to. A post
// whose copies are missing just keeps showing the original (see `coverWebp` in
// src/lib/data/blog-posts/utils.ts). Existing copies are never overwritten;
// delete one to make it again.
//
//   node scripts/covers.mjs
//
// Needs ImageMagick 7 (`magick`) on the PATH.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const posts = join(root, 'src/routes/(blog-article)');
const QUALITY = '80';

let made = 0;
for (const slug of readdirSync(posts)) {
	const file = join(posts, slug, '+page.md');
	if (!existsSync(file)) continue;
	const front = readFileSync(file, 'utf8').split(/^---$/m)[1] ?? '';
	const cover = front.match(/^coverImage:\s*'?([^'\s]+)'?\s*$/m)?.[1];
	if (!cover || /^thumbnail:/m.test(front)) continue;
	const base = cover.replace(/\.(png|jpe?g)$/i, '');
	if (base === cover) continue;

	const source = join(root, 'static', cover);
	if (!existsSync(source)) continue;
	const full = join(root, 'static', `${base}.webp`);
	const square = join(root, 'static', `${base}-square.webp`);

	if (!existsSync(full)) {
		execFileSync('magick', [source, '-quality', QUALITY, full]);
		made++;
	}
	if (!existsSync(square)) {
		// `^` fills the square, the crop takes its middle: what object-fit: cover did.
		execFileSync('magick', [
			source,
			'-resize',
			'176x176^',
			'-gravity',
			'center',
			'-extent',
			'176x176',
			'-quality',
			QUALITY,
			square
		]);
		made++;
	}
}
console.log(`${made} file${made === 1 ? '' : 's'} written`);
