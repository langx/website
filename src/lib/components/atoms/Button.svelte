<script lang="ts">
	import type { Snippet } from 'svelte';
	import { HttpRegex } from '$lib/utils/regex';

	interface Props {
		/**
		 * `primary` is the yellow committing action — one per viewport.
		 * `ink` (and its older names `secondary` and `dark`) is the ink pill
		 * that sits beside it. `arrow` is an ink pill with a trailing arrow, for
		 * "read more" links out of a chapter. `light` is a white pill for the
		 * blue block. `outline` is a 2px ring in the text colour, `ghost` a link
		 * with no chrome.
		 */
		variant?: 'primary' | 'ink' | 'arrow' | 'light' | 'outline' | 'secondary' | 'dark' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		block?: boolean;
		type?: 'button' | 'submit';
		disabled?: boolean;
		/** Default to a new tab, without the opener, for an external href. */
		target?: string;
		rel?: string;
		icon?: Snippet;
		children?: Snippet;
		// Anything else (onclick, aria-*, data-*) goes on the element.
		[key: string]: unknown;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		block = false,
		type = 'button',
		disabled = false,
		target,
		rel,
		icon,
		children,
		...rest
	}: Props = $props();

	const isExternalLink = $derived(!!href && HttpRegex.test(href));
	// The two older names draw the ink pill.
	const look = $derived(variant === 'secondary' || variant === 'dark' ? 'ink' : variant);
</script>

{#snippet arrow()}
	<svg
		class="arrow-glyph"
		aria-hidden="true"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg
	>
{/snippet}

{#if href}
	<a
		{href}
		target={target ?? (isExternalLink ? '_blank' : undefined)}
		rel={rel ?? (isExternalLink ? 'noopener noreferrer' : undefined)}
		class="btn {look} {size}"
		class:block
		data-sveltekit-preload-data
		{...rest}
	>
		{#if icon}<span class="icon">{@render icon?.()}</span>{/if}
		{@render children?.()}
		{#if look === 'arrow'}{@render arrow()}{/if}
	</a>
{:else}
	<button {type} {disabled} class="btn {look} {size}" class:block {...rest}>
		{#if icon}<span class="icon">{@render icon?.()}</span>{/if}
		{@render children?.()}
		{#if look === 'arrow'}{@render arrow()}{/if}
	</button>
{/if}

<style lang="scss">
	// The v3 pill: Nunito 900 in sentence case, fully round, flat. No ledge
	// and no shadow; the press is a quick scale.
	.btn {
		appearance: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border: 0;
		border-radius: var(--radius-pill);
		font-family: var(--font--title);
		font-weight: 900;
		line-height: 1.15;
		text-decoration: none;
		cursor: pointer;
		// A label stays on one line while it fits; on a screen narrower than
		// the label it wraps, balanced, inside the pill rather than past it.
		max-width: 100%;
		text-align: center;
		text-wrap: balance;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		transition:
			transform 120ms var(--ease-out),
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease;

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
		min-height: 44px;
		padding: 6px 18px;
		font-size: 1rem;
	}
	.md {
		min-height: 48px;
		padding: 8px 22px;
		font-size: 1.0625rem;
	}
	.lg {
		min-height: 56px;
		padding: 10px 28px;
		font-size: 1.1875rem;
	}

	.primary {
		background: var(--color--primary);
		color: var(--color--on-primary);
	}

	// Ink on a colour block in both schemes; on the plain ground it is the
	// text colour, so in dark mode it turns light instead of vanishing.
	.ink,
	.arrow {
		background: var(--ink-fill, var(--color--text));
		color: var(--ink-label, var(--color--page-background));
	}

	.light {
		background: #ffffff;
		color: var(--color--blue);
	}

	.outline {
		background: transparent;
		color: inherit;
		box-shadow: inset 0 0 0 2px currentColor;
	}

	.ghost {
		background: transparent;
		color: var(--color--accent);
		padding-inline: 10px;
	}

	.arrow-glyph {
		flex: 0 0 auto;
		transition: transform var(--dur-fast) var(--ease-out);
	}

	@media (hover: hover) and (pointer: fine) {
		.primary:hover {
			background: var(--color--primary-shade);
			color: var(--color--on-primary);
		}
		.ink:hover,
		.arrow:hover {
			color: var(--ink-label, var(--color--page-background));
		}
		.arrow:hover .arrow-glyph {
			transform: translateX(3px);
		}
		.light:hover {
			color: var(--color--blue);
			background: #e9efff;
		}
		.outline:hover {
			color: inherit;
		}
		.ghost:hover {
			background: var(--color--accent-tint);
			color: var(--color--accent);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.btn,
		.arrow-glyph {
			transition: none;
		}
		.btn:active {
			transform: none;
		}
	}
</style>
