<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import LevelBars from '$lib/components/atoms/LevelBars.svelte';
	import Segmented from '$lib/components/atoms/Segmented.svelte';
	import TabBar from './TabBar.svelte';
	import { inview } from '$lib/utils/inview';
</script>

<div class="screen" use:inview={{ threshold: 0.35 }}>
	<div class="head">
		<div class="title-row">
			<h2 class="title">Feed</h2>
			<span class="ask">+ Ask</span>
		</div>
		<div class="seg"><Segmented options={['Needs correction', 'Following']} active={0} /></div>
	</div>

	<ul class="list" role="list">
		<li class="post">
			<div class="author">
				<Avatar
					src="/images/people/daniel.webp"
					initials="DK"
					tone="success"
					size={40}
					name="Daniel K."
				/>
				<div class="who">
					<div class="name">Daniel K.</div>
					<div class="meta"><span>Spanish</span><LevelBars level={2} /><span>· 12 min</span></div>
				</div>
				<span class="state none">No corrections</span>
			</div>
			<p class="text">Me gusta mucho el café pero yo no puedo dormir después de las seis.</p>
			<div class="actions">
				<span class="correct">Correct this</span>
				<span class="fine">Looks fine</span>
			</div>
		</li>

		<li class="post">
			<div class="author">
				<Avatar
					src="/images/people/mateo.webp"
					initials="MP"
					tone="accent"
					size={40}
					name="Mateo P."
				/>
				<div class="who">
					<div class="name">Mateo P.</div>
					<div class="meta"><span>English</span><LevelBars level={4} /><span>· 1 h</span></div>
				</div>
				<span class="state some">4 corrections</span>
			</div>
			<p class="text">Yesterday I was very tired, so I go to bed early.</p>
			<div class="top-correction">
				<div class="from">Top correction · James W.</div>
				<div class="fixed">…so I <s>go</s> <strong>went</strong> to bed early.</div>
			</div>
			<div class="links">
				<span class="add">Add yours</span>
				<span class="all">See all 4</span>
			</div>
		</li>

		<li class="post">
			<div class="author">
				<Avatar src="/images/people/ana.webp" initials="AC" tone="ink" size={40} name="Ana C." />
				<div class="who">
					<div class="name">Ana C.</div>
					<div class="meta"><span>English</span><LevelBars level={1} /><span>· 3 h</span></div>
				</div>
				<span class="state none">No corrections</span>
			</div>
			<p class="text">Today the weather is very nice, I want go to the park.</p>
		</li>
	</ul>

	<TabBar active="feed" />
</div>

<style lang="scss">
	.screen {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}

	.head {
		padding: 14px 24px 0;
	}

	.title-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}

	.title {
		margin: 0;
		font-size: 34px;
		font-weight: 800;
		line-height: 1.15;
		letter-spacing: 0;
	}

	.ask {
		font-size: 16px;
		font-weight: 700;
		color: var(--color--accent);
	}

	.seg {
		margin-top: 18px;
	}

	.list {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		padding: 6px 24px 0;
	}

	.post {
		padding: 20px 0;
		border-bottom: 1px solid var(--color--border);

		&:last-child {
			border-bottom: 0;
		}
	}

	.author {
		display: flex;
		align-items: center;
		gap: 11px;
	}

	.who {
		flex: 1;
		min-width: 0;
	}

	.name {
		font-family: var(--font--title);
		font-size: 16px;
		font-weight: 800;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		color: var(--color--text-shade);
	}

	.state {
		font-size: 13px;
		font-weight: 600;
		flex: 0 0 auto;

		&.none {
			color: var(--color--error);
		}
		&.some {
			color: var(--color--success);
		}
	}

	.text {
		font-size: 17px;
		line-height: 1.55;
		margin: 12px 0 0;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 14px;
	}

	.correct {
		background: var(--color--primary);
		color: var(--color--on-primary);
		font-family: var(--font--title);
		font-size: 14px;
		font-weight: 800;
		min-height: 44px;
		display: flex;
		align-items: center;
		padding: 0 20px;
		border-radius: var(--radius-pill);
	}

	.fine {
		font-size: 14px;
		font-weight: 600;
		color: var(--color--text-shade);
	}

	.top-correction {
		margin-top: 12px;
		background: var(--color--success-tint);
		border-radius: var(--radius-md);
		padding: 12px 14px;

		.from {
			font-size: 12px;
			font-weight: 700;
			color: var(--color--success);
		}

		.fixed {
			font-size: 15px;
			line-height: 1.5;
			margin-top: 5px;
			font-weight: 600;

			s {
				font-weight: 400;
				color: var(--color--text-shade);
			}

			strong {
				color: var(--color--success);
				font-weight: 800;
			}
		}
	}

	.links {
		display: flex;
		gap: 20px;
		margin-top: 14px;
		font-size: 14px;

		.add {
			font-weight: 700;
			color: var(--color--accent);
		}
		.all {
			font-weight: 600;
			color: var(--color--text-shade);
		}
	}

	// Rows land one after another, 60ms apart, the first time the screen is seen.
	.post {
		opacity: 0;
		transform: translateY(10px);
		transition: opacity 400ms var(--ease-out), transform 400ms var(--ease-out);
	}
	.post:nth-child(2) {
		transition-delay: 60ms;
	}
	.post:nth-child(3) {
		transition-delay: 120ms;
	}
	.post:nth-child(4) {
		transition-delay: 180ms;
	}
	:global(.is-in) .post {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.post {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
