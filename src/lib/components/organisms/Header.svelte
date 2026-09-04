<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import Logo from '$lib/components/atoms/Logo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import StarCount from '$lib/components/molecules/StarCount.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';
	import { primaryCtaInView } from '$lib/stores/cta';

	const links = [
		{ href: '/#how', label: 'How it works' },
		{ href: '/pro', label: 'Plans' },
		{ href: '/blog', label: 'Blog' },
		{ href: 'https://docs.langx.io', label: 'Docs', external: true }
	];

	let scrolled = false;
	let open = false;
	let sheet: HTMLElement;
	let menuButton: HTMLButtonElement;

	onMount(() => {
		const onScroll = () => (scrolled = window.scrollY > 8);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	afterNavigate(() => close());

	async function openMenu() {
		open = true;
		document.documentElement.style.overflow = 'hidden';
		await tick();
		sheet?.querySelector<HTMLElement>('.sheet-links a')?.focus();
	}

	function close() {
		if (!open) return;
		open = false;
		document.documentElement.style.overflow = '';
		menuButton?.focus({ preventScroll: true });
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window on:keydown={onKey} />

<header class="header" class:scrolled>
	<div class="container bar">
		<Logo height={22} />

		<nav class="links" aria-label="Primary">
			{#each links as link}
				<a
					href={link.href}
					target={link.external ? '_blank' : undefined}
					rel={link.external ? 'noopener noreferrer' : undefined}>{link.label}</a
				>
			{/each}
		</nav>

		<div class="tools">
			<span class="star"><StarCount /></span>
			<ThemeToggle />
			<span class="cta" class:yellow={!$primaryCtaInView}>
				<Button
					href="https://app.langx.io"
					variant={$primaryCtaInView ? 'dark' : 'primary'}
					size="sm"
				>
					Start for free
				</Button>
			</span>
			<button
				class="menu"
				type="button"
				aria-label="Open menu"
				aria-expanded={open}
				aria-controls="site-menu"
				bind:this={menuButton}
				on:click={openMenu}
			>
				<UiIcon name="menu" size={22} />
			</button>
		</div>
	</div>
</header>

{#if open}
	<div class="backdrop" on:click={close} aria-hidden="true" />
	<div
		class="sheet"
		id="site-menu"
		role="dialog"
		aria-modal="true"
		aria-label="Menu"
		bind:this={sheet}
	>
		<div class="grabber" aria-hidden="true" />
		<div class="sheet-head">
			<span class="sheet-title">Menu</span>
			<button type="button" class="close" aria-label="Close menu" on:click={close}>
				<UiIcon name="close" size={20} />
			</button>
		</div>
		<nav class="sheet-links" aria-label="Primary">
			{#each links as link}
				<a
					href={link.href}
					target={link.external ? '_blank' : undefined}
					rel={link.external ? 'noopener noreferrer' : undefined}
					on:click={close}
				>
					<span>{link.label}</span>
					<UiIcon name={link.external ? 'external' : 'chevron-right'} size={18} />
				</a>
			{/each}
		</nav>
		<div class="sheet-tools">
			<StarCount />
			<ThemeToggle />
		</div>
		<div class="sheet-cta">
			<Button href="https://app.langx.io" variant="primary" size="lg" block>Start for free</Button>
		</div>
	</div>
{/if}

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.header {
		position: sticky;
		top: 0;
		z-index: 30;
		background: var(--color--page-background);
		border-bottom: 1px solid transparent;
		transition: border-color var(--dur-fast) ease;

		&.scrolled {
			border-bottom-color: var(--color--border);
		}
	}

	.bar {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		height: var(--header-height);
	}

	.links {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-left: var(--space-sm);

		a {
			display: inline-flex;
			align-items: center;
			min-height: 36px;
			padding: 0 12px;
			border-radius: var(--radius-pill);
			font-size: 0.9375rem;
			font-weight: 600;
			color: var(--color--text-shade);
			transition: color var(--dur-fast) ease, background-color var(--dur-fast) ease;

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					color: var(--color--text);
					background: var(--color--muted);
				}
			}
		}

		@include for-tablet-portrait-down {
			display: none;
		}
	}

	.tools {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.star {
		display: inline-flex;

		@media (max-width: 1040px) {
			display: none;
		}
	}

	.cta {
		display: inline-flex;

		@include for-phone-only {
			display: none;
		}
	}

	.menu,
	.close {
		display: none;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-pill);
		background: var(--color--surface);
		color: var(--color--text);
		cursor: pointer;
		transition: transform var(--dur-press) var(--ease-out), background-color var(--dur-fast) ease;

		&:active {
			transform: scale(0.95);
		}

		@include for-tablet-portrait-down {
			display: inline-flex;
		}
	}

	.close {
		display: inline-flex;
	}

	// The menu is the app's bottom sheet: grabber, rounded top, the drawer
	// curve, and a backdrop that only fades.
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 50;
		background: rgba(13, 15, 18, 0.45);
		animation: fade var(--dur-fast) ease both;
	}

	.sheet {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 51;
		background: var(--color--surface);
		border-radius: 28px 28px 0 0;
		box-shadow: var(--shadow-sheet);
		padding: 0 24px calc(24px + env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		max-height: 90vh;
		max-height: 90dvh;
		overflow: auto;
		animation: rise var(--dur-sheet) var(--ease-drawer) both;
	}

	@keyframes rise {
		from {
			transform: translateY(100%);
		}
		to {
			transform: none;
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.grabber {
		width: 38px;
		height: 4px;
		background: var(--color--border);
		border-radius: var(--radius-pill);
		margin: 12px auto 0;
	}

	.sheet-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 0 6px;
	}

	.sheet-title {
		font-family: var(--font--title);
		font-size: 1.375rem;
		font-weight: 800;
	}

	.sheet-links {
		display: flex;
		flex-direction: column;

		a {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: 17px 0;
			border-bottom: 1px solid var(--color--border);
			font-size: 1.0625rem;
			font-weight: 600;
			color: var(--color--text);

			:global(svg) {
				color: var(--color--text-quiet);
			}
		}
	}

	.sheet-tools {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 0;
	}

	.sheet-cta {
		padding-top: 4px;
	}

	@media (prefers-reduced-motion: reduce) {
		.sheet,
		.backdrop {
			animation: none;
		}
	}
</style>
