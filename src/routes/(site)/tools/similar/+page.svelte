<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { LANGUAGE_PAIRS } from '$lib/data/language-pairs';
	import { WORD_LISTS } from '$lib/data/most-common-words';

	const nf = new Intl.NumberFormat('en-US');
	const byCode = new Map(WORD_LISTS.map((l) => [l.code, l]));
</script>

<Seo
	title="Languages that overlap"
	path="/tools/similar"
	description="{LANGUAGE_PAIRS.length} pairs of languages that share words outright — written the same, meaning the same, inside the two thousand each uses most. Free to browse."
/>

<div class="container">
	<PageHeader
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

	.n {
		margin-left: auto;
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
