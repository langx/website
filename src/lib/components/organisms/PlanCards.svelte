<script lang="ts">
	import { plans, planNotes } from '$lib/data/plans';
	import { reveal } from '$lib/utils/reveal';

	/**
	 * `detailed` is the plans page: the notes under each point are shown, and
	 * the section title is left to the page header above. That page ships no
	 * JS (csr = dev), so nothing on it may start hidden for a reveal.
	 */
	export let detailed = false;
</script>

<!-- Three cards from plans.ts, so a limit that changes there changes here. -->
<section id="plans" class="plans" class:detailed>
	{#if !detailed}
		<header class="head" data-reveal use:reveal>
			<span class="eyebrow">Plans</span>
			<h2>Free is a real plan, not a trial</h2>
			<p>Each tier only lists what's new. Prices are set per region and shown in the app.</p>
		</header>
	{/if}

	<div
		class="grid"
		data-reveal-children={detailed ? undefined : true}
		use:reveal={{ children: true, stagger: 0.1 }}
	>
		{#each plans as plan}
			<article class="card {plan.tone ?? 'free'}">
				<div class="name">
					<h3>{plan.name}</h3>
					<p>{plan.tagline}</p>
				</div>
				<ul class="rows" role="list">
					{#each plan.points as point}
						<li>
							<span class="label">
								{point.label}{#if point.pending}
									<span class="soon">Coming soon</span>{/if}
							</span>
							{#if detailed && point.note}<small>{point.note}</small>{/if}
						</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>

	<p class="notes">{planNotes.join(' ')}</p>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.plans {
		padding: 110px 0 0;

		@include for-phone-only {
			padding-top: 72px;
		}

		&.detailed {
			padding-top: 0;

			.grid {
				margin-top: 0;
			}
		}
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: 12px;
		max-width: 60ch;

		h2 {
			margin: 0;
			font-weight: 900;
			font-size: clamp(1.625rem, 3vw, 2.125rem);
			line-height: 1.15;
		}

		p {
			margin: 0;
			font-size: 1.0625rem;
			line-height: 1.65;
			color: var(--color--text-shade);
		}
	}

	.grid {
		margin-top: 48px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 24px;
	}

	.free {
		--edge: var(--color--border);
		--tone: var(--color--text);
	}
	.pro {
		--edge: var(--color--accent);
		--tone: var(--color--accent-shade);
	}
	.pro-plus {
		--edge: var(--color--text);
		--tone: var(--color--text);
	}

	.card {
		border: 2px solid var(--edge);
		border-radius: var(--radius-xl);
		padding: 28px;
		background: var(--color--surface);
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.name {
		display: flex;
		flex-direction: column;
		gap: 4px;

		h3 {
			margin: 0;
			font-weight: 900;
			font-size: 1.375rem;
			color: var(--tone);
		}

		p {
			margin: 0;
			font-size: 0.875rem;
			color: var(--color--text-shade);
		}
	}

	li {
		padding: 10px 0;
		font-size: 0.9375rem;
		line-height: 1.5;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	small {
		font-size: 0.8125rem;
		line-height: 1.45;
		color: var(--color--text-shade);
	}

	.soon {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color--text-shade);
		border: 1px solid var(--color--border);
		border-radius: var(--radius-pill);
		padding: 2px 8px;
		margin-left: 6px;
	}

	.notes {
		margin: 20px 0 0;
		max-width: 70ch;
		font-size: 0.8125rem;
		color: var(--color--text-tertiary);
	}
</style>
