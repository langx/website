<script>
	import Github from '$lib/icons/socials/github-stars.svelte';
	import { onMount } from 'svelte';

	// v2 lives in a different repository; `langx/langx` is the v1 app.
	const repo = 'langx/langx2';

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

<div class:mtop={starCount > 0} class="star-count">
	<a class="star" target="_blank" href="https://github.com/{repo}/stargazers">
		<Github />
		{#if starCount > 0}
			<span>{starCount.toLocaleString('en-US')}</span>
		{/if}
	</a>
</div>

<style lang="scss">
	.star-count {
		// .mtop {
		// 	margin-top: 10px;
		// }
		display: flex;
		align-items: center;

		.star {
			height: 24px;
			text-decoration: none;
			display: flex;
			align-items: center;
			color: #ffffff;
			background-color: #000000;
			padding: 1px 4px 0 3px;
			border-radius: 3px;

			span {
				margin-left: 5px;
			}
		}
	}
</style>
