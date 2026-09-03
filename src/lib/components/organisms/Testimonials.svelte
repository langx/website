<script lang="ts">
	// Real reviews, quoted as written, from the public Google Play listing
	// (tech.newchapter.languageXchange). App Store ratings for the app exist
	// (5.0 from 11 ratings on 2 Sep 2026) but no written App Store reviews are
	// published in Apple's public feed, so the quotes are all Google Play.
	const reviews = [
		{
			name: 'Amanda Hernandez',
			store: 'Google Play',
			body: 'Great app!! If you are wanting to have real conversations with someone that speaks the language you are trying to learn, this app is what you need!'
		},
		{
			name: 'Erica Harris',
			store: 'Google Play',
			body: 'The admin team are awesome. This app has so much potential and they are working on it everyday to improve the experience.'
		},
		{
			name: 'Burak',
			store: 'Google Play',
			body: "As an English teacher, I came across it by chance with the idea that my students could get extra practice. I'm already looking forward to it. I definitely recommend it!"
		},
		{
			name: 'Aaron Ros',
			store: 'Google Play',
			body: "I must say this app look gorgeous. It's simple and straightforward but on the other hand has it's style and I personally have enjoyed signing up and completing my profile."
		},
		{
			name: 'Dasha Durneva',
			store: 'Google Play',
			body: 'Simple yet user-friendly design encourages to chat with language learners like myself. Highly recommend this app!!!'
		},
		{
			name: 'Martín Didoli',
			store: 'Google Play',
			body: 'The application is open source and the team behind it is really cool. Try it and meet cool people.'
		}
	];
</script>

<section id="reviews" class="reviews">
	<header class="head">
		<h2>What people say</h2>
		<p class="lede">Rated 5.0 on the App Store and 4.4 on Google Play.</p>
	</header>

	<ul class="grid" role="list">
		{#each reviews as review}
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
					<span class="store">{review.store}</span>
				</div>
			</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.reviews {
		padding: var(--space-3xl) 0 0;

		@include for-phone-only {
			padding-top: var(--space-2xl);
		}
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		max-width: 60ch;
	}

	.grid {
		margin-top: var(--space-lg);
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		column-gap: var(--space-2xl);

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
		}
	}

	.review {
		padding: 22px 0;
		border-bottom: 1px solid var(--color--border);
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.stars {
		display: inline-flex;
		gap: 2px;
		color: var(--color--streak);
	}

	blockquote {
		margin: 0;
		font-size: 1.0625rem;
		line-height: 1.55;
		color: var(--color--text);
	}

	.who {
		display: flex;
		align-items: baseline;
		gap: 8px;
		font-size: 0.9375rem;
	}

	.name {
		font-family: var(--font--title);
		font-weight: 800;
	}

	.store {
		color: var(--color--text-shade);
	}
</style>
