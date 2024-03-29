<script>
	import Github from '$lib/icons/socials/github.svelte';
	import { onMount } from 'svelte';

	let starCount = -1;

	onMount(async () => {
		starCount = (
			await (
				await fetch(
					'https://api.github.com/repos/langxapp/langx?page=$i&per_page=100'
				)
			).json()
		).stargazers_count;
	});
</script>

<div class:mtop={starCount > 0} class="star-count">
	<a
		class="star"
		target="_blank"
		href="https://github.com/langxapp/langx/stargazers"
	>
		<Github />
	</a>
	{#if starCount > 0}
		<small>{starCount}</small>
	{/if}
</div>

<style lang="scss">
	.star-count {
		.mtop {
			margin-top: 10px;
		}
		display: flex;
		flex-direction: column;
		align-items: center;
		small {
			color: var(--color--text);
		}

		.star {
			color: var(--color--text);
			height: 24px;
		}
	}
</style>
