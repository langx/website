<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import Block from '$lib/components/atoms/Block.svelte';
	import FAQ from '$lib/components/organisms/FAQ.svelte';
	import FinalCta from '$lib/components/organisms/FinalCta.svelte';
	import { faqObjects } from '$lib/data/faq';

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
		<h1 id="faq-page-title" class="display-hero">questions, answered.</h1>
		<p>Short, honest answers about plans, calls, safety and your account.</p>
	</div>
</Block>

<div class="list">
	<FAQ title="all of them." id="questions" />
</div>

<div class="close">
	<FinalCta />
</div>

<style lang="scss">
	.hero {
		display: flex;
		flex-direction: column;
		gap: 20px;

		p {
			margin: 0;
			max-width: 520px;
			font-size: 1.1875rem;
			line-height: 1.47;
			font-weight: 500;
		}
	}

	.list,
	.close {
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding: 56px 16px 0;

		@media (min-width: 768px) {
			max-width: calc(var(--container-max) + 64px);
			padding: 96px 32px 0;
		}
	}

	.list > :global(.faq) {
		padding-top: 0;
	}

	.close {
		padding-top: 0;
		padding-bottom: 72px;
	}
</style>
