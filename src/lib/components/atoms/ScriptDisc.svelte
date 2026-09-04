<script lang="ts">
	/**
	 * A language's own first character in a disc — 中 for Chinese, ا for Arabic,
	 * Я for Russian.
	 *
	 * Deliberately not a flag. A language is not a country: Arabic would have to
	 * pick one of twenty-two, Spanish one of twenty, and English either Britain
	 * or the United States. The practical objection settles it as well — Windows
	 * ships no flag glyphs at all, so flag emoji render there as bare letter
	 * pairs, which is exactly the audience a language site cannot afford to show
	 * broken type to.
	 *
	 * Shaped like the app's avatar: a pill disc, Nunito 800, muted fill.
	 */
	export let nativeName: string;
	export let size = 40;

	/** Skip anything that is not a letter, so "'Ολα" discs on Ο, not the mark. */
	$: glyph = ([...nativeName].find((c) => /\p{L}/u.test(c)) ?? nativeName[0] ?? '?').toUpperCase();
</script>

<span class="disc" style="--size:{size}px" aria-hidden="true">{glyph}</span>

<style lang="scss">
	.disc {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		width: var(--size);
		height: var(--size);
		border-radius: var(--radius-pill);
		background: var(--color--muted);
		color: var(--color--text);
		font-family: var(--font--title);
		font-weight: 800;
		// The app's avatar sets its glyph at 34% of the disc.
		font-size: calc(var(--size) * 0.4);
		line-height: 1;
		// A Devanagari or Thai glyph is taller than a Latin capital; letting it
		// hang out of the disc is worse than a hair of clipping.
		overflow: hidden;
	}
</style>
