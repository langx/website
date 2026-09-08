<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';

	const links = [
		{ label: 'GitHub', href: 'https://github.com/langx/langx' },
		{ label: 'Discord', href: 'https://discord.langx.io' },
		{ label: 'Privacy', href: '/privacy-policy' },
		{ label: 'Terms', href: '/terms-conditions' }
	];

	// Not in the design, kept on purpose: the blog, the tools and the legal
	// pages are reachable from nowhere else on the site.
	const groups = [
		{
			title: 'Product',
			links: [
				{ label: 'Plans', href: '/pro' },
				{ label: 'Tokens', href: '/tokens' },
				{ label: 'Coming from v1?', href: '/welcome-back' },
				{ label: 'Web app', href: 'https://app.langx.io' },
				{ label: 'iOS', href: 'https://apps.apple.com/app/languagexchange/id6474187141' },
				{
					label: 'Android',
					href: 'https://play.google.com/store/apps/details?id=tech.newchapter.languageXchange'
				}
			]
		},
		{
			title: 'Source',
			links: [
				{ label: 'GitHub', href: 'https://github.com/langx/langx' },
				{ label: 'Good first issues', href: 'https://github.com/langx/langx/contribute' },
				{ label: 'Releases', href: 'https://github.com/langx/langx/releases' },
				{ label: 'Docs', href: 'https://docs.langx.io' },
				{ label: 'Status', href: 'https://status.langx.io' },
				{ label: 'Branding', href: 'https://github.com/langx/branding' }
			]
		},
		{
			title: 'Tools',
			links: [
				{ label: 'All tools', href: '/tools' },
				{ label: 'Word lists', href: '/tools/most-common-words' },
				{ label: 'Say it in any language', href: '/tools/say' },
				{ label: 'Vocabulary test', href: '/tools/vocabulary-test' },
				{ label: 'Alphabets', href: '/tools/alphabet' },
				{ label: 'Word game', href: '/tools/word-game' },
				{ label: 'Which language is this?', href: '/tools/guess-the-language' },
				{ label: 'Meaning quiz', href: '/tools/meaning-quiz' },
				{ label: 'Languages that overlap', href: '/tools/similar' }
			]
		},
		{
			title: 'Community',
			links: [
				{ label: 'Discord', href: 'https://discord.langx.io' },
				{ label: 'Reddit', href: 'https://reddit.com/r/langx' },
				{ label: 'Blog', href: '/blog' },
				{ label: 'Sponsors', href: 'https://github.com/sponsors/langx' },
				{ label: 'Backlog', href: 'https://backlog.langx.io' }
			]
		},
		{
			title: 'Legal',
			links: [
				{ label: 'Terms', href: '/terms-conditions' },
				{ label: 'Privacy', href: '/privacy-policy' },
				{ label: 'Cookies', href: '/cookie-policy' },
				{ label: 'Data deletion', href: '/data-deletion' },
				{ label: 'hi@langx.io', href: 'mailto:hi@langx.io' }
			]
		}
	];

	const isExternal = (href: string) => /^https?:\/\//.test(href);
</script>

<!-- One line, the way the design has it; the link groups sit quietly under it. -->
<footer class="footer">
	<div class="container row">
		<Logo height={16} />
		<span class="licence">Open source · BSD-3 · No ads</span>
		<nav class="links" aria-label="Footer">
			{#each links as link}
				<a
					href={link.href}
					target={isExternal(link.href) ? '_blank' : undefined}
					rel={isExternal(link.href) ? 'noopener noreferrer' : undefined}>{link.label}</a
				>
			{/each}
		</nav>
	</div>
	<div class="container groups">
		{#each groups as group}
			<div class="group">
				<h3>{group.title}</h3>
				<ul role="list">
					{#each group.links as link}
						<li>
							<a
								href={link.href}
								target={isExternal(link.href) ? '_blank' : undefined}
								rel={isExternal(link.href) ? 'noopener noreferrer' : undefined}>{link.label}</a
							>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
		<p class="copy">© {new Date().getFullYear()} LangX · New Chapter Technology LLC</p>
	</div>
</footer>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.footer {
		border-top: 1px solid var(--color--border);
		font-size: 0.875rem;
		color: var(--color--text-shade);
	}

	.row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px 20px;
		padding-top: 32px;
		padding-bottom: 32px;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		margin-left: auto;

		@include for-phone-only {
			width: 100%;
			margin-left: 0;
		}
	}

	.footer a {
		color: var(--color--text-shade);

		&:hover {
			color: var(--color--text);
		}
	}

	.groups {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 24px 20px;
		padding-top: 24px;
		padding-bottom: 32px;
		border-top: 1px solid var(--color--border);

		@include for-phone-only {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.group {
		h3 {
			margin: 0 0 6px;
			font-size: 0.8125rem;
			font-weight: 800;
			color: var(--color--text);
		}

		a {
			display: inline-flex;
			align-items: center;
			min-height: 28px;
			font-size: 0.8125rem;
		}
	}

	.copy {
		grid-column: 1 / -1;
		margin: 8px 0 0;
		font-size: 0.8125rem;
		color: var(--color--text-tertiary);
	}
</style>
