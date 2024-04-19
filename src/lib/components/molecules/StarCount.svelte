<script>
	import Github from '$lib/icons/socials/github-stars.svelte';
	import { onMount } from 'svelte';

	let starCount = -1;

	onMount(async () => {
		starCount = (
			await (await fetch('https://api.github.com/repos/langx/langx?page=$i&per_page=100')).json()
		).stargazers_count;
	});
</script>

<div class:mtop={starCount > 0} class="star-count">
	<a class="star" target="_blank" href="https://github.com/langx/langx/stargazers">
		<Github />
		{#if starCount > 0}
			<span>{starCount.toLocaleString('en-US')}</span>
		{/if}
	</a>
</div>

<style lang="scss">
	.star-count {
		.mtop {
			margin-top: 10px;
		}
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
