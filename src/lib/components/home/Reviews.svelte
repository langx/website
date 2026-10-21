<script lang="ts">
	import { reviews } from '$lib/data/reviews';
	import { rise } from '$lib/utils/rise';

	// Three real Google Play reviews, quoted as written (data/reviews.ts).
	const picks = ['Amanda Hernandez', 'Erica Harris', 'Elias'];
	const shown = reviews.filter((r) => picks.includes(r.name));
	const tones = ['tangerine', 'aqua', 'lime'];
</script>

<section class="reviews" aria-labelledby="reviews-title" use:rise>
	<h2 id="reviews-title" class="display-section" data-rise>what people say.</h2>
	<ul role="list" class="cards">
		{#each shown as review, i}
			<li class="card" data-rise>
				<blockquote>“{review.body}”</blockquote>
				<span class="who">
					{#if review.avatar}
						<img
							src={review.avatar}
							alt=""
							width="36"
							height="36"
							loading="lazy"
							decoding="async"
						/>
					{:else}
						<span class="initials" data-hue={tones[i]}>{review.initials}</span>
					{/if}
					<span class="meta">
						<span class="name">{review.name}</span>
						<span class="store">{review.store}</span>
					</span>
				</span>
			</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	.reviews {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.cards {
		display: grid;
		gap: 12px;

		@media (min-width: 900px) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 24px;
		padding: 22px;
		border-radius: 24px;
		background: var(--color--muted);
	}

	blockquote {
		margin: 0;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.0625rem;
		line-height: 1.5;
	}

	.who {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	img,
	.initials {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		flex: 0 0 auto;
	}

	.initials {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 0.875rem;
	}

	.meta {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}

	.name {
		font-weight: 700;
		font-size: 0.9375rem;
	}

	.store {
		font-size: 0.8125rem;
		color: var(--color--text-shade);
	}
</style>
