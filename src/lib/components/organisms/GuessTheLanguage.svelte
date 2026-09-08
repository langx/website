<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import { WORD_LISTS } from '$lib/data/most-common-words';
	import { reveal } from '$lib/utils/reveal';

	/**
	 * Four rounds of the /tools game, played where the visitor already is.
	 * The words are real rows of
	 * `static/data/most-common-words/games/languages.json`, each picked because
	 * it appears in exactly one of the site's word lists, so no round has two
	 * right answers. The full ten-round daily game lives at
	 * /tools/guess-the-language.
	 */
	const NAME = new Map(WORD_LISTS.map((l) => [l.code, l.name]));

	const ROUNDS = [
		{ word: 'თმა', answer: 'ka', options: ['el', 'hy', 'ka', 'he'] },
		{ word: 'không', answer: 'vi', options: ['tr', 'vi', 'id', 'is'] },
		{ word: 'mitä', answer: 'fi', options: ['et', 'hu', 'is', 'fi'] },
		{ word: 'אני', answer: 'he', options: ['he', 'ar', 'hy', 'ru'] }
	];

	let at = 0;
	let picked: string | null = null;
	let right = 0;
	let done = false;

	$: round = ROUNDS[at];
	$: correct = picked === round.answer;

	function pick(code: string) {
		if (picked) return;
		picked = code;
		if (code === round.answer) right += 1;
	}

	function next() {
		picked = null;
		if (at === ROUNDS.length - 1) done = true;
		else at += 1;
	}

	function again() {
		at = 0;
		picked = null;
		right = 0;
		done = false;
	}
</script>

<section class="game" data-reveal use:reveal={{ y: 40 }}>
	<div class="intro">
		<h2>Which language is this?</h2>
		<p>
			Four words from the lists behind our free tools. On LangX you'd have someone to ask — here,
			guess.
		</p>
	</div>

	{#if done}
		<div class="result">
			<p class="score">{right} out of {ROUNDS.length}</p>
			<p class="after">
				{right === ROUNDS.length
					? 'Every one. Try the ten-word daily game.'
					: 'The daily game has ten, and a new set every day.'}
			</p>
			<div class="actions">
				<Button href="/tools/guess-the-language" variant="secondary" size="md">
					Play the daily game
				</Button>
				<button class="again" type="button" on:click={again}>
					<UiIcon name="refresh" size={18} />
					Play these again
				</button>
			</div>
		</div>
	{:else}
		<div class="play">
			<p class="count">Word {at + 1} of {ROUNDS.length}</p>
			<p class="word" lang={round.answer}>{round.word}</p>

			<ul class="options" role="list">
				{#each round.options as code}
					<li>
						<button
							type="button"
							class="option"
							class:right={picked && code === round.answer}
							class:wrong={picked === code && code !== round.answer}
							disabled={!!picked}
							on:click={() => pick(code)}
						>
							{NAME.get(code)}
						</button>
					</li>
				{/each}
			</ul>

			<p class="verdict" aria-live="polite">
				{#if picked}
					{correct ? 'Right' : `Not quite — it's ${NAME.get(round.answer)}`}
				{/if}
			</p>

			{#if picked}
				<button class="next" type="button" on:click={next}>
					{at === ROUNDS.length - 1 ? 'See how you did' : 'Next word'}
					<UiIcon name="arrow-right" size={18} />
				</button>
			{/if}
		</div>
	{/if}

	<p class="more">
		More to play with: <a href="/tools">word games, alphabets and the 10,000 most common words</a>
		in
		{WORD_LISTS.length} languages.
	</p>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.game {
		border-top: 1px solid var(--color--border);
		padding: var(--space-3xl) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-lg);
		text-align: center;

		@include for-phone-only {
			padding: var(--space-2xl) 0;
		}
	}

	.intro {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);

		h2 {
			margin: 0;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			line-height: 1.15;
			letter-spacing: -0.015em;
		}

		p {
			margin: 0 auto;
			max-width: 46ch;
			font-size: 1.0625rem;
			line-height: 1.6;
			color: var(--color--text-shade);
		}
	}

	.play,
	.result {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
	}

	.count,
	.after {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color--text-quiet);
	}

	// The word is the app speaking in its own voice, so it takes the display face.
	.word {
		margin: 0;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: clamp(2.5rem, 1.6rem + 3.4vw, 4rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
	}

	.options {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
		width: 100%;
		max-width: 420px;

		@include for-iphone-se {
			grid-template-columns: 1fr;
		}
	}

	.option {
		width: 100%;
		min-height: 48px;
		padding: 0 18px;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-pill);
		background: none;
		color: var(--color--text);
		font-family: var(--font--title);
		font-size: 1rem;
		font-weight: 800;
		cursor: pointer;
		transition: background-color 200ms var(--ease-out), border-color 200ms var(--ease-out),
			color 200ms var(--ease-out), transform 160ms var(--ease-out);

		@media (hover: hover) and (pointer: fine) {
			&:hover:not(:disabled) {
				border-color: var(--color--accent);
				color: var(--color--accent);
			}
		}

		&:active:not(:disabled) {
			transform: scale(0.97);
		}

		&:disabled {
			cursor: default;
		}

		&.right {
			border-color: var(--color--success);
			background: var(--color--success-tint);
			color: var(--color--success);
		}

		&.wrong {
			border-color: var(--color--error);
			color: var(--color--error);
		}
	}

	.verdict {
		margin: 0;
		min-height: 1.5rem;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color--text-shade);
	}

	.next,
	.again {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 40px;
		padding: 0 16px;
		border: none;
		border-radius: var(--radius-pill);
		background: none;
		color: var(--color--accent);
		font-family: var(--font--title);
		font-size: 0.9375rem;
		font-weight: 800;
		cursor: pointer;
		transition: background-color 200ms var(--ease-out), transform 160ms var(--ease-out);

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				background: var(--color--accent-tint);
			}
		}

		&:active {
			transform: scale(0.97);
		}
	}

	.score {
		margin: 0;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: clamp(2rem, 1.4rem + 2.4vw, 3rem);
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: var(--space-xs);
	}

	.more {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--color--text-quiet);

		a {
			color: var(--color--accent);
		}
	}
</style>
