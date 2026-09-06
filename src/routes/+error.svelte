<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import NotFound from '$lib/components/organisms/NotFound.svelte';
</script>

<svelte:head>
	<title>{$page.status === 404 ? 'Page not found' : 'Something went wrong'} | LangX</title>
</svelte:head>

<Header />

<main>
	<div class="container">
		<NotFound status={$page.status} />
	</div>
</main>

<Footer />
