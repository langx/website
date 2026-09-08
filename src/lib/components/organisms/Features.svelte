<script lang="ts">
	import { reveal } from '$lib/utils/reveal';

	// Six more things, one line each. Every claim has to be true of the
	// shipping app; the paid one names its plan.
	const tiles = [
		{
			title: 'Open source',
			body: 'The whole app is free to read on GitHub, and free to run yourself.'
		},
		{
			title: 'Your data stays yours',
			body: 'Download or delete everything from inside the app. No ads, nothing sold.'
		},
		{
			title: 'Voice, photo and video',
			body: 'Practise pronunciation with voice notes; show what you mean with photos.'
		},
		{
			title: 'Streaks and tokens',
			body: 'A daily streak keeps you honest. Tokens you earn by chatting and correcting.'
		},
		{
			title: 'Dark theme',
			body: 'Easier on the eyes at night. Follows your system, or your choice.'
		},
		{
			title: 'LangX Copilot',
			body: 'Private AI feedback on your own messages. Later, for Polyglot.',
			pending: true
		}
	];
</script>

<!--
	What the chapters above do not stop to show: six more things, one line each,
	in the app's list grammar.
-->
<section id="features" class="features">
	<h2 data-reveal use:reveal={{ y: 24 }}>Everything else in the app</h2>

	<ul class="tiles" role="list" data-reveal-children use:reveal={{ children: true, stagger: 0.06 }}>
		{#each tiles as tile}
			<li class="tile">
				<h3>
					{tile.title}
					{#if tile.pending}<span class="soon">Coming soon</span>{/if}
				</h3>
				<p>{tile.body}</p>
			</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.features {
		padding: var(--space-3xl) 0 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);

		@include for-phone-only {
			padding-top: var(--space-2xl);
		}
	}

	h2 {
		margin: 0;
		font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
		line-height: 1.15;
		letter-spacing: -0.015em;
	}

	.tiles {
		border-top: 1px solid var(--color--border);
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		column-gap: 56px;
	}

	.tile {
		padding: 26px 0;
		border-bottom: 1px solid var(--color--border);
		display: flex;
		flex-direction: column;
		gap: 6px;

		h3 {
			margin: 0;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 8px;
			font-size: 1.0625rem;
		}

		p {
			margin: 0;
			font-size: 0.9375rem;
			line-height: 1.6;
			color: var(--color--text-shade);
		}
	}

	.soon {
		font-family: var(--font--default);
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color--text-shade);
		border: 1px solid var(--color--border);
		border-radius: var(--radius-pill);
		padding: 2px 8px;
	}
</style>
