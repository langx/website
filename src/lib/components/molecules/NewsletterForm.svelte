<script lang="ts">
	import { enhance } from '$app/forms';
	// /** @type {import('./$types').ActionData} */
	// /* svelte-ignore unused-export-let */
	export let form;
	export let styles: string = '';
	let sending: boolean = false;
	let email: string = '';

	if (form?.success) {
		sending = false;
	}
</script>

<form style={styles} method="POST" action="" use:enhance>
	<label for="email-address" class="sr-only">Email address</label>
	<input
		id="email-address"
		name="email"
		type="email"
		autocomplete="email"
		required
		placeholder="Enter your email"
		bind:value={email}
	/>
	<button
		type="submit"
		on:click={async (event) => {
			event.preventDefault();
			sending = true;
			const response = await fetch('http://localhost:3000/api/mail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});
			const data = await response.json();
			console.log(data);
			sending = false;
		}}
		disabled={sending}
	>
		{#if sending}
			<span class="sr-only">Loading...</span>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="#f5b29a" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
		{:else}
			Subscribe
		{/if}
	</button>
</form>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	form {
		column-gap: 1rem;
		max-width: 28rem;
		display: flex;

		@include for-tablet-portrait-down {
			flex-direction: column;
			width: 100%;
		}

		.sr-only {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border-width: 0;
		}

		#email-address {
			line-height: 1.5rem;
			font-size: 0.875rem;
			background-color: #ffffff;
			color: rgb(17 24 39 / 1);
			padding: 0.5rem 0.875rem;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
			border-width: 0;
			border-radius: 0.375rem;
			flex: 1 1 auto;
			min-width: 0;
			appearance: none;
			margin: 0;
		}

		button {
			display: flex;
			justify-content: center;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
			color: var(--color--secondary);
			font-weight: 600;
			font-size: 0.875rem;
			line-height: 1.25rem;
			padding: 0.625rem 0.875rem;
			background-color: #ffffff;
			border-radius: 0.375rem;
			flex: none;
			background-image: none;
			cursor: pointer;
			text-transform: none;
			margin: 0;
			outline: none;
			border: none;
			transition: color 0.2s, background-color 0.2s;

			@include for-tablet-portrait-down {
				margin-top: 1rem;
			}

			&:hover {
				background-color: var(--color--secondary);
				color: #ffffff;
			}

			svg {
				height: 20px;
				width: 20px;
				animation: spin 1s linear infinite;
			}
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
