<script lang="ts">
	/**
	 * A tick or a cross in a disc at the start of a review row, as in the
	 * tables in the posts, so a game's review reads without its colours.
	 */
	export let right: boolean;
</script>

<span class="mark" class:right role="img" aria-label={right ? 'Right' : 'Wrong'} />

<style lang="scss">
	.mark {
		flex: 0 0 auto;
		display: inline-grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: var(--radius-pill);
		background: var(--color--muted);
		color: var(--color--error);
		font-size: 0.75rem;
		font-weight: 800;
		line-height: 1;

		&::before {
			content: '✕';
		}

		&.right {
			background: var(--color--success-tint);
			color: var(--color--success);

			&::before {
				content: '✓';
			}
		}
	}
</style>
