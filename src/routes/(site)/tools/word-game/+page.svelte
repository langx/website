<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { siteBaseUrl } from '$lib/data/meta';
	import { WORD_GAME_LANGUAGES } from '$lib/data/word-game';
	import { WORD_LISTS } from '$lib/data/most-common-words';

	const byCode = new Map(WORD_LISTS.map((l) => [l.code, l]));
	// The same languages the list below shows: one with no word list is skipped.
	const games = WORD_GAME_LANGUAGES.filter((g) => byCode.has(g.code));

	const ld = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Tools', item: `${siteBaseUrl}/tools` },
					{ '@type': 'ListItem', position: 2, name: 'Word game' }
				]
			},
			{
				'@type': 'ItemList',
				name: `The daily word game in ${games.length} languages`,
				numberOfItems: games.length,
				itemListElement: games.map((g, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: `${g.name} word game`,
					url: `${siteBaseUrl}/tools/word-game/${g.slug}`
				}))
			}
		]
	};
</script>

<Seo
	title="Word game: a daily five-letter puzzle in {WORD_GAME_LANGUAGES.length} languages"
	path="/tools/word-game"
	description="A new five-letter word every day in {WORD_GAME_LANGUAGES.length} languages, drawn from the words each one actually uses most. Six tries, free, no account."
/>
<JsonLd data={ld} />

<div class="container">
	<PageHeader
		eyebrow="Tools"
		title="Five letters, once a day"
		lede="Guess the day's word in six tries. Every answer comes from the words that language uses most,
		so a puzzle is never a word nobody has met."
	/>

	<ul class="rows" role="list">
		{#each WORD_GAME_LANGUAGES as g}
			{@const l = byCode.get(g.code)}
			{#if l}
				<li>
					<a href="/tools/word-game/{g.slug}">
						<ScriptDisc nativeName={l.nativeName} code={l.code} size={34} />
						<span class="name">{g.name}</span>
						<span class="native" lang={l.code}>{l.nativeName}</span>
					</a>
				</li>
			{/if}
		{/each}
	</ul>

	<p class="note">
		Only languages whose script counts one character as one letter are here. An abugida writes a
		vowel as a mark on a consonant and an abjad leaves it out, so "five letters" is not a question
		either of them can be asked; Chinese and Korean are further still.
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

	.note {
		margin-top: var(--space-lg);
		color: var(--color--text-quiet);
		max-width: 64ch;
		font-size: 0.9375rem;
	}
</style>
