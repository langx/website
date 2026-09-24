<script lang="ts">
	import SiteShell from '$lib/components/organisms/SiteShell.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<SiteShell
	title="Cookie Policy"
	path="/cookie-policy"
	description="Which cookies LangX uses, and how to control them."
>
	{@render children?.()}
</SiteShell>
