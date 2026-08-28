<script>
	import Waves from '$lib/components/organisms/Waves.svelte';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
</script>

<Seo
	title="Cookie Policy"
	path="/cookie-policy"
	description="Which cookies LangX uses, and how to control them."
/>

<Waves />

<Header />

<main>
	<slot />
</main>

<Footer />
