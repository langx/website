<script lang="ts">
	import SiteShell from '$lib/components/organisms/SiteShell.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<SiteShell
	title="LangX plans"
	path="/plans"
	description="What Fluent and Polyglot add, what stays free, and why corrections are unlimited on every plan."
>
	{@render children?.()}
</SiteShell>
