<script lang="ts">
	interface Props {
		filename: string;
		lang: string;
		fullBleed?: boolean | undefined;
		children?: import('svelte').Snippet;
	}

	let { filename, lang, fullBleed = undefined, children }: Props = $props();
</script>

<div class="code-block" class:full-bleed={fullBleed}>
	{#if filename}
		<div class="filename">{filename}</div>
	{/if}
	{#if lang}
		<div class="lang">{lang}</div>
	{/if}
	{@render children?.()}
</div>

<style lang="scss">
	.code-block {
		display: block;
		position: relative;
		background-color: var(--color--code-background);
		color: var(--color--code-text);
		font-family: var(--font--mono);
		font-size: 1rem;
		line-height: 1.33em;
		border-radius: 8px;
		box-shadow: var(--shadow-card);

		padding: 30px 15px;
		margin: 30px 0;

		:global(pre) {
			overflow-x: auto;
			scrollbar-color: var(--color--primary) var(--color--primary-tint);
			scrollbar-width: thin;
			padding-bottom: 5px;

			&::-webkit-scrollbar {
				height: 8px;
			}
			&::-webkit-scrollbar-thumb {
				background: var(--color--primary);
				&:hover {
					background: var(--color--primary-shade);
				}
			}
		}

		.lang {
			position: absolute;
			right: 0;
			top: -15px;
			background: inherit;
			border-radius: 8px;
			padding: 5px 10px;
			z-index: 2;
			font-size: 0.85em;
		}

		.filename {
			background: inherit;
			border-top-left-radius: 8px;
			border-top-right-radius: 8px;
			margin-bottom: -2px;
			padding: 5px 10px;
			position: absolute;
			left: 0px;
			top: -15px;
			z-index: 1;
		}
	}
</style>
