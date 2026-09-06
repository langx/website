<script lang="ts">
	import { HttpRegex } from '$lib/utils/regex';

	/**
	 * `primary` is the yellow committing action — one per screen.
	 * `secondary` is the outlined block, `dark` the ink one (the send button),
	 * `ghost` a blue text action with no chrome.
	 */
	export let variant: 'primary' | 'secondary' | 'dark' | 'ghost' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let href: string | undefined = undefined;
	export let block = false;
	export let type: 'button' | 'submit' = 'button';
	export let disabled = false;

	const isExternalLink = !!href && HttpRegex.test(href);
	export let target: string | undefined = isExternalLink ? '_blank' : undefined;
	export let rel: string | undefined = isExternalLink ? 'noopener noreferrer' : undefined;
</script>

{#if href}
	<a
		{href}
		{target}
		{rel}
		class="btn {variant} {size}"
		class:block
		data-sveltekit-preload-data
		on:click
		{...$$restProps}
	>
		{#if $$slots.icon}<span class="icon"><slot name="icon" /></span>{/if}
		<slot />
	</a>
{:else}
	<button {type} {disabled} class="btn {variant} {size}" class:block on:click {...$$restProps}>
		{#if $$slots.icon}<span class="icon"><slot name="icon" /></span>{/if}
		<slot />
	</button>
{/if}

<style lang="scss">
	// Set the way the app's buttons are: small caps in Nunito, a soft square
	// corner, and a hard edge underneath that the button presses down into.
	.btn {
		appearance: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 1px solid transparent;
		border-radius: var(--radius-lg);
		font-family: var(--font--title);
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		line-height: 1.2;
		text-decoration: none;
		cursor: pointer;
		white-space: nowrap;
		user-select: none;
		transition: transform var(--dur-press) var(--ease-out), background-color var(--dur-fast) ease,
			color var(--dur-fast) ease, border-color var(--dur-fast) ease,
			box-shadow var(--dur-press) var(--ease-out);

		// The press is the feedback: the interface heard you.
		&:active {
			transform: scale(0.97);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
			transform: none;
		}

		.icon {
			display: inline-flex;
			flex: 0 0 auto;
		}
	}

	.block {
		display: flex;
		width: 100%;
	}

	.sm {
		min-height: 40px;
		padding: 0 20px;
		font-size: 0.8125rem;
		border-radius: var(--radius-md);
	}
	.md {
		min-height: 48px;
		padding: 0 24px;
		font-size: 0.875rem;
	}
	.lg {
		min-height: 56px;
		padding: 0 32px;
		font-size: 0.9375rem;
	}

	// `--edge` is the colour of the edge the button stands on; pressing sinks
	// the button onto it.
	.primary,
	.secondary {
		--lift: 4px;
		box-shadow: 0 var(--lift) 0 var(--edge);

		&:active {
			transform: translateY(var(--lift));
			box-shadow: none;
		}
	}
	.sm.primary,
	.sm.secondary {
		--lift: 3px;
	}

	.primary {
		--edge: var(--color--primary-shade);
		background: var(--color--primary);
		color: var(--color--on-primary);
	}
	.secondary {
		--edge: var(--color--border);
		background: var(--color--surface);
		color: var(--color--accent);
		border: 2px solid var(--color--border);
	}
	.dark {
		background: var(--color--text);
		color: var(--color--text-inverse);
	}
	.ghost {
		background: transparent;
		color: var(--color--accent);
		padding-inline: 10px;
		min-height: 40px;
		text-transform: none;
		letter-spacing: 0;
	}

	@media (hover: hover) and (pointer: fine) {
		.primary:hover {
			background: color-mix(in srgb, var(--color--primary), white 12%);
			color: var(--color--on-primary);
		}
		.secondary:hover {
			background: var(--color--muted);
			color: var(--color--accent);
		}
		.dark:hover {
			background: var(--color--text-shade);
			color: var(--color--text-inverse);
		}
		.ghost:hover {
			background: var(--color--accent-tint);
			color: var(--color--accent);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.btn:active,
		.primary:active,
		.secondary:active {
			transform: none;
		}
	}
</style>
