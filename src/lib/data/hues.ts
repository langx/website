/**
 * Which partner hue each part of the site wears: the colour of its first
 * block, and of the header at the top of the page. One map, so a section
 * and its header can never disagree. Blog posts take their tag's colour
 * instead (see the post layout).
 */
export type Hue = 'tangerine' | 'lime' | 'mint' | 'aqua' | 'sky' | 'lilac';

const BY_PREFIX: [prefix: string, hue: Hue][] = [
	['/tools', 'lime'],
	['/faq', 'aqua'],
	['/plans', 'sky'],
	['/blog', 'sky'],
	['/download', 'lilac'],
	['/welcome-back', 'lilac'],
	['/tokens', 'tangerine'],
	['/compare', 'mint'],
	['/404', 'mint'],
	['/privacy-policy', 'sky'],
	['/terms-conditions', 'sky'],
	['/cookie-policy', 'sky'],
	['/community-guidelines', 'sky'],
	['/data-deletion', 'sky']
];

export function hueFor(path: string): Hue | undefined {
	if (path === '/') return 'lilac';
	return BY_PREFIX.find(([p]) => path === p || path.startsWith(`${p}/`))?.[1];
}
