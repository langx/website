<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
</script>

<section class="final">
	<h2>practice a language with LangX.</h2>
	<div class="buttons" use:ownsPrimary>
		<Button href="https://app.langx.io" variant="primary" size="lg" block>Start for free</Button>
		<Button href="https://app.langx.io" variant="secondary" size="lg" block>
			I already have an account
		</Button>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.final {
		padding: var(--space-3xl) 0 var(--space-2xl);
		border-top: 1px solid var(--color--border);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--space-lg);

		@include for-phone-only {
			padding: var(--space-2xl) 0 var(--space-xl);
		}

		h2 {
			font-size: clamp(2rem, 1.4rem + 2.4vw, 3rem);
			line-height: 1.05;
			letter-spacing: -0.02em;
			max-width: 16ch;
		}
	}

	.buttons {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		max-width: 330px;
	}
</style>
