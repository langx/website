<script lang="ts">
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';

	interface FaqObject {
		id: number;
		title: string;
		content: string;
		isOpen: boolean;
	}

	const faqObjects: FaqObject[] = [
		{ id: 1, title: 'First Question?', content: 'First answer', isOpen: false },
		{ id: 2, title: 'Second  Question?', content: 'Second answer', isOpen: false },
		{ id: 3, title: 'Third  Question?', content: 'Third answer', isOpen: false }
	];
</script>

<section id="faq">
	<div class="faq-container">
		<h2><SparklingHighlight color="secondary">Frequently Asked Questions</SparklingHighlight></h2>
		<div class="accordion">
			{#each faqObjects as item (item.id)}
				<div class="accordion-item">
					<button
						on:click={() => {
							item.isOpen = !item.isOpen;
						}}
						id="accordion-button-5"
						aria-expanded={item?.isOpen}
						><span class="accordion-title">{item?.title}</span><span
							class="icon"
							aria-hidden="true"
						/></button
					>
					<div class="accordion-content">
						<p>{item?.content}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#faq {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 15px;
		position: relative;
		padding: 80px 0;

		@include for-phone-only {
			padding: 40px 0 50px;
		}

		.hello {
			text-align: center;
		}
	}

	$yellow: var(--color--primary);

	.faq-container {
		width: 100%;

		h2 {
			color: #ff723f;
		}

		.accordion {
			.accordion-item {
				border-bottom: 1px solid #32343e;

				button[aria-expanded='true'] {
					border-bottom: 1px solid $yellow;
				}
			}

			button {
				position: relative;
				display: block;
				text-align: left;
				width: 100%;
				padding: 1em 0;
				color: unset;
				font-size: 1.2rem;
				font-weight: 400;
				border: none;
				background: none;
				outline: none;

				@include for-phone-only {
					font-size: 1rem;
				}

				&:hover,
				&:focus {
					cursor: pointer;
					color: $yellow;

					&::after {
						cursor: pointer;
						color: $yellow;
						border: 1px solid $yellow;
					}
				}

				.accordion-title {
					padding: 1em 1.5em 1em 0;
				}

				.icon {
					display: inline-block;
					position: absolute;
					top: 18px;
					right: 0;
					width: 22px;
					height: 22px;
					border: 1px solid;
					border-radius: 22px;

					&::before {
						display: block;
						position: absolute;
						content: '';
						top: 9px;
						left: 5px;
						width: 10px;
						height: 2px;
						background: currentColor;
					}

					&::after {
						display: block;
						position: absolute;
						content: '';
						top: 5px;
						left: 9px;
						width: 2px;
						height: 10px;
						background: currentColor;
					}
				}
			}

			button[aria-expanded='true'] {
				color: $yellow;

				.icon {
					&::after {
						width: 0;
					}
				}

				+ .accordion-content {
					opacity: 1;
					max-height: 9em;
					transition: all 200ms linear;
					will-change: opacity, max-height;
				}
			}

			.accordion-content {
				opacity: 0;
				max-height: 0;
				overflow: hidden;
				transition: opacity 200ms linear, max-height 200ms linear;
				will-change: opacity, max-height;

				p {
					font-size: 0.9rem;
					font-weight: 300;
					margin: 2em 0;
				}
			}
		}
	}
</style>
