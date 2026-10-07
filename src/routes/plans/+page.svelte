<script lang="ts">
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import FAQ from '$lib/components/organisms/FAQ.svelte';
	import FinalCta from '$lib/components/organisms/FinalCta.svelte';
	import PhoneFrame from '$lib/components/phone/PhoneFrame.svelte';
	import PaywallScreen from '$lib/components/phone/PaywallScreen.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { reveal } from '$lib/utils/reveal';
	import { inview } from '$lib/utils/inview';
	import { siteBaseUrl } from '$lib/data/meta';
	import { plans, planNotes, limits, freeProWays, freeProNote } from '$lib/data/plans';
	import { echo } from '$lib/data/echo';
	import type { FaqObject } from '$lib/data/faq';

	/** One stroke icon per plan, in the plan's own tone. */
	const ICONS: Record<string, string> = { Free: 'chat', Pro: 'zap' };
	const TONES = ['free', 'pro'];

	/** What every plan keeps, said once above the cards. */
	const always = [
		{ icon: 'check', value: 'Unlimited', label: 'replies and corrections' },
		{ icon: 'feed', value: 'Free', label: `Echo packs, in ${echo.languages.length} languages` },
		{ icon: 'globe', value: '182', label: 'languages in the app' },
		{ icon: 'close', value: '0', label: 'ads, on any plan' }
	];

	const nf = new Intl.NumberFormat('en-US');
	/** A bar's share of its row: unlimited fills it, and nothing vanishes. */
	const share = (v: number | null, max: number) => (v === null ? 100 : Math.max((v / max) * 100, 5));
	const label = (row: (typeof limits)[number], i: number) =>
		row.shown ? row.shown[i] : row.values[i] === null ? 'Unlimited' : nf.format(row.values[i] ?? 0);
	const maxOf = (row: (typeof limits)[number]) =>
		Math.max(...row.values.map((v) => (v === null ? 0 : v)));

	/** The questions people ask before they pay, answered from plans.ts and PRODUCT.md. */
	const faq: FaqObject[] = [
		{
			id: 201,
			title: 'Do I have to pay to learn on LangX?',
			content: `No. Replying to anyone and correcting anyone are unlimited on the free plan, and Echo's packs are free too. What the free plan caps is how many conversations you can open a day (5) and how many translations you use (20), never how much you talk.`
		},
		{
			id: 202,
			title: 'What does Pro add?',
			content: `Everything in Free without the limits: unlimited new conversations, 1,000 translations a day, five languages you are learning and five you speak, gender and city filters, Nearby, a boosted profile above the Discover list, see who viewed your profile, browse incognito, write in your language and send in theirs, and export your saved phrases. LangX Copilot, private AI feedback, is coming later.`
		},
		{
			id: 203,
			title: 'What stays the same on both plans?',
			content: `Replies and corrections are unlimited, Echo's packs are free, there are no ads, and everyone gets the same fair-use ceiling of 500 photo, video and voice messages a day and 10 photos on their profile.`
		},
		{
			id: 204,
			title: 'How much do the plans cost?',
			content: `Prices are set per region and shown in the app. Pro is monthly or yearly, both with a one-week free trial, and yearly works out to 3 months free. This site does not print prices because they differ from country to country.`
		},
		{
			id: 205,
			title: 'Can tokens buy a plan?',
			content: `No, and they never will. <a href="/tokens">LangX Token</a> is an in-app point you earn by chatting and correcting; it buys frames, titles and sticker packs, not subscriptions.`
		},
		{
			id: 206,
			title: 'Can I cancel?',
			content: `Yes, any time, from the store account you bought it with. Corrections and replies stay unlimited whether you pay or not.`
		},
		{
			id: 207,
			title: 'Can I get Pro by inviting friends?',
			content: `Yes. Share your invite link from the app. Every 3 friends who join with it and have a real conversation with someone other than you give you 1 month of Pro, up to 3 months in a calendar year. Each invite also earns you <a href="/tokens">tokens</a>.`
		},
		{
			id: 208,
			title: 'Do I get anything for a long streak?',
			content: `Yes. A 100-day streak gives you 1 month of Pro, and a 365-day streak gives you 3 months. Each happens once, so a year-long streak adds up to 4 months. If your streak is already past 100 or 365 days, you get it the next time you practise.`
		},
		{
			id: 209,
			title: 'How do I use a gift code?',
			content: `Open the plans screen in the app and tap "Have a gift code?" under the button. Type the code — capitals don't matter — and Pro starts right away, for as many months as the code gives. Each code works once per person, and a code can run out or expire.`
		},
		{
			id: 210,
			title: 'Will free Pro charge me when it ends?',
			content: `No. Pro from an invite, a streak, a gift code or a gift from us never renews and never charges you. The app tells you a week before it ends, and again the day before. If you want to keep Pro after that, you can subscribe from the plans screen.`
		}
	];

	const stripTags = (html: string) => html.replace(/<[^>]+>/g, '');

	const ld = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteBaseUrl}/` },
					{ '@type': 'ListItem', position: 2, name: 'Plans' }
				]
			},
			{
				'@type': 'FAQPage',
				mainEntity: faq.map((q) => ({
					'@type': 'Question',
					name: q.title,
					acceptedAnswer: { '@type': 'Answer', text: stripTags(q.content) }
				}))
			}
		]
	};
</script>

<JsonLd data={ld} />

<!--
	The ask, then the two plans as pitches rather than records, then the
	limits as bars, then the questions. The app's own paywall plays beside the
	title; the long lists with their notes live in plans.ts and the FAQ.
-->
<div class="container">
	<section class="hero">
		<div
			class="copy"
			data-reveal-children
			use:reveal={{ children: true, onLoad: true, stagger: 0.1, y: 16 }}
		>
			<span class="eyebrow">Plans</span>
			<h1>Free is a real plan. Paying lifts the limits.</h1>
			<p class="lede">
				Replying and correcting are unlimited on every plan. Pro lifts the other
				limits — prices are set per region and shown in the app.
			</p>
			<div class="buttons" use:ownsPrimary>
				<Button href="https://get.langx.io" variant="primary" size="lg" block>Start for free</Button>
				<Button href="https://get.langx.io" variant="secondary" size="lg" block>
					I already have an account
				</Button>
			</div>
			<p class="fine">Monthly or yearly, with a one-week free trial, bought inside the app. Yearly is 3 months free.</p>
		</div>
		<div class="device" data-reveal use:reveal={{ onLoad: true, x: 40, y: 0, delay: 0.35 }}>
			<PhoneFrame
				label="The plans screen in the app: Pro's benefits, yearly or monthly"
				height="auto"
			>
				<PaywallScreen />
			</PhoneFrame>
		</div>
	</section>

	<dl class="always">
		{#each always as f}
			<div>
				<span class="fig-icon" aria-hidden="true"><UiIcon name={f.icon} size={20} /></span>
				<dt class="tabular">{f.value}</dt>
				<dd>{f.label}</dd>
			</div>
		{/each}
	</dl>

	<section class="plans" aria-labelledby="plans-title">
		<header class="head">
			<span class="eyebrow">Two plans</span>
			<h2 id="plans-title">Each one lists only what is new</h2>
			<p>Pro has everything in Free, without the limits.</p>
		</header>
		<div class="cards" data-reveal-children use:reveal={{ children: true, stagger: 0.1 }}>
			{#each plans as plan, i}
				<article class="card {TONES[i]}">
					<span class="plan-icon" aria-hidden="true"><UiIcon name={ICONS[plan.name]} size={24} /></span>
					<h3>{plan.name}</h3>
					<p class="tagline">{plan.tagline}</p>
					<ul role="list">
						{#each plan.highlights as point}
							<li>
								<span class="tick" aria-hidden="true"
									><UiIcon name="check" size={16} strokeWidth={3} /></span
								>
								<span
									>{point.label}{#if point.pending}{' '}<span class="soon">Coming soon</span
										>{/if}</span
								>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</section>

	<section class="limits" aria-labelledby="limits-title" use:inview={{ threshold: 0.25 }}>
		<header class="head">
			<span class="eyebrow">The numbers</span>
			<h2 id="limits-title">The limits, side by side</h2>
			<p>A rolling 24 hours, not a calendar day. Only translation has a real per-request cost.</p>
		</header>
		<ul class="legend" role="list">
			{#each plans as plan, i}
				<li class={TONES[i]}><span class="swatch" aria-hidden="true"></span>{plan.name}</li>
			{/each}
		</ul>
		<ul class="rows" role="list">
			{#each limits as row, r}
				<li class="lrow">
					<span class="what">{row.label}</span>
					<div class="lanes" role="img" aria-label="{row.label}: {plans.map((p, i) => `${p.name} ${label(row, i)}`).join(', ')}">
						{#each row.values as v, i}
							<span class="lane {TONES[i]}">
								<span class="track"
									><span
										class="bar"
										style="width:{share(v, maxOf(row))}%;--d:{r * 90 + i * 60}ms"></span></span
								>
								<span class="val tabular">{label(row, i)}</span>
							</span>
						{/each}
					</div>
				</li>
			{/each}
		</ul>
		<p class="notes">{planNotes.join(' ')}</p>
	</section>

	<section class="free-pro" aria-labelledby="free-pro-title">
		<header class="head">
			<span class="eyebrow">Or don't pay</span>
			<h2 id="free-pro-title">Ways to get Pro free</h2>
			<p>Help LangX grow, or just keep showing up.</p>
		</header>
		<ul class="ways" role="list" data-reveal-children use:reveal={{ children: true, stagger: 0.1 }}>
			{#each freeProWays as way}
				<li>
					<span class="way-icon" aria-hidden="true"><UiIcon name={way.icon} size={22} /></span>
					<h3>{way.title}</h3>
					<p>{way.body}</p>
				</li>
			{/each}
		</ul>
		<p class="notes">{freeProNote}</p>
	</section>

	<FAQ items={faq} eyebrow="Questions" title="Before you pay" />

	<FinalCta title="Start free. Go further when you want to." />
</div>

<style lang="scss">
	@use '$lib/scss/breakpoints' as *;

	// Copy on the left, the app's own plans screen on the right; on a phone
	// the copy leads and the device follows.
	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: center;
		gap: var(--space-xl);
		padding: var(--space-2xl) 0 var(--space-xl);

		@include for-tablet-landscape-up {
			grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
			min-height: min(calc(100dvh - 64px), 820px);
		}

		@include for-phone-only {
			padding: var(--space-xl) 0 var(--space-lg);
		}
	}

	.copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-sm);

		h1 {
			margin: 0;
			max-width: 18ch;
			font-size: clamp(1.9rem, 1.3rem + 2.2vw, 2.75rem);
			line-height: 1.15;
			letter-spacing: -0.02em;
		}

		.lede {
			margin: 0;
			font-size: 1.0625rem;
			line-height: 1.65;
			max-width: 48ch;
		}
	}

	.buttons {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		max-width: 330px;
		margin-top: var(--space-2xs);
	}

	.fine {
		margin: 0;
		max-width: 34ch;
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--color--text-shade);
	}

	.device {
		display: flex;
		justify-content: center;
		--phone-zoom: 0.66;

		@include for-tablet-portrait-down {
			justify-content: flex-start;
			--phone-zoom: 0.7;
		}

		@include for-phone-only {
			--phone-zoom: 0.66;
		}
	}

	// Hairlines and figures: what every plan keeps, between two lines.
	.always {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		border-top: 1px solid var(--color--border);
		border-bottom: 1px solid var(--color--border);
		margin: 0;

		> div {
			display: flex;
			flex-direction: column;
			gap: 4px;
			padding: var(--space-md) var(--space-md) var(--space-md) 0;

			+ div {
				border-left: 1px solid var(--color--border);
				padding-left: var(--space-md);
			}
		}

		.fig-icon {
			display: inline-flex;
			color: var(--color--text-quiet);
			margin-bottom: 4px;
		}

		dt {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.5rem, 1.1rem + 1.4vw, 2.125rem);
			line-height: 1.1;
			letter-spacing: -0.02em;
		}

		dd {
			margin: 0;
			font-size: 0.8125rem;
			line-height: 1.4;
			color: var(--color--text-quiet);
			max-width: 22ch;
		}

		@include for-tablet-portrait-down {
			grid-template-columns: repeat(2, minmax(0, 1fr));

			> div {
				padding: var(--space-sm) var(--space-sm) var(--space-sm) 0;

				+ div {
					border-left: 0;
					padding-left: 0;
				}

				&:nth-child(even) {
					border-left: 1px solid var(--color--border);
					padding-left: var(--space-sm);
				}

				&:nth-child(n + 3) {
					border-top: 1px solid var(--color--border);
				}
			}
		}
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: 12px;
		max-width: 60ch;

		h2 {
			margin: 0;
			font-weight: 900;
			font-size: clamp(1.625rem, 3vw, 2.125rem);
			line-height: 1.15;
		}

		p {
			margin: 0;
			font-size: 1.0625rem;
			line-height: 1.6;
			color: var(--color--text-shade);
		}
	}

	.plans {
		padding: var(--space-2xl) 0 0;

		@include for-phone-only {
			padding-top: var(--space-xl);
		}
	}

	.cards {
		margin-top: var(--space-lg);
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 24px;
	}

	// The card's edge and voice follow the plan: hairline for Free, blue for
	// Pro — the homepage's cards, five lines each.
	.free {
		--edge: var(--color--border);
		--tone: var(--color--text);
		--fill: var(--color--muted);
	}
	.pro {
		--edge: var(--color--accent);
		--tone: var(--color--accent-shade);
		--fill: var(--color--accent-tint);
	}

	.card {
		border: 2px solid var(--edge);
		border-radius: var(--radius-xl);
		padding: 28px;
		background: var(--color--surface);
		display: flex;
		flex-direction: column;
		gap: 8px;

		.plan-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 44px;
			height: 44px;
			border-radius: var(--radius-md);
			background: var(--fill);
			color: var(--tone);
			margin-bottom: 8px;
		}

		h3 {
			margin: 0;
			font-weight: 900;
			font-size: 1.375rem;
			color: var(--tone);
		}

		.tagline {
			margin: 0 0 8px;
			font-size: 0.9375rem;
			line-height: 1.5;
			color: var(--color--text-shade);
		}

		ul {
			margin: 0;
			padding: 0;
			list-style: none;
			border-top: 1px solid var(--color--border);
		}

		li {
			display: flex;
			align-items: flex-start;
			gap: 10px;
			margin: 0;
			padding: 11px 0;
			border-bottom: 1px solid var(--color--border);
			font-size: 0.9375rem;
			line-height: 1.5;
		}

		// Blue checks, as in the plan rows; green is kept for corrections.
		.tick {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 20px;
			height: 20px;
			margin-top: 2px;
			border-radius: 50%;
			background: var(--color--accent-tint);
			color: var(--color--accent);
			flex: 0 0 auto;
		}
	}

	.soon {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color--text-shade);
		border: 1px solid var(--color--border);
		border-radius: var(--radius-pill);
		padding: 2px 8px;
		// A real space comes before the badge, so the label and the badge read
		// as two words. The space is about 4px; this makes up the 6px gap.
		margin-left: 2px;
		white-space: nowrap;
	}

	.limits {
		border-top: 1px solid var(--color--border);
		margin-top: var(--space-2xl);
		padding: var(--space-2xl) 0 0;

		@include for-phone-only {
			margin-top: var(--space-xl);
			padding-top: var(--space-xl);
		}
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
		margin: var(--space-md) 0 0;
		padding: 0;
		list-style: none;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color--text-shade);

		li {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			margin: 0;
		}
	}

	.swatch {
		width: 12px;
		height: 12px;
		border-radius: 4px;
		background: var(--bar);
	}

	// One colour per plan on the bars: the free plan in the quiet grey, Pro
	// in blue — the same two as the card edges above.
	.free {
		--bar: var(--color--text-tertiary);
	}
	.pro {
		--bar: var(--color--accent);
	}

	.rows {
		margin: var(--space-sm) 0 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--color--border);
	}

	.lrow {
		display: grid;
		grid-template-columns: minmax(11rem, 15rem) minmax(0, 1fr);
		gap: 8px 24px;
		align-items: center;
		padding: 16px 0;
		border-bottom: 1px solid var(--color--border);
		margin: 0;

		// This list is closed at both ends, so the last row keeps its hairline.
		// The global .rows rule drops it, and under Svelte 5 a plain scoped
		// selector no longer outweighs that rule.
		.rows > &:last-child {
			border-bottom: 1px solid var(--color--border);
		}

		@include for-phone-only {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.what {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1rem;
		line-height: 1.3;
	}

	.lanes {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.lane {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 5.5rem;
		align-items: center;
		gap: 10px;
	}

	.track {
		display: block;
		min-width: 0;
	}

	.bar {
		display: block;
		height: 12px;
		border-radius: 0 4px 4px 0;
		background: var(--bar);
		transform-origin: left;
		transition: transform 600ms var(--ease-out) var(--d);
	}

	.val {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color--text);
		white-space: nowrap;
	}

	// The bars grow from the left once the rows are looked at — only where
	// script runs; without it they are simply there. Svelte 4 cannot scope a
	// class inside :not(), and left `:not(:global(.is-in))` in the output as
	// is, which no browser parses; so the section's state is matched
	// globally and only the bar keeps its scoped class.
	:global(html:not(.no-js) .limits:not(.is-in)) .bar {
		transform: scaleX(0);
	}

	.notes {
		margin: 20px 0 0;
		max-width: 70ch;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color--text-quiet);
	}

	// Three ways to Pro without paying, between hairlines like the figures
	// at the top: the page is about the plans, so this stays quieter than
	// the cards.
	.free-pro {
		border-top: 1px solid var(--color--border);
		margin-top: var(--space-2xl);
		padding: var(--space-2xl) 0 0;

		@include for-phone-only {
			margin-top: var(--space-xl);
			padding-top: var(--space-xl);
		}
	}

	.ways {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 24px;
		margin: var(--space-lg) 0 0;
		padding: 0;
		list-style: none;

		li {
			display: flex;
			flex-direction: column;
			gap: 8px;
			margin: 0;
			padding: 24px;
			border: 1px solid var(--color--border);
			border-radius: var(--radius-xl);
			background: var(--color--surface);
		}

		.way-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 40px;
			height: 40px;
			border-radius: var(--radius-md);
			background: var(--color--accent-tint);
			color: var(--color--accent-shade);
			margin-bottom: 4px;
		}

		h3 {
			margin: 0;
			font-weight: 900;
			font-size: 1.125rem;
		}

		p {
			margin: 0;
			font-size: 0.9375rem;
			line-height: 1.5;
			color: var(--color--text-shade);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bar {
			transition: none;
		}

		:global(html:not(.no-js) .limits:not(.is-in)) .bar {
			transform: none;
		}
	}
</style>
