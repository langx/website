<section id="sponsors">
	<h2>Featured Sponsors</h2>
	<div class="sponsor-container">
		<a href="#" target="_blank" rel="noopener noreferrer">
			<img
				src="https://tailwindui.com/img/logos/158x48/transistor-logo-white.svg"
				alt=""
				width="158"
				height="48"
			/>
		</a>
		<a href="#" target="_blank" rel="noopener noreferrer">
			<img
				src="https://tailwindui.com/img/logos/158x48/reform-logo-white.svg"
				alt=""
				width="158"
				height="48"
			/>
		</a>
		<a href="#" target="_blank" rel="noopener noreferrer">
			<img
				src="https://tailwindui.com/img/logos/158x48/tuple-logo-white.svg"
				alt=""
				width="158"
				height="48"
			/>
		</a>
		<a href="#" target="_blank" rel="noopener noreferrer">
			<img
				src="https://tailwindui.com/img/logos/158x48/savvycal-logo-white.svg"
				alt=""
				width="158"
				height="48"
			/>
		</a>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	$yellow: var(--color--primary);

	#sponsors {
		padding: 110px 0 80px 0;

		@include for-phone-only {
			padding: 40px 0 50px;
		}

		h2 {
			text-align: center;
		}

		.sponsor-container {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			column-gap: 2.5rem;
			row-gap: 2.5rem;
			align-items: center;
			margin-top: 2.5em;

			a {
				grid-column: span 1 / span 1;
				max-height: 4rem;

				@include for-tablet-portrait-down {
					grid-column: span 2 / span 2;
				}

				img {
					object-fit: contain;
					width: 100%;
				}
			}
		}
	}
</style>
