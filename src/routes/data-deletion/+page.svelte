<script lang="ts">
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import DataDeletion from '$lib/components/organisms/DataDeletion.svelte';
</script>

<div class="container">
	<PageHeader
		eyebrow="Legal"
		title="Data Deletion"
		lede="How to delete your account and the data it holds."
	/>
	<DataDeletion />
</div>
