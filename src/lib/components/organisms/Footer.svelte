<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';

	const links = [
		{ label: 'Web app', href: 'https://app.langx.io' },
		{ label: 'App Store', href: 'https://apps.apple.com/app/id6474187141' },
		{
			label: 'Google Play',
			href: 'https://play.google.com/store/apps/details?id=tech.newchapter.languageXchange'
		},
		{ label: 'GitHub', href: 'https://github.com/langx' }
	];

	// Not in the design, kept on purpose: the stores require the policies to
	// be reachable, and this is the only place on the site that links them.
	const legal = [
		{ label: 'Terms', href: '/terms-conditions' },
		{ label: 'Privacy', href: '/privacy-policy' },
		{ label: 'Cookies', href: '/cookie-policy' },
		{ label: 'Data deletion', href: '/data-deletion' },
		{ label: 'hi@langx.io', href: 'mailto:hi@langx.io' }
	];
</script>

<footer class="footer">
	<div class="container row">
		<div class="brand">
			<Logo height={18} />
			<span class="licence">Open source · BSD-3</span>
		</div>
		<nav class="links" aria-label="Footer">
			{#each links as link}
				<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
			{/each}
		</nav>
	</div>
	<div class="container legal">
		{#each legal as link}
			<a href={link.href}>{link.label}</a>
		{/each}
	</div>
</footer>

<style lang="scss">
	.footer {
		border-top: 1px solid var(--color--border);
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 20px;
		padding-top: 40px;
		padding-bottom: 20px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.licence {
		font-size: 0.875rem;
		color: var(--color--text-tertiary);
		margin-left: 8px;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		font-size: 0.9375rem;

		a {
			color: var(--color--text-shade);

			&:hover {
				color: var(--color--text);
			}
		}
	}

	.legal {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		padding-bottom: 32px;
		font-size: 0.8125rem;

		a {
			color: var(--color--text-quiet);

			&:hover {
				color: var(--color--text);
			}
		}
	}
</style>
