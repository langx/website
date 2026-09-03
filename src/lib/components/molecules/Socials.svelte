<script>
	import GitHubIcon from '$lib/icons/socials/github.svelte';
	import RedditIcon from '$lib/icons/socials/reddit.svelte';
	import XIcon from '$lib/icons/socials/x.svelte';
	import InstagramIcon from '$lib/icons/socials/instagram.svelte';
	import MediumIcon from '$lib/icons/socials/medium.svelte';
</script>

<div class="socials">
	<a
		href="https://reddit.com/r/langx"
		target="_blank"
		rel="noopener noreferrer"
		title="LangX on Reddit"
	>
		<RedditIcon />
	</a>
	<a href="https://x.com/langx_io" target="_blank" rel="noopener noreferrer" title="LangX on X">
		<XIcon />
	</a>
	<a
		href="https://instagram.com/langxapp"
		target="_blank"
		rel="noopener noreferrer"
		title="LangX on Instagram"
	>
		<InstagramIcon />
	</a>
	<a
		href="https://github.com/langx"
		target="_blank"
		rel="noopener noreferrer"
		title="LangX on GitHub"
	>
		<GitHubIcon />
	</a>
	<a href="https://blog.langx.io" target="_blank" rel="noopener noreferrer" title="LangX on Medium">
		<MediumIcon />
	</a>
</div>

<style lang="scss">
	.socials {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;

		a {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 40px;
			height: 40px;
			border-radius: var(--radius-pill);
			color: var(--color--text);
			fill: var(--color--text);
			transition: background-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);

			:global(svg) {
				width: 20px;
				height: 20px;
			}

			&:active {
				transform: scale(0.95);
			}

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					background: var(--color--muted);
					color: var(--color--text);
				}
			}
		}
	}
</style>
