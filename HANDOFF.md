# Handoff: homepage redesign

Branch `claude/langx-mobile-app-design-xuoyk4`, one commit on top of `main`:
`c59267f`. Written to move this work onto a local machine. Delete this file
before merging — it is scaffolding, not documentation.

## The problem it fixes

Seven app screens already existed under `src/lib/components/phone/`
(Discover, Feed, Me, Chat, Tokens, Paywall, WelcomeBack, plus `PhoneFrame` and
`TabBar`, ~1,900 lines), along with `organisms/Story.svelte`, the four-chapter
section that shows three of them. **Nothing imported any of it.** The landing
page had drifted to a globe over two buttons, three feature rows and a grid of
tiles, so the site read as a template while the app's own visual language sat
unused in the repo.

## What the commit changes

### Documents

Three rules were removed from `DESIGN.md` at the owner's request, along with
every sentence that restated them:

| Removed                                                                  | Where it also lived                                                                                                                                                   |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "It refuses the category 'hero plus feature cards' page"                 | `narrative.overview`                                                                                                                                                  |
| The card / tile / panel / filled-box prohibition                         | `keyCharacteristics[0]`, the Don't list, "Sections are not boxed", "no separate card colour", "Rows (the container that replaces cards)", The Device-Only Shadow Rule |
| "Do show the product as a 390px `PhoneFrame` … only the hero chat loops" | the Do list                                                                                                                                                           |

The machine copy in `.impeccable/design.json` carries the same removals, and
the line in `PRODUCT.md` that repeated the ban ("plain lists with hairline
dividers instead of cards") is now just "hairline dividers, pill controls".

What survives describes the palette, type, shapes, motion and components
without forbidding a layout. The One Yellow Rule, the Chapter signature and the
hero's phone-left grid (`DESIGN.md`, Layout) are all still in force — the code
follows them.

### Page

`src/routes/(site)/+page.svelte` is now:

```
Hero              phone with the looping chat + stacked CTA pair
LanguageMarquee
Story             four chapters: Discover, Feed, Me, and the free list
ChatCard          what a still screen can't show: translation, voice, photo, streak
Anywhere          the globe, and the three places the app runs
Features          the six remaining lines
GuessTheLanguage  four rounds, then a bridge to /tools
PlanCards
Testimonials
FAQ
FinalCta
```

- `Hero.svelte` was rebuilt: `ChatScreen` with `loop` on the left, H1 + the
  330px stacked pair + one line of fine print on the right, collapsing to one
  column with the copy first.
- `Features.svelte` lost its three rows — the chapters make the same three
  points with the real screens — and keeps the six-item list.
- The globe was not deleted; it moved into `Anywhere.svelte`, which was itself
  unused until now.

### Two bugs the above depended on

1. `Header.svelte` hardcoded `variant="primary"`, so the header's yellow never
   stepped back while the page's own yellow was on screen. It now reads
   `primaryCtaInView`.
2. `stores/cta.ts` wrote a single boolean, so on a page with two registered
   CTAs the second observer to fire overwrote the first — and the homepage now
   asks twice (hero and `FinalCta`). It tracks a `Set` of on-screen nodes and
   publishes `size > 0`.

## Running it locally

```bash
npm install
npm run dev          # http://localhost:5173
npm run lint         # prettier --check + eslint
npm run check        # svelte-check
npm run build        # writes build/
```

Two things to expect, neither caused by this branch:

- `npm run check` reports one warning, `text-wrap` in `BlogPostCard.svelte`.
  Pre-existing.
- `npm run build` succeeds and writes `build/`, then **`postbuild` crashes** on
  Node 22: `optimize-images` runs `image-transmutation`, which loads the legacy
  `esm` package and throws at require time. The site is already on disk when
  this happens, so `npx vite preview` works. On an older Node, or by skipping
  postbuild, it goes away.

## Verified

prettier and eslint clean; `svelte-check` 0 errors; production build written;
homepage rendered in Chromium at 1440 and 430 wide, light and dark, with no
console or page errors; the guessing game played end to end; the header CTA
confirmed ink at the hero and yellow once it scrolls past.

## Still open

**Option C — the clickable prototype.** Everything is in place: `TabBar` takes
`active` and `unread`, and Discover / Feed / Me already render it, so wiring
tab switching plus one interaction in the chat is roughly half a day. It
changes a deliberate decision, though — `PhoneFrame.svelte` sets
`user-select: none` with the comment "The device is a replica, not a control
surface: nothing inside it is a real target", and `DESIGN.md`'s Phone Frame
entry says the same. Update both if you make the device interactive.

**Screens still dark:** `TokensScreen`, `PaywallScreen`, `WelcomeBackScreen`
and `organisms/OpenSource.svelte` are written and unused. `/pro` and
`/welcome-back` are the natural homes for the first three.

**Header CTA on phones.** `DESIGN.md`'s Navigation entry says the header's
small CTA is hidden on phones; it is currently visible. Not touched here.

**The design handoff zip.** `LangX mobile app design-handoff.zip` was never
readable from the remote session — it sits on a local machine, not in the repo.
If you want the real renders on the site, commit them under `static/` first.

## If you add rounds to the guessing game

`organisms/GuessTheLanguage.svelte` hardcodes four rounds. The words are real
rows of `static/data/most-common-words/games/languages.json`, and each was
chosen because it appears in **exactly one** of the site's word lists — several
common words (`ist`, and most short Chinese and Japanese entries) appear in
more than one, which would give a round two right answers. Keep that
constraint:

```python
import json, collections
pool = json.load(open('static/data/most-common-words/games/languages.json'))
counts = collections.Counter(w for w, code, rank in pool)
unique = [(w, c, r) for w, c, r in pool if counts[w] == 1 and r <= 40]
```

Language names for the options come from `WORD_LISTS` in
`src/lib/data/most-common-words.ts`, so a distractor's code has to exist there
(Thai, for one, does not).
