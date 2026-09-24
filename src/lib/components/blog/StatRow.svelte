<script lang="ts">
	/**
	 * Two to four headline numbers in a row. For figures that are the point of
	 * a section; every one needs its source in the surrounding text.
	 */
	type Stat = { value: string; label: string };
	interface Props {
		stats: Stat[];
	}

	let { stats }: Props = $props();
</script>

<div class="stats" role="list">
	{#each stats as s}
		<div class="stat" role="listitem">
			<span class="value">{s.value}</span>
			<span class="label">{s.label}</span>
		</div>
	{/each}
</div>

<style lang="scss">
	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 12px;
		margin: var(--space-lg) 0;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 16px 18px;
		border-radius: var(--radius-lg);
		background: var(--color--muted);
	}

	.value {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
		line-height: 1.1;
		color: var(--color--text);
		font-variant-numeric: tabular-nums;
	}

	.label {
		font-size: 0.875rem;
		color: var(--color--text-shade);
		line-height: 1.4;
	}
</style>
