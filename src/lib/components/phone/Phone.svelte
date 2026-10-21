<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** What the screen shows, for screen readers: the phone is one image. */
		label: string;
		/** 320 on the pages, 300 inside a blog post. Never scaled. */
		width?: 300 | 320;
		/** Full height of the device; `cut` trims it. */
		height?: number;
		/**
		 * `always` draws the phone cut off at the bottom, running out of its
		 * block; `phone` does that only under 900px, where the next block cuts
		 * it off; `never` draws the whole device.
		 */
		cut?: 'never' | 'phone' | 'always';
		/** Height kept when the phone is cut. */
		cutHeight?: number;
		/** A dark screen (the call). */
		dark?: boolean;
		children?: Snippet;
	}

	let {
		label,
		width = 320,
		height = 660,
		cut = 'never',
		cutHeight = 470,
		dark = false,
		children
	}: Props = $props();
</script>

<!--
	The v3 device: a 9px ink bezel, 52px corners and a live HTML screen at the
	app's own sizes. It is shown at real size, never zoomed, so nothing inside
	drops under 12px.
-->
<div
	class="phone cut-{cut}"
	class:dark
	role="img"
	aria-label={label}
	style="--w:{width}px; --h:{height}px; --cut-h:{cutHeight}px"
>
	<div class="screen">
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.phone {
		position: relative;
		flex: 0 0 auto;
		width: var(--w);
		max-width: 100%;
		height: var(--h);
		box-sizing: border-box;
		border: 9px solid #14161b;
		border-radius: 52px;
		background: var(--color--page-background);
		color: var(--color--text);
		overflow: hidden;
		font-family: var(--font--default);
		font-size: 15px;
		line-height: 20px;
		text-align: left;
		// A replica, not a control surface: nothing inside is a real target.
		user-select: none;
		-webkit-user-select: none;
	}

	.dark {
		background: #14161b;
		color: #f2f3f5;
	}

	.screen {
		position: relative;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	@mixin cut {
		height: var(--cut-h);
		border-bottom: 0;
		border-radius: 52px 52px 0 0;
	}

	.cut-always {
		@include cut;
	}

	.cut-phone {
		@media (max-width: 899px) {
			@include cut;
		}
	}
</style>
