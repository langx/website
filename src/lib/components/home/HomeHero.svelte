<script lang="ts">
	import Block from '$lib/components/atoms/Block.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import Phone from '$lib/components/phone/Phone.svelte';
	import Face from '$lib/components/phone/Face.svelte';
	import ThreadScreen from '$lib/components/phone/ThreadScreen.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
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
{#snippet globe()}
	<svg
		aria-hidden="true"
		width="22"
		height="22"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path
			d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"
		/></svg
	>
{/snippet}

<!--
	The hero: who is talking, the promise, the ask, and the thread that proves
	it. George is a native English speaker; the correction comes from him.
-->
<Block hue="lilac" pad="hero" labelledby="hero-title" id="hero">
	<div class="grid">
		<div class="copy">
			<span class="pair">
				<Face who="george" size={26} eager />
				George speaks English. Sofia speaks Spanish.
			</span>
			<h1 id="hero-title" class="display-hero">talk to people who speak it.</h1>
			<p class="lede">
				Chat with native speakers who want to learn your language. You help them, they help you.
			</p>
			<div class="ask" use:ownsPrimary>
				<Button href="https://get.langx.io" size="lg" block icon={download}>Get the app</Button>
				<Button href="https://app.langx.io" variant="ink" size="lg" block icon={globe}
					>Use it in your browser</Button
				>
			</div>
			<span class="where">Free on iPhone, Android and the web.</span>
		</div>

		<div class="device">
			<Phone
				label="LangX app: a chat between Sofia and George. George corrects Sofia’s English: I went to the beach, not at the beach."
				height={560}
				cut="phone"
				cutHeight={430}
			>
				<ThreadScreen
					partner="george"
					hue="lilac"
					build="loop"
					eager
					items={[
						{ t: 'day', text: 'Today' },
						{ t: 'them', text: 'Hey Sofia! What did you do on Saturday?', lang: 'en' },
						{ t: 'me', text: 'On Saturday I went at the beach with my cousins.', lang: 'en' },
						{
							t: 'fix',
							by: 'George',
							parts: ['I went ', { del: 'at' }, ' ', { ins: 'to' }, ' the beach.'],
							lang: 'en'
						},
						{ t: 'them', text: 'Nice! I went to the market.', lang: 'en' }
					]}
				/>
			</Phone>
		</div>
	</div>
</Block>

<style lang="scss">
	.grid {
		display: grid;
		gap: 32px;

		@media (min-width: 900px) {
			grid-template-columns: 1fr 320px;
			gap: 96px;
			align-items: center;
		}
	}

	.copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;

		@media (min-width: 900px) {
			gap: 28px;
		}
	}

	.pair {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 34px;
		padding: 4px 14px 4px 4px;
		border-radius: 20px;
		background: var(--color--ink);
		color: var(--block);
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 0.9375rem;
	}

	h1 {
		max-width: 640px;
	}

	.lede {
		margin: 0;
		max-width: 500px;
		font-size: 1.0625rem;
		line-height: 1.5;
		font-weight: 500;
		color: inherit;

		@media (min-width: 900px) {
			font-size: 1.1875rem;
			line-height: 1.47;
		}
	}

	.ask {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		max-width: 340px;

		@media (max-width: 899px) {
			max-width: none;
		}
	}

	.where {
		font-weight: 600;
	}

	.device {
		display: flex;
		justify-content: center;

		@media (max-width: 899px) {
			margin-bottom: -40px;
		}
	}
</style>
