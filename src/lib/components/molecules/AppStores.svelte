<script>
	import Image from '$lib/components/atoms/Image.svelte';
</script>

<div class="app-stores">
	<a
		href="https://apps.apple.com/app/languagexchange/id6474187141"
		target="_blank"
		rel="noopener noreferrer"
		title="Download the app from App Store"
	>
		<Image src="images/ios.png" alt="Apple App Store" />
	</a>
	<a
		href="https://play.google.com/store/apps/details?id=tech.newchapter.languageXchange"
		target="_blank"
		rel="noopener noreferrer"
		title="Download the app from Google Play Store"
	>
		<Image src="images/android.png" alt="Google Play Store" />
	</a>
	<a href="https://app.langx.io" target="_blank" rel="noopener noreferrer" title="Open Web App">
		<Image src="images/pwa.png" alt="Progressive Web App" />
	</a>
</div>

<style lang="scss">
	@import '../../scss/breakpoints.scss';

	.app-stores {
		display: flex;
		align-items: center;
		gap: 20px;

		@include for-phone-only {
			flex-direction: column;
			align-items: center;
			gap: 10px;
		}

		a {
			transition: all 0.2s ease-in-out;
			max-width: 200px;
			color: var(--color--text-invert);
			fill: var(--color--text-invert);

			@include for-phone-only {
				width: 200px;
			}

			&:hover {
				color: var(--color--text-invert);
				fill: var(--color--text-invert);
				filter: drop-shadow(0px 0px 3px var(--color--text-shadow));
			}
		}
	}
</style>
