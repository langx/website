import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

// Text on a colour block is ink in both schemes, so each hue, light and dark,
// must hold ink at WCAG AA (4.5:1) on its own. Read from the stylesheet so a
// hue edited there is measured here.
const scss = readFileSync(new URL('./_themes.scss', import.meta.url), 'utf8');

function block(name: string): Record<string, string> {
	const body = scss.slice(scss.indexOf(`@mixin ${name}`)).split('}')[0];
	return Object.fromEntries(
		[...body.matchAll(/define-color\('([a-z-]+)', (#[0-9a-f]{6})\)/g)].map((m) => [m[1], m[2]])
	);
}

function luminance(hex: string): number {
	const [r, g, b] = [1, 3, 5].map((i) => {
		const c = parseInt(hex.slice(i, i + 2), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

const INK = '#14161b';

describe('colour blocks', () => {
	for (const scheme of ['hues-light', 'hues-dark']) {
		const hues = block(scheme);
		it(`has six hues in ${scheme}`, () => expect(Object.keys(hues)).toHaveLength(6));
		for (const [hue, hex] of Object.entries(hues)) {
			it(`holds ink on ${hue} (${scheme}) at 4.5:1`, () => {
				expect(contrast(INK, hex)).toBeGreaterThanOrEqual(4.5);
			});
		}
	}

	it('holds white on the blue block and ink on the yellow', () => {
		const c = block('constants');
		expect(contrast(c['on-blue'], c.blue)).toBeGreaterThanOrEqual(4.5);
		expect(contrast(c['on-primary'], c.primary)).toBeGreaterThanOrEqual(4.5);
	});
});
