<script>
	import Waves from '$lib/components/organisms/Waves.svelte';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
</script>

<Seo
	title="LangX Pro"
	path="/pro"
	description="What LangX Pro adds, what stays free, and why corrections are unlimited on both plans."
/>

<Waves />

<Header />

<main>
	<slot />
</main>

<Footer />
