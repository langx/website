<script lang="ts">
	import { onMount } from 'svelte';

	// Bumped when the announcement itself changes, so a new message reaches
	// people who dismissed the previous one.
	const STORAGE_KEY = 'announcement-dismissed-v2-launch';

	let show = false;

	onMount(() => {
		if (localStorage.getItem(STORAGE_KEY) !== 'true') {
			const t = setTimeout(() => (show = true), 2500);
			return () => clearTimeout(t);
		}
	});

	function dismiss() {
		show = false;
		localStorage.setItem(STORAGE_KEY, 'true');
	}
</script>

{#if show}
	<div class="banner" role="region" aria-label="Announcement">
		<div class="wrap">
			<p>
				<strong>Used LangX before?</strong> Your username and tokens are waiting — here is everything
				that changes in v2.
			</p>
			<div class="actions">
				<a href="/welcome-back" on:click={dismiss}>Read what changed</a>
				<button type="button" on:click={dismiss} aria-label="Dismiss">Close</button>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	// The app's blue callout ("Turn on notifications"), pinned to the bottom.
	// Enters from below on the sheet curve and never comes back once closed.
	.banner {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 40;
		padding: 0 16px 16px;
		pointer-events: none;

		@media (prefers-reduced-motion: no-preference) {
			animation: rise var(--dur-sheet) var(--ease-drawer) both;
		}
	}

	@keyframes rise {
		from {
			transform: translateY(110%);
		}
		to {
			transform: none;
		}
	}

	.wrap {
		pointer-events: auto;
		max-width: 760px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 16px;
		background: var(--color--accent-tint);
		border-radius: var(--radius-lg);
		padding: 15px 18px;
		box-shadow: var(--shadow-card);

		@include for-phone-only {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	p {
		flex: 1;
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--color--text-shade);

		strong {
			color: var(--color--accent);
			font-weight: 700;
		}
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 16px;
		flex: 0 0 auto;
	}

	a {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color--accent);
	}

	button {
		background: none;
		border: 0;
		padding: 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color--text-shade);
		cursor: pointer;

		&:hover {
			color: var(--color--text);
		}
	}
</style>
