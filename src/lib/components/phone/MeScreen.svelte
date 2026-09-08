<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import LevelBars from '$lib/components/atoms/LevelBars.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import TabBar from './TabBar.svelte';
	import { inview } from '$lib/utils/inview';

	/**
	 * `app/(app)/(tabs)/me` from the design handoff: who you are, the pair you
	 * are here for, four numbers that each open a screen, and the week as two
	 * stacked bars a day — blue for messages, green for corrections.
	 */
	const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	const messages = [6, 9, 4, 12, 7, 0, 3];
	const corrections = [2, 3, 1, 4, 2, 0, 1];
	// Thursday is the week's peak; the app inks that day's letter.
	const peak = messages.indexOf(Math.max(...messages));
</script>

<div class="screen" use:inview={{ threshold: 0.4 }}>
	<div class="body">
		<div class="profile">
			<Avatar src="/images/people/sofia.webp" initials="SR" size={80} name="Sofia R." />
			<div class="who">
				<div class="name">Sofia R.</div>
				<div class="meta">@sofia · POLYGLOT</div>
			</div>
			<span class="icon-btn"><UiIcon name="scan" size={22} /></span>
			<span class="icon-btn"><UiIcon name="gear" size={22} /></span>
		</div>

		<div class="languages">
			<div class="lang">
				<span class="lang-label">Teaches</span>
				<span class="lang-value">English</span>
			</div>
			<div class="lang">
				<span class="lang-label">Learns</span>
				<span class="lang-value">Spanish <LevelBars level={3} /></span>
			</div>
		</div>

		<div class="stats">
			<div class="stat">
				<span class="n"><UiIcon name="zap" size={18} />34</span>
				<span class="l">Day streak ›</span>
			</div>
			<div class="stat">
				<span class="n green">1,204</span>
				<span class="l">Corrections ›</span>
			</div>
			<div class="stat">
				<span class="n">5</span>
				<span class="l">Badges ›</span>
			</div>
			<div class="stat">
				<span class="n">862</span>
				<span class="l">Wallet ›</span>
			</div>
		</div>

		<div class="week">
			<div
				class="chart"
				role="img"
				aria-label="Messages and corrections per day this week, peaking on Thursday"
			>
				{#each days as d, i}
					<div class="day">
						<div class="stack">
							<span
								class="bar corr"
								style="--h:{corrections[i] * 7}%;--d:{i * 45}ms"
								class:zero={corrections[i] === 0}
							/>
							<span
								class="bar msg"
								style="--h:{messages[i] * 5}%;--d:{i * 45}ms"
								class:zero={messages[i] === 0}
							/>
						</div>
						<span class="day-letter" class:peak={i === peak}>{d}</span>
					</div>
				{/each}
			</div>
			<div class="legend">
				<span><span class="swatch msg" />Messages</span>
				<span><span class="swatch corr" />Corrections</span>
			</div>
		</div>

		<p class="bio">
			Learning Spanish properly this time. I correct every day, and I do not mind being corrected
			back.
		</p>

		<div class="row first">
			<div class="row-text">
				<span class="k">Who viewed your profile</span>
				<span class="d">31 people this week</span>
			</div>
			<span class="chev"><UiIcon name="chevron-right" size={18} /></span>
		</div>
		<div class="row">
			<div class="row-text">
				<span class="k">Followers and following</span>
				<span class="d">48 followers · 12 following</span>
			</div>
			<span class="chev"><UiIcon name="chevron-right" size={18} /></span>
		</div>
		<div class="row">
			<div class="row-text">
				<span class="k">Preview my profile</span>
				<span class="d">See your profile the way other people do</span>
			</div>
			<span class="chev"><UiIcon name="chevron-right" size={18} /></span>
		</div>

		<span class="edit">Edit profile</span>
	</div>

	<TabBar active="me" />
</div>

<style lang="scss">
	@import '$lib/scss/_mixins.scss';

	.screen {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}

	.body {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		padding: 12px 20px 0;
	}

	.profile {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 8px 0;
	}

	.who {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.name {
		font-family: var(--font--title);
		font-size: 24px;
		font-weight: 800;
		line-height: 1.2;
	}

	.meta {
		font-size: 14px;
		color: var(--color--text-shade);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		color: var(--color--text-shade);
		flex: 0 0 auto;
	}

	.languages {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		padding: 20px 0;
		border-bottom: 1px solid var(--color--border);
	}

	.lang {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.lang-label {
		font-size: 12px;
		font-weight: 700;
		color: var(--color--text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.lang-value {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: var(--font--title);
		font-size: 17px;
		font-weight: 800;
	}

	.stats {
		display: flex;
		gap: 10px;
		padding: 24px 0 20px;
		border-bottom: 1px solid var(--color--border);
	}

	.stat {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;

		.n {
			display: flex;
			align-items: center;
			gap: 4px;
			font-family: var(--font--title);
			font-size: 26px;
			font-weight: 800;
			font-variant-numeric: tabular-nums;

			&.green {
				color: var(--color--success);
			}
		}

		.l {
			font-size: 12px;
			font-weight: 600;
			color: var(--color--text-shade);
		}
	}

	.week {
		padding: 12px 0 8px;
		border-bottom: 1px solid var(--color--border);
	}

	.chart {
		display: flex;
		align-items: flex-end;
		gap: 10px;
		height: 110px;
		padding: 8px 0;
	}

	.day {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 6px;
	}

	.stack {
		flex: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 2px;
	}

	// The bars grow from the baseline once the screen is looked at — the one
	// moment this screen owns.
	.bar {
		height: var(--h);
		min-height: 4px;
		border-radius: 4px;
		display: block;
		transform-origin: bottom;
		transform: scaleY(0.12);
		transition: transform 600ms var(--ease-out) var(--d);

		&.msg {
			background: var(--color--accent);
		}

		&.corr {
			background: var(--color--success);
		}

		// A day with nothing on it still shows the blue baseline, faintly.
		&.zero {
			min-height: 0;
			height: 2px;
			opacity: 0.3;

			&.corr {
				height: 0;
			}
		}
	}

	:global(.is-in) .bar {
		transform: scaleY(1);
	}

	.day-letter {
		font-size: 11px;
		font-weight: 600;
		color: var(--color--text-tertiary);

		&.peak {
			color: var(--color--text);
		}
	}

	.legend {
		display: flex;
		gap: 16px;
		padding-bottom: 8px;
		font-size: 12px;
		color: var(--color--text-shade);

		span {
			display: flex;
			align-items: center;
			gap: 6px;
		}
	}

	.swatch {
		width: 10px;
		height: 10px;
		border-radius: 3px;

		&.msg {
			background: var(--color--accent);
		}

		&.corr {
			background: var(--color--success);
		}
	}

	.bio {
		margin: 0;
		font-size: 16px;
		line-height: 1.55;
		padding: 22px 0;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 18px 0;
		border-bottom: 1px solid var(--color--border);

		&.first {
			border-top: 1px solid var(--color--border);
		}
	}

	.row-text {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.k {
		font-size: 17px;
		font-weight: 600;
	}

	.d {
		font-size: 14px;
		color: var(--color--text-shade);
	}

	.chev {
		color: var(--color--text-tertiary);
		display: flex;
	}

	.edit {
		@include app-button;
		margin: 32px 0;
		background: var(--color--primary);
		color: var(--color--on-primary);
	}

	@media (prefers-reduced-motion: reduce) {
		.bar {
			transition: none;
			transform: none;
		}
	}
</style>
