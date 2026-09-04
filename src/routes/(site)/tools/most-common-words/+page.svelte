<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { siteBaseUrl } from '$lib/data/meta';
	import { WORD_LISTS, totalWords } from '$lib/data/most-common-words';
	import {
		lookupWord,
		lookupEnglish,
		MIN_QUERY,
		type WordHit,
		type EnglishHit
	} from '$lib/utils/wordSearch';

	const nf = new Intl.NumberFormat('en-US');
	const byCode = new Map(WORD_LISTS.map((l) => [l.code, l]));

	/** The languages people arrive looking for, in roughly the order they ask. */
	const POPULAR = ['es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ko', 'tr', 'ar', 'nl', 'pl'];
	const popular = POPULAR.map((c) => byCode.get(c)).filter(Boolean) as typeof WORD_LISTS;

	const stats = [
		{ n: nf.format(WORD_LISTS.length), label: 'languages' },
		{ n: nf.format(totalWords), label: 'words, ranked by how often they are said' },
		{ n: 'Every one', label: 'carries its meaning in English' },
		{ n: 'Free', label: 'no account, no sign-up, yours to download' }
	];

	// — Search ————————————————————————————————————————————————————————
	let query = '';
	let searching = false;
	let ran = false;
	type Group =
		| { kind: 'english'; key: string; exact: boolean; rows: EnglishHit[] }
		| { kind: 'word'; key: string; exact: boolean; rows: WordHit[] };
	let groups: Group[] = [];
	let timer: ReturnType<typeof setTimeout>;
	let seq = 0;

	const EXAMPLES = ['water', 'house', 'agua', 'ev', 'gato'];

	function onInput() {
		clearTimeout(timer);
		const q = query.trim();
		if (q.length < MIN_QUERY) {
			groups = [];
			ran = false;
			searching = false;
			return;
		}
		searching = true;
		// The index is fetched a shard at a time; waiting out the typing keeps
		// that to one request per word rather than one per keystroke.
		timer = setTimeout(run, 220);
	}

	async function run() {
		const mine = ++seq;
		const q = query.trim().toLowerCase();
		const [e, w] = await Promise.all([lookupEnglish(q), lookupWord(q)]);
		if (mine !== seq) return; // a later keystroke already won

		const all: Group[] = [
			...e.map((g) => ({ kind: 'english' as const, key: g.key, exact: g.key === q, rows: g.hits })),
			...w.map((g) => ({ kind: 'word' as const, key: g.key, exact: g.key === q, rows: g.hits }))
		];
		// Typing "su" prefix-matches sun, sum and suck before it reaches the
		// Turkish word for water. Whatever the visitor actually typed leads.
		const exact = all.filter((g) => g.exact);
		const rest = all.filter((g) => !g.exact).sort((a, b) => b.rows.length - a.rows.length);
		groups = [...exact, ...rest].slice(0, exact.length ? exact.length + 2 : 4);

		searching = false;
		ran = true;
	}

	function example(word: string) {
		query = word;
		onInput();
	}

	$: nothing = ran && !searching && !groups.length;

	const faq = [
		{
			q: 'Where do these lists come from?',
			a: 'From the OpenSubtitles corpus — tens of millions of lines of film and television subtitles — counted and ranked by the FrequencyWords project. That is a record of speech rather than of writing, which is why the ranking suits people who want to talk.'
		},
		{
			q: 'Why does the same verb appear more than once?',
			a: 'Because these are word forms, not dictionary headwords. In Spanish, es, era and fue are all the verb ser, and all three are counted separately because all three are things you actually hear.'
		},
		{
			q: 'How many words do I need?',
			a: 'The first hundred carry a surprising share of ordinary conversation, and the first thousand carry most of it. After that each new word buys you less, which is the point at which talking to someone beats studying a list.'
		},
		{
			q: 'Can I use these lists in my own project?',
			a: 'Yes. They are derived from CC BY-SA 4.0 sources and are published under the same licence, so use them freely as long as you credit the sources and pass the same freedom on.'
		}
	];

	const ld = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Tools', item: `${siteBaseUrl}/tools` },
					{ '@type': 'ListItem', position: 2, name: 'Most common words' }
				]
			},
			{
				'@type': 'FAQPage',
				mainEntity: faq.map((f) => ({
					'@type': 'Question',
					name: f.q,
					acceptedAnswer: { '@type': 'Answer', text: f.a }
				}))
			},
			{
				'@type': 'ItemList',
				name: `Most common word lists in ${WORD_LISTS.length} languages`,
				numberOfItems: WORD_LISTS.length,
				itemListElement: WORD_LISTS.map((l, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: `${nf.format(l.count)} most common ${l.name} words`,
					url: `${siteBaseUrl}/tools/most-common-words/${l.slug}`
				}))
			}
		]
	});

	// The angle bracket is written as an escape and never appears literally in
	// this file: Svelte's parser scans the raw source, comments included, and
	// treats a script tag written out in full as a real tag. It is escaped in
	// the JSON too, so a gloss containing a closing tag cannot break out.
	const LT = '\u003c';
	const ldScript = `${LT}script type="application/ld+json">${ld
		.split(LT)
		.join('\\u003c')}${LT}/script>`;
</script>

<Seo
	title="The most common words in {WORD_LISTS.length} languages"
	path="/tools/most-common-words"
	description="Free frequency-ranked word lists for {WORD_LISTS.length} languages — {nf.format(
		totalWords
	)} words, every one with its meaning in English. Search across every language at once, or download any list."
/>

<svelte:head>
	{@html ldScript}
</svelte:head>

<div class="container">
	<header class="lede-block">
		<p class="kicker">Free tool</p>
		<h1>The words people actually say, in {WORD_LISTS.length} languages.</h1>
		<p class="lede">
			Ranked by how often each word turns up in real speech, not in writing — and every single one
			carries its meaning in English. Search all {WORD_LISTS.length} languages at once, or take a whole
			list with you.
		</p>
	</header>

	<dl class="stats">
		{#each stats as s}
			<div>
				<dt class="tabular">{s.n}</dt>
				<dd>{s.label}</dd>
			</div>
		{/each}
	</dl>

	<section class="search" aria-labelledby="search-h">
		<h2 id="search-h">Look up a word</h2>
		<p class="hint">
			Type English to see it in every language, or type a foreign word to find out what it means and
			whose it is.
		</p>

		<div class="field">
			<svg class="mag" viewBox="0 0 24 24" aria-hidden="true">
				<circle cx="11" cy="11" r="7" />
				<path d="m20 20-3.6-3.6" />
			</svg>
			<input
				type="search"
				bind:value={query}
				on:input={onInput}
				placeholder="water, agua, ev…"
				aria-label="Search every language"
				autocomplete="off"
				spellcheck="false"
			/>
		</div>

		<p class="examples">
			<span>Try</span>
			{#each EXAMPLES as e}
				<button type="button" class="chip" on:click={() => example(e)}>{e}</button>
			{/each}
		</p>

		<div class="results" aria-live="polite">
			{#if searching}
				<p class="quiet">Searching…</p>
			{:else if nothing}
				<p class="quiet">
					Nothing for “{query.trim()}”. The search covers the commonest few thousand words of each
					language — a rarer word may still be on its own language's page.
				</p>
			{/if}

			{#each groups as group (group.kind + group.key)}
				<div class="group">
					<h3>
						{#if group.kind === 'english'}
							“{group.key}” in {group.rows.length}
							{group.rows.length === 1 ? 'language' : 'languages'}
						{:else}
							“{group.key}” means
						{/if}
					</h3>
					<ul class="rows" role="list">
						{#each group.rows as hit}
							{@const l = byCode.get(hit.code)}
							{#if l}
								<li>
									<a href="/tools/most-common-words/{l.slug}">
										<ScriptDisc nativeName={l.nativeName} size={34} />
										<span class="term" lang={hit.code}>{hit.word}</span>
										<span class="lang">{l.name}</span>
										<span class="meaning">{hit.gloss}</span>
										<span class="rank tabular">#{nf.format(hit.rank)}</span>
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>

	<section class="block">
		<h2>Start here</h2>
		<ul class="popular" role="list">
			{#each popular as l}
				<li>
					<a href="/tools/most-common-words/{l.slug}">
						<ScriptDisc nativeName={l.nativeName} size={44} />
						<span class="names">
							<span class="native" lang={l.code}>{l.nativeName}</span>
							<span class="english">{l.name} · {nf.format(l.count)} words</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="block">
		<h2>All {WORD_LISTS.length} languages</h2>
		<p class="hint">Every list is free to browse and free to download as a spreadsheet file.</p>
		<ul class="index rows" role="list">
			{#each WORD_LISTS as l}
				<li>
					<a class="main" href="/tools/most-common-words/{l.slug}">
						<ScriptDisc nativeName={l.nativeName} size={34} />
						<span class="lang">{l.name}</span>
						<span class="native" lang={l.code}>{l.nativeName}</span>
						<span class="n tabular">{nf.format(l.count)}</span>
					</a>
					<a
						class="dl"
						href="/data/most-common-words/{l.slug}.tsv"
						download
						aria-label="Download the {l.name} list, {nf.format(l.count)} words"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M12 4v11" />
							<path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
							<path d="M4.5 19.5h15" />
						</svg>
						<span>Download</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="block faq">
		<h2>Questions</h2>
		<dl>
			{#each faq as f}
				<dt>{f.q}</dt>
				<dd>{f.a}</dd>
			{/each}
		</dl>
	</section>

	<section class="cta">
		<h2>Words stick once you use them.</h2>
		<p>
			A list gets you the first few hundred. Saying them to someone who speaks the language is what
			makes them stay.
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

	h1 {
		max-width: 20ch;
	}

	.lede {
		font-size: 1.125rem;
		line-height: 1.55;
		color: var(--color--text-shade);
		max-width: 58ch;
		margin-top: var(--space-sm);
	}

	// The one loud object on the page, and it is type rather than a box: four
	// figures on the ground, divided by hairlines like every other list here.
	.stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		border-top: 1px solid var(--color--border);
		border-bottom: 1px solid var(--color--border);

		> div {
			padding: var(--space-md) var(--space-md) var(--space-md) 0;

			+ div {
				border-left: 1px solid var(--color--border);
				padding-left: var(--space-md);
			}
		}

		dt {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.2rem + 1.8vw, 2.75rem);
			line-height: 1.05;
			letter-spacing: -0.02em;
		}

		dd {
			margin-top: var(--space-2xs);
			font-size: 0.8125rem;
			line-height: 1.4;
			color: var(--color--text-quiet);
			max-width: 22ch;
		}

		@include for-tablet-portrait-down {
			grid-template-columns: repeat(2, 1fr);

			> div:nth-child(odd) + div {
				border-left: 1px solid var(--color--border);
			}
			> div:nth-child(n + 3) {
				border-top: 1px solid var(--color--border);
			}
		}

		@include for-phone-only {
			grid-template-columns: 1fr;

			> div + div {
				border-left: 0;
				padding-left: 0;
				border-top: 1px solid var(--color--border);
			}
		}
	}

	.search {
		padding: var(--space-xl) 0 var(--space-md);
	}

	h2 {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
		letter-spacing: -0.015em;
	}

	.hint {
		color: var(--color--text-quiet);
		max-width: 62ch;
		margin-top: var(--space-2xs);
	}

	// The app's input: a muted pill that lifts to the ground and takes a blue
	// border on focus. No outer ring here — the border is the ring.
	.field {
		position: relative;
		margin-top: var(--space-md);
		max-width: 34rem;

		&:focus-within .mag {
			stroke: var(--color--accent);
		}

		.mag {
			position: absolute;
			left: 18px;
			top: 50%;
			transform: translateY(-50%);
			width: 20px;
			height: 20px;
			fill: none;
			stroke: var(--color--text-quiet);
			stroke-width: 2;
			stroke-linecap: round;
			pointer-events: none;
			transition: stroke var(--dur-fast) ease;
		}

		input {
			width: 100%;
			height: 56px;
			padding: 0 18px 0 48px;
			border-radius: var(--radius-pill);
			border: 1px solid transparent;
			background: var(--color--muted);
			color: var(--color--text);
			font-family: var(--font--default);
			font-size: 1rem;
			transition: background-color var(--dur-fast) ease, border-color var(--dur-fast) ease;

			&::placeholder {
				color: var(--color--text-quiet);
			}

			&:focus {
				outline: none;
				background: var(--color--page-background);
				border-color: var(--color--accent);
			}
		}
	}

	.examples {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3xs);
		margin-top: var(--space-sm);
		font-size: 0.8125rem;
		color: var(--color--text-quiet);

		span {
			margin-right: var(--space-3xs);
		}
	}

	.chip {
		border: 1px solid var(--color--border);
		background: none;
		color: var(--color--text-shade);
		border-radius: var(--radius-pill);
		padding: 5px 12px;
		font-family: var(--font--default);
		font-size: 0.8125rem;
		cursor: pointer;
		transition: color var(--dur-fast) ease, border-color var(--dur-fast) ease,
			transform var(--dur-press) var(--ease-out);

		&:active {
			transform: scale(0.95);
		}

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				color: var(--color--text);
				border-color: var(--color--text);
			}
		}
	}

	.results {
		margin-top: var(--space-md);
		min-height: 2rem;
	}

	.quiet {
		color: var(--color--text-quiet);
		max-width: 62ch;
	}

	.group {
		margin-bottom: var(--space-lg);

		h3 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.125rem;
			margin-bottom: var(--space-2xs);
		}
	}

	// Rows, per DESIGN.md: hairline on top of the list, hairline under each row,
	// ground showing through. No cards anywhere on this page.
	.rows {
		border-top: 1px solid var(--color--border);

		li {
			border-bottom: 1px solid var(--color--border);
		}
	}

	.group a {
		display: grid;
		grid-template-columns: auto minmax(6rem, auto) minmax(5rem, auto) 1fr auto;
		align-items: center;
		gap: var(--space-sm);
		padding: 12px 0;
		color: var(--color--text);

		.term {
			font-family: var(--font--title);
			font-weight: 800;
		}

		.lang {
			color: var(--color--text-shade);
			font-size: 0.9375rem;
		}

		.meaning {
			color: var(--color--text-quiet);
			font-size: 0.9375rem;
			overflow-wrap: anywhere;
		}

		.rank {
			color: var(--color--text-tertiary);
			font-size: 0.8125rem;
		}

		@include for-phone-only {
			grid-template-columns: auto 1fr auto;
			row-gap: 2px;

			.lang {
				grid-column: 3;
				text-align: right;
			}
			.meaning {
				grid-column: 2 / 4;
			}
			.rank {
				display: none;
			}
		}
	}

	.block {
		padding: var(--space-xl) 0 0;
	}

	.popular {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
		gap: 0 var(--space-lg);
		border-top: 1px solid var(--color--border);
		margin-top: var(--space-sm);

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

	.index {
		margin-top: var(--space-sm);

		li {
			display: flex;
			align-items: center;
			gap: var(--space-sm);
		}

		.main {
			display: grid;
			grid-template-columns: auto minmax(7rem, auto) 1fr auto;
			align-items: center;
			gap: var(--space-sm);
			flex: 1 1 auto;
			min-width: 0;
			padding: 13px 0;
			color: var(--color--text);
		}

		.lang {
			font-family: var(--font--title);
			font-weight: 800;
		}

		.native {
			color: var(--color--text-shade);
			font-size: 0.9375rem;
			overflow-wrap: anywhere;
		}

		.n {
			color: var(--color--text-quiet);
			font-size: 0.8125rem;
		}

		// Blue means interactive; a download is not the page's committing action,
		// so it is a ghost, never a second yellow.
		.dl {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			flex: 0 0 auto;
			height: 36px;
			padding: 0 12px;
			border-radius: var(--radius-pill);
			color: var(--color--accent);
			font-size: 0.8125rem;
			font-weight: 600;
			transition: background-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);

			svg {
				width: 17px;
				height: 17px;
				fill: none;
				stroke: currentColor;
				stroke-width: 2;
				stroke-linecap: round;
				stroke-linejoin: round;
			}

			&:active {
				transform: scale(0.95);
			}

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					background: var(--color--accent-tint);
				}
			}
		}

		@include for-phone-only {
			.main {
				grid-template-columns: auto 1fr auto;
			}
			.native {
				display: none;
			}
			.dl span {
				display: none;
			}
			.dl {
				padding: 0 10px;
			}
		}
	}

	.faq {
		dt {
			font-family: var(--font--title);
			font-weight: 800;
			margin-top: var(--space-md);
		}

		dd {
			color: var(--color--text-shade);
			max-width: 66ch;
			margin-top: var(--space-3xs);
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

		p {
			color: var(--color--text-shade);
			max-width: 46ch;
			margin: var(--space-2xs) 0 var(--space-md);
		}
	}
</style>
