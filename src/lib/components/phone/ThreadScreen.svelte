<script lang="ts">
	import Face from './Face.svelte';
	import Parts from './Parts.svelte';
	import { PEOPLE, type Hue, type PersonId } from './people';
	import type { FixSheet, ThreadItem } from './thread';
	import { bubbleBuild } from '$lib/utils/bubbleBuild';

	interface Props {
		partner: PersonId;
		hue: Hue;
		items: ThreadItem[];
		/** The line under the name; defaults to their languages. */
		sub?: string;
		composer?: boolean;
		/** `loop` in the hero, `once` in a chapter, `none` where it should just sit. */
		build?: 'loop' | 'once' | 'none';
		/** A correction being written, over a dimmed thread. */
		sheet?: FixSheet;
		eager?: boolean;
	}

	let {
		partner,
		hue,
		items,
		sub,
		composer = true,
		build = 'none',
		sheet,
		eager = false
	}: Props = $props();

	const person = $derived(PEOPLE[partner]);
	const line = $derived(sub ?? `${person.native} · learning ${person.learning}`);
</script>

<div class="head" data-hue={hue}>
	<Face who={partner} size={42} {eager} ring="var(--color--page-background)" />
	<span class="who">
		<span class="name">{person.name}</span>
		<span class="sub">{line}</span>
	</span>
</div>

<div class="list" class:top={!!sheet} use:bubbleBuild={build}>
	{#each items as item}
		{#if item.t === 'day'}
			<span class="day">{item.text}</span>
		{:else if item.t === 'fix'}
			<div class="fix" data-b lang={item.lang}>
				<span class="by">
					<svg
						aria-hidden="true"
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z" /></svg
					>{item.by} corrected you</span
				>
				<span><Parts parts={item.parts} /></span>
			</div>
		{:else}
			<div class="bubble {item.t}" data-b lang={item.lang}>{item.text}</div>
		{/if}
	{/each}
</div>

{#if composer}
	<div class="composer">
		<span class="field">Message {person.name}</span>
		<span class="send"
			><svg
				aria-hidden="true"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg
			></span
		>
	</div>
{/if}

{#if sheet}
	<div class="dim"></div>
	<div class="sheet" lang={sheet.lang}>
		<span class="grab"></span>
		<span class="title">{sheet.title}</span>
		<span class="before"><Parts parts={sheet.before} /></span>
		<span class="after"><Parts parts={sheet.after} /></span>
		{#if sheet.note}<span class="note">{sheet.note}</span>{/if}
		<span class="cta"
			><svg
				aria-hidden="true"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg
			>Send correction</span
		>
	</div>
{/if}

<style lang="scss">
	.head {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 20px 14px 12px;
		border-radius: 0 0 24px 24px;
	}

	.who {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.name {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 22px;
		line-height: 25px;
	}

	.sub {
		font-size: 12px;
		line-height: 16px;
		font-weight: 700;
	}

	.list {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 8px;
		padding: 12px 10px;
		overflow: hidden;
	}

	// Under a sheet the thread sits at the top, where the dim still shows it.
	.top {
		justify-content: flex-start;
	}

	.day {
		align-self: center;
		font-size: 12px;
		font-weight: 700;
		color: var(--color--text-shade);
	}

	.bubble {
		max-width: 82%;
		padding: 9px 12px;
		font-size: 14px;
		line-height: 19px;
	}

	.them {
		align-self: flex-start;
		background: var(--color--muted);
		border-radius: 20px 20px 20px 7px;
	}

	.me {
		align-self: flex-end;
		background: var(--color--blue);
		color: var(--color--on-blue);
		border-radius: 20px 20px 7px 20px;
	}

	.fix {
		align-self: flex-start;
		max-width: 82%;
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding: 8px 12px 10px;
		border: 2px solid var(--color--success);
		border-radius: 18px;
		font-size: 14px;
		line-height: 19px;
	}

	.by {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 12px;
		line-height: 15px;
		font-weight: 800;
		color: var(--color--success);
	}

	// The bubble build. The start state is only ever a class the script adds.
	[data-b] {
		transition:
			opacity 300ms ease,
			transform 300ms var(--ease-out);
	}
	:global(.b-building) [data-b]:not(:global(.b-on)) {
		opacity: 0;
		transform: translateY(12px);
	}

	.composer {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 10px 14px;
	}

	.field {
		flex: 1;
		height: 38px;
		display: flex;
		align-items: center;
		padding: 0 14px;
		border-radius: 999px;
		background: var(--color--muted);
		font-size: 13px;
		color: var(--color--text-shade);
	}

	.send {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color--blue);
		color: var(--color--on-blue);
	}

	.dim {
		position: absolute;
		inset: 0;
		background: rgba(12, 13, 16, 0.45);
	}

	.sheet {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 10px 14px 18px;
		border-radius: 26px 26px 0 0;
		background: var(--color--page-background);
	}

	.grab {
		align-self: center;
		width: 40px;
		height: 5px;
		border-radius: 999px;
		background: var(--color--track);
	}

	.title {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 19px;
		line-height: 23px;
	}

	.before {
		font-size: 13px;
		line-height: 18px;
		color: var(--color--text-shade);
	}

	.after {
		padding: 10px 12px;
		border: 2px solid var(--color--success);
		border-radius: 18px;
		font-size: 15px;
		line-height: 21px;
	}

	.note {
		padding: 10px 12px;
		border-radius: 18px;
		background: var(--color--muted);
		font-size: 13px;
		line-height: 18px;
	}

	.cta {
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: 999px;
		background: var(--color--blue);
		color: var(--color--on-blue);
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 16px;
	}

	@media (prefers-reduced-motion: reduce) {
		[data-b] {
			transition: none;
		}
	}
</style>
