<script lang="ts">
	import { plans, planNotes } from '$lib/data/plans';
	import AppStores from '$lib/components/molecules/AppStores.svelte';
</script>

<section id="pricing">
	<div class="plans">
		{#each plans as plan}
			<article class="plan {plan.tone ?? ''}">
				<h2>{plan.name}</h2>
				<p class="tagline">{plan.tagline}</p>
				<ul>
					{#each plan.points as point}
						<li>
							<span class="label">
								{point.label}
								{#if point.pending}<em>Coming soon</em>{/if}
							</span>
							{#if point.note}<small>{point.note}</small>{/if}
						</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>

	<div class="fine">
		{#each planNotes as note}
			<p>{note}</p>
		{/each}
	</div>

	<div class="cta">
		<AppStores />
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#pricing {
		position: relative;
		z-index: 1;
		padding: 0 0 var(--space-3xl);
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
	}

	.plans {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-md);
		align-items: start;
	}

	.plan {
		border: 1px solid var(--color--border);
		border-radius: var(--radius-lg);
		background: var(--color--card-background);
		padding: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		height: 100%;

		h2 {
			font-size: 1.3rem;
			margin: 0;
		}

		// Each paid plan carries the app's own tier colour, so the three cards
		// read as one ladder rather than three unrelated products.
		&.pro h2 {
			color: var(--color--pro);
		}

		&.pro-plus h2 {
			color: var(--color--pro-plus);
		}
	}

	.tagline {
		margin: 0 0 var(--space-2xs);
		color: var(--color--text-shade);
		font-size: 0.95rem;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	// Two columns: the tick, then everything about the point. A note sits under
	// its own label rather than under the tick, which is what makes the list
	// scannable down the left edge.
	li {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		column-gap: 0.55em;
		row-gap: 2px;
		font-size: 0.95rem;

		&::before {
			content: '✓';
			color: var(--color--pro);
			line-height: 1.5;
		}
	}

	.label,
	small {
		grid-column: 2;
	}

	.label em {
		font-style: normal;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color--text-shade);
		margin-left: var(--space-3xs);
		white-space: nowrap;
	}

	small {
		color: var(--color--text-shade);
		font-size: 0.82rem;
		line-height: 1.45;
	}

	.fine {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		font-size: 0.9rem;
		color: var(--color--text-shade);
		max-width: 70ch;

		p {
			margin: 0;
		}
	}

	.cta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs);
	}

	// Three cards side by side stop being readable before the phone breakpoint,
	// so they stack a step earlier than the old table did.
	@include for-tablet-portrait-down {
		.plans {
			grid-template-columns: 1fr;
		}
	}
</style>
