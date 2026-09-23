"""
Reads every word on the /tools/say pages aloud, one audio file per page.

    docker build -t langx-tts:local ../langx/apps/tts      # the app's voice service
    docker run --rm -v "$PWD:/site" -w /app langx-tts:local \
        python /site/scripts/wordlists/build-say-audio.py

**The app's own voices, run offline.** The image is `apps/tts` from the langx
repo, unchanged: the same Kokoro and Piper models, the same licence bar, the
same first-choice voice per language as `SPEECH_VOICES` in
`packages/shared/src/speech.ts`. This script imports that service's loaders
rather than talking to it over HTTP, so nothing here depends on it being
deployed and nothing is sent anywhere. Languages the service does not read —
Turkish, Arabic, Korean and the rest whose only voices are non-commercial — get
no button, for the reason the service gives: none is better than a voice we are
not allowed to use.

**One file per page, not one per word.** There are about twenty thousand
distinct words across the pages and Cloudflare Pages takes twenty thousand
files per deployment, for the whole site. So each page gets a single MP3 with
its words laid end to end and a gap between them, and `say-audio.json` records
where each language's word starts and how long it lasts. The page fetches its
file on the first press and plays slices of it with Web Audio.

**Cached, so a rerun only reads what changed.** Each word is synthesised once
per language, trimmed, peak-normalised and kept as raw PCM under
`node_modules/.cache/say-audio`; the page files are rebuilt from that cache in
seconds. A word the model could not read cleanly is not cached, so a rerun
tries it again. Delete the directory to hear a model change.

Output:
    static/audio/say/<slug>.mp3
    src/lib/data/say-audio.json     {slug: {code: [startMs, durationMs]}}
"""

import argparse
import hashlib
import json
import re
import subprocess
import sys
from multiprocessing import Pool
from pathlib import Path

import numpy as np

sys.path.insert(0, "/app")
import server  # noqa: E402 — apps/tts/server.py, from the image

SITE = Path(__file__).resolve().parents[2]
IDX = SITE / "static/data/most-common-words/idx/e"
OUT_AUDIO = SITE / "static/audio/say"
OUT_MANIFEST = SITE / "src/lib/data/say-audio.json"

RATE = 24000
# Silence either side of a word inside the file. Wide enough that a slice
# started a few milliseconds early or late — MP3 decoders do not agree on the
# encoder's priming delay — still lands in silence, not in the next word.
GAP = int(RATE * 0.2)

# How long one word may take before it is not a reading but the model losing
# its way. VITS voices are trained on sentences, and handed a single short word
# some of them ramble — Piper's Greek reads the four sounds of "πάντα" in two and
# a half seconds of something that is not Greek. A generous allowance per
# letter catches that without touching a slow, clear reading of a long word.
def too_long(seconds: float, word: str) -> bool:
    return seconds > 0.35 + 0.18 * len(word)


# Piper samples noise into every reading, so a word that rambles once may not
# the next time. Past this many tries the row goes without a button.
TRIES = 3

# The first voice `SPEECH_VOICES` lists for each of Kokoro's six: the one chat
# plays, and the one a language leads with. `server.LANGUAGES` holds them as a
# set, which has no first.
KOKORO_VOICE = {
    "en": "af_heart",
    "es": "ef_dora",
    "fr": "ff_siwis",
    "it": "if_sara",
    "pt": "pf_dora",
    "hi": "hf_alpha",
}


def say_words() -> list[tuple[str, str]]:
    source = (SITE / "src/lib/data/say-words.ts").read_text(encoding="utf8")
    return re.findall(r"\{ word: '([^']+)', slug: '([^']+)'", source)


def load_index() -> dict:
    rows = {}
    for shard in IDX.glob("*.json"):
        rows.update(json.loads(shard.read_text(encoding="utf8")))
    return rows


# Voices the app keeps but this page does not. Piper's Greek reads sentences
# well enough and single words badly: on 23 September 2026 seven in ten of the
# words here came back as seconds of syllables that are not there, and the
# three that passed `too_long` passed a length check, not a listening one.
# Better no button than a wrong word said with confidence.
SKIP = {"el"}


def voice_for(code: str):
    if code in SKIP:
        return None
    if code in KOKORO_VOICE:
        return ("kokoro", KOKORO_VOICE[code])
    voices = server.PIPER_LANGUAGES.get(code)
    if voices:
        return ("piper", voices[0])
    return None


def cache_path(cache: Path, code: str, word: str) -> Path:
    digest = hashlib.sha1(word.encode("utf8")).hexdigest()[:16]
    return cache / code / f"{digest}.pcm"


def to_pcm(wav: bytes) -> np.ndarray:
    """Any WAV to 24 kHz mono int16, with the silence at both ends cut off."""
    trim = (
        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,"
        "areverse,"
        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,"
        "areverse"
    )
    done = subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-loglevel", "error",
            "-f", "wav", "-i", "pipe:0",
            "-af", trim, "-ar", str(RATE), "-ac", "1",
            "-f", "s16le", "pipe:1",
        ],
        input=wav,
        capture_output=True,
        check=True,
    )
    samples = np.frombuffer(done.stdout, dtype=np.int16).astype(np.float32)
    # Kokoro and Piper do not come out at the same level, and a page that
    # alternates between them should not make anyone reach for the volume.
    peak = float(np.abs(samples).max()) if samples.size else 0.0
    if peak > 0:
        samples *= (0.7 * 32767) / peak
    return samples.astype(np.int16)


_kokoro = None


def limit_threads(threads: int) -> None:
    """Caps ONNX Runtime's thread pool in this worker process.

    Left alone, every session sizes its pool to every core the machine has, so
    four processes each run a dozen threads on twelve cores and spend the
    difference switching between them — the first full run managed less than
    one word a second. Neither loader takes session options, so the
    constructor they both call is wrapped instead.
    """
    import onnxruntime as ort

    original = ort.InferenceSession

    def session(path, sess_options=None, *args, **kwargs):
        options = sess_options or ort.SessionOptions()
        options.intra_op_num_threads = threads
        options.inter_op_num_threads = 1
        return original(path, options, *args, **kwargs)

    ort.InferenceSession = session


def synthesise(job) -> tuple[str, int, int]:
    """One language's share of the words, into the cache. Returns counts."""
    code, words, cache = job
    engine, voice = voice_for(code)
    made = failed = 0
    for word in words:
        target = cache_path(Path(cache), code, word)
        if target.exists():
            continue
        pcm = None
        for _ in range(TRIES):
            try:
                if engine == "kokoro":
                    global _kokoro
                    if _kokoro is None:
                        _kokoro = server.load_kokoro()
                    espeak_lang, _ = server.LANGUAGES[code]
                    samples, rate = _kokoro.create(word, voice=voice, speed=1.0, lang=espeak_lang)
                    wav = server.kokoro_wav(samples, rate)
                else:
                    wav = server.piper_wav(server.load_piper(voice["id"], voice["model"]), word)
                reading = to_pcm(wav)
            except Exception as caught:  # one bad word must not cost the batch
                print(f"  {code} {word!r}: {caught}", flush=True)
                break
            if reading.size >= RATE // 20 and not too_long(reading.size / RATE, word):
                pcm = reading
                break
        if pcm is None:
            failed += 1
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(pcm.tobytes())
        made += 1
    return code, made, failed


def encode(job) -> tuple[str, dict]:
    """One page's words laid end to end, as an MP3, and where each one sits."""
    slug, clips, cache = job
    parts = [np.zeros(GAP, dtype=np.int16)]
    at = GAP
    spans = {}
    for code, word in clips:
        path = cache_path(Path(cache), code, word)
        if not path.exists():
            continue
        pcm = np.frombuffer(path.read_bytes(), dtype=np.int16)
        spans[code] = [round(at * 1000 / RATE), round(pcm.size * 1000 / RATE)]
        parts += [pcm, np.zeros(GAP, dtype=np.int16)]
        at += pcm.size + GAP
    if not spans:
        return slug, spans
    # 24 kb/s mono at 24 kHz: single words on a phone, where every page's file
    # is a download somebody pays for. Speech survives it; music would not.
    subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
            "-c:a", "libmp3lame", "-b:a", "24k", "-map_metadata", "-1",
            str(OUT_AUDIO / f"{slug}.mp3"),
        ],
        input=np.concatenate(parts).tobytes(),
        check=True,
    )
    return slug, spans


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cache", default=str(SITE / "node_modules/.cache/say-audio"))
    parser.add_argument("--kokoro-procs", type=int, default=4)
    parser.add_argument("--piper-procs", type=int, default=10)
    parser.add_argument("--cores", type=int, default=12)
    parser.add_argument("--only", help="comma-separated slugs, for a trial run")
    args = parser.parse_args()

    index = load_index()
    pages = say_words()
    if args.only:
        wanted = set(args.only.split(","))
        pages = [p for p in pages if p[1] in wanted]

    per_page = {}
    per_lang: dict[str, set] = {}
    for word, slug in pages:
        clips = [(code, term) for code, term, _rank, _gloss in index.get(word, []) if voice_for(code)]
        per_page[slug] = clips
        for code, term in clips:
            per_lang.setdefault(code, set()).add(term)

    def jobs(codes):
        # Chunks rather than whole languages, so eight processes share out a
        # language of eight hundred words instead of one of them taking it all.
        out = []
        for code in codes:
            words = sorted(per_lang[code])
            out += [(code, words[i : i + 120], args.cache) for i in range(0, len(words), 120)]
        return out

    kokoro = [c for c in per_lang if c in KOKORO_VOICE]
    piper = [c for c in per_lang if c not in KOKORO_VOICE]
    print(f"{sum(len(w) for w in per_lang.values())} words in {len(per_lang)} languages", flush=True)

    # Kokoro in a few processes because each one holds the 330 MB model; Piper
    # in more because its models are small and loaded per language.
    for label, codes, procs in (("kokoro", kokoro, args.kokoro_procs), ("piper", piper, args.piper_procs)):
        with Pool(procs, limit_threads, (max(1, args.cores // procs),)) as pool:
            for code, made, failed in pool.imap_unordered(synthesise, jobs(codes)):
                if made or failed:
                    print(f"{label} {code}: +{made}" + (f", {failed} failed" if failed else ""), flush=True)

    OUT_AUDIO.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(OUT_MANIFEST.read_text()) if args.only and OUT_MANIFEST.exists() else {}
    with Pool(args.piper_procs) as pool:
        for slug, spans in pool.imap_unordered(
            encode, [(slug, clips, args.cache) for slug, clips in per_page.items()]
        ):
            if spans:
                manifest[slug] = spans
    OUT_MANIFEST.write_text(
        json.dumps(dict(sorted(manifest.items())), ensure_ascii=False, separators=(",", ":")) + "\n"
    )
    print(f"{len(manifest)} pages written", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
