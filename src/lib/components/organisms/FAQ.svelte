<script lang="ts">
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';

	interface FaqObject {
		id: number;
		title: string;
		content: string;
		isOpen: boolean;
	}

	const faqObjects: FaqObject[] = [
		{
			id: 1,
			title: 'What platforms do we support?',
			content: `LangX is available on <a href="https://apps.apple.com/us/app/langx-practice-learn-succeed/id6474187141" target="_blank" class="link">iOS</a>, <a href="https://play.google.com/store/apps/details?id=tech.newchapter.languageXchange" target="_blank" class="link">Android</a> and on the <a href="https://app.langx.io" target="_blank" class="link">web app</a>. All three come out of the same codebase.`,
			isOpen: false
		},
		{
			id: 2,
			title: 'Is LangX free?',
			content: `<strong>Free to use, always.</strong> You can reply to every message you receive with no limits, and write as many corrections as you like — neither is capped on any plan. On the free plan you can start <strong>5 new conversations</strong> and use <strong>20 translations</strong> per rolling 24 hours.
			<br><br>
			<a href="/pro" class="link">Fluent</a> is a paid subscription that removes those limits, widens the translation allowance and lets you learn more languages at once. <a href="/pro" class="link">Polyglot</a> adds seeing who viewed your profile, incognito browsing, the Nearby sort and LangX Copilot on top of that.`,
			isOpen: false
		},
		{
			id: 3,
			title: 'How does LangX pay for itself?',
			content: `Fluent and Polyglot subscriptions. That is the whole model: no ads, no advertising identifiers, no third-party analytics SDK, and no selling anyone's data.
			<br><br>
			Two things are deliberately <em>not</em> behind the paywall. Replying to messages is unlimited, because a language exchange where you cannot answer someone is not a language exchange. And writing corrections is unlimited on every plan — rate-limiting the free side would shrink what a paying user receives just as much as what a free user gives.
			<br><br>
			The code stays open source under BSD-3 and you can run your own instance. We also accept sponsors on <a href="https://github.com/sponsors/langx" target="_blank" class="link">GitHub Sponsors</a>.`,
			isOpen: false
		},
		{
			id: 4,
			title: 'What does the app have to offer?',
			content: `
			<ul>
				<li>Matching that works in both directions — they speak what you are learning, you speak what they are learning.</li>
				<li>Tap any message to correct it. Unlimited, on every plan.</li>
				<li>Translation built into the chat, so you never leave the conversation.</li>
				<li>Voice messages and photos.</li>
				<li>Daily streaks, LangX Tokens, and weekly, monthly, yearly and all-time leaderboards.</li>
				<li>Discovery filters by country, age and level — free; gender and city on Fluent.</li>
				<li>Who viewed your profile, and incognito browsing (Polyglot).</li>
				<li>Nearby: discovery sorted by distance, if you switch location sharing on (Polyglot).</li>
				<li>LangX Copilot, private AI feedback as you practise (Polyglot, not in the first release).</li>
				<li>Download or delete everything we hold about you, from inside the app.</li>
				<li>Night mode.</li>
				<li>Open source under BSD-3, and self-hostable.</li>
			</ul>
			`,
			isOpen: false
		},
		{
			id: 5,
			title: 'How is LangX different and stand out?',
			content: `Two things. Matching runs in <strong>both directions</strong>, so every conversation has something in it for both people rather than one of you doing a favour. And <strong>corrections are unlimited for everyone</strong> — the part of the product that actually teaches is the part we refuse to ration.
			<br><br>
			On top of that: the app and the API are open source, you can host your own instance, and we collect no advertising identifiers.`,
			isOpen: false
		},
		{
			id: 6,
			title: 'What is LangX Copilot 🤖?',
			content: `Private feedback while you practise with a real person. You open it inside a chat room and it comments on your own messages — only you can see those messages.
			<br><br>
			<strong>It is not in the first release of v2.</strong> It is planned for a later one, and it is the feature <a href="/pro" class="link">Polyglot</a> exists for. We are naming the timing plainly because this feature has been described as "coming soon" for a long time.`,
			isOpen: false
		},
		{
			id: 7,
			title: 'What is LangX Token 💰?',
			content: `<strong>LangX Token is an in-app point.</strong> You earn it by practising and by teaching, and you spend it inside the app on a streak freeze or on cosmetic frames and titles. That is the entire definition.
			<br><br>
			It cannot be bought, sold, traded, staked or withdrawn, it is not on a blockchain, and it never will be. Correcting someone else's sentence is worth more than sending a message — that weighting is deliberate.
			<br><br>
			More detail at <a href="https://token.langx.io/" target="_blank" class="link">token.langx.io</a>.`,
			isOpen: false
		},
		{
			id: 8,
			title: 'Can I unlock Pro with tokens?',
			content: `No, and this one is worth explaining rather than just stating. If tokens could buy a Pro feature, farming tokens would become a substitute for subscribing — and the subscription is the thing that funds the app. Keeping the two economies separate is what lets corrections and replies stay unlimited for everyone.`,
			isOpen: false
		},
		{
			id: 9,
			title: 'I used LangX before — what happens to my account?',
			content: `Your username is reserved for you and your token balance carries over. You do need to sign up again with the same email address: the old password hashes could not be migrated.
			<br><br>
			The full story, including how balances are converted and what changed about pricing, is on the <a href="/welcome-back" class="link">welcome back</a> page.`,
			isOpen: false
		},
		{
			id: 10,
			title: 'How can I contribute?',
			content: `We implore anyone to contribute, whether it's just a single image, down to a single line of code/text. You can read more <a href="https://github.com/langx/website?tab=readme-ov-file#contributing" target="_blank" class="link">here</a> on how you can add your contribution.`,
			isOpen: false
		},
		{
			id: 11,
			title: 'How is it going to be moderated?',
			content: `Reporting and blocking are built into the app, and reports go to a moderation queue. Beyond that we have a team of contributors who help wherever possible. If you are interested in taking on a moderator role as a contributor or volunteer, please reach out.`,
			isOpen: false
		},
		{
			id: 12,
			title: 'Could you add sign languages?',
			content: `We'll definitely add sign languages to the study languages section during the registration process. Additionally, we have a contributor who works as an accessibility manager and can help with the following issues. Thank you for bringing this matter to our attention again :)
			<br><br>
			For the sign language issue: <a href="https://github.com/langx/langx/issues/444" target="_blank" class="link">Link</a>.
			<br><br>
			Regarding developing standards like WCAG with the W3C: <a href="https://github.com/langx/langx/issues/436" target="_blank" class="link">Link</a>.`,
			isOpen: false
		},
		{
			id: 13,
			title: 'Is there more to come?',
			content: `Yes. Badges are not in v2's first release and are planned to return, LangX Copilot is a later release, and there is more after that. We would rather list what is missing than let the site advertise something the app does not do.`,
			isOpen: false
		}
	];
</script>

<section id="faq">
	<div class="faq-container">
		<h2><SparklingHighlight color="secondary">Frequently Asked Questions</SparklingHighlight></h2>
		<div class="accordion">
			{#each faqObjects as item (item.id)}
				<div class="accordion-item">
					<button
						on:click={() => {
							item.isOpen = !item.isOpen;
						}}
						id="accordion-button-{item.id}"
						aria-expanded={item?.isOpen}
						aria-controls="accordion-panel-{item.id}"
						><span class="accordion-title">{item?.title}</span><span
							class="icon"
							aria-hidden="true"
						/></button
					>
					<div class="accordion-content" id="accordion-panel-{item.id}">
						<p>{@html item?.content}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#faq {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 15px;
		position: relative;
		padding: 80px 0;

		@include for-phone-only {
			padding: 40px 0 50px;
		}

		// .hello {
		// 	text-align: center;
		// }
	}

	$yellow: var(--color--primary);

	.faq-container {
		width: 100%;

		h2 {
			color: var(--color--secondary);
		}

		.accordion {
			.accordion-item {
				border-bottom: 1px solid var(--color--border);

				button[aria-expanded='true'] {
					border-bottom: 1px solid $yellow;
				}
			}

			button {
				position: relative;
				display: block;
				text-align: left;
				width: 100%;
				padding: 1em 0;
				color: unset;
				font-size: 1.2rem;
				font-weight: 400;
				border: none;
				background: none;
				outline: none;

				@include for-phone-only {
					font-size: 1rem;
				}

				&:hover,
				&:focus {
					cursor: pointer;
					color: $yellow;

					&::after {
						cursor: pointer;
						color: $yellow;
						border: 1px solid $yellow;
					}
				}

				.accordion-title {
					padding: 1em 1.5em 1em 0;
				}

				.icon {
					display: inline-block;
					position: absolute;
					top: 18px;
					right: 0;
					width: 22px;
					height: 22px;
					border: 1px solid;
					border-radius: 22px;

					&::before {
						display: block;
						position: absolute;
						content: '';
						top: 9px;
						left: 5px;
						width: 10px;
						height: 2px;
						background: currentColor;
					}

					&::after {
						display: block;
						position: absolute;
						content: '';
						top: 5px;
						left: 9px;
						width: 2px;
						height: 10px;
						background: currentColor;
					}
				}
			}

			button[aria-expanded='true'] {
				color: $yellow;

				.icon {
					&::after {
						width: 0;
					}
				}

				+ .accordion-content {
					opacity: 1;
					max-height: fit-content;
					transition: all 200ms linear;
					will-change: opacity, max-height;
				}
			}

			.accordion-content {
				opacity: 0;
				max-height: 0;
				overflow: hidden;
				transition: opacity 200ms linear, max-height 200ms linear;
				will-change: opacity, max-height;

				p {
					font-size: 0.95rem;
					font-weight: 400;
					margin: 1.5em 0;
					max-width: 68ch;
				}

				// The answers are injected with {@html}, so the link styling has to
				// reach past Svelte's scoping. This replaces the inline
				// `style="color: #ff723f"` that used to be repeated in every answer.
				:global(.link) {
					color: var(--color--secondary);
					font-weight: 700;
					text-decoration-color: var(--color--secondary);
				}

				:global(ul) {
					margin: 0;
					padding-left: 1.2em;
					list-style: disc;
				}

				:global(li) {
					margin-bottom: 0.4em;
				}
			}
		}
	}
</style>
