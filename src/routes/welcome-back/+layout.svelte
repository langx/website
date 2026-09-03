<script lang="ts">
	import SiteShell from '$lib/components/organisms/SiteShell.svelte';
</script>

<SiteShell
	title="Welcome back"
	path="/welcome-back"
	description="Used LangX v1? Your username is reserved and your tokens carry over. Here is everything that changes in v2, including the parts we would rather you heard from us."
>
	<slot />
</SiteShell>
