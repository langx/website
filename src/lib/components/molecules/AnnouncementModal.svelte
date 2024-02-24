<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let show = false;

	onMount(() => {
		show = true;
	});
</script>

{#if show}
	<div class="modal" transition:slide={{ duration: 800 }}>
		<div class="modal-content">
			<button class="close-button" on:click={() => (show = false)}>X</button>
			<div class="content">
				<h4>⬆️ Breaking News!</h4>
				<p>
					We are now live on <a href="https://pitchwall.co/product/languagexchange" target="_blank"
						>PitchWall</a
					>! Upvote us there.
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
		/* text-decoration-color: var(--color--text);  */
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
