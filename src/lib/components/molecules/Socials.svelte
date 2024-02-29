<script>
	import GitHubIcon from '$lib/icons/socials/github.svelte';
	import EmailIcon from '$lib/icons/socials/email.svelte';
	import DiscordIcon from '$lib/icons/socials/discord.svelte';
	import XIcon from '$lib/icons/socials/x.svelte';
	import InstagramIcon from '$lib/icons/socials/instagram.svelte';
	import YoutubeIcon from '$lib/icons/socials/youtube.svelte';
	import FacebookIcon from '$lib/icons/socials/facebook.svelte';
	import TikTokIcon from '$lib/icons/socials/tiktok.svelte';
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
		href="https://tiktok.com/@languageXapp"
		target="_blank"
		rel="noopener noreferrer"
		title="See our TikTok Page"
	>
		<TikTokIcon />
	</a>
	<a
		href="https://instagram.com/languageXapp"
		target="_blank"
		rel="noopener noreferrer"
		title="See our Instagram Page"
	>
		<InstagramIcon />
	</a>
	<a
		href="https://x.com/languageXapp"
		target="_blank"
		rel="noopener noreferrer"
		title="See our X Page"
	>
		<XIcon />
	</a>
	<a
		href="https://www.facebook.com/languageXapp"
		target="_blank"
		rel="noopener noreferrer"
		title="See our Facebook Page"
	>
		<FacebookIcon />
	</a>
	<a
		href="https://www.youtube.com/@languageXchange"
		target="_blank"
		rel="noopener noreferrer"
		title="See our YouTube Channel"
	>
		<YoutubeIcon />
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
