<script lang="ts">
	/**
	 * A mark and a word: the icon carries the scan, the word the meaning, so
	 * nothing depends on telling blue from grey. Blue checks, as in the plan
	 * rows and the posts' tables — green is kept for corrections.
	 */
	import type { Mark } from '$lib/data/compare';

	export let mark: Mark = '';
	export let text: string;
</script>

<span class="cell {mark}">
	{#if mark}
		<span class="mark" aria-hidden="true">{mark === 'yes' ? '✓' : mark === 'part' ? '~' : '✕'}</span>
	{/if}
	{text}
</span>

<style lang="scss">
	.cell {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-weight: 600;
	}

	.mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		font-size: 0.75rem;
		font-weight: 800;
		flex: 0 0 auto;
	}

	.yes {
		color: var(--color--text);

		.mark {
			background: var(--color--accent-tint);
			color: var(--color--accent);
		}
	}

	.part {
		color: var(--color--text-shade);

		.mark {
			background: var(--color--muted);
			color: var(--color--text-shade);
		}
	}

	// Text Quiet, not Tertiary: tertiary is the phone replicas' grey and too
	// faint for page copy.
	.no {
		color: var(--color--text-quiet);

		.mark {
			background: var(--color--muted);
			color: var(--color--text-quiet);
		}
	}
</style>
