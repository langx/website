<script>
	import Waves from '$lib/components/organisms/Waves.svelte';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
</script>

<Seo
	title="Welcome back"
	path="/welcome-back"
	description="What changes for LangX v1 users: your username, your token balance, your streak, and what moved behind LangX Pro."
/>

<Waves />

<Header />

<main>
	<slot />
</main>

<Footer />
