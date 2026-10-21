<script lang="ts">
	import PostThumb from '$lib/components/blog/PostThumb.svelte';
	import { hueForTags } from '$lib/data/hues';

	interface Props {
		title: string;
		coverImage?: string | undefined;
		/** The cover's WebP copies; the card takes the full one. */
		coverWebp?: { full: string; square: string } | undefined;
		/** A square made for lists; a post with one has a drawn cover, not a photo. */
		thumbnail?: string | undefined;
		excerpt: string;
		slug: string;
		tags: string[] | undefined;
		readingTime?: string | undefined;
		/** false draws a compact row with no cover, for lists under a post. */
		showImage?: boolean;
		/** The apps the post is about, for a comparison's icons (see PostThumb). */
		apps?: string[] | undefined;
	}

	let {
		title,
		coverImage = undefined,
		coverWebp = undefined,
		thumbnail = undefined,
		excerpt,
		slug,
		tags,
		readingTime = undefined,
		showImage = true,
		apps = undefined
	}: Props = $props();

	/**
	 * A photograph the post was written with is shown as it is. Every other
	 * post gets a colour block in its tag's hue with a drawing of what it is
	 * about (PostThumb).
	 */
	let photo = $derived(coverImage && !thumbnail ? coverImage : undefined);
	let hue = $derived(hueForTags(tags));
</script>

<a class="post" class:row={!showImage} href="/{slug}" data-sveltekit-preload-data>
	{#if showImage}
		<span class="cover" data-hue={photo ? undefined : hue}>
			{#if photo}
				<picture>
					{#if coverWebp}<source srcset={coverWebp.full} type="image/webp" />{/if}
					<img src={photo} alt="" loading="lazy" decoding="async" />
				</picture>
			{:else}
				<span class="art"><PostThumb {title} {slug} {tags} {apps} /></span>
			{/if}
		</span>
	{/if}
	<span class="meta">
		{#if tags?.length}<span>{tags[0]}</span>{/if}
		{#if tags?.length && readingTime}<span aria-hidden="true">·</span>{/if}
		{#if readingTime}<span>{readingTime}</span>{/if}
	</span>
	<span class="title">{title}</span>
	{#if !showImage && excerpt}<span class="excerpt">{excerpt}</span>{/if}
</a>

<style lang="scss">
	.post {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 8px;
		color: var(--color--text);
		text-decoration: none;

		&:hover {
			color: var(--color--text);

			.title {
				text-decoration: underline;
				text-decoration-thickness: 2px;
			}
		}
	}

	.row {
		padding: 18px 0;
	}

	.cover {
		display: grid;
		place-items: center;
		aspect-ratio: 16 / 10;
		margin-bottom: 6px;
		border-radius: 24px;
		overflow: hidden;

		&:not([data-hue]) {
			background: var(--color--muted);
		}

		picture,
		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.art {
		--thumb-bg: transparent;
		width: 46%;
		aspect-ratio: 1;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--color--text-shade);
	}

	.title {
		font-family: var(--font--title);
		font-size: 1.125rem;
		font-weight: 900;
		line-height: 1.3;
		text-wrap: balance;
	}

	.excerpt {
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--color--text-shade);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
