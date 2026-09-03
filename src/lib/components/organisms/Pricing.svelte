<script lang="ts">
	import { plans, planNotes } from '$lib/data/plans';
	import AppStores from '$lib/components/molecules/AppStores.svelte';
	import PhoneFrame from '$lib/components/phone/PhoneFrame.svelte';
	import PaywallScreen from '$lib/components/phone/PaywallScreen.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
</script>

<section id="pricing" class="pricing">
	<div class="plans">
		{#each plans as plan}
			<article class="plan">
				<header>
					<h2>{plan.name}</h2>
					<p class="tagline">{plan.tagline}</p>
				</header>
				<ul class="rows" role="list">
					{#each plan.points as point}
						<li>
							<UiIcon name="check" size={16} strokeWidth={3} />
							<div class="point">
								<span class="label">
									{point.label}
									{#if point.pending}<em>Coming soon</em>{/if}
								</span>
								{#if point.note}<small>{point.note}</small>{/if}
							</div>
						</li>
					{/each}
				</ul>
			</article>
		{/each}

		<div class="fine">
			{#each planNotes as note}
				<p>{note}</p>
			{/each}
		</div>

		<div class="cta" use:ownsPrimary>
			<AppStores primary size="lg" />
		</div>
	</div>

	<div class="device">
		<div class="sticky">
			<PhoneFrame
				label="The plans screen in the app: Fluent and Polyglot benefits, with the price shown per region"
			>
				<PaywallScreen />
			</PhoneFrame>
		</div>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.pricing {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
		gap: var(--space-2xl);
		align-items: start;
		padding-bottom: var(--space-2xl);

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
			gap: var(--space-xl);
		}
	}

	.plans {
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--color--border);
	}

	.plan {
		padding: var(--space-lg) 0;
		border-bottom: 1px solid var(--color--border);

		h2 {
			font-size: 1.75rem;
		}
	}

	.tagline {
		margin: 4px 0 var(--space-sm);
		font-size: 1rem;
		color: var(--color--text-shade);
	}

	.rows li {
		display: flex;
		gap: 12px;
		padding: 11px 0;
		color: var(--color--accent);

		:global(svg) {
			margin-top: 4px;
		}
	}

	.point {
		display: flex;
		flex-direction: column;
		gap: 3px;
		color: var(--color--text);
		font-size: 1rem;
		line-height: 1.45;
	}

	.label em {
		font-style: normal;
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color--text-quiet);
		margin-left: 6px;
		white-space: nowrap;
	}

	small {
		font-size: 0.875rem;
		line-height: 1.45;
		color: var(--color--text-shade);
	}

	.fine {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: var(--space-md) 0;
		font-size: 0.875rem;
		color: var(--color--text-quiet);
		max-width: 62ch;

		p {
			margin: 0;
		}
	}

	.cta {
		padding: var(--space-xs) 0 0;
	}

	.device {
		--phone-zoom: 0.8;
		display: flex;
		justify-content: center;

		@include for-tablet-portrait-down {
			justify-content: flex-start;
			--phone-zoom: 0.72;
		}

		@include for-phone-only {
			--phone-zoom: 0.66;
		}
	}

	.sticky {
		position: sticky;
		top: calc(var(--header-height) + 24px);

		@include for-tablet-portrait-down {
			position: static;
		}
	}
</style>
