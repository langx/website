<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';

	interface Props {
		/** The HTTP status; anything but 404 is "something went wrong". */
		status?: number;
	}

	let { status = 404 }: Props = $props();

	let missing = $derived(status === 404);
</script>

<!-- One mint block, full width from inside the page's column. -->
<div class="missing" data-hue="mint">
	<div class="inner">
		<div class="copy">
			<Tag tone="ink">{status}</Tag>
			<h1 class="display-hero">{missing ? 'this page went quiet.' : 'something went wrong.'}</h1>
			<p class="lede">
				{missing
					? 'It moved, or it never existed. Everything that does is one click away.'
					: 'Reload the page, or start again from the homepage.'}
			</p>
			<div class="ask">
				<Button href="/" variant="ink" size="lg">Back to the start</Button>
				{#if missing}<Button href="/blog" variant="outline" size="lg">Read the blog</Button>{/if}
			</div>
		</div>
		{#if missing}
			<!-- The one chat that fits a missing page: a question, a slip, a correction. -->
			<div class="chat" aria-hidden="true">
				<span class="bubble theirs" lang="es">¿Dónde está la página?</span>
				<span class="bubble mine" lang="es">No sé, aquí no esta 🤷</span>
				<span class="fix" lang="es"><s>esta</s> <strong>está</strong></span>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.missing {
		width: 100vw;
		margin-left: calc(50% - 50vw);
	}

	.inner {
		display: grid;
		gap: 40px;
		align-items: center;
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding: 40px 16px 56px;

		@media (min-width: 900px) {
			grid-template-columns: 1fr 340px;
			gap: 64px;
			min-height: 60vh;
			max-width: calc(var(--container-max) + 64px);
			padding: 72px 32px 104px;
		}
	}

	.copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
	}

	.lede {
		margin: 0;
		max-width: 460px;
		color: inherit;
		font-size: 1.1875rem;
		line-height: 1.47;
		font-weight: 500;
	}

	.ask {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.chat {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.bubble {
		max-width: 85%;
		padding: 10px 16px;
		font-size: 1.0625rem;
		line-height: 1.35;
	}

	.theirs {
		align-self: flex-start;
		border-radius: 22px 22px 22px 8px;
		background: #ffffff;
		color: var(--color--ink);
	}

	.mine {
		align-self: flex-end;
		border-radius: 22px 22px 8px 22px;
		background: var(--color--ink);
		color: var(--color--on-ink);
	}

	.fix {
		align-self: flex-end;
		padding: 6px 14px;
		border-radius: 999px;
		box-shadow: inset 0 0 0 2px currentColor;
		font-weight: 700;
	}
</style>
