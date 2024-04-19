<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import StarCount from '$lib/components/molecules/StarCount.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';

	export let showBackground = false;
</script>

<header class:has-background={showBackground}>
	<nav class="container">
		<div class="logo">
			<Logo />
		</div>
		<div class="links">
			<a href="/blog">Blog</a>
			<StarCount />
			<ThemeToggle />
		</div>
	</nav>
</header>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	header {
		position: relative;
		padding: 30px 0;

		@include for-phone-only {
			padding: 20px 0;
		}

		&.has-background {
			background: linear-gradient(
				60deg,
				var(--color--waves-start) 0%,
				var(--color--waves-end) 100%
			);
		}

		.container {
			display: flex;
			align-items: center;
			gap: 30px;

			@include for-phone-only {
				.links {
					a {
						display: none;
					}
				}
			}
		}

		.logo {
			height: 44px;
			flex: 1;
		}

		a {
			color: var(--color--text);
		}

		.links {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 30px;

			a {
				text-decoration: none;

				&:hover {
					color: var(--color--text);
					filter: drop-shadow(0px 0px 3px var(--color--text-shade));
				}
			}
		}
	}
</style>
