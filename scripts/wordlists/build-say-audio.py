"""
Reads every word on the /tools/say pages aloud, one audio file per page.

    docker build -t langx-tts:local ../langx/apps/tts      # the app's voice service
    docker run --rm -v "$PWD:/site" -w /app langx-tts:local \
        python /site/scripts/wordlists/build-say-audio.py

The voices, the cache and the quality checks are `tts_voices.py`.

**One file per page, not one per word.** There are about twenty thousand
distinct words across the pages and Cloudflare Pages takes twenty thousand
files per deployment, for the whole site. So each page gets a single MP3 with
its words laid end to end and a gap between them, and `say-audio.json` records
where each language's word starts and how long it lasts. The page fetches its
file on the first press and plays slices of it with Web Audio.

Output:
    static/audio/say/<slug>.mp3
    src/lib/data/say-audio.json     {slug: {code: [startMs, durationMs]}}
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

IDX = SITE / "static/data/most-common-words/idx/e"
OUT_AUDIO = SITE / "static/audio/say"
OUT_MANIFEST = SITE / "src/lib/data/say-audio.json"

# Silence either side of a word inside the file. Wide enough that a slice
# started a few milliseconds early or late — MP3 decoders do not agree on the
# encoder's priming delay — still lands in silence, not in the next word.
GAP = int(RATE * 0.2)


def say_words() -> list[tuple[str, str]]:
    source = (SITE / "src/lib/data/say-words.ts").read_text(encoding="utf8")
    return re.findall(r"\{ word: '([^']+)', slug: '([^']+)'", source)


def load_index() -> dict:
    rows = {}
    for shard in IDX.glob("*.json"):
        rows.update(json.loads(shard.read_text(encoding="utf8")))
    return rows


def encode(job) -> tuple[str, dict]:
    """One page's words laid end to end, as an MP3, and where each one sits."""
    slug, clips, cache = job
    parts = [silence(GAP)]
    at = GAP
    spans = {}
    for code, word in clips:
        path = cache_path(Path(cache), code, word)
        if not path.exists():
            continue
        pcm = np.frombuffer(path.read_bytes(), dtype=np.int16)
        spans[code] = [round(at * 1000 / RATE), round(pcm.size * 1000 / RATE)]
        parts += [pcm, silence(GAP)]
        at += pcm.size + GAP
    if spans:
        write_mp3(np.concatenate(parts), OUT_AUDIO / f"{slug}.mp3")
    return slug, spans


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cache", default=str(CACHE))
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
        # Rows are [code, word, rank, gloss, ...] — the IPA came in as a fifth
        # column, and anything after the word is none of this script's business.
        clips = [(row[0], row[1]) for row in index.get(word, []) if voice_for(row[0])]
        per_page[slug] = clips
        for code, term in clips:
            per_lang.setdefault(code, set()).add(term)

    synthesise_all(per_lang, Path(args.cache), args.kokoro_procs, args.piper_procs, args.cores)

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
