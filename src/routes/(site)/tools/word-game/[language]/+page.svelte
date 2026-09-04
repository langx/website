<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import type { WordGameLanguage } from '$lib/data/word-game';
	import type { WordListMeta } from '$lib/data/most-common-words';

	export let data: { game: WordGameLanguage; meta: WordListMeta; others: WordGameLanguage[] };
	$: ({ game, meta, others } = data);

	const LENGTH = 5;
	const TRIES = 6;
	/** Index arrays, so the board loops over something real. */
	const TRY_INDEX = [...Array(TRIES).keys()];
	const CELL_INDEX = [...Array(LENGTH).keys()];

	let answers: string[] = [];
	let guessable = new Set<string>();
	let letters: string[] = [];
	let answer = '';
	let loaded = false;

	let rows: string[] = [];
	let current = '';
	let done: 'won' | 'lost' | null = null;
	let shake = false;
	let message = '';
	let copied = '';

	/** UTC so everyone gets the same puzzle on the same day. */
	const today = new Date().toISOString().slice(0, 10);
	$: storeKey = `wordgame:${game.slug}:${today}`;

	onMount(async () => {
		try {
			const res = await fetch(`/data/most-common-words/games/word/${game.slug}.json`);
			const d = await res.json();
			answers = d.answers;
			guessable = new Set([...d.guesses, ...d.answers]);
			letters = d.letters;
			// The day picks the word, so the puzzle is the same for everyone and
			// changes once a day without anything being stored on a server.
			const days = Math.floor(Date.parse(today) / 86_400_000);
			answer = answers[days % answers.length];
			loaded = true;
			restore();
		} catch {
			message = 'Could not load today’s word. Try again in a moment.';
		}
	});

	function restore() {
		try {
			const raw = localStorage.getItem(storeKey);
			if (!raw) return;
			const saved = JSON.parse(raw) as string[];
			rows = saved.filter((r) => r.length === LENGTH);
			if (rows.includes(answer)) done = 'won';
			else if (rows.length >= TRIES) done = 'lost';
		} catch {
			// A blocked or full localStorage is not a reason to refuse the game.
		}
	}

	function save() {
		try {
			localStorage.setItem(storeKey, JSON.stringify(rows));
		} catch {
			// as above
		}
	}

	/** green / yellow / grey for one guess, counting repeats correctly. */
	function mark(guess: string): ('hit' | 'near' | 'miss')[] {
		const a = [...answer];
		const g = [...guess];
		const out: ('hit' | 'near' | 'miss')[] = g.map(() => 'miss');
		const left: Record<string, number> = {};
		g.forEach((c, i) => {
			if (c === a[i]) out[i] = 'hit';
			else left[a[i]] = (left[a[i]] ?? 0) + 1;
		});
		g.forEach((c, i) => {
			if (out[i] === 'hit') return;
			if (left[c] > 0) {
				out[i] = 'near';
				left[c]--;
			}
		});
		return out;
	}

	$: marks = rows.map(mark);

	/** Best state seen for each letter, for colouring the keyboard. */
	$: keyState = (() => {
		const state: Record<string, 'hit' | 'near' | 'miss'> = {};
		rows.forEach((row, r) => {
			[...row].forEach((c, i) => {
				const m = marks[r][i];
				if (m === 'hit' || (m === 'near' && state[c] !== 'hit') || !state[c]) state[c] = m;
			});
		});
		return state;
	})();

	function press(letter: string) {
		if (done || !loaded) return;
		if ([...current].length >= LENGTH) return;
		current += letter;
		message = '';
	}

	function back() {
		current = [...current].slice(0, -1).join('');
		message = '';
	}

	function submit() {
		if (done || !loaded) return;
		if ([...current].length !== LENGTH) return;
		if (!guessable.has(current)) {
			message = 'Not in this language’s list.';
			shake = true;
			setTimeout(() => (shake = false), 400);
			return;
		}
		rows = [...rows, current];
		current = '';
		save();
		if (rows[rows.length - 1] === answer) done = 'won';
		else if (rows.length >= TRIES) done = 'lost';
	}

	function onKey(e: KeyboardEvent) {
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		if (e.key === 'Enter') return submit();
		if (e.key === 'Backspace') return back();
		const c = e.key.toLowerCase();
		if (c.length === 1 && letters.includes(c)) press(c);
	}

	const SQUARE = { hit: '🟩', near: '🟨', miss: '⬜' } as const;

	async function copyResult() {
		const grid = marks.map((row) => row.map((m) => SQUARE[m]).join('')).join('\n');
		const score = done === 'won' ? `${rows.length}/${TRIES}` : `X/${TRIES}`;
		const url = `${window.location.origin}/tools/word-game/${game.slug}`;
		// The grid is the share here — a bare link would say nothing. Labelled
		// "Copy result" so nobody expects to paste it into an address bar.
		const text = `${meta.name} word game — ${today} — ${score}\n\n${grid}\n\n${url}`;
		try {
			await navigator.clipboard.writeText(text);
			copied = 'Result copied';
		} catch {
			copied = 'Could not reach the clipboard';
		}
		setTimeout(() => (copied = ''), 2500);
	}
</script>

<svelte:window on:keydown={onKey} />

<Seo
	title="{meta.name} word game"
	path="/tools/word-game/{game.slug}"
	description="A new five-letter {meta.name} word every day, drawn from the words the language actually uses most. Six tries, no account, free."
/>

<div class="container">
	<PageHeader
		title="{meta.name} in five letters"
		lede="A new word every day, taken from the {meta.name} words that come up most in ordinary speech. Six
		tries. Green is right, yellow is in the word somewhere."
	/>

	{#if !loaded && !message}
		<p class="quiet">Loading today’s word…</p>
	{/if}

	<div class="board" class:shake aria-label="Guesses">
		{#each TRY_INDEX as r}
			<div class="row">
				{#each CELL_INDEX as i}
					{@const letter = rows[r]
						? [...rows[r]][i]
						: r === rows.length
						? [...current][i] ?? ''
						: ''}
					<span class="cell {rows[r] ? marks[r][i] : ''}" class:filled={!!letter} lang={meta.code}>
						{letter}
					</span>
				{/each}
			</div>
		{/each}
	</div>

	{#if message}<p class="message" aria-live="polite">{message}</p>{/if}

	{#if done}
		<section class="done">
			<p class="verdict">
				{#if done === 'won'}
					Got it in {rows.length}.
				{:else}
					Today’s word was <strong lang={meta.code}>{answer}</strong>.
				{/if}
			</p>
			<div class="after">
				<button type="button" class="share" on:click={copyResult}>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M12 15V4" /><path d="m8 8 4-4 4 4" />
						<path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
					</svg>
					Copy result
				</button>
				<a class="see" href="/tools/most-common-words/{meta.slug}">See the whole {meta.name} list</a
				>
			</div>
			{#if copied}<p class="copied" aria-live="polite">{copied}</p>{/if}
			<p class="tomorrow">A new word tomorrow.</p>
		</section>
	{:else}
		<div class="keyboard" aria-label="Keyboard">
			{#each letters as l}
				<button
					type="button"
					class="key {keyState[l] ?? ''}"
					lang={meta.code}
					on:click={() => press(l)}
				>
					{l}
				</button>
			{/each}
			<button type="button" class="key wide" on:click={back}>⌫</button>
			<button type="button" class="key wide enter" on:click={submit}>Enter</button>
		</div>
	{/if}

	<nav class="others" aria-label="Other languages">
		<h2>Play in another language</h2>
		<ul role="list">
			{#each others as o}
				<li><a href="/tools/word-game/{o.slug}">{o.name}</a></li>
			{/each}
		</ul>
	</nav>

	<section class="cta">
		<h2>Guessing is one way to meet a word.</h2>
		<p>Using it with someone who speaks the language is the one that sticks.</p>
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

	.board {
		display: flex;
		flex-direction: column;
		gap: 6px;
		align-items: center;
		padding: var(--space-md) 0;
	}

	.row {
		display: flex;
		gap: 6px;
	}

	// Squares, not the site's hairline rows: this is a board, and a board is the
	// one place a grid of filled cells is the right object.
	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		border-radius: var(--radius-sm);
		border: 2px solid var(--color--border);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.75rem;
		line-height: 1;
		text-transform: uppercase;
		transition: border-color var(--dur-fast) ease, background-color var(--dur-fast) ease;

		&.filled {
			border-color: var(--color--text-quiet);
		}

		&.hit,
		&.near,
		&.miss {
			color: #fefefe;
			border-color: transparent;
		}

		&.hit {
			background: var(--color--callout-accent--success, #009f70);
		}

		&.near {
			background: var(--color--secondary);
		}

		&.miss {
			background: var(--color--text-tertiary);
		}

		@include for-phone-only {
			width: 48px;
			height: 48px;
			font-size: 1.375rem;
		}
	}

	.shake {
		animation: shake 400ms var(--ease-out);
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20%,
		60% {
			transform: translateX(-6px);
		}
		40%,
		80% {
			transform: translateX(6px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.shake {
			animation: none;
		}
	}

	.message {
		text-align: center;
		color: var(--color--text-shade);
		font-size: 0.9375rem;
	}

	.keyboard {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
		max-width: 560px;
		margin: var(--space-md) auto var(--space-2xl);
	}

	.key {
		min-width: 40px;
		height: 48px;
		padding: 0 10px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color--border);
		background: var(--color--muted);
		color: var(--color--text);
		font-family: var(--font--default);
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		cursor: pointer;
		transition: background-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);

		&:active {
			transform: scale(0.94);
		}

		&.wide {
			min-width: 66px;
			text-transform: none;
		}

		&.hit,
		&.near,
		&.miss {
			color: #fefefe;
			border-color: transparent;
		}

		&.hit {
			background: var(--color--callout-accent--success, #009f70);
		}

		&.near {
			background: var(--color--secondary);
		}

		&.miss {
			background: var(--color--text-tertiary);
			opacity: 0.55;
		}
	}

	.done {
		text-align: center;
		padding: var(--space-md) 0 var(--space-xl);
	}

	.verdict {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: clamp(1.375rem, 1.1rem + 1.1vw, 1.875rem);

		strong {
			text-transform: uppercase;
		}
	}

	.after {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		margin-top: var(--space-md);
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

		&:active {
			transform: scale(0.96);
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

	.others,
	.cta {
		border-top: 1px solid var(--color--border);
		padding: var(--space-xl) 0;

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			letter-spacing: -0.015em;
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

	.cta {
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
