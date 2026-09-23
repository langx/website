<script lang="ts">
	/**
	 * A word's pronunciation in the International Phonetic Alphabet, brackets
	 * and all, as `scripts/wordlists/build-ipa.ts` writes it: /ˈkasa/ is
	 * phonemic, [ˈka.sa] phonetic. Renders nothing for a word without one.
	 */
	export let ipa: string | null | undefined;
	/** On its own line under the word, rather than beside it. */
	export let block = false;
	/** Beside a word set as a heading, where the usual size would read as a footnote. */
	export let large = false;
</script>

{#if ipa}
	<span class="ipa" class:block class:large lang="und-fonipa" translate="no">{ipa}</span>
{/if}

<style>
	.ipa {
		font-family: var(--font--default);
		font-size: 0.875rem;
		font-weight: 400;
		color: var(--color--text-quiet);
		/* Stress marks and tie bars are small; a touch of room keeps them legible. */
		letter-spacing: 0.01em;
		white-space: nowrap;
	}

	.large {
		font-size: 1.125rem;
	}

	.block {
		display: block;
		margin-top: 2px;
		white-space: normal;
	}
</style>
