<script lang="ts">
	import {
		legacyTokenDivisor,
		streakMilestones,
		tokenCaps,
		tokenEarning,
		tokenGift,
		tokenIsNot,
		tokenSinks,
		welcomeBackBonus
	} from '$lib/data/token';
	import AppStores from '$lib/components/molecules/AppStores.svelte';
	import PhoneFrame from '$lib/components/phone/PhoneFrame.svelte';
	import WalletScreen from '$lib/components/phone/WalletScreen.svelte';
	import { ownsPrimary } from '$lib/stores/cta';

	const money = new Intl.NumberFormat('en-GB');
</script>

<section id="tokens" class="tokens">
	<div class="blocks">
		<article class="block">
			<h2>A token is a point, and that is all</h2>
			<p>
				You earn it by using LangX the way it is meant to be used — talking to somebody and helping
				them — and you spend it on a streak freeze, a missed day, or something cosmetic. That is the
				whole loop. It is not a currency, it is not an investment, and there is nothing to buy.
			</p>
		</article>

		<article class="block">
			<h2>How you earn them</h2>
			<p>
				Teaching is weighted higher than talking, because it is the harder thing to ask of somebody.
			</p>
			<ul class="rows" role="list">
				{#each tokenEarning as row}
					<li>
						<span class="k">{row.action}</span>
						<span class="v">{row.amount}</span>
					</li>
				{/each}
			</ul>
		</article>

		<article class="block">
			<h2>The ceilings</h2>
			<p>They exist so that grinding does not beat taking part.</p>
			<ul>
				{#each tokenCaps as cap}
					<li>{cap}</li>
				{/each}
			</ul>
		</article>

		<article class="block">
			<h2>The hourly gift</h2>
			<p>{tokenGift.description}</p>
			<ul class="rows" role="list">
				<li>
					<span class="k">How often</span>
					<span class="v quiet">{tokenGift.every}</span>
				</li>
				<li>
					<span class="k">What is inside</span>
					<span class="v quiet">{tokenGift.range}</span>
				</li>
			</ul>
		</article>

		<article class="block">
			<h2>Streaks pay</h2>
			<p>
				Come back day after day and the milestones pay out. Nothing is deducted for missing one —
				the streak just stops, and a freeze is what rescues it.
			</p>
			<ul class="rows" role="list">
				{#each streakMilestones as m}
					<li>
						<span class="k">Day {money.format(m.day)}</span>
						<span class="v">+{money.format(m.bonus)}</span>
					</li>
				{/each}
			</ul>
		</article>

		<article class="block">
			<h2>What you can spend them on</h2>
			<ul class="sinks" role="list">
				{#each tokenSinks as sink}
					<li>
						<div class="sink-head">
							<span class="k">{sink.name}</span>
							<span class="v">{sink.price}</span>
						</div>
						<p>{sink.description}</p>
					</li>
				{/each}
			</ul>
		</article>

		<article class="block callout">
			<h2>What a token is not</h2>
			<p>
				v1 shipped LangX Token wrapped in wallets, a token leaderboard and a litepaper describing
				something tradable and eventually listed. <strong
					>The name stays. The trading does not.</strong
				> Every line below is a promise, not a disclaimer:
			</p>
			<ul>
				{#each tokenIsNot as line}
					<li>{line}</li>
				{/each}
			</ul>
		</article>

		<article class="block">
			<h2>If you had a balance in v1</h2>
			<p>
				It carries over, credited at <strong>1:{legacyTokenDivisor}</strong>, plus a flat
				<strong>{welcomeBackBonus}-token</strong> welcome-back bonus once your profile is restored.
				The two economies were never on the same scale, and dividing is what keeps the leaderboard
				something a new person can still climb.
				<a href="/welcome-back">The reasoning is on the welcome-back page</a>.
			</p>
		</article>

		<article class="block">
			<h2>These are starting values</h2>
			<p>
				Every number here is marked as a starting value in the app's own source, and is expected to
				move once there is real activity data to set it against. We would rather show them now and
				change them in the open than wait until they are final, because they may never be. This page
				moves when they do.
			</p>
		</article>

		<div class="cta" use:ownsPrimary>
			<AppStores primary size="lg" />
		</div>
	</div>

	<!--
		The wallet as the app draws it, beside the rules it enforces. It animates
		nothing and hides nothing, so it survives this page shipping no JavaScript.
	-->
	<div class="aside">
		<div class="sticky">
			<PhoneFrame
				label="The wallet screen: a balance, the hourly gift, and what tokens can be spent on"
				height="auto"
			>
				<WalletScreen />
			</PhoneFrame>
		</div>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.tokens {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
		gap: var(--space-2xl);
		align-items: start;
		padding-bottom: var(--space-2xl);

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
			gap: var(--space-xl);
		}
	}

	.blocks {
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--color--border);
	}

	.block {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		max-width: 66ch;
		padding: var(--space-lg) 0;
		border-bottom: 1px solid var(--color--border);

		h2 {
			font-size: 1.5rem;
		}

		p,
		ul {
			margin: 0;
			font-size: 1rem;
			line-height: 1.6;
			color: var(--color--text-shade);
		}

		strong {
			color: var(--color--text);
		}

		ul:not(.rows):not(.sinks) {
			padding-left: 1.2em;
			list-style: disc;
			display: flex;
			flex-direction: column;
			gap: var(--space-2xs);
		}
	}

	// The app's own idiom: a hairline row per rule, the number on the right in
	// Nunito. Never green — green belongs to corrections.
	.rows {
		margin-top: var(--space-2xs);
		border-top: 1px solid var(--color--border);

		li {
			display: flex;
			align-items: baseline;
			justify-content: space-between;
			gap: var(--space-md);
			padding: 12px 0;
			border-bottom: 1px solid var(--color--border);
		}

		.k {
			color: var(--color--text);
		}

		.v {
			flex: 0 0 auto;
			font-family: var(--font--title);
			font-weight: 800;
			font-variant-numeric: tabular-nums;
			color: var(--color--text);

			&.quiet {
				font-family: inherit;
				font-weight: 600;
				color: var(--color--text-shade);
			}
		}
	}

	.sinks {
		margin-top: var(--space-2xs);
		border-top: 1px solid var(--color--border);
		display: flex;
		flex-direction: column;

		li {
			padding: 14px 0;
			border-bottom: 1px solid var(--color--border);
		}

		p {
			margin-top: 2px;
			font-size: 0.9375rem;
		}
	}

	.sink-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-md);

		.k {
			font-size: 1.0625rem;
			font-weight: 600;
			color: var(--color--text);
		}

		.v {
			flex: 0 0 auto;
			font-family: var(--font--title);
			font-weight: 800;
			font-variant-numeric: tabular-nums;
			color: var(--color--text);
		}
	}

	// The one block a reader arriving from the old litepaper needs to not skim
	// past, tinted the way the app marks something it wants read.
	.callout {
		background: var(--color--callout-background--info);
		border-radius: var(--radius-lg);
		padding: var(--space-md);
		margin: var(--space-md) 0;
		border-bottom: 0;
		max-width: none;

		p,
		ul,
		li {
			color: var(--color--text);
		}
	}

	.cta {
		padding: var(--space-md) 0 0;
	}

	.aside {
		display: flex;
		justify-content: center;
	}

	.sticky {
		--phone-zoom: 0.72;
		position: sticky;
		top: calc(var(--header-height) + 24px);
		display: flex;
		justify-content: center;

		@include for-tablet-portrait-down {
			position: static;
		}
	}
</style>
