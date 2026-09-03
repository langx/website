<script lang="ts">
	import Tag from '$lib/components/atoms/Tag.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';

	/** A row in a list of posts — the app's own list grammar, not a card. */
	export let title: string;
	export let coverImage: string | undefined = undefined;
	export let excerpt: string;
	export let slug: string;
	export let tags: string[] | undefined;
	export let readingTime: string | undefined = undefined;
	export let showImage = true;
</script>

<a class="post" href="/{slug}" data-sveltekit-preload-data>
	{#if showImage && coverImage}
		<span class="thumb">
			<img src={coverImage} alt="" loading="lazy" decoding="async" />
		</span>
	{/if}
	<span class="body">
		<span class="title">{title}</span>
		{#if excerpt}<span class="excerpt">{excerpt}</span>{/if}
		<span class="meta">
			{#if readingTime}<span>{readingTime}</span>{/if}
			{#if tags?.length}
				{#each tags.slice(0, 2) as tag}<Tag>{tag}</Tag>{/each}
			{/if}
		</span>
	</span>
	<span class="chevron"><UiIcon name="chevron-right" size={20} /></span>
</a>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.post {
		display: flex;
		align-items: flex-start;
		gap: 18px;
		padding: 22px 0;
		color: var(--color--text);
		text-decoration: none;
		border-radius: var(--radius-sm);

		&:hover {
			color: var(--color--text);

			.title {
				color: var(--color--accent);
			}

			.chevron {
				transform: translateX(3px);
				color: var(--color--accent);
			}
		}
	}

	.thumb {
		flex: 0 0 auto;
		width: 88px;
		height: 88px;
		border-radius: 14px;
		overflow: hidden;
		background: var(--color--muted);

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		@include for-phone-only {
			width: 64px;
			height: 64px;
		}
	}

	.body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.title {
		font-family: var(--font--title);
		font-size: 1.125rem;
		font-weight: 800;
		line-height: 1.3;
		text-wrap: balance;
		transition: color var(--dur-fast) ease;
	}

	.excerpt {
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--color--text-shade);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 4px;
		font-size: 0.8125rem;
		color: var(--color--text-quiet);
	}

	.chevron {
		flex: 0 0 auto;
		color: var(--color--text-quiet);
		margin-top: 2px;
		transition: transform var(--dur-fast) var(--ease-out), color var(--dur-fast) ease;
	}
</style>
