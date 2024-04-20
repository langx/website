<script lang="ts">
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';
	import NewsletterForm from '$lib/components/molecules/NewsletterForm.svelte';
</script>

<section id="newsletter">
	<div class="newsletter-wrapper">
		<h2><SparklingHighlight color="secondary">Still thinking about it?</SparklingHighlight></h2>
		<p>Sign up for our newsletter and get updates about LangX's progress.</p>
		<NewsletterForm styles="margin: auto;" />
		<svg viewBox="0 0 1024 1024" aria-hidden="true">
			<circle cx="512" cy="512" r="512" fill="var(--color--yellow)" />
		</svg>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#newsletter {
		margin: 80px 0;

		.newsletter-wrapper {
			padding: 144px 108px;
			border-radius: 1.5rem;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
			background: var(--color--card-background);
			overflow: hidden;
			isolation: isolate;
			position: relative;

			@include for-tablet-portrait-down {
				padding: 108px;
			}

			@include for-phone-only {
				border-radius: 10px;
				padding: 96px 24px;
			}

			h2 {
				font-weight: 700;
				text-align: center;
				max-width: 42rem;
				margin: auto;
			}

			p {
				font-size: 0.9rem;
				font-weight: 300;
				text-align: center;
				max-width: 38rem;
				margin: 0.5rem auto 2.5rem auto;
			}

			svg {
				width: 64rem;
				z-index: -10;
				position: absolute;
				min-width: 64rem;
				top: 61%;
				left: 50%;
				display: block;
				transform: translateX(-50%);
			}
		}
	}
</style>
