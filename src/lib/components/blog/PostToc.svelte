<script lang="ts">
	/**
	 * "On this page" in the empty margin beside a post, on screens wide enough
	 * to have one. The list is rendered on the server from the post's H2s; the
	 * script only marks where the reader is, so without it the list still
	 * works as plain links.
	 */
	import { onMount } from 'svelte';

	interface Props {
		headings?: { id: string; text: string }[];
	}

	let { headings = [] }: Props = $props();

	let active = $state('');

	onMount(() => {
		const targets = headings
			.map((h) => document.getElementById(h.id))
			.filter((el): el is HTMLElement => Boolean(el));
		if (!targets.length) return;

		// The heading nearest the top of the reading area, not merely the first
		// one on screen: a band from under the header to a third of the way down.
		const seen = new Map<string, boolean>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries) seen.set(e.target.id, e.isIntersecting);
				const firstVisible = targets.find((t) => seen.get(t.id));
				if (firstVisible) {
					active = firstVisible.id;
					return;
				}
				// Between two headings: the last one scrolled past is the section.
				const passed = targets.filter((t) => t.getBoundingClientRect().top < 120);
				active = passed.length ? passed[passed.length - 1].id : '';
			},
			{ rootMargin: '-80px 0px -66% 0px' }
		);
		targets.forEach((t) => observer.observe(t));
		return () => observer.disconnect();
	});
</script>

{#if headings.length > 2}
	<nav class="toc" aria-label="On this page">
		<p class="label">On this page</p>
		<ol>
			{#each headings as h}
				<li>
					<a
						href="#{h.id}"
						class:active={active === h.id}
						aria-current={active === h.id || undefined}>{h.text}</a
					>
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style lang="scss">
	.toc {
		position: sticky;
		top: calc(64px + var(--space-lg));
		max-height: calc(100vh - 64px - var(--space-2xl));
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.label {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color--text-quiet);
		margin: 0 0 var(--space-sm);
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		border-left: 1px solid var(--color--border);
	}

	a {
		display: block;
		margin-left: -1px;
		padding: 6px 0 6px 14px;
		border-left: 1px solid transparent;
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color--text-shade);
		text-decoration: none;
		transition:
			color 200ms ease-out,
			border-color 200ms ease-out;

		// Blue means where you are, the same as the active tab in the app.
		&.active {
			color: var(--color--accent);
			border-left-color: var(--color--accent);
			font-weight: 600;
		}
	}

	@media (hover: hover) and (pointer: fine) {
		a:hover {
			color: var(--color--accent);
		}
	}
</style>
