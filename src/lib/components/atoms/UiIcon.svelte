<script lang="ts" context="module">
	// One stroke, one weight, round caps — the app's own icon grammar.
	const PATHS: Record<string, string> = {
		search: 'M18 18a7 7 0 1 0-14 0 7 7 0 0 0 14 0Zm2 2-4.5-4.5',
		chat: 'M4 5h16v11H9l-5 4z',
		feed: 'M4 6h16M4 12h16M4 18h11',
		person: 'M4 20v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
		back: 'M19 12H6M11 6l-6 6 6 6',
		check: 'M4 12.5l5 5L20 6.5',
		send: 'M21 3 10 14M21 3l-7 18-4-7-7-4z',
		plus: 'M12 5v14M5 12h14',
		filter: 'M4 7h16M7 12h10M10 17h4',
		more: 'M12 5.5v.01M12 12v.01M12 18.5v.01',
		gear: 'M15.2 12a3.2 3.2 0 1 1-6.4 0 3.2 3.2 0 0 1 6.4 0ZM12 3.5V6M12 18v2.5M4 12h2.5M17.5 12H20M6.2 6.2 8 8M16 16l1.8 1.8M17.8 6.2 16 8M8 16l-1.8 1.8',
		sparkle: 'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z',
		star: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6l-5.4 2.9 1.2-6L3.3 9.3l6.1-.7z',
		close: 'M6 6l12 12M18 6 6 18',
		'chevron-down': 'M6 9l6 6 6-6',
		'chevron-right': 'M9 6l6 6-6 6',
		'arrow-right': 'M5 12h14M13 6l6 6-6 6',
		menu: 'M4 7h16M4 12h16M4 17h16',
		external: 'M14 5h5v5M19 5l-8 8M10 6H6a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4',
		globe:
			'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
		mic: 'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3ZM19 11a7 7 0 0 1-14 0M12 18v3',
		flame:
			'M12 3c1.5 3 4.5 5.5 4.5 9.5a4.5 4.5 0 0 1-9 0c0-1.5.6-2.6 1.3-3.5.3 1.2 1 2 2.2 2.3C11.5 8.5 10.5 6 12 3Z',
		lock: 'M6 11h12v9H6zM9 11V7a3 3 0 0 1 6 0v4',
		heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
		swap: 'M4 9h13l-3-3M20 15H7l3 3',
		code: 'M8 8 4 12l4 4M16 8l4 4-4 4M14 5l-4 14',
		image: 'M5 5h14v14H5zM5 15l4-4 4 4 2-2 4 4M15 9h.01',
		bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4',
		eye: 'M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
		pin: 'M12 21s-6-5.3-6-10.5a6 6 0 0 1 12 0C18 15.7 12 21 12 21ZM14 10.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
		award: 'M17 8.5a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM9 12.5 8 21l4-2 4 2-1-8.5',
		gift: 'M4 11h16v9H4zM4 7h16v4H4zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0'
	};
</script>

<script lang="ts">
	export let name: keyof typeof PATHS | string;
	export let size = 22;
	export let strokeWidth = 2.5;
	export let label: string | undefined = undefined;
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden={label ? undefined : 'true'}
	role={label ? 'img' : undefined}
	aria-label={label}
	focusable="false"
	class="ui-icon"
>
	<path d={PATHS[name] ?? ''} />
</svg>

<style>
	.ui-icon {
		display: inline-block;
		flex: 0 0 auto;
		vertical-align: middle;
	}
</style>
