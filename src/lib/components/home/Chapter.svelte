<script lang="ts">
	import type { Snippet } from 'svelte';
	import Block from '$lib/components/atoms/Block.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import { rise } from '$lib/utils/rise';
	import type { Hue } from '$lib/components/phone/people';

	interface Props {
		id: string;
		hue: Hue;
		tag: string;
		title: string;
		/** Which side the phone sits on at desktop width; on a phone it follows the copy. */
		phoneSide?: 'left' | 'right';
		link?: { href: string; label: string };
		/** The copy under the heading. */
		children?: Snippet;
		phone: Snippet;
	}

	let { id, hue, tag, title, phoneSide = 'left', link, children, phone }: Props = $props();
</script>

<!--
	One chapter of the homepage: a colour block, a tag, a heading, a few short
	lines and a link out, beside a phone at real size. On a phone the copy comes
	first and the phone runs out of the bottom of the block.
-->
<Block {hue} {id} labelledby="{id}-title" class="chapter">
	<div class="grid phone-{phoneSide}" use:rise>
		<div class="copy">
			<span data-rise><Tag tone="ink">{tag}</Tag></span>
			<h2 id="{id}-title" class="display-chapter" data-rise>{title}</h2>
			<div class="text" data-rise>{@render children?.()}</div>
			{#if link}
				<span data-rise><Button href={link.href} variant="arrow">{link.label}</Button></span>
			{/if}
		</div>
		<div class="device">{@render phone()}</div>
	</div>
</Block>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 28px;

		@media (min-width: 900px) {
			align-items: center;
			gap: 120px;

			&.phone-left {
				grid-template-columns: 320px 1fr;

				.device {
					order: -1;
				}
			}
			&.phone-right {
				grid-template-columns: 1fr 320px;
			}
		}
	}

	.copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
		max-width: 620px;

		@media (min-width: 900px) {
			gap: 24px;
		}
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 14px;
		font-size: 1.0625rem;
		line-height: 1.5;
		font-weight: 500;
		max-width: 520px;

		@media (min-width: 900px) {
			font-size: 1.1875rem;
			line-height: 1.47;
		}

		:global(p) {
			margin: 0;
		}
	}

	.device {
		display: flex;
		justify-content: center;
	}
</style>
