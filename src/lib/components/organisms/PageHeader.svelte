<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import { hueFor, type Hue } from '$lib/data/hues';

	interface Props {
		/** The ink chip above the title: what kind of page this is. */
		eyebrow?: string | undefined;
		title: string;
		lede?: string | undefined;
		/** The block's colour; by default the one the section wears (data/hues.ts). */
		hue?: Hue;
		/** Anything that belongs on the block under the lede (a link, a search). */
		children?: Snippet;
	}

	let { eyebrow = undefined, title, lede = undefined, hue, children }: Props = $props();

	const colour = $derived(hue ?? hueFor(page.url.pathname) ?? 'sky');
</script>

<!--
	A page's first block: its section's hue, full width even inside the page's
	column, with the title in Nunito 900. Nothing on it is hidden at the start,
	so the pages that ship no script (the legal pages, tokens, welcome-back)
	show it whole.
-->
<header class="page-header" data-hue={colour}>
	<div class="inner">
		{#if eyebrow}<Tag tone="ink">{eyebrow}</Tag>{/if}
		<h1 class="display-chapter">{title}</h1>
		{#if lede}<p class="lede">{lede}</p>{/if}
		{@render children?.()}
	</div>
</header>

<style lang="scss">
	// Full bleed from inside a .container: html clips the sideways overflow.
	.page-header {
		width: 100vw;
		margin-left: calc(50% - 50vw);
		margin-bottom: 40px;

		@media (min-width: 900px) {
			margin-bottom: 64px;
		}
	}

	.inner {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding: 32px 16px 40px;

		@media (min-width: 768px) {
			max-width: calc(var(--container-max) + 64px);
			padding-inline: 32px;
		}

		@media (min-width: 900px) {
			gap: 20px;
			padding-block: 56px 72px;
		}
	}

	h1 {
		max-width: 16ch;
	}

	.lede {
		margin: 0;
		max-width: 600px;
		color: inherit;
		font-size: 1.0625rem;
		line-height: 1.5;
		font-weight: 500;

		@media (min-width: 900px) {
			font-size: 1.1875rem;
		}
	}
</style>
