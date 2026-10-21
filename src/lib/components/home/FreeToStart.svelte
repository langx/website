<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import { rise } from '$lib/utils/rise';
</script>

<!-- Plans, with no numbers: prices and limits live on /plans. -->
<section class="free" aria-labelledby="free-title" use:rise>
	<div class="head" data-rise>
		<h2 id="free-title" class="display-section">free to start.</h2>
		<p>
			LangX is a free language exchange app. Chatting, replies and corrections never cost anything.
			Pro is there when you want more people to talk to.
		</p>
	</div>
	<div class="cards">
		<div class="card free-card" data-rise>
			<h3>Free</h3>
			<p>Chats, corrections, calls and Echo. Everything you need to start talking today.</p>
			<span class="check"
				><svg
					aria-hidden="true"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg
				>Replies and corrections are free on every plan</span
			>
		</div>
		<div class="card pro-card" data-hue="blue" data-rise>
			<h3>Pro</h3>
			<p>
				Unlimited new chats and unlimited translations, for when you want to meet more people
				faster.
			</p>
			<Button href="/plans" variant="light" size="md">See plans</Button>
		</div>
	</div>
</section>

<style lang="scss">
	.free {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: 12px;

		p {
			margin: 0;
			max-width: 520px;
			color: var(--color--text-shade);
		}
	}

	.cards {
		display: grid;
		gap: 12px;

		@media (min-width: 900px) {
			grid-template-columns: 1fr 1fr;
		}
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		padding: 24px;
		border-radius: 28px;

		h3 {
			margin: 0;
			color: inherit;
			font-weight: 900;
			font-size: 1.75rem;
		}

		p {
			margin: 0;
			max-width: 420px;
		}
	}

	.free-card {
		background: var(--color--muted);
	}

	.check {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-weight: 700;
		font-size: 0.9375rem;
		color: var(--color--success);
	}
</style>
