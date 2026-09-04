<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { siteBaseUrl } from '$lib/data/meta';
	import { intro } from '$lib/data/most-common-words-intros';
	import type { WordListMeta } from '$lib/data/most-common-words';

	type Row = { rank: number; word: string; english: string };

	export let data: {
		meta: WordListMeta;
		rows: Row[];
		rendered: number;
		others: { slug: string; name: string; count: number }[];
	};

	$: ({ meta, rows, rendered, others } = data);

	const nf = new Intl.NumberFormat('en-US');
	$: path = `/tools/most-common-words/${meta.slug}`;
	$: fileUrl = `/data/most-common-words/${meta.slug}.tsv`;
	$: title = `${nf.format(meta.count)} most common ${meta.name} words`;

	/** Tiers are filters on this page, not separate URLs — see the plan. */
	$: tiers = [100, 200, 500, 1000, 5000, 10000].filter((n) => n < meta.count).concat(meta.count);

	/**
	 * Example sentences live in their own file and are fetched the first time
	 * somebody opens a row. Most visitors read the list and never ask, and a
	 * sentence under every row would make the table unreadable anyway.
	 */
	let examples: Map<number, { sentence: string; english: string }> | null = null;
	let loadingEx = false;
	let open: number | null = null;

	async function toggleExample(rank: number) {
		open = open === rank ? null : rank;
		if (open === null || examples || loadingEx) return;
		loadingEx = true;
		try {
			const res = await fetch(`/data/most-common-words/ex/${meta.slug}.tsv`);
			if (res.ok) {
				const map = new Map<number, { sentence: string; english: string }>();
				for (const line of (await res.text()).split('\n').slice(1)) {
					if (!line) continue;
					const [r, sentence, english] = line.split('\t');
					map.set(Number(r), { sentence, english });
				}
				examples = map;
			} else {
				examples = new Map();
			}
		} catch {
			examples = new Map();
		} finally {
			loadingEx = false;
		}
	}

	let all: Row[] = [];
	let loading = false;
	let loaded = false;
	let query = '';
	// Starts at everything the server rendered, so the indexable HTML and the
	// first paint are the same thousand rows.
	let limit = data.rendered;

	$: source = loaded ? all : rows;
	$: needle = query.trim().toLowerCase();
	$: filtered = needle
		? source.filter(
				(r) => r.word.toLowerCase().includes(needle) || r.english.toLowerCase().includes(needle)
		  )
		: source;
	$: visible = filtered.slice(0, limit);
	/** Everything past the prerendered block needs the rest of the file. */
	$: needsMore = !loaded && (limit > rendered || needle.length > 0);

	async function loadAll() {
		if (loaded || loading) return;
		loading = true;
		try {
			const res = await fetch(fileUrl);
			const text = await res.text();
			all = text
				.split('\n')
				.slice(1)
				.filter(Boolean)
				.map((line) => {
					const [rank, word, english] = line.split('\t');
					return { rank: Number(rank), word, english: english ?? '' };
				});
			loaded = true;
		} catch {
			// The prerendered rows are still on the page; leave them be.
		} finally {
			loading = false;
		}
	}

	/**
	 * Downloads are built in the browser rather than shipped as files. Six tiers
	 * across fifty-three languages would be 300 more files in the repo for data
	 * that is already here, and this way the tier the reader picked is the tier
	 * they get.
	 */
	let downloading = false;

	function csvCell(value: string) {
		// A meaning like "of, from" has to be quoted or the column splits.
		return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
	}

	async function download(format: 'csv' | 'anki' | 'txt', count: number) {
		if (downloading) return;
		downloading = true;
		try {
			if (count > rendered) await loadAll();
			const list = (loaded ? all : rows).slice(0, count);
			const name = `${meta.slug}-${count === meta.count ? 'all' : `top-${count}`}-words`;

			let body: string;
			if (format === 'anki') {
				// Anki reads these header directives and imports in one click, with
				// no field mapping to guess at. File order is frequency order, so a
				// deck studied in order teaches the commonest words first.
				const tier = count === meta.count ? 'all' : `top-${count}`;
				body =
					`#separator:tab\n` +
					`#html:false\n` +
					`#notetype:Basic\n` +
					`#deck:${meta.name} — most common words (langx.io)\n` +
					`#tags:langx ${meta.slug} ${tier}\n` +
					list.map((r) => `${r.word}\t${r.english}`).join('\n');
			} else if (format === 'csv') {
				body =
					'rank,word,english\n' +
					list.map((r) => `${r.rank},${csvCell(r.word)},${csvCell(r.english)}`).join('\n');
			} else {
				// Plain text carries the credit, because a file that travels away
				// from this page still has to name where the data came from.
				const width = Math.max(...list.map((r) => r.word.length)) + 2;
				body =
					`# The ${nf.format(count)} most common ${meta.name} words\n` +
					`# From langx.io/tools/most-common-words/${meta.slug}\n` +
					`# Frequencies: OpenSubtitles via hermitdave/FrequencyWords. ` +
					`Meanings: Wiktextract. Both CC BY-SA 4.0, as is this list.\n\n` +
					list
						.map((r) => `${String(r.rank).padStart(6)}  ${r.word.padEnd(width)}${r.english}`)
						.join('\n');
			}

			const url = URL.createObjectURL(
				new Blob([body], {
					type: format === 'csv' ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8'
				})
			);
			const a = document.createElement('a');
			a.href = url;
			// Anki wants a .txt; the suffix keeps it apart from the readable one.
			a.download = format === 'anki' ? `${name}-anki.txt` : `${name}.${format}`;
			a.click();
			URL.revokeObjectURL(url);
		} finally {
			downloading = false;
		}
	}

	function jump(n: number) {
		query = '';
		limit = n;
		if (n > rendered) loadAll();
	}

	const ld = (m: WordListMeta, list: Row[]) =>
		JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'BreadcrumbList',
					itemListElement: [
						{ '@type': 'ListItem', position: 1, name: 'Tools', item: `${siteBaseUrl}/tools` },
						{
							'@type': 'ListItem',
							position: 2,
							name: 'Most common words',
							item: `${siteBaseUrl}/tools/most-common-words`
						},
						{ '@type': 'ListItem', position: 3, name: m.name }
					]
				},
				{
					'@type': 'ItemList',
					name: `${nf.format(m.count)} most common ${m.name} words`,
					numberOfItems: m.count,
					itemListOrder: 'https://schema.org/ItemListOrderDescending',
					itemListElement: list.slice(0, 100).map((r, i) => ({
						'@type': 'ListItem',
						position: i + 1,
						name: r.word,
						description: r.english
					}))
				}
			]
		});

	// The angle bracket is written as an escape and never appears literally in
	// this file: Svelte's parser scans the raw source, comments included, and
	// treats a script tag written out in full as a real tag. It is escaped in
	// the JSON too, so a gloss containing a closing tag cannot break out; with
	// that done the string is our own data and nothing else.
	const LT = '\u003c';
	$: ldScript = `${LT}script type="application/ld+json">${ld(meta, rows)
		.split(LT)
		.join('\\u003c')}${LT}/script>`;
</script>

<Seo
	{title}
	{path}
	description="The {nf.format(
		meta.count
	)} most common words in {meta.name} ({meta.nativeName}), ranked by how often they turn up in everyday speech, each with its meaning in English. Free to browse and download."
/>

<svelte:head>
	{@html ldScript}
</svelte:head>

<div class="container">
	<PageHeader
		{title}
		lede="Ranked by how often each word turns up in everyday {meta.name}, with its meaning in English."
	/>

	<p class="intro">{intro(meta)}</p>

	<div class="controls">
		<div class="chips" role="group" aria-label="Jump to a point in the list">
			{#each tiers as n}
				<button
					type="button"
					class="chip"
					class:on={limit === n && !needle}
					on:click={() => jump(n)}
				>
					Top {nf.format(n)}
				</button>
			{/each}
		</div>
		<label class="search">
			<span class="sr-only">Search this list</span>
			<input
				type="search"
				bind:value={query}
				on:input={loadAll}
				placeholder="Search this list"
				autocomplete="off"
			/>
		</label>
	</div>

	{#if needle}
		<p class="status" aria-live="polite">
			{nf.format(filtered.length)}
			{filtered.length === 1 ? 'word' : 'words'} matching “{query.trim()}”
			{#if needsMore && loading}· loading the rest of the list{/if}
		</p>
	{/if}

	<table class="words">
		<caption class="sr-only">
			The most common words in {meta.name}, most frequent first, with English meanings.
		</caption>
		<thead>
			<tr
				><th scope="col" class="rank">#</th><th scope="col">Word</th><th scope="col">In English</th
				></tr
			>
		</thead>
		<tbody>
			{#each visible as row (row.word)}
				<tr class:open={open === row.rank}>
					<td class="rank">{nf.format(row.rank)}</td>
					<td class="word" lang={meta.code}>{row.word}</td>
					<td class="gloss">
						{row.english}
						{#if row.rank <= 1000}
							<button
								type="button"
								class="ex-toggle"
								aria-expanded={open === row.rank}
								on:click={() => toggleExample(row.rank)}
							>
								{open === row.rank ? 'Hide example' : 'Example'}
							</button>
						{/if}
					</td>
				</tr>
				{#if open === row.rank}
					<tr class="ex-row">
						<td />
						<td colspan="2">
							{#if loadingEx}
								<span class="ex-quiet">Loading…</span>
							{:else if examples?.get(row.rank)}
								{@const ex = examples.get(row.rank)}
								<p class="ex-sentence" lang={meta.code}>{ex?.sentence}</p>
								<p class="ex-english">{ex?.english}</p>
							{:else}
								<span class="ex-quiet">No example sentence for this word yet.</span>
							{/if}
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>

	{#if !filtered.length}
		<p class="status">No word in this list matches “{query.trim()}”.</p>
	{/if}

	{#if limit < filtered.length}
		<div class="more">
			<button type="button" class="show-more" on:click={() => (limit += 700)} disabled={loading}>
				{loading ? 'Loading…' : 'Show more words'}
			</button>
			<p class="count">
				Showing {nf.format(visible.length)} of {nf.format(filtered.length)}
			</p>
		</div>
	{/if}

	<section class="download">
		<h2>Take the list with you</h2>
		<p>
			Rank, word and meaning in three columns. Pick how much of the list you want — the same slices
			as the buttons above.
		</p>

		<div class="dl-grid">
			{#each tiers as n}
				<div class="dl-row">
					<span class="dl-n">Top {nf.format(n)}</span>
					<button type="button" on:click={() => download('csv', n)} disabled={downloading}>
						CSV
					</button>
					<button type="button" on:click={() => download('anki', n)} disabled={downloading}>
						Anki
					</button>
					<button type="button" on:click={() => download('txt', n)} disabled={downloading}>
						Text
					</button>
				</div>
			{/each}
		</div>

		<p class="dl-note">
			CSV opens straight into Excel, Numbers or Google Sheets, and imports into Anki. For a
			printable copy, choose a size above and use your browser's print command — the page prints as
			a clean list, and every script comes out right.
		</p>

		<p class="credit">
			Frequencies come from the OpenSubtitles corpus via
			<a
				href="https://github.com/hermitdave/FrequencyWords"
				rel="noopener noreferrer"
				target="_blank">hermitdave/FrequencyWords</a
			>; English meanings from
			<a href="https://kaikki.org" rel="noopener noreferrer" target="_blank">Wiktextract</a>. Both
			are CC BY-SA 4.0, and so is this list — keep the credit if you pass it on. Example sentences
			come from <a href="https://tatoeba.org" rel="noopener noreferrer" target="_blank">Tatoeba</a>,
			CC BY 2.0 FR. The
			<a href={fileUrl} download>raw data file</a> is here too.
		</p>
	</section>

	<section class="cta">
		<h2>Words stick once you use them</h2>
		<p>
			A list gets you the first few hundred. Saying them to someone who speaks {meta.name} is what makes
			them stay.
		</p>
		<div use:ownsPrimary>
			<Button href="https://app.langx.io" variant="primary" size="lg">
				Find someone who speaks {meta.name}
			</Button>
		</div>
	</section>

	<nav class="others" aria-label="Other languages">
		<h2>Other languages</h2>
		<ul role="list">
			{#each others as o}
				<li><a href="/tools/most-common-words/{o.slug}">{o.name}</a></li>
			{/each}
		</ul>
	</nav>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.intro {
		max-width: 68ch;
		color: var(--color--text-shade);
		margin-bottom: var(--space-lg);
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3xs);
	}

	// Pills, per DESIGN.md. `Tag` is a span and `Segmented` is a single-choice
	// thumb, so neither fits a row of six filters.
	.chip {
		border: 1px solid var(--color--border);
		background: none;
		color: var(--color--text-shade);
		border-radius: var(--radius-pill);
		padding: 7px 14px;
		font-size: 0.8125rem;
		cursor: pointer;
		transition: color var(--dur-fast) ease, border-color var(--dur-fast) ease,
			transform var(--dur-press) var(--ease-out);

		&.on {
			color: var(--color--text);
			border-color: var(--color--text);
		}

		&:active {
			transform: scale(0.95);
		}

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				color: var(--color--text);
			}
		}
	}

	.search input {
		height: 44px;
		min-width: 240px;
		padding: 0 var(--space-sm);
		border-radius: var(--radius-pill);
		border: 1px solid var(--color--border);
		background: none;
		color: var(--color--text);
		font-family: var(--font--default);
		font-size: 0.9375rem;

		&::placeholder {
			color: var(--color--text-tertiary);
		}
	}

	.status {
		color: var(--color--text-shade);
		font-size: 0.9375rem;
		margin-bottom: var(--space-sm);
	}

	// Rows, not a boxed table: hairline top on the list, hairline under each
	// row, and the page ground showing through.
	.words {
		width: 100%;
		border-collapse: collapse;
		border-top: 1px solid var(--color--border);
		table-layout: fixed;

		th,
		td {
			text-align: left;
			padding: 11px var(--space-2xs) 11px 0;
			border-bottom: 1px solid var(--color--border);
			vertical-align: baseline;
			overflow-wrap: anywhere;
		}

		th {
			font-size: 0.75rem;
			text-transform: uppercase;
			letter-spacing: 0.06em;
			color: var(--color--text-tertiary);
			font-weight: 600;
		}

		.rank {
			width: 4.5rem;
			color: var(--color--text-tertiary);
			font-variant-numeric: tabular-nums;
		}

		.word {
			width: 38%;
			font-weight: 600;
		}

		.gloss {
			color: var(--color--text-shade);
		}

		@include for-phone-only {
			.rank {
				width: 3rem;
			}
			.word {
				width: 40%;
			}
			th,
			td {
				font-size: 0.9375rem;
			}
		}
	}

	// A quiet affordance: it should not compete with the word it sits beside.
	.ex-toggle {
		margin-left: var(--space-2xs);
		border: 0;
		background: none;
		padding: 0;
		color: var(--color--accent);
		font-family: var(--font--default);
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		opacity: 0;
		transition: opacity var(--dur-fast) ease;
	}

	// Always there for keyboard and touch; only fades in for a pointer, where an
	// always-visible link on a thousand rows would be noise.
	tr:hover .ex-toggle,
	tr.open .ex-toggle,
	.ex-toggle:focus-visible {
		opacity: 1;
	}

	@media (hover: none) {
		.ex-toggle {
			opacity: 1;
		}
	}

	.ex-row td {
		padding-top: 0;
		padding-bottom: 14px;
	}

	.ex-sentence {
		font-size: 1rem;
		max-width: 60ch;
	}

	.ex-english {
		color: var(--color--text-quiet);
		font-size: 0.9375rem;
		max-width: 60ch;
		margin-top: 2px;
	}

	.ex-quiet {
		color: var(--color--text-quiet);
		font-size: 0.8125rem;
	}

	.more {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2xs);
		padding: var(--space-lg) 0;
	}

	.show-more {
		height: 48px;
		padding: 0 var(--space-lg);
		border-radius: var(--radius-pill);
		border: 1px solid var(--color--text);
		background: none;
		color: var(--color--text);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
		cursor: pointer;
		transition: transform var(--dur-press) var(--ease-out);

		&:active {
			transform: scale(0.98);
		}

		&:disabled {
			opacity: 0.6;
			cursor: default;
		}
	}

	.count {
		color: var(--color--text-tertiary);
		font-size: 0.8125rem;
	}

	.download,
	.cta,
	.others {
		border-top: 1px solid var(--color--border);
		padding: var(--space-xl) 0;

		h2 {
			margin-bottom: var(--space-2xs);
		}
	}

	.download,
	.cta {
		p {
			max-width: 62ch;
			color: var(--color--text-shade);
			margin-bottom: var(--space-2xs);
		}
	}

	.dl-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 0 var(--space-lg);
		border-top: 1px solid var(--color--border);
		margin-top: var(--space-md);
	}

	.dl-row {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		padding: 11px 0;
		border-bottom: 1px solid var(--color--border);
	}

	.dl-n {
		flex: 1 1 auto;
		font-family: var(--font--title);
		font-weight: 800;
		font-variant-numeric: tabular-nums;
	}

	// Blue means interactive; a download is not the page's committing action, so
	// it is never a second yellow.
	.dl-row button {
		flex: 0 0 auto;
		height: 34px;
		padding: 0 12px;
		border-radius: var(--radius-pill);
		border: 1px solid var(--color--border);
		background: none;
		color: var(--color--accent);
		font-family: var(--font--default);
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color var(--dur-fast) ease, border-color var(--dur-fast) ease,
			transform var(--dur-press) var(--ease-out);

		&:active {
			transform: scale(0.95);
		}

		&:disabled {
			opacity: 0.5;
			cursor: default;
		}

		@media (hover: hover) and (pointer: fine) {
			&:not(:disabled):hover {
				background: var(--color--accent-tint);
				border-color: transparent;
			}
		}
	}

	.dl-note {
		margin-top: var(--space-sm);
	}

	.credit {
		font-size: 0.8125rem;
		color: var(--color--text-tertiary);
		margin-top: var(--space-sm);
	}

	.cta {
		text-align: center;

		p {
			margin: 0 auto var(--space-md);
		}
	}

	.others ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-md);
		margin-top: var(--space-sm);
	}

	.others a {
		color: var(--color--text-shade);

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				color: var(--color--text);
			}
		}
	}

	@media print {
		:global(header.header),
		:global(footer),
		.controls,
		.ex-toggle,
		.more,
		.download,
		.cta,
		.others,
		.status {
			display: none !important;
		}

		.words {
			border-top: 0;
		}

		.words th,
		.words td {
			padding: 4px 8px 4px 0;
			font-size: 10pt;
		}

		// A word split across a page break is unreadable in a printed list.
		.words tr {
			break-inside: avoid;
		}

		.words thead {
			display: table-header-group;
		}

		.intro {
			max-width: none;
		}
	}
</style>
