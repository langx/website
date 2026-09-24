<script lang="ts">
	import SiteShell from '$lib/components/organisms/SiteShell.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<SiteShell
	title="Tokens"
	path="/tokens"
	description="LangX tokens are in-app points you earn by practising and teaching and spend on a streak freeze or cosmetics. Not money: no buying, selling or blockchain."
>
	{@render children?.()}
</SiteShell>
