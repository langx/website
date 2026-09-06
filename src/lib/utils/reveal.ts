import type { ActionReturn } from 'svelte/action';

/**
 * Plays an element (or, with `children`, each of its children in turn) into
 * place with GSAP once it scrolls into view — or on mount, for the hero.
 *
 * The element carries `data-reveal` (or `data-reveal-children`) in the
 * markup so the stylesheet can hide it before hydration; see global.scss.
 * GSAP and ScrollTrigger load on first use, in their own chunk, so the
 * prerendered page never touches them.
 */
export interface RevealOptions {
	/** Pixels to rise from. */
	y?: number;
	/** Pixels to slide in from; negative comes from the left. */
	x?: number;
	scale?: number;
	/** Seconds between children when `children` is set. */
	stagger?: number;
	delay?: number;
	/** Animate the node's children one after another instead of the node. */
	children?: boolean;
	/** Play on mount rather than when scrolled into view. */
	onLoad?: boolean;
}

type Gsap = typeof import('gsap').gsap;
type ScrollTriggerClass = typeof import('gsap/ScrollTrigger').ScrollTrigger;

let gsapReady: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerClass }> | undefined;

/** GSAP with ScrollTrigger registered, loaded once, in its own chunk. */
export function loadGsap() {
	gsapReady ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
		([{ gsap }, { ScrollTrigger }]) => {
			gsap.registerPlugin(ScrollTrigger);
			return { gsap, ScrollTrigger };
		}
	);
	return gsapReady;
}

export function reveal(
	node: HTMLElement,
	options: RevealOptions = {}
): ActionReturn<RevealOptions> {
	const {
		y = 32,
		x = 0,
		scale = 1,
		stagger = 0.08,
		delay = 0,
		children = false,
		onLoad = false
	} = options;

	// The stylesheet already shows everything for them; nothing to play.
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return {};

	const targets = children ? Array.from(node.children) : node;
	let cancelled = false;
	let tween: gsap.core.Tween | undefined;

	loadGsap().then(({ gsap }) => {
		if (cancelled) return;
		tween = gsap.fromTo(
			targets,
			{ autoAlpha: 0, y, x, scale },
			{
				autoAlpha: 1,
				y: 0,
				x: 0,
				scale: 1,
				duration: 0.8,
				ease: 'power3.out',
				stagger: children ? stagger : 0,
				delay,
				scrollTrigger: onLoad ? undefined : { trigger: node, start: 'top 85%', once: true }
			}
		);
	});

	return {
		destroy() {
			cancelled = true;
			tween?.scrollTrigger?.kill();
			tween?.kill();
		}
	};
}
