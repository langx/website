# Writing for the langx.io blog

How the blog posts on this site are written: the facts they may state, how
they are structured for search, and the visual components every post uses.
Written while the September 2026 SEO work (PRs #178, #183, #186, #188) was
done; keep it current when the product or the components change.

Search data: the weekly Search Console report lands on the `seo-rankings`
branch (`latest.md`), from `.github/workflows/rankings.yml`. The queries it
always lists are in `scripts/gsc/tracked.json`.

## Content rules

The site is SvelteKit + mdsvex, static, deployed from `main` to langx.io.

### Read first (mandatory)

- `PRODUCT.md` — the product facts and the rules. (Where it disagrees with the privacy policy — it still says there is no session recording — `src/lib/components/organisms/PrivacyPolicy.svelte` is the newer source: the app records a masked wireframe on iOS/Android, off in Settings → Privacy → Share usage data.) Every claim about LangX must be true per this file.
- `src/lib/data/plans.ts`, `features.ts`, `token.ts` — exact plan names/limits. Plans are Free, Fluent, Polyglot. The site never prints prices.
- One existing post for voice: src/routes/(blog-article)/langx-v2-what-changes-and-why/+page.md

### Hard rules on truthfulness

- No user counts, no ratings, no press, no invented testimonials, no invented statistics or studies. If you cite a number about the world (e.g. vocabulary coverage research), only use well-known, verifiable figures and name the source in the text (e.g. "Nation (2006)"). When unsure, leave it out.
- LangX facts you may use: two-way matching (you see people who speak what you learn and learn what you speak); corrections on any message (hold it to correct — never write "tap"), unlimited on every plan; replies unlimited; built-in translation in chat (Free 20/day, Fluent 300/day, Polyglot 1000/day); Free = 5 new conversations/day; voice and photo messages; read-aloud; daily streaks; LangX Token is an in-app point (not money: cannot be bought, sold, traded, withdrawn; never say staking/trading/wallet/earn money/payout); leaderboards; open source (BSD-3) on GitHub https://github.com/langx/langx; iOS, Android, web (app.langx.io); no ads; 182 languages listed in the app; LangX Copilot (AI feedback) is NOT shipped yet — "coming later, Polyglot" if mentioned at all. Do not state a minimum age. Get the app link: https://get.langx.io
- Competitors (Tandem, HelloTalk, Speaky, ConversationExchange, italki, Busuu, Preply, Duolingo, Pimsleur, Babbel, Lingbe, Bilingua, Airlearn/etc): describe them fairly and only with facts you are confident of or verified via WebSearch/WebFetch today (load those tools with ToolSearch "select:WebSearch,WebFetch"). Never state their prices. Phrase as "at the time of writing (<month year>)". Do not disparage; give genuine pros and cons. It is fine and more credible to recommend a competitor for a use case where it is genuinely better.
- Ads, per app: `src/lib/data/competitors.ts` is the source of truth (the `ads` field and its doc comment list the sources, checked 23 September 2026). Posts must agree with it:
  - No ads at all: italki, Cambly, Preply, Babbel, Speak, Praktika.
  - Ads on the free plan that a paid plan removes: only Tandem, HelloTalk, Duolingo, Busuu, Memrise and Conversation Exchange.
  - Ads with no confirmed paid way out: Speaky and InterPals (no paid plan exists, so never write that paying removes their ads), Slowly and Lingbe (no primary source says Slowly Plus or Lingbe Pro removes ads, so don't claim it).
  - LangX has no ads on any plan.
  - An app you add to competitors.ts needs the `ads` field, from its Google Play "Contains ads" label and, for `free-plan`, the paid plan's own page.

### Writing for search AND for humans

- Answer the query in the first 2–3 sentences (featured-snippet style), then go deep. 1,500–2,800 words for cornerstone posts, 1,000–1,800 for others.
- Use H2/H3 headings that mirror how people search (questions work well). Use short paragraphs, lists and at least one markdown table where a comparison exists.
- End with a short "FAQ" H2 containing 3–5 H3 questions with concise answers.
- Natural, confident, useful. No fluff intros ("In today's fast-paced world…"). No emoji in headings. American English.
- Mention LangX where it genuinely fits, honestly, including its limits — never make the whole post an ad.

### Internal links (important — add 5–10 per post, natural anchors)

Existing pages you can link (paths, no trailing slash, relative like `/tools/say/hello`):

- `/` home, `/pro` plans, `/tokens`, `/blog`, `/tools` (hub of free tools)
- `/tools/most-common-words` and `/tools/most-common-words/<language>` (slugs in `src/lib/data/most-common-words.ts`)
- `/tools/say` and `/tools/say/<word>` (977 words; see src/lib/data/say-words.ts for slugs — only link slugs that exist)
- `/tools/vocabulary-test/<language>`, `/tools/alphabet/<language>`, `/tools/word-game`, `/tools/meaning-quiz`, `/tools/guess-the-language`, `/tools/similar` and `/tools/similar/<a>-and-<b>` (pairs in `src/lib/data/language-pairs.ts`)
- Existing posts: `/open-source-alternative-to-tandem`, `/10-reasons-why-language-exchange-will-revolutionize-your-learning-journey`, `/top-10-tips-for-learning-a-new-language-quickly`, `/how-to-stay-motivated-while-learning-a-new-language`, `/mastering-a-new-language-an-introverts-guide`, `/why-consistent-practice-is-key-to-language-learning-success`, `/stop-the-struggle-how-to-remember-your-foreign-languages-even-after-years`, `/langx-v2-what-changes-and-why`
- Every other post: list `src/routes/(blog-article)/`. Link only slugs that exist.
- External links (they auto-get target=\_blank): official sites of competitors when you mention them are fine and good for trust.
  Verify every internal link target exists.

### File format

Create `src/routes/(blog-article)/<slug>/+page.md`:

```
---
slug: <slug>
title: '<Title, ≤ 60 chars ideally, includes the main keyword, may include 2026>'
date: <ISO timestamp, not in the future>
excerpt: '<meta description 140–158 chars, includes keyword, makes people want to click>'
coverImage: /images/posts/<slug>.png
author:
  name: xuelink
  url: https://github.com/xuelink
tags:
  - <2–4 tags, reuse: Language Exchange, Language Learning, Tips, Comparison, Vocabulary, Guide>
keywords:
  - <4–8 search phrases>
---

<script>
  import Callout from "$lib/components/molecules/Callout.svelte";
</script>

...markdown body. Do NOT write an H1 (the layout renders the title as H1). Start with a paragraph.
```

Callout usage: `<Callout type="info">text</Callout>` (types: info, warning, success). Only import it if used.
Quote YAML strings containing colons with single quotes (escape ' as '').
mdsvex gotchas: curly braces `{` `}` in body text are parsed as Svelte expressions — avoid them or write `&#123;`/`&#125;`. Avoid raw `<` in text (write "less than"). Don't use HTML comments.
Cover: run `node scripts/og/posts.mjs <slug>` after writing; it draws the card and the list square and adds `thumbnail:`.

### Return

A short list: slug, title, excerpt, primary keyword, word count, and any claim you were unsure about.

### Comparison-page template (for any `open-source-alternative-to-<x>` page)

- Title pattern: 'Open Source Alternative to <X>: LangX vs <X> (2026)' (adjust if too long).
- Key phrases to use frequently but naturally — in the title, excerpt, first paragraph, several H2s, table caption and FAQ questions: "open source alternative to <X>", "<X> alternative", "LangX vs <X>", "apps like <X>", "free <X> alternative" (only where true).
- Structure: 2-sentence answer up top → "LangX vs <X> at a glance" markdown table (matching, corrections, translation, voice/calls, free plan in general terms, paid plan exists y/n, a "No ads" row with Yes or No first (LangX: Yes; the others as competitors.ts says), open source, platforms, community size) → what <X> does well (be generous and specific) → where LangX differs → who should pick which → "Other <X> alternatives" (3–5 short entries linking their own comparison pages where they exist) → FAQ (4–6 questions using the key phrases) → final line "More comparisons:" linking `/compare` and 3–4 sibling comparison pages and `/best-language-exchange-apps`.
- 1,300–2,000 words. Tags: include `Comparison` and `Open Source`.
- Verify everything about <X> via WebSearch/WebFetch (official site, app store pages, reputable reviews). If <X> has shut down or changed product focus, say so plainly and with a date — "alternative to <X>" searches from former users are exactly who the page is for.

### Visuals are required (added after the owner's feedback)

Every new post must include visuals from the start — read the visuals section below and use its components: a KeyTakeaways box after the intro, plus 2–4 of BarChart / Steps / VersusCard / ProsCons / StatRow / AppDemo / WordTiles where they fit. Numbers only from the post's own sourced text. Validate with a full build (see below). Do NOT add a `thumbnail:` line (generated later).

## Visual components

Every post carries visuals, so a skimming reader sees something every screen or so. Posts: `src/routes/(blog-article)/<slug>/+page.md`.

### Components (in `src/lib/components/blog/`) — read their source before using them

| Component      | What it is                                                          | Props                                                                                                                                  |
| -------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ | ---------------------- |
| `KeyTakeaways` | "In short" box                                                      | `items={["…","…"]}` (3–5 short lines), optional `title`                                                                                |
| `BarChart`     | horizontal single-series bar chart, value on each bar, table toggle | `title`, `data={[{ label, value, note?, highlight? }]}`, `unit`, `source`, optional `max`                                              |
| `Steps`        | numbered vertical path                                              | `steps={[{ title, text?, label? }]}`, optional `title` (label replaces the number, e.g. "Day 1")                                       |
| `VersusCard`   | two apps side by side                                               | `a={{ name, tagline?, points: [...], bestFor? }}`, `b={{…}}`, optional `title` (the card named exactly "LangX" gets the accent border) |
| `ProsCons`     | "good at" / "watch out for" lists                                   | `name`, `pros={[…]}`, `cons={[…]}`                                                                                                     |
| `StatRow`      | 2–4 headline numbers                                                | `stats={[{ value: "2,200", label: "class hours for Category IV" }]}`                                                                   |
| `AppDemo`      | the real LangX v2 app screen in a phone, with a caption             | `screen="chat"                                                                                                                         | "discover" | "feed" | "me"`, `title`, `text` |
| `WordTiles`    | one word in several languages as tiles                              | `words={[{ language: "Spanish", word: "libertad", code: "es" }]}`, `english`, `href`                                                   |

Existing: `Callout` (`$lib/components/molecules/Callout.svelte`).

### What to add (per post)

- ALWAYS: `KeyTakeaways` right after the opening paragraph(s) — 3–5 lines that summarise what the post actually says (no new claims).
- Then 2–4 more visuals where they genuinely help, e.g.:
  - comparison pages (`open-source-alternative-to-*`, `*-vs-*`, `is-*`): `VersusCard` near the top (LangX vs the app, points taken from the post's own table), `ProsCons` in the "what X does well" part, `AppDemo` (chat or discover) where LangX is described.
  - roundups / best-apps lists: `StatRow` or `VersusCard` for the top picks, `ProsCons` for 2–3 of the main apps, `AppDemo` in the LangX entry.
  - how-to guides and plans: `Steps` for any sequence, plan or checklist already in the text (you may convert a numbered list into `Steps` — then remove the duplicate list), `AppDemo` where practice with a partner is described.
  - word hubs: `WordTiles` for 3–5 of the sections, using EXACTLY the words already in that section's table (same language names; add ISO 639-1 `code`), and keep the table below or replace it — never add a word that isn't already in the post.
  - research/number posts: `BarChart` or `StatRow` ONLY with numbers already stated in the post, with the same source.
- Old 2024 posts (short, generic): KeyTakeaways + one or two of Steps / AppDemo. Do not change their claims; do not add product claims that contradict PRODUCT.md.
- Place visuals between paragraphs, never inside a list or table. Don't stack two visuals back to back.

### Hard rules

- NO invented numbers, features or quotes. Every value in a chart or stat must already be in the post (or in PRODUCT.md / src/lib/data/plans.ts for LangX facts). LangX facts: corrections by HOLDING a message (never "tap"), unlimited on every plan; Free = 5 new conversations/day, 20 translations/day; no live calls (voice, photo and video messages); no ads; open source BSD-3; iOS, Android, web; Copilot not shipped.
- AppDemo screens are demonstration replicas of v2. Never use images from static/images/features (v1).
- Syntax (mdsvex): add imports to the post's existing `<script>` block (create one after the front matter if none: `<script>` … `</script>`). Component props are JS: use double-quoted strings; escape any double quote inside with \"; apostrophes are fine inside double quotes. A component tag must contain NO blank lines. Put a blank line before and after each component. Don't use curly braces in plain markdown text.
- Leave front matter as it is when adding visuals to an existing post.

### Validate

Run `npm run check`, then a full `npx vite build`, and confirm each post's `build/<slug>.html` contains the components and no component markup leaked as text. Check every internal link resolves.

### Return

One line per post: slug — visuals added (e.g. "KeyTakeaways, VersusCard, ProsCons ×2, AppDemo chat").
