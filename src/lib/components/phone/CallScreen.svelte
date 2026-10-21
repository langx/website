<script lang="ts">
	import Face from './Face.svelte';
	import { PEOPLE, type PersonId } from './people';

	interface Props {
		who?: PersonId;
		kind?: 'Voice' | 'Video';
		time?: string;
	}

	let { who = 'george', kind = 'Voice', time = '04:12' }: Props = $props();

	const person = $derived(PEOPLE[who]);
	const controls = [
		{
			id: 'mic',
			d: 'M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3zM6 11a6 6 0 0 0 12 0M12 17v3'
		},
		{ id: 'video', d: 'M4 7h11v10H4zM15 10l5-3v10l-5-3' },
		{ id: 'speaker', d: 'M5 10v4h3l4 4V6L8 10zM16 9a4 4 0 0 1 0 6' }
	];
</script>

<!-- A call in progress, in the app's dark call screen. Use inside <Phone dark>. -->
<div class="call">
	<div class="who">
		<Face {who} size={112} />
		<span class="name">{person.name}</span>
		<span class="langs">{person.native} · learning {person.learning}</span>
		<span class="chip"><span class="live"></span>{kind} call · {time}</span>
	</div>
	<div class="controls" aria-hidden="true">
		{#each controls as c}
			<span class="ctl"
				><svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d={c.d} /></svg
				></span
			>
		{/each}
		<span class="ctl end"
			><svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M3 14c5-5 13-5 18 0l-3 2-2-3H8l-2 3z" /></svg
			></span
		>
	</div>
</div>

<style lang="scss">
	.call {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 56px 16px 28px;
	}

	.who {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		text-align: center;
	}

	.name {
		margin-top: 6px;
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 26px;
		line-height: 30px;
	}

	.langs {
		font-size: 13px;
		font-weight: 700;
		color: #a3a8b3;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 26px;
		padding: 0 10px;
		border-radius: 999px;
		background: #2a2d33;
		font-size: 12px;
		font-weight: 800;
	}

	.live {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color--online);
	}

	.controls {
		display: flex;
		justify-content: space-between;
		padding: 0 4px;
	}

	.ctl {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #2a2d33;
		color: #f2f3f5;
	}

	.end {
		background: #e5484d;
		color: #ffffff;
	}
</style>
