<script>
	import FooterWave from '$lib/icons/footer-wave.svelte';
	import Socials from '$lib/components/molecules/Socials.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';
	import RssLink from '$lib/components/atoms/RssLink.svelte';
</script>

<footer aria-labelledby="footer-heading">
	<div class="wave">
		<FooterWave />
	</div>
	<h2 id="footer-heading" class="sr-only">Footer</h2>
	<div class="footer-container">
		<div class="links-wrapper">
			<div class="links-container">
				<div class="right">
					<div>
						<h3>Company</h3>
						<ul role="list">
							<li>
								<a href="https://status.langx.io" target="_blank">Status</a>
							</li>
							<li>
								<a href="https://github.com/langxapp/langx/contribute" target="_blank">Good First Issues</a>
							</li>
							<li>
								<a href="https://github.com/langxapp/langx/releases" target="_blank">Releases</a>
							</li>
							<li>
								<a href="https://github.com/langxapp/website#contributing" target="_blank">Contribute</a>
							</li>
							<li>
								<a href="https://github.com/langxapp/website/releases" target="_blank">Changelog</a>
							</li>
							<li>
								<a href="https://token.langx.io" target="_blank">Token</a>
							</li>
							<li>
								<a href="https://insight.langx.io/langx.io" target="_blank">Insight</a>
							</li>
							<li>
								<a href="https://github.com/orgs/langxapp/projects/2" target="_blank">Backlog</a>
							</li>
						</ul>
					</div>
					<div>
						<h3>Legal</h3>
						<ul role="list">
							<li>
								<a href="https://langx.io/privacy-policy" target="_blank">Privacy</a>
							</li>
							<li>
								<a href="https://langx.io/terms-conditions" target="_blank">Terms</a>
							</li>
							<li>
								<a href="https://langx.io/data-deletion" target="_blank">Deletion</a>
							</li>
							<li>
								<a href="https://langx.io/cookie-policy" target="_blank">Cookie</a>
							</li>
							<li>
								<a href="mailto:info@languagexchange.net" target="_blank">Contact</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="footer-logo">
				<a href="/">
					<svg xmlns="http://www.w3.org/2000/svg" width="100.852" height="21.544"><path fill="#000" d="M32.286 16.692a1.046 1.046 0 0 1-.783-.321 1.091 1.091 0 0 1-.311-.791V1.111a1.072 1.072 0 0 1 .322-.791 1.056 1.056 0 0 1 .773-.321 1.081 1.081 0 0 1 .794.321 1.072 1.072 0 0 1 .322.791v13.358h7.768a1.081 1.081 0 0 1 .794.321 1.072 1.072 0 0 1 .322.791 1.072 1.072 0 0 1-.322.791 1.081 1.081 0 0 1-.794.321Zm17.361.085a5.183 5.183 0 0 1-2.811-.78 5.553 5.553 0 0 1-1.964-2.116 6.279 6.279 0 0 1-.719-3.024 5.924 5.924 0 0 1 .783-3.035 5.782 5.782 0 0 1 2.125-2.127 5.886 5.886 0 0 1 3.015-.78 5.828 5.828 0 0 1 3 .78 5.807 5.807 0 0 1 2.114 2.127 5.924 5.924 0 0 1 .783 3.035h-.837a6.279 6.279 0 0 1-.719 3.024 5.553 5.553 0 0 1-1.964 2.116 5.183 5.183 0 0 1-2.806.78Zm.429-1.924a3.674 3.674 0 0 0 1.953-.524 3.729 3.729 0 0 0 1.352-1.432 4.2 4.2 0 0 0 .494-2.041 4.249 4.249 0 0 0-.494-2.062 3.729 3.729 0 0 0-1.352-1.432 3.675 3.675 0 0 0-1.953-.524 3.69 3.69 0 0 0-1.942.524 3.783 3.783 0 0 0-1.373 1.432 4.177 4.177 0 0 0-.5 2.062 4.133 4.133 0 0 0 .5 2.041 3.783 3.783 0 0 0 1.373 1.432 3.69 3.69 0 0 0 1.943.525Zm4.807 1.859a1.064 1.064 0 0 1-.783-.31 1.055 1.055 0 0 1-.311-.78v-3.27l.408-2.266 1.781.769v4.766a1.055 1.055 0 0 1-.311.78 1.064 1.064 0 0 1-.783.312Zm14.271 0a1.064 1.064 0 0 1-.783-.31 1.055 1.055 0 0 1-.311-.78v-5.258a3.9 3.9 0 0 0-.451-1.988 2.833 2.833 0 0 0-1.217-1.141 3.92 3.92 0 0 0-1.749-.374 3.608 3.608 0 0 0-1.631.363 3.046 3.046 0 0 0-1.159.972 2.37 2.37 0 0 0-.429 1.4h-1.347a4.476 4.476 0 0 1 .655-2.4 4.717 4.717 0 0 1 1.792-1.678 5.249 5.249 0 0 1 2.554-.62 5.5 5.5 0 0 1 2.65.63 4.558 4.558 0 0 1 1.846 1.849 6.092 6.092 0 0 1 .676 2.992v5.258a1.055 1.055 0 0 1-.311.78 1.064 1.064 0 0 1-.785.306Zm-8.82 0a1.064 1.064 0 0 1-.783-.31 1.055 1.055 0 0 1-.311-.78V6.09a1.047 1.047 0 0 1 .311-.791 1.085 1.085 0 0 1 .783-.3 1.076 1.076 0 0 1 .794.3 1.067 1.067 0 0 1 .3.791v9.532a1.076 1.076 0 0 1-.3.78 1.055 1.055 0 0 1-.794.311Zm18.434.064a5.318 5.318 0 0 1-2.843-.759 5.341 5.341 0 0 1-1.942-2.095 6.449 6.449 0 0 1-.708-3.067 6.124 6.124 0 0 1 .762-3.088 5.511 5.511 0 0 1 2.092-2.095 6.086 6.086 0 0 1 3.069-.759 6.042 6.042 0 0 1 3.047.759 5.511 5.511 0 0 1 2.092 2.095 6.124 6.124 0 0 1 .762 3.088h-1.266a6.885 6.885 0 0 1-.655 3.067 5.21 5.21 0 0 1-1.792 2.095 4.608 4.608 0 0 1-2.618.76Zm.386 4.766a6.877 6.877 0 0 1-2.854-.6 6 6 0 0 1-2.253-1.753.907.907 0 0 1-.2-.748.952.952 0 0 1 .418-.62 1.034 1.034 0 0 1 .8-.171 1.094 1.094 0 0 1 .676.427A3.955 3.955 0 0 0 77.2 19.21a4.71 4.71 0 0 0 2 .406 3.792 3.792 0 0 0 1.9-.492 3.539 3.539 0 0 0 1.384-1.453 4.926 4.926 0 0 0 .515-2.351v-3.035l.708-1.881 1.395.449v4.616a6.3 6.3 0 0 1-.751 3.067 5.712 5.712 0 0 1-2.092 2.191 5.868 5.868 0 0 1-3.104.818Zm.043-6.69a3.774 3.774 0 0 0 1.975-.507 3.593 3.593 0 0 0 1.341-1.411 4.309 4.309 0 0 0 .483-2.073 4.372 4.372 0 0 0-.483-2.084 3.575 3.575 0 0 0-1.341-1.421 3.774 3.774 0 0 0-1.974-.513 3.774 3.774 0 0 0-1.974.513 3.651 3.651 0 0 0-1.352 1.421 4.3 4.3 0 0 0-.494 2.084 4.233 4.233 0 0 0 .494 2.073 3.67 3.67 0 0 0 1.351 1.411 3.774 3.774 0 0 0 1.975.509Zm9.314 1.838a.921.921 0 0 1-.751-.31 1.1 1.1 0 0 1-.258-.727 1.232 1.232 0 0 1 .258-.759l5.408-7.181.966-.855L99.07.318a1.037 1.037 0 0 1 .794-.321.918.918 0 0 1 .708.278 1.055 1.055 0 0 1 .279.684 1.278 1.278 0 0 1-.236.791L95.4 8.675l-.923.812-5.193 6.882a1.056 1.056 0 0 1-.773.323Zm11.223 0a1.122 1.122 0 0 1-.483-.1 1.078 1.078 0 0 1-.376-.31l-5-6.9-.794-.663-5.043-6.967a1.026 1.026 0 0 1-.215-.748 1.223 1.223 0 0 1 .311-.705.918.918 0 0 1 .719-.3.921.921 0 0 1 .794.321l4.764 6.583.815.663 5.3 7.331a1.146 1.146 0 0 1 .236.769 1.14 1.14 0 0 1-.29.727.943.943 0 0 1-.737.301Z"></path><path fill="#fff" d="m0 14.076 1.715-1.188s2.307 3.177 5.641 1.188a4.088 4.088 0 0 0 1.656-1.875 4.757 4.757 0 0 0-.311-3.842l1.817-1.115s2.745 4.625-1.305 8.207a6.717 6.717 0 0 1-5.509 1.239A6.3 6.3 0 0 1 0 14.076Z"></path><path fill="#000" d="m14.539 4.475-1.712 1.2s-2.252-3.189-5.588-1.2A4.123 4.123 0 0 0 5.618 6.41a4.751 4.751 0 0 0 .221 3.783l-1.654 1.145S1.319 6.776 5.369 3.193a6.685 6.685 0 0 1 5.47-1.316 6.3 6.3 0 0 1 3.7 2.598Z"></path></svg>
				</a>
				<div class="credits">
					This project is completely open source and licensed under the <a href="https://github.com/langxapp/website/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">BSD-3-Clause License</a>.
					It is a part of <a href="https://newchapter.tech/" target="_blank" rel="noopener noreferrer">New Chapter Tech</a>.
				</div>
			</div>
		</div>
		<div class="socials-wrapper">
			<div class="socials-container">
				<Socials />
			</div>
			<p class="copy-right">&copy; 2024 LangX | Practice, Learn, Succeed!</p>
		</div>
	</div>
</footer>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

	footer {
		padding-top: 3.5vw;
		padding-bottom: 15px;
		background: linear-gradient(60deg, var(--color--waves-start) 0%, var(--color--waves-end) 100%);
		position: relative;

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

		.footer-container {
      padding-top: 8rem;
      padding-left: 2rem;
      padding-right: 2rem;
      padding-bottom: 2rem;
      max-width: 1080px;
			margin: auto;

      @include for-tablet-portrait-down {
        padding-left: 15px;
        padding-right: 15px;
			}

			.footer-logo {
        display: flex;
				flex-direction: column;
				align-items: flex-end;

        .credits {
          position: relative;
					margin-right: 15px;
					background-color: var(--color--yellow);
					border-radius: 5px;
					padding: 20px 15px;
          font-weight: 400;
          font-size: 80%;
          color: var(--color--text);
          margin-top: 1rem;
          box-shadow: 10px 10px 3px rgba(0,0,0,0.5), 0 0 8px rgba(0,0,0,0.5);
					max-width: 400px;

					@include for-phone-only {
						display: none;
					}
					
					&::before {
						content: '';
            position: absolute;
						border-radius: 5px;
						bottom: -15px;
						right: -15px;
            background-color: var(--color--yellow);
						width: 40px;
						height: 40px;
            box-shadow: 6px 6px 5px rgba(0,0,0,0.5), 0 0 4px rgba(0,0,0,0.5);
            animation: floatdown 6.5s ease-in-out infinite;
					}

          &::after {
            content: '';
            position: absolute;
            border-radius: 2px;
            bottom: -24px;
            right: 15px;
            background-color: var(--color--yellow);
            width: 20px;
            height: 20px;
            box-shadow: 4px 4px 5px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.5);
            animation: float 4s ease-in-out infinite;
          }

          a {
            color: var(--color--text);
            text-decoration: none;
            transition: all 0.2s ease-in-out;
            font-weight: bold;

            &:hover {
              color: var(--color--text);
              filter: drop-shadow(0px 0px 3px var(--color--text-shade));
              transition: color 0.5s ease-in-out;
            }
          }
        }
			}

			.links-wrapper {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));

				.links-container {
          margin-top: 0;
					min-width: 240px;

					.right {
						display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(2, minmax(0, 1fr));

            h3 {
							color: #000000;
							font-weight: 900;
              font-size: 1rem;
              margin: 0;
            }

            ul {
              margin: 1rem 0 0 0;
              list-style: none;
              padding: 0;

              li a {
                color: #000000;
                font-size: 0.8rem;
								transition: all 0.2s ease-in-out;
								text-decoration: none;

								&:hover {
                  filter: drop-shadow(0px 0px 3px var(--color--text-shade));
								}
              }
            }
					}
				}
			}

			.socials-wrapper {
				display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 2rem;
        border-color: rgb(17 24 39 / 0.1);
        border-top-width: 1px;

				@include for-tablet-portrait-down {
					display: block;
          justify-content: unset;
					align-content: unset;
        }

        .socials-container {
					display: flex;
          order: 2;
				}

				.copy-right {
          margin-top: 0;
          order: 1;
					color: #000000;
          font-size: 0.75rem;

          @include for-tablet-portrait-down {
            margin-top: 2rem;
          }
				}
			}
		}

    @keyframes float {
      0% {
        transform: translatey(0px);
      }
      50% {
        transform: translatey(-5px);
      }
      100% {
        transform: translatey(0px);
      }
    }
    @keyframes floatdown {
      0% {
        transform: translatey(-5px);
      }
      50% {
        transform: translatey(0px);
      }
      100% {
        transform: translatey(-5px);
      }
    }
	}
</style>
