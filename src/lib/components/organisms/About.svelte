<script>
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';
	import Image from '../atoms/Image.svelte';
	import GitHubIcon from '$lib/icons/socials/github.svelte';
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
		<p>
			Our platform is <strong>free and entirely open-source</strong>.
			<SparklingHighlight>
				<a
					href="https://github.com/langxapp"
					target="_blank"
					rel="noopener noreferrer"
					title="See my GitHub profile"
				>
					<GitHubIcon />
				</a>
			</SparklingHighlight>
		</p>
	</div>
	<div class="image">
		<Image src="/images/app-preview.gif" alt="Sample for the static template" />
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

	.github {
		margin-left: 5px;
	}

	a {
		transition: all 0.2s ease-in-out;
		width: 24px;
		height: 24px;
		display: inline-block;
		color: var(--color--text);
		fill: var(--color--text);

		&:hover {
			color: var(--color--primary);
			fill: var(--color--primary);
			filter: drop-shadow(0px 0px 3px var(--color--primary));
		}
	}
</style>
