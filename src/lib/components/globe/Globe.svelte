<script lang="ts">
	/**
	 * A globe with arcs linking cities, for the hero. Three.js is loaded on
	 * the client only, after mount, so the page prerenders without it and the
	 * chunk only ships to the homepage.
	 *
	 * Colours come from the theme tokens on the element itself, so the globe
	 * follows the light/dark switch. It stops rendering while off-screen or in
	 * a hidden tab, and under reduced motion it draws one complete frame.
	 */
	import { onMount } from 'svelte';
	import type { GlobeColors, GlobeHandle } from './scene';

	export let label: string;

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

		import('./scene').then(({ createGlobe }) => {
			if (cancelled) return;
			try {
				handle = createGlobe(container, {
					colors: readColors(),
					animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches
				});
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
