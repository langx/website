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
	Three rows, one idea each, with the screen that shows it on the other side;
	then six more things in a grid of hairlines.
-->
<section id="features" class="features">
	<div class="row" data-reveal use:reveal={{ x: -40, y: 0 }}>
		<div class="text">
			<span class="eyebrow">Matching</span>
			<h2>Matching goes both ways</h2>
			<p>
				You only see people who speak the language you're learning and are learning yours. Every
				conversation is useful for both of you — never a favour one person does for the other.
			</p>
		</div>
		<div class="visual">
			<div class="pair" aria-hidden="true">
				<div class="pill">
					<span class="name">You</span>
					<span class="langs">speak English · learning Spanish</span>
				</div>
				<span class="swap">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path
							d="M7 4v16"
						/></svg
					>
				</span>
				<div class="pill">
					<span class="name">María</span>
					<span class="langs">speaks Spanish · learning English</span>
				</div>
			</div>
		</div>
	</div>

	<div class="row flip green" data-reveal use:reveal={{ x: 40, y: 0 }}>
		<div class="text">
			<span class="eyebrow">Corrections</span>
			<h2>Unlimited corrections, on every plan</h2>
			<p>
				Anyone can correct any message, and it's never rationed. The part that teaches stays free,
				forever.
			</p>
		</div>
		<div class="visual">
			<div class="chat" aria-hidden="true">
				<span class="bubble mine">I goed to the market yesterday</span>
				<span class="note correction"><span><s>goed</s> <strong>went</strong> ✓</span></span>
			</div>
		</div>
	</div>

	<div class="row" data-reveal use:reveal={{ x: -40, y: 0 }}>
		<div class="text">
			<span class="eyebrow">Translation</span>
			<h2>Translate without leaving the chat</h2>
			<p>Stuck on a word? Tap it. Voice notes, photos and video when typing isn't enough.</p>
		</div>
		<div class="visual">
			<div class="chat" aria-hidden="true">
				<span class="bubble theirs">¿Nos vemos mañana en la biblioteca?</span>
				<span class="note translation">
					<span class="label">Translation</span>
					<span>See you tomorrow at the library?</span>
				</span>
			</div>
		</div>
	</div>

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
		padding: 110px 0 0;
		display: flex;
		flex-direction: column;
		gap: 90px;

		@include for-phone-only {
			padding-top: 72px;
			gap: 64px;
		}
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 48px;

		&.flip {
			flex-wrap: wrap-reverse;
			flex-direction: row-reverse;
		}
	}

	.green .eyebrow {
		color: var(--color--success);
	}

	.text {
		flex: 1 1 300px;
		display: flex;
		flex-direction: column;
		gap: 14px;

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
			max-width: 44ch;
		}
	}

	.visual {
		flex: 1 1 300px;
		display: flex;
		justify-content: center;
	}

	// Matching: two people, and the arrows that make them a pair.
	.pair {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		max-width: 340px;
	}

	.pill {
		display: flex;
		align-items: center;
		gap: 12px;
		border: 2px solid var(--color--border);
		border-radius: var(--radius-pill);
		padding: 10px 18px;

		.name {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 0.875rem;
		}

		.langs {
			flex: 1;
			text-align: right;
			font-size: 0.875rem;
			color: var(--color--text-shade);
		}
	}

	.swap {
		align-self: center;
		display: flex;
		color: var(--color--accent);
	}

	// Corrections and translation: one message, and what happens to it.
	.chat {
		width: 100%;
		max-width: 340px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.bubble {
		max-width: 85%;
		padding: 10px 14px;
		border-radius: var(--radius-lg);
		font-size: 0.9375rem;
		line-height: 1.45;
	}

	.mine {
		align-self: flex-end;
		background: var(--color--accent);
		color: var(--color--accent-contrast);
		border-bottom-right-radius: 4px;
	}

	.theirs {
		align-self: flex-start;
		background: var(--color--muted);
		border-bottom-left-radius: 4px;
	}

	.note {
		max-width: 85%;
		border: 2px solid;
		border-radius: var(--radius-lg);
		padding: 8px 14px;
		font-size: 0.875rem;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.correction {
		align-self: flex-end;
		border-color: var(--color--success);
		background: var(--color--success-tint);

		s {
			color: var(--color--text-tertiary);
		}

		strong {
			color: var(--color--success);
		}
	}

	.translation {
		align-self: flex-start;
		border-color: var(--color--accent-tint);
		background: var(--color--accent-tint);

		.label {
			font-size: 0.6875rem;
			font-weight: 700;
			letter-spacing: 0.05em;
			text-transform: uppercase;
			color: var(--color--accent-shade);
		}
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
