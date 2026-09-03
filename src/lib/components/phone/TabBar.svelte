<script lang="ts">
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';

	export let active: 'discover' | 'chats' | 'feed' | 'me' = 'discover';
	export let unread = 0;

	const tabs = [
		{ id: 'discover', label: 'Discover', icon: 'search' },
		{ id: 'chats', label: 'Chats', icon: 'chat' },
		{ id: 'feed', label: 'Feed', icon: 'feed' },
		{ id: 'me', label: 'Me', icon: 'person' }
	] as const;
</script>

<nav class="tabbar" aria-label="App tabs">
	{#each tabs as tab}
		<span
			class="tab"
			class:on={tab.id === active}
			aria-current={tab.id === active ? 'page' : undefined}
		>
			<UiIcon name={tab.icon} size={22} />
			<span class="label">{tab.label}</span>
			{#if tab.id === 'chats' && unread > 0}
				<span class="badge">{unread}</span>
			{/if}
		</span>
	{/each}
</nav>

<style lang="scss">
	.tabbar {
		display: flex;
		background: var(--color--surface);
		border-top: 1px solid var(--color--border);
		padding: 10px 6px 16px;
		flex: 0 0 auto;
		margin-top: auto;
	}

	.tab {
		position: relative;
		flex: 1;
		min-height: 52px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		color: var(--color--text-tertiary);

		&.on {
			color: var(--color--accent);
		}
	}

	.label {
		font-size: 11px;
		font-weight: 600;
	}

	.badge {
		position: absolute;
		top: 4px;
		right: 28px;
		min-width: 18px;
		height: 18px;
		background: var(--color--error);
		color: #fefefe;
		font-size: 11px;
		font-weight: 700;
		border-radius: var(--radius-pill);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 5px;
	}
</style>
