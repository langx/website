<script lang="ts">
	interface Props {
		/**
		 * The answer before the article: three to five lines a reader can stop at.
		 * Sits right under the opening paragraph.
		 */
		items: string[];
		title?: string;
	}

	let { items, title = 'In short' }: Props = $props();
</script>

<aside class="takeaways" aria-label={title}>
	<p class="title">{title}</p>
	<ul role="list">
		{#each items as item}
			<li>
				<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"
					><circle cx="10" cy="10" r="10" /><path d="M5.5 10.5l3 3 6-7" /></svg
				>
				<span>{item}</span>
			</li>
		{/each}
	</ul>
</aside>

<style lang="scss">
	.takeaways {
		margin: var(--space-md) 0 var(--space-lg);
		padding: 20px 22px;
		border-radius: var(--radius-lg);
		background: var(--color--accent-tint);
	}

	.title {
		margin: 0 0 10px;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.8125rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color--accent);
	}

	ul {
		display: grid;
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: grid;
		grid-template-columns: 20px 1fr;
		gap: 10px;
		align-items: start;
		margin: 0;
		line-height: 1.5;
	}

	svg {
		margin-top: 2px;

		circle {
			fill: var(--color--accent);
		}

		path {
			fill: none;
			stroke: var(--color--surface);
			stroke-width: 2;
			stroke-linecap: round;
			stroke-linejoin: round;
		}
	}
</style>
