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
 * The registered actions that are currently on screen. A page can carry more
 * than one — the homepage asks in the hero and again at the end — so the
 * header follows how many are visible, not whichever observer fired last.
 */
const onScreen = new Set<HTMLElement>();

function sync() {
	primaryCtaInView.set(onScreen.size > 0);
}

export function ownsPrimary(node: HTMLElement): { destroy(): void } {
	if (typeof IntersectionObserver === 'undefined') {
		onScreen.add(node);
		sync();
		return {
			destroy() {
				onScreen.delete(node);
				sync();
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
			sync();
		}
	};
}
