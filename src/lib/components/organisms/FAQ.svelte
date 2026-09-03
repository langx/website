<script lang="ts">
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';

	interface FaqObject {
		id: number;
		title: string;
		content: string;
	}

	// Answers are static strings written here, not user input.
	const faqObjects: FaqObject[] = [
		{
			id: 1,
			title: 'Is LangX free?',
			content: `Yes. Replying to messages and correcting people are unlimited for everyone. On the free plan you can start 5 new chats and use 20 translations a day. <a href="/pro">Fluent and Polyglot</a> remove those limits and add a few extras.`
		},
		{
			id: 2,
			title: 'Where can I use it?',
			content: `On <a href="https://apps.apple.com/app/languagexchange/id6474187141" target="_blank" rel="noopener noreferrer">iPhone</a>, <a href="https://play.google.com/store/apps/details?id=tech.newchapter.languageXchange" target="_blank" rel="noopener noreferrer">Android</a> and in your <a href="https://app.langx.io" target="_blank" rel="noopener noreferrer">browser</a>. It's the same app everywhere.`
		},
		{
			id: 3,
			title: 'How does matching work?',
			content: `You only see people who speak the language you're learning and are learning the language you speak. That way every conversation is useful for both of you, not a favour one person does for the other.`
		},
		{
			id: 4,
			title: 'What is LangX Token?',
			content: `Points you earn by chatting and by correcting other people. You spend them inside the app on a streak freeze or on frames and titles for your profile. They aren't money: you can't buy, sell or trade them, and they never unlock a paid plan.`
		},
		{
			id: 5,
			title: 'What is LangX Copilot?',
			content: `Private AI feedback on your own messages while you chat with a real person. Only you see it. It isn't in the app yet; it's coming later, for <a href="/pro">Polyglot</a>.`
		},
		{
			id: 6,
			title: 'I used LangX before. What happens to my account?',
			content: `Sign up again with the same email. Your username is saved for you and your tokens carry over. Everything that changed is on the <a href="/welcome-back">welcome back</a> page.`
		},
		{
			id: 7,
			title: 'Is it safe?',
			content: `Yes. The whole app is open source on <a href="https://github.com/langx/langx" target="_blank" rel="noopener noreferrer">GitHub</a>, so anyone can see exactly how it works and what it stores. You can report or block anyone from inside the app, reports go to a moderation team, and you need to be 18 or older to join.`
		},
		{
			id: 8,
			title: 'How can I help?',
			content: `Use the app and tell people about it. If you like code or writing, the <a href="https://github.com/langx/langx/contribute" target="_blank" rel="noopener noreferrer">good first issues</a> on GitHub are a nice place to start, and the <a href="https://discord.langx.io" target="_blank" rel="noopener noreferrer">Discord</a> is where everyone talks.`
		}
	];

	let openId: number | null = null;

	const toggle = (id: number) => (openId = openId === id ? null : id);
</script>

<section id="faq" class="faq">
	<header class="head">
		<h2>Questions</h2>
	</header>

	<div class="accordion">
		{#each faqObjects as item (item.id)}
			<div class="item" class:open={openId === item.id}>
				<h3>
					<button
						type="button"
						id="faq-button-{item.id}"
						aria-expanded={openId === item.id}
						aria-controls="faq-panel-{item.id}"
						on:click={() => toggle(item.id)}
					>
						<span class="title">{item.title}</span>
						<span class="chevron" aria-hidden="true"><UiIcon name="chevron-down" size={20} /></span>
					</button>
				</h3>
				<div
					class="panel"
					id="faq-panel-{item.id}"
					role="region"
					aria-labelledby="faq-button-{item.id}"
				>
					<div class="inner">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<div class="content">{@html item.content}</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.faq {
		padding: var(--space-3xl) 0 0;

		@include for-phone-only {
			padding-top: var(--space-2xl);
		}
	}

	.head {
		max-width: 60ch;
	}

	.accordion {
		margin-top: var(--space-lg);
		border-top: 1px solid var(--color--border);
		max-width: 76ch;
	}

	.item {
		border-bottom: 1px solid var(--color--border);
	}

	h3 {
		margin: 0;
		font-size: inherit;
		font-family: inherit;
		font-weight: inherit;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		width: 100%;
		padding: 18px 0;
		background: none;
		border: 0;
		text-align: left;
		cursor: pointer;
		color: var(--color--text);
		font-family: var(--font--default);
		border-radius: var(--radius-sm);

		&:hover .title {
			color: var(--color--accent);
		}
	}

	.title {
		font-size: 1.0625rem;
		font-weight: 600;
		line-height: 1.4;
		transition: color var(--dur-fast) ease;
	}

	.chevron {
		flex: 0 0 auto;
		color: var(--color--text-quiet);
		display: inline-flex;
		transition: transform var(--dur-fast) var(--ease-out);
	}

	.open .chevron {
		transform: rotate(180deg);
		color: var(--color--accent);
	}

	// Height animates through grid rows, so the panel can be any length and
	// still open in 200ms without a max-height guess.
	.panel {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows var(--dur-fast) var(--ease-out);
	}

	.open .panel {
		grid-template-rows: 1fr;
	}

	.inner {
		overflow: hidden;
		min-height: 0;
	}

	.content {
		padding: 0 0 22px;
		max-width: 68ch;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color--text-shade);
		opacity: 0;
		transition: opacity var(--dur-fast) ease;

		:global(strong) {
			color: var(--color--text);
		}

		:global(ul) {
			margin: 0 0 0 1.2em;
			list-style: disc;
		}

		:global(li) {
			margin: 0 0 0.4em;
		}
	}

	.open .content {
		opacity: 1;
		transition-delay: 60ms;
	}

	@media (prefers-reduced-motion: reduce) {
		.panel,
		.chevron,
		.content {
			transition: none;
		}
	}
</style>
