<script>
	import Waves from '$lib/components/organisms/Waves.svelte';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
</script>

<Seo
	title="Privacy Policy"
	path="/privacy-policy"
	description="How LangX collects, uses and protects your data."
/>

<Waves />

<Header />

<main>
	<slot />
</main>

<Footer />
