<script lang="ts">
	import SiteShell from '$lib/components/organisms/SiteShell.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<SiteShell
	title="Terms & Conditions"
	path="/terms-conditions"
	description="The terms you agree to when you use LangX."
>
	{@render children?.()}
</SiteShell>
