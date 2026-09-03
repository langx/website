<script lang="ts">
	export let title: string;
	export let lede: string | undefined = undefined;
</script>

<header class="page-header">
	<h1>{title}</h1>
	{#if lede}<p class="lede">{lede}</p>{/if}
</header>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.page-header {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		padding: var(--space-2xl) 0 var(--space-xl);

		@include for-phone-only {
			padding: var(--space-xl) 0 var(--space-lg);
		}

		h1 {
			max-width: 20ch;
		}
	}
</style>
