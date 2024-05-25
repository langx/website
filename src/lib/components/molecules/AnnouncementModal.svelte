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
		<div class="wrapper">
			<p>
				Get ready to revolutionize language learning and earn reward <SparklingHighlight
					><a href="http://token.langx.io" target="_blank">LangX Token</a></SparklingHighlight
				> while you improve your skills!
			</p>
			<div class="btn-wrapper">
				<a href="http://token.langx.io" target="_blank" class="open">Visit</a>
				<button type="button" class="close" on:click={() => (show = false)}>Close</button>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	@import '$lib/scss/_themes.scss';

	.modal {
		position: fixed;
		left: 0px;
		right: 0px;
		bottom: 0px;
		background-color: var(--color--secondary);
		z-index: 9999;

		.wrapper {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			column-gap: 2rem; /* 32px */
			row-gap: 1rem; /* 16px */
			padding: 1.5rem; /* 24px */
			max-width: 1400px;
			margin: auto;

			@media (min-width: 768px) {
				flex-direction: row;
				align-items: center;
			}

			@media (min-width: 1024px) {
				padding-left: 2rem; /* 32px */
				padding-right: 2rem; /* 32px */
			}

			p {
				max-width: 56rem; /* 896px */
				font-size: 1rem; /* 16px */
				line-height: 1.5rem; /* 24px */
				color: #ffffff;
				font-weight: bold;

				a {
					color: var(--color--yellow);
				}
			}

			.btn-wrapper {
				display: flex;
				flex: none;
				align-items: center;
				column-gap: 1.25rem; /* 20px */

				.open {
					text-decoration: none;
					border-radius: 0.375rem; /* 6px */
					background-color: #111827;
					padding: 0.5rem 0.75rem;
					font-size: 0.875rem; /* 14px */
					line-height: 1.25rem; /* 20px */
					font-weight: 500;
					color: #ffffff;
					box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
					cursor: pointer;

					&:hover {
						background-color: #000000;
					}
				}

				.close {
					background-color: transparent;
					border: none;
					outline: none;
					box-shadow: none;
					font-size: 0.875rem; /* 14px */
					line-height: 1.5rem; /* 24px */
					font-weight: 600;
					color: #ffffff;
					cursor: pointer;
				}
			}
		}
	}
</style>
