<script lang="ts">
	// The one `{@html}` below writes JSON this component serialised itself.
	/* eslint-disable svelte/no-at-html-tags */
	/**
	 * Structured data for search engines, as one `application/ld+json` block.
	 *
	 * Written through `{@html}` because Svelte will not render a script tag from
	 * markup. The angle bracket is an escape and never appears literally in this
	 * file: Svelte's parser scans the raw source, comments included, and treats a
	 * script tag written out in full as a real tag. Any `<` inside the data is
	 * escaped too, so a string in it can never close the block early.
	 */
	export let data: Record<string, unknown>;

	const LT = '\u003c';
	$: html = `${LT}script type="application/ld+json">${JSON.stringify(data)
		.split(LT)
		.join('\\u003c')}${LT}/script>`;
</script>

<svelte:head>
	{@html html}
</svelte:head>
