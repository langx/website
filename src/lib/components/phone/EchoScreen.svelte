<script lang="ts">
	import Face from './Face.svelte';
	import { PEOPLE, type PersonId } from './people';

	interface Props {
		/** Whose chat the card came from. */
		from?: PersonId;
		/** The sentence kept from the chat. */
		sentence?: string;
		/** The part that was corrected, marked in the sentence. */
		mark?: string;
		meaning?: string;
		lang?: string;
		position?: number;
		total?: number;
	}

	let {
		from = 'george',
		sentence = 'On Saturday I went to the beach.',
		mark = 'to',
		meaning = 'El sábado fui a la playa.',
		lang = 'en',
		position = 4,
		total = 12
	}: Props = $props();

	const at = $derived(sentence.indexOf(` ${mark} `));
	const head = $derived(at < 0 ? sentence : sentence.slice(0, at));
	const tail = $derived(at < 0 ? '' : sentence.slice(at + mark.length + 2));
</script>

<!--
	An Echo review, the way the app has it today: a sentence kept from a chat,
	the answer shown, and the two buttons that decide when it comes back.
-->
<div class="body">
	<div class="bar">
		<span class="x" aria-hidden="true">
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg
			>
		</span>
		<span class="track"><span class="fill" style="width:{(position / total) * 100}%"></span></span>
		<span class="count">{position} of {total}</span>
	</div>

	<span class="from"><Face who={from} size={20} />From your chat with {PEOPLE[from].name}</span>
	<span class="kind">Do you remember it?</span>
	<span class="sentence" {lang}
		>{#if tail}{head} <u>{mark}</u> {tail}{:else}{sentence}{/if}</span
	>
	<span class="meaning" lang="es">{meaning}</span>

	<span class="again">Remember it, and the next wait is longer.</span>
	<div class="buttons">
		<span class="btn soft">Again</span>
		<span class="btn blue">Remembered</span>
	</div>
</div>

<style lang="scss">
	.body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 20px 14px 18px;
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.x {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color--muted);
	}

	.track {
		flex: 1;
		height: 8px;
		border-radius: 999px;
		background: var(--color--track);
		overflow: hidden;
	}

	.fill {
		display: block;
		height: 100%;
		border-radius: 999px;
		background: var(--color--blue);
	}

	.count {
		font-size: 12px;
		font-weight: 800;
	}

	.from {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 3px 10px 3px 3px;
		border-radius: 999px;
		background: var(--color--lilac);
		color: var(--color--ink);
		font-size: 12px;
		font-weight: 800;
	}

	.kind {
		font-size: 12px;
		font-weight: 700;
		color: var(--color--text-shade);
	}

	.sentence {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 20px;
		line-height: 26px;

		u {
			text-decoration: none;
			padding: 0 6px;
			border-bottom: 3px solid var(--color--success);
			color: var(--color--success);
		}
	}

	.meaning {
		padding: 10px 12px;
		border-radius: 18px;
		background: var(--color--muted);
		font-size: 14px;
		line-height: 19px;
	}

	.again {
		margin-top: auto;
		color: var(--color--text-shade);
		font-size: 13px;
		line-height: 18px;
		font-weight: 600;
	}

	.buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}

	.btn {
		height: 46px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 15px;
	}

	.soft {
		background: var(--color--muted);
	}

	.blue {
		background: var(--color--blue);
		color: var(--color--on-blue);
	}
</style>
