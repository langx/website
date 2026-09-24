<script lang="ts">
	/**
	 * The line under anything with speaker buttons: what the voice is, and the
	 * names some voices' licences ask for (`$lib/data/voices`). Pass every
	 * language the page can read aloud; the ones without a voice are ignored,
	 * and with none left it renders nothing.
	 */
	import { WORD_LISTS } from '$lib/data/most-common-words';
	import { VOICE_CREDITS } from '$lib/data/voices';
	import { isVoiced } from '$lib/utils/wordAudio';

	interface Props {
		codes: string[];
	}

	let { codes }: Props = $props();

	const names = new Map(WORD_LISTS.map((l) => [l.code, l.name]));
	let voiced = $derived(codes.filter(isVoiced));
	let credits = $derived(
		[...new Set(voiced)]
			.filter((c) => VOICE_CREDITS[c])
			.sort()
			.map((c) => ({ language: names.get(c) ?? c, ...VOICE_CREDITS[c] }))
	);
</script>

{#if voiced.length}
	<p class="voice-credit">
		The speaker plays the voice the LangX app uses for that language — synthesised, not a native
		speaker, so treat it as a guide.{#if credits.length}
			{' '}Voices for {#each credits as c, i}{c.language} (<a
					href={c.url}
					rel="noopener noreferrer"
					target="_blank">{c.name}</a
				>, {c.licence}){i === credits.length - 1
					? '.'
					: i === credits.length - 2
						? ' and '
						: ', '}{/each}
		{/if}
	</p>
{/if}

<style>
	.voice-credit {
		font-size: 0.8125rem;
		color: var(--color--text-tertiary);
		max-width: 70ch;
	}
</style>
