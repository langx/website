<script lang="ts">
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import { legacyTokenDivisor, welcomeBackBonus } from '$lib/data/token';

	/**
	 * `app/(onboarding)/welcome-back` from the design handoff — what a
	 * returning v1 user sees. The 20 carried-over tokens are a demo balance;
	 * the rate and the bonus are the real ones from `$lib/data/token.ts`.
	 */
	const carried = 20;

	const rows = [
		{
			icon: 'person',
			title: '@sofia is still yours',
			body: 'Handles carried over. Nobody could take it while you were away.'
		},
		{
			icon: 'chat',
			title: '12 conversations imported',
			body: 'Full history, both sides, in the order you left them.'
		},
		{
			icon: 'wallet',
			title: `${carried + welcomeBackBonus} tokens`,
			body: `${carried} carried over at the new rate (÷${legacyTokenDivisor}), plus a ${welcomeBackBonus}-token welcome bonus.`
		},
		{
			icon: 'zap',
			title: '34-day streak, still counting',
			body: 'Restored alive on the day you come back, not reset to zero. It costs nothing.'
		}
	];
</script>

<div class="screen">
	<h2 class="title">Welcome back</h2>
	<p class="sub">Here is what came with you.</p>

	<div class="list">
		{#each rows as row}
			<div class="item">
				<span class="glyph"><UiIcon name={row.icon} size={22} /></span>
				<div class="text">
					<span class="k">{row.title}</span>
					<span class="d">{row.body}</span>
				</div>
			</div>
		{/each}
	</div>

	<span class="cta">Start exploring</span>
</div>

<style lang="scss">
	@import '$lib/scss/_mixins.scss';

	.screen {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		gap: 18px;
		padding: 24px 24px 28px;
	}

	.title {
		margin: 12px 0 0;
		font-size: 34px;
		font-weight: 800;
		line-height: 1.15;
		letter-spacing: 0;
	}

	.sub {
		margin: 0;
		font-size: 17px;
		line-height: 1.5;
		color: var(--color--text-shade);
	}

	.list {
		flex: 1;
		min-height: 0;
		margin-top: 8px;
		border-top: 1px solid var(--color--border);
	}

	.item {
		display: flex;
		gap: 16px;
		padding: 18px 0;
		border-bottom: 1px solid var(--color--border);
	}

	// One 40px blue disc per thing that survived the move.
	.glyph {
		width: 40px;
		height: 40px;
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-pill);
		background: var(--color--accent-tint);
		color: var(--color--accent);
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.k {
		font-family: var(--font--title);
		font-size: 17px;
		font-weight: 800;
	}

	.d {
		font-size: 14px;
		line-height: 1.45;
		color: var(--color--text-shade);
	}

	.cta {
		@include app-button;
		background: var(--color--primary);
		color: var(--color--on-primary);
	}
</style>
