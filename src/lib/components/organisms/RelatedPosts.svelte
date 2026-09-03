<script lang="ts">
	import type { BlogPost } from '$lib/utils/types';
	import BlogPostCard from '$lib/components/molecules/BlogPostCard.svelte';

	export let posts: BlogPost[];
</script>

<section id="related-posts" class="related">
	<h2>Related posts</h2>
	<ul class="rows" role="list">
		{#each posts as post}
			<li>
				<BlogPostCard
					slug={post.slug}
					title={post.title}
					excerpt={post.excerpt}
					tags={post.tags}
					readingTime={post.readingTime}
					showImage={false}
				/>
			</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	.related {
		padding: var(--space-2xl) 0 0;

		h2 {
			font-size: 1.5rem;
		}
	}

	.rows {
		margin-top: var(--space-sm);
		border-top: 1px solid var(--color--border);
	}
</style>
