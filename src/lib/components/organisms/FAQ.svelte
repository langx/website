<script lang="ts">
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import { reveal } from '$lib/utils/reveal';
	import { faqObjects, type FaqObject } from '$lib/data/faq';

	interface Props {
		/** The homepage questions unless a page brings its own; ids must be unique on the page. */
		items?: FaqObject[];
		eyebrow?: string;
		title?: string;
	}

	let { items = faqObjects, eyebrow = 'FAQ', title = 'Questions' }: Props = $props();

	// The first answer is open on arrival, so the list reads as answers, not a
	// row of closed doors.
	// svelte-ignore state_referenced_locally
	let openId: number | null = $state(items[0]?.id ?? null);

	const toggle = (id: number) => (openId = openId === id ? null : id);
</script>

<section id="faq" class="faq">
	<header class="head" data-reveal use:reveal>
		<span class="eyebrow">{eyebrow}</span>
		<h2>{title}</h2>
	</header>

	<div class="accordion" data-reveal use:reveal>
		{#each items as item (item.id)}
			<div class="item" class:open={openId === item.id}>
				<h3>
					<button
						type="button"
						id="faq-button-{item.id}"
						aria-expanded={openId === item.id}
						aria-controls="faq-panel-{item.id}"
						onclick={() => toggle(item.id)}
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
		padding: 110px 0 0;

		@include for-phone-only {
			padding-top: 72px;
		}
	}

	// Centred, unlike the sections above it: the list is narrower than the
	// page, and a left-aligned title over a centred list looked adrift.
	.head {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		text-align: center;

		h2 {
			margin: 0;
			font-weight: 900;
			font-size: clamp(1.625rem, 3vw, 2.125rem);
			line-height: 1.15;
		}
	}

	.accordion {
		margin: 32px auto 0;
		border-top: 1px solid var(--color--border);
		max-width: 760px;
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
		gap: 20px;
		width: 100%;
		padding: 20px 0;
		background: none;
		border: 0;
		text-align: left;
		cursor: pointer;
		color: var(--color--text);
		font-family: var(--font--title);
		border-radius: var(--radius-sm);

		&:hover .title {
			color: var(--color--accent);
		}
	}

	.title {
		font-size: 1.0625rem;
		font-weight: 800;
		line-height: 1.4;
		transition: color var(--dur-fast) ease;
	}

	.chevron {
		flex: 0 0 auto;
		color: var(--color--text-tertiary);
		display: inline-flex;
		transition:
			transform var(--dur-fast) var(--ease-out),
			color var(--dur-fast) ease;
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
		max-width: 64ch;
		font-size: 1rem;
		line-height: 1.65;
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
