<script lang="ts">
	/**
	 * A globe with arcs linking cities. Three.js is loaded on the client only,
	 * after mount, so the page prerenders without it and the chunk only ships
	 * to the homepage.
	 *
	 * Colours come from the theme tokens on the element itself, so the globe
	 * follows the light/dark switch. It stops rendering while off-screen or in
	 * a hidden tab, and under reduced motion it draws one complete frame.
	 */
	import { onMount } from 'svelte';
	import { loadGsap } from '$lib/utils/reveal';
	import type { GlobeColors, GlobeHandle, GlobeOptions } from './scene';

	export let label: string;
	/** Two cities and one arc between them, instead of the whole world. */
	export let pair: GlobeOptions['pair'] = undefined;
	/** Turn and tip the globe as it scrolls through the viewport. */
	export let scroll = false;

	let container: HTMLDivElement;
	let failed = false;

	function readColors(): GlobeColors {
		const style = getComputedStyle(container);
		const token = (name: string) => style.getPropertyValue(`--color--${name}`).trim();
		return {
			surface: token('muted'),
			dots: token('text-tertiary'),
			arc: token('accent'),
			city: token('primary')
		};
	}

	onMount(() => {
		let handle: GlobeHandle | undefined;
		let cancelled = false;
		const cleanups: Array<() => void> = [];
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		import('./scene').then(({ createGlobe }) => {
			if (cancelled) return;
			try {
				handle = createGlobe(container, { colors: readColors(), animate: !reduced, pair });
			} catch {
				failed = true;
				return;
			}

			const recolor = () => handle?.setColors(readColors());
			const themeAttr = new MutationObserver(recolor);
			themeAttr.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ['data-theme']
			});
			const scheme = window.matchMedia('(prefers-color-scheme: dark)');
			scheme.addEventListener('change', recolor);

			let visible = true;
			const sync = () => handle?.setPaused(!visible || document.hidden);
			const inView = new IntersectionObserver(([entry]) => {
				visible = entry.isIntersecting;
				sync();
			});
			inView.observe(container);
			document.addEventListener('visibilitychange', sync);

			cleanups.push(() => {
				themeAttr.disconnect();
				scheme.removeEventListener('change', recolor);
				inView.disconnect();
				document.removeEventListener('visibilitychange', sync);
			});

			// The page's scroll position drives the globe directly (scrub), so
			// it moves exactly as far as the reader does and stops when they do.
			if (scroll && !reduced) {
				loadGsap().then(({ ScrollTrigger }) => {
					if (cancelled) return;
					const trigger = ScrollTrigger.create({
						trigger: container,
						start: 'top bottom',
						end: 'bottom top',
						scrub: true,
						onUpdate: (self) => handle?.setScroll(self.progress)
					});
					cleanups.push(() => trigger.kill());
				});
			}
		});

		return () => {
			cancelled = true;
			for (const cleanup of cleanups) cleanup();
			handle?.destroy();
		};
	});
</script>

<div class="globe" class:failed role="img" aria-label={label} bind:this={container} />

<style lang="scss">
	.globe {
		width: 100%;
		aspect-ratio: 1;
		max-width: 520px;
		margin: 0 auto;

		&.failed {
			display: none;
		}

		:global(canvas) {
			display: block;
			width: 100%;
			height: 100%;
			touch-action: pan-y;
		}
	}
</style>
