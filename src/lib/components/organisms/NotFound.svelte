<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';

	/** The HTTP status; anything but 404 is "something went wrong". */
	export let status = 404;

	$: missing = status === 404;
</script>

<div class="missing">
	<div class="copy">
		<span class="eyebrow">{status}</span>
		<h1>{missing ? 'Nothing here, sorry.' : 'Something went wrong.'}</h1>
		<p class="lede">
			{missing
				? 'The page moved or never existed. The homepage has everything that does.'
				: 'Reload the page, or start again from the homepage.'}
		</p>
		<Button href="/" variant="secondary">Back to the start</Button>
	</div>
	{#if missing}
		<!-- The one chat that fits a missing page: a question, a slip, a correction. -->
		<div class="chat" aria-hidden="true">
			<span class="bubble theirs">¿Dónde está la página?</span>
			<span class="bubble mine">No sé, aquí no esta 🤷</span>
			<span class="note"><s>esta</s> <strong>está</strong> ✓</span>
		</div>
	{/if}
</div>

<style lang="scss">
	.missing {
		min-height: 60vh;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 48px;
		padding: var(--space-2xl) 0;
	}

	.copy {
		flex: 1 1 320px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;

		h1 {
			margin: 0;
			max-width: 16ch;
		}

		.lede {
			margin: 0 0 12px;
		}
	}

	.chat {
		flex: 0 1 340px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.bubble {
		max-width: 85%;
		padding: 10px 14px;
		border-radius: var(--radius-lg);
		font-size: 0.9375rem;
		line-height: 1.45;
	}

	.theirs {
		align-self: flex-start;
		background: var(--color--muted);
		border-bottom-left-radius: 4px;
	}

	.mine {
		align-self: flex-end;
		background: var(--color--accent);
		color: var(--color--accent-contrast);
		border-bottom-right-radius: 4px;
	}

	.note {
		align-self: flex-end;
		border: 2px solid var(--color--success);
		background: var(--color--success-tint);
		border-radius: var(--radius-lg);
		padding: 8px 14px;
		font-size: 0.875rem;

		s {
			color: var(--color--text-tertiary);
		}

		strong {
			color: var(--color--success);
		}
	}
</style>
