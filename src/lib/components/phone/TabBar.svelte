<script lang="ts">
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';

	export let active: 'discover' | 'chats' | 'feed' | 'me' = 'discover';
	export let unread = 0;

	// The app's four tabs, in the app's order. `chat` is the message glyph and
	// `person` the user one; the unread count rides the icon, not the tab.
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
			<span class="glyph">
				<UiIcon name={tab.icon} size={22} />
				{#if tab.id === 'chats' && unread > 0}
					<span class="badge">{unread}</span>
				{/if}
			</span>
			<span class="label">{tab.label}</span>
		</span>
	{/each}
</nav>

<style lang="scss">
	.tabbar {
		display: flex;
		background: var(--color--surface);
		border-top: 1px solid var(--color--border);
		padding: 10px 8px 24px;
		flex: 0 0 auto;
		margin-top: auto;
	}

	.tab {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		color: var(--color--text-tertiary);

		&.on {
			color: var(--color--accent);
		}
	}

	.glyph {
		position: relative;
		display: flex;
	}

	.label {
		font-size: 11px;
		font-weight: 600;
	}

	.badge {
		position: absolute;
		top: -4px;
		right: -10px;
		min-width: 18px;
		height: 18px;
		background: var(--color--error);
		color: #fff;
		font-size: 11px;
		font-weight: 700;
		line-height: 18px;
		border-radius: var(--radius-pill);
		text-align: center;
		padding: 0 5px;
	}
</style>
