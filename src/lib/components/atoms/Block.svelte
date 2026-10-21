<script lang="ts">
	import type { Snippet } from 'svelte';

	type Hue = 'tangerine' | 'lime' | 'mint' | 'aqua' | 'sky' | 'lilac' | 'blue';

	interface Props {
		/**
		 * The block's colour. A hue paints the full width and sets the text to
		 * ink in both schemes; no hue leaves the page's own ground.
		 */
		hue?: Hue;
		/** Vertical rhythm: `hero` sits under the header, `chapter` and `section` between blocks. */
		pad?: 'hero' | 'chapter' | 'section' | 'none';
		/** `section` with a heading, or `div` for a block that is only colour. */
		as?: 'section' | 'div';
		id?: string;
		labelledby?: string;
		label?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		hue,
		pad = 'chapter',
		as = 'section',
		id,
		labelledby,
		label,
		class: className = '',
		children
	}: Props = $props();
</script>

<!--
	One full-width colour block, the unit every v3 page is built from. The
	content sits in the 1080px column (180px either side at 1440; a 16px gutter
	on a phone).
-->
<svelte:element
	this={as}
	{id}
	class="block pad-{pad} {className}"
	data-hue={hue}
	aria-labelledby={labelledby}
	aria-label={label}
>
	<div class="inner">
		{@render children?.()}
	</div>
</svelte:element>

<style lang="scss">
	.block {
		width: 100%;
	}

	.inner {
		width: 100%;
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding-inline: 16px;

		@media (min-width: 768px) {
			padding-inline: 32px;
			max-width: calc(var(--container-max) + 64px);
		}
	}

	.pad-hero {
		padding-block: 32px 40px;

		@media (min-width: 900px) {
			padding-block: 72px 96px;
		}
	}
	.pad-chapter {
		padding-block: 32px 0;

		@media (min-width: 900px) {
			padding-block: 96px;
		}
	}
	.pad-section {
		padding-block: 40px;

		@media (min-width: 900px) {
			padding-block: 80px;
		}
	}
</style>
