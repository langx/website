<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import { reveal } from '$lib/utils/reveal';
</script>

<section class="final" data-reveal use:reveal={{ y: 30, scale: 0.96 }}>
	<div class="box">
		<h2>Someone out there is learning your language.</h2>
		<Button href="https://app.langx.io" variant="dark" size="lg">Start for free</Button>
		<p>iOS · Android · Web</p>
	</div>
</section>

<style lang="scss">
	.final {
		max-width: 1060px;
		margin: 0 auto;
		padding: 0 0 110px;
	}

	.box {
		background: var(--color--primary);
		border-radius: 32px;
		padding: 70px 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 28px;
		text-align: center;
	}

	h2 {
		margin: 0;
		max-width: 22ch;
		font-weight: 900;
		font-size: clamp(1.9rem, 4.5vw, 3rem);
		line-height: 1.08;
		letter-spacing: -0.02em;
		color: var(--color--on-primary);
	}

	p {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--color--on-primary);
		opacity: 0.75;
	}
</style>
