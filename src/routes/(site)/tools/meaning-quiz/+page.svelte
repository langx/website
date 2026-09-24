<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { siteBaseUrl } from '$lib/data/meta';
	import { WORD_LISTS } from '$lib/data/most-common-words';

	const ld = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Tools', item: `${siteBaseUrl}/tools` },
					{ '@type': 'ListItem', position: 2, name: 'Meaning quiz' }
				]
			},
			{
				'@type': 'ItemList',
				name: `Vocabulary quizzes in ${WORD_LISTS.length} languages`,
				numberOfItems: WORD_LISTS.length,
				itemListElement: WORD_LISTS.map((l, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: `${l.name} vocabulary quiz`,
					url: `${siteBaseUrl}/tools/meaning-quiz/${l.slug}`
				}))
			}
		]
	};
</script>

<Seo
	title="Vocabulary quiz: ten words a day in {WORD_LISTS.length} languages"
	path="/tools/meaning-quiz"
	description="Ten words a day in {WORD_LISTS.length} languages, four meanings each, all from the first fifteen hundred words each language uses most. Free, no account."
/>
<JsonLd data={ld} />

<div class="container">
	<PageHeader
		eyebrow="Tools"
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
	@use '$lib/scss/breakpoints' as *;

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
