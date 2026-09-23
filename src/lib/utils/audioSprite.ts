/**
 * Plays slices of one audio file — a page's words laid end to end, as
 * `scripts/wordlists/build-say-audio.py` writes them.
 *
 * Web Audio rather than an `<audio>` element, because an element can only be
 * told where to start: stopping it is a `timeupdate` that fires every quarter
 * second or so, which is the next word. A buffer source plays exactly the
 * span it is given.
 *
 * The file is fetched on the first press and not before, so a page that is
 * only read costs nothing. The context is created inside that press too: iOS
 * leaves an `AudioContext` suspended unless a gesture made or resumed it, and
 * the fetch and decode that follow are not a gesture any more.
 */
export function audioSprite(url: string) {
	let ctx: AudioContext | null = null;
	let buffer: Promise<AudioBuffer> | null = null;
	let current: AudioBufferSourceNode | null = null;
	let latest = 0;

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
		if (!ctx) {
			const Ctor =
				window.AudioContext ??
				(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			ctx = new Ctor();
		}
		const context = ctx;
		if (context.state === 'suspended') void context.resume();
		stop();

		// Two presses during the first load both wait on it; only the later one
		// should be heard when it arrives.
		const turn = ++latest;
		const decoded = await load(context);
		if (turn !== latest) return;
		const source = context.createBufferSource();
		source.buffer = decoded;
		source.connect(context.destination);
		current = source;
		// A few milliseconds either side: decoders disagree on the MP3 encoder's
		// priming delay, and the file keeps 200ms of silence around every word
		// so that a slice started a little early lands in quiet.
		const pad = 0.04;
		source.start(0, Math.max(0, startMs / 1000 - pad), durationMs / 1000 + pad * 2);
		return new Promise((resolve) => {
			source.onended = () => {
				if (current === source) current = null;
				resolve();
			};
		});
	}

	function stop() {
		latest++;
		if (!current) return;
		try {
			current.stop();
		} catch {
			// Already ended.
		}
		current = null;
	}

	return { play, stop };
}
