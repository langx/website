<script lang="ts">
	import Segmented from '$lib/components/atoms/Segmented.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';

	/**
	 * `app/(app)/paywall` from the design handoff, on the Fluent tab. The
	 * benefits are the real ones from `$lib/data/plans.ts`; the prices are the
	 * prototype's example figures, and the screen says so — the app sets them
	 * per region.
	 */
	const features = [
		{ text: 'Unlimited new conversations', soon: false },
		{ text: '300 translations a day', soon: false },
		{ text: 'Gender and city filters', soon: false },
		{ text: '2 languages you are learning, 2 you speak natively', soon: false },
		{ text: 'Everything in Free', soon: false },
		{ text: 'LangX Copilot in the correction sheet', soon: true }
	];
</script>

<div class="screen">
	<div class="head">
		<span class="close"><UiIcon name="close" size={22} /></span>
		<span class="spacer" />
		<span class="restore">Restore purchases</span>
	</div>

	<div class="body">
		<h2 class="title">Go further</h2>
		<p class="lede">
			Corrections and replies stay unlimited on every plan. Paying removes the other limits.
		</p>

		<Segmented options={['Fluent', 'Polyglot']} active={0} />
		<Segmented options={['Yearly · save 35%', 'Monthly']} active={0} />

		<div class="price">
			<span class="amount">€4.99</span>
			<span class="per">/ month · billed yearly</span>
		</div>

		<ul class="features" role="list">
			{#each features as f}
				<li>
					<span class="tick"><UiIcon name="check" size={18} strokeWidth={3} /></span>
					<span class="text">{f.text}</span>
					{#if f.soon}<span class="soon">SOON</span>{/if}
				</li>
			{/each}
		</ul>

		<p class="fine">
			Prices shown are examples for this screen; the app sets them per region. Cancel any time in
			your store account. Tokens never unlock a plan.
		</p>
	</div>

	<div class="foot">
		<span class="cta">Start Fluent</span>
	</div>
</div>

<style lang="scss">
	@import '$lib/scss/_mixins.scss';

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
		padding: 6px 20px 8px;
		flex: 0 0 auto;
	}

	.close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
	}

	.spacer {
		flex: 1;
	}

	.restore {
		display: flex;
		align-items: center;
		height: 40px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color--accent);
	}

	.body {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 0 20px;
	}

	.title {
		margin: 0;
		font-size: 30px;
		font-weight: 800;
		line-height: 1.2;
		letter-spacing: 0;
	}

	.lede {
		margin: 0;
		font-size: 16px;
		line-height: 1.5;
		color: var(--color--text-shade);
	}

	.price {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding-top: 6px;
	}

	.amount {
		font-family: var(--font--title);
		font-size: 44px;
		font-weight: 800;
	}

	.per {
		font-size: 15px;
		color: var(--color--text-shade);
	}

	.features {
		border-top: 1px solid var(--color--border);

		li {
			display: flex;
			align-items: center;
			gap: 14px;
			padding: 13px 0;
			border-bottom: 1px solid var(--color--border);
		}
	}

	// Blue for Fluent; Polyglot tints its ticks violet in the app.
	.tick {
		color: var(--color--accent);
		display: flex;
	}

	.text {
		flex: 1;
		font-size: 16px;
	}

	.soon {
		flex: 0 0 auto;
		padding: 3px 8px;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-pill);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--color--text-shade);
	}

	.fine {
		margin: 0;
		font-size: 13px;
		line-height: 1.5;
		color: var(--color--text-tertiary);
		padding-bottom: 12px;
	}

	.foot {
		flex: 0 0 auto;
		margin-top: auto;
		padding: 12px 20px 28px;
		border-top: 1px solid var(--color--border);
	}

	.cta {
		@include app-button;
		background: var(--color--primary);
		color: var(--color--on-primary);
	}
</style>
