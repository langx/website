---
version: 1
slug: 'src-routes-site-page-svelte'
primary_target: 'src/routes/(site)/+page.svelte'
related_targets:
  ['src/lib/components/organisms/Hero.svelte', 'src/lib/components/organisms/Header.svelte']
---

# Surface: langx.io homepage (and the shell every page shares)

Mode: Persuade. Visitor: a language learner on a phone deciding whether to install LangX; second audience returning v1 users and contributors. Job: understand the mechanism in one viewport, believe it, tap Start for free / a store link.

Proof on hand: the app itself, rebuilt as live HTML screens from the v3 mobile handoff; six real Play Store reviews; the shared limits/token data files. Constraints: no invented numbers, prices only in the app, token described as a point.

## Direction contract

THESIS: The site is the app on a wider screen, paced like Duolingo's homepage: one idea per chapter, big lowercase headings, a looping demo instead of a hero image, and no token arithmetic. It refuses the category hero-plus-feature-cards page and shows the product's screens as real, sized HTML.

OWN-WORLD: White ground, hairline #e8eaec dividers, Nunito 800 display over the platform sans, pill controls, one yellow #ffc409 committing action per viewport, blue #3b6cf6 for everything interactive, green for corrections. Phones at 390px with 36px corners; no cards.

STORY: "People learning my language teach me; I teach them." → four chapters (match, correct, streak, free) → "it's on my phone and in my browser" → tap Start for free.

FIRST VIEWPORT: Left, a 390px phone (scaled 0.78) looping the chat: two messages, typing, a correction card, again every eight seconds. Right, a centred H1 of eleven words and two stacked 330px pills, yellow Start for free over an outlined I already have an account, with one line of explanation under them. Below, an endless strip of language chips.

FORM: Pinned by the brief (design handoff); no roll — the handoff's world beats the seed. Signature interaction: the header CTA is ink while the page's yellow action is on screen and turns yellow the moment it scrolls away.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
