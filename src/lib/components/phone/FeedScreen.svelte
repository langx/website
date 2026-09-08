<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import Segmented from '$lib/components/atoms/Segmented.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import TabBar from './TabBar.svelte';
	import { inview } from '$lib/utils/inview';

	/**
	 * `app/(app)/(tabs)/feed` from the design handoff, on its Corrections tab.
	 * Everything you can do to a post is a quiet blue word under it — the feed
	 * carries no yellow, because committing happens in the correction sheet.
	 */
</script>

<div class="screen" use:inview={{ threshold: 0.35 }}>
	<div class="head">
		<div class="title-row">
			<h2 class="title">Feed</h2>
			<span class="ask">+ Ask</span>
		</div>
		<div class="seg"><Segmented options={['Corrections', 'Pronunciation']} active={0} /></div>
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
					<span class="name">Daniel K.</span>
					<span class="meta">Spanish · 12 min</span>
				</div>
			</div>
			<p class="text">Me gusta mucho el café pero yo no puedo dormir después de las seis.</p>
			<div class="actions">
				<span class="like"><UiIcon name="heart" size={18} />3</span>
				<span class="count">No corrections yet</span>
				<span class="correct">Correct this</span>
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
					<span class="name">Mateo P.</span>
					<span class="meta">English · 1 h</span>
				</div>
				<span class="top">Top</span>
			</div>
			<p class="text">Yesterday I was very tired, so I go to bed early.</p>
			<div class="top-correction">
				<span class="from">Top correction · James W.</span>
				<span class="fixed">…so I <s>go</s> <strong>went</strong> to bed early.</span>
			</div>
			<div class="actions">
				<span class="like liked"><UiIcon name="heart" size={18} />12</span>
				<span class="count">4 corrections</span>
				<span class="correct">Correct this</span>
			</div>
		</li>

		<li class="post">
			<div class="author">
				<Avatar src="/images/people/ana.webp" initials="AC" tone="ink" size={40} name="Ana C." />
				<div class="who">
					<span class="name">Ana C.</span>
					<span class="meta">English · 3 h</span>
				</div>
			</div>
			<p class="text">Today the weather is very nice, I want go to the park.</p>
			<div class="actions">
				<span class="like"><UiIcon name="heart" size={18} />1</span>
				<span class="count">1 correction</span>
				<span class="correct">Correct this</span>
			</div>
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
		padding: 12px 20px 0;
	}

	.title-row {
		display: flex;
		align-items: center;
		gap: 14px;
		min-height: 48px;
	}

	.title {
		margin: 0;
		flex: 1;
		font-size: 34px;
		font-weight: 800;
		line-height: 1.15;
		letter-spacing: 0;
	}

	.ask {
		display: flex;
		align-items: center;
		height: 40px;
		padding: 0 14px;
		border-radius: var(--radius-pill);
		font-size: 15px;
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
		padding: 8px 20px 0;
	}

	.post {
		padding: 22px 0;
		border-bottom: 1px solid var(--color--border);
		display: flex;
		flex-direction: column;
		gap: 14px;

		&:last-child {
			border-bottom: 0;
		}
	}

	.author {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.who {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.name {
		font-family: var(--font--title);
		font-size: 15px;
		font-weight: 800;
	}

	.meta {
		font-size: 13px;
		color: var(--color--text-tertiary);
	}

	// The one ink-filled thing on the screen: the post the community rated
	// highest today.
	.top {
		flex: 0 0 auto;
		padding: 4px 10px;
		border-radius: var(--radius-pill);
		background: var(--color--text);
		color: var(--color--text-inverse);
		font-size: 12px;
		font-weight: 700;
	}

	.text {
		margin: 0;
		font-size: 18px;
		line-height: 1.5;
		text-wrap: pretty;
	}

	.top-correction {
		display: flex;
		flex-direction: column;
		gap: 4px;
		background: var(--color--success-tint);
		border-radius: var(--radius-lg);
		padding: 14px 16px;

		.from {
			font-size: 12px;
			font-weight: 700;
			color: var(--color--success);
		}

		.fixed {
			font-size: 16px;
			line-height: 1.45;

			s {
				color: var(--color--text-shade);
			}

			strong {
				color: var(--color--success);
				font-weight: 800;
			}
		}
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 20px;
		font-size: 14px;
		font-weight: 600;
	}

	.like {
		display: flex;
		align-items: center;
		gap: 6px;
		color: var(--color--text-shade);

		&.liked {
			color: var(--color--error);
		}
	}

	.count {
		color: var(--color--text-shade);
	}

	.correct {
		margin-left: auto;
		color: var(--color--accent);
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
