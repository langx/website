<script lang="ts">
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import WelcomeBack from '$lib/components/organisms/WelcomeBack.svelte';
</script>

<div class="container">
	<PageHeader
		title="Welcome back"
		lede="LangX v2 is a rebuild, not an update on top of the old app. Here is everything that changes for you, including the parts we would rather you heard from us than discovered."
	/>
	<WelcomeBack />
</div>
