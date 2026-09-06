<script lang="ts">
	import { HttpRegex } from '$lib/utils/regex';

	/**
	 * `primary` is the yellow committing action — one per screen.
	 * `secondary` is the outlined pill, `dark` the ink pill (the send button),
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
	.btn {
		appearance: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 1px solid transparent;
		border-radius: var(--radius-pill);
		font-family: var(--font--title);
		font-weight: 800;
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
		min-height: 42px;
		padding: 0 22px;
		font-size: 0.9375rem;
	}
	.md {
		min-height: 48px;
		padding: 0 24px;
		font-size: 0.9375rem;
	}
	.lg {
		min-height: 56px;
		padding: 0 32px;
		font-size: 1.0625rem;
	}

	// The yellow and the outlined pill stand on a hard edge and press down
	// into it, the way the app's buttons do. `--edge` is the colour of that
	// edge; the lift is a touch taller on the large size.
	.primary,
	.secondary {
		--lift: 4px;
		box-shadow: 0 var(--lift) 0 var(--edge);

		&:active {
			transform: translateY(calc(var(--lift) - 1px));
			box-shadow: 0 1px 0 var(--edge);
		}
	}
	.primary.lg,
	.secondary.lg {
		--lift: 5px;
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
