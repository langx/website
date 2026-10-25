<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import { appStoreUrl, playStoreUrl } from '$lib/data/meta';

	// More groups than the design draws, on purpose: the legal pages are
	// reachable from nowhere else, and every guide, tool and comparison gets a
	// sitewide link, which is most of how search finds them.
	const groups = [
		{
			title: 'App',
			links: [
				{ label: 'Download', href: '/download' },
				{ label: 'Use it in your browser', href: 'https://app.langx.io' },
				{ label: 'Plans', href: '/plans' },
				{ label: 'Tokens', href: '/tokens' },
				{ label: 'Compare apps', href: '/compare' },
				{ label: 'Meet Venus', href: '/venus' },
				{ label: 'Coming from v1?', href: '/welcome-back' },
				{ label: 'LangX Token', href: 'https://token.langx.io' }
			]
		},
		{
			title: 'Learn',
			links: [
				{ label: 'Blog', href: '/blog' },
				{ label: 'Tools', href: '/tools' },
				{ label: 'Questions', href: '/faq' },
				{ label: 'Guess the language', href: '/tools/guess-the-language' },
				{ label: 'Word lists', href: '/tools/most-common-words' },
				{ label: 'Say it in any language', href: '/tools/say' },
				{ label: 'Vocabulary test', href: '/tools/vocabulary-test' },
				{ label: 'Alphabets', href: '/tools/alphabet' },
				{ label: 'Word game', href: '/tools/word-game' },
				{ label: 'Meaning quiz', href: '/tools/meaning-quiz' },
				{ label: 'Languages that overlap', href: '/tools/similar' }
			]
		},
		{
			title: 'Guides',
			links: [
				{ label: 'Best language exchange apps', href: '/best-language-exchange-apps' },
				{ label: 'Free language exchange apps', href: '/free-language-exchange-apps' },
				{ label: 'Best language learning apps', href: '/best-language-learning-apps' },
				{ label: 'What is a language exchange?', href: '/what-is-a-language-exchange' },
				{ label: 'Find a partner', href: '/how-to-find-a-language-exchange-partner' },
				{ label: 'Conversation topics', href: '/language-exchange-conversation-topics' },
				{ label: 'Duolingo alternatives', href: '/duolingo-alternatives-for-speaking' },
				{ label: 'Social language apps', href: '/social-language-learning-apps' },
				{
					label: 'Easiest languages to learn',
					href: '/easiest-languages-to-learn-for-english-speakers'
				}
			]
		},
		{
			title: 'Compare',
			links: [
				{ label: 'All comparisons', href: '/compare' },
				{ label: 'LangX vs Tandem', href: '/open-source-alternative-to-tandem' },
				{ label: 'LangX vs HelloTalk', href: '/open-source-alternative-to-hellotalk' },
				{ label: 'Social alternative to Duolingo', href: '/social-alternative-to-duolingo' },
				{ label: 'LangX vs Duolingo', href: '/open-source-alternative-to-duolingo' },
				{ label: 'Speaky alternative', href: '/open-source-alternative-to-speaky' },
				{ label: 'Tandem vs HelloTalk', href: '/tandem-vs-hellotalk' }
			]
		},
		{
			title: 'Open source',
			links: [
				{ label: 'GitHub', href: 'https://github.com/langx/langx' },
				{ label: 'Good first issues', href: 'https://github.com/langx/langx/contribute' },
				{ label: 'Releases', href: 'https://github.com/langx/langx/releases' },
				{ label: 'Docs', href: 'https://docs.langx.io' },
				{ label: 'Status', href: 'https://status.langx.io' },
				{ label: 'Branding', href: 'https://github.com/langx/branding' },
				{ label: 'Discord', href: 'https://discord.langx.io' },
				{ label: 'Reddit', href: 'https://reddit.com/r/langx' },
				{ label: 'Sponsors', href: 'https://github.com/sponsors/langx' },
				{ label: 'Backlog', href: 'https://backlog.langx.io' }
			]
		},
		{
			title: 'Legal',
			links: [
				{ label: 'Privacy', href: '/privacy-policy' },
				{ label: 'Terms', href: '/terms-conditions' },
				{ label: 'Cookies', href: '/cookie-policy' },
				{ label: 'Community guidelines', href: '/community-guidelines' },
				{ label: 'Data deletion', href: '/data-deletion' },
				{ label: 'hi@langx.io', href: 'mailto:hi@langx.io' }
			]
		}
	];

	const isExternal = (href: string) => /^https?:\/\//.test(href);
</script>

<!-- Ink in light mode, black in dark; the same in both, so it closes every page. -->
<footer class="footer">
	<div class="inner">
		<div class="brand">
			<Logo height={28} />
			<p>The friendly language exchange app. Open source, BSD-3, no ads.</p>
			<div class="stores">
				<a href={appStoreUrl} target="_blank" rel="noopener noreferrer">App Store</a>
				<a href={playStoreUrl} target="_blank" rel="noopener noreferrer">Google Play</a>
			</div>
		</div>

		<div class="groups">
			{#each groups as group}
				<div class="group">
					<h2>{group.title}</h2>
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

		<p class="copy">© {new Date().getFullYear()} LangX · New Chapter Technology LLC</p>
	</div>
</footer>

<style lang="scss">
	.footer {
		background: var(--color--footer-background);
		color: var(--color--footer-text);
		font-size: 1rem;
	}

	.inner {
		display: flex;
		flex-direction: column;
		gap: 40px;
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding: 40px 16px 32px;

		@media (min-width: 900px) {
			display: grid;
			grid-template-columns: 280px 1fr;
			gap: 48px 64px;
			max-width: calc(var(--container-max) + 64px);
			padding: 64px 32px 48px;
		}
	}

	.brand {
		display: flex;
		flex-direction: column;
		gap: 14px;

		:global(.logo),
		:global(.logo:hover) {
			color: var(--color--footer-text);
		}
		:global(.logo .wordmark) {
			font-weight: 900;
		}

		p {
			margin: 0;
			color: var(--color--footer-muted);
			line-height: 1.45;
		}
	}

	.stores {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;

		a {
			display: inline-flex;
			align-items: center;
			min-height: 48px;
			padding: 0 16px;
			border-radius: var(--radius-pill);
			box-shadow: inset 0 0 0 2px var(--color--footer-line);
			color: var(--color--footer-text);
			font-weight: 700;
			font-size: 0.9375rem;

			&:hover {
				color: var(--color--footer-text);
				box-shadow: inset 0 0 0 2px var(--color--footer-muted);
			}
		}
	}

	.groups {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 28px 16px;

		@media (min-width: 900px) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 40px 32px;
		}
	}

	.group {
		h2 {
			margin: 0 0 6px;
			font-family: var(--font--title);
			font-size: 1.0625rem;
			font-weight: 900;
			line-height: 1.25;
			letter-spacing: normal;
			color: var(--color--footer-text);
		}

		a {
			display: inline-flex;
			align-items: center;
			min-height: 36px;
			color: var(--color--footer-muted);
			font-size: 0.9375rem;

			&:hover {
				color: var(--color--footer-text);
			}
		}
	}

	.copy {
		grid-column: 1 / -1;
		margin: 0;
		font-size: 0.875rem;
		color: var(--color--footer-muted);
	}
</style>
