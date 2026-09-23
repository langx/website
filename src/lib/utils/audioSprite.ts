/**
 * Plays slices of one audio file — words laid end to end, as
 * `scripts/wordlists/build-say-audio.py` and `build-word-audio.py` write them.
 *
 * Web Audio rather than an `<audio>` element, because an element can only be
 * told where to start: stopping it is a `timeupdate` that fires every quarter
 * second or so, which is the next word. A buffer source plays exactly the
 * span it is given.
 *
 * A file is fetched on its first press and not before, so a page that is only
 * read costs nothing. There is one context and one voice for the whole page,
 * however many files it plays from: a second word cuts the first off, and a
 * page with a thousand words does not open a thousand contexts. The context is
 * created inside a press: iOS leaves an `AudioContext` suspended unless a
 * gesture made or resumed it, and the fetch and decode that follow are not a
 * gesture any more.
 */
let ctx: AudioContext | null = null;
let current: AudioBufferSourceNode | null = null;
let latest = 0;

/**
 * Creates or resumes the context. Call it synchronously inside the press when
 * anything is awaited before `play` — a fetch first, say — or iOS will not let
 * the context start.
 */
export function unlockAudio(): AudioContext {
	return context();
}

function context(): AudioContext {
	if (!ctx) {
		const Ctor =
			window.AudioContext ??
			(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
		ctx = new Ctor();
	}
	if (ctx.state === 'suspended') void ctx.resume();
	return ctx;
}

/** Stops whatever is playing, from any file. */
export function stopAudio() {
	latest++;
	if (!current) return;
	try {
		current.stop();
	} catch {
		// Already ended.
	}
	current = null;
}

export function audioSprite(url: string) {
	let buffer: Promise<AudioBuffer> | null = null;

	function load(context: AudioContext) {
		buffer ??= fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error(`${res.status} for ${url}`);
				return res.arrayBuffer();
			})
			.then((bytes) => context.decodeAudioData(bytes))
			.catch((err) => {
				// A failed load is retried on the next press, not remembered.
				buffer = null;
				throw err;
			});
		return buffer;
	}

	/** Resolves once the slice has finished, or was cut off by another. */
	async function play(startMs: number, durationMs: number): Promise<void> {
		const audio = context();
		stopAudio();

		// Two presses during a load both wait on it; only the later one should
		// be heard when it arrives.
		const turn = latest;
		const decoded = await load(audio);
		if (turn !== latest) return;
		const source = audio.createBufferSource();
		source.buffer = decoded;
		source.connect(audio.destination);
		current = source;
		// A few milliseconds either side: decoders disagree on the MP3 encoder's
		// priming delay, and the files keep at least 120ms of silence around
		// every word so that a slice started a little early lands in quiet.
		const pad = 0.04;
		source.start(0, Math.max(0, startMs / 1000 - pad), durationMs / 1000 + pad * 2);
		return new Promise((resolve) => {
			source.onended = () => {
				if (current === source) current = null;
				resolve();
			};
		});
	}

	return { play, stop: stopAudio };
}
