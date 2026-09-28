<script lang="ts">
	import SiteShell from '$lib/components/organisms/SiteShell.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<SiteShell
	title="Plans and pricing: Free and Pro"
	path="/plans"
	description="What Pro adds, what stays free, and why corrections are unlimited on every plan."
>
	{@render children?.()}
</SiteShell>
