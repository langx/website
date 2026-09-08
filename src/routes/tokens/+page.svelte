<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import Tokens from '$lib/components/organisms/Tokens.svelte';
</script>

<div class="container">
	<PageHeader
		eyebrow="Tokens"
		title="A point you earn by helping somebody"
		lede="Tokens are in-app points, earned by practising and teaching and spent on a streak freeze, a missed day or something cosmetic. They cannot be bought, sold, traded or withdrawn, and there is no chain behind them. Here is every rule, including the ceilings."
	/>

	<!--
		The write-up is offered before the rules, not after them: somebody who
		came here for the model should not have to read a page of ceilings first.
	-->
	<div class="promo">
		<p>
			The model itself — where it came from, what it is for, and the thinking behind it — is written
			up in full on its own site.
		</p>
		<Button href="https://token.langx.io" variant="secondary" size="lg">
			Open token.langx.io
			<UiIcon slot="icon" name="external" size={18} />
		</Button>
	</div>

	<Tokens />
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.promo {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--space-sm) var(--space-lg);
		padding: 0 0 var(--space-lg);

		p {
			margin: 0;
			max-width: 52ch;
			font-size: 1rem;
			line-height: 1.6;
			color: var(--color--text-shade);
		}

		@include for-phone-only {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
