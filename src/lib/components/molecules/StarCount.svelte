<script lang="ts">
	import { onMount } from 'svelte';
	import GithubIcon from '$lib/icons/socials/github.svelte';

	// The v2 product lives in `langx/langx`.
	const repo = 'langx/langx';

	let starCount = -1;

	onMount(async () => {
		try {
			const response = await fetch(`https://api.github.com/repos/${repo}`);
			if (!response.ok) return;
			const { stargazers_count } = await response.json();
			starCount = stargazers_count ?? -1;
		} catch {
			// GitHub rate-limits unauthenticated calls per IP. The count is
			// decoration; the link still works without it.
		}
	});
</script>

<a
	class="star"
	target="_blank"
	rel="noopener noreferrer"
	href="https://github.com/{repo}"
	aria-label="LangX on GitHub{starCount > 0 ? `, ${starCount} stars` : ''}"
>
	<span class="icon"><GithubIcon /></span>
	<span class="text">GitHub</span>
	{#if starCount > 0}
		<span class="count tabular">{starCount.toLocaleString('en-US')}</span>
	{/if}
</a>

<style lang="scss">
	.star {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		min-height: 36px;
		padding: 0 12px 0 10px;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-pill);
		color: var(--color--text);
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition: background-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);

		&:active {
			transform: scale(0.97);
		}

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				background: var(--color--muted);
				color: var(--color--text);
			}
		}
	}

	.icon {
		width: 18px;
		height: 18px;
		display: inline-flex;
		fill: currentColor;

		:global(svg) {
			width: 100%;
			height: 100%;
		}
	}

	.count {
		color: var(--color--text-shade);
		font-weight: 600;
	}
</style>
