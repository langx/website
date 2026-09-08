<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Mark from '$lib/components/globe/Mark.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { reveal } from '$lib/utils/reveal';
</script>

<!-- The mark turning in three dimensions, one line, and the same two buttons as the top of the page. -->
<section class="final" data-reveal-children use:reveal={{ children: true, stagger: 0.1 }}>
	<Mark size={96} />
	<h2>Practice a language with LangX</h2>
	<div class="buttons" use:ownsPrimary>
		<Button href="https://get.langx.io" variant="primary" size="lg" block>Start for free</Button>
		<Button href="https://get.langx.io" variant="secondary" size="lg" block
			>I have an account</Button
		>
	</div>
	<p>iPhone · Android · Browser — the same app everywhere.</p>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.final {
		padding: 120px 0 100px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 28px;
		text-align: center;

		@include for-phone-only {
			padding: 80px 0 72px;
		}
	}

	h2 {
		margin: 0;
		max-width: 18ch;
		font-weight: 900;
		font-size: clamp(1.875rem, 4vw, 2.875rem);
		line-height: 1.1;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		max-width: 330px;
	}

	p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color--text-tertiary);
	}
</style>
