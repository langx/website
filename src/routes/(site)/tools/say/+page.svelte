<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { siteBaseUrl } from '$lib/data/meta';
	import { SAY_WORDS } from '$lib/data/say-words';
	import { WORD_LISTS } from '$lib/data/most-common-words';

	const nf = new Intl.NumberFormat('en-US');
	/** The fullest pages make the best first click. */
	const featured = [...SAY_WORDS]
		.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
		.slice(0, 24);

	const letters = [...new Set(SAY_WORDS.map((w) => w.word[0]))].sort();
	const grouped = letters.map((l) => ({
		letter: l,
		words: SAY_WORDS.filter((w) => w.word[0] === l)
	}));

	const ld = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Tools', item: `${siteBaseUrl}/tools` },
					{ '@type': 'ListItem', position: 2, name: 'Say it in any language' }
				]
			}
		]
	});

	// The angle bracket is written as an escape and never appears literally in
	// this file: Svelte's parser scans the raw source, comments included, and
	// treats a script tag written out in full as a real tag.
	const LT = '\u003c';
	const ldScript = `${LT}script type="application/ld+json">${ld
		.split(LT)
		.join('\\u003c')}${LT}/script>`;
</script>

<Seo
	title="Say it in {WORD_LISTS.length} languages"
	path="/tools/say"
	description="{nf.format(
		SAY_WORDS.length
	)} everyday English words, each one shown in up to {WORD_LISTS.length} languages with how common it is in each. Free, no account."
/>

<svelte:head>
	{@html ldScript}
</svelte:head>

<div class="container">
	<PageHeader
		title="Say it in {WORD_LISTS.length} languages"
		lede="{nf.format(
			SAY_WORDS.length
		)} everyday words, each one shown across every language that has a
		common word for it — with how often that language actually uses it."
	/>

	<section class="block">
		<h2>Words in the most languages</h2>
		<ul class="chips" role="list">
			{#each featured as w}
				<li>
					<a href="/tools/say/{w.slug}">
						{w.word}<span class="n">{w.count}</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="block">
		<h2>Every word</h2>
		{#each grouped as g}
			<div class="letter-group">
				<h3 id="letter-{g.letter}">{g.letter.toUpperCase()}</h3>
				<ul class="words" role="list">
					{#each g.words as w}
						<li><a href="/tools/say/{w.slug}">{w.word}</a></li>
					{/each}
				</ul>
			</div>
		{/each}
	</section>
</div>

<style lang="scss">
	.block {
		padding: var(--space-xl) 0 0;

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			letter-spacing: -0.015em;
			margin-bottom: var(--space-sm);
		}
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs);

		a {
			display: inline-flex;
			align-items: baseline;
			gap: 6px;
			height: 40px;
			padding: 0 16px;
			border-radius: var(--radius-pill);
			border: 1px solid var(--color--border);
			color: var(--color--text);
			font-family: var(--font--title);
			font-weight: 800;
			line-height: 40px;
			transition: border-color var(--dur-fast) ease;

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					border-color: var(--color--text);
				}
			}
		}

		.n {
			font-family: var(--font--default);
			font-weight: 400;
			font-size: 0.8125rem;
			font-variant-numeric: tabular-nums;
			color: var(--color--text-quiet);
		}
	}

	.letter-group {
		border-top: 1px solid var(--color--border);
		padding: var(--space-sm) 0;
		display: grid;
		grid-template-columns: 3rem 1fr;
		gap: var(--space-sm);

		h3 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.125rem;
			color: var(--color--text-quiet);
		}
	}

	.words {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3xs) var(--space-sm);

		a {
			color: var(--color--text-shade);

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					color: var(--color--text);
				}
			}
		}
	}
</style>
