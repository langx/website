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
		<Image src="images/features/ios.png" alt="Apple App Store"></Image>
	</a>
	<a
		href="https://play.google.com/store/apps/details?id=tech.newchapter.languageXchange"
		target="_blank"
		rel="noopener noreferrer"
		title="Download the app from Google Play Store"
	>
		<Image src="images/features/android.png" alt="Google Play Store"></Image>
	</a>
</div>

<style lang="scss">
	@import '../../scss/breakpoints.scss';
	.app-stores {
		display: flex;
		align-items: center;
		gap: 20px;

		a {
			transition: all 0.2s ease-in-out;
			width: 200px;
			color: var(--color--text);
			fill: var(--color--text);

			&:hover {
				color: var(--color--primary);
				fill: var(--color--primary);
				filter: drop-shadow(0px 0px 3px var(--color--primary));
			}
		}
	}
</style>
