<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { siteBaseUrl } from '$lib/data/meta';
	import { WORD_LISTS, totalWords } from '$lib/data/most-common-words';
	import { SAY_WORDS } from '$lib/data/say-words';
	import { LANGUAGE_PAIRS } from '$lib/data/language-pairs';
	import { ALPHABETS } from '$lib/data/alphabets';

	const nf = new Intl.NumberFormat('en-US');

	/** Every script we carry, one language each, in the order they read best. */
	const STRIP = [
		'zh',
		'ar',
		'ru',
		'ko',
		'el',
		'he',
		'hi',
		'ka',
		'hy',
		'ta',
		'bn',
		'te',
		'ml',
		'th',
		'es',
		'tr',
		'vi',
		'pl',
		'is',
		'fi'
	];
	const strip = STRIP.map((c) => WORD_LISTS.find((l) => l.code === c)).filter(
		Boolean
	) as typeof WORD_LISTS;

	const tools = [
		{
			href: '/tools/most-common-words',
			title: `The most common words in ${WORD_LISTS.length} languages`,
			what: `${nf.format(
				totalWords
			)} words ranked by how often they are actually spoken, each with its meaning in English. Search every language at once, or download any slice as CSV or an Anki deck.`,
			figure: nf.format(totalWords),
			label: 'words'
		},
		{
			href: '/tools/say',
			title: `Say it in ${WORD_LISTS.length} languages`,
			what: `${nf.format(
				SAY_WORDS.length
			)} everyday English words, each one shown across every language that has a common word for it — and how often that language uses it.`,
			figure: nf.format(SAY_WORDS.length),
			label: 'words, side by side'
		},
		{
			href: '/tools/alphabet',
			title: 'Alphabets',
			what: `Every letter of ${ALPHABETS.length} writing systems — Greek, Cyrillic, Arabic, Hangul, Devanagari and the rest — with what each is called and roughly how it sounds.`,
			figure: `${ALPHABETS.length}`,
			label: 'writing systems'
		},
		{
			href: '/tools/similar',
			title: 'Languages that overlap',
			what: `${LANGUAGE_PAIRS.length} pairs where words are written the same and mean the same — Czech and Slovak share 256 of their commonest two thousand. If you have one of a pair, this is the part you do not have to learn.`,
			figure: `${LANGUAGE_PAIRS.length}`,
			label: 'pairs of languages'
		},
		{
			href: '/tools/vocabulary-test/spanish',
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
	title="Free language tools"
	path="/tools"
	description="Free tools for language learners from LangX. No account, no sign-up — {nf.format(
		totalWords
	)} words across {WORD_LISTS.length} languages, searchable, downloadable, and yours to keep."
/>

<svelte:head>
	{@html ldScript}
</svelte:head>

<div class="container">
	<header class="hero">
		<p class="kicker">Free · no account · yours to download</p>
		<h1>Tools for the part<br />nobody sells you.</h1>
		<p class="lede">
			The vocabulary, the frequency, the raw lists — the unglamorous half of learning a language,
			free and open. Everything here works without signing up, and everything here can be taken with
			you.
		</p>
	</header>
</div>

<!-- Full-bleed: every script we carry, running edge to edge. -->
<div class="strip" aria-hidden="true">
	<div class="track">
		{#each [...strip, ...strip] as l}
			<ScriptDisc nativeName={l.nativeName} code={l.code} size={52} />
		{/each}
	</div>
</div>

<div class="container">
	<ul class="tools" role="list">
		{#each tools as t}
			<li>
				<a href={t.href}>
					<span class="figure">
						<span class="n tabular">{t.figure}</span>
						<span class="unit">{t.label}</span>
					</span>
					<span class="body">
						<span class="head">
							<h2>{t.title}</h2>
							<span class="go" aria-hidden="true">
								<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
							</span>
						</span>
						<span class="what">{t.what}</span>
					</span>
				</a>
			</li>
		{/each}
	</ul>

	<p class="note">
		More will land here as we build them. If there is something you keep wishing existed, the
		<a href="https://discord.langx.io" target="_blank" rel="noopener noreferrer">Discord</a> is where
		we hear about it first.
	</p>

	<section class="cta">
		<h2 class="cta-h">Learning is easier with someone on the other end.</h2>
		<p>
			The tools are free and stay free. The app is where you put them to use — with a person who
			speaks what you are learning, and is learning what you speak.
		</p>
		<div use:ownsPrimary>
			<Button href="https://app.langx.io" variant="primary" size="lg">Start for free</Button>
		</div>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.hero {
		padding: var(--space-2xl) 0 var(--space-lg);

		@include for-tablet-portrait-down {
			padding-top: var(--space-xl);
		}
	}

	.kicker {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color--text-quiet);
		margin-bottom: var(--space-xs);
	}

	h1 {
		max-width: 20ch;
	}

	.lede {
		font-size: 1.125rem;
		line-height: 1.55;
		color: var(--color--text-shade);
		max-width: 56ch;
		margin-top: var(--space-sm);
	}

	// The one attention-grabbing object on the page, and it is the product's own
	// material rather than decoration: every writing system we carry, bleeding to
	// the viewport edges between two hairlines — the same device the homepage
	// marquee uses.
	.strip {
		margin: var(--space-md) calc(50% - 50vw) var(--space-xl);
		width: 100vw;
		overflow: hidden;
		border-top: 1px solid var(--color--border);
		border-bottom: 1px solid var(--color--border);
		padding: var(--space-sm) 0;
		position: relative;

		// Ground-coloured fades at each edge, the way the homepage marquee does
		// it — rather than a mask, which would need a colour of its own.
		&::before,
		&::after {
			content: '';
			position: absolute;
			top: 0;
			bottom: 0;
			width: 10%;
			z-index: 1;
			pointer-events: none;
		}

		&::before {
			left: 0;
			background: linear-gradient(90deg, var(--color--page-background), transparent);
		}

		&::after {
			right: 0;
			background: linear-gradient(270deg, var(--color--page-background), transparent);
		}
	}

	.track {
		display: flex;
		gap: var(--space-2xs);
		width: max-content;
		animation: slide 60s linear infinite;
	}

	@keyframes slide {
		from {
			transform: translateX(0);
		}
		to {
			// The list is rendered twice, so half a turn is a seamless loop.
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.strip {
			overflow-x: auto;
			mask-image: none;
		}
		.track {
			animation: none;
		}
	}

	.tools {
		border-top: 1px solid var(--color--border);

		li {
			border-bottom: 1px solid var(--color--border);
		}

		a {
			display: grid;
			grid-template-columns: 12rem 1fr;
			gap: var(--space-lg);
			padding: var(--space-lg) 0;
			color: var(--color--text);
		}

		@include for-tablet-portrait-down {
			a {
				grid-template-columns: 1fr;
				gap: var(--space-2xs);
				padding: var(--space-md) 0;
			}
		}
	}

	.figure {
		display: flex;
		flex-direction: column;

		.n {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			line-height: 1.05;
			letter-spacing: -0.02em;
		}

		.unit {
			font-size: 0.8125rem;
			color: var(--color--text-quiet);
			margin-top: 2px;
		}

		@include for-tablet-portrait-down {
			flex-direction: row;
			align-items: baseline;
			gap: var(--space-2xs);

			.unit {
				margin-top: 0;
			}
		}
	}

	.body {
		display: block;
		min-width: 0;
	}

	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-sm);

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.375rem, 1.1rem + 1.1vw, 1.875rem);
			letter-spacing: -0.015em;
			max-width: 24ch;
		}
	}

	.go {
		flex: 0 0 auto;
		color: var(--color--accent);

		svg {
			width: 22px;
			height: 22px;
			fill: none;
			stroke: currentColor;
			stroke-width: 2.5;
			stroke-linecap: round;
			stroke-linejoin: round;
			transition: transform var(--dur-fast) var(--ease-out);
		}
	}

	@media (hover: hover) and (pointer: fine) {
		.tools a:hover .go svg {
			transform: translateX(3px);
		}
	}

	.what {
		display: block;
		color: var(--color--text-shade);
		max-width: 64ch;
		margin-top: var(--space-2xs);
	}

	.note {
		margin-top: var(--space-md);
		color: var(--color--text-quiet);
		max-width: 60ch;
		font-size: 0.9375rem;

		a {
			color: var(--color--accent);
		}
	}

	.cta {
		margin-top: var(--space-2xl);
		border-top: 1px solid var(--color--border);
		padding: var(--space-2xl) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		.cta-h {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			letter-spacing: -0.015em;
			max-width: 20ch;
		}

		p {
			color: var(--color--text-shade);
			max-width: 52ch;
			margin: var(--space-2xs) 0 var(--space-md);
		}
	}
</style>
