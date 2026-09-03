<script lang="ts">
	import { legacyTokenDivisor, welcomeBackBonus } from '$lib/data/token';

	/** Screen 16 — what a returning v1 user sees. The 20 carried-over tokens are a demo balance. */
	const carried = 20;
</script>

<div class="screen">
	<div class="body">
		<div class="hello">
			<span class="wave" aria-hidden="true">👋</span>
			<div class="title">Welcome back</div>
			<p class="sub">Your v1 account moved with you. Here's what returned.</p>
		</div>

		<div class="item">
			<span class="glyph at">@</span>
			<div class="text">
				<div class="k">@sofia is still yours</div>
				<div class="d">Handles carried over. Nobody took it.</div>
			</div>
		</div>
		<div class="item">
			<span class="glyph">💬</span>
			<div class="text">
				<div class="k">12 conversations imported</div>
				<div class="d">Full history, both sides.</div>
			</div>
		</div>
		<div class="item">
			<span class="glyph">🪙</span>
			<div class="text">
				<div class="k">{carried + welcomeBackBonus} tokens</div>
				<div class="d">
					{carried} carried over at the new rate (÷{legacyTokenDivisor}), plus a {welcomeBackBonus}-token
					welcome bonus.
				</div>
			</div>
		</div>
		<div class="item last">
			<span class="glyph">🔥</span>
			<div class="text">
				<div class="k">34-day streak, frozen</div>
				<div class="d">Restore it with tokens whenever you like.</div>
			</div>
		</div>

		<div class="notify">
			<div class="text">
				<div class="k">Turn on notifications</div>
				<div class="d">One streak reminder a day. Nothing else.</div>
			</div>
			<span class="enable">Enable</span>
		</div>

		<div class="cta-wrap">
			<span class="cta">Start exploring</span>
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

	.body {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		padding: 0 24px;
	}

	.hello {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 34px 0 10px;
	}

	.wave {
		font-size: 48px;
		line-height: 1;
	}

	.title {
		font-family: var(--font--title);
		font-size: 28px;
		font-weight: 800;
		margin-top: 14px;
	}

	.sub {
		font-size: 15px;
		line-height: 1.55;
		color: var(--color--text-shade);
		margin: 6px 0 0;
		max-width: 30ch;
	}

	.item {
		display: flex;
		gap: 14px;
		padding: 18px 0;
		border-bottom: 1px solid var(--color--border);

		&.last {
			border-bottom: 0;
		}
	}

	.glyph {
		width: 28px;
		font-size: 18px;
		flex: 0 0 auto;

		&.at {
			font-weight: 800;
			color: var(--color--accent);
		}
	}

	.text {
		flex: 1;
	}

	.k {
		font-size: 16px;
		font-weight: 600;
	}

	.d {
		font-size: 13px;
		line-height: 1.5;
		color: var(--color--text-shade);
		margin-top: 2px;
	}

	.notify {
		display: flex;
		align-items: center;
		gap: 14px;
		background: var(--color--accent-tint);
		border-radius: var(--radius-lg);
		padding: 15px 18px;
		margin-top: 6px;
		flex-shrink: 0;

		.k {
			font-size: 15px;
			font-weight: 700;
			color: var(--color--accent);
		}
	}

	.enable {
		font-size: 14px;
		font-weight: 700;
		color: var(--color--accent);
		flex: 0 0 auto;
	}

	.cta-wrap {
		margin-top: auto;
		padding: 16px 0 20px;
	}

	.cta {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 54px;
		background: var(--color--primary);
		color: var(--color--on-primary);
		border-radius: var(--radius-pill);
		font-family: var(--font--title);
		font-size: 16px;
		font-weight: 800;
	}
</style>
