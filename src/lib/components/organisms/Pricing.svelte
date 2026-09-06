<script lang="ts">
	import PlanCards from '$lib/components/organisms/PlanCards.svelte';
	import AppStores from '$lib/components/molecules/AppStores.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
</script>

<!-- The homepage's three cards with their notes shown, and the one yellow button. -->
<PlanCards detailed />

<div class="cta" use:ownsPrimary>
	<AppStores primary size="lg" />
</div>

<style lang="scss">
	.cta {
		padding: var(--space-lg) 0 var(--space-2xl);
	}
</style>
