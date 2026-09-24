<script lang="ts">
	interface Props {
		/**
		 * The rounds of a daily game as a row of steps: green for right, red for
		 * wrong, ink for the round on screen, the muted fill for those to come.
		 * Small under "Word 3 of 10" while playing; `large`, with a tick or a
		 * cross in each square, as the result — the site's own drawing of the
		 * grid people share, which the copied text keeps as emoji.
		 *
		 * While playing, the text above it says the same thing, so the small
		 * track is hidden from screen readers; the large one is labelled.
		 */
		steps: ('right' | 'wrong' | 'now' | null)[];
		large?: boolean;
	}

	let { steps, large = false }: Props = $props();

	let right = $derived(steps.filter((s) => s === 'right').length);
	let wrong = $derived(steps.filter((s) => s === 'wrong').length);
</script>

<ol
	class="track"
	class:large
	role="list"
	aria-hidden={large ? undefined : 'true'}
	aria-label={large ? `${right} right, ${wrong} wrong` : undefined}
>
	{#each steps as step}
		<li
			class:right={step === 'right'}
			class:wrong={step === 'wrong'}
			class:now={step === 'now'}
		></li>
	{/each}
</ol>

<style lang="scss">
	.track {
		display: flex;
		gap: 4px;
		margin: var(--space-2xs) 0 0;
		padding: 0;
		list-style: none;

		li {
			flex: 0 0 auto;
			width: 20px;
			height: 6px;
			margin: 0;
			border-radius: var(--radius-pill);
			background: var(--color--muted);
			transition: background-color var(--dur-fast) ease;

			&.now {
				background: var(--color--text);
			}

			&.right {
				background: var(--color--success);
			}

			&.wrong {
				background: var(--color--error);
			}
		}

		&.large {
			gap: 6px;
			margin: var(--space-sm) 0 var(--space-lg);

			// Ten 28px squares are 334px with their gaps, wider than a 320px
			// phone's column; there they shrink together and stay square.
			li {
				flex: 0 1 28px;
				min-width: 0;
				width: auto;
				height: auto;
				aspect-ratio: 1;
				border-radius: 8px;
				display: grid;
				place-items: center;
				color: var(--color--page-background);
				font-size: 0.875rem;
				font-weight: 800;

				&.right::before {
					content: '✓';
				}

				&.wrong::before {
					content: '✕';
				}
			}
		}
	}
</style>
