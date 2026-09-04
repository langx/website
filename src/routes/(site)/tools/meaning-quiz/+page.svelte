<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { WORD_LISTS } from '$lib/data/most-common-words';
</script>

<Seo
	title="Meaning quiz"
	path="/tools/meaning-quiz"
	description="Ten words a day in {WORD_LISTS.length} languages, four meanings each, all from the first fifteen hundred words each language uses most. Free, no account."
/>

<div class="container">
	<PageHeader
		title="Do you know what these words mean?"
		lede="Ten words a day, four meanings each. Every word comes from the first fifteen hundred its
		language uses most, so these are words you would actually meet."
	/>

	<ul class="rows" role="list">
		{#each WORD_LISTS as l}
			<li>
				<a href="/tools/meaning-quiz/{l.slug}">
					<ScriptDisc nativeName={l.nativeName} code={l.code} size={34} />
					<span class="name">{l.name}</span>
					<span class="native" lang={l.code}>{l.nativeName}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.rows {
		border-top: 1px solid var(--color--border);

		li {
			border-bottom: 1px solid var(--color--border);
		}

		a {
			display: grid;
			grid-template-columns: auto minmax(7rem, auto) 1fr;
			align-items: center;
			gap: var(--space-sm);
			padding: 13px 0;
			color: var(--color--text);
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

	@include for-phone-only {
		.native {
			display: none;
		}
		.rows a {
			grid-template-columns: auto 1fr;
		}
	}
</style>
