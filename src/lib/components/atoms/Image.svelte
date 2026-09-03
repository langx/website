<script lang="ts">
	export let src: string;
	export let alt: string;
	export let fullBleed: boolean | undefined = undefined;
</script>

<img {src} {alt} loading="lazy" decoding="async" class:full-bleed={fullBleed} />

<style lang="scss">
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
