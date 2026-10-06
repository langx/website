<script lang="ts">
	/**
	 * How a block of time divides, as one bar cut into parts: a session plan,
	 * a study week. Each part's width is its share of the total, and the key
	 * below repeats every part in words, so the bar is never the only place a
	 * number lives.
	 */
	type Part = { label: string; value: number; note?: string };

	interface Props {
		title: string;
		parts: Part[];
		/** Printed after each value: "min", "h". */
		unit?: string;
	}

	let { title, parts, unit = 'min' }: Props = $props();

	let total = $derived(parts.reduce((sum, p) => sum + p.value, 0));

	const id = $props.id();
</script>

<!-- A <p> for the title, as in TopicMap: post styles centre every figcaption. -->
<figure class="split" aria-labelledby={id}>
	<p class="title" {id}>{title}</p>
	<div class="bar" aria-hidden="true">
		{#each parts as p, i}
			<span class="part tone-{i % 4}" style="flex-grow: {p.value}">
				{#if p.value / total >= 0.15}{p.value} {unit}{/if}
			</span>
		{/each}
	</div>
	<ol class="key">
		{#each parts as p, i}
			<li>
				<span class="swatch tone-{i % 4}" aria-hidden="true"></span>
				<span class="label">{p.label}</span>
				<span class="value">{p.value} {unit}</span>
				{#if p.note}<span class="note">{p.note}</span>{/if}
			</li>
		{/each}
	</ol>
</figure>

<style lang="scss">
	.split {
		margin: var(--space-lg) 0;
		padding: 20px 22px 16px;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-lg);
		background: var(--color--surface);
	}

	.title {
		margin: 0 0 16px;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.0625rem;
		color: var(--color--text);
	}

	.bar {
		display: flex;
		gap: 2px;
		height: 36px;
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.part {
		flex-basis: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 4px;
		font-size: 0.8125rem;
		font-weight: 700;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	// Blue and yellow for the two languages, the quiet tones for the edges of
	// the session. Green stays out: on this site it means a correction.
	.tone-0 {
		background: var(--color--muted);
		color: var(--color--text-shade);
	}
	.tone-1 {
		background: var(--color--accent);
		color: var(--color--text-inverse);
	}
	.tone-2 {
		background: var(--color--primary);
		color: var(--color--on-primary);
	}
	.tone-3 {
		background: var(--color--accent-tint);
		color: var(--color--accent);
	}

	.key {
		margin: 16px 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 8px;

		li {
			display: grid;
			grid-template-columns: 12px 1fr auto;
			column-gap: 10px;
			align-items: center;
			margin: 0;
		}
	}

	.swatch {
		width: 12px;
		height: 12px;
		border-radius: 3px;

		&.tone-0 {
			box-shadow: inset 0 0 0 1px var(--color--border);
		}
	}

	.label {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color--text);
	}

	.value {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color--text);
		font-variant-numeric: tabular-nums;
	}

	.note {
		grid-column: 2 / -1;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color--text-shade);
	}
</style>
