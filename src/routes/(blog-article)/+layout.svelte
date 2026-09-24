<script lang="ts">
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import dateformat from 'dateformat';

	import Seo from '$lib/components/atoms/Seo.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import { image, keywords, organization, siteBaseUrl } from '$lib/data/meta';
	import type { BlogPost, PostScript } from '$lib/utils/types';
	import RelatedPosts from '$lib/components/organisms/RelatedPosts.svelte';
	import Image from '$lib/components/atoms/Image.svelte';
	import PostArt from '$lib/components/blog/PostArt.svelte';
	import PostToc from '$lib/components/blog/PostToc.svelte';

	interface Props {
		data: { post: BlogPost; script?: PostScript };
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	let { post, script } = $derived(data);

	// Rebuilt from scratch per post: appending to the previous value carried
	// one post's keywords into the next on client-side navigation.
	let metaKeywords = $derived([...new Set([...(post?.keywords ?? []), ...(post?.tags ?? []), ...keywords])]);

	let url = $derived(post ? `${siteBaseUrl}/${post.slug}` : siteBaseUrl);
	let ld = $derived(post
		? {
				'@context': 'https://schema.org',
				'@graph': [
					{
						'@type': 'BlogPosting',
						'@id': `${url}#article`,
						headline: post.title,
						description: post.excerpt,
						url,
						mainEntityOfPage: url,
						image: post.coverImage ? `${siteBaseUrl}${post.coverImage}` : image,
						datePublished: new Date(post.date).toISOString(),
						dateModified: new Date(post.updated ?? post.date).toISOString(),
						author: post.author
							? { '@type': 'Person', name: post.author.name, url: post.author.url }
							: { '@id': `${siteBaseUrl}/#organization` },
						publisher: organization,
						keywords: [...(post.keywords ?? []), ...(post.tags ?? [])].join(', '),
						articleSection: post.tags?.[0],
						inLanguage: 'en'
					},
					{
						'@type': 'BreadcrumbList',
						itemListElement: [
							{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteBaseUrl}/` },
							{ '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteBaseUrl}/blog` },
							{ '@type': 'ListItem', position: 3, name: post.title }
						]
					}
				]
		  }
		: {});
</script>

{#if post}
	<Seo
		title={post.seoTitle ?? post.title}
		description={post.excerpt}
		path="/{post.slug}"
		type="article"
		ogImage={post.coverImage ? `${siteBaseUrl}${post.coverImage}` : null}
		ogImageAlt={post.title}
		keywords={metaKeywords}
	/>
	<JsonLd data={ld} />
{/if}

<svelte:head>
	{#if post}
		<meta property="article:published_time" content={new Date(post.date).toISOString()} />
		<meta property="article:modified_time" content={new Date(post.updated ?? post.date).toISOString()} />
		{#each post.tags ?? [] as tag}
			<meta property="article:tag" content={tag} />
		{/each}
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
		<!--
			A drawn card (a post with a thumbnail) is the title set in type for
			social previews; above the article it would only repeat the heading.
		-->
		{#if post && post.coverImage && !post.thumbnail}
			<div class="cover-image">
				<Image src={post.coverImage} webp={post.coverWebp?.full} alt={post.title} />
			</div>
		{:else if post}
			<div class="art">
				<PostArt {post} {script} />
			</div>
		{/if}
		<div class="body">
			{#if post?.headings?.length}
				<aside class="toc-rail">
					<PostToc headings={post.headings} />
				</aside>
			{/if}
			<div class="content">
				{@render children?.()}
			</div>
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
	@use '$lib/scss/mixins' as *;

	#article-content {
		--main-column-width: 68ch;
		position: relative;
		padding: var(--space-xl) 15px var(--space-2xl);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);

		@include for-tablet-portrait-up {
			padding-right: 20px;
			padding-left: 20px;
		}

		@include for-tablet-landscape-up {
			padding-right: 30px;
			padding-left: 30px;
		}

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

		.art {
			width: min(var(--main-column-width), 100%);
			margin: 0 auto;
		}

		.body {
			position: relative;
		}

		// "On this page" hangs in the left margin, its right edge 48px off the
		// text column. It takes the body's font size so that 68ch here is the
		// same width as the column's 68ch; the list sets its own sizes in rem.
		// The column is 68ch of the body face, about 730px, so the rail needs
		// a 1340px window to keep 30px from the edge; at 1240px it ran off
		// the left side. Narrower than that the post is read top to bottom.
		.toc-rail {
			display: none;
			position: absolute;
			top: 0;
			bottom: 0;
			width: 13.75rem;
			font-size: 1.0625rem;
			right: calc(50% + var(--main-column-width) / 2 + 3rem);

			@media (min-width: 1340px) {
				display: block;
			}
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
