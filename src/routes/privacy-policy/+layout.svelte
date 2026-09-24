<script lang="ts">
	import SiteShell from '$lib/components/organisms/SiteShell.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<SiteShell
	title="Privacy Policy"
	path="/privacy-policy"
	description="How LangX collects, uses and protects your data."
>
	{@render children?.()}
</SiteShell>
