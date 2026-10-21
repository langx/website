<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Block from '$lib/components/atoms/Block.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import FinalCta from '$lib/components/organisms/FinalCta.svelte';
	import { siteBaseUrl } from '$lib/data/meta';
	import { WORD_LISTS, totalWords } from '$lib/data/most-common-words';
	import { SAY_WORDS } from '$lib/data/say-words';
	import { LANGUAGE_PAIRS } from '$lib/data/language-pairs';
	import { ALPHABETS } from '$lib/data/alphabets';
	import { WORD_GAME_LANGUAGES } from '$lib/data/word-game';

	const nf = new Intl.NumberFormat('en-US');

	const tools = [
		{
			href: '/tools/most-common-words',
			glyph: 'the',
			hue: 'lilac',
			title: `The most common words in ${WORD_LISTS.length} languages`,
			what: `${nf.format(
				totalWords
			)} words ranked by how often they are actually spoken, each with its meaning in English. Search every language at once, or download any slice as CSV or an Anki deck.`,
			figure: nf.format(totalWords),
			label: 'words'
		},
		{
			href: '/tools/say',
			glyph: 'hi',
			hue: 'mint',
			title: `Say it in ${WORD_LISTS.length} languages`,
			what: `${nf.format(
				SAY_WORDS.length
			)} everyday English words, each one shown across every language that has a common word for it — how often that language uses it, and how it sounds.`,
			figure: nf.format(SAY_WORDS.length),
			label: 'words, side by side'
		},
		{
			href: '/tools/word-game',
			glyph: 'Aa',
			hue: 'lime',
			title: 'Five letters, once a day',
			what: `Guess the day's word in six tries, in any of ${WORD_GAME_LANGUAGES.length} languages. Every answer is a word that language really uses, and the result copies as a grid you can paste anywhere.`,
			figure: '6',
			label: 'tries, once a day'
		},
		{
			href: '/tools/guess-the-language',
			glyph: '?',
			hue: 'aqua',
			title: 'Which language is this?',
			what: `Ten words a day, four guesses each. Every word appears in exactly one of the ${WORD_LISTS.length} lists, so there are no trick questions.`,
			figure: '10',
			label: 'words a day'
		},
		{
			href: '/tools/meaning-quiz',
			glyph: 'ok',
			hue: 'sky',
			title: 'Do you know what these words mean?',
			what: 'Ten words a day with four meanings each, drawn from the first fifteen hundred words a language uses most. Shareable score.',
			figure: '10',
			label: 'words, four meanings'
		},
		{
			href: '/tools/alphabet',
			glyph: 'Бб',
			hue: 'aqua',
			title: 'Alphabets',
			what: `Every letter of ${ALPHABETS.length} writing systems — Greek, Cyrillic, Arabic, Hangul, Devanagari and the rest — with what each is called and roughly how it sounds.`,
			figure: `${ALPHABETS.length}`,
			label: 'writing systems'
		},
		{
			href: '/tools/similar',
			glyph: 'es·pt',
			hue: 'lime',
			title: 'Languages that overlap',
			what: `${LANGUAGE_PAIRS.length} pairs where words are written the same and mean the same — Czech and Slovak share 256 of their commonest two thousand. If you have one of a pair, this is the part you do not have to learn.`,
			figure: `${LANGUAGE_PAIRS.length}`,
			label: 'pairs of languages'
		},
		{
			href: '/tools/vocabulary-test/spanish',
			glyph: '#',
			hue: 'tangerine',
			title: 'How many words do you know?',
			what: 'Forty words spread from the commonest to the rarest, in any of the 53 languages. Mark the ones you know and see roughly how much of the language that covers.',
			figure: '40',
			label: 'words, two minutes'
		}
	];

	const ld = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Tools' }]
			},
			{
				'@type': 'ItemList',
				name: 'Free language tools from LangX',
				numberOfItems: tools.length,
				itemListElement: tools.map((t, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: t.title,
					url: `${siteBaseUrl}${t.href}`
				}))
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
	title="Free language learning tools: word lists, quizzes and games"
	path="/tools"
	description="Free tools for language learners from LangX. No account, no sign-up — {nf.format(
		totalWords
	)} words across {WORD_LISTS.length} languages, searchable, downloadable, and yours to keep."
/>

<svelte:head>
	{@html ldScript}
</svelte:head>

<!-- Lime, words on the left and a taste of the daily game on the right. -->
<Block hue="lime" pad="hero" labelledby="tools-title">
	<div class="hero">
		<div class="copy">
			<Tag tone="ink">Tools</Tag>
			<h1 id="tools-title" class="display-hero">free tools for curious learners.</h1>
			<p>
				Word lists, quizzes and a daily word game, in {WORD_LISTS.length} languages. No account, no sign-up,
				nothing to install.
			</p>
		</div>
		<a class="teaser" href="/tools/word-game" aria-label="Play today’s word game">
			<span class="t-head"
				><span>Five letters, once a day</span><span class="lang">Spanish</span></span
			>
			<span class="grid" aria-hidden="true" lang="es">
				{#each [['C', 'A', 'S', 'A', 'S'], ['P', 'A', 'L', 'M', 'A'], ['P', 'L', 'A', 'Y', 'A']] as row, r}
					{#each row as letter, i}
						<span
							class="cell"
							class:hit={r === 2 || (r === 1 && i !== 3)}
							class:near={r === 0 && (i === 1 || i === 3)}>{letter}</span
						>
					{/each}
				{/each}
			</span>
			<span class="t-note">An example round. A new word comes every day.</span>
			<span class="t-cta">Play today’s word →</span>
		</a>
	</div>
</Block>

<div class="column">
	<h2 class="display-section">pick one and play.</h2>
	<ul class="tools" role="list">
		{#each tools as t}
			<li>
				<a href={t.href}>
					<span class="glyph" data-hue={t.hue} aria-hidden="true">{t.glyph}</span>
					<span class="name">{t.title}</span>
					<span class="what">{t.what}</span>
				</a>
			</li>
		{/each}
	</ul>

	<p class="note">
		More will land here as we build them. If there is something you keep wishing existed, the
		<a href="https://discord.langx.io" target="_blank" rel="noopener noreferrer">Discord</a> is where
		we hear about it first.
	</p>
</div>

<FinalCta bleed title="practise with real people." />

<style lang="scss">
	.hero {
		display: grid;
		gap: 28px;

		@media (min-width: 900px) {
			grid-template-columns: 1fr 380px;
			gap: 64px;
			align-items: center;
		}
	}

	.copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;

		p {
			margin: 0;
			max-width: 520px;
			font-size: 1.1875rem;
			line-height: 1.47;
			font-weight: 500;
		}
	}

	.teaser {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 20px;
		border-radius: 28px;
		background: var(--color--page-background);
		color: var(--color--text);
		text-decoration: none;

		&:hover {
			color: var(--color--text);
		}
	}

	.t-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.0625rem;
	}

	.lang {
		padding: 2px 10px;
		border-radius: 999px;
		background: var(--color--muted);
		font-size: 0.8125rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 6px;
	}

	.cell {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		background: var(--color--muted);
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.25rem;

		&.near {
			background: var(--color--sky);
			color: var(--color--ink);
		}
		&.hit {
			background: var(--color--mint);
			color: var(--color--ink);
		}
	}

	.t-note {
		font-size: 0.8125rem;
		color: var(--color--text-shade);
	}

	.t-cta {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 48px;
		border-radius: 999px;
		background: var(--color--text);
		color: var(--color--page-background);
		font-family: var(--font--title);
		font-weight: 900;
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding: 48px 16px 64px;

		@media (min-width: 768px) {
			max-width: calc(var(--container-max) + 64px);
			padding: 88px 32px 96px;
		}
	}

	.tools {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;

		@media (min-width: 600px) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media (min-width: 1000px) {
			grid-template-columns: repeat(4, 1fr);
		}

		a {
			height: 100%;
			display: flex;
			flex-direction: column;
			gap: 10px;
			padding: 18px;
			border-radius: 24px;
			background: var(--color--muted);
			color: var(--color--text);
			text-decoration: none;
			transition: transform 120ms var(--ease-out);

			&:hover {
				color: var(--color--text);
			}
			&:active {
				transform: scale(0.98);
			}
		}
	}

	.glyph {
		align-self: flex-start;
		min-width: 44px;
		height: 44px;
		padding: 0 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 14px;
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.0625rem;
	}

	.name {
		margin-top: 6px;
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.125rem;
		line-height: 1.25;
	}

	.what {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color--text-shade);
	}

	.note {
		margin: 8px 0 0;
		color: var(--color--text-shade);
	}

	@media (prefers-reduced-motion: reduce) {
		.tools a {
			transition: none;
		}
	}
</style>
