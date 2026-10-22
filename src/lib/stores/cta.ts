import { writable } from 'svelte/store';

/**
 * Yellow appears once per viewport. A section that carries the page's
 * committing action (the hero, the closing call, the plans CTA, the
 * welcome-back CTA) registers itself with `ownsPrimary`; while one of them is
 * on screen the header's own button steps back to ink, and when the last one
 * scrolls away the header takes the yellow.
 */
export const primaryCtaInView = writable(false);

/**
 * Whether `primaryCtaInView` has heard from an observer yet. Until it has,
 * the header keeps the colour the server drew, so a page whose hero owns the
 * yellow never flashes a second yellow between hydration and the first
 * intersection report.
 */
export const ctaSettled = writable(false);

/**
 * Pages whose first screen carries the page's own yellow, on every width.
 * The header is drawn ink on them from the server, which also covers the
 * pages that ship no script (/download), where nothing would swap it.
 */
const HERO_OWNS_PRIMARY = new Set(['/', '/compare', '/download']);

export function heroOwnsPrimary(path: string): boolean {
	return HERO_OWNS_PRIMARY.has(path);
}

/**
 * The registered actions that are currently on screen. A page can carry more
 * than one — the homepage asks in the hero and again at the end — so the
 * header follows how many are visible, not whichever observer fired last.
 */
const onScreen = new Set<HTMLElement>();

/**
 * `settle` is true when an observer has actually reported. A section
 * unmounting on navigation is not a report, so it leaves ctaSettled alone;
 * the header resets it before each navigation.
 */
function sync(settle = true) {
	primaryCtaInView.set(onScreen.size > 0);
	if (settle) ctaSettled.set(true);
}

export function ownsPrimary(node: HTMLElement): { destroy(): void } {
	if (typeof IntersectionObserver === 'undefined') {
		onScreen.add(node);
		sync();
		return {
			destroy() {
				onScreen.delete(node);
				sync(false);
			}
		};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) onScreen.add(node);
				else onScreen.delete(node);
			}
			sync();
		},
		// The button is "in view" while any of it is on screen; the swap happens
		// the moment the last pixel leaves, which is when a sticky CTA earns
		// its colour.
		{ threshold: 0, rootMargin: '-64px 0px 0px 0px' }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
			onScreen.delete(node);
			sync(false);
		}
	};
}
