<script lang="ts">
	import { legacyTokenDivisor, welcomeBackBonus } from '$lib/data/token';
	import { reveal } from '$lib/utils/reveal';

	/** What a returning v1 user sees. The 20 carried-over tokens are a demo balance. */
	const carried = 20;
</script>

<div
	class="card"
	role="img"
	aria-label="The welcome-back screen: your handle, imported conversations, converted tokens and a frozen streak"
	data-reveal
	use:reveal={{ y: 40 }}
>
	<div class="hello">
		<span class="wave" aria-hidden="true">👋</span>
		<span class="title">Welcome back</span>
		<span class="sub">Your v1 account moved with you. Here's what returned.</span>
	</div>
	<ul class="rows" role="list">
		<li>
			<span class="glyph" aria-hidden="true">@</span>
			<span class="text">
				<span class="k">@sofia is still yours</span>
				<span class="d">Handles carried over. Nobody took it.</span>
			</span>
		</li>
		<li>
			<span class="glyph" aria-hidden="true">💬</span>
			<span class="text">
				<span class="k">12 conversations imported</span>
				<span class="d">Full history, both sides.</span>
			</span>
		</li>
		<li>
			<span class="glyph" aria-hidden="true">🪙</span>
			<span class="text">
				<span class="k">{carried + welcomeBackBonus} tokens</span>
				<span class="d">
					{carried} carried over at the new rate (÷{legacyTokenDivisor}), plus a {welcomeBackBonus}-token
					welcome bonus.
				</span>
			</span>
		</li>
		<li>
			<span class="glyph" aria-hidden="true">🔥</span>
			<span class="text">
				<span class="k">34-day streak, frozen</span>
				<span class="d">Restore it with tokens whenever you like.</span>
			</span>
		</li>
	</ul>
	<span class="go" aria-hidden="true">Start exploring</span>
</div>

<style lang="scss">
	.card {
		background: var(--color--surface);
		border: 2px solid var(--color--border);
		border-radius: var(--radius-xl);
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.hello {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 6px;
		padding-bottom: 12px;
	}

	.wave {
		font-size: 2.5rem;
		line-height: 1;
	}

	.title {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.375rem;
		margin-top: 6px;
	}

	.sub {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color--text-shade);
		max-width: 30ch;
	}

	li {
		display: flex;
		gap: 12px;
		padding: 12px 0;
		border-top: 1px solid var(--color--border);
	}

	.glyph {
		flex: 0 0 24px;
		font-size: 1rem;
		font-family: var(--font--title);
		font-weight: 800;
		color: var(--color--accent);
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.k {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
	}

	.d {
		font-size: 0.8125rem;
		line-height: 1.45;
		color: var(--color--text-shade);
	}

	// Looks like the app's yellow button; it is a picture of one.
	.go {
		margin-top: 8px;
		text-align: center;
		padding: 14px;
		border-radius: var(--radius-lg);
		background: var(--color--primary);
		color: var(--color--on-primary);
		box-shadow: 0 4px 0 var(--color--primary-shade);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.875rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}
</style>
