<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import type { WordListMeta } from '$lib/data/most-common-words';

	type Entry = { rank: number; word: string; english: string };

	export let data: {
		meta: WordListMeta;
		pool: Entry[];
		rounds: number;
		options: number;
	};
	$: ({ meta, pool, rounds: ROUNDS, options: OPTIONS } = data);

	const today = new Date().toISOString().slice(0, 10);

	/** Deterministic by day, so a shared score is a shared quiz. */
	function rng(seed: number) {
		let s = seed >>> 0;
		return () => {
			s = (s * 1664525 + 1013904223) >>> 0;
			return s / 4294967296;
		};
	}

	type Round = { word: string; answer: string; options: string[] };

	$: rounds = (() => {
		const rand = rng(Math.floor(Date.parse(today) / 86_400_000) + meta.code.charCodeAt(0) * 7919);
		const out: Round[] = [];
		const used = new Set<number>();
		let guard = 0;
		while (out.length < ROUNDS && guard++ < 5000) {
			const i = Math.floor(rand() * pool.length);
			if (used.has(i)) continue;
			used.add(i);
			const entry = pool[i];
			const options = [entry.english];
			while (options.length < OPTIONS) {
				const other = pool[Math.floor(rand() * pool.length)].english;
				if (!options.includes(other)) options.push(other);
			}
			for (let k = options.length - 1; k > 0; k--) {
				const j = Math.floor(rand() * (k + 1));
				[options[k], options[j]] = [options[j], options[k]];
			}
			out.push({ word: entry.word, answer: entry.english, options });
		}
		return out;
	})();

	let at = 0;
	let picked: (string | null)[] = [];
	let copied = '';

	$: if (rounds.length && picked.length !== rounds.length) picked = Array(rounds.length).fill(null);

	function choose(option: string) {
		if (picked[at] !== null) return;
		picked = picked.map((p, i) => (i === at ? option : p));
	}

	function next() {
		if (at < rounds.length - 1) at++;
	}

	function again() {
		at = 0;
		picked = Array(rounds.length).fill(null);
	}

	$: answered = picked.filter((p) => p !== null).length;
	$: score = rounds.filter((r, i) => picked[i] === r.answer).length;
	$: finished = rounds.length > 0 && answered === rounds.length;

	async function copyResult() {
		const grid = rounds.map((r, i) => (picked[i] === r.answer ? '🟩' : '🟥')).join('');
		const url = `${window.location.origin}/tools/meaning-quiz/${meta.slug}`;
		const text = `${meta.name} meanings — ${today} — ${score}/${rounds.length}\n\n${grid}\n\n${url}`;
		try {
			await navigator.clipboard.writeText(text);
			copied = 'Result copied';
		} catch {
			copied = 'Could not reach the clipboard';
		}
		setTimeout(() => (copied = ''), 2500);
	}
</script>

<Seo
	title="Do you know what these {meta.name} words mean?"
	path="/tools/meaning-quiz/{meta.slug}"
	description="Ten {meta.name} words from the first fifteen hundred the language uses most, four meanings each. New ten every day, free, no account."
/>

<div class="container">
	<PageHeader
		title="What do these {meta.name} words mean?"
		lede="Ten words a day, all of them from the first fifteen hundred {meta.name} uses most — so these are
		words you would meet, not dictionary curiosities."
	/>

	{#if finished}
		<section class="result">
			<p class="big tabular">{score}<span>/{rounds.length}</span></p>
			<p class="grid">
				{#each rounds as r, i}{picked[i] === r.answer ? '🟩' : '🟥'}{/each}
			</p>

			<ul class="review" role="list">
				{#each rounds as r, i}
					<li class:wrong={picked[i] !== r.answer}>
						<span class="w" lang={meta.code}>{r.word}</span>
						<span class="a">{r.answer}</span>
						{#if picked[i] !== r.answer}<span class="you">you said “{picked[i]}”</span>{/if}
					</li>
				{/each}
			</ul>

			<div class="after">
				<button type="button" class="share" on:click={copyResult}>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M12 15V4" /><path d="m8 8 4-4 4 4" />
						<path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
					</svg>
					Copy result
				</button>
				<button type="button" class="again" on:click={again}>Try again</button>
				<a class="see" href="/tools/most-common-words/{meta.slug}">See the whole list</a>
			</div>
			{#if copied}<p class="copied" aria-live="polite">{copied}</p>{/if}
			<p class="tomorrow">A new ten tomorrow.</p>
		</section>
	{:else if rounds.length}
		{@const r = rounds[at]}
		<p class="progress">Word {at + 1} of {rounds.length}</p>
		<p class="word" lang={meta.code}>{r.word}</p>

		<ul class="options" role="list">
			{#each r.options as option}
				<li>
					<button
						type="button"
						class:right={picked[at] !== null && option === r.answer}
						class:wrong={picked[at] === option && option !== r.answer}
						disabled={picked[at] !== null}
						on:click={() => choose(option)}
					>
						{option}
					</button>
				</li>
			{/each}
		</ul>

		{#if picked[at] !== null}
			<div class="nextwrap">
				<button type="button" class="next" on:click={next}>
					{at === rounds.length - 1 ? 'See the result' : 'Next word'}
				</button>
			</div>
		{/if}
	{/if}

	<section class="cta">
		<h2>Knowing a word and using it are different things.</h2>
		<p>The second one needs somebody on the other end.</p>
		<div use:ownsPrimary>
			<Button href="https://app.langx.io" variant="primary" size="lg">Start for free</Button>
		</div>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.progress {
		color: var(--color--text-quiet);
		font-size: 0.8125rem;
	}

	.word {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: clamp(2.125rem, 1.4rem + 3vw, 3.5rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
		padding: var(--space-sm) 0 var(--space-lg);
		overflow-wrap: anywhere;
	}

	.options {
		margin-bottom: var(--space-2xl);
		display: grid;
		gap: var(--space-2xs);
		max-width: 560px;

		button {
			width: 100%;
			min-height: 56px;
			padding: var(--space-2xs) var(--space-sm);
			border-radius: var(--radius-lg);
			border: 1px solid var(--color--border);
			background: none;
			color: var(--color--text);
			font-family: var(--font--default);
			font-size: 1rem;
			text-align: left;
			cursor: pointer;
			transition: border-color var(--dur-fast) ease, color var(--dur-fast) ease;

			&:disabled {
				cursor: default;
			}

			&.right {
				border-color: var(--color--callout-accent--success, #009f70);
				color: var(--color--callout-accent--success, #009f70);
				font-weight: 600;
			}

			&.wrong {
				border-color: var(--color--callout-accent--error, #e5484d);
				color: var(--color--callout-accent--error, #e5484d);
			}

			@media (hover: hover) and (pointer: fine) {
				&:not(:disabled):hover {
					border-color: var(--color--text);
				}
			}
		}
	}

	.nextwrap {
		// The grid above already carries the space; this only adds the gap
		// between the answers and the button.
		margin-top: calc(var(--space-2xl) * -1 + var(--space-md));
		padding-bottom: var(--space-2xl);
	}

	.next,
	.again {
		height: 48px;
		padding: 0 22px;
		border-radius: var(--radius-pill);
		border: 1px solid var(--color--text);
		background: none;
		color: var(--color--text);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
		cursor: pointer;
	}

	.again {
		height: 44px;
		padding: 0 20px;
	}

	.result {
		padding: var(--space-sm) 0 var(--space-xl);
	}

	.big {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: clamp(2.125rem, 1.4rem + 3vw, 3.5rem);
		line-height: 1;

		span {
			color: var(--color--text-quiet);
		}
	}

	.grid {
		font-size: 1.375rem;
		letter-spacing: 2px;
		margin: var(--space-2xs) 0 var(--space-lg);
	}

	.review {
		border-top: 1px solid var(--color--border);

		li {
			display: flex;
			align-items: baseline;
			flex-wrap: wrap;
			gap: var(--space-2xs) var(--space-sm);
			padding: 12px 0;
			border-bottom: 1px solid var(--color--border);
		}

		.w {
			font-family: var(--font--title);
			font-weight: 800;
			min-width: 8rem;
		}

		.a {
			color: var(--color--text-shade);
		}

		.you {
			margin-left: auto;
			color: var(--color--text-quiet);
			font-size: 0.8125rem;
		}
	}

	.after {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-md);
		margin-top: var(--space-lg);
	}

	.share {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 44px;
		padding: 0 20px;
		border-radius: var(--radius-pill);
		border: 1px solid var(--color--text);
		background: none;
		color: var(--color--text);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
		cursor: pointer;

		svg {
			width: 17px;
			height: 17px;
			fill: none;
			stroke: currentColor;
			stroke-width: 2;
			stroke-linecap: round;
			stroke-linejoin: round;
		}
	}

	.see {
		color: var(--color--accent);
		font-weight: 600;
	}

	.copied,
	.tomorrow {
		margin-top: var(--space-2xs);
		color: var(--color--text-quiet);
		font-size: 0.8125rem;
	}

	.cta {
		border-top: 1px solid var(--color--border);
		padding: var(--space-xl) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			letter-spacing: -0.015em;
			max-width: 22ch;
		}

		p {
			color: var(--color--text-shade);
			max-width: 46ch;
			margin: var(--space-2xs) 0 var(--space-md);
		}
	}
</style>
