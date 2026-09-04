<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { WORD_LISTS, totalWords } from '$lib/data/most-common-words';

	const nf = new Intl.NumberFormat('en-US');
</script>

<Seo
	title="Free language tools"
	path="/tools/"
	description="Free tools for language learners from LangX — starting with frequency-ranked word lists for {WORD_LISTS.length} languages, each word with its meaning in English."
/>

<div class="container">
	<PageHeader
		title="Tools"
		lede="Free, no account needed. Things worth having open in a tab while you learn."
	/>

	<ul class="rows" role="list">
		<li>
			<a href="/tools/most-common-words/">
				<span class="name">The most common words in {WORD_LISTS.length} languages</span>
				<span class="what">
					{nf.format(totalWords)} words ranked by how often they are actually spoken, each with its meaning
					in English. Browse or download.
				</span>
			</a>
		</li>
	</ul>
</div>

<style lang="scss">
	.rows {
		border-top: 1px solid var(--color--border);
		max-width: 76ch;

		a {
			display: flex;
			flex-direction: column;
			gap: var(--space-3xs);
			padding: 22px 0;
			border-bottom: 1px solid var(--color--border);
			color: var(--color--text);

			&:focus-visible {
				outline: 2px solid var(--color--primary);
				outline-offset: 2px;
				border-radius: 8px;
			}
		}
	}

	.name {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.125rem;
	}

	.what {
		color: var(--color--text-shade);
	}
</style>
