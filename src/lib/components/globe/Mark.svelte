<script lang="ts">
	/**
	 * The logo mark, extruded and turning, for the closing section. Loads
	 * Three.js after mount like the globe does, follows the theme, pauses
	 * off-screen, and falls back to the flat mark where there is no WebGL.
	 */
	import { onMount } from 'svelte';
	import Logo from '$lib/components/atoms/Logo.svelte';
	import type { MarkColors, MarkHandle } from './mark';

	/** Width and height of the mark, in px. */
	export let size = 96;

	let container: HTMLDivElement;
	let failed = false;

	function readColors(): MarkColors {
		const style = getComputedStyle(container);
		const token = (name: string) => style.getPropertyValue(`--color--${name}`).trim();
		return { ink: token('text'), yellow: token('primary') };
	}

	onMount(() => {
		let handle: MarkHandle | undefined;
		let cancelled = false;
		const cleanups: Array<() => void> = [];

		import('./mark').then(({ createMark }) => {
			if (cancelled) return;
			try {
				handle = createMark(container, {
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

{#if failed}
	<Logo variant="mark" height={Math.round(size * 0.55)} href={undefined} />
{:else}
	<div class="mark" style="--size:{size}px" aria-hidden="true" bind:this={container} />
{/if}

<style lang="scss">
	.mark {
		width: var(--size);
		height: var(--size);

		:global(canvas) {
			display: block;
			width: 100%;
			height: 100%;
		}
	}
</style>
