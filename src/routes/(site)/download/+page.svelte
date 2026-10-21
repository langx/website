<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Block from '$lib/components/atoms/Block.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import Phone from '$lib/components/phone/Phone.svelte';
	import TodayScreen from '$lib/components/phone/TodayScreen.svelte';
	import { appStoreUrl, playStoreUrl } from '$lib/data/meta';

	const steps = [
		{
			hue: 'tangerine',
			title: 'Get the app',
			body: 'On your phone from the App Store or Google Play, or straight away in your browser. It is free.'
		},
		{
			hue: 'aqua',
			title: 'Say what you speak',
			body: 'Pick the language you speak and the one you are learning. LangX shows you people who fit both ways.'
		},
		{
			hue: 'sky',
			title: 'Say hello',
			body: 'Write to someone, help with their sentence, and get the same help back.'
		}
	];
</script>

<Seo
	title="Download LangX: iPhone, Android and the web"
	path="/download"
	description="Get LangX free on iPhone and Android, or use it in your browser. One account, the same chats everywhere."
/>

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
	The yellow follows the device: on a phone it is the store, on a computer
	the browser. Both pairs are in the HTML and a media query picks one, so the
	page needs no script to choose.
-->
<Block hue="lilac" pad="hero" labelledby="download-title">
	<div class="grid">
		<div class="copy">
			<Tag tone="ink">Get the app</Tag>
			<h1 id="download-title" class="display-hero">free to start.</h1>
			<p>On iPhone, Android and the web. One account, the same chats everywhere.</p>

			<div class="ask phone-only">
				<Button href="https://get.langx.io" size="lg" block icon={download}>Get the app</Button>
				<Button href="https://app.langx.io" variant="ink" size="lg" block
					>Use it in your browser</Button
				>
			</div>
			<div class="ask wide-only">
				<Button href="https://app.langx.io" size="lg" block>Use it in your browser</Button>
				<span class="stores">
					<Button href={appStoreUrl} variant="ink" size="md">App Store</Button>
					<Button href={playStoreUrl} variant="ink" size="md">Google Play</Button>
				</span>
			</div>
			<p class="links phone-only">
				<a href={appStoreUrl}>App Store</a> · <a href={playStoreUrl}>Google Play</a>
			</p>
		</div>
		<div class="device">
			<Phone
				label="LangX app: a twelve-day streak and chats with George, Marina and Yuki"
				height={560}
				cut="phone"
				cutHeight={420}
			>
				<TodayScreen />
			</Phone>
		</div>
	</div>
</Block>

<div class="column">
	<h2 class="display-section">three steps.</h2>
	<ol class="steps" role="list">
		{#each steps as s, i}
			<li>
				<span class="n" data-hue={s.hue}>{i + 1}</span>
				<h3>{s.title}</h3>
				<p>{s.body}</p>
			</li>
		{/each}
	</ol>
</div>

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

		> p {
			margin: 0;
			max-width: 480px;
			font-size: 1.1875rem;
			line-height: 1.47;
			font-weight: 500;
		}
	}

	.ask {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		max-width: 340px;
	}

	.stores {
		display: flex;
		gap: 8px;
	}

	.phone-only {
		@media (min-width: 900px) {
			display: none;
		}
	}

	.wide-only {
		@media (max-width: 899px) {
			display: none;
		}
	}

	.links {
		margin: 0;
		font-weight: 700;

		a {
			color: inherit;
			text-decoration: underline;
		}
	}

	.device {
		display: flex;
		justify-content: center;

		@media (max-width: 899px) {
			margin-bottom: -40px;
		}
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding: 48px 16px 72px;

		@media (min-width: 768px) {
			max-width: calc(var(--container-max) + 64px);
			padding: 88px 32px 104px;
		}
	}

	.steps {
		display: grid;
		gap: 12px;
		margin: 0;

		@media (min-width: 900px) {
			grid-template-columns: repeat(3, 1fr);
		}

		li {
			display: flex;
			flex-direction: column;
			gap: 10px;
			padding: 22px;
			border-radius: 24px;
			background: var(--color--muted);
		}

		h3 {
			margin: 0;
			font-weight: 900;
			font-size: 1.25rem;
		}

		p {
			margin: 0;
			color: var(--color--text-shade);
		}
	}

	.n {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font--title);
		font-weight: 900;
	}
</style>
