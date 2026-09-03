<script lang="ts">
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import dateformat from 'dateformat';

	import { keywords, siteBaseUrl, title } from '$lib/data/meta';
	import type { BlogPost } from '$lib/utils/types';
	import RelatedPosts from '$lib/components/organisms/RelatedPosts.svelte';
	import Image from '$lib/components/atoms/Image.svelte';

	export let data: { post: BlogPost };
	$: ({ post } = data);

	let metaKeywords = keywords;

	$: {
		if (post?.tags?.length) {
			metaKeywords = post.tags.concat(metaKeywords);
		}
		if (post?.keywords?.length) {
			metaKeywords = post.keywords.concat(metaKeywords);
		}
	}
</script>

<svelte:head>
	{#if post}
		<meta name="keywords" content={metaKeywords.join(', ')} />

		<meta name="description" content={post.excerpt} />
		<meta property="og:description" content={post.excerpt} />
		<meta name="twitter:description" content={post.excerpt} />
		<link rel="canonical" href="{siteBaseUrl}/{post.slug}" />

		<title>{post.title} - {title}</title>
		<meta property="og:title" content="{post.title} - {title}" />
		<meta name="twitter:title" content="{post.title} - {title}" />

		{#if post.coverImage}
			<meta property="og:image" content="{siteBaseUrl}{post.coverImage}" />
			<meta name="twitter:image" content="{siteBaseUrl}{post.coverImage}" />
		{/if}
	{/if}
</svelte:head>

<Header />

<main>
	<article id="article-content">
		<div class="header">
			{#if post}
				<a class="back" href="/blog">← All posts</a>
				<h1>{post.title}</h1>

				<div class="meta">
					<span>{dateformat(post.date, 'UTC:dd mmmm yyyy')}</span>
					{#if post.author}
						<span>·</span>
						<a href={post.author.url} target="_blank" rel="noopener noreferrer">@{post.author.name}</a>
					{/if}
					{#if post.readingTime}
						<span>·</span>
						<span>{post.readingTime}</span>
					{/if}
					{#if post.updated}
						<span>·</span>
						<span>Updated {dateformat(post.updated, 'UTC:dd mmmm yyyy')}</span>
					{/if}
				</div>
				{#if post.tags?.length}
					<div class="tags">
						{#each post.tags as tag}
							<Tag>{tag}</Tag>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
		{#if post && post.coverImage}
			<div class="cover-image">
				<Image src={post.coverImage} alt={post.title} />
			</div>
		{/if}
		<div class="content">
			<slot />
		</div>
	</article>

	{#if post?.relatedPosts && post.relatedPosts.length > 0}
		<div class="container">
			<RelatedPosts posts={post.relatedPosts} />
		</div>
	{/if}
</main>

<Footer />

<style lang="scss">
	@import '$lib/scss/_mixins.scss';

	#article-content {
		--main-column-width: 68ch;
		position: relative;
		padding: var(--space-xl) 15px var(--space-2xl);

		@include for-tablet-portrait-up {
			padding-right: 20px;
			padding-left: 20px;
		}

		@include for-tablet-landscape-up {
			padding-right: 30px;
			padding-left: 30px;
		}

		display: flex;
		flex-direction: column;
		gap: var(--space-lg);

		.header {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-sm);
			width: min(var(--main-column-width), 100%);
			margin: 0 auto;

			h1 {
				font-size: clamp(2rem, 1.4rem + 2.4vw, 3rem);
			}
		}

		.back {
			font-size: 0.875rem;
			font-weight: 700;
		}

		.meta {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			font-size: 0.875rem;
			color: var(--color--text-shade);
		}

		.tags {
			display: flex;
			align-items: center;
			gap: 6px;
			flex-wrap: wrap;
		}

		.cover-image {
			width: min(var(--main-column-width), 100%);
			margin: 0 auto;
			max-height: 420px;
			border-radius: var(--radius-lg);
			overflow: hidden;
			background: var(--color--muted);
		}

		:global(.cover-image img) {
			max-height: 420px;
			object-fit: cover;
		}

		.content {
			display: grid;
			grid-template-columns:
				1fr
				min(var(--main-column-width), 100%)
				1fr;

			:global(> *) {
				grid-column: 2;
			}

			:global(> .full-bleed) {
				grid-column: 1 / 4;
				width: 100%;
				max-width: 1600px;
				margin-left: auto;
				margin-right: auto;
			}
		}
	}
</style>
