<script lang="ts">
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import PlanUsageCard from '$lib/components/organisms/PlanUsageCard.svelte';
	import Pricing from '$lib/components/organisms/Pricing.svelte';
</script>

<div class="container">
	<div class="intro">
		<PageHeader
			eyebrow="Plans"
			title="Free is a real plan. Fluent lifts its limits. Polyglot adds what only it has."
			lede="Replying and correcting are unlimited on every plan. Prices are shown in the app."
		/>
		<div class="card">
			<PlanUsageCard />
		</div>
	</div>
	<Pricing />
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	// The title on the left, and on the right what a paid day looks like.
	.intro {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 24px 56px;
		padding-bottom: var(--space-xl);

		:global(.page-header) {
			flex: 1 1 340px;
			padding-bottom: 0;
		}
	}

	.card {
		flex: 1 1 300px;
		max-width: 400px;

		@include for-phone-only {
			max-width: none;
		}
	}
</style>
