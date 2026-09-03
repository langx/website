<script lang="ts">
	/**
	 * A chip. `outline` is the PRO / label chip from the app, `solid` the
	 * selected filter chip, `accent` the language chip. `color` is kept for the
	 * data files that still pass it and only tints the accent tone.
	 */
	export let tone: 'outline' | 'solid' | 'accent' = 'outline';
	export let color: 'primary' | 'secondary' | 'pro' | 'pro-plus' | undefined = undefined;
	export let uppercase = false;
</script>

<span class="tag {tone} {color ?? ''}" class:uppercase>
	<slot />
</span>

<style lang="scss">
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		border-radius: var(--radius-pill);
		font-size: 0.75rem;
		font-weight: 700;
		line-height: 1.3;
		white-space: nowrap;
		width: fit-content;
	}

	.uppercase {
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-size: 0.6875rem;
		padding: 3px 8px;
	}

	.outline {
		border: 1px solid var(--color--border);
		color: var(--color--text-shade);
	}

	.solid {
		background: var(--color--text);
		color: var(--color--text-inverse);
	}

	.accent {
		background: var(--color--accent-tint);
		color: var(--color--accent);
	}

	.pro,
	.pro-plus {
		color: var(--color--pro);
		border-color: rgba(var(--color--pro-rgb), 0.35);
	}
</style>
