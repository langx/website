<script lang="ts">
	import { plans } from '$lib/data/plans';
	import { reveal } from '$lib/utils/reveal';
</script>

<!-- Three cards from plans.ts, so a limit that changes there changes here. -->
<section id="plans" class="plans">
	<header class="head" data-reveal use:reveal>
		<h2>Plans</h2>
		<p>Corrections and replies are unlimited on every plan. Prices are shown in the app.</p>
	</header>

	<div class="grid" data-reveal-children use:reveal={{ children: true, stagger: 0.1 }}>
		{#each plans as plan}
			<article class="card {plan.tone ?? 'free'}">
				<div class="name">
					<span class="title">{plan.name}</span>
					<span class="tagline">{plan.tagline}</span>
				</div>
				<ul role="list">
					{#each plan.points as point}
						<li>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg
							>
							<span>
								{point.label}{#if point.pending}
									<em>Coming soon</em>{/if}
							</span>
						</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>
</section>

<style lang="scss">
	.plans {
		max-width: 1060px;
		margin: 0 auto;
		padding: 60px 0 110px;
	}

	.head {
		text-align: center;

		h2 {
			margin: 0 0 12px;
			font-weight: 900;
			font-size: clamp(1.9rem, 4vw, 2.6rem);
			letter-spacing: -0.015em;
		}

		p {
			margin: 0 auto 56px;
			max-width: 52ch;
			font-size: 1.125rem;
			color: var(--color--text-shade);
		}
	}

	.grid {
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
		--tone: var(--color--accent);
	}
	.pro-plus {
		--edge: var(--color--pro);
		--tone: var(--color--pro);
	}

	.card {
		border: 2px solid var(--edge);
		border-radius: 24px;
		padding: 30px 26px;
		background: var(--color--surface);
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.name {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.title {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.4rem;
		color: var(--tone);
	}

	.tagline {
		font-size: 0.9375rem;
		color: var(--color--text-shade);
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	li {
		display: flex;
		gap: 10px;
		font-size: 0.9875rem;
		line-height: 1.45;

		svg {
			flex: 0 0 auto;
			margin-top: 2px;
			color: var(--color--accent);
		}
	}

	em {
		font-style: normal;
		font-size: 0.8125rem;
		color: var(--color--text-quiet);
		margin-left: 6px;
	}
</style>
