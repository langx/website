<script lang="ts">
	/**
	 * A LangX screen inside a blog post: the same replica the homepage plays,
	 * scaled down beside a short explanation. These are the v2 designs, not
	 * screenshots — the v1 screenshots in static/images/features must never
	 * stand in for the current app.
	 */
	import PhoneFrame from '$lib/components/phone/PhoneFrame.svelte';
	import ChatScreen from '$lib/components/phone/ChatScreen.svelte';
	import DiscoverScreen from '$lib/components/phone/DiscoverScreen.svelte';
	import FeedScreen from '$lib/components/phone/FeedScreen.svelte';
	import MeScreen from '$lib/components/phone/MeScreen.svelte';

	export let screen: 'chat' | 'discover' | 'feed' | 'me' = 'chat';
	/** One or two sentences beside the phone saying what it shows. */
	export let text = '';
	export let title = '';

	const LABELS = {
		chat: 'A LangX chat: messages arrive, then a correction',
		discover: 'Discover: people who speak the language you learn and learn yours',
		feed: 'Feed: sentences waiting for a correction',
		me: 'Profile: streak, corrections and this week’s activity'
	};
</script>

<figure class="demo">
	<div class="device">
		<PhoneFrame label={LABELS[screen]} caption="">
			{#if screen === 'chat'}
				<ChatScreen loop />
			{:else if screen === 'discover'}
				<DiscoverScreen />
			{:else if screen === 'feed'}
				<FeedScreen />
			{:else}
				<MeScreen />
			{/if}
		</PhoneFrame>
	</div>
	<figcaption>
		{#if title}<span class="t">{title}</span>{/if}
		{#if text}<span class="x">{text}</span>{/if}
		<span class="fine"
			>Example screen from the LangX app. Names and numbers are demonstration data.</span
		>
	</figcaption>
</figure>

<style lang="scss">
	.demo {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-lg);
		align-items: center;
		margin: var(--space-lg) 0;
		padding: 22px;
		border-radius: var(--radius-xl, 24px);
		background: var(--color--muted);

		@media (max-width: 620px) {
			grid-template-columns: 1fr;
			justify-items: center;
			text-align: center;
		}
	}

	.device {
		--phone-zoom: 0.6;
		width: 234px;

		@media (max-width: 620px) {
			--phone-zoom: 0.66;
			width: 258px;
		}
	}

	figcaption {
		display: flex;
		flex-direction: column;
		gap: 8px;
		text-align: left;

		@media (max-width: 620px) {
			text-align: center;
		}
	}

	.t {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.25rem;
		line-height: 1.25;
		color: var(--color--text);
	}

	.x {
		color: var(--color--text-shade);
		line-height: 1.55;
	}

	.fine {
		font-size: 0.75rem;
		color: var(--color--text-tertiary);
	}
</style>
