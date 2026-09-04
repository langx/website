<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { siteBaseUrl } from '$lib/data/meta';
	import type { SayWord } from '$lib/data/say-words';

	type Row = {
		code: string;
		word: string;
		rank: number;
		gloss: string;
		name: string;
		native: string;
		slug: string;
	};

	export let data: { entry: SayWord; rows: Row[]; nearby: SayWord[] };
	$: ({ entry, rows, nearby } = data);

	const nf = new Intl.NumberFormat('en-US');
	$: title = `How to say “${entry.word}” in ${entry.count} languages`;
	$: path = `/tools/say/${entry.slug}`;
	/** Where the word is commonest tells you something the table alone does not. */
	$: commonest = [...rows].sort((a, b) => a.rank - b.rank)[0];

	/**
	 * Most rows gloss to the very word the page is about, which is a column of
	 * "water" down a page titled water. Only the ones that say something else —
	 * a narrower sense, a second meaning — are worth the space.
	 */
	const adds = (gloss: string, word: string) =>
		gloss.toLowerCase().replace(/[.,;:\s]+$/, '') !== word.toLowerCase();

	$: ld = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Tools', item: `${siteBaseUrl}/tools` },
					{
						'@type': 'ListItem',
						position: 2,
						name: 'Say it in any language',
						item: `${siteBaseUrl}/tools/say`
					},
					{ '@type': 'ListItem', position: 3, name: entry.word }
				]
			},
			{
				'@type': 'ItemList',
				name: title,
				numberOfItems: rows.length,
				itemListElement: rows.map((r, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: r.word,
					description: `${r.word} — ${r.name} for “${entry.word}”`
				}))
			}
		]
	});

	// The angle bracket is written as an escape and never appears literally in
	// this file: Svelte's parser scans the raw source, comments included, and
	// treats a script tag written out in full as a real tag.
	const LT = '\u003c';
	$: ldScript = `${LT}script type="application/ld+json">${ld
		.split(LT)
		.join('\\u003c')}${LT}/script>`;
</script>

<Seo
	{title}
	{path}
	description="“{entry.word}” in {entry.count} languages, each one a word people actually use — with how common it is in that language. Free, no account."
/>

<svelte:head>
	{@html ldScript}
</svelte:head>

<div class="container">
	<PageHeader
		{title}
		lede="Every one of these is a word that turns up in ordinary speech, not a dictionary curiosity — the number beside it is where it ranks in that language."
	/>

	{#if commonest}
		<p class="note">
			It is commonest in {commonest.name}, where
			<strong lang={commonest.code}>{commonest.word}</strong>
			is the {nf.format(commonest.rank)}{commonest.rank % 10 === 1 && commonest.rank % 100 !== 11
				? 'st'
				: commonest.rank % 10 === 2 && commonest.rank % 100 !== 12
				? 'nd'
				: commonest.rank % 10 === 3 && commonest.rank % 100 !== 13
				? 'rd'
				: 'th'} most used word.
		</p>
	{/if}

	<ul class="rows" role="list">
		{#each rows as r}
			<li>
				<a href="/tools/most-common-words/{r.slug}">
					<ScriptDisc nativeName={r.native} code={r.code} size={34} />
					<span class="lang">{r.name}</span>
					<span class="term" lang={r.code}>{r.word}</span>
					{#if adds(r.gloss, entry.word)}<span class="gloss">{r.gloss}</span>{:else}<span />{/if}
					<span class="rank tabular">#{nf.format(r.rank)}</span>
				</a>
			</li>
		{/each}
	</ul>

	<nav class="nearby" aria-label="Other words">
		<h2>Other words</h2>
		<ul role="list">
			{#each nearby as w}
				<li><a href="/tools/say/{w.slug}">{w.word}</a></li>
			{/each}
			<li><a class="all" href="/tools/say">all words →</a></li>
		</ul>
	</nav>

	<section class="cta">
		<h2>Knowing the word is the easy half.</h2>
		<p>Using it with someone who speaks the language is the half that sticks.</p>
		<div use:ownsPrimary>
			<Button href="https://app.langx.io" variant="primary" size="lg">Start for free</Button>
		</div>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.note {
		color: var(--color--text-shade);
		max-width: 60ch;
		margin-bottom: var(--space-md);

		strong {
			font-family: var(--font--title);
			font-weight: 800;
		}
	}

	.rows {
		border-top: 1px solid var(--color--border);

		li {
			border-bottom: 1px solid var(--color--border);
		}

		a {
			display: grid;
			grid-template-columns: auto minmax(7rem, auto) minmax(6rem, auto) 1fr auto;
			align-items: center;
			gap: var(--space-sm);
			padding: 12px 0;
			color: var(--color--text);
		}
	}

	.lang {
		color: var(--color--text-shade);
		font-size: 0.9375rem;
	}

	.term {
		font-family: var(--font--title);
		font-weight: 800;
		overflow-wrap: anywhere;
	}

	.gloss {
		color: var(--color--text-quiet);
		font-size: 0.9375rem;
		overflow-wrap: anywhere;
	}

	.rank {
		color: var(--color--text-tertiary);
		font-size: 0.8125rem;
	}

	@include for-phone-only {
		.rows a {
			grid-template-columns: auto 1fr auto;
			row-gap: 2px;
		}
		.lang {
			grid-column: 3;
			text-align: right;
		}
		.gloss {
			grid-column: 2 / 4;
		}
		.rank {
			display: none;
		}
	}

	.nearby,
	.cta {
		border-top: 1px solid var(--color--border);
		padding: var(--space-xl) 0;

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			letter-spacing: -0.015em;
		}
	}

	.nearby ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-md);
		margin-top: var(--space-sm);
	}

	.nearby a {
		color: var(--color--text-shade);

		&.all {
			color: var(--color--accent);
		}

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				color: var(--color--text);
			}
		}
	}

	.cta {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		p {
			color: var(--color--text-shade);
			max-width: 46ch;
			margin: var(--space-2xs) 0 var(--space-md);
		}
	}
</style>
