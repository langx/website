<script lang="ts">
	import Alert from '$lib/icons/alert.svelte';
	import Check from '$lib/icons/check.svelte';
	import Info from '$lib/icons/info.svelte';

	export let type: string | undefined = undefined;
</script>

<!-- A tinted block with its icon inline — the app's correction card, not a side-tab. -->
<div class="callout-block {type ?? ''}">
	{#if type}
		<div class="icon-wrapper" aria-hidden="true">
			{#if type == 'info'}
				<Info />
			{:else if type == 'warning' || type == 'error'}
				<Alert />
			{:else if type == 'success'}
				<Check />
			{/if}
		</div>
	{/if}
	<div class="body"><slot /></div>
</div>

<style lang="scss">
	.callout-block {
		--bg-color: var(--color--callout-background);
		--accent-color: var(--color--text-shade);

		display: flex;
		gap: 14px;
		align-items: flex-start;
		margin: 32px 0;
		padding: 18px 20px;
		border-radius: var(--radius-lg);
		background: var(--bg-color);
		color: var(--color--text);

		.icon-wrapper {
			flex: 0 0 auto;
			width: 22px;
			height: 22px;
			margin-top: 2px;
			fill: var(--accent-color);
			color: var(--accent-color);
		}

		.body {
			flex: 1;
			min-width: 0;

			:global(p:first-child) {
				margin-top: 0;
			}

			:global(p:last-child) {
				margin-bottom: 0;
			}
		}

		&.info {
			--bg-color: var(--color--callout-background--info);
			--accent-color: var(--color--callout-accent--info);
		}
		&.warning {
			--bg-color: var(--color--callout-background--warning);
			--accent-color: var(--color--callout-accent--warning);
		}
		&.error {
			--bg-color: var(--color--callout-background--error);
			--accent-color: var(--color--callout-accent--error);
		}
		&.success {
			--bg-color: var(--color--callout-background--success);
			--accent-color: var(--color--callout-accent--success);
		}
	}
</style>
