<script lang="ts">
	import Face from './Face.svelte';
	import { PEOPLE, type Hue, type PersonId } from './people';

	interface Row {
		who: PersonId;
		text: string;
		unread?: number;
	}

	interface Props {
		greeting?: string;
		/** Days in a row, including today. */
		streak?: number;
		/** The streak card's colour. */
		hue?: Hue;
		rows?: Row[];
		/** Whether today already counts (every dot filled). */
		todayDone?: boolean;
		/** A blue card under the streak, for a reward it earned. */
		reward?: { title: string; body: string; action?: string };
	}

	let {
		greeting = 'Good evening, Sofia',
		streak = 12,
		hue = 'tangerine',
		todayDone = false,
		reward,
		rows = [
			{ who: 'george', text: 'Your past tense is getting really good', unread: 2 },
			{ who: 'marina', text: 'Estoy muy cansada hoy.' },
			{ who: 'yuki', text: '¿Qué libro me recomiendas?' }
		]
	}: Props = $props();

	const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
</script>

<div class="body">
	<span class="hi">{greeting}</span>

	<div class="streak" data-hue={hue}>
		<span class="days">
			<svg
				aria-hidden="true"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path d="M12 3c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-4 2-7 2 1 3 3 3 5 1-1 1-5 1-9z" /></svg
			>{streak} days in a row
		</span>
		<span class="week">
			{#each days as d, i}
				<span class="day">
					<span class="dot" class:today={i === 6 && !todayDone}>
						{#if i < 6 || todayDone}<svg
								aria-hidden="true"
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3.5"
								stroke-linecap="round"
								stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg
							>{/if}
					</span>
					<span class="d">{d}</span>
				</span>
			{/each}
		</span>
		{#if !todayDone}<span class="hint">Write to someone today to keep it going.</span>{/if}
	</div>

	{#if reward}
		<div class="reward">
			<span class="r-title">{reward.title}</span>
			<span class="r-body">{reward.body}</span>
			{#if reward.action}<span class="r-action">{reward.action}</span>{/if}
		</div>
	{/if}

	<span class="label">Chats</span>
	{#each rows as row}
		<div class="row">
			<Face who={row.who} size={40} />
			<span class="txt">
				<span class="name">{PEOPLE[row.who].name}</span>
				<span class="last">{row.text}</span>
			</span>
			{#if row.unread}<span class="badge">{row.unread}</span>{/if}
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

	.hi {
		padding: 0 4px;
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 22px;
		line-height: 26px;
	}

	.streak {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 14px;
		border-radius: 24px;
	}

	.days {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 20px;
	}

	.week {
		display: flex;
		justify-content: space-between;
	}

	.day {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}

	.dot {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color--ink);
		color: var(--block);

		&.today {
			background: transparent;
			box-shadow: inset 0 0 0 2.5px var(--color--ink);
		}
	}

	.d {
		font-size: 12px;
		font-weight: 800;
	}

	.hint {
		font-size: 13px;
		line-height: 18px;
		font-weight: 600;
	}

	.reward {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
		padding: 14px;
		border-radius: 24px;
		background: var(--color--blue);
		color: var(--color--on-blue);
	}

	.r-title {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 18px;
		line-height: 22px;
	}

	.r-body {
		font-size: 13px;
		line-height: 18px;
		font-weight: 600;
	}

	.r-action {
		margin-top: 4px;
		height: 36px;
		display: flex;
		align-items: center;
		padding: 0 14px;
		border-radius: 999px;
		background: #ffffff;
		color: var(--color--blue);
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 13px;
	}

	.label {
		margin-top: 4px;
		padding: 0 4px;
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 16px;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 10px;
		border-radius: 20px;
		background: var(--color--muted);
	}

	.txt {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.name {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 15px;
	}

	.last {
		font-size: 12px;
		line-height: 16px;
		color: var(--color--text-shade);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.badge {
		min-width: 22px;
		height: 22px;
		padding: 0 6px;
		border-radius: 999px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color--blue);
		color: var(--color--on-blue);
		font-size: 12px;
		font-weight: 800;
	}
</style>
