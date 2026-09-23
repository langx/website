<script lang="ts">
	import { reveal } from '$lib/utils/reveal';

	// The words are in `data/reviews.ts`, where /compare reads them too.
	import { reviews, ratingsLine } from '$lib/data/reviews';
</script>

<section id="reviews" class="reviews">
	<header class="head" data-reveal use:reveal>
		<span class="eyebrow">Reviews</span>
		<h2>What people say</h2>
		<p>{ratingsLine}</p>
	</header>

	<ul class="grid" role="list" data-reveal-children use:reveal={{ children: true, stagger: 0.08 }}>
		{#each reviews.slice(0, 6) as review}
			<li class="review">
				<div class="stars" role="img" aria-label="5 out of 5 stars">
					{#each [1, 2, 3, 4, 5] as star (star)}
						<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
							<path
								fill="currentColor"
								d="M12 2.8l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.7l-5.6 3.1 1.3-6.2L3 9.3l6.3-.7z"
							/>
						</svg>
					{/each}
				</div>
				<blockquote>{review.body}</blockquote>
				<div class="who">
					<span class="name">{review.name}</span>
					<span class="store">· {review.store}</span>
				</div>
			</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.reviews {
		padding: 110px 0 0;

		@include for-phone-only {
			padding-top: 72px;
		}
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: 12px;

		h2 {
			margin: 0;
			font-weight: 900;
			font-size: clamp(1.625rem, 3vw, 2.125rem);
			line-height: 1.15;
		}

		p {
			margin: 0;
			font-size: 1.0625rem;
			color: var(--color--text-shade);
		}
	}

	.grid {
		margin-top: 32px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		column-gap: 56px;
	}

	.review {
		padding: 24px 0;
		border-bottom: 1px solid var(--color--border);
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.stars {
		display: inline-flex;
		gap: 2px;
		color: var(--color--primary);
	}

	blockquote {
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color--text);
	}

	.who {
		font-size: 0.875rem;
	}

	.name {
		font-family: var(--font--title);
		font-weight: 800;
	}

	.store {
		color: var(--color--text-tertiary);
	}
</style>
