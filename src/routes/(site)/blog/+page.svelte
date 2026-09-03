<script lang="ts">
	import BlogPostCard from '$lib/components/molecules/BlogPostCard.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
	import type { BlogPost } from '$lib/utils/types';

	export let data: {
		posts: BlogPost[];
	};

	let { posts } = data;
</script>

<Seo
	title="Blog"
	path="/blog"
	description="Notes on language exchange, learning habits, and how LangX is built."
/>

<div class="container">
	<PageHeader
		title="Blog"
		lede="Notes on language exchange, learning habits, and how LangX is built."
	/>
	<ul class="rows posts" role="list">
		{#each posts as post}
			<li>
				<BlogPostCard
					title={post.title}
					coverImage={post.coverImage}
					excerpt={post.excerpt}
					readingTime={post.readingTime}
					slug={post.slug}
					tags={post.tags}
				/>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	.posts {
		border-top: 1px solid var(--color--border);
		max-width: 76ch;
	}
</style>
