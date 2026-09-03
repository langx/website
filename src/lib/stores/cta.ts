import { writable } from 'svelte/store';

/**
 * Yellow appears once per viewport. A section that carries the page's
 * committing action (the hero, the plans CTA, the welcome-back CTA) registers
 * itself with `ownsPrimary`; while it is on screen the header's own button
 * steps back to ink, and when it scrolls away the header takes the yellow.
 */
export const primaryCtaInView = writable(false);

export function ownsPrimary(node: HTMLElement): { destroy(): void } {
	if (typeof IntersectionObserver === 'undefined') {
		primaryCtaInView.set(true);
		return { destroy: () => primaryCtaInView.set(false) };
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) primaryCtaInView.set(entry.isIntersecting);
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
			primaryCtaInView.set(false);
		}
	};
}
