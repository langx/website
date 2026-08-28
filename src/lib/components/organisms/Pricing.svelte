<script lang="ts">
	import { planRows } from '$lib/data/plans';
	import AppStores from '$lib/components/molecules/AppStores.svelte';
</script>

<section id="pricing">
	<div class="table" role="table" aria-label="Free, Pro and Pro+ compared">
		<div class="row head" role="row">
			<span class="what" role="columnheader">&nbsp;</span>
			<span class="free" role="columnheader">Free</span>
			<span class="pro" role="columnheader">Pro</span>
			<span class="pro-plus" role="columnheader">Pro+</span>
		</div>

		{#each planRows as row}
			<div class="row" role="row">
				<span class="what" role="cell">
					{row.label}
					{#if row.note}<small>{row.note}</small>{/if}
				</span>
				<span class="free" role="cell"><span class="label">Free</span>{row.free}</span>
				<span class="pro" role="cell"><span class="label">Pro</span>{row.pro}</span>
				<span class="pro-plus" role="cell"><span class="label">Pro+</span>{row.proPlus}</span>
			</div>
		{/each}
	</div>

	<div class="fine">
		<p>
			The free plan's caps are counted over a <strong>rolling 24 hours</strong>, not a calendar day
			— so the fifth conversation you started yesterday evening frees up this evening, not at
			midnight.
		</p>
		<p>
			<strong>Pro+ is everything in Pro, plus LangX Copilot and Nearby.</strong> Copilot is not in the
			first release, so the row says so.
		</p>
		<p>
			Both are subscriptions, monthly or yearly, with a free trial. Prices are shown in the app in
			your own currency, because they are set per region.
		</p>
		<p>
			Tokens cannot buy Pro or Pro+, and never will. If they could, farming tokens would become a
			substitute for subscribing — and the subscription is what funds the app.
			<a href="/#token">More about LangX Token</a>.
		</p>
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

	.table {
		border: 1px solid var(--color--border);
		border-radius: var(--radius-lg);
		background: var(--color--card-background);
		overflow: hidden;
	}

	.row {
		display: grid;
		grid-template-columns: minmax(0, 2.2fr) repeat(3, minmax(0, 1fr));
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		border-bottom: 1px solid var(--color--border);
		align-items: baseline;

		&:last-child {
			border-bottom: 0;
		}

		&.head {
			font-weight: 700;
			background: rgba(var(--color--text-rgb), 0.03);

			.pro {
				color: var(--color--pro);
			}

			.pro-plus {
				color: var(--color--pro-plus);
			}
		}
	}

	.what {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
		font-weight: 600;

		small {
			font-weight: 400;
			font-size: 0.82rem;
			color: var(--color--text-shade);
			line-height: 1.45;
			max-width: 62ch;
		}
	}

	.free,
	.pro,
	.pro-plus {
		font-size: 0.95rem;
	}

	// Only shown once the table collapses into stacked cards on phones.
	.label {
		display: none;
		font-weight: 700;
		color: var(--color--text-shade);
		margin-right: var(--space-2xs);
	}

	.fine {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		font-size: 0.95rem;
		color: var(--color--text-shade);
		max-width: 70ch;

		strong {
			color: var(--color--text);
		}
	}

	.cta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs);
	}

	// A four-column table cannot survive 375px. Below tablet each row becomes a
	// small card with its own Free/Pro/Pro+ labels. Checked at 768px with the
	// third column added: the value cells still fit on one line there, so the
	// breakpoint stays where it was.
	@include for-phone-only {
		.row {
			grid-template-columns: 1fr;
			gap: var(--space-3xs);

			&.head {
				display: none;
			}
		}

		.what {
			margin-bottom: var(--space-3xs);
		}

		.label {
			display: inline;
		}
	}
</style>
