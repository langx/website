<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import BlogPostCard from '$lib/components/molecules/BlogPostCard.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { siteBaseUrl } from '$lib/data/meta';
	import { COMPETITORS } from '$lib/data/competitors';
	import type { BlogPost } from '$lib/utils/types';

	export let data: { posts: BlogPost[] };
	$: ({ posts } = data);
	// Roundups answer "which app?"; one-to-ones answer "this app or LangX?".
	$: oneToOne = posts.filter((p) => p.slug.startsWith('open-source-alternative-to-'));
	$: roundups = posts.filter((p) => !p.slug.startsWith('open-source-alternative-to-'));

	const title = 'LangX vs Tandem, HelloTalk, Duolingo and Other Language Apps';
	const description =
		'Open source alternative to Tandem, HelloTalk, Duolingo and more: honest one-to-one comparisons of LangX with every major language app, updated for 2026.';

	/**
	 * What LangX is, in the rows every comparison asks about. Each line has to
	 * stay true of the shipping app — see PRODUCT.md and `src/lib/data/plans.ts`.
	 */
	const facts = [
		{
			label: 'Matching',
			value: 'Both directions: people who speak what you learn and learn what you speak'
		},
		{ label: 'Corrections', value: 'Tap any message to correct it — unlimited on every plan' },
		{
			label: 'Translation',
			value: 'Built into the chat — 20 a day free, 300 on Fluent, 1,000 on Polyglot'
		},
		{ label: 'Free plan', value: 'Unlimited replies and corrections; 5 new conversations a day' },
		{
			label: 'Voice and photos',
			value: 'Voice and photo messages; hold a message to hear it read aloud'
		},
		{ label: 'Ads', value: 'None' },
		{ label: 'Source code', value: 'Open source (BSD-3) and self-hostable' },
		{ label: 'Platforms', value: 'iOS, Android and the web' }
	];

	$: ld = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteBaseUrl}/` },
					{ '@type': 'ListItem', position: 2, name: 'Compare' }
				]
			},
			{
				'@type': 'ItemList',
				name: title,
				numberOfItems: posts.length,
				itemListElement: posts.map((p, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: p.title,
					url: `${siteBaseUrl}/${p.slug}`
				}))
			}
		]
	};
</script>

<Seo
	title="LangX vs Tandem, HelloTalk & Duolingo: Open Source Alternative"
	path="/compare"
	{description}
/>
<JsonLd data={ld} />

<div class="container">
	<PageHeader
		eyebrow="Compare"
		{title}
		lede="LangX is an open source alternative to Tandem, HelloTalk and the other language exchange apps, and the social alternative to Duolingo: the conversation, with real people, that course apps leave out. Here is how it compares to each — including where they are the better choice."
	/>

	<section class="block">
		<h2>LangX at a glance</h2>
		<dl class="facts">
			{#each facts as f}
				<div>
					<dt>{f.label}</dt>
					<dd>{f.value}</dd>
				</div>
			{/each}
		</dl>
	</section>

	{#if COMPETITORS.length}
		<section class="block">
			<h2>Language apps, side by side</h2>
			<div class="scroll">
				<table>
					<thead>
						<tr>
							<th scope="col">App</th>
							<th scope="col">What it is</th>
							<th scope="col">Best for</th>
							<th scope="col">Free to use</th>
							<th scope="col">Open source</th>
						</tr>
					</thead>
					<tbody>
						<tr class="self">
							<th scope="row">LangX</th>
							<td>Two-way language exchange with corrections and translation in the chat</td>
							<td>Practice that teaches, without ads</td>
							<td>Free plan; Fluent and Polyglot add more</td>
							<td>Yes (BSD-3)</td>
						</tr>
						{#each COMPETITORS as c}
							<tr>
								<th scope="row">
									<a href="/{c.slug}">{c.name}</a>
									{#if c.status !== 'active'}<span class="closed">{c.status}</span>{/if}
								</th>
								<td>{c.what}</td>
								<td>{c.bestFor}</td>
								<td>{c.free}</td>
								<td>{c.openSource ? 'Yes' : 'No'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}

	<section class="block">
		<h2>LangX vs each app</h2>
		<ul class="rows" role="list">
			{#each oneToOne as post}
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
	</section>

	<section class="block">
		<h2>Roundups and guides</h2>
		<ul class="rows" role="list">
			{#each roundups as post}
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
	</section>

	<section class="cta">
		<h2>The quickest comparison is a conversation.</h2>
		<p>LangX is free to start on iPhone, Android and the web.</p>
		<div use:ownsPrimary>
			<Button href="https://get.langx.io" variant="primary" size="lg">Start for free</Button>
		</div>
	</section>
</div>

<style lang="scss">
	.block {
		border-top: 1px solid var(--color--border);
		padding: var(--space-xl) 0;

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2rem);
			letter-spacing: -0.015em;
			margin-bottom: var(--space-md);
		}
	}

	.facts {
		display: grid;
		max-width: 76ch;

		div {
			display: grid;
			grid-template-columns: minmax(8rem, 12rem) 1fr;
			gap: var(--space-sm);
			padding: 12px 0;
			border-bottom: 1px solid var(--color--border);
		}

		dt {
			font-weight: 700;
		}

		dd {
			margin: 0;
			color: var(--color--text-shade);
		}
	}

	.scroll {
		overflow-x: auto;
	}

	table {
		width: 100%;
		min-width: 640px;
		border-collapse: collapse;
		font-size: 0.9375rem;

		th,
		td {
			text-align: left;
			vertical-align: top;
			padding: 12px 12px 12px 0;
			border-bottom: 1px solid var(--color--border);
		}

		thead th {
			font-size: 0.8125rem;
			color: var(--color--text-tertiary);
			font-weight: 700;
		}

		tbody th {
			font-weight: 800;
			white-space: nowrap;
		}

		td {
			color: var(--color--text-shade);
		}

		.self th,
		.self td {
			color: var(--color--text);
		}
	}

	.closed {
		display: block;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color--text-tertiary);
	}

	.rows {
		border-top: 1px solid var(--color--border);
		max-width: 76ch;
	}

	.cta {
		border-top: 1px solid var(--color--border);
		padding: var(--space-xl) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			letter-spacing: -0.015em;
		}

		p {
			color: var(--color--text-shade);
			margin: var(--space-2xs) 0 var(--space-md);
		}
	}
</style>
