import { audioSprite, stopAudio, unlockAudio } from './audioSprite';

/**
 * A reading of any word in the top of any list, by language and rank — see
 * `scripts/wordlists/build-word-audio.py`, which writes them to
 * `/audio/w/<code>/`: fifty ranks to an MP3, a JSON of offsets beside each,
 * and an `index.json` naming the ranks the voice could not read cleanly.
 * The lists' example sentences are a second store beside it, `/audio/x/`,
 * keyed the same way: a sentence has the rank of the word it shows.
 *
 * The files are not in the repository. The deploy unpacks them from a GitHub
 * release, so a local dev server has none unless they were generated or
 * unpacked there, and then every button simply stays hidden.
 */

/** Which readings: the words, or their example sentences. */
export type AudioStore = 'w' | 'x';

/** How far down each list the readings go. `KINDS` in build-word-audio.py. */
const DEPTH: Record<AudioStore, number> = { w: 5000, x: 1000 };

/**
 * The languages with a voice: Kokoro's six and the Piper voices in
 * `apps/tts/voices.json`, less Greek (`SKIP` in `tts_voices.py`). Only a
 * filter, so a page does not ask for an index that cannot exist.
 */
// prettier-ignore
const VOICED = new Set([
	'en', 'es', 'fr', 'it', 'pt', 'hi',
	'bg', 'bn', 'ca', 'cs', 'da', 'de', 'et', 'fa', 'fi', 'hu', 'lv',
	'nl', 'no', 'pl', 'ro', 'ru', 'sk', 'sl', 'sq', 'sv', 'uk', 'ur', 'vi'
]);

type Index = { chunk: number; n: number; missing: Set<number> };
const indexes = new Map<string, Promise<Index | null>>();
const chunks = new Map<
	string,
	{ spans: Promise<(readonly [number, number] | 0)[]>; sprite: ReturnType<typeof audioSprite> }
>();

/** Whether the language has a voice at all. */
export const isVoiced = (code: string) => VOICED.has(code);

/** Whether a reading could exist, without asking the network. */
export function mayHaveAudio(
	code: string,
	rank: number | undefined | null,
	store: AudioStore = 'w'
): boolean {
	return !!rank && rank >= 1 && rank <= DEPTH[store] && VOICED.has(code);
}

function index(code: string, store: AudioStore): Promise<Index | null> {
	const key = `${store}/${code}`;
	let found = indexes.get(key);
	if (!found) {
		found = fetch(`/audio/${key}/index.json`)
			.then((res) => (res.ok ? res.json() : null))
			.then((raw) =>
				raw ? { chunk: raw.chunk, n: raw.n, missing: new Set<number>(raw.missing) } : null
			)
			.catch(() => null);
		indexes.set(key, found);
	}
	return found;
}

/** Whether this word has a reading. One small fetch per language, shared. */
export async function hasAudio(
	code: string,
	rank: number,
	store: AudioStore = 'w'
): Promise<boolean> {
	if (!mayHaveAudio(code, rank, store)) return false;
	const idx = await index(code, store);
	return !!idx && rank <= idx.n && !idx.missing.has(rank);
}

let presses = 0;

/** Plays the word; resolves when it ends or another sound cuts it off. */
export async function playWord(code: string, rank: number, store: AudioStore = 'w'): Promise<void> {
	// Before anything is awaited: the press is still a gesture here, and the
	// last word should stop now rather than when this one has loaded.
	unlockAudio();
	stopAudio();
	const press = ++presses;
	const idx = await index(code, store);
	if (!idx) throw new Error(`no readings for ${code}`);
	const k = Math.floor((rank - 1) / idx.chunk);
	const key = `${store}/${code}/${k}`;
	let chunk = chunks.get(key);
	if (!chunk) {
		const spans = fetch(`/audio/${key}.json`).then((res) => {
			if (!res.ok) throw new Error(`${res.status} for ${key}`);
			return res.json();
		});
		chunk = { spans, sprite: audioSprite(`/audio/${key}.mp3`) };
		chunks.set(key, chunk);
		// A failed offsets fetch is retried on the next press.
		spans.catch(() => chunks.delete(key));
	}
	const span = (await chunk.spans)[(rank - 1) % idx.chunk];
	if (!span) throw new Error(`no reading for ${code} #${rank}`);
	// Another word was pressed while this one's file was on its way.
	if (press !== presses) return;
	await chunk.sprite.play(span[0], span[1]);
}
