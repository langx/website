<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';

	const links = [
		{ href: '/#features', label: 'Features' },
		{ href: '/#plans', label: 'Plans' },
		{ href: '/#reviews', label: 'Reviews' },
		{ href: 'https://github.com/langx', label: 'GitHub', external: true }
	];
</script>

<!-- Logo, four links, the theme switch and one yellow button. It scrolls with the page. -->
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
			<Button href="https://app.langx.io" variant="primary" size="sm">Get the app</Button>
		</div>
	</div>
</header>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 16px;
		padding-top: 20px;
		padding-bottom: 20px;
	}

	.links {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 4px;

		a {
			display: inline-flex;
			align-items: center;
			padding: 8px 14px;
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

		// On a phone the links take a row of their own under the logo and button.
		@include for-phone-only {
			order: 3;
			width: 100%;
			justify-content: center;
		}
	}

	.tools {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}
</style>
