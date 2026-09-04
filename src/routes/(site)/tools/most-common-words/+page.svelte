<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { siteBaseUrl } from '$lib/data/meta';
	import { WORD_LISTS, totalWords } from '$lib/data/most-common-words';

	const nf = new Intl.NumberFormat('en-US');

	/** The languages most people arrive looking for, in the order they ask. */
	const POPULAR = ['es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ko', 'tr', 'ar', 'nl', 'pl'];
	const popular = POPULAR.map((c) => WORD_LISTS.find((l) => l.code === c)).filter(
		Boolean
	) as typeof WORD_LISTS;

	const faq = [
		{
			q: 'Where do these lists come from?',
			a: 'From the OpenSubtitles corpus — tens of millions of lines of film and television subtitles — counted and ranked by the FrequencyWords project. That is a record of speech rather than of writing, which is why the ranking suits people who want to talk.'
		},
		{
			q: 'Why does the same verb appear more than once?',
			a: 'Because these are word forms, not dictionary headwords. In Spanish, es, era and fue are all the verb ser, and all three are counted separately because all three are things you actually hear.'
		},
		{
			q: 'How many words do I need?',
			a: 'The first hundred carry a surprising share of ordinary conversation, and the first thousand carry most of it. After that each new word buys you less, which is the point at which talking to someone beats studying a list.'
		},
		{
			q: 'Can I use these lists in my own project?',
			a: 'Yes. They are derived from CC BY-SA 4.0 sources and are published under the same licence, so use them freely as long as you credit the sources and pass the same freedom on.'
		}
	];

	const ld = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Tools', item: `${siteBaseUrl}/tools` },
					{ '@type': 'ListItem', position: 2, name: 'Most common words' }
				]
			},
			{
				'@type': 'FAQPage',
				mainEntity: faq.map((f) => ({
					'@type': 'Question',
					name: f.q,
					acceptedAnswer: { '@type': 'Answer', text: f.a }
				}))
			}
		]
	});

	// The angle bracket is written as an escape and never appears literally in
	// this file: Svelte's parser scans the raw source, comments included, and
	// treats a script tag written out in full as a real tag. It is escaped in
	// the JSON too, so a gloss containing a closing tag cannot break out; with
	// that done the string is our own data and nothing else.
	const LT = '\u003c';
	const ldScript = `${LT}script type="application/ld+json">${ld
		.split(LT)
		.join('\\u003c')}${LT}/script>`;
</script>

<Seo
	title="The most common words in {WORD_LISTS.length} languages"
	path="/tools/most-common-words"
	description="Frequency-ranked word lists for {WORD_LISTS.length} languages — {nf.format(
		totalWords
	)} words in all, each with its meaning in English. Free to browse and download."
/>

<svelte:head>
	{@html ldScript}
</svelte:head>

<div class="container">
	<PageHeader
		title="The most common words in {WORD_LISTS.length} languages"
		lede="Ranked by how often each word is actually spoken, not by how often it is written. {nf.format(
			totalWords
		)} words in all, each with its meaning in English."
	/>

	<p class="intro">
		Pick a language and work down from the top. The first few hundred words carry most of an
		ordinary conversation, which makes them the cheapest vocabulary you will ever learn — and every
		list here can be downloaded and kept.
	</p>

	<section class="block">
		<h2>Popular languages</h2>
		<ul class="grid" role="list">
			{#each popular as l}
				<li>
					<a href="/tools/most-common-words/{l.slug}">
						<span class="name">{l.name}</span>
						<span class="native" lang={l.code}>{l.nativeName}</span>
						<span class="n">{nf.format(l.count)} words</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="block">
		<h2>Every language</h2>
		<ul class="rows" role="list">
			{#each WORD_LISTS as l}
				<li>
					<a href="/tools/most-common-words/{l.slug}">
						<span class="name">{l.name}</span>
						<span class="native" lang={l.code}>{l.nativeName}</span>
						<span class="n">{nf.format(l.count)}</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="block faq">
		<h2>Questions</h2>
		<dl>
			{#each faq as f}
				<dt>{f.q}</dt>
				<dd>{f.a}</dd>
			{/each}
		</dl>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.intro {
		max-width: 66ch;
		color: var(--color--text-shade);
	}

	.block {
		padding: var(--space-xl) 0 0;

		h2 {
			margin-bottom: var(--space-sm);
		}
	}

	// No cards: hairlines and the page ground, per DESIGN.md.
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0 var(--space-lg);
		border-top: 1px solid var(--color--border);

		a {
			display: flex;
			align-items: baseline;
			gap: var(--space-2xs);
			flex-wrap: wrap;
			padding: 18px 0;
			border-bottom: 1px solid var(--color--border);
			color: var(--color--text);
		}
	}

	.rows {
		border-top: 1px solid var(--color--border);

		a {
			display: flex;
			align-items: baseline;
			gap: var(--space-2xs);
			padding: 16px 0;
			border-bottom: 1px solid var(--color--border);
			color: var(--color--text);
		}

		.n {
			margin-left: auto;
			font-variant-numeric: tabular-nums;
		}
	}

	.name {
		font-family: var(--font--title);
		font-weight: 800;
	}

	.native {
		color: var(--color--text-shade);
		font-size: 0.9375rem;
	}

	.n {
		color: var(--color--text-tertiary);
		font-size: 0.875rem;
	}

	.grid a,
	.rows a {
		transition: opacity var(--dur-fast) ease;

		@media (hover: hover) and (pointer: fine) {
			&:hover .name {
				text-decoration: underline;
			}
		}

		&:focus-visible {
			outline: 2px solid var(--color--primary);
			outline-offset: 2px;
			border-radius: 8px;
		}
	}

	.faq {
		dt {
			font-family: var(--font--title);
			font-weight: 800;
			margin-top: var(--space-md);
		}

		dd {
			color: var(--color--text-shade);
			max-width: 66ch;
			margin-top: var(--space-3xs);
		}
	}
</style>
