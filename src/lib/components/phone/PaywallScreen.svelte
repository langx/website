<script lang="ts">
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';

	/**
	 * Screen 14. Benefits are the real ones from `PLAN_LIMITS`; prices are set
	 * per region and shown only in the app, so the buttons do not print one.
	 */
	const fluent = [
		['Unlimited new chats', 'Free stops at 5 a day'],
		['Filters by gender and city', 'country, age and level stay free'],
		['300 translations a day', 'Free: 20'],
		['2 languages each way', 'learning and native']
	];

	const polyglot = [
		['See who viewed your profile', ''],
		['Incognito browsing', ''],
		['Nearby', 'match inside a radius you set. Uses rough location.'],
		['1,000 translations a day', ''],
		['5 languages each way', '']
	];
</script>

<div class="screen">
	<div class="head">
		<UiIcon name="back" size={22} />
		<span class="title">LangX plans</span>
	</div>

	<div class="body">
		<p class="context">
			<strong>Nearby</strong> is part of Polyglot — the filter you tapped in Discover.
		</p>

		<section class="plan">
			<h3 class="plan-name">Fluent</h3>
			<ul class="benefits" role="list">
				{#each fluent as [label, note]}
					<li>
						<UiIcon name="check" size={15} strokeWidth={3} />
						<span
							><strong>{label}</strong>{#if note}<span class="note"> — {note}</span>{/if}</span
						>
					</li>
				{/each}
			</ul>
			<span class="cta yellow">Continue with yearly</span>
			<span class="cta outline">Monthly</span>
		</section>

		<section class="plan last">
			<div class="plan-head">
				<h3 class="plan-name">Polyglot</h3>
				<span class="plan-sub">Everything in Fluent</span>
			</div>
			<ul class="benefits" role="list">
				{#each polyglot as [label, note]}
					<li>
						<UiIcon name="check" size={15} strokeWidth={3} />
						<span
							><strong>{label}</strong>{#if note}<span class="note"> — {note}</span>{/if}</span
						>
					</li>
				{/each}
				<li class="pending">
					<UiIcon name="check" size={15} strokeWidth={3} />
					<span
						><strong>Copilot</strong> — suggestions in the correction sheet ·
						<span class="soon">COMING SOON</span></span
					>
				</li>
			</ul>
			<span class="cta ink">Polyglot monthly</span>
		</section>
	</div>

	<div class="foot">
		<div class="restore">Restore purchases</div>
		<div class="fine">
			Prices set per region · Renews until cancelled · <span>Terms</span> · <span>Privacy</span>
		</div>
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

	.context {
		font-size: 14px;
		line-height: 1.55;
		color: var(--color--text-shade);
		padding: 8px 0 16px;
		margin: 0;
		border-bottom: 1px solid var(--color--border);

		strong {
			color: var(--color--accent);
		}
	}

	.plan {
		padding: 18px 0 20px;
		border-bottom: 1px solid var(--color--border);

		&.last {
			border-bottom: 0;
		}
	}

	.plan-head {
		display: flex;
		align-items: baseline;
		gap: 10px;
	}

	.plan-name {
		margin: 0;
		font-size: 22px;
		font-weight: 800;
		letter-spacing: 0;
	}

	.plan-sub {
		font-size: 13px;
		font-weight: 600;
		color: var(--color--text-shade);
	}

	.benefits {
		display: flex;
		flex-direction: column;
		gap: 9px;
		margin-top: 12px;

		li {
			display: flex;
			gap: 10px;
			font-size: 15px;
			line-height: 1.45;
			color: var(--color--accent);

			> span {
				color: var(--color--text);
			}

			:global(svg) {
				margin-top: 3px;
			}
		}

		.note {
			color: var(--color--text-shade);
		}

		.pending {
			color: var(--color--text-tertiary);

			> span {
				color: var(--color--text-shade);
			}

			strong {
				color: var(--color--text);
			}
		}

		.soon {
			font-size: 11px;
			font-weight: 700;
			letter-spacing: 0.4px;
		}
	}

	.cta {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 50px;
		border-radius: var(--radius-pill);
		font-family: var(--font--title);
		font-size: 15px;
		font-weight: 800;
		margin-top: 16px;

		&.yellow {
			background: var(--color--primary);
			color: var(--color--on-primary);
		}

		&.outline {
			min-height: 46px;
			margin-top: 8px;
			border: 1px solid var(--color--border);
			color: var(--color--text);
		}

		&.ink {
			min-height: 46px;
			border: 1px solid var(--color--text);
			color: var(--color--text);
		}
	}

	.foot {
		padding: 10px 24px 20px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		text-align: center;
		margin-top: auto;
	}

	.restore {
		font-size: 14px;
		font-weight: 700;
		color: var(--color--accent);
	}

	.fine {
		font-size: 12px;
		color: var(--color--text-tertiary);

		span {
			color: var(--color--accent);
		}
	}
</style>
