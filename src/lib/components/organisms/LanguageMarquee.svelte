<script lang="ts">
	import { languages } from '$lib/data/languages';
	import { inview } from '$lib/utils/inview';

	// The list is rendered twice so the strip can scroll forever without a seam.
	const loop = [...languages, ...languages];
</script>

<section
	class="strip"
	aria-label="Some of the 182 languages on LangX"
	use:inview={{ once: false, threshold: 0 }}
>
	<div class="track">
		{#each loop as lang, i}
			<span class="chip" aria-hidden={i >= languages.length ? 'true' : undefined}>
				<span class="native">{lang.native}</span>
				<span class="en">{lang.name}</span>
			</span>
		{/each}
	</div>
	<p class="count">182 languages, and counting.</p>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.strip {
		border-top: 1px solid var(--color--border);
		border-bottom: 1px solid var(--color--border);
		padding: 22px 0 18px;
		overflow: hidden;
		// The strip bleeds to the viewport edges; the container's padding is
		// undone so the chips run off both sides.
		margin: 0 calc(50% - 50vw);
		position: relative;
		contain: content;

		// Soft edges so the loop never looks cut: two cheap gradient overlays
		// rather than a mask over the whole moving strip.
		&::before,
		&::after {
			content: '';
			position: absolute;
			top: 0;
			bottom: 0;
			width: 10%;
			pointer-events: none;
			z-index: 1;
		}
		&::before {
			left: 0;
			background: linear-gradient(90deg, var(--color--page-background), transparent);
		}
		&::after {
			right: 0;
			background: linear-gradient(270deg, var(--color--page-background), transparent);
		}

		// Only moves while it is on screen.
		&:not(:global(.is-in)) .track {
			animation-play-state: paused;
		}
	}

	.track {
		display: flex;
		gap: 10px;
		width: max-content;
		will-change: transform;
		animation: scroll 70s linear infinite;

		&:hover {
			animation-play-state: paused;
		}
	}

	@keyframes scroll {
		to {
			transform: translateX(-50%);
		}
	}

	.chip {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		padding: 9px 18px;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-pill);
		white-space: nowrap;
		background: var(--color--surface);
	}

	.native {
		font-family: var(--font--title);
		font-size: 1rem;
		font-weight: 800;
	}

	.en {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color--text-quiet);
	}

	.count {
		margin: 14px 0 0;
		text-align: center;
		font-size: 0.875rem;
		color: var(--color--text-quiet);
	}

	@media (prefers-reduced-motion: reduce) {
		.strip {
			overflow-x: auto;

			&::before,
			&::after {
				display: none;
			}
		}
		.track {
			animation: none;
			padding: 0 16px;
		}
	}
</style>
