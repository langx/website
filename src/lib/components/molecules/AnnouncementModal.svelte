<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import SparklingHighlight from './SparklingHighlight.svelte';

	let show = false;

	onMount(() => {
		setTimeout(() => {
			show = true;
		}, 3000); // Delay of 3 second
	});
</script>

{#if show}
	<div class="modal" transition:slide={{ duration: 500 }}>
		<div class="modal-content">
			<button class="close-button" on:click={() => (show = false)}>X</button>
			<div class="content">
				<h4>⬆️ Breaking News!</h4>
				<p>
					We are now live on <SparklingHighlight
						><a href="https://pitchwall.co/product/languagexchange" target="_blank">PitchWall</a>
					</SparklingHighlight>! Upvote us there.
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
