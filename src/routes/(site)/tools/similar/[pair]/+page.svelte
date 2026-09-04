<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { siteBaseUrl } from '$lib/data/meta';
	import type { LanguagePair } from '$lib/data/language-pairs';
	import type { WordListMeta } from '$lib/data/most-common-words';

	type Row = { word: string; rankA: number; rankB: number; english: string };

	export let data: {
		pair: LanguagePair;
		a: WordListMeta;
		b: WordListMeta;
		rows: Row[];
		total: number;
		shown: number;
		others: LanguagePair[];
	};
	$: ({ pair, a, b, rows, total, shown, others } = data);

	const nf = new Intl.NumberFormat('en-US');
	$: path = `/tools/similar/${pair.slug}`;
	$: title = `${a.name} and ${b.name}: ${nf.format(total)} words that are the same`;

	const ld = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Tools', item: `${siteBaseUrl}/tools` },
					{
						'@type': 'ListItem',
						position: 2,
						name: 'Languages that overlap',
						item: `${siteBaseUrl}/tools/similar`
					}
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
	{title}
	{path}
	description="{nf.format(
		total
	)} words are written the same and mean the same in {a.name} and {b.name}, inside the two thousand each language uses most. See them all, free."
/>

<svelte:head>
	{@html ldScript}
</svelte:head>

<div class="container">
	<PageHeader
		{title}
		lede="Among the two thousand words each language uses most, these are written identically and carry
		the same meaning in both. If you have one of the two, this is the part you do not have to learn."
	/>

	<div class="pair-head">
		<span class="side"
			><ScriptDisc nativeName={a.nativeName} code={a.code} size={44} /><span>{a.name}</span></span
		>
		<span class="amp" aria-hidden="true">+</span>
		<span class="side"
			><ScriptDisc nativeName={b.nativeName} code={b.code} size={44} /><span>{b.name}</span></span
		>
	</div>

	<p class="caveat">
		A shared word is not proof of a shared root. Two languages can land on the same spelling by
		borrowing from a third — that is all <em>tren</em> and <em>bomba</em> are — and a word that looks
		the same can still be said quite differently. What this list is good for is the head start.
	</p>

	<table class="words">
		<caption class="sr-only">Words identical in {a.name} and {b.name}</caption>
		<thead>
			<tr>
				<th scope="col">Word</th>
				<th scope="col">In English</th>
				<th scope="col" class="r">{a.name}</th>
				<th scope="col" class="r">{b.name}</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as r}
				<tr>
					<td class="word">{r.word}</td>
					<td class="gloss">{r.english}</td>
					<td class="r tabular">#{nf.format(r.rankA)}</td>
					<td class="r tabular">#{nf.format(r.rankB)}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	{#if total > shown}
		<p class="more">
			Showing the {nf.format(shown)} commonest of {nf.format(total)}.
			<a href="/data/most-common-words/pairs/{pair.slug}.tsv" download
				>Download all {nf.format(total)}</a
			>
		</p>
	{/if}

	{#if others.length}
		<nav class="others" aria-label="Related pairs">
			<h2>Other pairs</h2>
			<ul role="list">
				{#each others as o}
					<li><a href="/tools/similar/{o.slug}">{o.slug.replace('-and-', ' and ')}</a></li>
				{/each}
				<li><a class="all" href="/tools/similar">all pairs →</a></li>
			</ul>
		</nav>
	{/if}

	<section class="cta">
		<h2>The overlap is the easy part.</h2>
		<p>The rest comes from using it with someone who speaks it.</p>
		<div use:ownsPrimary>
			<Button href="https://app.langx.io" variant="primary" size="lg">Start for free</Button>
		</div>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.pair-head {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding-bottom: var(--space-md);

		.side {
			display: inline-flex;
			align-items: center;
			gap: var(--space-2xs);
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.125rem;
		}

		.amp {
			color: var(--color--text-quiet);
			font-size: 1.125rem;
		}
	}

	.caveat {
		color: var(--color--text-shade);
		max-width: 64ch;
		margin-bottom: var(--space-lg);
	}

	.words {
		width: 100%;
		border-collapse: collapse;
		border-top: 1px solid var(--color--border);
		table-layout: fixed;

		th,
		td {
			text-align: left;
			padding: 11px var(--space-2xs) 11px 0;
			border-bottom: 1px solid var(--color--border);
			vertical-align: baseline;
			overflow-wrap: anywhere;
		}

		th {
			font-size: 0.6875rem;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			color: var(--color--text-tertiary);
			font-weight: 700;
		}

		.word {
			font-family: var(--font--title);
			font-weight: 800;
			width: 26%;
		}

		.gloss {
			color: var(--color--text-shade);
		}

		.r {
			width: 6.5rem;
			text-align: right;
			color: var(--color--text-tertiary);
			font-size: 0.8125rem;
		}

		@include for-phone-only {
			.r {
				display: none;
			}
			.word {
				width: 42%;
			}
		}
	}

	.more {
		padding: var(--space-md) 0;
		color: var(--color--text-quiet);
		font-size: 0.9375rem;

		a {
			color: var(--color--accent);
			font-weight: 600;
		}
	}

	.others,
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

	.others ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-md);
		margin-top: var(--space-sm);
	}

	.others a {
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
