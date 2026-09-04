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
	/**
	 * Set false where each page supplies its own <Seo>. Two <Seo> instances
	 * emit two canonicals, and the layout's — pointing at the homepage — was
	 * winning on /blog.
	 */
	export let seo = true;
</script>

{#if seo}
	<Seo {title} {description} {path} />
{/if}

<Header />

<main id="main">
	<slot />
</main>

<Footer />

{#if announce}
	<AnnouncementModal />
{/if}
