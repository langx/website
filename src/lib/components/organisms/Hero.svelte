<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Globe from '$lib/components/globe/Globe.svelte';
	import { reveal } from '$lib/utils/reveal';
</script>

<!--
	One headline, one sentence, two buttons, and the globe underneath. The copy
	plays in line by line on load; the globe settles in after it.
-->
<section id="hero" class="hero">
	<div
		class="copy"
		data-reveal-children
		use:reveal={{ children: true, onLoad: true, stagger: 0.12 }}
	>
		<h1>The friendly way to practise a language with real people</h1>
		<p class="lede">Chat with someone who speaks your target language and is learning yours.</p>
		<div class="buttons">
			<Button href="https://get.langx.io" variant="primary" size="lg">Start for free</Button>
			<Button href="#features" variant="secondary" size="lg">See how it works</Button>
		</div>
		<p class="fine">Free · Open source · No ads</p>
	</div>

	<div class="globe" data-reveal use:reveal={{ onLoad: true, y: 0, scale: 0.94, delay: 0.4 }}>
		<Globe label="A globe with arcs linking cities where people are chatting on LangX" />
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.hero {
		max-width: 760px;
		margin: 0 auto;
		padding: 110px 0 70px;
		text-align: center;

		@include for-phone-only {
			padding: 56px 0 48px;
		}
	}

	h1 {
		margin: 0;
		font-weight: 900;
		font-size: clamp(2.5rem, 6vw, 4rem);
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	.lede {
		margin: 28px auto 0;
		max-width: 46ch;
		font-size: 1.2rem;
		line-height: 1.6;
	}

	.buttons {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 14px;
		margin-top: 40px;
	}

	.fine {
		margin: 32px 0 0;
		font-size: 0.9375rem;
		color: var(--color--text-tertiary);
	}

	.globe {
		width: 100%;
		max-width: 520px;
		margin: 56px auto 0;

		@include for-phone-only {
			max-width: 360px;
			margin-top: 40px;
		}
	}
</style>
