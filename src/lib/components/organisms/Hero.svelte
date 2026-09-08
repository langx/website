<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import PhoneFrame from '$lib/components/phone/PhoneFrame.svelte';
	import ChatScreen from '$lib/components/phone/ChatScreen.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { reveal } from '$lib/utils/reveal';
</script>

<!--
	The app itself, first thing: a real chat playing its four beats on the left
	and the ask on the right. The copy plays in line by line on load; the phone
	follows from its own side, and the chat replays every eight seconds.
-->
<section id="hero" class="hero">
	<div class="device" data-reveal use:reveal={{ onLoad: true, x: -40, y: 0, delay: 0.35 }}>
		<PhoneFrame label="A LangX chat: two messages arrive, then a correction">
			<ChatScreen loop />
		</PhoneFrame>
	</div>

	<div
		class="copy"
		data-reveal-children
		use:reveal={{ children: true, onLoad: true, stagger: 0.12 }}
	>
		<h1>The friendly way to practise a language with real people</h1>
		<div class="buttons" use:ownsPrimary>
			<Button href="https://get.langx.io" variant="primary" size="lg" block>Start for free</Button>
			<Button href="https://get.langx.io" variant="secondary" size="lg" block>
				I already have an account
			</Button>
		</div>
		<p class="fine">
			Chat with someone who speaks your target language and is learning yours. Free, open source, no
			ads.
		</p>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		align-items: center;
		gap: var(--space-xl);
		min-height: min(calc(100dvh - 64px), 900px);
		padding: var(--space-xl) 0 var(--space-2xl);

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
			min-height: 0;
			gap: var(--space-2xl);
			padding: var(--space-lg) 0 var(--space-xl);
		}
	}

	.device {
		--phone-zoom: 0.78;
		display: flex;
		justify-content: center;

		@media (max-width: 1100px) {
			--phone-zoom: 0.7;
		}

		@include for-tablet-portrait-down {
			// The copy leads on one column; the phone follows it.
			order: 2;
			--phone-zoom: 0.72;
		}

		@include for-phone-only {
			--phone-zoom: 0.66;
		}
	}

	.copy {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-lg);
		text-align: center;
	}

	h1 {
		margin: 0;
		max-width: 18ch;
		font-weight: 800;
		font-size: clamp(1.9rem, 1.3rem + 2.2vw, 2.75rem);
		line-height: 1.15;
		letter-spacing: -0.02em;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		max-width: 330px;
	}

	.fine {
		margin: 0;
		max-width: 34ch;
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--color--text-shade);
	}
</style>
