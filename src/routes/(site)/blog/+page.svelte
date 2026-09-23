<script lang="ts">
	import BlogPostCard from '$lib/components/molecules/BlogPostCard.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import { organization, siteBaseUrl } from '$lib/data/meta';
	import type { BlogPost } from '$lib/utils/types';

	export let data: {
		posts: BlogPost[];
	};

	let { posts } = data;
</script>

<Seo
	title="Language Exchange Guides & App Comparisons"
	path="/blog"
	description="Guides to language exchange, honest comparisons of Tandem, HelloTalk and other apps, vocabulary deep-dives, and notes on how LangX is built."
/>
<JsonLd
	data={{
		'@context': 'https://schema.org',
		'@type': 'Blog',
		'@id': `${siteBaseUrl}/blog#blog`,
		name: 'LangX Blog',
		url: `${siteBaseUrl}/blog`,
		publisher: organization,
		blogPost: posts.map((p) => ({
			'@type': 'BlogPosting',
			headline: p.title,
			url: `${siteBaseUrl}/${p.slug}`,
			datePublished: new Date(p.date).toISOString()
		}))
	}}
/>

<div class="container">
	<PageHeader
		eyebrow="Blog"
		title="Blog"
		lede="Guides to language exchange, honest app comparisons, and notes on how LangX is built."
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
