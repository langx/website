<script>
	import FooterWave from '$lib/icons/footer-wave.svelte';
	import Socials from '$lib/components/molecules/Socials.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';
</script>

<footer>
	<div class="wave">
		<FooterWave />
	</div>
	<div class="content">
		<div class="menu">
			<ul>
				<li>
					<small><a href="https://status.languagexchange.net" target="_blank">Status</a></small>
				</li>
				<li>
					<small>
						<a
							href="https://github.com/languageXchange/languageXchange/blob/main/CONTRIBUTING.md"
							target="_blank"
						>
							Contribute
						</a></small
					>
				</li>
				<li>
					<small>
						<a href="mailto:info@languagexchange.net">Contact Us</a>
					</small>
				</li>
			</ul>
			<ul>
				<li><small><a href="privacy-policy">Privacy Policy</a></small></li>
				<li><small><a href="terms-conditions">Terms & Conditions</a></small></li>
				<li><small><a href="cookie-policy">Cookie Policy</a></small></li>
			</ul>
		</div>
		<div class="copyright">© 2024 languageXchange - Practice, Learn, Succeed!</div>
		<div class="credits">
			<small>
				This website is full open sourced and licensed by
				<a
					href="https://github.com/languageXchange/website/blob/main/LICENSE"
					target="_blank"
					rel="noopener noreferrer"
				>
					MIT Licence
				</a>. A part of
				<a href="https://newchapter.tech/" target="_blank" rel="noopener noreferrer">
					New Chapter Tech
				</a>
			</small>
		</div>
		<div class="socials">
			<Socials />
			<ThemeToggle />
		</div>
	</div>
</footer>

<style lang="scss">
	footer {
		height: 340px;
		width: 100%;
		background: linear-gradient(60deg, var(--color--waves-start) 0%, var(--color--waves-end) 100%);
		display: grid;
		grid-template-rows: 120px 1fr;

		.content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 15px;
			font-weight: 600;
			text-align: center;

			.menu {
				ul {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 20px;
					list-style: none;
					padding: 0;
					margin: 0;

					li {
						a {
							color: var(--color--text-shade);
							text-decoration: none;
							transition: all 0.2s ease-in-out;

							&:hover {
								color: var(--color--primary);
								transition: color 0.5s ease-in-out;
							}
						}
					}
				}
			}

			.credits {
				font-weight: 400;
				font-size: 90%;
				color: var(--color--text-shade);
			}

			.socials {
				display: flex;
				align-items: center;
				gap: 20px;
			}
		}

		a {
			&:hover {
				filter: drop-shadow(0px 0px 3px var(--color--primary));
			}
		}
	}
</style>
