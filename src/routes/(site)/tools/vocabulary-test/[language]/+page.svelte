<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { siteBaseUrl } from '$lib/data/meta';
	import type { WordListMeta } from '$lib/data/most-common-words';

	type Word = { rank: number; word: string; english: string };
	type Band = { from: number; to: number; words: Word[] };

	export let data: { meta: WordListMeta; bands: Band[] };
	$: ({ meta, bands } = data);

	const nf = new Intl.NumberFormat('en-US');
	$: path = `/tools/vocabulary-test/${meta.slug}`;
	$: total = bands.reduce((n, b) => n + b.words.length, 0);

	let known: Record<number, boolean> = {};
	let done = false;
	let shared = '';

	/**
	 * The forty words in a fixed order. Everything shareable is derived from it:
	 * the test is deterministic, so a bitmask over this list is the whole result
	 * and fits in a short URL.
	 */
	$: asked = bands.flatMap((b) => b.words);

	function encode(): string {
		let bits = 0n;
		asked.forEach((w, i) => {
			if (known[w.rank]) bits |= 1n << BigInt(i);
		});
		return bits.toString(36);
	}

	function decode(value: string) {
		let bits: bigint;
		try {
			bits = BigInt(parseInt(value, 36));
		} catch {
			return;
		}
		const next: Record<number, boolean> = {};
		asked.forEach((w, i) => {
			if ((bits >> BigInt(i)) & 1n) next[w.rank] = true;
		});
		known = next;
		done = true;
	}

	onMount(() => {
		const r = new URL(window.location.href).searchParams.get('r');
		if (r) decode(r);
	});

	function finish() {
		done = true;
		// Put the result in the address bar, so the URL someone copies is the
		// result they are looking at.
		const url = new URL(window.location.href);
		url.searchParams.set('r', encode());
		history.replaceState(null, '', url);
	}

	async function share() {
		// The clipboard gets the link and nothing else. Putting a sentence in
		// front of it meant pasting into the address bar failed.
		const url = `${window.location.origin}${path}?r=${encode()}`;
		try {
			await navigator.clipboard.writeText(url);
			shared = 'Link copied';
		} catch {
			shared = 'Copy the address bar — the result is in the link';
		}
		setTimeout(() => (shared = ''), 3000);
	}

	$: picked = Object.values(known).filter(Boolean).length;
	$: answered = Object.keys(known).length;

	/**
	 * Each band stands for the slice of the list it was drawn from, so knowing
	 * three of five words sampled between rank 300 and 1,000 is evidence that
	 * roughly three fifths of that slice is known. Summing the bands estimates
	 * the whole list. It is an estimate from forty words and the page says so.
	 */
	$: estimate = Math.round(
		bands.reduce((sum, b) => {
			const asked = b.words.length;
			if (!asked) return sum;
			const hit = b.words.filter((w) => known[w.rank]).length;
			return sum + (hit / asked) * (b.to - b.from + 1);
		}, 0)
	);

	$: percent = meta.count ? Math.round((estimate / meta.count) * 100) : 0;

	function toggle(rank: number) {
		known = { ...known, [rank]: !known[rank] };
	}

	function reset() {
		known = {};
		done = false;
	}

	const ld = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Tools', item: `${siteBaseUrl}/tools` },
					{ '@type': 'ListItem', position: 2, name: 'Vocabulary test' }
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
	title="{meta.name} vocabulary test"
	{path}
	description="{meta.name} words drawn from across the whole frequency range. Mark the ones you know and see roughly how much of the language's everyday vocabulary that covers. Free, no account."
/>

<svelte:head>
	{@html ldScript}
</svelte:head>

<div class="container">
	<PageHeader
		title="How many {meta.name} words do you know?"
		lede="{total} words, drawn from every part of the {nf.format(
			meta.count
		)} on our list — the very commonest through to the rare. Mark the ones whose meaning you could give without looking."
	/>

	{#if !done}
		<p class="progress" aria-live="polite">
			{answered} of {total} answered{#if answered}, {picked} known{/if}
		</p>

		{#each bands as band}
			<section class="band">
				<h2>Words ranked {nf.format(band.from)}–{nf.format(band.to)}</h2>
				<ul class="rows" role="list">
					{#each band.words as w}
						<li>
							<label>
								<input type="checkbox" checked={!!known[w.rank]} on:change={() => toggle(w.rank)} />
								<span class="word" lang={meta.code}>{w.word}</span>
								<span class="hint">I know this</span>
							</label>
						</li>
					{/each}
				</ul>
			</section>
		{/each}

		<div class="finish" use:ownsPrimary>
			<Button on:click={finish} variant="primary" size="lg">See the estimate</Button>
			<p class="fine">Nothing is sent anywhere. The answers stay in this browser tab.</p>
		</div>
	{:else}
		<section class="result">
			<p class="big tabular">{nf.format(estimate)}</p>
			<p class="big-label">
				of the {nf.format(meta.count)}
				{meta.name} words on this list — about {percent}% — going by the {picked} of {total} you marked.
			</p>

			<div class="bands-out">
				{#each bands as b}
					{@const hit = b.words.filter((w) => known[w.rank]).length}
					<div class="band-out">
						<span class="range tabular">{nf.format(b.from)}–{nf.format(b.to)}</span>
						<span class="bar" style="--fill:{(hit / b.words.length) * 100}%"><i /></span>
						<span class="score tabular">{hit}/{b.words.length}</span>
					</div>
				{/each}
			</div>

			<p class="caveat">
				This is an estimate from {total} words, not a measure of your level. It says how much of one
				frequency list you recognised — nothing about grammar, listening, or whether you can hold a conversation.
				The only way to find that out is to have one.
			</p>

			<div class="after">
				<button type="button" class="share" on:click={share}>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M12 15V4" />
						<path d="m8 8 4-4 4 4" />
						<path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
					</svg>
					Copy link to this result
				</button>
				<button type="button" class="again" on:click={reset}>Take it again</button>
				<a class="see" href="/tools/most-common-words/{meta.slug}">See the whole {meta.name} list</a
				>
			</div>
			{#if shared}<p class="shared" aria-live="polite">{shared}</p>{/if}

			<div class="cta" use:ownsPrimary>
				<h2>Find out the part a test cannot tell you.</h2>
				<Button href="https://app.langx.io" variant="primary" size="lg">Start for free</Button>
			</div>
		</section>
	{/if}
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.progress {
		color: var(--color--text-quiet);
		font-size: 0.8125rem;
		margin-bottom: var(--space-md);
	}

	.band {
		padding-bottom: var(--space-md);

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.125rem;
			color: var(--color--text-quiet);
			margin-bottom: var(--space-2xs);
		}
	}

	.rows {
		border-top: 1px solid var(--color--border);

		li {
			border-bottom: 1px solid var(--color--border);
		}
	}

	label {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 14px 0;
		cursor: pointer;

		input {
			flex: 0 0 auto;
			width: 22px;
			height: 22px;
			accent-color: var(--color--accent);
			cursor: pointer;
		}

		.word {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.125rem;
			overflow-wrap: anywhere;
		}

		// The meaning is deliberately absent: showing it would answer the question.
		.hint {
			margin-left: auto;
			color: var(--color--text-tertiary);
			font-size: 0.8125rem;
		}
	}

	.finish {
		border-top: 1px solid var(--color--border);
		padding: var(--space-xl) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2xs);
		text-align: center;
	}

	.fine {
		color: var(--color--text-quiet);
		font-size: 0.8125rem;
	}

	.result {
		padding: var(--space-md) 0 0;
	}

	.big {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: clamp(2.125rem, 1.4rem + 3vw, 3.5rem);
		line-height: 1;
		letter-spacing: -0.03em;
	}

	.big-label {
		font-size: 1.125rem;
		color: var(--color--text-shade);
		max-width: 44ch;
		margin-top: var(--space-2xs);
	}

	.bands-out {
		margin: var(--space-xl) 0;
		border-top: 1px solid var(--color--border);
	}

	.band-out {
		display: grid;
		grid-template-columns: 8.5rem 1fr 3rem;
		align-items: center;
		gap: var(--space-sm);
		padding: 10px 0;
		border-bottom: 1px solid var(--color--border);
	}

	.range,
	.score {
		font-size: 0.8125rem;
		color: var(--color--text-quiet);
	}

	.score {
		text-align: right;
	}

	// A hairline track with a filled length. Not a card, not a shadow.
	.bar {
		display: block;
		height: 6px;
		border-radius: var(--radius-pill);
		background: var(--color--muted);
		overflow: hidden;

		i {
			display: block;
			height: 100%;
			width: var(--fill);
			background: var(--color--accent);
			border-radius: var(--radius-pill);
		}
	}

	.caveat {
		color: var(--color--text-shade);
		max-width: 62ch;
	}

	.after {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-md);
		margin-top: var(--space-md);
	}

	// The share is the page's own action here, but not its committing one —
	// that stays the yellow at the bottom. So: outlined, like the companion pill.
	.share {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 40px;
		padding: 0 18px;
		border-radius: var(--radius-pill);
		border: 1px solid var(--color--text);
		background: none;
		color: var(--color--text);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
		cursor: pointer;
		transition: transform var(--dur-press) var(--ease-out);

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
			transform: scale(0.96);
		}
	}

	.shared {
		margin-top: var(--space-2xs);
		color: var(--color--correction, var(--color--text-quiet));
		font-size: 0.8125rem;
	}

	.again {
		height: 40px;
		padding: 0 16px;
		border-radius: var(--radius-pill);
		border: 1px solid var(--color--border);
		background: none;
		color: var(--color--text);
		font-family: var(--font--default);
		font-size: 0.9375rem;
		font-weight: 600;
		cursor: pointer;
	}

	.see {
		color: var(--color--accent);
		font-weight: 600;
	}

	.cta {
		margin-top: var(--space-2xl);
		border-top: 1px solid var(--color--border);
		padding: var(--space-2xl) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--space-md);

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			letter-spacing: -0.015em;
			max-width: 20ch;
		}
	}
</style>
