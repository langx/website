<script>
	import GitHubIcon from '$lib/icons/socials/github.svelte';
	import EmailIcon from '$lib/icons/socials/email.svelte';
	import DiscordIcon from '$lib/icons/socials/discord.svelte';
</script>

<div class="socials">
	<a
		href="https://discord.gg/CpDZ3kg2rJ"
		target="_blank"
		rel="noopener noreferrer"
		title="Join our Discord server"
	>
		<DiscordIcon />
	</a>
	<a
		href="https://github.com/languageXchange"
		target="_blank"
		rel="noopener noreferrer"
		title="See our GitHub Page"
	>
		<GitHubIcon />
	</a>
	<a
		href="mailto:info@languagexchange.net"
		target="_blank"
		rel="noopener noreferrer"
		title="Send an email"
	>
		<EmailIcon />
	</a>
</div>

<style lang="scss">
	@import '../../scss/breakpoints.scss';
	.socials {
		display: flex;
		align-items: center;
		gap: 20px;

		a {
			transition: all 0.2s ease-in-out;
			width: 24px;
			color: var(--color--text);
			fill: var(--color--text);

			&:hover {
				color: var(--color--text);
				fill: var(--color--text);
				filter: drop-shadow(0px 0px 3px var(--color--text-shade));
			}
		}
	}
</style>
