<script lang="ts">
	/**
	 * The speaker next to a word. Two ways to use it:
	 *
	 * - `code` and `rank`: a word from the lists, read from the shared store in
	 *   `$lib/utils/wordAudio`. The button stays hidden until that language's
	 *   index says the word has a reading, and never appears if it has none —
	 *   so it can be dropped next to any word without the page knowing.
	 * - `play`: anything else that can be played, such as a /tools/say page's
	 *   own file. The caller has already decided it exists.
	 *
	 * Anything in the default slot is shown after the icon — a language code,
	 * where one word has a button per language.
	 *
	 * Clicks stop here. The button sits inside rows that are links, labels that
	 * toggle a checkbox and cards that answer a question, and a press on it
	 * should only ever make a sound.
	 */
	import { onMount } from 'svelte';
	import UiIcon from './UiIcon.svelte';
	import { hasAudio, mayHaveAudio, playWord } from '$lib/utils/wordAudio';

	export let label: string;
	export let code: string | undefined = undefined;
	export let rank: number | undefined | null = undefined;
	export let play: (() => Promise<void>) | undefined = undefined;
	export let size = 32;

	/** null while the index is on its way; the button holds its space meanwhile. */
	let available: boolean | null = play ? true : null;
	let playing = false;
	let presses = 0;
	let mounted = false;

	$: possible = !!play || (!!code && mayHaveAudio(code, rank));
	$: if (mounted && !play && code && rank) check(code, rank);

	async function check(c: string, r: number) {
		available = null;
		const ok = await hasAudio(c, r);
		// A row reused for another word may have moved on while this was out.
		if (c === code && r === rank) available = ok;
	}

	onMount(() => (mounted = true));

	async function press(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		const mine = ++presses;
		playing = true;
		try {
			if (play) await play();
			else if (code && rank) await playWord(code, rank);
		} catch {
			// Offline, or the file is missing: the button simply stops glowing.
		} finally {
			if (mine === presses) playing = false;
		}
	}
</script>

{#if possible && available !== false}
	<button
		type="button"
		class="speak"
		class:on={playing}
		class:pending={available === null}
		class:tagged={$$slots.default}
		style="--speak-size: {size}px"
		aria-label={label}
		title={label}
		tabindex={available === null ? -1 : undefined}
		aria-hidden={available === null ? 'true' : undefined}
		on:click={press}
		><UiIcon name="volume" size={Math.round(size * 0.56)} strokeWidth={2.25} /><slot /></button
	>
{/if}

<style lang="scss">
	.speak {
		// Above a stretched link, where there is one, or every press would
		// follow it instead.
		position: relative;
		z-index: 1;
		flex: 0 0 auto;
		display: inline-grid;
		place-items: center;
		width: var(--speak-size);
		height: var(--speak-size);
		margin: calc((var(--speak-size) - 24px) / -2) 0;
		padding: 0;
		border: 0;
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--color--accent);
		vertical-align: middle;
		cursor: pointer;
		transition: background-color 200ms ease, transform 160ms ease-out, opacity 200ms ease;

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				background: var(--color--accent-tint);
			}
		}

		&:active {
			transform: scale(0.97);
		}

		&:focus-visible {
			outline: 2px solid var(--color--accent);
			outline-offset: 2px;
		}

		&.tagged {
			width: auto;
			gap: 3px;
			grid-auto-flow: column;
			padding: 0 9px 0 6px;
			font-family: var(--font--default);
			font-size: 0.6875rem;
			font-weight: 700;
			letter-spacing: 0.04em;
			text-transform: uppercase;
		}

		&.pending {
			visibility: hidden;
			opacity: 0;
		}

		&.on {
			background: var(--color--accent-tint);

			:global(.ui-icon) {
				animation: speaking 0.9s ease-in-out infinite;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			&:active {
				transform: none;
			}

			&.on :global(.ui-icon) {
				animation: none;
			}
		}
	}

	@keyframes speaking {
		50% {
			opacity: 0.45;
		}
	}
</style>
