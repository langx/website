<script lang="ts">
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';

	/**
	 * `app/(app)/wallet` from the design handoff. The app calls this screen
	 * Wallet, not Tokens — tokens are what it counts. The balance and the
	 * counters are demonstration data; the rules under them are the real ones
	 * from `$lib/data/token.ts`.
	 */
	const rows = [
		{ name: 'History', note: 'What you earned and spent, day by day' },
		{ name: 'Leaderboard', note: 'Who earned the most this week, month and year' },
		{ name: 'Daily pool', note: 'How the nightly share is worked out' },
		{ name: 'Store', note: 'Streak freezes, missed days and cosmetics' }
	];
</script>

<div class="screen">
	<div class="head">
		<span class="back"><UiIcon name="back" size={22} /></span>
		<span class="title">Wallet</span>
	</div>

	<div class="balance">
		<span class="label">Balance</span>
		<span class="amount">862</span>
		<span class="split">
			<span>2,410 earned · 1,548 spent</span>
			<span class="chev"><UiIcon name="chevron-right" size={18} /></span>
		</span>
	</div>

	<div class="gift">
		<UiIcon name="gift" size={28} />
		<div class="gift-text">
			<span class="gift-title">Hourly gift</span>
			<span class="gift-sub">Ready to open</span>
		</div>
		<UiIcon name="chevron-right" size={18} />
	</div>

	<div class="stats">
		<div class="stat">
			<span class="n">1</span>
			<span class="l">Streak freezes</span>
		</div>
		<div class="stat">
			<span class="n">3</span>
			<span class="l">Items owned</span>
		</div>
	</div>

	{#each rows as row, i}
		<div class="row" class:last={i === rows.length - 1}>
			<div class="row-text">
				<span class="k">{row.name}</span>
				<span class="d">{row.note}</span>
			</div>
			<span class="chev"><UiIcon name="chevron-right" size={18} /></span>
		</div>
	{/each}

	<p class="legal">
		Tokens are in-app points. They cannot be bought, traded, withdrawn or used to unlock a paid plan
		— only streak freezes, missed days and cosmetics. There is no chain, no contract and no market.
	</p>
</div>

<style lang="scss">
	.screen {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		padding: 6px 20px 28px;
	}

	.head {
		display: flex;
		align-items: center;
		gap: 14px;
		padding-bottom: 6px;
	}

	.back {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		flex: 0 0 auto;
	}

	.title {
		flex: 1;
		font-family: var(--font--title);
		font-size: 24px;
		font-weight: 800;
	}

	.balance {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 22px 0 26px;
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
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.split {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 15px;
		color: var(--color--text-shade);
	}

	// The gift is yellow only while there is one to open — the screen's single
	// committing action.
	.gift {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 22px;
		padding: 18px 20px;
		border-radius: 20px;
		background: var(--color--primary);
		color: var(--color--on-primary);
	}

	.gift-text {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.gift-title {
		font-family: var(--font--title);
		font-size: 17px;
		font-weight: 800;
	}

	.gift-sub {
		font-size: 14px;
		opacity: 0.75;
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
			font-family: var(--font--title);
			font-size: 26px;
			font-weight: 800;
			font-variant-numeric: tabular-nums;
		}

		.l {
			font-size: 12px;
			font-weight: 600;
			color: var(--color--text-shade);
		}
	}

	.row {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 17px 0;
		border-bottom: 1px solid var(--color--border);

		&.last {
			border-bottom: 0;
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

	.legal {
		font-size: 13px;
		line-height: 1.6;
		color: var(--color--text-tertiary);
		padding-top: 24px;
		margin: 0;
	}
</style>
