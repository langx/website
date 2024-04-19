<script lang="ts">
	import { onMount } from 'svelte';

	let items: any;
	let active: number = 0;
	let testimonials = [
		{
			id: 1,
			rating: 5,
			name: 'Amanda Hernandez',
			body: `Great app!! If you are wanting to have real conversations with someone that speaks the language you are trying to learn, this app is what youneed!`,
			img: 'https://lh3.googleusercontent.com/a-/ALV-UjVBLt_MBA0BmgefYWtgww_Y2dUW5K8hwMWdjkz0kmMhl0vXu5Lqmw'
		},
		{
			id: 2,
			rating: 5,
			name: 'Hatice Altun',
			body: `A great application to meet new people and practice your language.`,
			img: 'https://lh3.googleusercontent.com/a-/ALV-UjWZvyzuojaUwCBF2j_zTFHqXtaHFVCupS88ssURrUeTi5R1Gt4'
		},
		{
			id: 3,
			rating: 5,
			name: 'Burak',
			body: `Wow! As an English teacher, I came across it by chance with the idea that my students could get extra practice. I'm already looking forward to it. I definitely recommend it!`,
			img: 'https://lh3.googleusercontent.com/a-/ALV-UjXOD-Wl8RUhxf2cLkVrkz20C7dWwIHnhpO5UWzJhOzEPq-6LiCBaQ'
		},
		{
			id: 4,
			rating: 5,
			name: 'Martín Didoli',
			body: `The application is open source and the team behind it is really cool. Try it and meet cool people`,
			img: 'https://lh3.googleusercontent.com/a-/ALV-UjW_Jur3BSRuRmmgJYlcKbCg0CDf_Hc7QRsuYt22Wb5jcTJbkeX8'
		},
		{
			id: 5,
			rating: 5,
			name: 'Dasha Durneva',
			body: `This app made me opened to practicing language learning. Simple yet user-friendly design encourages to chat with language learners like myself. Highly recommend this app!!!`,
			img: 'https://lh3.googleusercontent.com/a-/ALV-UjXSkMI6PYh4hc10-t_B0MkW3dKun5BbnWRCRGBNRScieEwYEOJ9NQ'
		},
		{
			id: 6,
			rating: 5,
			name: 'Ray Carnes',
			body: `Great free App to connect with others wanting to brush up on language skills!!`,
			img: 'https://lh3.googleusercontent.com/a-/ALV-UjU0535FfwInf3JTeGNO5Sbe8V72nVUHAQzyh27VqjccaPvwqRIL'
		}
	];

	onMount(() => {
		items = document.querySelectorAll('#slider .item');

		loadShow();
	});

	const loadShow = () => {
		let i;
		items[active].style.transform = `none`;
		items[active].style.zIndex = 1;
		items[active].style.filter = 'none';
		items[active].style.opacity = 1;

		let stt = 0;
		for (i = active + 1; i < items.length; i++) {
			stt++;
			items[i].style.transform = `translateX(${120 * stt}px) scale(${
				1 - 0.2 * stt
			}) perspective(16px) rotateY(-1deg)`;
			items[i].style.zIndex = -stt;
			items[i].style.filter = 'blur(5px)';
			items[i].style.opacity = stt > 1 ? 0 : 0.6;
		}

		stt = 0;
		for (i = active - 1; i >= 0; i--) {
			stt++;
			items[i].style.transform = `translateX(${-120 * stt}px) scale(${
				1 - 0.2 * stt
			}) perspective(16px) rotateY(1deg)`;
			items[i].style.zIndex = -stt;
			items[i].style.filter = 'blur(5px)';
			items[i].style.opacity = stt > 1 ? 0 : 0.6;
		}
	};

	const handlePrev = () => {
		active = active - 1 >= 0 ? active - 1 : active;
		loadShow();
	};

	const handleNext = () => {
		active = active + 1 < items.length ? active + 1 : active;
		loadShow();
	};
</script>

<section id="slider">
	<div class="button-wrapper">
		{#each testimonials as testimonial (testimonial.id)}
			<div class="item">
				<div class="wrapper">
					<div>
						<img src={testimonial.img} alt="{testimonial.name} Avatar" draggable="false" />
					</div>
					<h4>{testimonial.name}</h4>
					<div class="stars">
						{#each Array.from({ length: testimonial.rating }, (_, i) => i) as star}
							<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
									clip-rule="evenodd"
								/>
							</svg>
						{/each}
					</div>
					<p><q>{testimonial.body}</q></p>
				</div>
			</div>
		{/each}
		<button id="next" on:click={handleNext}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
			</svg>
		</button>
		<button id="prev" on:click={handlePrev}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
			</svg>
		</button>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#slider {
		position: relative;
		margin: 80px 0 80px 0;
		width: 100%;
		height: 395px;
		//overflow: hidden;

		@include for-tablet-portrait-down {
			min-height: 432px;

			.button-wrapper {
				max-width: 350px;
				margin: auto;
				position: relative;
				height: 100%;
			}
		}

		.item {
			position: absolute;
			top: 0;
			left: calc(50% - 17%);
			text-align: center;
			background-color: var(--color--card-background);
			max-width: 350px;
			min-width: 290px;
			min-height: 411px;
			padding: 50px 20px 20px 20px;
			border-radius: 10px;
			box-shadow: var(--card-shadow);
			transition: 0.5s;
			overflow: hidden;

			@include for-tablet-portrait-down {
				left: 50%;
				transform: translateX(-50%) !important;
				opacity: 1 !important;
				filter: none !important;
				min-height: 432px;
				width: 100%;
			}

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 220px;
				height: 196px;
				background-color: var(--color--yellow);
				border-radius: 0 0 100% 0;
				z-index: 0;
				user-select: none;
				pointer-events: none;
			}

			.wrapper {
				position: relative;
				z-index: 1;

				div {
					display: flex;
					justify-content: center;

					img {
						border: 4px solid var(--color--card-background);
						border-radius: 100%;
						width: 120px;
						height: 120px;
						display: inline-block;
						max-width: 100%;
						vertical-align: middle;
					}
				}
			}

			h4 {
				margin: 20px 0 5px 0;
			}

			.stars {
				display: flex;
				align-items: center;
				margin-bottom: 20px;

				svg {
					flex-shrink: 0;
					width: 1.25rem;
					height: 1.25rem;
					color: var(--color--yellow);
				}
			}

			p {
				font-size: 0.9rem;
				text-align: justify;
			}
		}

		#next {
			position: absolute;
			right: 50px;
			top: 50%;
			transform: translateY(-50%);

			@include for-tablet-portrait-down {
				right: -10px;
				z-index: 1;
			}
		}

		#prev {
			position: absolute;
			left: 50px;
			top: 50%;
			transform: translateY(-50%);

			@include for-tablet-portrait-down {
				left: -10px;
				z-index: 1;
			}
		}

		#prev,
		#next {
			color: var(--color--text-shade);
			cursor: pointer;
			background: none;
			border: none;
			font-size: xxx-large;
			font-family: monospace;
			font-weight: bold;
			padding: 0;
			opacity: 0.5;
			transition: opacity 0.5s;

			svg {
				width: 50px;
				height: 50px;
			}
		}

		#prev:hover,
		#next:hover {
			opacity: 1;
		}
	}
</style>
