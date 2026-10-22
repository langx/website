<script lang="ts">
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import Block from '$lib/components/atoms/Block.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import FAQ from '$lib/components/organisms/FAQ.svelte';
	import FinalCta from '$lib/components/organisms/FinalCta.svelte';
	import Chapter from '$lib/components/home/Chapter.svelte';
	import Phone from '$lib/components/phone/Phone.svelte';
	import TodayScreen from '$lib/components/phone/TodayScreen.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { rise } from '$lib/utils/rise';
	import { siteBaseUrl } from '$lib/data/meta';
	import { compareRows, freeCard, proCard } from '$lib/data/plans';
	import { PRO_PRICE } from '$lib/data/prices';
	import type { FaqObject } from '$lib/data/faq';

	const P = PRO_PRICE;

	/** Three things people want settled before they pay. */
	const facts = [
		{
			title: 'Cancel anytime.',
			body: 'In the App Store, Google Play or your account on the web. Pro runs to the end of the period you paid for.'
		},
		{
			title: 'Prices in your currency.',
			body: 'Prices here are in US dollars. Your store shows its own price before you pay.'
		},
		{
			title: 'Free stays useful.',
			body: 'Replies and corrections are free on every plan, and no plan shows ads.'
		}
	];

	/** The questions people ask before they pay, answered from plans.ts and PRODUCT.md. */
	const faq: FaqObject[] = [
		{
			id: 211,
			title: 'What happens when my free week ends?',
			content: `Your plan starts and you are charged for the period you chose. Cancel before the week is over and you are not charged. Your chats and Echo cards stay either way. The free week comes with the yearly plan, for people who have not had Pro before.`
		},
		{
			id: 201,
			title: 'Do I have to pay to learn on LangX?',
			content: `No. Replying to anyone and correcting anyone are unlimited on the free plan, and Echo's packs are free too. What the free plan caps is how many conversations you can open a day (5) and how many translations you use (20), never how much you talk.`
		},
		{
			id: 202,
			title: 'What does Pro add?',
			content: `Everything in Free without the limits: unlimited new conversations, unlimited translations, five languages you are learning and five you speak, gender and city filters, Nearby, a boosted profile above the Discover list, see who viewed your profile, browse incognito, write in your language and send in theirs, and export your saved phrases. LangX Copilot, private AI help in the chat, is in Pro as a beta, rolling out gradually, so it may not be on for your account yet.`
		},
		{
			id: 204,
			title: 'How much does Pro cost?',
			content: `In the US, ${P.monthly} a month or ${P.yearly} a year (${P.yearlyPerMonth} a month, ${P.yearlySaving}). The yearly plan starts with a free week for people who have not had Pro before; monthly starts straight away. Prices are set per region, so your store shows its own price, in your currency, before you pay.`
		},
		{
			id: 212,
			title: 'Can I switch between monthly and yearly?',
			content: `Yes, from wherever you subscribed: the App Store, Google Play or your account on the web.`
		},
		{
			id: 213,
			title: 'Does Pro work on my phone and on the web?',
			content: `Yes. Pro belongs to your LangX account, so it works on iPhone, Android and the web, wherever you bought it.`
		},
		{
			id: 205,
			title: 'What are tokens, and can they pay for Pro?',
			content: `<a href="/tokens">Tokens</a> are in-app points you earn by chatting and correcting. They buy streak freezes and cosmetics, never a plan, and they never will.`
		},
		{
			id: 207,
			title: 'Can I get Pro by inviting friends?',
			content: `Yes. Share your invite link from the app. Each friend who joins with it and has a real conversation with someone other than you gets 1 week of Pro, and so do you, up to 12 weeks in a calendar year for you. If you already pay for Pro, there's nothing to add, so this reward is skipped. Each invite also earns you <a href="/tokens">tokens</a>.`
		},
		{
			id: 208,
			title: 'Do I get anything for a long streak?',
			content: `Yes. A 7-day streak gives you 1 week of Pro, a 100-day streak gives you 1 month, and a 365-day streak gives you 3 months. Each happens once, so a year-long streak adds up to 4 months and a week. If your streak is already past 7, 100 or 365 days, you get it the next time you practise. If you already pay for Pro, there's nothing to add, so the reward is skipped.`
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
		},
		{
			id: 206,
			title: 'How do I cancel?',
			content: `Any time, from where you subscribed: the App Store, Google Play or your account on the web. Pro runs to the end of the period you paid for, and replies and corrections stay unlimited whether you pay or not.`
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

{#snippet tick()}
	<svg
		aria-hidden="true"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="3"
		stroke-linecap="round"
		stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg
	>
{/snippet}

<!--
	Words only on the sky block, so both prices are in the first viewport;
	then the two cards, what Pro changes, the streak week, three straight
	answers, the questions and the closing call.
-->
<Block hue="sky" pad="hero" labelledby="plans-title">
	<div class="hero">
		<Tag tone="ink">Plans</Tag>
		<h1 id="plans-title" class="display-hero">free to start. pro for more.</h1>
		<p>
			Talking, replying and correcting are free for everyone. Pro takes away the daily limits on new
			chats and translations.
		</p>
	</div>
</Block>

<div class="column">
	<section class="cards" aria-label="The two plans" use:rise>
		<article class="card free" data-rise>
			<h2>Free</h2>
			<p class="tagline">A real plan, not a trial.</p>
			<ul role="list">
				{#each freeCard as line}
					<li><span class="tick">{@render tick()}</span>{line}</li>
				{/each}
			</ul>
		</article>

		<article class="card pro" data-hue="blue" data-rise>
			<h2>Pro</h2>
			<p class="tagline">Everything in Free, without the daily limits.</p>
			<div class="options">
				<div class="option on">
					<span class="o-head"
						><span class="o-name">Yearly</span><span class="o-price"
							><strong>{P.yearly}</strong> / year</span
						></span
					>
					<span class="o-tags"
						><span class="badge">{P.yearlyPerMonth} a month</span><span class="badge save"
							>{P.yearlySaving}</span
						></span
					>
				</div>
				<div class="option">
					<span class="o-head"
						><span class="o-name">Monthly</span><span class="o-price"
							><strong>{P.monthly}</strong> / month</span
						></span
					>
					<span class="o-sub">Pay as you go.</span>
				</div>
			</div>
			<ul role="list">
				{#each proCard as line}
					<li><span class="tick">{@render tick()}</span>{line}</li>
				{/each}
			</ul>
			<div class="ask" use:ownsPrimary>
				<Button href="https://get.langx.io" size="lg" block>Start my free week</Button>
			</div>
			<p class="fine">{P.yearlyTrial}, then {P.yearly} a year. Cancel anytime.</p>
			<p class="fine small">
				The free week comes with the yearly plan, for people who have not had Pro before. In the
				app, you pay through the App Store or Google Play. Prices are in US dollars; your store
				shows yours.
			</p>
		</article>
	</section>

	<section class="compare" aria-labelledby="compare-title" use:rise>
		<div class="c-head" data-rise>
			<h2 id="compare-title" class="display-section">what pro changes.</h2>
			<p>The first four rows are the same on both plans. That is on purpose.</p>
		</div>
		<table data-rise>
			<caption class="sr-only">Free and Pro, per day unless it says otherwise</caption>
			<thead>
				<tr>
					<th scope="col"><span class="per">Per day, unless it says otherwise</span></th>
					<th scope="col">Free</th>
					<th scope="col" class="pro-col">Pro</th>
				</tr>
			</thead>
			<tbody>
				{#each compareRows as row}
					<tr>
						<th scope="row">{row.label}</th>
						{#each [row.free, row.pro] as cell, i}
							<td class:pro-col={i === 1}>
								{#if cell === true}
									<span class="yes" aria-label="Included">{@render tick()}</span>
								{:else if cell === false}
									<span class="no" aria-label="Not included">–</span>
								{:else}
									{cell}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</div>

<Chapter
	id="streak-week"
	hue="tangerine"
	tag="Streaks"
	title="practise a week, get a week."
	phoneSide="left"
	link={{ href: '/faq#streaks', label: 'How streaks work' }}
>
	<p>
		Talk on LangX seven days in a row and you get a week of Pro, once. No card, nothing to cancel.
	</p>
	{#snippet phone()}
		<Phone
			label="LangX app: a seven-day streak, and the week of Pro it earned"
			height={560}
			cut="phone"
			cutHeight={440}
		>
			<TodayScreen
				streak={7}
				hue="tangerine"
				todayDone
				reward={{
					title: 'A week of Pro is on',
					body: 'Your streak earned it. Pro runs for seven days, then you go back to Free.',
					action: 'Find someone new'
				}}
				rows={[{ who: 'marina', text: 'Estoy muy cansada hoy.' }]}
			/>
		</Phone>
	{/snippet}
</Chapter>

<div class="column">
	<ul class="facts" role="list" use:rise>
		{#each facts as f}
			<li data-rise>
				<h3>{f.title}</h3>
				<p>{f.body}</p>
			</li>
		{/each}
	</ul>

	<FAQ items={faq} title="questions." id="faq" />
</div>

<FinalCta bleed />

<style lang="scss">
	.hero {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;

		p {
			margin: 0;
			max-width: 560px;
			font-size: 1.1875rem;
			line-height: 1.47;
			font-weight: 500;
		}
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 64px;
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding: 40px 16px 64px;

		@media (min-width: 768px) {
			max-width: calc(var(--container-max) + 64px);
			padding: 72px 32px 96px;
			gap: 96px;
		}

		> :global(.faq) {
			padding-top: 0;
		}
	}

	.cards {
		display: grid;
		gap: 12px;
		align-items: start;

		@media (min-width: 900px) {
			grid-template-columns: 1fr 1fr;
			gap: 16px;
		}
	}

	// On a phone Pro comes first: it is what people open /plans for.
	.pro {
		@media (max-width: 899px) {
			order: -1;
		}
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 28px;
		border-radius: 32px;

		h2 {
			margin: 0;
			color: inherit;
			font-size: 2.25rem;
			line-height: 1.1;
		}

		ul {
			display: flex;
			flex-direction: column;
			gap: 10px;
			margin: 4px 0;
		}

		li {
			display: flex;
			align-items: flex-start;
			gap: 10px;
			font-weight: 600;
		}
	}

	.free {
		background: var(--color--muted);

		.tagline {
			color: var(--color--text-shade);
		}

		.tick {
			color: var(--color--success);
		}
	}

	.tagline {
		margin: -6px 0 0;
		font-weight: 600;
	}

	.tick {
		display: inline-flex;
		margin-top: 3px;
		flex: 0 0 auto;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.option {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 14px 16px;
		border-radius: 20px;
		box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.6);

		&.on {
			background: #ffffff;
			color: var(--color--ink);
			box-shadow: none;
		}
	}

	.o-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}

	.o-name {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.125rem;
	}

	.o-price strong {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.375rem;
	}

	.o-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.badge {
		padding: 3px 10px;
		border-radius: 999px;
		background: #e3ebfe;
		color: #1f3fa8;
		font-size: 0.8125rem;
		font-weight: 800;
	}

	.save {
		background: #e2f6ee;
		color: #0b7a3e;
	}

	.o-sub {
		font-size: 0.875rem;
		font-weight: 600;
	}

	.ask {
		margin-top: 4px;
	}

	.fine {
		margin: 0;
		font-weight: 700;
		font-size: 0.9375rem;

		&.small {
			font-weight: 500;
			font-size: 0.8125rem;
			line-height: 1.45;
		}
	}

	.compare {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.c-head {
		display: flex;
		flex-direction: column;
		gap: 10px;

		p {
			margin: 0;
			color: var(--color--text-shade);
		}
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 1rem;
	}

	th,
	td {
		padding: 14px 8px;
		border-bottom: 1px solid var(--color--border);
		text-align: left;
		vertical-align: middle;
	}

	thead th {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.125rem;
	}

	.per {
		font-family: var(--font--default);
		font-weight: 500;
		font-size: 0.875rem;
		color: var(--color--text-shade);
	}

	tbody th {
		font-weight: 700;
	}

	td {
		width: 26%;
		font-weight: 600;

		@media (min-width: 900px) {
			width: 22%;
		}
	}

	.pro-col {
		font-weight: 900;
		color: var(--color--accent);
	}

	.yes {
		display: inline-flex;
		width: 26px;
		height: 26px;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--color--blue);
		color: var(--color--on-blue);
	}

	.no {
		color: var(--color--text-shade);
	}

	.facts {
		display: grid;
		gap: 12px;

		@media (min-width: 900px) {
			grid-template-columns: repeat(3, 1fr);
		}

		li {
			padding: 22px;
			border-radius: 24px;
			background: var(--color--muted);
		}

		h3 {
			margin: 0 0 8px;
			font-weight: 900;
			font-size: 1.25rem;
		}

		p {
			margin: 0;
			color: var(--color--text-shade);
			font-size: 0.9375rem;
		}
	}
</style>
