<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { WORD_LISTS } from '$lib/data/most-common-words';

	const ROUNDS = 10;
	const OPTIONS = 4;
	const byCode = new Map(WORD_LISTS.map((l) => [l.code, l]));

	type Round = { word: string; answer: string; options: string[] };

	let pool: [string, string, number][] = [];
	let rounds: Round[] = [];
	let at = 0;
	let picked: (string | null)[] = [];
	let loaded = false;
	let copied = '';

	/** UTC, so the same ten words are everyone's puzzle for the day. */
	const today = new Date().toISOString().slice(0, 10);

	/** Small deterministic PRNG, so a day's game is the same for everybody. */
	function rng(seed: number) {
		let s = seed >>> 0;
		return () => {
			s = (s * 1664525 + 1013904223) >>> 0;
			return s / 4294967296;
		};
	}

	onMount(async () => {
		try {
			const res = await fetch('/data/most-common-words/games/languages.json');
			pool = await res.json();
			build();
			loaded = true;
		} catch {
			loaded = false;
		}
	});

	function build() {
		const seed = Math.floor(Date.parse(today) / 86_400_000);
		const rand = rng(seed);
		const codes = WORD_LISTS.map((l) => l.code);
		const used = new Set<string>();
		const out: Round[] = [];
		let guard = 0;
		while (out.length < ROUNDS && guard++ < 5000) {
			const [word, code] = pool[Math.floor(rand() * pool.length)];
			if (used.has(code) || !byCode.has(code)) continue;
			used.add(code);
			const options = [code];
			while (options.length < OPTIONS) {
				const c = codes[Math.floor(rand() * codes.length)];
				if (!options.includes(c)) options.push(c);
			}
			// Shuffle so the answer is not always first.
			for (let i = options.length - 1; i > 0; i--) {
				const j = Math.floor(rand() * (i + 1));
				[options[i], options[j]] = [options[j], options[i]];
			}
			out.push({ word, answer: code, options });
		}
		rounds = out;
		picked = Array(out.length).fill(null);
	}

	function choose(code: string) {
		if (picked[at] !== null) return;
		picked = picked.map((p, i) => (i === at ? code : p));
	}

	function next() {
		if (at < rounds.length - 1) at++;
	}

	$: answered = picked.filter((p) => p !== null).length;
	$: score = rounds.filter((r, i) => picked[i] === r.answer).length;
	$: finished = rounds.length > 0 && answered === rounds.length;

	async function copyResult() {
		const grid = rounds.map((r, i) => (picked[i] === r.answer ? '🟩' : '🟥')).join('');
		const url = `${window.location.origin}/tools/guess-the-language`;
		const text = `Which language is this? — ${today} — ${score}/${rounds.length}\n\n${grid}\n\n${url}`;
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
	title="Which language is this?"
	path="/tools/guess-the-language"
	description="Ten words, {WORD_LISTS.length} languages, four guesses each. Every word belongs to exactly one of the lists, so there are no trick questions. New ten every day."
/>

<div class="container">
	<PageHeader
		title="Which language is this?"
		lede="Ten words a day, drawn from the {WORD_LISTS.length} lists. Each one appears in exactly one of
		them — no word here belongs to two languages, so there are no trick questions."
	/>

	{#if !loaded}
		<p class="quiet">Loading today’s ten…</p>
	{:else if finished}
		<section class="result">
			<p class="big tabular">{score}<span>/{rounds.length}</span></p>
			<p class="grid">
				{#each rounds as r, i}{picked[i] === r.answer ? '🟩' : '🟥'}{/each}
			</p>

			<ul class="review" role="list">
				{#each rounds as r, i}
					{@const right = byCode.get(r.answer)}
					<li class:wrong={picked[i] !== r.answer}>
						<span class="w" lang={r.answer}>{r.word}</span>
						<span class="a">
							{#if right}<ScriptDisc
									nativeName={right.nativeName}
									code={right.code}
									size={26}
								/>{/if}
							{right?.name}
						</span>
						{#if picked[i] !== r.answer}
							<span class="you">you said {byCode.get(picked[i] ?? '')?.name}</span>
						{/if}
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
				<a class="see" href="/tools/most-common-words">See all {WORD_LISTS.length} lists</a>
			</div>
			{#if copied}<p class="copied" aria-live="polite">{copied}</p>{/if}
			<p class="tomorrow">A new ten tomorrow.</p>
		</section>
	{:else if rounds.length}
		{@const r = rounds[at]}
		<p class="progress">Word {at + 1} of {rounds.length}</p>
		<p class="word" lang={r.answer}>{r.word}</p>

		<ul class="options" role="list">
			{#each r.options as code}
				{@const l = byCode.get(code)}
				{#if l}
					<li>
						<button
							type="button"
							class:right={picked[at] !== null && code === r.answer}
							class:wrong={picked[at] === code && code !== r.answer}
							disabled={picked[at] !== null}
							on:click={() => choose(code)}
						>
							<ScriptDisc nativeName={l.nativeName} code={l.code} size={30} />
							{l.name}
						</button>
					</li>
				{/if}
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
		<h2>Recognising a language is the first step.</h2>
		<p>Speaking one is the rest of it.</p>
		<div use:ownsPrimary>
			<Button href="https://app.langx.io" variant="primary" size="lg">Start for free</Button>
		</div>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.quiet {
		color: var(--color--text-quiet);
	}

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
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: var(--space-2xs);
		max-width: 640px;

		button {
			display: flex;
			align-items: center;
			gap: var(--space-2xs);
			width: 100%;
			height: 56px;
			padding: 0 var(--space-sm);
			border-radius: var(--radius-pill);
			border: 1px solid var(--color--border);
			background: none;
			color: var(--color--text);
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1rem;
			text-align: left;
			cursor: pointer;
			transition: border-color var(--dur-fast) ease, background-color var(--dur-fast) ease;

			&:disabled {
				cursor: default;
			}

			&.right {
				border-color: var(--color--callout-accent--success, #009f70);
				color: var(--color--callout-accent--success, #009f70);
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

	.next {
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
			align-items: center;
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
			display: inline-flex;
			align-items: center;
			gap: var(--space-3xs);
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
		}

		p {
			color: var(--color--text-shade);
			max-width: 46ch;
			margin: var(--space-2xs) 0 var(--space-md);
		}
	}
</style>
