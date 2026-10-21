<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import Block from '$lib/components/atoms/Block.svelte';
	import FAQ from '$lib/components/organisms/FAQ.svelte';
	import FinalCta from '$lib/components/organisms/FinalCta.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import { faqObjects } from '$lib/data/faq';

	// The questions in groups, by id, in the order a newcomer asks them.
	const GROUPS = [
		{ slug: 'getting-started', name: 'Getting started', ids: [1, 2, 3, 15] },
		{ slug: 'plans-and-pro', name: 'Plans and Pro', ids: [11] },
		{ slug: 'calls-and-safety', name: 'Calls and safety', ids: [12, 7] },
		{ slug: 'echo-and-streaks', name: 'Echo and streaks', ids: [13, 14] },
		{ slug: 'tokens-and-copilot', name: 'Tokens and Copilot', ids: [4, 5] },
		{ slug: 'your-account', name: 'Your account', ids: [6, 8] },
		{ slug: 'other-apps', name: 'LangX and other apps', ids: [9, 10] }
	].map((g) => ({ ...g, items: g.ids.map((id) => faqObjects.find((q) => q.id === id)!) }));

	const stripTags = (html: string) => html.replace(/<[^>]+>/g, '');

	// Every question, the ones the homepage asks included, so the homepage's
	// "How Echo works" and "When you can call" land on an answer: /faq#echo.
	const ld = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqObjects.map((q) => ({
			'@type': 'Question',
			name: q.title,
			acceptedAnswer: { '@type': 'Answer', text: stripTags(q.content) }
		}))
	};
</script>

<Seo
	title="Questions about LangX"
	path="/faq"
	description="Short, honest answers about LangX: what is free, where it works, calls, Echo, streaks, safety and your account."
/>
<JsonLd data={ld} />

<Block hue="aqua" pad="hero" labelledby="faq-page-title">
	<div class="hero">
		<Tag tone="ink">Questions</Tag>
		<h1 id="faq-page-title" class="display-hero">questions, answered.</h1>
		<p>Short, honest answers about plans, calls, safety and your account.</p>
	</div>
</Block>

<div class="body">
	<nav class="groups" aria-label="Topics">
		{#each GROUPS as g}
			<a href="#{g.slug}">{g.name}</a>
		{/each}
	</nav>
	<div class="lists">
		{#each GROUPS as g, i}
			<FAQ
				items={g.items}
				title="{g.name.toLowerCase()}."
				id={g.slug}
				layout="stack"
				openFirst={i === 0}
			/>
		{/each}
		<p class="more">
			Prices, limits and trials are on <a href="/plans">the plans page</a>, with their own
			questions.
		</p>
	</div>
</div>

<div class="close">
	<FinalCta />
</div>

<style lang="scss">
	.hero {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;

		p {
			margin: 0;
			max-width: 520px;
			font-size: 1.1875rem;
			line-height: 1.47;
			font-weight: 500;
		}
	}

	.body,
	.close {
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding: 32px 16px 0;

		@media (min-width: 768px) {
			max-width: calc(var(--container-max) + 64px);
			padding: 72px 32px 0;
		}
	}

	.body {
		display: grid;
		gap: 24px;

		@media (min-width: 900px) {
			grid-template-columns: 240px 1fr;
			gap: 48px;
			align-items: start;
		}
	}

	// A row of pills on a phone, a sticky list beside the answers on a desktop.
	.groups {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		padding-bottom: 4px;

		@media (min-width: 900px) {
			position: sticky;
			top: calc(var(--header-height) + 24px);
			flex-direction: column;
			overflow: visible;
		}

		a {
			flex: 0 0 auto;
			display: flex;
			align-items: center;
			min-height: 44px;
			padding: 0 16px;
			border-radius: 999px;
			background: var(--color--muted);
			color: var(--color--text);
			font-weight: 800;
			font-size: 0.9375rem;
			white-space: nowrap;

			&:hover {
				color: var(--color--text);
				background: var(--color--border);
			}

			@media (min-width: 900px) {
				background: transparent;
			}
		}
	}

	.lists {
		display: flex;
		flex-direction: column;
		gap: 48px;

		> :global(.faq) {
			padding-top: 0;
			scroll-margin-top: calc(var(--header-height) + 24px);
		}
	}

	.more {
		margin: 0;
		color: var(--color--text-shade);

		a {
			color: var(--color--accent);
			text-decoration: underline;
		}
	}

	.close {
		padding-bottom: 72px;
	}
</style>
