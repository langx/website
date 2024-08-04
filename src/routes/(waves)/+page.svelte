<script lang="ts">
	import Hero from '$lib/components/organisms/Hero.svelte';
	import About from '$lib/components/organisms/About.svelte';
	import Features from '$lib/components/organisms/Features.svelte';
	import RecentPosts from '$lib/components/organisms/RecentPosts.svelte';
	import Faq from '$lib/components/organisms/FAQ.svelte';
	import CSponsors from '$lib/components/organisms/CSponsors.svelte';
	import BCSponsors from '$lib/components/organisms/BCSponsors.svelte';
	import Testimonials from '$lib/components/organisms/Testimonials.svelte';
	import Newsletter from '$lib/components/organisms/Newsletter.svelte';
	import type { Feature, BlogPost } from '$lib/utils/types';
	import Discord from '$lib/components/organisms/Discord.svelte';

	export let data: {
		features: Feature[];
		posts: BlogPost[];
	};

	let { features, posts } = data;
</script>

<div class="container">
	<Hero />
	<About />
	<Testimonials />
	<CSponsors />
	<Features {features} />
	{#if posts && posts.length > 0}
		<RecentPosts {posts} />
	{/if}
	<BCSponsors />
	<Newsletter />
	<Discord />
	<Faq />
</div>
