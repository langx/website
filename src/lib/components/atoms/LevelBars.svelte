<script lang="ts">
	/** CEFR-style level as bars: `level` of `max` filled. */
	export let level: number;
	export let max = 4;
	export let tone: 'accent' | 'muted' | 'inverse' = 'accent';
	export let label: string | undefined = undefined;

	const heights = [5, 8, 11, 14, 17];
</script>

<span
	class="bars {tone}"
	style="height:{heights[max - 1]}px"
	role="img"
	aria-label={label ?? `Level ${level} of ${max}`}
>
	{#each Array.from({ length: max }, (_, i) => i) as i}
		<span class="bar" class:on={i < level} style="height:{heights[i]}px" />
	{/each}
</span>

<style lang="scss">
	.bars {
		display: inline-flex;
		align-items: flex-end;
		gap: 2px;
		flex: 0 0 auto;
		vertical-align: middle;
	}

	.bar {
		width: 4px;
		border-radius: 2px;
		display: block;
		background: var(--color--border);
	}

	.accent .bar.on {
		background: var(--color--accent);
	}
	.muted .bar {
		background: var(--color--border);
	}
	.muted .bar.on {
		background: var(--color--text-tertiary);
	}
	.inverse .bar {
		background: rgba(128, 128, 128, 0.45);
	}
	.inverse .bar.on {
		background: var(--color--text-inverse);
	}
</style>
