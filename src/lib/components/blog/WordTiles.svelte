<script lang="ts">
	/**
	 * One word in several languages as tiles, the script big enough to see.
	 * Every word must come from the site's own data (a /tools/say page), never
	 * from memory — the posts that use this say where each list comes from.
	 */
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';

	type Tile = { language: string; word: string; code?: string };
	export let words: Tile[];
	/** The English word the tiles translate, for the caption and the screen reader. */
	export let english = '';
	/** Link to the full list, e.g. /tools/say/freedom. */
	export let href = '';

	const rtl = new Set(['ar', 'he', 'fa', 'ur']);
</script>

<figure class="tiles">
	<ul role="list">
		{#each words as w}
			<li>
				<ScriptDisc nativeName={w.word} code={w.code} size={28} />
				<span class="word" lang={w.code} dir={w.code && rtl.has(w.code) ? 'rtl' : undefined}
					>{w.word}</span
				>
				<span class="lang">{w.language}</span>
			</li>
		{/each}
	</ul>
	{#if english || href}
		<figcaption>
			{#if english}“{english}” in {words.length} languages.{/if}
			{#if href}<a {href}>See every language →</a>{/if}
		</figcaption>
	{/if}
</figure>

<style lang="scss">
	.tiles {
		margin: var(--space-md) 0 var(--space-lg);
	}

	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: grid;
		grid-template-columns: 28px 1fr;
		grid-template-rows: auto auto;
		column-gap: 10px;
		align-items: center;
		margin: 0;
		padding: 12px 14px;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-md);
		background: var(--color--surface);

		:global(.disc) {
			grid-row: 1 / 3;
		}
	}

	.word {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.125rem;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}

	.lang {
		font-size: 0.8125rem;
		color: var(--color--text-tertiary);
	}

	figcaption {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		margin-top: 10px;
		font-size: 0.875rem;
		color: var(--color--text-shade);
	}
</style>
