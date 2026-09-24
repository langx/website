<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { LANGUAGE_PAIRS } from '$lib/data/language-pairs';
	import { siteBaseUrl } from '$lib/data/meta';
	import { WORD_LISTS } from '$lib/data/most-common-words';
	import { PAIR_DEPTH } from '$lib/utils/overlap';

	const nf = new Intl.NumberFormat('en-US');
	const byCode = new Map(WORD_LISTS.map((l) => [l.code, l]));
	// The same pairs the list below shows: one missing a word list is skipped.
	const pairs = LANGUAGE_PAIRS.filter((p) => byCode.has(p.a) && byCode.has(p.b));

	const ld = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Tools', item: `${siteBaseUrl}/tools` },
					{ '@type': 'ListItem', position: 2, name: 'Similar languages' }
				]
			},
			{
				'@type': 'ItemList',
				name: `${pairs.length} pairs of languages that share words`,
				numberOfItems: pairs.length,
				itemListElement: pairs.map((p, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: `${byCode.get(p.a)?.name} and ${byCode.get(p.b)?.name}`,
					url: `${siteBaseUrl}/tools/similar/${p.slug}`
				}))
			}
		]
	};
</script>

<Seo
	title="Similar languages: {LANGUAGE_PAIRS.length} pairs that share words"
	path="/tools/similar"
	description="{LANGUAGE_PAIRS.length} pairs of languages that share words outright — written the same, meaning the same, inside the two thousand each uses most. Free to browse."
/>
<JsonLd data={ld} />

<div class="container">
	<PageHeader
		eyebrow="Tools"
		title="If you know one, you already know some of the other"
		lede="{LANGUAGE_PAIRS.length} pairs where words are written identically and mean the same thing, inside
		the two thousand each language uses most. Sorted by how much they share."
	/>

	<ul class="rows" role="list">
		{#each LANGUAGE_PAIRS as p}
			{@const a = byCode.get(p.a)}
			{@const b = byCode.get(p.b)}
			{#if a && b}
				<li>
					<a href="/tools/similar/{p.slug}">
						<span class="discs">
							<ScriptDisc nativeName={a.nativeName} code={a.code} size={30} />
							<ScriptDisc nativeName={b.nativeName} code={b.code} size={30} />
						</span>
						<span class="names">{a.name} and {b.name}</span>
						<span class="share" aria-hidden="true"
							><span style="width: {Math.max((p.count / PAIR_DEPTH) * 100, 1)}%"></span></span
						>
						<span class="n tabular">{nf.format(p.count)} words</span>
					</a>
				</li>
			{/if}
		{/each}
	</ul>

	<p class="note">
		A shared word is not proof of a shared root — two languages can reach the same spelling by
		borrowing from a third. The measure here is strict on purpose: the word has to be written the
		same <em>and</em> carry the same meaning in both lists. Spelling alone would put Turkish and Spanish
		at fifty shared words, and every one of them a coincidence.
	</p>
</div>

<style lang="scss">
	@use '$lib/scss/breakpoints' as *;

	.rows {
		border-top: 1px solid var(--color--border);

		li {
			border-bottom: 1px solid var(--color--border);
		}

		a {
			display: flex;
			align-items: center;
			gap: var(--space-sm);
			padding: 14px 0;
			color: var(--color--text);
		}
	}

	.discs {
		display: inline-flex;
		flex: 0 0 auto;

		// Overlapped, so the pair reads as one object rather than two.
		:global(.disc + .disc) {
			margin-left: -10px;
			box-shadow: 0 0 0 2px var(--color--page-background);
		}
	}

	.names {
		font-family: var(--font--title);
		font-weight: 800;
	}

	// Each row's share of the 2,000 words compared, on one scale down the
	// list, so the sorted rows read as the bar chart they are: three pairs
	// that are nearly one language, then a long tail of neighbours.
	.share {
		flex: 0 0 auto;
		width: 10rem;
		height: 6px;
		margin-left: auto;
		border-radius: var(--radius-pill);
		background: var(--color--muted);
		overflow: hidden;

		span {
			display: block;
			height: 100%;
			border-radius: inherit;
			background: var(--color--text-shade);
		}

		@include for-phone-only {
			width: 3.5rem;
		}
	}

	.n {
		flex: 0 0 5.5rem;
		text-align: right;
		color: var(--color--text-quiet);
		font-size: 0.8125rem;
	}

	.note {
		margin-top: var(--space-lg);
		color: var(--color--text-quiet);
		max-width: 66ch;
		font-size: 0.9375rem;
	}
</style>
