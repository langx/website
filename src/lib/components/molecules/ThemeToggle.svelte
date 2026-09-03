<script lang="ts">
	import { theme } from '$lib/stores/theme';

	// auto → light → dark → auto
	const next: Record<string, string> = { auto: 'light', light: 'dark', dark: 'auto' };
	const labels: Record<string, string> = { auto: 'system', light: 'light', dark: 'dark' };

	$: current = $theme ?? 'auto';
	$: label = `Theme: ${labels[current]}. Switch to ${labels[next[current]]}`;
</script>

<noscript>
	<style>
		.theme-toggle {
			display: none !important;
		}
	</style>
</noscript>

<button
	class="theme-toggle"
	type="button"
	title={label}
	aria-label={label}
	data-theme={current}
	on:click={() => theme.set(next[current])}
>
	<svg
		viewBox="0 0 24 24"
		width="20"
		height="20"
		aria-hidden="true"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<g class="sun">
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M18.4 5.6l-1.1 1.1M6.7 17.3l-1.1 1.1"
			/>
		</g>
		<path class="moon" d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
	</svg>
	<span class="auto" aria-hidden="true">A</span>
</button>

<style lang="scss">
	.theme-toggle {
		position: relative;
		width: 40px;
		height: 40px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-pill);
		background: var(--color--surface);
		color: var(--color--text);
		cursor: pointer;
		transition: background-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);

		&:active {
			transform: scale(0.95);
		}

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				background: var(--color--muted);
			}
		}
	}

	svg {
		overflow: visible;
	}

	// The two glyphs crossfade with a quarter turn; whichever theme is in
	// effect is the one drawn.
	.sun,
	.moon {
		transform-origin: 12px 12px;
		transition: opacity var(--dur-fast) ease, transform var(--dur-fast) var(--ease-out);
	}

	.moon {
		opacity: 0;
		transform: rotate(-40deg) scale(0.8);
	}

	[data-theme='dark'] {
		.sun {
			opacity: 0;
			transform: rotate(40deg) scale(0.8);
		}
		.moon {
			opacity: 1;
			transform: none;
		}
	}

	@media (prefers-color-scheme: dark) {
		[data-theme='auto'] {
			.sun {
				opacity: 0;
				transform: rotate(40deg) scale(0.8);
			}
			.moon {
				opacity: 1;
				transform: none;
			}
		}
	}

	// A tiny "A" badge says the choice is the system's.
	.auto {
		position: absolute;
		right: -3px;
		top: -3px;
		width: 15px;
		height: 15px;
		border-radius: var(--radius-pill);
		background: var(--color--accent);
		color: #fefefe;
		font-size: 9px;
		font-weight: 800;
		font-family: var(--font--title);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transform: scale(0.8);
		transition: opacity var(--dur-fast) ease, transform var(--dur-fast) var(--ease-out);
	}

	[data-theme='auto'] .auto {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.sun,
		.moon,
		.auto {
			transition: none;
		}
	}
</style>
