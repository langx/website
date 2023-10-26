<script>
	import GitHubIcon from '$lib/icons/socials/github.svelte';
	import EmailIcon from '$lib/icons/socials/email.svelte';
	import InstagramIcon from '$lib/icons/socials/instagram.svelte';
	import XIcon from '$lib/icons/socials/x.svelte';
</script>

<div class="socials">
	<a
		href="https://www.instagram.com/langXchan"
		target="_blank"
		rel="noopener noreferrer"
		title="See my Instagram profile"
	>
		<InstagramIcon />
	</a>
	<a
		href="https://x.com/langXchan"
		target="_blank"
		rel="noopener noreferrer"
		title="See my X profile"
	>
		<XIcon />
	</a>
	<a
		href="https://github.com/languageXchange"
		target="_blank"
		rel="noopener noreferrer"
		title="See my GitHub profile"
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
				color: var(--color--primary);
				fill: var(--color--primary);
				filter: drop-shadow(0px 0px 3px var(--color--primary));
			}
		}
	}
</style>
