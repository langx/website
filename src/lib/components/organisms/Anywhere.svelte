<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';

	const links = {
		web: 'https://app.langx.io',
		ios: 'https://apps.apple.com/app/languagexchange/id6474187141',
		android: 'https://play.google.com/store/apps/details?id=tech.newchapter.languageXchange'
	};
</script>

<section class="anywhere">
	<h2>on your phone, in your browser.</h2>
	<p>The same app on iPhone, Android and the web. Open source, no ads.</p>
	<div class="buttons">
		<Button href={links.ios} variant="secondary" size="lg">App Store</Button>
		<Button href={links.android} variant="secondary" size="lg">Google Play</Button>
		<Button href={links.web} variant="secondary" size="lg">
			Open in browser
			<UiIcon slot="icon" name="globe" size={18} />
		</Button>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.anywhere {
		padding: var(--space-3xl) 0;
		border-top: 1px solid var(--color--border);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--space-sm);

		@include for-phone-only {
			padding: var(--space-2xl) 0;
		}

		h2 {
			font-size: clamp(2rem, 1.4rem + 2.4vw, 3rem);
			line-height: 1.05;
			letter-spacing: -0.02em;
			color: var(--color--accent);
		}

		p {
			margin: 0;
			font-size: 1.125rem;
			color: var(--color--text-shade);
			max-width: 40ch;
		}
	}

	.buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
		margin-top: var(--space-sm);

		@include for-phone-only {
			flex-direction: column;
			width: 100%;
			max-width: 330px;

			:global(.btn) {
				width: 100%;
			}
		}
	}
</style>
