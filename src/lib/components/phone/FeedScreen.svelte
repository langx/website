<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import TabBar from './TabBar.svelte';
	import { inview } from '$lib/utils/inview';

	/**
	 * `app/(app)/(tabs)/feed` as one timeline, seen by Sofia (native English,
	 * learning Spanish), in the order the app ranks it: two open asks in her
	 * native language first, because she can answer them, then a Spanish moment
	 * she can learn from. The moment only takes likes and comments; the asks
	 * carry a quiet badge saying what they want. Only a post that asks can be corrected
	 * or answered with a recording. Everything you can do to a post is a quiet
	 * blue word under it; the feed carries no yellow.
	 */
</script>

<div class="screen" use:inview={{ threshold: 0.35 }}>
	<div class="head">
		<div class="title-row">
			<h2 class="title">Feed</h2>
			<span class="new">+ Post</span>
		</div>
	</div>

	<ul class="list" role="list">
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
			<span class="badge">Correction needed</span>
			<p class="text">Yesterday I go to bed very early.</p>
			<div class="top-correction">
				<span class="from">Top correction · James W.</span>
				<span class="fixed">Yesterday I <s>go</s> <strong>went</strong> to bed very early.</span>
			</div>
			<div class="actions">
				<span class="like liked"><UiIcon name="heart" size={18} />12</span>
				<span class="count">4 corrections</span>
				<span class="act">Correct this</span>
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
			<span class="badge">Pronunciation needed</span>
			<p class="text">I thoroughly enjoyed the weather today.</p>
			<div class="actions">
				<span class="play"><UiIcon name="play" size={14} />1 recording</span>
				<span class="act"><UiIcon name="mic" size={18} />Record</span>
			</div>
		</li>
		<li class="post">
			<div class="author">
				<Avatar
					src="/images/people/lucia.webp"
					initials="LM"
					tone="success"
					size={40}
					name="Lucía M."
				/>
				<div class="who">
					<span class="name">Lucía M.</span>
					<span class="meta">Spanish · 2 h</span>
				</div>
			</div>
			<p class="text">Por fin un día sin lluvia.</p>
			<!-- The photo is drawn, not shot: a replica has no one's real photo to show. -->
			<svg
				class="photo"
				viewBox="0 0 350 150"
				preserveAspectRatio="xMidYMid slice"
				aria-hidden="true"
			>
				<defs>
					<linearGradient id="feed-sky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stop-color="#6f8fc9" />
						<stop offset="0.25" stop-color="#e9b7a0" />
						<stop offset="0.35" stop-color="#f4d3a8" />
					</linearGradient>
					<linearGradient id="feed-sea" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stop-color="#5d7fae" />
						<stop offset="1" stop-color="#34507a" />
					</linearGradient>
				</defs>
				<rect width="350" height="150" fill="url(#feed-sky)" />
				<circle cx="238" cy="50" r="16" fill="#fbe3b8" />
				<rect y="52" width="350" height="98" fill="url(#feed-sea)" />
				<path d="M196 62h84M214 71h48M226 79h24" stroke="#f6d9ae" stroke-width="2" opacity="0.7" />
				<path d="M0 150V112c50-10 110-12 170-4s110 22 180 42Z" fill="#e3c79d" />
			</svg>
			<div class="actions">
				<span class="like"><UiIcon name="heart" size={18} />8</span>
				<span class="count"><UiIcon name="chat" size={18} />3 comments</span>
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

	.new {
		display: flex;
		align-items: center;
		height: 40px;
		padding: 0 14px;
		border-radius: var(--radius-pill);
		font-size: 15px;
		font-weight: 700;
		color: var(--color--accent);
	}

	.list {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		padding: 0 20px;
	}

	.post {
		padding: 18px 0;
		border-bottom: 1px solid var(--color--border);
		display: flex;
		flex-direction: column;
		gap: 12px;

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
	// highest today. Only a post asking for a correction can earn it.
	.top {
		flex: 0 0 auto;
		padding: 4px 10px;
		border-radius: var(--radius-pill);
		background: var(--color--text);
		color: var(--color--text-inverse);
		font-size: 12px;
		font-weight: 700;
	}

	// What the post asks for. A state, not a control, so it is an outlined
	// chip in ink-shade: never blue, and not green either, because nothing has
	// been corrected yet.
	.badge {
		align-self: flex-start;
		padding: 3px 10px;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-pill);
		color: var(--color--text-shade);
		font-size: 12px;
		font-weight: 700;
		line-height: 1.3;
	}

	.text {
		margin: 0;
		font-size: 18px;
		line-height: 1.5;
		text-wrap: pretty;
	}

	.photo {
		display: block;
		width: 100%;
		height: 150px;
		border-radius: 14px;
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

	.like,
	.count {
		display: flex;
		align-items: center;
		gap: 6px;
		color: var(--color--text-shade);
	}

	.like.liked {
		color: var(--color--error);
	}

	// The recordings pill; listening happens on the post screen.
	.play {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		border-radius: var(--radius-pill);
		background: var(--color--muted);
		color: var(--color--text);
	}

	.act {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 6px;
		color: var(--color--accent);
	}

	// Rows land one after another, 60ms apart, the first time the screen is seen.
	.post {
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 400ms var(--ease-out),
			transform 400ms var(--ease-out);
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
