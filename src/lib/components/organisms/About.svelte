<script>
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';
	import Socials from '$lib/components/molecules/Socials.svelte';
	import Image from '../atoms/Image.svelte';
</script>

<section id="about">
	<div class="info">
		<h2>
			<SparklingHighlight color="secondary"
				>Language learning is a rewarding journey!</SparklingHighlight
			>
		</h2>
		<p>
			We connect language learners worldwide. Practice and immerse yourself in different languages.
		</p>
		<p>
			Engage with native speakers for an authentic learning experience. Start your language
			adventure with us!
		</p>
		<div class="socials">
			<span>Follow us:</span>
			<Socials />
		</div>
	</div>
	<div class="image">
		<Image src="/images/sample-image.png" alt="Sample for the static template" />
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#about {
		position: relative;
		display: grid;
		grid-template-columns: 500px 400px;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 50px;

		@include for-phone-only {
			grid-template-columns: 1fr;
			justify-items: center;
			gap: 20px;
		}

		.info {
			display: flex;
			flex-direction: column;
			gap: 10px;
			h2 {
				@include for-phone-only {
					text-align: center;
				}
			}

			p {
				@include for-phone-only {
					text-align: justify;
				}
			}

			@include for-phone-only {
				gap: 20px;
			}
		}

		.socials {
			display: flex;
			align-items: center;
			gap: 15px;

			@include for-phone-only {
				justify-content: center;
				margin-bottom: 10px;
				span {
					display: none;
				}
			}
		}

		.image {
			width: 100%;
			height: 100%;

			@include for-phone-only {
				width: 80%;
			}
		}
	}

	p {
		font-size: 1.2em;
	}
</style>
