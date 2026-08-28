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
			No lessons and no homework — just real conversations with someone who needs exactly what you
			can offer. You correct their sentences, they correct yours.
		</p>
		<p>
			<strong>Free to use. Always.</strong> Reply to every message you get, with no limits, and
			correct as many as you like. <a class="text" href="/pro">LangX Pro</a> adds filters, unlimited
			translation, and the ability to start as many new conversations as you want; Pro+ adds LangX Copilot
			and Nearby on top.
		</p>
		<p>
			The app and the API are <strong>open source</strong>, and you can host your own.
			<SparklingHighlight>
				<a
					href="https://github.com/langx"
					target="_blank"
					rel="noopener noreferrer"
					title="See our GitHub organisation"
				>
					<GitHubIcon />
				</a>
			</SparklingHighlight>
		</p>
	</div>
	<div class="image">
		<Image src="/images/app-preview.gif" alt="LangX chat, discovery and profile screens" />
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#about {
		position: relative;
		display: grid;
		// Was `500px 400px`, which stopped being centred the moment the viewport
		// was not exactly 1080px wide.
		grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
		gap: var(--space-2xl);
		align-items: center;
		justify-content: space-between;
		padding-bottom: var(--space-xl);

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

		// .socials {
		// 	display: flex;
		// 	align-items: center;
		// 	gap: 15px;

		// 	@include for-phone-only {
		// 		justify-content: center;
		// 		margin-bottom: 10px;
		// 		span {
		// 			display: none;
		// 		}
		// 	}
		// }

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

	// .github {
	// 	margin-left: 5px;
	// }

	a:not(.text) {
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
