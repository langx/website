<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { siteBaseUrl } from '$lib/data/meta';
	import { WORD_LISTS, totalWords } from '$lib/data/most-common-words';

	const nf = new Intl.NumberFormat('en-US');

	/** A few scripts as a sample of the range, not a ranking. */
	const SAMPLE = ['es', 'ru', 'zh', 'ar', 'el', 'ko', 'he', 'hi'];
	const sample = SAMPLE.map((c) => WORD_LISTS.find((l) => l.code === c)).filter(
		Boolean
	) as typeof WORD_LISTS;

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
				numberOfItems: 1,
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: `The most common words in ${WORD_LISTS.length} languages`,
						url: `${siteBaseUrl}/tools/most-common-words`
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
	title="Free language tools"
	path="/tools"
	description="Free tools for language learners from LangX. No account, no sign-up — starting with frequency-ranked word lists for {WORD_LISTS.length} languages, {nf.format(
		totalWords
	)} words, every one with its meaning in English."
/>

<svelte:head>
	{@html ldScript}
</svelte:head>

<div class="container">
	<header class="lede-block">
		<p class="kicker">Free · no account</p>
		<h1>Tools</h1>
		<p class="lede">
			Small, free things worth keeping open in a tab while you learn. Nothing here asks you to sign
			up, and everything here can be downloaded and kept.
		</p>
	</header>

	<ul class="tools rows" role="list">
		<li>
			<a href="/tools/most-common-words">
				<div class="head">
					<h2>The most common words in {WORD_LISTS.length} languages</h2>
					<span class="go" aria-hidden="true">
						<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
					</span>
				</div>
				<p class="what">
					{nf.format(totalWords)} words ranked by how often they are actually spoken, each with its meaning
					in English. Search every language at once, or download a whole list as a spreadsheet.
				</p>
				<div class="discs" aria-hidden="true">
					{#each sample as l}
						<ScriptDisc nativeName={l.nativeName} size={30} />
					{/each}
					<span class="more">+{WORD_LISTS.length - sample.length} more</span>
				</div>
			</a>
		</li>
	</ul>

	<p class="note">
		More will land here as we build them. If there is something you keep wishing existed, the
		<a href="https://discord.langx.io" target="_blank" rel="noopener noreferrer">Discord</a> is where
		we hear about it first.
	</p>

	<section class="cta">
		<h2 class="cta-h">Learning is easier with someone on the other end.</h2>
		<p>
			The tools are free and always will be. The app is where you put them to use — with a person
			who speaks what you are learning.
		</p>
		<div use:ownsPrimary>
			<Button href="https://app.langx.io" variant="primary" size="lg">Start for free</Button>
		</div>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.lede-block {
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

	.lede {
		font-size: 1.125rem;
		line-height: 1.55;
		color: var(--color--text-shade);
		max-width: 56ch;
		margin-top: var(--space-sm);
	}

	// Rows, not cards: the tool is a hairline-bounded row like every other list
	// on the site, and the type does the work of making it feel substantial.
	.rows {
		border-top: 1px solid var(--color--border);

		li {
			border-bottom: 1px solid var(--color--border);
		}
	}

	.tools a {
		display: block;
		padding: var(--space-md) 0;
		color: var(--color--text);
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
		color: var(--color--text-shade);
		max-width: 62ch;
		margin-top: var(--space-2xs);
	}

	.discs {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: var(--space-sm);

		.more {
			margin-left: var(--space-3xs);
			font-size: 0.8125rem;
			color: var(--color--text-quiet);
		}
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
			max-width: 48ch;
			margin: var(--space-2xs) 0 var(--space-md);
		}
	}
</style>
