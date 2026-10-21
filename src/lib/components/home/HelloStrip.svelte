<script lang="ts">
	// "Hello" in eleven of the languages, each on a partner colour. Hola, the
	// demo user's own language, is the blue one.
	const hellos: { t: string; hue: string; lang: string; dir?: 'rtl' }[] = [
		{ t: 'Привет', hue: 'lilac', lang: 'ru' },
		{ t: 'Hello', hue: 'lime', lang: 'en' },
		{ t: 'こんにちは', hue: 'aqua', lang: 'ja' },
		{ t: 'Merhaba', hue: 'tangerine', lang: 'tr' },
		{ t: 'Hola', hue: 'blue', lang: 'es' },
		{ t: 'مرحبا', hue: 'sky', lang: 'ar', dir: 'rtl' },
		{ t: 'Bonjour', hue: 'mint', lang: 'fr' },
		{ t: '안녕하세요', hue: '', lang: 'ko' },
		{ t: 'Olá', hue: 'lilac', lang: 'pt' },
		{ t: 'Cześć', hue: 'lime', lang: 'pl' },
		{ t: 'नमस्ते', hue: 'aqua', lang: 'hi' }
	];
</script>

<!--
	Drifts left, slowly; holds still for reduced motion. The second copy of the
	row is only there to make the loop seamless, so it is hidden from readers.
-->
<section class="hellos" aria-label="Some of the 183 languages on LangX">
	<div class="track">
		{#each [0, 1] as copy}
			<div class="row" aria-hidden={copy === 1 ? 'true' : undefined}>
				{#each hellos as h}
					<span
						class="pill"
						class:plain={!h.hue}
						data-hue={h.hue || undefined}
						lang={h.lang}
						dir={h.dir ?? 'ltr'}>{h.t}</span
					>
				{/each}
			</div>
		{/each}
	</div>
	<p class="count">Pick from 183 languages.</p>
</section>

<style lang="scss">
	.hellos {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 28px 0 32px;
		overflow: hidden;

		@media (min-width: 900px) {
			padding: 36px 0;
		}
	}

	.track {
		display: flex;
		width: max-content;
		animation: drift 60s linear infinite;

		@media (prefers-reduced-motion: reduce) {
			animation: none;
		}
	}

	.row {
		display: flex;
		gap: 12px;
		padding-right: 12px;
	}

	.pill {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		height: 48px;
		padding: 0 20px;
		border-radius: 24px 24px 24px 8px;
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.25rem;
		white-space: nowrap;

		@media (min-width: 900px) {
			height: 52px;
			font-size: 1.375rem;
		}
	}

	.plain {
		background: var(--color--muted);
		color: var(--color--text);
	}

	.count {
		margin: 0 auto;
		width: 100%;
		max-width: calc(var(--container-max) + 32px);
		padding: 0 16px;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.1875rem;
		color: var(--color--text-shade);

		@media (min-width: 768px) {
			max-width: calc(var(--container-max) + 64px);
			padding: 0 32px;
		}
	}

	@keyframes drift {
		to {
			transform: translateX(-50%);
		}
	}
</style>
