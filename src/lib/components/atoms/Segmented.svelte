<script lang="ts">
	/**
	 * The app's segmented control: a muted pill with a white thumb that slides
	 * under the active option. `interactive` makes it a real control.
	 */
	export let options: string[];
	export let active = 0;
	export let interactive = false;
	export let label = 'Options';
</script>

<div
	class="seg"
	style="--n:{options.length};--i:{active}"
	role={interactive ? 'tablist' : undefined}
	aria-label={interactive ? label : undefined}
>
	<span class="thumb" aria-hidden="true" />
	{#each options as option, i}
		{#if interactive}
			<button
				type="button"
				role="tab"
				aria-selected={i === active}
				class="opt"
				class:on={i === active}
				on:click={() => (active = i)}>{option}</button
			>
		{:else}
			<span class="opt" class:on={i === active}>{option}</span>
		{/if}
	{/each}
</div>

<style lang="scss">
	.seg {
		position: relative;
		display: flex;
		background: var(--color--muted);
		border-radius: var(--radius-pill);
		padding: 3px;
		isolation: isolate;
	}

	.thumb {
		position: absolute;
		top: 3px;
		bottom: 3px;
		left: 3px;
		width: calc((100% - 6px) / var(--n));
		background: var(--color--surface);
		border-radius: var(--radius-pill);
		box-shadow: var(--shadow-segment);
		transform: translateX(calc(var(--i) * 100%));
		transition: transform var(--dur-fast) var(--ease-out);
		z-index: 0;
	}

	.opt {
		position: relative;
		z-index: 1;
		flex: 1;
		text-align: center;
		font-size: 14px;
		font-weight: 600;
		padding: 10px 0;
		border-radius: var(--radius-pill);
		color: var(--color--text-shade);
		background: none;
		border: 0;
		font-family: inherit;
		cursor: default;
		transition: color var(--dur-fast) ease;

		&.on {
			font-weight: 700;
			color: var(--color--text);
		}
	}

	button.opt {
		cursor: pointer;
	}

	@media (prefers-reduced-motion: reduce) {
		.thumb {
			transition: none;
		}
	}
</style>
