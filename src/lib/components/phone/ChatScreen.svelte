<script lang="ts">
	import { onDestroy } from 'svelte';
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import { inview } from '$lib/utils/inview';

	/**
	 * `app/(app)/chat/[id]` from the design handoff, with the mechanism played
	 * once: two messages land, Lucía types, and a correction card arrives. The
	 * end state is what the server renders, so the page never depends on the
	 * choreography.
	 */
	export let animate = true;
	/** Replay the choreography every few seconds, like a looping demo. */
	export let loop = false;

	// 0 nothing · 1 first message · 2 reply · 3 typing · 4 correction
	let stage = 4;
	let played = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function schedule() {
		timers.forEach(clearTimeout);
		timers = [];
		stage = 0;
		const steps: [number, number][] = [
			[1, 250],
			[2, 1100],
			[3, 1900],
			[4, 3100]
		];
		for (const [next, at] of steps) {
			timers.push(setTimeout(() => (stage = next), at));
		}
		if (loop) timers.push(setTimeout(schedule, 8000));
	}

	function play() {
		if (played || !animate) return;
		played = true;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		schedule();
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="chat" use:inview={{ threshold: 0.4 }} on:enter={play}>
	<header class="top">
		<span class="back"><UiIcon name="back" size={22} /></span>
		<Avatar src="/images/people/lucia.webp" initials="LM" size={40} name="Lucía M." online />
		<div class="who">
			<span class="name">Lucía M.</span>
			<span class="status">Online</span>
		</div>
		<span class="more"><UiIcon name="more" size={22} /></span>
	</header>

	<div class="thread" aria-live="polite">
		<div class="day">Today</div>

		<div class="tip">
			Hold any message to correct it — corrections are the most useful thing you can send.
		</div>

		<div class="msg them" class:in={stage >= 1}>
			<span class="bubble">¿Cómo fue tu fin de semana? Cuéntame en inglés si quieres.</span>
			<span class="translation">
				<UiIcon name="translate" size={14} />How was your weekend? Tell me in English if you like.
			</span>
			<span class="meta">09:12</span>
		</div>

		<div class="msg mine" class:in={stage >= 2}>
			<span class="bubble"
				>Fui a la playa con mi hermana. Hacía mucho calor y yo no llevé agua.</span
			>
			<span class="meta">09:14 · Read</span>
		</div>

		<div class="typing" class:in={stage === 3} aria-label="Lucía is typing">
			<span /><span /><span />
		</div>

		<div class="correction" class:in={stage >= 4}>
			<span class="from">Correction from Lucía</span>
			<span class="was">Hacía mucho calor y yo no llevé agua.</span>
			<span class="now">Hacía mucho calor y no llevé agua.</span>
			<span class="note">
				The «yo» isn't wrong, it just sounds emphatic — like you specifically forgot.
			</span>
			<span class="time">09:15</span>
		</div>
	</div>

	<div class="compose">
		<span class="plus"><UiIcon name="plus" size={22} /></span>
		<span class="field">Message in Spanish…</span>
		<span class="send"><UiIcon name="send" size={20} /></span>
	</div>
</div>

<style lang="scss">
	.chat {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}

	.top {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 6px 16px 12px;
		border-bottom: 1px solid var(--color--border);
		color: var(--color--text);
		flex: 0 0 auto;
	}

	.back {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		flex: 0 0 auto;
	}

	.who {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.name {
		font-family: var(--font--title);
		font-size: 17px;
		font-weight: 800;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.status {
		font-size: 13px;
		color: var(--color--success);
	}

	.more {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		flex: 0 0 auto;
	}

	.thread {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 16px 16px 8px;
	}

	.day {
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color--text-tertiary);
		padding: 4px 0 10px;
	}

	// The app teaches the mechanism in the thread itself, not in the compose bar.
	.tip {
		align-self: center;
		max-width: 300px;
		padding: 10px 16px;
		border-radius: var(--radius-lg);
		background: var(--color--accent-tint);
		font-size: 13px;
		line-height: 1.4;
		text-align: center;
	}

	.msg {
		max-width: 78%;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.bubble {
		padding: 13px 16px;
		font-size: 16px;
		line-height: 1.45;
		text-wrap: pretty;
	}

	.them {
		align-self: flex-start;
		align-items: flex-start;

		.bubble {
			background: var(--color--muted);
			border-radius: var(--radius-bubble) var(--radius-bubble) var(--radius-bubble) 6px;
		}
	}

	.mine {
		align-self: flex-end;
		align-items: flex-end;

		.bubble {
			background: var(--color--accent-tint);
			border-radius: var(--radius-bubble) var(--radius-bubble) 6px var(--radius-bubble);
			text-align: left;
		}
	}

	// The translation sits under the bubble in blue, never inside it.
	.translation {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding: 0 6px;
		font-size: 14px;
		line-height: 1.4;
		color: var(--color--accent);

		:global(svg) {
			margin-top: 3px;
		}
	}

	.meta {
		font-size: 11px;
		color: var(--color--text-tertiary);
	}

	.typing {
		align-self: flex-start;
		display: flex;
		gap: 5px;
		background: var(--color--muted);
		border-radius: var(--radius-bubble) var(--radius-bubble) var(--radius-bubble) 6px;
		padding: 14px 18px;

		span {
			width: 7px;
			height: 7px;
			border-radius: var(--radius-pill);
			background: var(--color--text-shade);
			animation: blink 1.2s infinite;

			&:nth-child(2) {
				animation-delay: 0.2s;
			}

			&:nth-child(3) {
				animation-delay: 0.4s;
			}
		}
	}

	@keyframes blink {
		0%,
		80%,
		100% {
			opacity: 0.3;
		}
		40% {
			opacity: 1;
		}
	}

	.correction {
		align-self: stretch;
		display: flex;
		flex-direction: column;
		gap: 6px;
		background: var(--color--success-tint);
		border-radius: var(--radius-lg);
		padding: 14px 16px;
		flex-shrink: 0;

		.from {
			font-size: 12px;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			color: var(--color--success);
		}

		.was {
			font-size: 15px;
			line-height: 1.45;
			color: var(--color--text-shade);
			text-decoration: line-through;
		}

		.now {
			font-size: 16px;
			line-height: 1.45;
			font-weight: 600;
		}

		.note {
			width: 100%;
			font-size: 14px;
			line-height: 1.45;
			color: var(--color--text-shade);
			border-top: 1px solid rgba(0, 159, 112, 0.2);
			padding-top: 8px;
			margin-top: 2px;
		}

		.time {
			align-self: flex-end;
			font-size: 11px;
			color: var(--color--text-tertiary);
		}
	}

	// Choreography: everything enters from an already-visible offset, ease-out,
	// and the correction card scales up from 0.97 — never from nothing.
	.msg,
	.correction,
	.typing {
		opacity: 0;
		transform: translateY(8px);
		transition: opacity var(--dur-enter) var(--ease-out), transform var(--dur-enter) var(--ease-out);

		&.in {
			opacity: 1;
			transform: none;
		}
	}

	.correction {
		transform: translateY(10px) scale(0.97);
	}

	.typing {
		transition-duration: var(--dur-fast);
		transform: none;
	}

	.compose {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		border-top: 1px solid var(--color--border);
		padding: 10px 16px 28px;
		flex: 0 0 auto;
		margin-top: auto;
	}

	.plus {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 48px;
		color: var(--color--text-shade);
		flex: 0 0 auto;
	}

	.field {
		flex: 1;
		min-height: 48px;
		display: flex;
		align-items: center;
		background: var(--color--muted);
		border-radius: 24px;
		padding: 13px 18px;
		font-size: 16px;
		line-height: 1.4;
		color: var(--color--text-tertiary);
	}

	// The one yellow inside the device, and the only control with the app's
	// hard ledge under it.
	.send {
		width: 48px;
		height: 48px;
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color--primary);
		color: var(--color--on-primary);
		border-radius: 14px;
		box-shadow: 0 3px 0 var(--color--primary-shade);
	}

	@media (prefers-reduced-motion: reduce) {
		.msg,
		.correction,
		.typing {
			transition: none;
			transform: none;
		}

		.typing span {
			animation: none;
		}
	}
</style>
