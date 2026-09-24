<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		fullBleed?: boolean | undefined;
	}

	let { src, alt, fullBleed = undefined }: Props = $props();
</script>

<img {src} {alt} loading="lazy" decoding="async" class:full-bleed={fullBleed} />

<style lang="scss">
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
