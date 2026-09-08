<script lang="ts">
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import Tokens from '$lib/components/organisms/Tokens.svelte';
</script>

<div class="container">
	<PageHeader
		eyebrow="Tokens"
		title="A point you earn by helping somebody"
		lede="Tokens are in-app points, earned by practising and teaching and spent on a streak freeze, a missed day or something cosmetic. They cannot be bought, sold, traded or withdrawn, and there is no chain behind them. Here is every rule, including the ceilings."
	/>
	<Tokens />
</div>
