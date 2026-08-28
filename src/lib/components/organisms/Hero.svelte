<script>
	import AppStores from '$lib/components/molecules/AppStores.svelte';
	import Sparkles from '$lib/components/atoms/Sparkles.svelte';
</script>

<section id="hero">
	<h1 class="hello">Practice, Learn, Succeed!</h1>
	<p class="pitch">
		Talk with people who speak the language you are learning — and are learning the language you
		speak.
	</p>
	<p class="intro">
		<span class="left">100% Open Source</span>
		<span class="right">Alternative to Tandem!</span>
	</p>
	<div class="ctas">
		<Sparkles>
			<AppStores />
		</Sparkles>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#hero {
		// The hero sits on the yellow wave in both themes, so its text colour is
		// fixed rather than themed — `--color--text` is white in dark mode and
		// disappears here.
		color: #000;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--space-xs);
		position: relative;
		padding: var(--space-2xl) 0 var(--space-xl);

		@include for-phone-only {
			padding: var(--space-xl) 0 var(--space-lg);
		}

		.hello {
			text-align: center;
		}

		.intro {
			font-weight: 500;
			font-size: 1.4rem;
			width: min(100%, 440px);
			display: flex;
			flex-direction: column;

			.left {
				text-align: left;
			}
			.right {
				text-align: right;
			}

			// Used to be `display: none` on phones, which dropped the brand's
			// strongest line on the screen most people arrive from. Centre it
			// instead.
			@include for-phone-only {
				font-size: 1.1rem;
				align-items: center;
				gap: 2px;

				.left,
				.right {
					text-align: center;
				}
			}
		}

		.pitch {
			max-width: 40ch;
			text-align: center;
			font-size: 1.1rem;
			color: rgba(0, 0, 0, 0.72);
			margin-bottom: var(--space-2xs);
		}

		.ctas {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			gap: var(--space-2xs);
			width: 100%;
			margin-top: var(--space-md);
		}
	}
</style>
