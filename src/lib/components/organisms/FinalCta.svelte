<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { rise } from '$lib/utils/rise';

	interface Props {
		/** The one line above the buttons; a page with its own last word passes it. */
		title?: string;
		/** Full width, as the homepage's last block; otherwise a rounded panel inside the page. */
		bleed?: boolean;
	}

	let { title = 'say hola to someone today.', bleed = false }: Props = $props();
</script>

{#snippet download()}
	<svg
		aria-hidden="true"
		width="22"
		height="22"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.25"
		stroke-linecap="round"
		stroke-linejoin="round"
		><path d="M12 4v11" /><path d="M7 10l5 5 5-5" /><path d="M5 20h14" /></svg
	>
{/snippet}

<!--
	The closing call, on the blue block: the line, the same two buttons as the
	top of the page, and a hello and its answer. The yellow here is the page's
	second, so the header steps back to ink while it is in view.
-->
<section class="final" class:bleed data-hue="blue" aria-labelledby="final-title">
	<div class="inner" use:rise>
		<div class="copy">
			<h2 id="final-title" class="display-hero" data-rise>{title}</h2>
			<div class="ask" use:ownsPrimary data-rise>
				<Button href="https://get.langx.io" size="lg" block icon={download}>Get the app</Button>
				<Button href="https://app.langx.io" variant="ink" size="lg" block
					>Use it in your browser</Button
				>
			</div>
		</div>
		<div class="talk" aria-hidden="true">
			<span class="b them" lang="es">¡Hola! ¿Hablamos?</span>
			<span class="b me">Hi! Sure, let’s talk.</span>
			<span class="where">Free on iPhone, Android and the web.</span>
		</div>
	</div>
</section>

<style lang="scss">
	.final {
		margin-top: 72px;
		border-radius: 40px;

		&.bleed {
			margin-top: 0;
			border-radius: 0;
		}
	}

	.inner {
		display: grid;
		gap: 28px;
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding: 48px 16px;

		@media (min-width: 900px) {
			grid-template-columns: 1fr 360px;
			gap: 64px;
			align-items: center;
			max-width: calc(var(--container-max) + 64px);
			padding: 104px 32px;
		}
	}

	.final:not(.bleed) .inner {
		@media (min-width: 900px) {
			padding: 72px 56px;
		}
	}

	.copy {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.ask {
		display: flex;
		flex-direction: column;
		gap: 12px;
		max-width: 340px;
	}

	.talk {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.b {
		max-width: 80%;
		padding: 10px 16px;
		font-size: 1.0625rem;
		line-height: 1.35;
	}

	.them {
		align-self: flex-start;
		border-radius: 22px 22px 22px 8px;
		background: #ffffff;
		color: var(--color--ink);
	}

	.me {
		align-self: flex-end;
		border-radius: 22px 22px 8px 22px;
		background: var(--color--ink);
		color: var(--color--on-ink);
	}

	.where {
		font-weight: 700;
		font-size: 0.9375rem;
	}
</style>
