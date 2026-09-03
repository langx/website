<script lang="ts">
	/**
	 * A profile picture on a disc. With `src` it is a photo; without one it
	 * falls back to initials on a solid fill, the way the app does when
	 * somebody has not added a picture yet.
	 */
	export let initials: string;
	export let src: string | undefined = undefined;
	export let size = 40;
	export let tone: 'accent' | 'success' | 'ink' | 'pro' = 'accent';
	export let online = false;
	export let name: string | undefined = undefined;

	$: fontSize = Math.round(size * 0.34);
	$: dot = Math.max(10, Math.round(size * 0.21));
</script>

<span
	class="avatar {tone}"
	style="--size:{size}px;--fs:{fontSize}px;--dot:{dot}px"
	role={name ? 'img' : undefined}
	aria-label={name}
	aria-hidden={name ? undefined : 'true'}
>
	{#if src}
		<img
			class="disc photo"
			{src}
			alt=""
			loading="lazy"
			decoding="async"
			width={size}
			height={size}
		/>
	{:else}
		<span class="disc">{initials}</span>
	{/if}
	{#if online}<span class="online" />{/if}
</span>

<style lang="scss">
	.avatar {
		position: relative;
		display: inline-block;
		width: var(--size);
		height: var(--size);
		flex: 0 0 auto;
	}

	.disc {
		width: 100%;
		height: 100%;
		border-radius: var(--radius-pill);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: var(--fs);
		letter-spacing: 0.01em;
		color: #fefefe;
		user-select: none;
	}

	.photo {
		object-fit: cover;
		background: var(--color--muted);
	}

	.accent .disc {
		background: var(--color--accent);
	}
	.success .disc {
		background: var(--color--success);
	}
	.pro .disc {
		background: var(--color--pro);
	}
	.ink .disc {
		background: var(--color--text);
		color: var(--color--text-inverse);
	}

	.online {
		position: absolute;
		right: 1px;
		bottom: 1px;
		width: var(--dot);
		height: var(--dot);
		background: var(--color--success);
		border: 2px solid var(--color--surface);
		border-radius: var(--radius-pill);
	}
</style>
