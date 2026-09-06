<script lang="ts">
	import { languages } from '$lib/data/languages';
	import { inview } from '$lib/utils/inview';

	// The list is rendered twice so the strip can scroll forever without a seam.
	const line = languages.map((lang) => lang.native).join(' · ') + ' ·';
</script>

<section
	class="strip"
	aria-label="Some of the 182 languages on LangX"
	use:inview={{ once: false, threshold: 0 }}
>
	<div class="track">
		<span>{line}&nbsp;</span>
		<span aria-hidden="true">{line}&nbsp;</span>
	</div>
	<p class="count">182 languages in the app</p>
</section>

<style lang="scss">
	.strip {
		border-top: 1px solid var(--color--border);
		border-bottom: 1px solid var(--color--border);
		padding: 22px 0;
		overflow: hidden;
		// The strip bleeds to the viewport edges; the container's padding is
		// undone so the names run off both sides.
		margin: 0 calc(50% - 50vw);
		contain: content;

		// Only moves while it is on screen.
		&:not(:global(.is-in)) .track {
			animation-play-state: paused;
		}
	}

	.track {
		display: inline-flex;
		white-space: nowrap;
		gap: 40px;
		width: max-content;
		will-change: transform;
		animation: scroll 50s linear infinite;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1rem;
		text-transform: uppercase;
		color: var(--color--text-tertiary);

		&:hover {
			animation-play-state: paused;
		}
	}

	@keyframes scroll {
		to {
			transform: translateX(calc(-50% - 20px));
		}
	}

	.count {
		margin: 14px 0 0;
		text-align: center;
		font-size: 0.8125rem;
		color: var(--color--text-tertiary);
	}

	@media (prefers-reduced-motion: reduce) {
		.strip {
			overflow-x: auto;
		}
		.track {
			animation: none;
			padding: 0 16px;
		}
	}
</style>
