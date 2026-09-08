<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import { reveal } from '$lib/utils/reveal';

	// Twelve bars, tallest in the middle: a voice note that looks like speech.
	const bars = [3, 6, 10, 14, 9, 16, 12, 18, 8, 13, 6, 4];
</script>

<!--
	The whole product in two cards, after the three features that make it up.
	Left: who you are matched with, two messages, a correction, and translation
	one tap away. Right: a translated message, a voice note, a photo, and the
	streak and tokens that come from showing up.
-->
<section class="wrap" data-reveal-children use:reveal={{ children: true, stagger: 0.12, y: 40 }}>
	<div class="card" role="img" aria-label="A LangX chat: two messages, then a correction">
		<div class="who">
			<Avatar src="/images/people/maria.webp" initials="M" tone="accent" size={36} name="María" />
			<span class="meta">
				<span class="name">María</span>
				<span class="langs">speaks Spanish · learning English</span>
			</span>
		</div>
		<p class="bubble theirs">¡Hola! Yo aprendo inglés hace dos años 😄</p>
		<p class="bubble mine">Estudio español hace dos mes</p>
		<div class="note correction">
			<span class="label">Correction</span>
			<span class="text">hace dos <s>mes</s> <strong>meses</strong> ✓</span>
		</div>
		<span class="translate">
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path
					d="m22 22-5-10-5 10"
				/><path d="M14 18h6" /></svg
			>
			Translate
		</span>
	</div>

	<div
		class="card"
		role="img"
		aria-label="A LangX chat: a translated message, a voice note, a photo, and a streak"
	>
		<div class="who">
			<Avatar src="/images/people/kenji.webp" initials="K" tone="success" size={36} name="Kenji" />
			<span class="meta">
				<span class="name">Kenji</span>
				<span class="langs">speaks Japanese · learning English</span>
			</span>
		</div>
		<p class="bubble theirs">6時に駅で会おう！</p>
		<div class="note translation">
			<span class="label">Translation</span>
			<span class="text">Let's meet at the station at 6!</span>
		</div>
		<div class="bubble mine voice">
			<span class="play" aria-hidden="true">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
					><path d="M7 4v16l13-8z" /></svg
				>
			</span>
			<span class="wave" aria-hidden="true">
				{#each bars as h}<i style="height:{h}px" />{/each}
			</span>
			<span class="length">0:07</span>
		</div>
		<div class="bubble theirs photo">
			<span class="picture" aria-hidden="true">☕</span>
			<span class="caption">駅前のカフェ</span>
		</div>
		<div class="earned">
			<span>🔥 12-day streak</span>
			<span>+20 tokens today</span>
		</div>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.wrap {
		max-width: 840px;
		margin: 0 auto;
		// The section that follows draws the hairline; the cards need room
		// above it or they read as sitting on the line.
		padding: 110px 0 var(--space-3xl);
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 24px;
		align-items: start;

		@include for-phone-only {
			padding: 72px 0 var(--space-2xl);
		}
	}

	.card {
		background: var(--color--surface);
		border: 2px solid var(--color--border);
		border-radius: var(--radius-xl);
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		text-align: left;
	}

	.who {
		display: flex;
		align-items: center;
		gap: 10px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--color--border);
	}

	.meta {
		display: flex;
		flex-direction: column;
	}

	.name {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
	}

	.langs {
		font-size: 0.75rem;
		color: var(--color--text-shade);
	}

	.bubble {
		margin: 0;
		max-width: 85%;
		padding: 10px 14px;
		border-radius: var(--radius-lg);
		font-size: 0.9375rem;
		line-height: 1.45;
	}

	.theirs {
		align-self: flex-start;
		background: var(--color--muted);
		border-bottom-left-radius: 4px;
	}

	.mine {
		align-self: flex-end;
		background: var(--color--accent);
		color: var(--color--accent-contrast);
		border-bottom-right-radius: 4px;
	}

	.note {
		max-width: 85%;
		border: 2px solid;
		border-radius: var(--radius-lg);
		padding: 8px 14px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.label {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.text {
		font-size: 0.875rem;
	}

	.correction {
		align-self: flex-end;
		border-color: var(--color--success);
		background: var(--color--success-tint);

		.label,
		strong {
			color: var(--color--success);
		}

		s {
			color: var(--color--text-tertiary);
		}
	}

	.translation {
		align-self: flex-start;
		border-color: var(--color--accent-tint);
		background: var(--color--accent-tint);

		.label {
			color: var(--color--accent-shade);
		}
	}

	.translate {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 2px;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color--accent);
	}

	// A voice note: play, the shape of the sound, how long it is.
	.voice {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 14px 8px 10px;
	}

	.play {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.25);
		display: grid;
		place-items: center;
	}

	.wave {
		display: flex;
		align-items: center;
		gap: 2px;
		height: 18px;

		i {
			display: block;
			width: 3px;
			border-radius: 2px;
			background: currentColor;
			opacity: 0.9;
		}
	}

	.length {
		font-size: 0.75rem;
		font-variant-numeric: tabular-nums;
		opacity: 0.85;
	}

	// A photo: the tile stands in for the picture, the caption is the message.
	.photo {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 6px 6px 8px;
	}

	.picture {
		width: 150px;
		height: 96px;
		border-radius: 12px;
		background: linear-gradient(135deg, var(--color--accent-tint), var(--color--success-tint));
		display: grid;
		place-items: center;
		font-size: 1.75rem;
	}

	.caption {
		padding: 0 8px;
		font-size: 0.875rem;
	}

	.earned {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding-top: 12px;
		border-top: 1px solid var(--color--border);

		span {
			font-size: 0.75rem;
			font-weight: 700;
			padding: 4px 10px;
			border-radius: var(--radius-pill);
			background: var(--color--muted);
			color: var(--color--text-shade);
		}
	}
</style>
