<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import Socials from '$lib/components/molecules/Socials.svelte';
	import NewsletterForm from '$lib/components/molecules/NewsletterForm.svelte';

	const groups = [
		{
			title: 'Product',
			links: [
				{ label: 'Plans', href: '/pro' },
				{ label: 'LangX Token', href: 'https://token.langx.io' },
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

<footer class="footer" aria-labelledby="footer-heading">
	<h2 id="footer-heading" class="sr-only">Footer</h2>
	<div class="container">
		<div class="newsletter">
			<div class="newsletter-text">
				<h3>Get the big updates</h3>
				<p>One email when something new ships. No spam.</p>
			</div>
			<NewsletterForm />
		</div>

		<div class="top">
			<div class="brand">
				<Logo height={22} />
				<p>Practice a language with someone learning yours. Free, open source, no ads.</p>
			</div>

			<div class="groups">
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
			</div>
		</div>

		<div class="bottom">
			<p class="copy">
				© {new Date().getFullYear()} LangX · New Chapter Technology LLC
			</p>
			<Socials />
		</div>
	</div>
</footer>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.footer {
		border-top: 1px solid var(--color--border);
		padding: var(--space-2xl) 0 var(--space-lg);
		margin-top: var(--space-2xl);
		color: var(--color--text);

		@include for-phone-only {
			padding-top: var(--space-xl);
		}
	}

	.newsletter {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: var(--space-lg);
		align-items: center;
		padding-bottom: var(--space-xl);
		margin-bottom: var(--space-xl);
		border-bottom: 1px solid var(--color--border);

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
			gap: var(--space-md);
		}
	}

	.newsletter-text {
		h3 {
			font-size: 1.25rem;
			margin: 0 0 4px;
		}

		p {
			margin: 0;
			font-size: 0.9375rem;
			color: var(--color--text-shade);
		}
	}

	.top {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 3fr);
		gap: var(--space-xl);

		@media (max-width: 1010px) {
			grid-template-columns: 1fr;
			gap: var(--space-lg);
		}
	}

	.brand {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		align-items: flex-start;

		p {
			font-size: 0.9375rem;
			line-height: 1.5;
			color: var(--color--text-shade);
			max-width: 32ch;
			margin: 0;
		}
	}

	.groups {
		display: grid;
		// Was a fixed four, which left the fifth group stranded alone on a second
		// row. Five will not fit across the space the brand column leaves — the
		// labels here are longer than "Legal" — so three and two, which reads as
		// a layout rather than an accident.
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: var(--space-lg) var(--space-md);

		@include for-phone-only {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.group {
		h3 {
			font-size: 0.8125rem;
			font-weight: 700;
			letter-spacing: 0.02em;
			color: var(--color--text-quiet);
			margin: 0 0 var(--space-xs);
			font-family: var(--font--default);
		}

		ul {
			display: flex;
			flex-direction: column;
			gap: 2px;
		}

		a {
			display: inline-flex;
			align-items: center;
			min-height: 32px;
			font-size: 0.9375rem;
			font-weight: 600;
			color: var(--color--text);

			&:hover {
				color: var(--color--accent);
			}
		}
	}

	.bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		flex-wrap: wrap;
		margin-top: var(--space-xl);
		padding-top: var(--space-md);
		border-top: 1px solid var(--color--border);

		@include for-phone-only {
			flex-direction: column-reverse;
			align-items: flex-start;
		}
	}

	.copy {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color--text-quiet);
	}
</style>
