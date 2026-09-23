<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import BlogPostCard from '$lib/components/molecules/BlogPostCard.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { siteBaseUrl } from '$lib/data/meta';
	import { COMPETITORS, type Competitor } from '$lib/data/competitors';
	import { appIcon } from '$lib/data/app-icons';
	import StatRow from '$lib/components/blog/StatRow.svelte';
	import AppDemo from '$lib/components/blog/AppDemo.svelte';
	import PhoneFrame from '$lib/components/phone/PhoneFrame.svelte';
	import ChatScreen from '$lib/components/phone/ChatScreen.svelte';
	import type { BlogPost } from '$lib/utils/types';

	export let data: { posts: BlogPost[] };
	$: ({ posts } = data);
	// Roundups answer "which app?"; one-to-ones answer "this app or LangX?".
	$: oneToOne = posts.filter((p) => p.slug.startsWith('open-source-alternative-to-'));
	$: roundups = posts.filter((p) => !p.slug.startsWith('open-source-alternative-to-'));

	const title = 'LangX vs Tandem, HelloTalk, Duolingo and Other Language Apps';
	const description =
		'Open source alternative to Tandem, HelloTalk, Duolingo and more: honest one-to-one comparisons of LangX with every major language app, updated for 2026.';

	/**
	 * What LangX is, in the rows every comparison asks about. Each line has to
	 * stay true of the shipping app — see PRODUCT.md and `src/lib/data/plans.ts`.
	 */
	const facts = [
		{
			label: 'Matching',
			value: 'Both directions: people who speak what you learn and learn what you speak'
		},
		{ label: 'Corrections', value: 'Hold any message to correct it — unlimited on every plan' },
		{
			label: 'Translation',
			value: 'Built into the chat — 20 a day free, 300 on Fluent, 1,000 on Polyglot'
		},
		{ label: 'Free plan', value: 'Unlimited replies and corrections; 5 new conversations a day' },
		{
			label: 'Voice and photos',
			value: 'Voice and photo messages; hold a message to hear it read aloud'
		},
		{ label: 'Ads', value: 'None' },
		{ label: 'Source code', value: 'Open source (BSD-3) and self-hostable' },
		{ label: 'Platforms', value: 'iOS, Android and the web' }
	];

	/** Headline numbers, each one from plans.ts or PRODUCT.md. */
	const headline = [
		{ value: 'Unlimited', label: 'corrections and replies, on every plan' },
		{ value: '5', label: 'new conversations a day on the free plan' },
		{ value: '182', label: 'languages listed in the app' },
		{ value: '0', label: 'ads' }
	];

	/** The map: every app under the kind of thing it is. */
	const KINDS: { kind: Competitor['kind']; title: string; what: string }[] = [
		{
			kind: 'exchange',
			title: 'Language exchange',
			what: 'You talk with people learning your language'
		},
		{ kind: 'penpal', title: 'Pen pals', what: 'Longer, slower letters and messages' },
		{ kind: 'tutors', title: 'Paid tutors', what: 'Lessons with a teacher, booked and paid' },
		{
			kind: 'course',
			title: 'Courses',
			what: 'Structured lessons; little or no talking to people'
		},
		{ kind: 'ai', title: 'AI tutors', what: 'You talk with an AI, not a person' }
	];
	const byKind = (kind: Competitor['kind']) =>
		COMPETITORS.filter((c) => c.kind === kind && c.status === 'active');

	/** Every matrix cell is an icon and a word, never colour alone. */
	const PEOPLE = {
		yes: { mark: 'yes', text: 'Yes' },
		paid: { mark: 'part', text: 'Paid tutors' },
		partial: { mark: 'part', text: 'Corrections only' },
		no: { mark: 'no', text: 'No' }
	} as const;
	const FREE = {
		yes: { mark: 'yes', text: 'Yes' },
		partial: { mark: 'part', text: 'Trial or limited' },
		no: { mark: 'no', text: 'No' }
	} as const;
	const KIND_LABEL = Object.fromEntries(KINDS.map((k) => [k.kind, k.title]));

	$: ld = {
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
			}
		]
	};
</script>

<Seo
	title="LangX vs Tandem, HelloTalk & Duolingo: Open Source Alternative"
	path="/compare"
	{description}
/>
<JsonLd data={ld} />

<div class="container">
	<!-- The page opened on a wall of type. The phone beside it plays the one
	     thing every comparison below comes back to: a correction, inside a
	     conversation with a real person. -->
	<div class="hero">
		<PageHeader
			eyebrow="Compare"
			{title}
			lede="LangX is an open source alternative to Tandem, HelloTalk and the other language exchange apps, and the social alternative to Duolingo: the conversation, with real people, that course apps leave out. Here is how it compares to each — including where they are the better choice."
		/>
		<div class="hero-phone">
			<PhoneFrame label="A LangX chat: two messages arrive, then a correction">
				<ChatScreen loop />
			</PhoneFrame>
		</div>
	</div>

	<StatRow stats={headline} />

	<section class="block">
		<h2>LangX at a glance</h2>
		<dl class="facts">
			{#each facts as f}
				<div>
					<dt>{f.label}</dt>
					<dd>{f.value}</dd>
				</div>
			{/each}
		</dl>
		<AppDemo
			screen="discover"
			title="Matching in both directions"
			text="You only see people who speak the language you are learning and are learning the language you speak, so every conversation is worth something to both of you."
		/>
	</section>

	<section class="block">
		<h2>What kind of app is it?</h2>
		<p class="intro">
			“Language app” covers five different things. Most people end up using one from two of these
			groups — a course or a tutor for structure, and people to talk with.
		</p>
		<div class="map">
			{#each KINDS as k}
				<section class="kind" class:ours={k.kind === 'exchange'}>
					<h3>{k.title}</h3>
					<p>{k.what}</p>
					<ul role="list">
						{#if k.kind === 'exchange'}<li class="us">
								<img class="icon" src={appIcon('LangX')} alt="" width="20" height="20" />LangX
							</li>{/if}
						{#each byKind(k.kind) as c}
							<li>
								<a href="/{c.slug}"
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
		<section class="block">
			<h2>Language apps, side by side</h2>
			<div class="scroll">
				<table class="matrix">
					<thead>
						<tr>
							<th scope="col">App</th>
							<th scope="col">Kind</th>
							<th scope="col">Talk with real people</th>
							<th scope="col">Free plan</th>
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
								<span class="what"
									>Two-way exchange with corrections and translation in the chat</span
								>
							</th>
							<td>Language exchange</td>
							<td><span class="cell yes">Yes</span></td>
							<td><span class="cell yes">Yes</span></td>
							<td><span class="cell yes">Yes (BSD-3)</span></td>
							<td>Practice that teaches, without ads</td>
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
								<td><span class="cell {PEOPLE[c.people].mark}">{PEOPLE[c.people].text}</span></td>
								<td><span class="cell {FREE[c.freePlan].mark}">{FREE[c.freePlan].text}</span></td>
								<td
									><span class="cell {c.openSource ? 'yes' : 'no'}"
										>{c.openSource ? 'Yes' : 'No'}</span
									></td
								>
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
		<ul class="rows" role="list">
			{#each oneToOne as post}
				<li>
					<BlogPostCard
						title={post.title}
						coverImage={post.coverImage}
						thumbnail={post.thumbnail}
						excerpt={post.excerpt}
						readingTime={post.readingTime}
						slug={post.slug}
						tags={post.tags}
					/>
				</li>
			{/each}
		</ul>
	</section>

	<section class="block">
		<h2>Roundups and guides</h2>
		<ul class="rows" role="list">
			{#each roundups as post}
				<li>
					<BlogPostCard
						title={post.title}
						coverImage={post.coverImage}
						thumbnail={post.thumbnail}
						excerpt={post.excerpt}
						readingTime={post.readingTime}
						slug={post.slug}
						tags={post.tags}
					/>
				</li>
			{/each}
		</ul>
	</section>

	<section class="cta">
		<h2>The quickest comparison is a conversation.</h2>
		<p>LangX is free to start on iPhone, Android and the web.</p>
		<div use:ownsPrimary>
			<Button href="https://get.langx.io" variant="primary" size="lg">Start for free</Button>
		</div>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	// Copy on the left, the phone on the right, as in the homepage hero; below
	// tablet landscape the phone steps aside and the numbers come up sooner —
	// the Discover demo further down still shows the app on a phone.
	.hero {
		display: grid;
		grid-template-columns: 1fr;
		align-items: center;
		gap: var(--space-xl);

		@include for-tablet-landscape-up {
			grid-template-columns: 1fr auto;
		}
	}

	.hero-phone {
		display: none;
		--phone-zoom: 0.62;

		@include for-tablet-landscape-up {
			display: block;
			padding: var(--space-lg) 0;
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

	.facts {
		display: grid;
		max-width: 76ch;

		div {
			display: grid;
			grid-template-columns: minmax(8rem, 12rem) 1fr;
			gap: var(--space-sm);
			padding: 12px 0;
			border-bottom: 1px solid var(--color--border);

			@include for-phone-only {
				grid-template-columns: 1fr;
				gap: 2px;
			}
		}

		dt {
			font-weight: 700;
		}

		dd {
			margin: 0;
			color: var(--color--text-shade);
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

		tbody th {
			font-weight: 800;
			white-space: nowrap;
		}

		td {
			color: var(--color--text-shade);
		}

		.self th,
		.self td {
			color: var(--color--text);
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

			// The icon sits in the pill's rounded end.
			a:has(.icon),
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

	// A mark and a word in every cell: the icon carries the scan, the word the
	// meaning, so nothing depends on telling green from grey.
	.cell {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-weight: 600;
		white-space: nowrap;

		&::before {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			font-size: 0.75rem;
			font-weight: 800;
			flex: 0 0 auto;
		}

		// Blue checks, as in the plan rows and the posts' tables: green is kept
		// for corrections.
		&.yes {
			color: var(--color--text);

			&::before {
				content: '✓';
				background: var(--color--accent-tint);
				color: var(--color--accent);
			}
		}

		&.part {
			color: var(--color--text-shade);

			&::before {
				content: '~';
				background: var(--color--muted);
				color: var(--color--text-shade);
			}
		}

		// Text Quiet, not Tertiary: tertiary is the phone replicas' grey and
		// too faint for page copy.
		&.no {
			color: var(--color--text-quiet);

			&::before {
				content: '✕';
				background: var(--color--muted);
				color: var(--color--text-quiet);
			}
		}
	}

	.closed {
		display: block;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color--text-quiet);
	}

	.rows {
		border-top: 1px solid var(--color--border);
		max-width: 76ch;
	}

	.cta {
		border-top: 1px solid var(--color--border);
		padding: var(--space-xl) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			letter-spacing: -0.015em;
		}

		p {
			color: var(--color--text-shade);
			margin: var(--space-2xs) 0 var(--space-md);
		}
	}
</style>
