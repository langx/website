"""
The app's voices, run offline — what `build-say-audio.py` and
`build-word-audio.py` share.

Runs inside the image of `apps/tts` from the langx repo, unchanged: the same
Kokoro and Piper models, the same licence bar, the same first-choice voice per
language as `SPEECH_VOICES` in `packages/shared/src/speech.ts`. This imports
that service's loaders rather than talking to it over HTTP, so nothing here
depends on it being deployed and nothing is sent anywhere. Languages the
service does not read — Turkish, Arabic, Korean and the rest whose only voices
are non-commercial — get no button, for the reason the service gives: none is
better than a voice we are not allowed to use.

**Cached, so a rerun only reads what changed.** Each word is synthesised once
per language, trimmed, peak-normalised and kept as raw PCM under
`node_modules/.cache/tts-audio`, keyed by language and word — so a word both
scripts need is read once. A word the model could not read cleanly is not
cached, and a rerun tries it again. Delete the directory to hear a model change.
"""

import hashlib
import subprocess
import sys
from multiprocessing import Pool
from pathlib import Path

import numpy as np

sys.path.insert(0, "/app")
import server  # noqa: E402 — apps/tts/server.py, from the image

SITE = Path(__file__).resolve().parents[2]
CACHE = SITE / "node_modules/.cache/tts-audio"

RATE = 24000

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


def synthesise_all(per_lang: dict, cache: Path, kokoro_procs=4, piper_procs=10, cores=12) -> None:
    """Every (language, word) pair into the cache, in parallel."""

    def jobs(codes):
        # Chunks rather than whole languages, so ten processes share out a
        # language of five thousand words instead of one of them taking it all.
        out = []
        for code in codes:
            words = sorted(per_lang[code])
            out += [(code, words[i : i + 120], str(cache)) for i in range(0, len(words), 120)]
        return out

    kokoro = [c for c in per_lang if c in KOKORO_VOICE]
    piper = [c for c in per_lang if c not in KOKORO_VOICE]
    print(f"{sum(len(w) for w in per_lang.values())} words in {len(per_lang)} languages", flush=True)

    # Kokoro in a few processes because each one holds the 330 MB model; Piper
    # in more because its models are small and loaded per language.
    for label, codes, procs in (("kokoro", kokoro, kokoro_procs), ("piper", piper, piper_procs)):
        with Pool(procs, limit_threads, (max(1, cores // procs),)) as pool:
            for code, made, failed in pool.imap_unordered(synthesise, jobs(codes)):
                if made or failed:
                    print(f"{label} {code}: +{made}" + (f", {failed} failed" if failed else ""), flush=True)


def silence(samples: int) -> np.ndarray:
    return np.zeros(samples, dtype=np.int16)


def write_mp3(pcm: np.ndarray, path: Path) -> None:
    """24 kHz mono PCM to MP3 at 24 kb/s.

    Single words on a phone, where every file is a download somebody pays for.
    Speech survives the bitrate; music would not.
    """
    path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
            "-c:a", "libmp3lame", "-b:a", "24k", "-map_metadata", "-1",
            str(path),
        ],
        input=pcm.tobytes(),
        check=True,
    )
