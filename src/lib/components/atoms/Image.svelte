<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		/** A WebP copy of `src`, offered first; `src` stays for anything that cannot read it. */
		webp?: string | undefined;
		fullBleed?: boolean | undefined;
	}

	let { src, alt, webp = undefined, fullBleed = undefined }: Props = $props();
</script>

<!--
	The picture only when there is a WebP to offer. Inside a post the image is
	placed by the article's grid (`> .full-bleed`), which a wrapper would hide
	it from.
-->
{#if webp}
	<picture>
		<source srcset={webp} type="image/webp" />
		<img {src} {alt} loading="lazy" decoding="async" class:full-bleed={fullBleed} />
	</picture>
{:else}
	<img {src} {alt} loading="lazy" decoding="async" class:full-bleed={fullBleed} />
{/if}

<style lang="scss">
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
