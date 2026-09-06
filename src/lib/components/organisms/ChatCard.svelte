<script lang="ts">
	import { reveal } from '$lib/utils/reveal';
</script>

<!-- Two messages and a correction: the whole product in one card. -->
<section class="wrap" aria-label="A LangX chat: two messages, then a correction">
	<div class="card" data-reveal use:reveal={{ y: 40 }}>
		<p class="bubble theirs">Hola! I am learn English since two months 🇪🇸</p>
		<p class="bubble mine">¡Genial! Yo estudio español 🙌</p>
		<div class="correction">
			<span class="label">
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg
				>
				Correction
			</span>
			<span class="was">I am learn English since two months</span>
			<span class="now">I've been learning English for two months</span>
		</div>
	</div>
</section>

<style lang="scss">
	.wrap {
		max-width: 440px;
		margin: 0 auto;
		padding: 0 0 90px;
	}

	.card {
		background: var(--color--surface);
		border: 2px solid var(--color--border);
		border-radius: 28px;
		padding: 26px 22px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.bubble {
		margin: 0;
		max-width: 82%;
		padding: 13px 16px;
		border-radius: 20px;
		font-size: 1rem;
		line-height: 1.45;
	}

	.theirs {
		background: var(--color--muted);
		border-bottom-left-radius: 6px;
	}

	.mine {
		align-self: flex-end;
		background: var(--color--accent-tint);
		border-bottom-right-radius: 6px;
	}

	.correction {
		background: var(--color--success-tint);
		border-radius: 16px;
		padding: 14px 16px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.label {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.8125rem;
		color: var(--color--success);
	}

	.was {
		font-size: 0.9375rem;
		color: var(--color--text-shade);
		text-decoration: line-through;
	}

	.now {
		font-size: 0.9375rem;
		font-weight: 600;
	}
</style>
