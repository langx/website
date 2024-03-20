<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import SparklingHighlight from './SparklingHighlight.svelte';

	let show = false;

	onMount(() => {
		setTimeout(() => {
			show = true;
		}, 3000); // Delay
	});
</script>

{#if show}
	<div class="modal" transition:slide={{ duration: 500 }}>
		<div class="modal-content">
			<button class="close-button" on:click={() => (show = false)}>X</button>
			<div class="content">
				<h4>🚀 Excited to announce the launch of our innovative 'Learn to Earn' Token Project</h4>
				<p>
					🥇 Get ready to revolutionize language learning and earn reward <SparklingHighlight
						><a href="http://langx.io" target="_blank">langX</a></SparklingHighlight
					> tokens while you improve your skills!
				</p>
			</div>
		</div>
	</div>
{/if}

<style>
	@import '$lib/scss/_themes.scss';
	.modal {
		position: relative;
		z-index: 9999;
		width: 100%;
		background-color: var(--color--secondary);
	}

	.modal-content {
		position: relative;
		margin: 0 auto;
		padding: 20px;
		width: 90%;
	}

	a {
		text-decoration-color: var(--color--text);
	}

	.content {
		padding-right: 50px;
	}

	.close-button {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		border: none;
		background: none;
		font-size: 1.5em;
		cursor: pointer;
		color: var(--color--text);
	}
</style>
