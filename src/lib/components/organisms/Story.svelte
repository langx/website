<script lang="ts">
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import PhoneFrame from '$lib/components/phone/PhoneFrame.svelte';
	import DiscoverScreen from '$lib/components/phone/DiscoverScreen.svelte';
	import FeedScreen from '$lib/components/phone/FeedScreen.svelte';
	import MeScreen from '$lib/components/phone/MeScreen.svelte';
	import { inview } from '$lib/utils/inview';
</script>

<!--
	Four short chapters, one idea each, the phone on alternating sides. Each
	chapter plays once when it scrolls into view: the text rises, the phone
	slides in from its own side, and the screen inside does its one thing.
-->
<div id="how" class="story">
	<section class="chapter" use:inview={{ threshold: 0.3 }}>
		<div class="text">
			<h2>find your match.</h2>
			<p>
				You only see people who speak the language you're learning and are learning yours. Every
				chat helps both of you.
			</p>
		</div>
		<div class="device">
			<PhoneFrame label="Discover: people who speak Spanish and are learning English">
				<DiscoverScreen />
			</PhoneFrame>
		</div>
	</section>

	<section class="chapter flip" use:inview={{ threshold: 0.3 }}>
		<div class="text">
			<h2>correct each other.</h2>
			<p>
				Hold any message to fix it. Post a sentence and the community helps. Correcting is free and
				unlimited for everyone.
			</p>
		</div>
		<div class="device">
			<PhoneFrame label="Feed: sentences waiting for a correction">
				<FeedScreen />
			</PhoneFrame>
		</div>
	</section>

	<section class="chapter" use:inview={{ threshold: 0.3 }}>
		<div class="text">
			<h2>keep your streak.</h2>
			<p>
				Chat a little every day. Keep your streak alive, earn tokens for helping others, and watch
				your week fill up.
			</p>
		</div>
		<div class="device">
			<PhoneFrame label="Your profile: streak, corrections and this week's activity">
				<MeScreen />
			</PhoneFrame>
		</div>
	</section>

	<section class="chapter flip" use:inview={{ threshold: 0.3 }}>
		<div class="text">
			<h2>free to use.</h2>
			<p>
				Talking, replying and correcting never cost anything. You don't need to pay to learn a
				language here.
			</p>
		</div>
		<div class="device">
			<ul class="free" role="list">
				<li>
					<UiIcon name="check" size={22} strokeWidth={3} /><span>Reply to anyone, no limits</span>
				</li>
				<li>
					<UiIcon name="check" size={22} strokeWidth={3} /><span>Correct as much as you like</span>
				</li>
				<li>
					<UiIcon name="check" size={22} strokeWidth={3} /><span>Translate right in the chat</span>
				</li>
				<li><UiIcon name="check" size={22} strokeWidth={3} /><span>No ads, nothing sold</span></li>
			</ul>
		</div>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.story {
		display: flex;
		flex-direction: column;
	}

	.chapter {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		align-items: center;
		gap: var(--space-xl);
		padding: var(--space-2xl) 0;
		min-height: 560px;

		&.flip .text {
			order: 2;
		}

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
			gap: var(--space-lg);
			padding: var(--space-xl) 0;
			min-height: 0;

			&.flip .text {
				order: 0;
			}
		}
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		max-width: 40ch;

		h2 {
			font-size: clamp(2rem, 1.4rem + 2.4vw, 3rem);
			line-height: 1.05;
			letter-spacing: -0.02em;
			color: var(--color--accent);
		}

		p {
			margin: 0;
			font-size: 1.125rem;
			line-height: 1.6;
			color: var(--color--text-shade);
		}
	}

	// The free chapter has no screen to show; it shows the promise itself,
	// as four rows in the app's list grammar.
	.free {
		width: 100%;
		max-width: 390px;
		border-top: 1px solid var(--color--border);

		li {
			display: flex;
			align-items: center;
			gap: 14px;
			padding: 20px 4px;
			border-bottom: 1px solid var(--color--border);
			font-family: var(--font--title);
			font-size: 1.25rem;
			font-weight: 800;
			color: var(--color--text);

			:global(svg) {
				color: var(--color--success);
			}
		}
	}

	.device {
		--phone-zoom: 0.72;
		display: flex;
		justify-content: center;

		@include for-tablet-portrait-down {
			justify-content: flex-start;
			--phone-zoom: 0.7;
		}

		@include for-phone-only {
			--phone-zoom: 0.66;
		}
	}

	// The reveal: text rises 12px, the phone slides 40px in from its own side.
	// Ease-out from an already-visible offset, once, and nothing loops.
	.text,
	.device {
		opacity: 0;
		transition: opacity 500ms var(--ease-out), transform 600ms var(--ease-out);
	}

	.text {
		transform: translateY(12px);
	}

	.device {
		transform: translateX(40px);
		transition-delay: 80ms;
	}

	.flip .device {
		transform: translateX(-40px);
	}

	:global(.chapter.is-in) .text,
	:global(.chapter.is-in) .device {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.text,
		.device {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
