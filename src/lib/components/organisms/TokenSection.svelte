<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import PhoneFrame from '$lib/components/phone/PhoneFrame.svelte';
	import WalletScreen from '$lib/components/phone/WalletScreen.svelte';
	import { tokenEarning } from '$lib/data/token';
	import { inview } from '$lib/utils/inview';

	/**
	 * The token, on the homepage: the wallet as the app draws it, and the two
	 * places to read further. It carries no yellow — the hero and the closing
	 * call own the page's two, and this section's job is to send people on.
	 */
</script>

<section id="token" class="token" use:inview={{ threshold: 0.3 }}>
	<div class="text">
		<h2>Earned, never bought</h2>
		<p class="lede">
			Every message you send and every sentence you correct earns points. You spend them on a streak
			freeze, a missed day, or something cosmetic — and on nothing else.
		</p>

		<ul class="rates" role="list">
			{#each tokenEarning as row}
				<li>
					<span class="k">{row.action}</span>
					<span class="v">{row.amount}</span>
				</li>
			{/each}
		</ul>

		<p class="not">
			They cannot be bought, sold, traded or withdrawn, they never unlock a paid plan, and there is
			no chain behind them.
		</p>

		<div class="buttons">
			<Button href="https://token.langx.io" variant="secondary" size="lg">
				Open token.langx.io
				<UiIcon slot="icon" name="external" size={18} />
			</Button>
			<Button href="/tokens" variant="ghost" size="lg">Every rule</Button>
		</div>
	</div>

	<div class="device">
		<PhoneFrame
			label="The wallet screen: a balance, the hourly gift, and what tokens buy"
			height="auto"
		>
			<WalletScreen />
		</PhoneFrame>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.token {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		align-items: center;
		gap: var(--space-xl);
		padding: var(--space-3xl) 0 var(--space-2xl);

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
			gap: var(--space-lg);
			padding: var(--space-2xl) 0 var(--space-xl);
		}
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		max-width: 44ch;

		h2 {
			margin: 0;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			line-height: 1.15;
			letter-spacing: -0.015em;
		}
	}

	.lede {
		margin: 0;
		font-size: 1.125rem;
		line-height: 1.6;
		color: var(--color--text-shade);
	}

	// The app's list grammar: one hairline row per way of earning, the number
	// on the right in Nunito. Never green — green belongs to corrections.
	.rates {
		margin: var(--space-2xs) 0 0;
		border-top: 1px solid var(--color--border);

		li {
			display: flex;
			align-items: baseline;
			justify-content: space-between;
			gap: var(--space-md);
			padding: 11px 0;
			border-bottom: 1px solid var(--color--border);
		}

		.k {
			font-size: 0.9375rem;
		}

		.v {
			flex: 0 0 auto;
			font-family: var(--font--title);
			font-weight: 800;
			font-variant-numeric: tabular-nums;
		}
	}

	.not {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--color--text-quiet);
	}

	.buttons {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-top: var(--space-2xs);
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

	// The text rises, the phone follows in from its own side — the same beat
	// the chapters above it keep.
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

	:global(.token.is-in) .text,
	:global(.token.is-in) .device {
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
