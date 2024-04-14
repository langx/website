<script lang="ts">
	import Hero from '$lib/components/organisms/Hero.svelte';
	import About from '$lib/components/organisms/About.svelte';
	import Features from '$lib/components/organisms/Features.svelte';
	import RecentPosts from '$lib/components/organisms/RecentPosts.svelte';
	import Faq from '$lib/components/organisms/FAQ.svelte';
	import Sponsors from '$lib/components/organisms/Sponsors.svelte';
	import type { Feature, BlogPost } from '$lib/utils/types';

	export let data: {
		features: Feature[];
		posts: BlogPost[];
	};

	let { features, posts } = data;
</script>

<div class="container">
	<Hero />
	<About />
	<Features {features} />
	{#if posts && posts.length > 0}
		<RecentPosts {posts} />
	{/if}
	<Sponsors />
	<Faq />
</div>
