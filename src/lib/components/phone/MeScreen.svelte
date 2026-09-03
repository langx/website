<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import LevelBars from '$lib/components/atoms/LevelBars.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import TabBar from './TabBar.svelte';
	import { inview } from '$lib/utils/inview';

	// Percent of the chart's height, Monday to Sunday. Sunday has not happened.
	const week = [38, 52, 74, 24, 92, 56, 0];
	const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
</script>

<div class="screen" use:inview={{ threshold: 0.4 }}>
	<div class="body">
		<div class="profile">
			<Avatar src="/images/people/sofia.webp" initials="SR" size={72} name="Sofia R." />
			<div class="who">
				<div class="name">Sofia R.</div>
				<div class="meta">@sofia · Polyglot</div>
			</div>
			<span class="gear"><UiIcon name="gear" size={22} /></span>
		</div>

		<div class="stats">
			<div class="stat">
				<div class="n">🔥 34</div>
				<div class="l">Day streak</div>
			</div>
			<div class="stat">
				<div class="n green">1,204</div>
				<div class="l">Corrections</div>
			</div>
			<div class="stat">
				<div class="n">862</div>
				<div class="l">Tokens ›</div>
			</div>
		</div>

		<div class="week">
			<div class="week-head">
				<span class="week-title">This week</span>
				<span class="week-meta">41 messages · 18 corrections</span>
			</div>
			<div class="chart" role="img" aria-label="Messages per day this week, peaking on Friday">
				{#each week as h, i}
					<span class="bar" class:empty={h === 0} style="--h:{h || 28}%;--d:{i * 45}ms" />
				{/each}
			</div>
			<div class="days">
				{#each days as d}<span>{d}</span>{/each}
			</div>
		</div>

		<div class="row">
			<span class="k">Who viewed your profile</span>
			<span class="v">31 this week ›</span>
		</div>
		<div class="row">
			<span class="k">Badges</span>
			<span class="v">Coming back soon ›</span>
		</div>
		<div class="row last">
			<span class="k">Languages</span>
			<span class="v pair"><span>English → Spanish</span><LevelBars level={3} /><span>›</span></span
			>
		</div>
	</div>

	<TabBar active="me" />
</div>

<style lang="scss">
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
		padding: 14px 24px 0;
	}

	.profile {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.who {
		flex: 1;
		min-width: 0;
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
		margin-top: 2px;
	}

	.gear {
		color: var(--color--text-shade);
		display: inline-flex;
	}

	.stats {
		display: flex;
		margin-top: 24px;
		padding-bottom: 20px;
		border-bottom: 1px solid var(--color--border);
	}

	.stat {
		flex: 1;

		.n {
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
			margin-top: 2px;
		}
	}

	.week {
		padding: 18px 0;
		border-bottom: 1px solid var(--color--border);
	}

	.week-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.week-title {
		font-family: var(--font--title);
		font-size: 16px;
		font-weight: 800;
	}

	.week-meta {
		font-size: 13px;
		color: var(--color--text-shade);
	}

	.chart {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		height: 64px;
		margin-top: 14px;
	}

	// The bars grow from the baseline once the screen is looked at — the one
	// moment this screen owns.
	.bar {
		flex: 1;
		height: var(--h);
		background: var(--color--accent);
		border-radius: 6px;
		display: block;
		transform-origin: bottom;
		transform: scaleY(0.12);
		transition: transform 600ms var(--ease-out) var(--d);

		&.empty {
			background: var(--color--muted);
		}
	}

	:global(.is-in) .bar {
		transform: scaleY(1);
	}

	.days {
		display: flex;
		justify-content: space-between;
		margin-top: 8px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color--text-tertiary);
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 17px 0;
		border-bottom: 1px solid var(--color--border);

		&.last {
			border-bottom: 0;
		}
	}

	.k {
		font-size: 16px;
		font-weight: 600;
	}

	.v {
		font-size: 14px;
		color: var(--color--text-tertiary);
	}

	.pair {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	@media (prefers-reduced-motion: reduce) {
		.bar {
			transition: none;
			transform: none;
		}
	}
</style>
