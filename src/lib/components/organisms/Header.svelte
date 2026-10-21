<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Logo from '$lib/components/atoms/Logo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';
	import { primaryCtaInView } from '$lib/stores/cta';
	import { hueFor } from '$lib/data/hues';

	type Hue = 'tangerine' | 'lime' | 'mint' | 'aqua' | 'sky' | 'lilac';

	interface Props {
		/** The colour of the page's first block; the header wears it at the top. */
		hue?: Hue;
	}

	let { hue: hueProp }: Props = $props();
	// A page under a shared layout names its first block's colour in its load
	// data (`hue`), since it cannot pass a prop up to the layout.
	const hue = $derived(hueProp ?? (page.data?.hue as Hue | undefined) ?? hueFor(page.url.pathname));

	// Search brings most visitors to the blog, the tools and the plans, so
	// those are here; everything else is in the footer.
	const links = [
		{ href: '/#echo', label: 'Echo' },
		{ href: '/plans', label: 'Plans' },
		{ href: '/tools', label: 'Tools' },
		{ href: '/blog', label: 'Blog' }
	];

	// At the top the header is part of the first block. Once the page moves
	// it goes back to the plain ground, so it never paints a hue over a block
	// of another colour. Without script it stays in the hue, which is right
	// for the top of the page and harmless further down.
	let atTop = $state(true);
	onMount(() => {
		const update = () => (atTop = window.scrollY < 8);
		update();
		window.addEventListener('scroll', update, { passive: true });
		return () => window.removeEventListener('scroll', update);
	});
</script>

{#snippet download()}
	<svg
		aria-hidden="true"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.25"
		stroke-linecap="round"
		stroke-linejoin="round"
		><path d="M12 4v11" /><path d="M7 10l5 5 5-5" /><path d="M5 20h14" /></svg
	>
{/snippet}

<!--
	Logo, four links, the theme switch and one button. Sticks to the top. The
	button is ink while the page's own yellow is on screen and takes the yellow
	the moment it scrolls away, so a viewport never carries two (stores/cta.ts).
	On a phone the links fold into a menu that opens without script.
-->
<header class="header" class:plain={!hue || !atTop} data-hue={hue && atTop ? hue : undefined}>
	<div class="bar">
		<Logo height={26} />

		<nav class="links" aria-label="Primary">
			{#each links as link}
				<a href={link.href}>{link.label}</a>
			{/each}
		</nav>

		<div class="tools">
			<span class="toggle-wide"><ThemeToggle /></span>
			<Button
				href="https://get.langx.io"
				variant={$primaryCtaInView || page.data?.headerCta === 'ink' ? 'ink' : 'primary'}
				size="sm"
				icon={download}>Get the app</Button
			>
			<details class="menu">
				<summary aria-label="Menu">
					<svg
						aria-hidden="true"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.25"
						stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg
					>
				</summary>
				<nav class="panel" aria-label="Menu">
					{#each links as link}
						<a href={link.href}>{link.label}</a>
					{/each}
					<a href="/compare">Compare apps</a>
					<a href="https://app.langx.io">Use it in your browser</a>
					<span class="panel-toggle"><ThemeToggle /></span>
				</nav>
			</details>
		</div>
	</div>
</header>

<style lang="scss">
	.header {
		position: sticky;
		top: 0;
		z-index: 30;
		transition: background-color var(--dur-fast) ease;
	}

	.plain {
		background: var(--color--page-background);
		color: var(--color--text);
		box-shadow: inset 0 -1px 0 var(--color--border);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		height: var(--header-height);
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding-inline: 16px;

		@media (min-width: 900px) {
			gap: 40px;
			max-width: calc(var(--container-max) + 64px);
			padding-inline: 32px;
		}

		// The logo takes the header's colour: ink on a block, text on the ground.
		:global(.logo) {
			color: inherit;
			flex: 0 0 auto;
		}
		:global(.logo .wordmark) {
			font-weight: 900;
		}
	}

	.links {
		display: none;
		gap: 28px;
		flex: 1;

		@media (min-width: 900px) {
			display: flex;
		}

		a {
			display: flex;
			align-items: center;
			min-height: 44px;
			color: inherit;
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.0625rem;

			&:hover {
				color: inherit;
				text-decoration: underline;
				text-decoration-thickness: 2px;
			}
		}
	}

	.tools {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-left: auto;
	}

	.toggle-wide {
		display: none;

		@media (min-width: 900px) {
			display: contents;
		}
	}

	.menu {
		position: relative;

		@media (min-width: 900px) {
			display: none;
		}

		summary {
			list-style: none;
			width: 44px;
			height: 44px;
			border-radius: var(--radius-pill);
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			&::-webkit-details-marker {
				display: none;
			}
		}
	}

	.panel {
		position: absolute;
		right: 0;
		top: calc(100% + 10px);
		width: min(280px, calc(100vw - 32px));
		display: flex;
		flex-direction: column;
		padding: 8px;
		border-radius: 24px;
		background: var(--color--ink);
		color: var(--color--on-ink);

		a {
			display: flex;
			align-items: center;
			min-height: 48px;
			padding: 0 14px;
			border-radius: 16px;
			color: inherit;
			font-family: var(--font--title);
			font-weight: 900;
			font-size: 1.125rem;

			&:hover {
				color: inherit;
				background: rgba(255, 255, 255, 0.08);
			}
		}
	}

	.panel-toggle {
		padding: 8px 14px 6px;
	}

	@media (prefers-reduced-motion: reduce) {
		.header {
			transition: none;
		}
	}
</style>
