<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';

	let email = '';
	let state: 'idle' | 'sending' | 'ok' | 'error' = 'idle';

	async function handleSubmit() {
		if (state === 'sending') return;
		state = 'sending';
		try {
			const response = await fetch('https://api.langx.io/public/newsletter', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});
			const data = await response.json();
			if (data.status === 'ok') {
				email = '';
				state = 'ok';
			} else {
				state = 'error';
			}
		} catch {
			state = 'error';
		}
	}
</script>

<form class="newsletter" on:submit|preventDefault={handleSubmit} novalidate>
	<label for="email-address" class="sr-only">Email address</label>
	<div class="field">
		<input
			id="email-address"
			name="email"
			type="email"
			autocomplete="email"
			inputmode="email"
			required
			placeholder="you@example.com"
			bind:value={email}
			on:input={() => (state = 'idle')}
			aria-describedby="newsletter-status"
		/>
		<Button type="submit" variant="dark" size="md" disabled={state === 'sending'}>
			{state === 'sending' ? 'Sending…' : 'Subscribe'}
		</Button>
	</div>
	<p
		id="newsletter-status"
		class="status"
		class:ok={state === 'ok'}
		class:error={state === 'error'}
		aria-live="polite"
	>
		{#if state === 'ok'}
			You're on the list. One email when something changes, nothing else.
		{:else if state === 'error'}
			That didn't go through. Check the address and try again.
		{:else}
			No tracking pixels, unsubscribe in one click.
		{/if}
	</p>
</form>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.newsletter {
		width: 100%;
		max-width: 30rem;
	}

	.field {
		display: flex;
		gap: 8px;

		@include for-phone-only {
			flex-direction: column;
		}
	}

	input {
		flex: 1;
		min-width: 0;
		min-height: 48px;
		padding: 0 18px;
		font-size: 0.9375rem;
		color: var(--color--text);
		background: var(--color--muted);
		border: 1px solid transparent;
		border-radius: var(--radius-pill);
		appearance: none;
		transition: border-color var(--dur-fast) ease, background-color var(--dur-fast) ease;

		&::placeholder {
			color: var(--color--text-quiet);
		}

		&:focus-visible {
			outline: none;
			border-color: var(--color--accent);
			background: var(--color--surface);
		}
	}

	.status {
		margin: 10px 0 0;
		font-size: 0.8125rem;
		color: var(--color--text-quiet);
		transition: color var(--dur-fast) ease;

		&.ok {
			color: var(--color--success);
		}
		&.error {
			color: var(--color--error);
		}
	}
</style>
