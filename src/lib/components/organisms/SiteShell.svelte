<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import AnnouncementModal from '$lib/components/molecules/AnnouncementModal.svelte';
	import { description as defaultDescription } from '$lib/data/meta';

	export let title: string | null = null;
	export let description: string = defaultDescription;
	export let path = '';
	export let announce = false;
</script>

<Seo {title} {description} {path} />

<Header />

<main id="main">
	<slot />
</main>

<Footer />

{#if announce}
	<AnnouncementModal />
{/if}
