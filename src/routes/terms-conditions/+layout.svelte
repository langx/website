<script>
	import Waves from '$lib/components/organisms/Waves.svelte';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
</script>

<Seo
	title="Terms & Conditions"
	path="/terms-conditions"
	description="The terms you agree to when you use LangX."
/>

<Waves />

<Header />

<main>
	<slot />
</main>

<Footer />
