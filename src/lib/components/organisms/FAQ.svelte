<script lang="ts">
	import { onMount } from 'svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import { rise } from '$lib/utils/rise';
	import { faqObjects, type FaqObject } from '$lib/data/faq';

	interface Props {
		/** The homepage questions unless a page brings its own; ids must be unique on the page. */
		items?: FaqObject[];
		eyebrow?: string;
		title?: string;
		/** A link under the list, to the page with every question. */
		more?: { href: string; label: string };
		/** The section's id; the homepage's is the `#faq` the old links point at. */
		id?: string;
	}

	let {
		items = faqObjects,
		eyebrow = '',
		title = 'questions.',
		more,
		id = 'faq'
	}: Props = $props();

	// The first answer is open on arrival, so the list reads as answers, not a
	// row of closed doors.
	// svelte-ignore state_referenced_locally
	let openId: number | null = $state(items[0]?.id ?? null);

	const toggle = (id: number) => (openId = openId === id ? null : id);

	// Arriving on /faq#echo opens the Echo answer, not the first one.
	onMount(() => {
		const slug = location.hash.slice(1);
		const hit = slug && items.find((q) => q.slug === slug);
		if (hit) openId = hit.id;
	});
</script>

<!-- The heading on the left, the questions on the right; one column on a phone. -->
<section {id} class="faq" aria-labelledby="{id}-title" use:rise>
	<header class="head" data-rise>
		{#if eyebrow}<span class="eyebrow">{eyebrow}</span>{/if}
		<h2 id="{id}-title" class="display-section">{title}</h2>
	</header>

	<div class="accordion" data-rise>
		{#each items as item (item.id)}
			<div class="item" id={item.slug} class:open={openId === item.id}>
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
		{#if more}<a class="more" href={more.href}>{more.label}</a>{/if}
	</div>
</section>

<style lang="scss">
	// The space above is the section's own, for the pages that stack it
	// under other content; the homepage and /faq set it to 0.
	.faq {
		display: grid;
		gap: 24px;
		padding-top: 72px;

		@media (min-width: 900px) {
			grid-template-columns: 1fr 1.65fr;
			gap: 48px;
			align-items: start;
		}
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: 10px;

		h2 {
			color: inherit;
		}
	}

	.accordion {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.item {
		border-radius: 20px;
		background: var(--color--muted);
		scroll-margin-top: calc(var(--header-height) + 16px);
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
		gap: 16px;
		width: 100%;
		min-height: 56px;
		padding: 14px 18px;
		background: none;
		border: 0;
		border-radius: 20px;
		text-align: left;
		cursor: pointer;
		color: var(--color--text);
		font-family: var(--font--title);
	}

	.title {
		font-size: 1.0625rem;
		font-weight: 900;
		line-height: 1.35;
	}

	.chevron {
		flex: 0 0 auto;
		display: inline-flex;
		transition: transform var(--dur-fast) var(--ease-out);
	}

	.open .chevron {
		transform: rotate(180deg);
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
		padding: 0 18px 18px;
		max-width: 64ch;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--color--text-shade);
		opacity: 0;
		transition: opacity var(--dur-fast) ease;

		:global(a) {
			color: var(--color--accent);
			font-weight: 700;
			text-decoration: underline;
		}

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

	.more {
		align-self: flex-start;
		margin-top: 8px;
		font-weight: 800;
		color: var(--color--accent);
		text-decoration: underline;
	}

	@media (prefers-reduced-motion: reduce) {
		.panel,
		.chevron,
		.content {
			transition: none;
		}
	}
</style>
