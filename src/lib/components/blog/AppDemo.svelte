<script lang="ts">
	/**
	 * A LangX screen inside a blog post: a live v3 phone on a colour block
	 * beside a short explanation. The phone is HTML at real size, cut off by
	 * the bottom of the block. These are drawings of the app, not screenshots;
	 * the v1 screenshots in static/images/features must never stand in for it.
	 *
	 * No screen is named after a tab: 3.0 renames them, and the site must stay
	 * true for the app people have today.
	 *
	 * The `screen` names are the ones the posts already pass (about a hundred
	 * of them), so the posts change without being edited.
	 */
	import Phone from '$lib/components/phone/Phone.svelte';
	import ThreadScreen from '$lib/components/phone/ThreadScreen.svelte';
	import PeopleScreen from '$lib/components/phone/PeopleScreen.svelte';
	import TodayScreen from '$lib/components/phone/TodayScreen.svelte';
	import type { Hue } from '$lib/components/phone/people';

	interface Props {
		screen?: 'chat' | 'discover' | 'feed' | 'me';
		/** One or two sentences beside the phone saying what it shows. */
		text?: string;
		title?: string;
	}

	let { screen = 'chat', text = '', title = '' }: Props = $props();

	const HUE: Record<string, Hue> = {
		chat: 'mint',
		discover: 'tangerine',
		feed: 'tangerine',
		me: 'lime'
	};

	const LABELS = {
		chat: 'LangX app: Sofia fixes George’s Spanish sentence',
		discover: 'LangX app: English speakers who are learning Spanish',
		feed: 'LangX app: English speakers who are learning Spanish',
		me: 'LangX app: a twelve-day streak and recent chats'
	};
</script>

<figure class="demo" data-hue={HUE[screen]}>
	<div class="device">
		<Phone label={LABELS[screen]} width={300} cut="always" cutHeight={470}>
			{#if screen === 'chat'}
				<ThreadScreen
					partner="george"
					hue="mint"
					composer={false}
					items={[
						{ t: 'me', text: '¿Cuántos años tienes?', lang: 'es' },
						{ t: 'them', text: 'Yo soy 25 años.', lang: 'es' }
					]}
					sheet={{
						title: 'Fix George’s sentence',
						before: ['Yo ', { del: 'soy' }, ' 25 años.'],
						after: [{ ins: 'Tengo' }, ' 25 años.'],
						note: 'In Spanish you have your age: tener, not ser.',
						lang: 'es'
					}}
				/>
			{:else if screen === 'me'}
				<TodayScreen hue="tangerine" />
			{:else}
				<PeopleScreen />
			{/if}
		</Phone>
	</div>
	<figcaption>
		<span class="tag">In the app</span>
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
		grid-template-columns: 300px 1fr;
		gap: 36px;
		margin: var(--space-lg) 0;
		padding: 40px 40px 0;
		border-radius: 40px;
		overflow: hidden;

		@media (max-width: 720px) {
			grid-template-columns: 1fr;
			gap: 24px;
			padding: 28px 20px 0;
			border-radius: 32px;
		}
	}

	.device {
		display: flex;
		justify-content: center;
		align-self: end;

		@media (max-width: 720px) {
			order: 2;
		}
	}

	figcaption {
		display: flex;
		flex-direction: column;
		gap: 14px;
		align-self: center;
		padding-bottom: 40px;

		@media (max-width: 720px) {
			padding-bottom: 0;
		}
	}

	.tag {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		height: 30px;
		padding: 0 12px;
		border-radius: 999px;
		background: var(--color--ink);
		color: var(--block);
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 14px;
	}

	.t {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.75rem;
		line-height: 1.15;
	}

	.x {
		font-size: 1.0625rem;
		line-height: 1.55;
		font-weight: 500;
	}

	.fine {
		font-size: 0.8125rem;
		font-weight: 600;
	}
</style>
