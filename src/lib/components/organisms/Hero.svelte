<script>
	import LoginIcon from '$lib/icons/login.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import Sparkles from '../atoms/Sparkles.svelte';
</script>

<section id="hero">
	<h1 class="hello">Practice, Learn, Succeed!</h1>
	<p class="intro">
		<span class="left">Words are the keys that unlock</span>
		<span class="right">a world of connections.</span>
	</p>
	<div class="ctas">
		<Sparkles>
			<Button href="https://cdn.forms-content-1.sg-form.com/0797bfc4-739c-11ee-b709-eeadebf91d66">
				<LoginIcon slot="icon" />
				Join Us
			</Button>
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
		}
	}
</style>
