<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Globe from '$lib/components/globe/Globe.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
</script>

<!-- The world on the left, the ask on the right. Two buttons, nothing else. -->
<section id="hero" class="hero">
	<div class="device">
		<Globe label="A globe with arcs linking cities where people are chatting on LangX" />
	</div>

	<div class="copy">
		<h1>The friendly way to practise a language with real people.</h1>
		<div class="buttons" use:ownsPrimary>
			<Button href="https://app.langx.io" variant="primary" size="lg" block>Start for free</Button>
			<Button href="https://app.langx.io" variant="secondary" size="lg" block>
				I already have an account
			</Button>
		</div>
		<p class="fine">Chat with someone who speaks your target language and is learning yours.</p>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		align-items: center;
		gap: var(--space-xl);
		padding: var(--space-xl) 0 var(--space-2xl);
		min-height: calc(100vh - var(--header-height));
		min-height: calc(100dvh - var(--header-height));
		max-height: 900px;

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
			min-height: 0;
			max-height: none;
			padding: var(--space-lg) 0 var(--space-xl);
			gap: var(--space-lg);
		}
	}

	.device {
		display: flex;
		justify-content: center;

		@include for-tablet-portrait-down {
			order: 2;
			max-width: 360px;
			margin: 0 auto;
		}
	}

	.copy {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--space-lg);

		h1 {
			max-width: 18ch;
			font-size: clamp(1.9rem, 1.3rem + 2.2vw, 2.75rem);
			line-height: 1.15;
		}

		@include for-tablet-portrait-down {
			order: 1;
			gap: var(--space-md);
		}
	}

	.buttons {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		max-width: 330px;
	}

	.fine {
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--color--text-shade);
		max-width: 34ch;
		margin: 0;
	}
</style>
