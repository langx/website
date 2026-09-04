<script lang="ts">
	import { LANGUAGE_FLAGS } from '$lib/data/language-flags';

	/**
	 * A language's flag in a disc, falling back to its own first character —
	 * 中 for Chinese, ا for Arabic — where no single country is the answer.
	 *
	 * The disc is what makes the fallback work in both directions. Windows ships
	 * no flag glyphs at all, so a flag emoji renders there as the two regional
	 * indicator letters; inside a circle "TR" reads as a country code rather
	 * than as broken type, which is why the flag is never set loose on the page.
	 */
	export let nativeName: string;
	export let code: string | undefined = undefined;
	export let size = 40;

	$: flag = code ? LANGUAGE_FLAGS[code] : undefined;
	/** Skip anything that is not a letter, so "Ολα" discs on Ο, not the mark. */
	$: glyph = ([...nativeName].find((c) => /\p{L}/u.test(c)) ?? nativeName[0] ?? '?').toUpperCase();
</script>

<span class="disc" class:flag={!!flag} style="--size:{size}px" aria-hidden="true">
	{flag ?? glyph}
</span>

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
		font-size: calc(var(--size) * 0.4);
		line-height: 1;
		// A Devanagari or Thai glyph is taller than a Latin capital; letting it
		// hang out of the disc is worse than a hair of clipping.
		overflow: hidden;
	}

	// Sized so the flag fills the disc, and so the "TR" that Windows renders
	// instead still fits inside it.
	.flag {
		font-family: var(--font--default);
		font-size: calc(var(--size) * 0.52);
		font-weight: 600;
		letter-spacing: -0.04em;
	}
</style>
