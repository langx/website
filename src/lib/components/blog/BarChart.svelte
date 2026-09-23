<script lang="ts">
	/**
	 * One measure across a handful of items, as horizontal bars. A single
	 * series, so one colour and no legend: the title names what is measured,
	 * each bar carries its own value, and the same numbers are one click away as
	 * a table. Keep it to the few rows a reader compares at a glance (≤ 10).
	 */
	type Row = { label: string; value: number; note?: string; highlight?: boolean };
	export let title: string;
	export let data: Row[];
	/** Printed after each value: "hours", "%", "words". */
	export let unit = '';
	/** Where the numbers come from. Shown under the chart; say it plainly. */
	export let source = '';
	/** Fix the scale when several charts should share one; defaults to the largest value. */
	export let max: number | undefined = undefined;

	const nf = new Intl.NumberFormat('en-US');
	$: top = max ?? Math.max(...data.map((d) => d.value));
	const fmt = (v: number) => `${nf.format(v)}${unit ? (unit === '%' ? '%' : ` ${unit}`) : ''}`;
</script>

<figure class="chart">
	<figcaption class="title">{title}</figcaption>
	<div class="bars">
		{#each data as d}
			<div
				class="row"
				class:highlight={d.highlight}
				title="{d.label}: {fmt(d.value)}{d.note ? ` — ${d.note}` : ''}"
			>
				<span class="label">{d.label}</span>
				<span class="track">
					<span class="bar" style="width: {Math.max((d.value / top) * 100, 1.5)}%" />
					<span class="value">{fmt(d.value)}</span>
				</span>
				{#if d.note}<span class="note">{d.note}</span>{/if}
			</div>
		{/each}
	</div>
	{#if source}<p class="source">Source: {source}</p>{/if}
	<details>
		<summary>Show as a table</summary>
		<table>
			<thead><tr><th scope="col">Item</th><th scope="col">Value</th></tr></thead>
			<tbody>
				{#each data as d}
					<tr><th scope="row">{d.label}</th><td>{fmt(d.value)}</td></tr>
				{/each}
			</tbody>
		</table>
	</details>
</figure>

<style lang="scss">
	.chart {
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

	.bars {
		display: grid;
		gap: 12px;

		// Hovering a bar fades the others, so the one being read stands out.
		// The same numbers are in the table below for keyboards and readers.
		@media (hover: hover) {
			&:hover .row:not(:hover) {
				opacity: 0.45;
			}
		}
	}

	.row {
		display: grid;
		grid-template-columns: minmax(6rem, 11rem) 1fr;
		column-gap: 14px;
		align-items: center;
		border-radius: var(--radius-sm);
		outline-offset: 4px;
		transition: opacity var(--dur-fast) ease;

		@media (max-width: 520px) {
			grid-template-columns: 1fr;
			row-gap: 4px;
		}
	}

	.label {
		font-size: 0.9375rem;
		color: var(--color--text-shade);
		font-weight: 600;
	}

	.track {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	.bar {
		height: 14px;
		border-radius: 0 4px 4px 0;
		background: var(--color--accent);
		flex: 0 0 auto;
		max-width: calc(100% - 5.5rem);
	}

	.highlight .bar {
		background: var(--color--success);
	}

	.value {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color--text);
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	.note {
		grid-column: 2;
		font-size: 0.8125rem;
		color: var(--color--text-tertiary);

		@media (max-width: 520px) {
			grid-column: 1;
		}
	}

	.source {
		margin: 14px 0 0;
		font-size: 0.8125rem;
		color: var(--color--text-tertiary);
	}

	details {
		margin-top: 8px;
		font-size: 0.8125rem;

		summary {
			cursor: pointer;
			color: var(--color--accent);
			font-weight: 600;
		}

		table {
			margin-top: 8px;
			width: 100%;
			border-collapse: collapse;
		}

		th,
		td {
			text-align: left;
			padding: 6px 8px 6px 0;
			border-bottom: 1px solid var(--color--border);
			font-weight: 400;
		}
	}
</style>
