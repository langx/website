<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
</script>

<Seo title="Page not found" path="/404" />

<div class="container">
	<div class="missing">
		<span class="code">404</span>
		<h1>Nothing here, sorry.</h1>
		<p class="lede">The page moved or never existed. The homepage has everything that does.</p>
		<Button href="/" variant="secondary">Back to the start</Button>
	</div>
</div>

<style lang="scss">
	.missing {
		min-height: 60vh;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: var(--space-sm);
		padding: var(--space-2xl) 0;
	}

	.code {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.875rem;
		color: var(--color--text-quiet);
	}

	h1 {
		max-width: 16ch;
	}
</style>
