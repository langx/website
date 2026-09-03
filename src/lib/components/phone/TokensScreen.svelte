<script lang="ts">
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import { inview } from '$lib/utils/inview';

	/**
	 * Screen 09. The balance and today's counters are demonstration data; the
	 * prices are the real ones from `$lib/data/token.ts`.
	 */
</script>

<div class="screen" use:inview={{ threshold: 0.4 }}>
	<div class="head">
		<UiIcon name="back" size={22} />
		<span class="title">Tokens</span>
	</div>

	<div class="body">
		<div class="balance">
			<div class="label">Balance</div>
			<div class="amount tabular">862</div>
			<p class="note">
				Earned by messaging and by correcting other people. Teaching is weighted higher than
				talking.
			</p>
		</div>

		<div class="pool">
			<div class="pool-head">
				<span class="pool-title">Today's pool</span>
			</div>
			<div class="share">
				<span class="plus">+84</span><span class="so-far">your share so far</span>
			</div>
			<div class="track"><span class="fill" /></div>
			<p class="note small">Cap 500 a day. Your share moves with everyone else's.</p>
		</div>

		<div class="sink">
			<div class="sink-text">
				<div class="k">Streak freeze</div>
				<div class="d">Rescues one missed day. You hold 1.</div>
			</div>
			<span class="price tabular">200</span>
		</div>
		<div class="sink">
			<div class="sink-text">
				<div class="k">Fill in a missed day</div>
				<div class="d">One empty square, within the last 14 days.</div>
			</div>
			<span class="price tabular">600</span>
		</div>
		<div class="sink">
			<div class="sink-text">
				<div class="k">Slate frame</div>
				<div class="d">The first of ten. Shows on your profile.</div>
			</div>
			<span class="price tabular">1,000</span>
		</div>

		<p class="legal">
			Tokens cannot be bought, traded, withdrawn, or used to unlock any paid plan. There is no
			chain, no contract and no market.
		</p>
	</div>
</div>

<style lang="scss">
	.screen {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}

	.head {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 24px 10px;
	}

	.title {
		font-family: var(--font--title);
		font-size: 24px;
		font-weight: 800;
	}

	.body {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		padding: 0 24px;
	}

	.balance {
		padding: 14px 0 22px;
		border-bottom: 1px solid var(--color--border);
	}

	.label {
		font-size: 13px;
		font-weight: 600;
		color: var(--color--text-tertiary);
	}

	.amount {
		font-family: var(--font--title);
		font-size: 56px;
		font-weight: 800;
		line-height: 1.05;
		margin-top: 2px;
	}

	.note {
		font-size: 15px;
		line-height: 1.55;
		color: var(--color--text-shade);
		margin: 10px 0 0;

		&.small {
			font-size: 13px;
		}
	}

	.pool {
		padding: 20px 0;
		border-bottom: 1px solid var(--color--border);
	}

	.pool-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.pool-title {
		font-family: var(--font--title);
		font-size: 16px;
		font-weight: 800;
	}

	.share {
		display: flex;
		align-items: baseline;
		gap: 9px;
		margin-top: 8px;
	}

	.plus {
		font-family: var(--font--title);
		font-size: 24px;
		font-weight: 800;
		color: var(--color--success);
	}

	.so-far {
		font-size: 14px;
		color: var(--color--text-shade);
	}

	.track {
		height: 4px;
		background: var(--color--muted);
		border-radius: var(--radius-pill);
		margin-top: 12px;
		position: relative;
		overflow: hidden;
	}

	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		width: 17%;
		background: var(--color--success);
		border-radius: var(--radius-pill);
		transform-origin: left;
		transform: scaleX(0);
		transition: transform 700ms var(--ease-out) 150ms;
	}

	:global(.is-in) .fill {
		transform: scaleX(1);
	}

	.sink {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 17px 0;
		border-bottom: 1px solid var(--color--border);
	}

	.sink-text {
		flex: 1;
	}

	.k {
		font-size: 16px;
		font-weight: 600;
	}

	.d {
		font-size: 13px;
		color: var(--color--text-shade);
		margin-top: 2px;
	}

	.price {
		font-family: var(--font--title);
		font-size: 16px;
		font-weight: 800;
	}

	.legal {
		font-size: 13px;
		line-height: 1.6;
		color: var(--color--text-tertiary);
		padding: 18px 0;
		margin: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.fill {
			transition: none;
			transform: none;
		}
	}
</style>
