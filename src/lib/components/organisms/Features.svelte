<script lang="ts">
	import { reveal } from '$lib/utils/reveal';

	// Four rows, one idea each, the icon on alternating sides. Each row slides
	// in from the side its icon sits on.
	const features = [
		{
			tone: 'blue',
			title: 'Matched both ways',
			body: 'You speak what they are learning, they speak what you are learning. Every match is a fair trade — half the conversation in each language.',
			paths: ['M17 3l4 4-4 4', 'M3 7h18', 'M7 21l-4-4 4-4', 'M21 17H3']
		},
		{
			tone: 'green',
			title: 'Unlimited corrections',
			body: 'Tap any message to correct it, or get corrected. The part that actually teaches is never rationed — free plan included.',
			paths: ['M20 6L9 17l-5-5']
		},
		{
			tone: 'blue',
			title: 'Translation inside the chat',
			body: 'Stuck on a word? Translate any message without leaving the conversation. Voice and photo messages when typing is not enough.',
			paths: ['M5 8l6 6', 'M4 14l6-6 2-3', 'M2 5h12', 'M7 2h1', 'M22 22l-5-10-5 10', 'M14 18h6']
		},
		{
			tone: 'ink',
			title: 'Open source, no ads',
			body: 'The app and API are open source under BSD-3, and self-hostable. No ads, no advertising identifiers — your conversations are the product for you, not for us.',
			paths: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6']
		}
	];
</script>

<section id="features" class="features">
	{#each features as feature, i}
		<div
			class="row {feature.tone}"
			class:flip={i % 2 === 1}
			data-reveal
			use:reveal={{ x: i % 2 === 1 ? 40 : -40, y: 0 }}
		>
			<div class="icon" aria-hidden="true">
				<svg
					width="60"
					height="60"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					{#each feature.paths as d}
						<path {d} />
					{/each}
				</svg>
			</div>
			<div class="text">
				<h2>{feature.title}</h2>
				<p>{feature.body}</p>
			</div>
		</div>
	{/each}
</section>

<style lang="scss">
	.features {
		max-width: 960px;
		margin: 0 auto;
		padding: 0 0 40px;
	}

	.row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 56px;
		padding: 70px 0;

		&.flip {
			flex-direction: row-reverse;
		}
	}

	.blue {
		--tint: var(--color--accent-tint);
		--tone: var(--color--accent);
	}
	.green {
		--tint: var(--color--success-tint);
		--tone: var(--color--success);
	}
	.ink {
		--tint: var(--color--muted);
		--tone: var(--color--text);
	}

	.icon {
		flex: 0 0 auto;
		width: 150px;
		height: 150px;
		margin: 0 auto;
		border-radius: var(--radius-pill);
		background: var(--tint);
		color: var(--tone);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.text {
		flex: 1 1 340px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	h2 {
		margin: 0;
		font-weight: 900;
		font-size: clamp(1.7rem, 3vw, 2.3rem);
		line-height: 1.1;
		letter-spacing: -0.015em;
		color: var(--tone);
	}

	p {
		margin: 0;
		font-size: 1.125rem;
		line-height: 1.65;
		color: var(--color--text-shade);
		max-width: 44ch;
	}
</style>
