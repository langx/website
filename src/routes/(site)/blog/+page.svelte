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
		title="notes for learners."
		lede="Guides to practising with real people, words in dozens of languages, and honest app comparisons."
	/>
	<nav class="jump" aria-label="Sections">
		{#each ordered as g}
			<a href="#{g.id}">{g.title}</a>
		{/each}
		<a class="rss" href="/rss.xml">RSS</a>
	</nav>

	{#each ordered as g}
		<section id={g.id} class="section">
			<h2>{g.title}</h2>
			<ul class="posts" role="list">
				{#each g.posts as post}
					<li>
						<BlogPostCard
							title={post.title}
							coverImage={post.coverImage}
							coverWebp={post.coverWebp}
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
		gap: 8px;
		margin-bottom: 40px;

		a {
			display: flex;
			align-items: center;
			min-height: 40px;
			padding: 0 16px;
			border-radius: 999px;
			background: var(--color--muted);
			color: var(--color--text);
			font-weight: 800;
			font-size: 0.875rem;

			&:hover {
				color: var(--color--text);
				background: var(--color--border);
			}
		}

		.rss {
			background: transparent;
			box-shadow: inset 0 0 0 2px var(--color--border);
		}
	}

	.section {
		padding-bottom: 56px;
		scroll-margin-top: calc(var(--header-height) + 16px);

		h2 {
			margin: 0 0 20px;
			font-size: clamp(1.75rem, 1.2rem + 1.6vw, 2.5rem);
			line-height: 1.1;
		}
	}

	.posts {
		display: grid;
		grid-template-columns: 1fr;
		gap: 32px 16px;

		@media (min-width: 640px) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media (min-width: 1000px) {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
