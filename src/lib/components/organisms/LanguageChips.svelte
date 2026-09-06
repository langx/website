<script lang="ts">
	import { languages } from '$lib/data/languages';
	import { reveal } from '$lib/utils/reveal';

	// Eight of the 182, in the design's order; the last chip counts the rest.
	const picks = [
		'Spanish',
		'Japanese',
		'German',
		'French',
		'Korean',
		'Turkish',
		'Portuguese',
		'Arabic'
	];
	const shown = picks.flatMap((name) => languages.filter((lang) => lang.name === name));
	const more = 182 - shown.length;
</script>

<section
	class="chips"
	aria-label="Some of the 182 languages on LangX"
	data-reveal-children
	use:reveal={{ children: true, stagger: 0.05, y: 16 }}
>
	{#each shown as lang}
		<span class="chip">
			<span class="native">{lang.native}</span>
			<span class="en">{lang.name}</span>
		</span>
	{/each}
	<span class="chip more">+ {more} more</span>
</section>

<style lang="scss">
	.chips {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 0 110px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}

	.chip {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		padding: 9px 18px;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-pill);
		background: var(--color--surface);
		white-space: nowrap;
	}

	.native {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1rem;
	}

	.en {
		font-size: 0.75rem;
		color: var(--color--text-quiet);
	}

	.more {
		justify-content: center;
		border-color: transparent;
		background: var(--color--muted);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
		color: var(--color--text-shade);
	}
</style>
