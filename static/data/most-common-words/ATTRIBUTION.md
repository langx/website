# Where these word lists come from

The `.tsv` files in this directory are a derived work. This file, and the
credit line on every page under `/tools/most-common-words/`, are a licence
condition rather than a courtesy — the same rule the app follows for GeoNames
in `langx/docs/data-sources.md`. The repository is public; do not remove them.

## Word frequencies

|              |                                                                    |
| ------------ | ------------------------------------------------------------------ |
| Source       | <https://github.com/hermitdave/FrequencyWords>, `content/2018`     |
| Derived from | the OpenSubtitles 2018 corpus                                      |
| Licence      | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)    |
| Downloaded   | 4 September 2026                                                   |

Ranking is the raw count of a word form in the corpus, after the filtering
described below.

## English meanings

|              |                                                                    |
| ------------ | ------------------------------------------------------------------ |
| Source       | <https://kaikki.org> (Wiktextract)                                 |
| Derived from | the English Wiktionary                                             |
| Licence      | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)    |
| Downloaded   | 4 September 2026                                                   |

## Example sentences

|              |                                                                    |
| ------------ | ------------------------------------------------------------------ |
| Source       | <https://tatoeba.org>, per-language exports                        |
| Licence      | [CC BY 2.0 FR](https://creativecommons.org/licenses/by/2.0/fr/)    |
| Downloaded   | 4 September 2026                                                   |
| Files        | `ex/*.tsv`                                                          |

Each sentence is written by a person and paired with an English translation
that is also theirs. Coverage of the first thousand words runs from 99% in the
larger languages down to 17% in Telugu; where there is no sentence the page
says so rather than inventing one.

## What this licence means here

The frequency and gloss sources are share-alike, so the word lists are **CC
BY-SA 4.0 as well**, and so is anything derived from them. Tatoeba's CC BY 2.0
FR asks only for attribution, which is why the sentences live in their own
`ex/` directory rather than inside the lists. That is narrower than the MIT licence the
rest of this repository carries: `LICENSE` in this directory governs the data,
`../../../LICENSE` governs the code. Redistributing these lists is fine, and
required to stay under the same terms with the same credit.

## How they were built

`scripts/wordlists/build.ts`, run by hand. In outline:

1. Take the frequency list for the language.
2. Drop anything holding a digit or a full stop, anything outside the
   language's own script, and a short list of subtitle furniture
   (`opensubtitles`, `dvdrip`, and so on).
3. Keep only words that have an entry in that language's Wiktionary. This is
   the filter that does the real work: a subtitle corpus is full of English
   ("ok", "show", "fan") and of character names ("john", "michael"), and no
   frequency or script rule separates those from real words in a Latin-script
   language. Having a dictionary entry does.
4. Attach the best English gloss for each word, resolving inflected forms back
   to their lemma.
5. Keep the top 10,000 that survive.

Step 5 is a ceiling, not a promise: several languages have fewer, and the pages
say the real number rather than claiming ten thousand.

## Refreshing them

Re-run `node scripts/wordlists/build.ts` from `website/`. Both sources are
updated periodically upstream; **check the licence at the version you actually
download** before committing a refresh, and update the dates above.
