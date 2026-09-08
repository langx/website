<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';
	import { primaryCtaInView } from '$lib/stores/cta';

	const links = [
		{ href: '/#features', label: 'Features' },
		{ href: '/#plans', label: 'Plans' },
		{ href: '/#faq', label: 'FAQ' },
		{ href: 'https://github.com/langx/langx', label: 'GitHub', external: true }
	];
</script>

<!--
	Logo, four links, the theme switch and one button. Sticks to the top; the
	page shows through it. The button is ink while the page's own yellow is on
	screen and takes the yellow the moment it scrolls away, so a viewport never
	carries two.
-->
<header class="header">
	<div class="container bar">
		<Logo height={24} />

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
			<ThemeToggle />
			<Button href="https://get.langx.io" variant={$primaryCtaInView ? 'dark' : 'primary'} size="sm"
				>Get started</Button
			>
		</div>
	</div>
</header>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.header {
		position: sticky;
		top: 0;
		z-index: 30;
		background: rgba(var(--color--page-background-rgb), 0.92);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--color--border);
	}

	.bar {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 16px 28px;
		padding-top: 14px;
		padding-bottom: 14px;
	}

	.links {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 24px;
		margin-left: auto;
		font-family: var(--font--title);
		font-size: 0.9375rem;
		font-weight: 700;

		a {
			color: var(--color--text-shade);
			transition: color var(--dur-fast) ease;

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					color: var(--color--accent);
				}
			}
		}

		// On a phone the links take a row of their own under the logo and button.
		@include for-phone-only {
			order: 3;
			width: 100%;
			justify-content: center;
			gap: 20px;
		}
	}

	.tools {
		display: flex;
		align-items: center;
		gap: var(--space-xs);

		@include for-phone-only {
			margin-left: auto;
		}
	}
</style>
