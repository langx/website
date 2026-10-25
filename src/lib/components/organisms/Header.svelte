<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
	import Logo from '$lib/components/atoms/Logo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';
	import { ctaSettled, heroOwnsPrimary, primaryCtaInView } from '$lib/stores/cta';
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

	// Search brings most visitors to the plans, the comparisons, the tools and
	// the blog, so those are here; everything else is in the footer. The last
	// two are the sister sites, which each link back here: they open in a new
	// tab and carry the arrow, so nobody mistakes them for a page of this one.
	const links = [
		{ href: '/#echo', label: 'Echo' },
		{ href: '/plans', label: 'Plans' },
		{ href: '/compare', label: 'Compare' },
		{ href: '/tools', label: 'Tools' },
		{ href: '/blog', label: 'Blog' },
		{ href: 'https://token.langx.io', label: 'Token', external: true },
		{ href: 'https://copilot.langx.io', label: 'Copilot', external: true }
	];

	// The section you are in, marked in both the bar and the phone menu. Echo
	// is a place on the homepage, not a page, so it is never current.
	const isCurrent = (href: string) =>
		!href.includes('#') && (page.url.pathname === href || page.url.pathname.startsWith(`${href}/`));

	// At the top the header is part of the first block. Once the page moves
	// it goes back to the plain ground, so it never paints a hue over a block
	// of another colour. Without script it stays in the hue, which is right
	// for the top of the page and harmless further down.
	let atTop = $state(true);

	// The button's colour as the server draws it: ink where the hero owns the
	// yellow, yellow elsewhere. Once an observer has reported, the live
	// value from stores/cta.ts takes over.
	const inkAtFirst = $derived(heroOwnsPrimary(page.url.pathname));
	const ink = $derived($ctaSettled ? $primaryCtaInView : inkAtFirst);
	// A new page starts from its own first-paint colour again, so going back
	// to / does not flash yellow before the hero's observer reports.
	beforeNavigate(() => ctaSettled.set(false));
	onMount(() => {
		const update = () => (atTop = window.scrollY < 8);
		update();
		window.addEventListener('scroll', update, { passive: true });
		return () => window.removeEventListener('scroll', update);
	});
</script>

{#snippet navLink(link: (typeof links)[number])}
	{#if link.external}
		<a href={link.href} target="_blank" rel="noopener noreferrer"
			>{link.label}<UiIcon name="external" size={15} /></a
		>
	{:else}
		<a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>{link.label}</a>
	{/if}
{/snippet}

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
	Logo, the links, the theme switch and one button. Sticks to the top. The
	button is ink while the page's own yellow is on screen and takes the yellow
	the moment it scrolls away, so a viewport never carries two (stores/cta.ts).
	On a phone the links fold into a menu that opens without script.
-->
<header class="header" class:plain={!hue || !atTop} data-hue={hue && atTop ? hue : undefined}>
	<div class="bar">
		<Logo height={26} />

		<nav class="links" aria-label="Primary">
			{#each links as link}
				{@render navLink(link)}
			{/each}
		</nav>

		<div class="tools">
			<span class="toggle-wide"><ThemeToggle /></span>
			<Button
				href="https://get.langx.io"
				variant={ink ? 'ink' : 'primary'}
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
						{@render navLink(link)}
					{/each}
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
		align-items: center;
		gap: 4px;
		flex: 1;

		// The logo, seven links, the switch and the button measure 1079px with
		// the gutters, so the bar takes over from the menu at 1100. At 900, once
		// the sister sites joined, it ran past the edge and squeezed the button
		// onto three lines.
		@media (min-width: 1100px) {
			display: flex;
		}

		a {
			display: flex;
			align-items: center;
			gap: 4px;
			min-height: 44px;
			padding: 0 14px;
			border-radius: var(--radius-pill);
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

		// The section you are in: an ink pill, its letters in the header's
		// colour (the block's hue at the top, the ground once scrolled).
		a[aria-current='page'] {
			background: var(--ink-fill, var(--color--text));
			color: var(--block, var(--color--page-background));
			font-weight: 900;

			&:hover {
				color: var(--block, var(--color--page-background));
				text-decoration: none;
			}
		}
	}

	.tools {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 12px;
		margin-left: auto;
	}

	.toggle-wide {
		display: none;

		@media (min-width: 1100px) {
			display: contents;
		}
	}

	.menu {
		position: relative;

		@media (min-width: 1100px) {
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
			gap: 6px;
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

			&[aria-current='page'] {
				background: rgba(255, 255, 255, 0.16);
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
