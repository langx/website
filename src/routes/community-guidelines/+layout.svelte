<script lang="ts">
	import SiteShell from '$lib/components/organisms/SiteShell.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<SiteShell
	title="Community Guidelines"
	path="/community-guidelines"
	description="The rules for using LangX, and what happens when somebody breaks them."
>
	{@render children?.()}
</SiteShell>
