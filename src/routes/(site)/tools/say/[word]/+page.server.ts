import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { SAY_WORDS } from '$lib/data/say-words';
import { WORD_LISTS } from '$lib/data/most-common-words';
import { bucket } from '$lib/utils/wordSearch';
import SAY_AUDIO from '$lib/data/say-audio.json';

/**
 * The voices whose licence asks to be named, by language — the `attribution`
 * lines of `SPEECH_VOICES` in the app's `packages/shared/src/speech.ts`, which
 * is where `scripts/wordlists/build-say-audio.py` takes its voices from. The
 * rest are CC0, MIT or Apache-2.0 and ask for nothing.
 */
const VOICE_CREDITS: Record<string, { name: string; url: string; licence: string }> = {
	bn: { name: 'google (bn_BD)', url: 'http://www.openslr.org/37/', licence: 'CC BY-SA 4.0' },
	ca: {
		name: 'upc_ona (ca_ES)',
		url: 'https://collectivat.cat/asr#upc-festcat-tts-corpora',
		licence: 'CC BY-SA 4.0'
	},
	et: {
		name: 'news (et_EE)',
		url: 'https://metashare.ut.ee/repository/browse/speech-corpus-of-estonian-news-sentences/37b7c5d6a0d411eebb4773db10791bcfb0c0cf788d2d4030bfaf2f2e6e55dd8d/',
		licence: 'CC BY 4.0'
	},
	sl: {
		name: 'artur (sl_SI)',
		url: 'https://huggingface.co/datasets/ppisljar/artur_studio_tts/',
		licence: 'CC BY 4.0'
	},
	vi: {
		name: 'vais1000 (vi_VN)',
		url: 'https://ieee-dataport.org/documents/vais-1000-vietnamese-speech-synthesis-corpus',
		licence: 'CC BY 4.0'
	}
};

const IDX = () => path.join(process.cwd(), 'static/data/most-common-words/idx/e');

/**
 * Loaded once for the whole prerender rather than once per page: there are
 * nearly a thousand of these and they share a few hundred shards.
 */
const shards = new Map<string, Record<string, [string, string, number, string][]>>();
let split: string[] | null = null;

async function rowsFor(word: string) {
	if (!split) {
		const stats = JSON.parse(await readFile(path.join(IDX(), '../stats.json'), 'utf8'));
		split = stats.split.e as string[];
	}
	const name = bucket(word, split);
	if (!shards.has(name)) {
		shards.set(
			name,
			JSON.parse(await readFile(path.join(IDX(), `${encodeURIComponent(name)}.json`), 'utf8'))
		);
	}
	return shards.get(name)?.[word] ?? [];
}

export function entries() {
	return SAY_WORDS.map((w) => ({ word: w.slug }));
}

export async function load({ params }) {
	const entry = SAY_WORDS.find((w) => w.slug === params.word);
	if (!entry) throw error(404, 'No page for that word');

	const byCode = new Map(WORD_LISTS.map((l) => [l.code, l]));
	// Where each language's word sits in this page's audio file, for the
	// languages the app has a voice for. See build-say-audio.py.
	const spans: Record<string, [number, number]> =
		(SAY_AUDIO as unknown as Record<string, Record<string, [number, number]>>)[entry.slug] ?? {};
	const rows = (await rowsFor(entry.word))
		.map(([code, word, rank, gloss]) => {
			const lang = byCode.get(code);
			return lang
				? {
						code,
						word,
						rank,
						gloss,
						name: lang.name,
						native: lang.nativeName,
						slug: lang.slug,
						audio: spans[code] ?? null
				  }
				: null;
		})
		.filter(Boolean)
		.sort((a, b) => (a as { name: string }).name.localeCompare((b as { name: string }).name));

	// Neighbours in the alphabetical list, so every page links onward.
	const i = SAY_WORDS.indexOf(entry);
	const nearby = SAY_WORDS.slice(Math.max(0, i - 6), i + 7).filter((w) => w.slug !== entry.slug);

	const credits = Object.keys(spans)
		.filter((code) => VOICE_CREDITS[code])
		.sort()
		.map((code) => ({ language: byCode.get(code)?.name ?? code, ...VOICE_CREDITS[code] }));

	return { entry, rows, nearby, credits };
}
