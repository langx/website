<script>
	import DiscordWhiteBig from '$lib/icons/socials/discord-white-big.svelte';
</script>

<section id="discord">
	<div class="container">
		<div class="content">
			<DiscordWhiteBig />
		</div>
		<div class="content">
			<h2>We also have discord!</h2>
			<p>Join our discord server now and stay in touch with other users and developers!</p>
		</div>
		<div class="content">
			<a href="https://discord.com/invite/2D3jW2YDgS" class="discord-link">Join now!</a>
		</div>
	</div>
</section>

<style>
	:root {
		--discord-color: #5865f2;
	}

	#discord {
		background-color: var(--discord-color);
		border-radius: 1.5rem;
		padding: 30px;
		text-align: center;
	}

	.container {
		display: flex;
		flex-direction: column;
		gap: 25px;
		align-items: center;
		padding: 0;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 6px;
		align-items: center;
	}

	.discord-link {
		font-size: 0.875rem;
		padding: 0.625rem 0.875rem;
		border-radius: 0.375rem;
		text-decoration: none;
		display: flex;
		font-weight: 600;
		transition: 0.2s;
		color: black;
		border: 2px white solid;
		background: white;
	}

	.discord-link:hover {
		background: transparent;
		border-color: white;
		color: white;
	}

	@media (max-width: 599px) {
		h2 {
			font-size: 1.3rem;
		}

		p {
			font-size: 0.9rem;
		}
	}

	@media (min-width: 600px) {
		p {
			max-width: 600px;
		}
	}
</style>
