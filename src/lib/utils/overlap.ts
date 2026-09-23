/** How deep each pair is compared: `DEPTH` in scripts/wordlists/build-pairs.ts. */
export const PAIR_DEPTH = 2000;

/**
 * How far apart the centres of two equal circles of radius 1 sit so that the
 * lens where they meet is `share` of either circle's area — so the picture of
 * a pair is to scale rather than a decoration: Bosnian and Serbian nearly one
 * circle, Albanian and Croatian barely touching. The lens shrinks as the
 * circles part, so a bisection finds the distance.
 */
export function overlapDistance(share: number): number {
	const f = Math.min(Math.max(share, 0), 1);
	const lens = (d: number) => (2 * Math.acos(d / 2) - (d / 2) * Math.sqrt(4 - d * d)) / Math.PI;
	let near = 0;
	let far = 2;
	for (let i = 0; i < 40; i++) {
		const mid = (near + far) / 2;
		if (lens(mid) > f) near = mid;
		else far = mid;
	}
	return (near + far) / 2;
}

/** "8%", and "under 1%" rather than a 0% for a pair that does share words. */
export const sharePercent = (count: number) => {
	const pct = Math.round((count / PAIR_DEPTH) * 100);
	return pct < 1 ? 'under 1%' : `${pct}%`;
};
