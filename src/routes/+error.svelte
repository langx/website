<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
</script>

<svelte:head>
	<title>{$page.status === 404 ? 'Page not found' : 'Something went wrong'} | LangX</title>
</svelte:head>

<Header />

<main>
	<div class="container">
		<div class="missing">
			<span class="code">{$page.status}</span>
			<h1>{$page.status === 404 ? 'Nothing here, sorry.' : 'Something went wrong.'}</h1>
			<p class="lede">
				{$page.status === 404
					? 'The page moved or never existed. The homepage has everything that does.'
					: 'Reload the page, or start again from the homepage.'}
			</p>
			<Button href="/" variant="secondary">Back to the start</Button>
		</div>
	</div>
</main>

<Footer />

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
