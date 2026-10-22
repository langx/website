<script lang="ts">
	import Face from './Face.svelte';
	import { PEOPLE, type Hue, type PersonId } from './people';

	interface Card {
		who: PersonId;
		hue: Hue;
		quote: string;
		online?: boolean;
	}

	interface Props {
		/** The visitor's own language: everyone shown is learning it. */
		learning?: string;
		/** The language the visitor is learning: everyone shown speaks it. */
		speaks?: string;
		cards?: Card[];
		/** The first card's button, saying hello. */
		hello?: boolean;
	}

	let {
		learning = 'Spanish',
		speaks = 'English',
		cards = [
			{
				who: 'yuki',
				hue: 'tangerine',
				quote: '“I want to read García Márquez without a dictionary.”',
				online: true
			},
			{ who: 'katya', hue: 'mint', quote: '“Happy to help with English. Slowly, please!”' },
			{ who: 'anna', hue: 'sky', quote: '“Looking for someone to talk films with.”' }
		],
		hello = true
	}: Props = $props();
</script>

<div class="body">
	<!-- No tab name here: the site shows what the app does, not 3.0's tab bar. -->
	<span class="title">Learning {learning}</span>
	<div class="chips">
		<span class="chip on">Speaks {speaks}</span>
		<span class="chip">Online now</span>
	</div>
	{#each cards as card, i}
		{@const p = PEOPLE[card.who]}
		<div class="card" data-hue={card.hue}>
			<div class="top">
				<span style="--dot-ring: var(--block)"
					><Face who={card.who} size={50} online={card.online} /></span
				>
				<span class="who">
					<span class="name">{p.name}</span>
					<span class="langs">{p.native} · learning {p.learning}</span>
				</span>
			</div>
			<span class="quote">{card.quote}</span>
			{#if hello && i === 0}<span class="hello">Say hello to {p.name}</span>{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.body {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 22px 12px 10px;
		overflow: hidden;
	}

	.title {
		padding: 0 4px;
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 30px;
		line-height: 34px;
	}

	.chips {
		display: flex;
		gap: 6px;
	}

	.chip {
		height: 32px;
		display: flex;
		align-items: center;
		padding: 0 12px;
		border-radius: 999px;
		background: var(--color--muted);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 13px;

		&.on {
			background: var(--color--text);
			color: var(--color--page-background);
			font-weight: 900;
		}
	}

	.card {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 14px;
		border-radius: 26px;
	}

	.top {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.who {
		display: flex;
		flex-direction: column;
	}

	.name {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 22px;
		line-height: 26px;
	}

	.langs {
		font-size: 12px;
		line-height: 16px;
		font-weight: 700;
	}

	.quote {
		font-size: 13px;
		line-height: 18px;
		font-weight: 600;
	}

	.hello {
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: var(--color--ink);
		color: var(--color--on-ink);
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 14px;
	}
</style>
