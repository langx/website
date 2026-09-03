<script lang="ts">
	import { onDestroy } from 'svelte';
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import { inview } from '$lib/utils/inview';

	/**
	 * Screen 04, with the mechanism played once: two messages land, Lucía
	 * types, and a correction card arrives. The end state is what the server
	 * renders, so the page never depends on the choreography.
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
		<UiIcon name="back" size={20} />
		<Avatar src="/images/people/lucia.webp" initials="LM" size={40} name="Lucía M." />
		<div class="who">
			<div class="name">Lucía M.</div>
			<div class="online">Online</div>
		</div>
		<span class="more"><UiIcon name="more" size={20} /></span>
	</header>

	<div class="thread" aria-live="polite">
		<div class="day">Today</div>

		<div class="bubble them" class:in={stage >= 1}>
			<div class="text">¿Cómo fue tu fin de semana? Cuéntame en inglés si quieres.</div>
			<div class="meta">09:12</div>
		</div>

		<div class="bubble me" class:in={stage >= 2}>
			<div class="text">Fui a la playa con mi hermana. Hacía mucho calor y yo no llevé agua.</div>
			<div class="meta right">09:14 · read</div>
		</div>

		<div class="typing" class:in={stage === 3}>Lucía is typing…</div>

		<div class="correction" class:in={stage >= 4}>
			<div class="from">Correction · Lucía</div>
			<div class="fixed">
				Hacía mucho calor y <s>yo</s> no llevé agua.
			</div>
			<div class="why">
				The «yo» isn't wrong, it just sounds emphatic — like you specifically forgot.
			</div>
			<div class="actions">
				<span class="save">Save to notes</span>
				<span class="thanks">Thanks</span>
			</div>
		</div>
	</div>

	<div class="compose">
		<div class="row">
			<span class="plus"><UiIcon name="plus" size={22} /></span>
			<span class="input">Message in Spanish…</span>
			<span class="send"><UiIcon name="send" size={17} /></span>
		</div>
		<div class="hint">Hold a message to correct it</div>
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
		padding: 10px 20px 14px;
		border-bottom: 1px solid var(--color--border);
		color: var(--color--text);
	}

	.who {
		flex: 1;
		min-width: 0;
	}

	.name {
		font-family: var(--font--title);
		font-size: 16px;
		font-weight: 800;
	}

	.online {
		font-size: 13px;
		font-weight: 600;
		color: var(--color--success);
	}

	.more {
		color: var(--color--text-shade);
		display: inline-flex;
	}

	.thread {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 18px 20px 0;
	}

	.day {
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color--text-tertiary);
	}

	.bubble {
		max-width: 80%;
		padding: 13px 16px;
		border-radius: var(--radius-bubble);

		.text {
			font-size: 16px;
			line-height: 1.5;
		}

		.meta {
			font-size: 11px;
			color: var(--color--text-tertiary);
			margin-top: 6px;

			&.right {
				text-align: right;
			}
		}
	}

	.them {
		background: var(--color--muted);
		border-bottom-left-radius: 6px;
	}

	.me {
		max-width: 82%;
		align-self: flex-end;
		background: var(--color--accent-tint);
		border-bottom-right-radius: 6px;
	}

	.typing {
		align-self: flex-end;
		font-size: 13px;
		color: var(--color--text-tertiary);
		order: 5;
	}

	.correction {
		background: var(--color--success-tint);
		border-radius: var(--radius-lg);
		padding: 15px 16px;
		flex-shrink: 0;

		.from {
			font-size: 13px;
			font-weight: 700;
			color: var(--color--success);
		}

		.fixed {
			font-size: 16px;
			line-height: 1.55;
			font-weight: 600;
			margin-top: 9px;

			s {
				font-weight: 400;
				color: var(--color--text-shade);
			}
		}

		.why {
			font-size: 14px;
			line-height: 1.55;
			color: var(--color--text-shade);
			margin-top: 9px;
		}

		.actions {
			display: flex;
			gap: 20px;
			margin-top: 12px;
			font-size: 14px;

			.save {
				font-weight: 700;
				color: var(--color--success);
			}

			.thanks {
				font-weight: 600;
				color: var(--color--text-shade);
			}
		}
	}

	// Choreography: everything enters from an already-visible offset, ease-out,
	// and the correction card scales up from 0.97 — never from nothing.
	.bubble,
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
		border-top: 1px solid var(--color--border);
		padding: 12px 16px 20px;
		flex: 0 0 auto;
		margin-top: auto;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.plus {
		color: var(--color--text-shade);
		display: inline-flex;
	}

	.input {
		flex: 1;
		min-height: 46px;
		background: var(--color--muted);
		border-radius: var(--radius-pill);
		display: flex;
		align-items: center;
		padding: 0 18px;
		font-size: 15px;
		color: var(--color--text-tertiary);
	}

	.send {
		width: 46px;
		height: 46px;
		background: var(--color--primary);
		color: var(--color--on-primary);
		border-radius: var(--radius-pill);
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
	}

	.hint {
		text-align: center;
		font-size: 12px;
		color: var(--color--text-tertiary);
		margin-top: 10px;
	}

	@media (prefers-reduced-motion: reduce) {
		.bubble,
		.correction,
		.typing {
			transition: none;
			transform: none;
		}
	}
</style>
