<script lang="ts">
	import { reveal } from '$lib/utils/reveal';
</script>

<!--
	The whole product in one card: who you are matched with, two messages, a
	correction, and translation one tap away. Sized by whoever places it.
-->
<div
	class="card"
	role="img"
	aria-label="A LangX chat: two messages, then a correction"
	data-reveal
	use:reveal={{ y: 40 }}
>
	<div class="who">
		<span class="avatar" aria-hidden="true">M</span>
		<span class="meta">
			<span class="name">María</span>
			<span class="langs">speaks Spanish · learning English</span>
		</span>
	</div>
	<p class="bubble theirs">¡Hola! Yo aprendo inglés hace dos años 😄</p>
	<p class="bubble mine">Estudio español hace dos mes</p>
	<div class="correction">
		<span class="label">Correction</span>
		<span class="text">hace dos <s>mes</s> <strong>meses</strong> ✓</span>
	</div>
	<span class="translate">
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path
				d="m22 22-5-10-5 10"
			/><path d="M14 18h6" /></svg
		>
		Translate
	</span>
</div>

<style lang="scss">
	.card {
		background: var(--color--surface);
		border: 2px solid var(--color--border);
		border-radius: var(--radius-xl);
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		text-align: left;
	}

	.who {
		display: flex;
		align-items: center;
		gap: 10px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--color--border);
	}

	.avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--color--accent-tint);
		display: grid;
		place-items: center;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.875rem;
		color: var(--color--accent-shade);
	}

	.meta {
		display: flex;
		flex-direction: column;
	}

	.name {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
	}

	.langs {
		font-size: 0.75rem;
		color: var(--color--text-shade);
	}

	.bubble {
		margin: 0;
		max-width: 85%;
		padding: 10px 14px;
		border-radius: var(--radius-lg);
		font-size: 0.9375rem;
		line-height: 1.45;
	}

	.theirs {
		align-self: flex-start;
		background: var(--color--muted);
		border-bottom-left-radius: 4px;
	}

	.mine {
		align-self: flex-end;
		background: var(--color--accent);
		color: var(--color--accent-contrast);
		border-bottom-right-radius: 4px;
	}

	.correction {
		align-self: flex-end;
		max-width: 85%;
		border: 2px solid var(--color--success);
		background: var(--color--success-tint);
		border-radius: var(--radius-lg);
		padding: 8px 14px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.label {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color--success);
	}

	.text {
		font-size: 0.875rem;

		s {
			color: var(--color--text-tertiary);
		}

		strong {
			color: var(--color--success);
		}
	}

	.translate {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 2px;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color--accent);
	}
</style>
