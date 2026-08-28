<script lang="ts">
	export let title: string;
	export let lede: string | undefined = undefined;
</script>

<!--
	Fills the wave band at the top of a page. Every page needs something here:
	`Waves` is absolutely positioned over the first ~65vh, so content that starts
	at the top of `main` lands on yellow — where themed text is white and
	disappears. Interior pages used to solve this by repeating the whole `Hero`,
	app-store buttons and all.
-->
<header class="page-header">
	<h1>{title}</h1>
	{#if lede}<p>{lede}</p>{/if}
</header>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.page-header {
		// `Waves` is absolutely positioned and paints over anything in the normal
		// flow, so every section that overlaps the band needs its own stacking
		// context. This is why `#hero` carries `position: relative` — without it
		// the text is behind the wave rather than on it.
		position: relative;
		z-index: 1;

		// Sized to clear the wave graphic, so the section after it starts on the
		// page background rather than straddling the crest.
		min-height: min(52vh, 430px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: var(--space-sm);
		padding: var(--space-2xl) 0 var(--space-3xl);

		// The band behind this is yellow in both themes.
		color: #000;

		@include for-phone-only {
			min-height: unset;
			padding: var(--space-xl) 0 var(--space-2xl);
		}

		h1 {
			max-width: 20ch;
		}

		p {
			font-size: 1.15rem;
			max-width: 54ch;
			color: rgba(0, 0, 0, 0.72);
		}
	}
</style>
