<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import BlogPostCard from '$lib/components/molecules/BlogPostCard.svelte';
	import FAQ from '$lib/components/organisms/FAQ.svelte';
	import FinalCta from '$lib/components/organisms/FinalCta.svelte';
	import PhoneFrame from '$lib/components/phone/PhoneFrame.svelte';
	import ChatScreen from '$lib/components/phone/ChatScreen.svelte';
	import DiscoverScreen from '$lib/components/phone/DiscoverScreen.svelte';
	import AppPicker from '$lib/components/compare/AppPicker.svelte';
	import CheckRows from '$lib/components/compare/CheckRows.svelte';
	import Cell from '$lib/components/compare/Cell.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { reveal } from '$lib/utils/reveal';
	import { inview } from '$lib/utils/inview';
	import { playStoreUrl, siteBaseUrl } from '$lib/data/meta';
	import { COMPETITORS, type Competitor } from '$lib/data/competitors';
	import { appIcon } from '$lib/data/app-icons';
	import { ADS, FREE, KINDS, KIND_LABEL, LANGX, PEOPLE } from '$lib/data/compare';
	import { reviews, ratingsLine } from '$lib/data/reviews';
	import { echo } from '$lib/data/echo';
	import type { FaqObject } from '$lib/data/faq';
	import type { BlogPost } from '$lib/utils/types';

	interface Props {
		data: { posts: BlogPost[] };
	}

	let { data }: Props = $props();
	let { posts } = $derived(data);
	// Roundups answer "which app?"; one-to-ones answer "this app or LangX?".
	let oneToOne = $derived(posts.filter((p) => p.slug.startsWith('open-source-alternative-to-')));
	let roundups = $derived(posts.filter((p) => !p.slug.startsWith('open-source-alternative-to-')));

	const title = 'LangX vs Tandem, HelloTalk, Duolingo and Other Language Apps';
	const description =
		'Open source alternative to Tandem, HelloTalk, Duolingo and more: honest one-to-one comparisons of LangX with every major language app, updated for 2026.';

	/** The three the title names, then everyone else still in the stores. */
	const others = COMPETITORS.filter((c) => c.status === 'active').length - 3;

	/**
	 * Headline numbers, each one from plans.ts or PRODUCT.md. Icons are in
	 * ink, not blue: nothing here is a control.
	 */
	const figures = [
		{ icon: 'check', value: 'Unlimited', label: 'corrections and replies, on every plan' },
		{ icon: 'chat', value: '5', label: 'new conversations a day, free' },
		{ icon: 'globe', value: '182', label: 'languages in the app' },
		{
			icon: 'feed',
			value: String(echo.packs),
			label: `free Echo packs to learn from, in ${echo.languages.length} languages`
		},
		{ icon: 'close', value: '0', label: 'ads, on any plan' }
	];

	const byKind = (kind: Competitor['kind']) =>
		COMPETITORS.filter((c) => c.kind === kind && c.status === 'active');

	/**
	 * The questions a visitor who is still deciding asks. Every answer is a
	 * fact from PRODUCT.md, plans.ts or the comparison posts; the ids stay
	 * clear of the homepage FAQ so a page can never carry two of the same.
	 */
	const faq: FaqObject[] = [
		{
			id: 101,
			title: 'Is LangX really free?',
			content: `Yes, and not as a trial. Replying to anyone and correcting anyone are unlimited for everyone. The free plan gives you 5 new conversations and 20 translations a day, with no ads. <a href="/plans">Fluent and Polyglot</a> lift those limits; prices are set per region and shown in the app.`
		},
		{
			id: 102,
			title: 'Is LangX better than Tandem or HelloTalk?',
			content: `It depends on what you want. Tandem and HelloTalk have far larger communities, live calls and group rooms. LangX matches in both directions, keeps corrections unlimited on every plan, shows no ads and is open source. For the biggest pool of partners they are the better choice; for a focused exchange whose code you can read, LangX is. The full write-ups: <a href="/open-source-alternative-to-tandem">LangX vs Tandem</a> and <a href="/open-source-alternative-to-hellotalk">LangX vs HelloTalk</a>.`
		},
		{
			id: 103,
			title: 'Can LangX replace Duolingo?',
			content: `Not as a course. Duolingo teaches along a lesson path; LangX is the conversation with a real person that a course leaves out. It does give you something to study alone: Echo, free packs of phrases in six languages that you review on a schedule, with the sentences from your own chats beside them. Plenty of people use one of each. See <a href="/social-alternative-to-duolingo">the social alternative to Duolingo</a>.`
		},
		{
			id: 107,
			title: 'Does LangX have courses, or only chat?',
			content: `Both. ${echo.what} There is no lesson path or grammar course; a partner's correction is the lesson.`
		},
		{
			id: 104,
			title: 'How is a language exchange different from an AI tutor?',
			content: `An AI tutor answers you. A partner on LangX is learning your language too, so the conversation is worth something to both of you, and a correction comes from someone who speaks the language every day. LangX Copilot, private AI feedback on your own messages, is coming later for Polyglot.`
		},
		{
			id: 105,
			title: 'Who makes LangX, and can I trust it?',
			content: `LangX is made by New Chapter Technology LLC and published under the BSD-3 licence: the app and its API are <a href="https://github.com/langx/langx" target="_blank" rel="noopener noreferrer">on GitHub</a> for anyone to read, check or run. There are no ads and nothing is sold. You must be 16 or older to use it.`
		},
		{
			id: 106,
			title: 'Where can I use it?',
			content: `On <a href="https://apps.apple.com/app/languagexchange/id6474187141" target="_blank" rel="noopener noreferrer">iPhone</a>, <a href="https://play.google.com/store/apps/details?id=tech.newchapter.languageXchange" target="_blank" rel="noopener noreferrer">Android</a> and in your <a href="https://app.langx.io" target="_blank" rel="noopener noreferrer">browser</a>. It is the same app everywhere.`
		}
	];

	const stripTags = (html: string) => html.replace(/<[^>]+>/g, '');

	let ld = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteBaseUrl}/` },
					{ '@type': 'ListItem', position: 2, name: 'Compare' }
				]
			},
			{
				'@type': 'ItemList',
				name: title,
				numberOfItems: posts.length,
				itemListElement: posts.map((p, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: p.title,
					url: `${siteBaseUrl}/${p.slug}`
				}))
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
	});
</script>

<Seo
	title="LangX vs Tandem, HelloTalk & Duolingo: Open Source Alternative"
	path="/compare"
	{description}
/>
<JsonLd data={ld} />

<!--
	The page most people arrive on from a search for another app. It asks
	first, then hooks: the ask beside a chat playing the one thing every
	comparison comes back to (a correction, from a person); the app they came
	from, head to head; the numbers as a picture; the reason in a chapter; and
	only then the map, the full matrix, the posts, the reviews and the
	questions, with the same ask at the end.
-->
<div class="container">
	<section class="hero">
		<div
			class="copy"
			data-reveal-children
			use:reveal={{ children: true, onLoad: true, stagger: 0.1, y: 16 }}
		>
			<span class="eyebrow">Compare</span>
			<h1>LangX vs Tandem, HelloTalk, Duolingo and {others} other language apps</h1>
			<p class="lede">
				The open source language exchange app, next to every app people compare it with — including
				where they are the better choice. Real people, unlimited corrections, free packs to learn
				from, and no ads.
			</p>
			<div class="buttons" use:ownsPrimary>
				<Button href="https://get.langx.io" variant="primary" size="lg" block>Start for free</Button
				>
				<Button href="#pick" variant="secondary" size="lg" block>Compare the apps</Button>
			</div>
			<p class="fine">Free plan, no ads. iPhone, Android and the browser.</p>
		</div>
		<div class="device" data-reveal use:reveal={{ onLoad: true, x: 40, y: 0, delay: 0.35 }}>
			<PhoneFrame label="A LangX chat: two messages arrive, then a correction">
				<ChatScreen loop />
			</PhoneFrame>
		</div>
	</section>

	<dl class="figures">
		{#each figures as f}
			<div>
				<span class="fig-icon" aria-hidden="true"><UiIcon name={f.icon} size={20} /></span>
				<dt class="tabular">{f.value}</dt>
				<dd>{f.label}</dd>
			</div>
		{/each}
	</dl>

	<AppPicker />

	<CheckRows />

	<section class="chapter" use:inview={{ threshold: 0.3 }}>
		<div class="text">
			<h2>the difference is a person.</h2>
			<p>
				Courses drill you and AI tutors answer you. LangX matches you with someone who speaks the
				language you are learning and is learning yours, so every chat teaches both of you — and any
				message can be corrected, without limit. Before anyone replies, Echo gives you free packs of
				phrases to review.
			</p>
			<ul class="promise" role="list">
				<li>
					<UiIcon name="check" size={22} strokeWidth={3} /><span>Matching in both directions</span>
				</li>
				<li>
					<UiIcon name="check" size={22} strokeWidth={3} /><span
						>Unlimited corrections, on every plan</span
					>
				</li>
				<li>
					<UiIcon name="check" size={22} strokeWidth={3} /><span>Free Echo packs to learn from</span
					>
				</li>
				<li><UiIcon name="check" size={22} strokeWidth={3} /><span>No ads. Open source.</span></li>
			</ul>
			<div class="buttons" use:ownsPrimary>
				<Button href="https://get.langx.io" variant="primary" size="lg" block>Start for free</Button
				>
				<Button href="/plans" variant="secondary" size="lg" block>See the plans</Button>
			</div>
		</div>
		<div class="device">
			<PhoneFrame label="Discover: people who speak the language you learn and are learning yours">
				<DiscoverScreen />
			</PhoneFrame>
		</div>
	</section>

	<section class="block">
		<h2>What kind of app is it?</h2>
		<p class="intro">
			“Language app” covers five different things. Most people end up using one from two of these
			groups — a course or a tutor for structure, and people to talk with. LangX is in two of them:
			the exchange is the product, and Echo's free packs are the part you can study alone.
		</p>
		<div class="map">
			{#each KINDS as k}
				<section class="kind" class:ours={k.kind === 'exchange'}>
					<span class="kind-icon" aria-hidden="true"><UiIcon name={k.icon} size={20} /></span>
					<h3>{k.title}</h3>
					<p>{k.what}</p>
					<ul role="list">
						{#if k.kind === 'exchange' || k.kind === 'course'}<li class="us">
								<img class="icon" src={appIcon('LangX')} alt="" width="20" height="20" />LangX
							</li>{/if}
						{#each byKind(k.kind) as c}
							<li>
								<a href="/{c.slug}" class:with-icon={!!appIcon(c.name)}
									>{#if appIcon(c.name)}<img
											class="icon"
											src={appIcon(c.name)}
											alt=""
											width="20"
											height="20"
											loading="lazy"
										/>{/if}{c.name}</a
								>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	</section>

	{#if COMPETITORS.length}
		<section id="apps" class="block">
			<h2>Language apps, side by side</h2>
			<p class="intro">
				Every app on this page in the same six columns. Each cell is a mark and a word; the row for
				LangX is tinted.
			</p>
			<div class="scroll">
				<table class="matrix">
					<thead>
						<tr>
							<th scope="col">App</th>
							<th scope="col">Kind</th>
							<th scope="col">Talk with real people</th>
							<th scope="col">Free plan</th>
							<th scope="col">Ads</th>
							<th scope="col">Open source</th>
							<th scope="col">Best for</th>
						</tr>
					</thead>
					<tbody>
						<tr class="self">
							<th scope="row">
								<span class="app"
									><img
										class="icon"
										src={appIcon('LangX')}
										alt=""
										width="24"
										height="24"
									/>LangX</span
								>
								<span class="what">{LANGX.what}</span>
							</th>
							<td>{LANGX.kind}</td>
							<td><Cell {...LANGX.people} /></td>
							<td><Cell {...LANGX.freePlan} /></td>
							<td><Cell {...LANGX.ads} /></td>
							<td><Cell {...LANGX.openSource} /></td>
							<td>{LANGX.bestFor}</td>
						</tr>
						{#each COMPETITORS as c}
							<tr>
								<th scope="row">
									<span class="app"
										>{#if appIcon(c.name)}<img
												class="icon"
												src={appIcon(c.name)}
												alt=""
												width="24"
												height="24"
												loading="lazy"
											/>{/if}<a href="/{c.slug}">{c.name}</a></span
									>
									{#if c.status !== 'active'}<span class="closed">{c.status}</span>{/if}
									<span class="what">{c.what}</span>
								</th>
								<td>{KIND_LABEL[c.kind]}</td>
								<td><Cell {...PEOPLE[c.people]} /></td>
								<td><Cell {...FREE[c.freePlan]} /></td>
								<td><Cell {...ADS[c.ads]} /></td>
								<td>
									<Cell mark={c.openSource ? 'yes' : 'no'} text={c.openSource ? 'Yes' : 'No'} />
								</td>
								<td>{c.bestFor}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}

	<section class="block">
		<h2>LangX vs each app</h2>
		<ul class="posts" role="list">
			{#each oneToOne as post}
				<li>
					<BlogPostCard
						title={post.title}
						coverImage={post.coverImage}
						coverWebp={post.coverWebp}
						thumbnail={post.thumbnail}
						excerpt={post.excerpt}
						readingTime={post.readingTime}
						slug={post.slug}
						tags={post.tags}
						apps={post.apps}
					/>
				</li>
			{/each}
		</ul>
	</section>

	<section class="block">
		<h2>Roundups and guides</h2>
		<ul class="posts" role="list">
			{#each roundups as post}
				<li>
					<BlogPostCard
						title={post.title}
						coverImage={post.coverImage}
						coverWebp={post.coverWebp}
						thumbnail={post.thumbnail}
						excerpt={post.excerpt}
						readingTime={post.readingTime}
						slug={post.slug}
						tags={post.tags}
						apps={post.apps}
					/>
				</li>
			{/each}
		</ul>
	</section>

	<section class="reviews" aria-labelledby="reviews-title">
		<header class="head">
			<span class="eyebrow">Reviews</span>
			<h2 id="reviews-title">What people say</h2>
			<p>{ratingsLine} Every quote below is a public Google Play review, as written.</p>
		</header>
		<ul class="quotes" role="list">
			{#each reviews as review}
				<li class="review">
					<div class="who">
						<Avatar
							src={review.avatar}
							initials={review.initials}
							tone={review.tone ?? 'accent'}
							size={44}
						/>
						<span class="meta">
							<span class="name">{review.name}</span>
							<span class="store">{review.store}</span>
						</span>
						<div class="stars" role="img" aria-label="5 out of 5 stars">
							{#each [1, 2, 3, 4, 5] as star (star)}
								<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
									<path
										fill="currentColor"
										d="M12 2.8l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.7l-5.6 3.1 1.3-6.2L3 9.3l6.3-.7z"
									/>
								</svg>
							{/each}
						</div>
					</div>
					<blockquote>{review.body}</blockquote>
				</li>
			{/each}
		</ul>
		<p class="all">
			<a href={playStoreUrl} target="_blank" rel="noopener noreferrer"
				>Read every review on Google Play<UiIcon name="external" size={16} /></a
			>
		</p>
	</section>

	<FAQ items={faq} eyebrow="Questions" title="Before you decide" />

	<FinalCta title="The quickest comparison is a conversation." />
</div>

<style lang="scss">
	@use '$lib/scss/breakpoints' as *;

	// Copy on the left, the phone on the right, as in the homepage hero: the
	// eyebrow, the title, one line, the ask, and the fine print. Below tablet
	// landscape the phone steps aside so the picker comes up sooner — the
	// chapter further down still shows the app on a phone.
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
			max-width: 22ch;
			font-size: clamp(1.9rem, 1.3rem + 2.2vw, 2.75rem);
			line-height: 1.15;
			letter-spacing: -0.02em;
		}

		.lede {
			margin: 0;
			font-size: 1.0625rem;
			line-height: 1.65;
			max-width: 52ch;
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
		display: none;
		--phone-zoom: 0.66;

		@include for-tablet-landscape-up {
			display: flex;
			justify-content: center;
		}
	}

	// Hairlines and figures, not cards: four numbers, each with its source
	// in plans.ts or PRODUCT.md, between two lines like the marquee.
	.figures {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
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

	// The homepage chapter, once: a blue lowercase heading, the reason, three
	// checks and the ask beside the Discover screen. Plays once on scroll.
	.chapter {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		align-items: center;
		gap: var(--space-xl);
		padding: var(--space-3xl) 0 var(--space-2xl);
		min-height: 560px;

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
			gap: var(--space-lg);
			padding: var(--space-2xl) 0 var(--space-xl);
			min-height: 0;
		}

		.text {
			display: flex;
			flex-direction: column;
			gap: var(--space-sm);
			max-width: 44ch;

			h2 {
				margin: 0;
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

		.device {
			display: flex;
			justify-content: center;
			--phone-zoom: 0.72;

			@include for-tablet-portrait-down {
				justify-content: flex-start;
				--phone-zoom: 0.7;
			}

			@include for-phone-only {
				--phone-zoom: 0.66;
			}
		}

		.buttons {
			margin-top: var(--space-2xs);
		}

		// The reveal: text rises 12px, the phone slides 40px in from its side.
		.text,
		.device {
			opacity: 0;
			transition:
				opacity 500ms var(--ease-out),
				transform 600ms var(--ease-out);
		}

		.text {
			transform: translateY(12px);
		}

		.device {
			transform: translateX(40px);
			transition-delay: 80ms;
		}

		&:global(.is-in) .text,
		&:global(.is-in) .device {
			opacity: 1;
			transform: none;
		}
	}

	// The three promises, in the app's list grammar with green checks: these
	// are corrections' colour, and corrections are what they promise.
	.promise {
		width: 100%;
		max-width: 390px;
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--color--border);

		li {
			display: flex;
			align-items: center;
			gap: 14px;
			margin: 0;
			padding: 14px 4px;
			border-bottom: 1px solid var(--color--border);
			font-family: var(--font--title);
			font-size: 1.125rem;
			font-weight: 800;
			color: var(--color--text);

			:global(svg) {
				color: var(--color--success);
			}
		}
	}

	.block {
		border-top: 1px solid var(--color--border);
		padding: var(--space-xl) 0;

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2rem);
			letter-spacing: -0.015em;
			margin-bottom: var(--space-md);
		}
	}

	.intro {
		max-width: 64ch;
		margin: 0 0 var(--space-md);
		color: var(--color--text-shade);
	}

	.map {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 12px;
	}

	.kind {
		padding: 16px 16px 14px;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-lg);
		background: var(--color--surface);

		&.ours {
			border-color: var(--color--accent);
			box-shadow: inset 0 0 0 1px var(--color--accent);
		}

		.kind-icon {
			display: inline-flex;
			margin-bottom: 10px;
			color: var(--color--text-quiet);
		}

		h3 {
			margin: 0;
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.0625rem;
		}

		p {
			margin: 4px 0 12px;
			font-size: 0.8125rem;
			line-height: 1.4;
			color: var(--color--text-quiet);
		}

		ul {
			display: flex;
			flex-wrap: wrap;
			gap: 6px;
			margin: 0;
			padding: 0;
			list-style: none;
		}

		li {
			margin: 0;

			a,
			&.us {
				display: inline-flex;
				align-items: center;
				gap: 6px;
				padding: 4px 10px;
				border-radius: var(--radius-pill);
				background: var(--color--muted);
				font-size: 0.8125rem;
				font-weight: 700;
				color: var(--color--text);
			}

			&.us {
				background: var(--color--accent);
				color: var(--color--surface);
			}

			// The icon sits in the pill's rounded end. A class rather than
			// a:has(:global(.icon)): Svelte 5 leaves that selector out of the CSS.
			a.with-icon,
			&.us {
				padding-left: 4px;
			}

			.icon {
				width: 20px;
				height: 20px;
				border-radius: 6px;
			}
		}
	}

	.scroll {
		overflow-x: auto;
	}

	table {
		width: 100%;
		min-width: 760px;
		border-collapse: collapse;
		font-size: 0.9375rem;

		th,
		td {
			text-align: left;
			vertical-align: top;
			padding: 12px 12px 12px 0;
			border-bottom: 1px solid var(--color--border);
		}

		thead th {
			font-size: 0.8125rem;
			color: var(--color--text-quiet);
			font-weight: 700;
		}

		// The app's name stays put while the row scrolls on a phone.
		tbody th {
			position: sticky;
			left: 0;
			z-index: 1;
			background: var(--color--surface);
			font-weight: 800;
			white-space: nowrap;
			padding-right: 16px;
		}

		td {
			color: var(--color--text-shade);
		}

		.self th,
		.self td {
			color: var(--color--text);
			background: var(--color--accent-tint);
		}

		.self th {
			padding-left: 8px;
			border-radius: var(--radius-sm) 0 0 var(--radius-sm);
		}

		.self td:last-child {
			border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		}
	}

	.matrix {
		.app {
			display: inline-flex;
			align-items: center;
			gap: 8px;
		}

		.icon {
			flex: none;
			width: 24px;
			height: 24px;
			border-radius: 6px;
			box-shadow: 0 0 0 1px var(--color--border);
		}

		.what {
			display: block;
			margin-top: 2px;
			font-size: 0.75rem;
			font-weight: 400;
			color: var(--color--text-quiet);
			white-space: normal;
			max-width: 22ch;
		}
	}

	.closed {
		display: block;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color--text-quiet);
	}

	// Two columns of rows, like the reviews on the homepage, so seventeen
	// comparisons do not run to a page and a half.
	.posts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
		column-gap: 56px;
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--color--border);

		li {
			margin: 0;
			border-bottom: 1px solid var(--color--border);
		}
	}

	.reviews {
		border-top: 1px solid var(--color--border);
		padding: var(--space-2xl) 0 0;

		.head {
			display: flex;
			flex-direction: column;
			gap: 12px;

			h2 {
				margin: 0;
				font-weight: 900;
				font-size: clamp(1.625rem, 3vw, 2.125rem);
				line-height: 1.15;
			}

			p {
				margin: 0;
				font-size: 1.0625rem;
				color: var(--color--text-shade);
			}
		}
	}

	// Three columns of hairline rows; each opens with the person, then the
	// stars, then their words.
	.quotes {
		margin: var(--space-lg) 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 0 40px;
		border-top: 1px solid var(--color--border);
	}

	.review {
		margin: 0;
		padding: 22px 0;
		border-bottom: 1px solid var(--color--border);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.who {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
	}

	.name {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
		line-height: 1.3;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.store {
		font-size: 0.8125rem;
		color: var(--color--text-quiet);
	}

	.stars {
		display: inline-flex;
		gap: 2px;
		margin-left: auto;
		color: var(--color--primary);
		flex: 0 0 auto;
	}

	blockquote {
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color--text);
		text-wrap: pretty;
	}

	.all {
		margin: 20px 0 0;
		font-size: 0.9375rem;
		font-weight: 600;

		a {
			display: inline-flex;
			align-items: center;
			gap: 6px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.chapter .text,
		.chapter .device {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
