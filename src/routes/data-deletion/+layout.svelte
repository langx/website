<script>
	import Waves from '$lib/components/organisms/Waves.svelte';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
</script>

<Seo
	title="Data Deletion"
	path="/data-deletion"
	description="How to delete your LangX account and the data it holds."
/>

<Waves />

<Header />

<main>
	<slot />
</main>

<Footer />
