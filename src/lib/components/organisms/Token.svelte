<script lang="ts">
	import {
		tokenEarning,
		tokenCaps,
		streakMilestones,
		tokenSinks,
		tokenIsNot
	} from '$lib/data/token';
	import ContentSection from '$lib/components/organisms/ContentSection.svelte';
</script>

<ContentSection
	id="token"
	title="LangX Token"
	description="An in-app point you earn by practising and by teaching. Not a cryptocurrency."
>
	<div class="token">
		<div class="grid">
			<div class="panel">
				<h3>How you earn it</h3>
				<ul class="rows">
					{#each tokenEarning as row}
						<li><span>{row.action}</span><b>{row.amount}</b></li>
					{/each}
				</ul>
				<p class="why">
					Correcting someone is worth five messages. That weighting is deliberate: teaching is the
					behaviour worth paying for.
				</p>
			</div>

			<div class="panel">
				<h3>The limits that keep it fair</h3>
				<ul class="bullets">
					{#each tokenCaps as cap}
						<li>{cap}</li>
					{/each}
				</ul>
			</div>

			<div class="panel">
				<h3>Streak bonuses</h3>
				<ul class="rows">
					{#each streakMilestones as milestone}
						<li><span>Day {milestone.day}</span><b>+{milestone.bonus}</b></li>
					{/each}
				</ul>
				<p class="why">
					A day counts when you actually do something — send a message or write a correction.
					Opening the app does not.
				</p>
			</div>

			<div class="panel">
				<h3>What you can spend it on</h3>
				<ul class="bullets">
					{#each tokenSinks as sink}
						<li><b>{sink.name}</b> — {sink.price}. {sink.description}</li>
					{/each}
				</ul>
				<p class="why">That is the complete list, and it is complete on purpose.</p>
			</div>
		</div>

		<div class="panel not">
			<h3>What LangX Token is not</h3>
			<ul class="bullets">
				{#each tokenIsNot as line}
					<li>{line}</li>
				{/each}
			</ul>
			<p class="why">
				The last one is the load-bearing one: if tokens could buy a Pro feature, farming tokens
				would become a substitute for subscribing, and the subscription is what funds the app.
			</p>
		</div>

		<p class="footnote">
			These are the current values and they can change — the economy is new and the right numbers
			can only be found with real activity. More detail at
			<a href="https://token.langx.io" target="_blank" rel="noopener noreferrer">token.langx.io</a>.
		</p>
	</div>
</ContentSection>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.token {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-md);

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
		}
	}

	.panel {
		background: var(--color--card-background);
		border: 1px solid var(--color--border);
		border-radius: var(--radius-lg);
		padding: var(--space-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);

		h3 {
			font-size: 1.15rem;
		}

		&.not {
			border-left: 3px solid var(--color--streak);
		}
	}

	.rows {
		display: flex;
		flex-direction: column;

		li {
			display: flex;
			justify-content: space-between;
			gap: var(--space-sm);
			padding: var(--space-2xs) 0;
			border-bottom: 1px solid var(--color--border);
			font-size: 0.95rem;

			&:last-child {
				border-bottom: 0;
			}

			b {
				font-variant-numeric: tabular-nums;
				white-space: nowrap;
			}
		}
	}

	.bullets {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		padding-left: 1.1em;
		list-style: disc;
		font-size: 0.95rem;
	}

	.why {
		font-size: 0.88rem;
		color: var(--color--text-shade);
		margin-top: auto;
		padding-top: var(--space-2xs);
	}

	.footnote {
		font-size: 0.88rem;
		color: var(--color--text-shade);
	}
</style>
