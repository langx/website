<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { WORD_LISTS } from '$lib/data/most-common-words';

	const nf = new Intl.NumberFormat('en-US');
	const POPULAR = ['es', 'fr', 'de', 'it', 'pt', 'ru', 'tr', 'zh', 'ko', 'ar', 'nl', 'pl'];
	const popular = POPULAR.map((c) => WORD_LISTS.find((l) => l.code === c)).filter(
		Boolean
	) as typeof WORD_LISTS;
</script>

<Seo
	title="Vocabulary tests"
	path="/tools/vocabulary-test"
	description="Find out roughly how many words you know, in any of {WORD_LISTS.length} languages. Forty-two words, two minutes, no account."
/>

<div class="container">
	<PageHeader
		title="How many words do you know?"
		lede="Forty-two words drawn from across the whole frequency range — the commonest through to the
		rare. Mark the ones you know and see roughly how much of the language that covers. Two minutes, no
		account, and the result is a link you can keep."
	/>

	<section class="block">
		<h2>Start here</h2>
		<ul class="popular" role="list">
			{#each popular as l}
				<li>
					<a href="/tools/vocabulary-test/{l.slug}">
						<ScriptDisc nativeName={l.nativeName} code={l.code} size={44} />
						<span class="names">
							<span class="native" lang={l.code}>{l.nativeName}</span>
							<span class="english">{l.name}</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="block">
		<h2>All {WORD_LISTS.length} languages</h2>
		<ul class="rows" role="list">
			{#each WORD_LISTS as l}
				<li>
					<a href="/tools/vocabulary-test/{l.slug}">
						<ScriptDisc nativeName={l.nativeName} code={l.code} size={30} />
						<span class="lang">{l.name}</span>
						<span class="n tabular">{nf.format(l.count)} words</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

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

	.popular {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
		gap: 0 var(--space-lg);
		border-top: 1px solid var(--color--border);

		li {
			border-bottom: 1px solid var(--color--border);
		}

		a {
			display: flex;
			align-items: center;
			gap: var(--space-xs);
			padding: 14px 0;
			color: var(--color--text);
		}

		.names {
			display: flex;
			flex-direction: column;
			min-width: 0;
		}

		.native {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.125rem;
		}

		.english {
			font-size: 0.8125rem;
			color: var(--color--text-quiet);
		}
	}

	.rows {
		border-top: 1px solid var(--color--border);

		li {
			border-bottom: 1px solid var(--color--border);
		}

		a {
			display: flex;
			align-items: center;
			gap: var(--space-sm);
			padding: 13px 0;
			color: var(--color--text);
		}
	}

	.lang {
		font-family: var(--font--title);
		font-weight: 800;
	}

	.n {
		margin-left: auto;
		color: var(--color--text-quiet);
		font-size: 0.8125rem;
	}
</style>
