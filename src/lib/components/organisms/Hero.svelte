<script>
	import AppStores from '$lib/components/molecules/AppStores.svelte';
	import Sparkles from '$lib/components/atoms/Sparkles.svelte';
</script>

<section id="hero">
	<h1 class="hello">Practice, Learn, Succeed!</h1>
	<p class="intro">
		<span class="left">Words are the keys that unlock</span>
		<span class="right">a world of connections.</span>
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
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 15px;
		position: relative;
		padding: 80px 0;

		@include for-phone-only {
			padding: 40px 0 50px;
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

			@include for-phone-only {
				display: none;
			}
		}

		.ctas {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			gap: 10px;
			width: 100%;
			margin-top: 30px;
		}
	}
</style>
