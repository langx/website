<script lang="ts">
	import SiteShell from '$lib/components/organisms/SiteShell.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<SiteShell
	title="Data Deletion"
	path="/data-deletion"
	description="How to delete your LangX account and the data it holds."
>
	{@render children?.()}
</SiteShell>
