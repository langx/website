"""
Reads the top of every word list aloud, for the play buttons on every tool
that shows a word: the lists themselves, their search, the quiz, the
vocabulary test, the games once they are answered, the similar-word pages.

    docker build -t langx-tts:local ../langx/apps/tts      # the app's voice service
    docker run --rm -v "$PWD:/site" -w /app langx-tts:local \\
        python /site/scripts/wordlists/build-word-audio.py

The voices, the cache and the quality checks are `tts_voices.py`.

**Keyed by language and rank.** Every tool that shows a word got it from
`static/data/most-common-words/<slug>.tsv`, and every one of them still knows
its rank there, so (code, rank) is the address of a reading everywhere on the
site — one store serves all of them, and a word the quiz and the list both
show is downloaded once.

**Fifty words to a file.** A hundred and thirty thousand single files would be
six times what Cloudflare Pages takes for a whole deployment. So ranks are
grouped fifty at a time, laid end to end with a gap between them, and a JSON
file beside each MP3 says where every rank starts and how long it lasts. The
first press on a word fetches its group of fifty — a hundred-odd kilobytes —
and the words around it in a list are then already there.

**Not in git.** Three hundred megabytes of audio would be most of the
repository's size after one run, and more after every rerun. The output goes
to `static/audio/w/`, which git ignores; `scripts/wordlists/word-audio.sh`
packs it and uploads it as a GitHub release asset, and the deploy workflow
unpacks that release into the same place before it builds.

Output, under static/audio/w/<code>/:
    index.json      {"chunk": 50, "n": 5000, "missing": [rank, ...]}
    <k>.mp3         ranks 50k+1 .. 50k+50, end to end
    <k>.json        [[startMs, durationMs] | 0, ...], one per rank
"""

import argparse
import json
import re
import sys
from multiprocessing import Pool
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tts_voices import CACHE, RATE, SITE, cache_path, silence, synthesise_all, voice_for, write_mp3  # noqa: E402

LISTS = SITE / "static/data/most-common-words"
OUT = SITE / "static/audio/w"

# How far down each list the readings go. The search index stops at the same
# depth (`wordDepth` in idx/stats.json), and past it a list is mostly words
# nobody looks up. Keep it in step with `WORD_AUDIO_DEPTH` in wordAudio.ts.
DEPTH = 5000
CHUNK = 50

# Tighter than the say pages' 200 ms: measured there, every word starts within
# 30 ms of its offset, and a group of fifty pays for its gaps fifty times.
GAP = int(RATE * 0.12)


def word_lists() -> list[tuple[str, str]]:
    """(code, slug) for every list, from the generated TypeScript manifest."""
    source = (SITE / "src/lib/data/most-common-words.ts").read_text(encoding="utf8")
    return re.findall(r"\{ code: '([^']+)', slug: '([^']+)'", source)


def ranked(slug: str) -> list[str]:
    """The list's words in rank order, down to DEPTH."""
    lines = (LISTS / f"{slug}.tsv").read_text(encoding="utf8").splitlines()[1:]
    words = []
    for line in lines[:DEPTH]:
        rank, word, _english = line.split("\t", 2)
        assert int(rank) == len(words) + 1, f"{slug}: rank {rank} out of order"
        words.append(word)
    return words


def encode(job) -> tuple[str, int, list[int]]:
    """One group of fifty into an MP3 and its offsets. Returns the ranks missing."""
    code, k, words, cache = job
    parts = [silence(GAP)]
    at = GAP
    spans: list = []
    missing = []
    for i, word in enumerate(words):
        path = cache_path(Path(cache), code, word)
        if not path.exists():
            spans.append(0)
            missing.append(k * CHUNK + i + 1)
            continue
        pcm = np.frombuffer(path.read_bytes(), dtype=np.int16)
        spans.append([round(at * 1000 / RATE), round(pcm.size * 1000 / RATE)])
        parts += [pcm, silence(GAP)]
        at += pcm.size + GAP
    if len(missing) < len(words):
        write_mp3(np.concatenate(parts), OUT / code / f"{k}.mp3")
        (OUT / code / f"{k}.json").write_text(json.dumps(spans, separators=(",", ":")))
    return code, k, missing


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cache", default=str(CACHE))
    parser.add_argument("--kokoro-procs", type=int, default=4)
    parser.add_argument("--piper-procs", type=int, default=10)
    parser.add_argument("--cores", type=int, default=12)
    parser.add_argument("--only", help="comma-separated language codes, for a trial run")
    parser.add_argument("--encode-only", action="store_true", help="skip synthesis; pack what is cached")
    args = parser.parse_args()

    lists = {code: ranked(slug) for code, slug in word_lists() if voice_for(code)}
    if args.only:
        lists = {c: w for c, w in lists.items() if c in args.only.split(",")}

    if not args.encode_only:
        synthesise_all(
            {code: set(words) for code, words in lists.items()},
            Path(args.cache),
            args.kokoro_procs,
            args.piper_procs,
            args.cores,
        )

    jobs = [
        (code, k, words[k * CHUNK : (k + 1) * CHUNK], args.cache)
        for code, words in lists.items()
        for k in range((len(words) + CHUNK - 1) // CHUNK)
    ]
    missing: dict[str, list[int]] = {code: [] for code in lists}
    with Pool(args.piper_procs) as pool:
        for code, _k, gone in pool.imap_unordered(encode, jobs):
            missing[code] += gone
    for code, words in lists.items():
        index = {"chunk": CHUNK, "n": len(words), "missing": sorted(missing[code])}
        (OUT / code).mkdir(parents=True, exist_ok=True)
        (OUT / code / "index.json").write_text(json.dumps(index, separators=(",", ":")))
        print(f"{code}: {len(words) - len(missing[code])}/{len(words)}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
