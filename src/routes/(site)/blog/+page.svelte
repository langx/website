<script lang="ts">
	import BlogPostCard from '$lib/components/molecules/BlogPostCard.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import { organization, siteBaseUrl } from '$lib/data/meta';
	import type { BlogPost } from '$lib/utils/types';

	interface Props {
		data: {
			posts: BlogPost[];
		};
	}

	let { data }: Props = $props();

	// The blog index has one set of posts; it is read once.
	// svelte-ignore state_referenced_locally
	let { posts } = data;

	/**
	 * One list of sixty posts hides most of them, so the page is cut into the
	 * questions people arrive with. A post goes in the first section whose
	 * test it passes; newest first inside each, as the loader already sorts.
	 */
	const TEAM = ['LangX v2', 'Announcement', 'Transparency', 'Cloud Storage', 'Reddit'];
	const sections = [
		{
			id: 'news',
			title: 'From the LangX team',
			test: (p: BlogPost) => p.tags?.some((t) => TEAM.includes(t))
		},
		{
			id: 'compare',
			title: 'Compare language apps',
			test: (p: BlogPost) => p.tags?.includes('Comparison')
		},
		{
			id: 'words',
			title: 'Words in other languages',
			test: (p: BlogPost) => p.tags?.includes('Vocabulary')
		},
		{
			id: 'guides',
			title: 'Language exchange guides',
			test: (p: BlogPost) => p.tags?.includes('Guide') || p.tags?.includes('Language Exchange')
		},
		{ id: 'learning', title: 'Learning tips', test: () => true }
	];

	const grouped = sections.map((section) => ({ ...section, posts: [] as BlogPost[] }));
	for (const post of posts) grouped.find((g) => g.test(post))?.posts.push(post);
	// News goes last: it is the least searched-for, and the guides are what
	// most visitors came for.
	const ordered = [...grouped.slice(1), grouped[0]].filter((g) => g.posts.length);
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
	<nav class="jump" aria-label="Sections">
		{#each ordered as g}
			<a href="#{g.id}">{g.title}</a>
		{/each}
	</nav>

	{#each ordered as g}
		<section id={g.id} class="section">
			<h2>{g.title}</h2>
			<ul class="rows posts" role="list">
				{#each g.posts as post}
					<li>
						<BlogPostCard
							title={post.title}
							coverImage={post.coverImage}
							thumbnail={post.thumbnail}
							excerpt={post.excerpt}
							readingTime={post.readingTime}
							slug={post.slug}
							tags={post.tags}
							apps={post.apps}
						/>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>

<style lang="scss">
	.jump {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-md);
		margin-bottom: var(--space-lg);
		font-weight: 700;
	}

	.section {
		padding-bottom: var(--space-xl);
		scroll-margin-top: 80px;

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2rem);
			letter-spacing: -0.015em;
			margin-bottom: var(--space-sm);
		}
	}

	.posts {
		border-top: 1px solid var(--color--border);
		max-width: 76ch;
	}
</style>
