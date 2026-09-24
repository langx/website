<script lang="ts">
	/**
	 * Two apps side by side, one card each, with what each is best at. The
	 * visual summary of a "LangX vs X" page; the table in the text keeps the
	 * detail. `a` is drawn first. Keep points short and true of both.
	 */
	type Side = { name: string; tagline?: string; points: string[]; bestFor?: string };
	interface Props {
		a: Side;
		b: Side;
		title?: string;
	}

	let { a, b, title = '' }: Props = $props();
</script>

<figure class="versus">
	{#if title}<figcaption>{title}</figcaption>{/if}
	<div class="grid">
		{#each [a, b] as side, i}
			<section class="card" class:us={side.name === 'LangX'}>
				<span class="name">{side.name}</span>
				{#if side.tagline}<span class="tag">{side.tagline}</span>{/if}
				<ul role="list">
					{#each side.points as p}
						<li>
							<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"
								><path d="M3.5 8.5l3 3 6-7" /></svg
							>{p}
						</li>
					{/each}
				</ul>
				{#if side.bestFor}<div class="best"><strong>Best for:</strong> {side.bestFor}</div>{/if}
			</section>
			{#if i === 0}<span class="vs" aria-hidden="true">vs</span>{/if}
		{/each}
	</div>
</figure>

<style lang="scss">
	.versus {
		margin: var(--space-lg) 0;
	}

	figcaption {
		margin-bottom: 14px;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.0625rem;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 12px;
		align-items: stretch;

		@media (max-width: 620px) {
			grid-template-columns: 1fr;
		}
	}

	.vs {
		align-self: center;
		justify-self: center;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--color--muted);
		font-family: var(--font--title);
		font-weight: 800;
		color: var(--color--text-shade);
	}

	.card {
		padding: 18px 18px 14px;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-lg);
		background: var(--color--surface);

		&.us {
			border-color: var(--color--accent);
			box-shadow: inset 0 0 0 1px var(--color--accent);
		}
	}

	.name,
	.tag {
		display: block;
	}

	.name {
		margin: 0;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.25rem;
	}

	.tag {
		margin: 2px 0 10px;
		font-size: 0.875rem;
		color: var(--color--text-tertiary);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 8px;
	}

	li {
		display: grid;
		grid-template-columns: 16px 1fr;
		gap: 8px;
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.45;
	}

	// Blue checks, as in the plan rows; green is kept for corrections.
	svg path {
		fill: none;
		stroke: var(--color--accent);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	svg {
		margin-top: 3px;
	}

	.best {
		margin: 12px 0 0;
		padding-top: 10px;
		border-top: 1px solid var(--color--border);
		font-size: 0.875rem;
		color: var(--color--text-shade);
	}
</style>
