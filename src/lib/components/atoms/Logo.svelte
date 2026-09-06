<script lang="ts">
	/** Height of the mark in px; the wordmark scales with it. */
	export let height = 22;
	export let href: string | undefined = '/';
	/** `mark` renders only the two hooks, for tight spaces. */
	export let variant: 'full' | 'mark' = 'full';

	$: markWidth = (height * 14.6) / 21.544;
</script>

<!--
	The mark is the original drawing: two interlocking hooks, one in the text
	colour and one in the brand yellow so it reads in both themes. The wordmark
	is set live in Nunito 800, the same face as every heading on the site, so
	the logo and the page speak in one voice.
-->
<svelte:element
	this={href ? 'a' : 'span'}
	{href}
	class="logo"
	style="--h:{height}px"
	aria-label={href ? 'LangX home' : 'LangX'}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 14.6 21.544"
		width={markWidth}
		{height}
		aria-hidden="true"
		focusable="false"
	>
		<path
			class="hook-yellow"
			d="m0 14.076 1.715-1.188s2.307 3.177 5.641 1.188a4.088 4.088 0 0 0 1.656-1.875 4.757 4.757 0 0 0-.311-3.842l1.817-1.115s2.745 4.625-1.305 8.207a6.717 6.717 0 0 1-5.509 1.239A6.3 6.3 0 0 1 0 14.076Z"
		/>
		<path
			fill="currentColor"
			d="m14.539 4.475-1.712 1.2s-2.252-3.189-5.588-1.2A4.123 4.123 0 0 0 5.618 6.41a4.751 4.751 0 0 0 .221 3.783l-1.654 1.145S1.319 6.776 5.369 3.193a6.685 6.685 0 0 1 5.47-1.316 6.3 6.3 0 0 1 3.7 2.598Z"
		/>
	</svg>
	{#if variant === 'full'}
		<span class="wordmark" aria-hidden="true">LangX</span>
	{/if}
</svelte:element>

<style lang="scss">
	.logo {
		display: inline-flex;
		align-items: center;
		gap: calc(var(--h) * 0.4);
		color: var(--color--text);
		text-decoration: none;
		line-height: 1;

		&:hover {
			color: var(--color--text);
		}
	}

	svg {
		display: block;
		height: var(--h);
		width: auto;
		flex: 0 0 auto;
	}

	.hook-yellow {
		fill: var(--color--primary);
	}

	.wordmark {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: calc(var(--h) * 1.15);
		letter-spacing: -0.02em;
		line-height: 1;
		// Optical: Nunito's baseline sits a touch high next to the mark.
		transform: translateY(1px);
	}
</style>
