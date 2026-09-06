<script lang="ts">
	import NotFound from '$lib/components/organisms/NotFound.svelte';
	import Seo from '$lib/components/atoms/Seo.svelte';
</script>

<Seo title="Page not found" path="/404" />

<div class="container">
	<NotFound status={404} />
</div>
