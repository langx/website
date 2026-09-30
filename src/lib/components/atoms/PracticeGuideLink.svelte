<script lang="ts">
	/**
	 * The quiet line under a language tool's call to action, pointing at the
	 * blog's guide to practising that language with native speakers
	 * (`$lib/data/practice-guides`). Renders nothing for a language without one.
	 */
	import { practiceGuide } from '$lib/data/practice-guides';

	interface Props {
		/** Word-list slug, e.g. `german`. */
		slug: string;
		name: string;
	}

	let { slug, name }: Props = $props();
	let href = $derived(practiceGuide(slug));
</script>

{#if href}
	<p class="practice">
		Or compare <a {href}>the best apps to practice {name} with native speakers</a>.
	</p>
{/if}

<style>
	.practice {
		margin: var(--space-sm) auto 0;
		font-size: 0.9375rem;
		color: var(--color--text-shade);
		max-width: 46ch;
		text-align: center;
	}

	.practice a {
		color: var(--color--accent);
		font-weight: 600;
	}
</style>
