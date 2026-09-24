<script lang="ts">
	interface Props {
		/** The small blue word above the title, the way the homepage sections open. */
		eyebrow?: string | undefined;
		title: string;
		lede?: string | undefined;
	}

	let { eyebrow = undefined, title, lede = undefined }: Props = $props();
</script>

<header class="page-header">
	{#if eyebrow}<span class="eyebrow">{eyebrow}</span>{/if}
	<h1>{title}</h1>
	{#if lede}<p class="lede">{lede}</p>{/if}
</header>

<style lang="scss">
	@use '$lib/scss/breakpoints' as *;

	.page-header {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: var(--space-2xl) 0 var(--space-xl);

		@include for-phone-only {
			padding: var(--space-xl) 0 var(--space-lg);
		}

		h1 {
			margin: 0;
			max-width: 20ch;
		}

		.lede {
			margin: 0;
			font-size: 1.0625rem;
			line-height: 1.65;
		}
	}
</style>
