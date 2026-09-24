<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import AnnouncementModal from '$lib/components/molecules/AnnouncementModal.svelte';
	import { description as defaultDescription } from '$lib/data/meta';

	interface Props {
		title?: string | null;
		description?: string;
		path?: string;
		announce?: boolean;
		/**
		 * Set false where each page supplies its own <Seo>. Two <Seo> instances
		 * emit two canonicals, and the layout's — pointing at the homepage — was
		 * winning on /blog.
		 */
		seo?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		title = null,
		description = defaultDescription,
		path = '',
		announce = false,
		seo = true,
		children
	}: Props = $props();
</script>

{#if seo}
	<Seo {title} {description} {path} />
{/if}

<Header />

<main id="main">
	{@render children?.()}
</main>

<Footer />

{#if announce}
	<AnnouncementModal />
{/if}
