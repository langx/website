<script lang="ts">
	import { legacyTokenDivisor, welcomeBackBonus } from '$lib/data/token';
	import AppStores from '$lib/components/molecules/AppStores.svelte';
	import PhoneFrame from '$lib/components/phone/PhoneFrame.svelte';
	import WelcomeBackScreen from '$lib/components/phone/WelcomeBackScreen.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
</script>

<section id="welcome-back" class="welcome">
	<div class="blocks">
		<article class="block">
			<h2>You have to sign up again</h2>
			<p>
				Use the same email address you used before. The old password hashes could not be carried
				over, so there is no way to keep your old password, but everything attached to that email is
				waiting for you once it is verified.
			</p>
		</article>

		<article class="block">
			<h2>Your username is reserved</h2>
			<p>
				Nobody else can take it. Sign up with your old email, verify it, and the app offers your
				handle back to you during onboarding, along with the profile details it can pre-fill.
			</p>
		</article>

		<article class="block">
			<h2>Your token balance carries over, divided by {legacyTokenDivisor}</h2>
			<p>
				Nothing in v1 was ever bought or sold. What looked like a purchase log was a daily payout
				calculation, so every balance was earned, and there is no reason not to honour it.
			</p>
			<p>
				It is credited at <strong>1:{legacyTokenDivisor}</strong>, and we would rather say that
				plainly than let you find it out afterwards. The two economies were never on the same scale:
				v1 balances run up to 2.28 million, while a very active day in v2 is around 700 tokens.
				Credited one-for-one, the largest v1 balance would sit roughly nine years ahead of anyone
				new and the all-time leaderboard would never move again. Divided, it starts about 32 days
				ahead, a real head start that someone can actually close.
			</p>
			<p>
				If your old balance was under {legacyTokenDivisor}, it converts to nothing. That is the
				honest consequence of the ratio, and it is why there is also a flat
				<strong>{welcomeBackBonus}-token</strong> welcome-back bonus when your profile is restored.
			</p>
		</article>

		<article class="block">
			<h2>Your streak comes back with you</h2>
			<p>
				Whatever streak you had is restored the moment your profile is — alive, and counting today —
				rather than quietly resetting to zero on the day you come back. It costs nothing: you built
				those days here, under the same name.
			</p>
		</article>

		<article class="block warning">
			<h2>Some things that were free are now paid</h2>
			<p>
				v1 said LangX was free with no in-app purchases. v2 has paid plans, and three things you
				used to get for free moved into them:
			</p>
			<ul>
				<li>Filtering discovery by gender and city. Country, age and level stay free.</li>
				<li>Seeing <em>who</em> viewed your profile. The count stays free.</li>
				<li>Browsing without leaving a trace.</li>
			</ul>
			<p>
				There are also two new limits on the free plan: 5 new conversations you start, and 20
				translations, each per rolling 24 hours.
			</p>
			<p>
				What does not change, and is worth saying in the same breath: <strong
					>replying to every message you get is unlimited</strong
				>, and so is writing corrections, on every plan. The free plan limits how many conversations
				you can open, never how much you can talk.
				<a href="/pro">The full comparison is here</a>.
			</p>
		</article>

		<article class="block">
			<h2>The token is the same name, and a different thing</h2>
			<p>
				v1 shipped LangX Token wrapped in wallets, a token leaderboard and a litepaper describing
				something tradable and eventually listed. <strong
					>The name stays. The trading does not.</strong
				>
				In v2 it is an in-app point: earned by practising and teaching, spent on a streak freeze and
				cosmetics, and nothing else. The on-chain design in the old litepaper is not being built.
			</p>
		</article>

		<article class="block">
			<h2>What is missing in the first release</h2>
			<p>
				Badges are not in v2's first release and are planned to return in a later one. LangX Copilot
				is a later release too. We would rather list this than let you find the gap yourself.
			</p>
		</article>

		<div class="cta" use:ownsPrimary>
			<AppStores primary size="lg" />
		</div>
	</div>

	<div class="device">
		<div class="sticky">
			<PhoneFrame
				label="The welcome-back screen: your handle, imported conversations, converted tokens and a frozen streak"
			>
				<WelcomeBackScreen />
			</PhoneFrame>
		</div>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.welcome {
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

		ul {
			padding-left: 1.2em;
			list-style: disc;
			display: flex;
			flex-direction: column;
			gap: var(--space-3xs);
		}
	}

	// The one section a returning user is most likely to feel let down by is a
	// tinted block, the way the app marks a warning, so it cannot be skimmed past.
	.warning {
		background: var(--color--callout-background--warning);
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

		a {
			font-weight: 700;
		}
	}

	.cta {
		padding: var(--space-md) 0 0;
	}

	.device {
		--phone-zoom: 0.8;
		display: flex;
		justify-content: center;

		@include for-tablet-portrait-down {
			justify-content: flex-start;
			--phone-zoom: 0.72;
		}

		@include for-phone-only {
			--phone-zoom: 0.66;
		}
	}

	.sticky {
		position: sticky;
		top: calc(var(--header-height) + 24px);

		@include for-tablet-portrait-down {
			position: static;
		}
	}
</style>
