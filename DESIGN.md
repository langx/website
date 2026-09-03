---
name: LangX
description: The app on a wider screen, paced one idea per chapter — white ground, hairlines, one yellow action, blue for everything you can touch and for the chapter headings that speak.
colors:
  yellow-commit: '#ffc409'
  yellow-commit-pressed: '#e0ac08'
  ink-on-yellow: '#201900'
  interactive-blue: '#3b6cf6'
  interactive-blue-pressed: '#2f56c4'
  interactive-blue-tint: '#e9f0fe'
  correction-green: '#009f70'
  correction-green-tint: '#e2f6ee'
  error-red: '#e5484d'
  pro-violet: '#7a5af8'
  streak-orange: '#f79009'
  ground: '#ffffff'
  muted-fill: '#f4f5f7'
  hairline: '#e8eaec'
  ink: '#17191c'
  ink-shade: '#62676d'
  text-quiet: '#6b7075'
  text-tertiary: '#9aa1a7'
  ink-inverse: '#ffffff'
typography:
  display:
    fontFamily: "Nunito, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: 'clamp(2.125rem, 1.4rem + 3vw, 3.5rem)'
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: '-0.02em'
  display-hero:
    fontFamily: "Nunito, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: 'clamp(1.9rem, 1.3rem + 2.2vw, 2.75rem)'
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: '-0.02em'
  chapter:
    fontFamily: "Nunito, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: 'clamp(2rem, 1.4rem + 2.4vw, 3rem)'
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: '-0.02em'
  headline:
    fontFamily: "Nunito, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: 'clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem)'
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: '-0.015em'
  title:
    fontFamily: "Nunito, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: '1.375rem'
    fontWeight: 800
    lineHeight: 1.25
  title-small:
    fontFamily: "Nunito, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: '1.125rem'
    fontWeight: 800
    lineHeight: 1.3
  lede:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: '0.9375rem'
    fontWeight: 600
    lineHeight: 1.45
  meta:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: '0.8125rem'
    fontWeight: 400
    lineHeight: 1.4
  chip:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: '0.75rem'
    fontWeight: 700
    lineHeight: 1.3
  label-caps:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: '0.6875rem'
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: '0.04em'
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"
rounded:
  sm: '8px'
  md: '12px'
  lg: '16px'
  xl: '24px'
  bubble: '20px'
  phone: '36px'
  pill: '999px'
spacing:
  3xs: '4px'
  2xs: '8px'
  xs: '12px'
  sm: '16px'
  md: '24px'
  lg: '32px'
  xl: '48px'
  2xl: '72px'
  3xl: '104px'
components:
  button-primary:
    backgroundColor: '{colors.yellow-commit}'
    textColor: '{colors.ink-on-yellow}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    padding: '0 22px'
    height: '48px'
  button-primary-hover:
    backgroundColor: '{colors.yellow-commit-pressed}'
    textColor: '{colors.ink-on-yellow}'
  button-primary-lg:
    backgroundColor: '{colors.yellow-commit}'
    textColor: '{colors.ink-on-yellow}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: '0 28px'
    height: '54px'
    width: '330px'
  button-secondary:
    backgroundColor: '{colors.ground}'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    padding: '0 22px'
    height: '48px'
  button-secondary-hover:
    backgroundColor: '{colors.muted-fill}'
    textColor: '{colors.ink}'
  button-secondary-lg:
    backgroundColor: '{colors.ground}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: '0 28px'
    height: '54px'
    width: '330px'
  button-dark:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.ink-inverse}'
    rounded: '{rounded.pill}'
    padding: '0 16px'
    height: '40px'
  button-dark-hover:
    backgroundColor: '{colors.ink-shade}'
    textColor: '{colors.ink-inverse}'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.interactive-blue}'
    rounded: '{rounded.pill}'
    padding: '0 10px'
    height: '40px'
  button-ghost-hover:
    backgroundColor: '{colors.interactive-blue-tint}'
    textColor: '{colors.interactive-blue}'
  language-chip:
    backgroundColor: '{colors.ground}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: '9px 18px'
  tag-outline:
    backgroundColor: 'transparent'
    textColor: '{colors.ink-shade}'
    typography: '{typography.chip}'
    rounded: '{rounded.pill}'
    padding: '4px 10px'
  tag-solid:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.ink-inverse}'
    typography: '{typography.chip}'
    rounded: '{rounded.pill}'
    padding: '4px 10px'
  tag-accent:
    backgroundColor: '{colors.interactive-blue-tint}'
    textColor: '{colors.interactive-blue}'
    typography: '{typography.chip}'
    rounded: '{rounded.pill}'
    padding: '4px 10px'
  input-text:
    backgroundColor: '{colors.muted-fill}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    padding: '0 18px'
    height: '48px'
  input-text-focus:
    backgroundColor: '{colors.ground}'
    textColor: '{colors.ink}'
  nav-link:
    backgroundColor: 'transparent'
    textColor: '{colors.ink-shade}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    padding: '0 12px'
    height: '36px'
  nav-link-hover:
    backgroundColor: '{colors.muted-fill}'
    textColor: '{colors.ink}'
  icon-button:
    backgroundColor: '{colors.ground}'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    size: '40px'
  avatar:
    backgroundColor: '{colors.interactive-blue}'
    textColor: '{colors.ink-inverse}'
    rounded: '{rounded.pill}'
    size: '40px'
  segmented:
    backgroundColor: '{colors.muted-fill}'
    textColor: '{colors.ink-shade}'
    rounded: '{rounded.pill}'
    padding: '3px'
  phone-frame:
    backgroundColor: '{colors.ground}'
    textColor: '{colors.ink}'
    rounded: '{rounded.phone}'
    width: '390px'
    height: '844px'
  chat-bubble-them:
    backgroundColor: '{colors.muted-fill}'
    textColor: '{colors.ink}'
    rounded: '{rounded.bubble}'
    padding: '13px 16px'
  chat-bubble-me:
    backgroundColor: '{colors.interactive-blue-tint}'
    textColor: '{colors.ink}'
    rounded: '{rounded.bubble}'
    padding: '13px 16px'
  correction-card:
    backgroundColor: '{colors.correction-green-tint}'
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    padding: '15px 16px'
---

# Design System: LangX

## Overview

**Creative North Star: "The App on a Wider Screen"**

The marketing site is built from the same material as the LangX mobile app (v3 handoff): a white ground, hairline dividers, Nunito 800 for anything that speaks, the platform sans for everything that explains, and pill-shaped controls. It refuses the category "hero plus feature cards" page. Instead of describing the product it shows it: the app's screens are rebuilt as real HTML inside a 390px device frame and scaled with `--phone-zoom`, so the mechanism (matched both ways, correct each other) is demonstrated rather than claimed. Since the re-pace the homepage reads like Duolingo's: one idea per chapter, a big lowercase heading that ends in a full stop, a phone beside it, and a looping chat demo where a hero image would be. Token arithmetic no longer appears on the homepage.

Colour is doctrine, not decoration. Yellow is the one committing action and appears once per viewport, always paired with an outlined pill of the same width underneath it; blue is everything interactive and, since the re-pace, the voice of the chapter headings; green belongs to corrections alone; the streak orange lights star ratings. Everything else is ink on white, with two greys for reading and one hairline for structure. The site has no cards: content sits in rows separated by 1px lines, and the only objects allowed a shadow are the phone, the bottom sheet, the segmented-control thumb and the announcement dialog, all borrowed from the app.

Motion is short, eased-out, and answers the visitor: a press scales to 0.97, a panel opens in 200ms, a chapter reveals once when scrolled into view (text rises 12px, the phone slides 40px in from its own side), rows inside a screen land 60ms apart, and the hero chat replays its four-beat choreography every 8 seconds. Reduced motion keeps every end state and drops the movement. Light and dark are twins: the ground flips to `#1c1f24`, the hairline to `#2c3036`, blue lifts to `#7c9cf9`, and yellow does not change at all.

**Key Characteristics:**

- White (or `#1c1f24`) ground with 1px hairlines as the only structural device; no cards, no tiles, no panels.
- Nunito 800 display voice over the platform body stack; Nunito is never used for running text.
- Chapter headings: lowercase, ending in a full stop, `clamp(2rem, 1.4rem + 2.4vw, 3rem)`, blue when they sit beside a phone, ink when they sit above the yellow.
- One yellow committing action per viewport, stacked over an outlined pill of the same 330px width; the sticky header takes the yellow only when the page's own has scrolled away.
- Blue means interactive (links, active tab, focus ring, caret, ghost buttons) and speaks the chapters; green means correction; the two are never confused.
- Pills for every control: buttons, chips, inputs, nav links, icon buttons, segmented controls, language chips.
- Phones at 390px with 36px corners, real HTML screens with photo avatars, scaled per section (0.66 to 0.8).
- Flat surfaces; shadow reserved for the device, the sheet, the segmented thumb and the dialog.

## Colors

A single-accent palette on a white ground: yellow commits, blue interacts and speaks, green corrects, orange marks the streak and the stars, and four inks carry text; every value has a dark-theme twin except yellow and its text.

### Primary

- **Commit Yellow** (`yellow-commit`): the one committing action per viewport — "Start for free" in the hero and the final call, the send button inside the chat replica, the header CTA once the page's action has scrolled off. Identical in both themes. Text on it is always **Ink on Yellow** (`ink-on-yellow`), never white, in both themes. **Pressed Yellow** (`yellow-commit-pressed`) is the hover fill. Text selection is yellow at 40% alpha.

### Secondary

- **Interactive Blue** (`interactive-blue`; dark `#7c9cf9`): every interactive thing that is not the committing action — links, ghost buttons ("See the plans"), the active tab in the replica tab bar, level bars, the language pair line on a Discover row, the focus ring (2px, offset 2px), the text caret, the theme toggle's "auto" badge, hover colour on FAQ titles and footer links, the open FAQ chevron, the check marks in plan rows. It is also the colour of the chapter headings in Story and Anywhere: the one place blue is a voice rather than a control. **Blue Pressed** (`interactive-blue-pressed`; dark `#a8bffb`) is the link hover. **Blue Tint** (`interactive-blue-tint`; dark `#202b45`) is the ghost-button hover fill, the accent chip fill, and the visitor's own chat bubble.

### Tertiary

- **Correction Green** (`correction-green`; dark `#34c796`): corrections only — the correction card's "from" line and Save action, the online dot on an avatar, the success state of the newsletter form. **Correction Tint** (`correction-green-tint`; dark `#16332a`) is the correction card's fill.
- **Streak Orange** (`streak-orange`; dark `#ffa93d`): the five stars on each review and the streak flame inside the replicas. Shared with the app's tokens; never a control.
- **Error Red** (`error-red`; dark `#ef6b6f`): the unread badge in the replica tab bar and the newsletter form's error state.
- **Pro Violet** (`pro-violet`; dark `#9b83ff`): the PRO chip (text plus a 35%-alpha border) and one avatar tone. Shared with the app's plan tokens.

### Neutral

- **Ground** (`ground`; dark `#1c1f24`): page, surface, phone screen, header, sheet, the language chip fill, the marquee's edge fades. One ground; there is no separate card colour on the redesigned surfaces.
- **Muted Fill** (`muted-fill`; dark `#23272d`): the only tonal step above ground — input fields at rest, the received chat bubble, the segmented track, hover fill on nav links and outlined controls, the photo avatar's loading fill.
- **Hairline** (`hairline`; dark `#2c3036`): every divider, the phone's edge, outlined buttons and chips, the language chip's border, the marquee's top and bottom edges, the sheet grabber, empty level bars, scrollbar thumb.
- **Ink** (`ink`; dark `#f2f3f5`): headings, review quotes, footer links, the dark button fill, the solid chip fill, the final call's heading.
- **Ink Shade** (`ink-shade`; dark `#9aa1a9`): chapter prose, the hero's one line of explanation, the lede, nav links at rest, outlined chips, review sources, the plan tagline. The dark button's hover fill.
- **Text Quiet** (`text-quiet`; dark `#8b9199`): readable secondary text on the page outside the phone replicas — the uppercase English name under a language chip, the "182 languages" count, figure captions, footer group headings and copyright, FAQ chevrons at rest, list markers, input placeholders, form status, plan fine print.
- **Text Tertiary** (`text-tertiary`; dark `#70767e`): placeholders and meta _inside the phone replicas_ — timestamps, the day divider, the compose placeholder, inactive tabs, the balance label. It is the app's own value and is too faint for page copy.
- **Ink Inverse** (`ink-inverse`; dark `#17191c`): text on the dark button and solid chip; avatar initials are `#fefefe` on every tone.

### Named Rules

**The One Yellow Rule.** Yellow is the committing action and appears once per viewport. A section that carries it registers with `ownsPrimary`; while that action is on screen the header's button is ink, and it turns yellow the moment the last pixel leaves. The homepage carries it twice, in the hero and the final call, never both in one viewport. A second call to action beside the yellow is the outlined pill, never a second yellow.

**The Blue Means Interactive Rule.** If it can be tapped, focused or is currently selected, it is blue. Corrections are green, Copilot is blue, and a green thing is never a control. The one licensed exception is the chapter heading: a lowercase H2 in blue beside a phone is the product speaking, and it is the only non-interactive blue on the page.

**The Two Quiet Greys Rule.** Secondary text on the page uses `text-quiet`; `text-tertiary` stays inside the phone replicas. Do not lift the phone's placeholder grey onto page copy to make it "match the app".

**The Yellow Does Not Theme Rule.** Yellow and its `#201900` text are the same in light and dark. Everything else has a twin.

## Typography

**Display Font:** Nunito 800 (self-hosted, weights 700 and 800 only, subset by unicode-range), falling back to the platform stack
**Body Font:** the platform sans (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial)
**Label/Mono Font:** ui-monospace / SF Mono / Menlo / Consolas, for code only

**Character:** Rounded, heavy, friendly headings on a neutral, unbranded body. Nunito speaks (headings, button labels, names, native language names, balances); the platform face explains. Weight does the hierarchy work; size steps are few and tight, and the biggest voice on the homepage is not the H1 but the lowercase chapter heading.

### Hierarchy

- **Display** (Nunito 800, `clamp(2.125rem, 1.4rem + 3vw, 3.5rem)`, 1.08, -0.02em): the base H1, used by page headers on inner pages (max 20ch).
- **Display Hero** (Nunito 800, `clamp(1.9rem, 1.3rem + 2.2vw, 2.75rem)`, 1.15, -0.02em): the homepage H1 only; centred, balanced wrap, max 18ch, eleven words. It is set smaller than the base so the chapter headings below can be louder.
- **Chapter** (Nunito 800, `clamp(2rem, 1.4rem + 2.4vw, 3rem)`, 1.05, -0.02em): the homepage H2s — "find your match.", "correct each other.", "keep your streak.", "free. really.", "on your phone, in your browser.", "practice a language with LangX." Lowercase, ending in a full stop, blue beside a phone and ink above the yellow, max 16ch when centred.
- **Headline** (Nunito 800, `clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem)`, 1.15, -0.015em): the base H2 for list sections ("What people say", "Questions") and inner pages; plan names use 1.75rem, welcome-back headings 1.5rem.
- **Title** (Nunito 800, 1.375rem, 1.25): H3s such as the sheet title; the footer newsletter title is 1.25rem.
- **Title Small** (Nunito 800, 1.125rem, 1.3): H4-level titles — post titles, row titles.
- **Lede** (system, 1.125rem, 1.55, `ink-shade`, max 58ch): the section-opening paragraph. Chapter prose uses the same size at 1.6 line height, max 40ch.
- **Body** (system, 1rem, 1.55): running text; FAQ answers 1.6 and 68ch; review quotes 1.0625rem in ink.
- **Label** (system, 0.9375rem, 600, 1.45): nav links, footer links, review names (Nunito 800) and sources, the hero's fine print (400, 34ch), input text.
- **Meta** (system, 0.8125rem): footer group headings (700, 0.02em, `text-quiet`), copyright, form status. Figure captions are 13px; the marquee count is 0.875rem.
- **Chip** (system, 0.75rem, 700, 1.3): tags.
- **Label Caps** (system, 0.6875rem, 700, 0.04em, uppercase): the English name under a native name on a language chip, the uppercase tag variant, the "per day" qualifier on a plan row. Always `text-quiet`; a qualifier, never a kicker.
- **Numerals**: balances, counts and prices use `font-variant-numeric: tabular-nums` (`.tabular`) and are set in Nunito 800.

Inside the phone replicas type is set in px at the app's own sizes (16px body, 34px screen title, 17px names, 56px balance, 11–15px meta) so a screen here is the size of the screen in the app.

### Named Rules

**The Nunito Speaks Rule.** Nunito appears only where the interface speaks in its own voice: headings, button labels, names, native language names, the balance. Never body copy, never nav links, never inside an input.

**The Heavy-Only Rule.** Nunito ships in 700 and 800; there is no light or regular display weight to reach for.

**The Lowercase Chapter Rule.** A homepage H2 is a sentence fragment in lowercase ending with a full stop, one idea, no more than five words. Section headings on list surfaces (reviews, FAQ, inner pages) keep sentence case and the base headline size.

## Layout

One centred container, max 1080px, with 15px gutters on phones (0 at 320px), 20px from 768px, 30px from 901px. Breakpoints: 320 (iPhone SE), 767/768 (phone / tablet portrait), 900/901 (tablet landscape), 1200/1201 (desktop). The header is sticky at 64px, and `scroll-padding-top` is the header plus 16px.

The homepage is a sequence of full-width rows: Hero, LanguageMarquee, Story (four chapters), Anywhere, Testimonials, FAQ, FinalCta, then the Footer with the newsletter row. Sections are not boxed; each is separated by a hairline `border-top` or by its own vertical padding (`--space-3xl`, 104px; 72px on phones).

- **Hero** fills the first viewport (`100dvh - 64px`, capped at 900px): a `1fr / 1fr` grid with a 48px gap, 48px above and 72px below. The phone is on the left (`--phone-zoom` 0.78; 0.7 under 1100px; 0.72 on tablet; 0.66 on phones) and the copy is centred on the right with 32px between H1, button stack and fine print. On tablet and below the grid collapses to one column, the copy comes first and the phone follows.
- **Marquee** bleeds to the viewport edges (`margin: 0 calc(50% - 50vw)`), sits between two hairlines with 22px above and 18px below, and runs a 10px-gapped strip of chips 70s per loop with 10% ground-coloured fades at each edge.
- **Chapters** are `1fr / 1fr` grids with a 48px gap, 72px of vertical padding and a 560px minimum height; the phone alternates sides via `.flip` (text `order: 2`), the text column caps at 40ch with 16px between heading and prose. Phones scale 0.72 (0.7 tablet, 0.66 phone) and left-align under the copy when stacked. Chapter one links to `#how` for the header's "How it works".
- **Anywhere** and **FinalCta** are centred columns under a hairline with 104px of padding (72px on phones), 16px and 32px gaps respectively; their pills stack to 330px on phones.
- **Testimonials** and **FAQ** are list surfaces with 104px top padding: a two-column review grid with a 72px column gap collapsing at 900px, and a 76ch accordion.
- **Footer** carries the newsletter row first (a `1fr / 1fr` grid with a 32px gap, hairline below), then brand and four link groups (`1.2fr / 3fr`, collapsing at 1010px; groups two-up on phones), then the copyright row.

Lists are the design's grammar: a `border-top` on the list, a `border-bottom` on each row, 22px of vertical padding per row, no gap, no background. Spacing follows the nine-step scale (4 / 8 / 12 / 16 / 24 / 32 / 48 / 72 / 104); inside phones and small controls, px values from the app are used directly. On the plans page the phone is sticky at `header + 24px` at zoom 0.8.

## Elevation & Depth

Flat by default. Depth on the page comes from hairlines and the single muted fill, not from shadow: rows are divided, fields are tinted, nothing floats. Four shadows exist and each belongs to an object the app itself uses: the phone, the bottom sheet, the segmented-control thumb, and the announcement dialog. Dark theme deepens each rather than removing it.

### Shadow Vocabulary

- **Phone** (`box-shadow: 0 24px 60px -20px rgba(23, 25, 28, 0.25), 0 4px 10px rgba(0, 0, 0, 0.06)`; dark `0 24px 60px -20px rgba(0,0,0,0.7), 0 4px 10px rgba(0,0,0,0.4)`): the device frame only.
- **Sheet** (`box-shadow: 0 -8px 38px rgba(0, 0, 0, 0.14)`; dark `rgba(0,0,0,0.5)`): the mobile menu rising from the bottom, over a `rgba(13, 15, 18, 0.45)` backdrop.
- **Segment** (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08)`; dark `0.4`): the white thumb of the segmented control.
- **Card** (`box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06)`; dark `0.4`): the announcement dialog only; no page content uses it.

### Named Rules

**The Device-Only Shadow Rule.** A shadow marks a physical object from the app (phone, sheet, thumb, dialog). Content on the page never casts one; if a block needs separation it gets a hairline.

## Shapes

Two silhouettes: the pill and the device. Every control is a full pill (999px): buttons of 40/48/54px height, chips, the two-line language chip, inputs, nav links, 40px icon buttons, avatars, the segmented track and thumb, the unread badge, the grabber. Rectangular things use the app's radius scale — 16px for the correction card, 20px for chat bubbles (with the tail corner cut to 6px), 14px for post thumbnails, 8px as the focus-ring radius — and the phone is 36px. The bottom sheet rounds only its top corners at 28px. Borders are 1px hairlines; there are no 2px strokes and no dashed lines. Icons are one stroke at 2.5px with round caps and joins, 22px in the tab bar and 18–20px inline; the review star is a 16px filled glyph in streak orange.

## Components

### Buttons

Confident and tactile: a heavy Nunito label in a pill that shrinks under the finger.

- **Shape:** full pill (999px), 1px transparent border, `gap: 8px` for a leading icon.
- **Sizes:** sm 40px / 0 16px / 0.875rem; md 48px / 0 22px / 0.9375rem; lg 54px / 0 28px / 1rem. `block` stretches to the parent's width.
- **Primary:** yellow fill, `#201900` text; hover darkens to `yellow-commit-pressed`. One per viewport.
- **Secondary:** ground fill, ink text, hairline border; hover `muted-fill`. The companion under every yellow and the three store/browser pills in Anywhere.
- **Dark:** ink fill, inverse text; hover `ink-shade`. The header CTA (sm) while the page's yellow is visible, and the send button in the chat replica.
- **Ghost:** no chrome, blue text, 10px inline padding, 40px tall; hover `interactive-blue-tint`. Used for "See the plans" under the fourth chapter, pulled 10px left so the label aligns with the prose.
- **Hover / Press:** hover only under `(hover: hover) and (pointer: fine)`; `:active` scales to 0.97 over 160ms `ease-out`; colours transition in 200ms. Disabled is 50% opacity with no press. Reduced motion removes the scale.

### Stacked CTA Pair (signature)

The ask, twice on the page and identical both times: a yellow `primary` lg pill over a `secondary` lg pill, both `block`, in a column 330px wide with a 10px gap, wrapped in `ownsPrimary`. Labels are "Start for free" and "I already have an account"; in the hero one 0.9375rem `ink-shade` line of explanation sits under the pair, 34ch max.

### Language Chip (signature)

A two-line pill on the ground with a hairline border, 9px 18px padding and a 1px gap: the native name in Nunito 800 at 1rem over the English name in Label Caps `text-quiet`. Chips run in a 10px-gapped strip that scrolls 70s per loop, pauses when off-screen (`inview` with `once: false`) and on hover, and becomes a horizontally scrollable row with no fades under reduced motion. The list is rendered twice for a seamless loop; the copy is `aria-hidden`.

### Chips (Tag)

- **Style:** pill, 4px 10px, 0.75rem 700. `outline` = hairline border and `ink-shade` text (PRO tints text violet with a 35% violet border); `solid` = ink fill, inverse text (selected filter); `accent` = blue tint fill, blue text (a language).
- **Uppercase variant:** Label Caps at 3px 8px.

### Rows (the container that replaces cards)

- **Corner Style:** none.
- **Background:** none; the ground shows through.
- **Border:** `border-top` on the list, `border-bottom: 1px solid hairline` on each row; the plain `.rows` helper drops the last line.
- **Internal Padding:** 22px 0 (reviews, posts), 18px 0 (FAQ questions), 20px 0 (Discover rows), 17px 0 (sheet links), 11px 0 (plan points).

### Review Row

Five 16px streak-orange stars (2px gap) over a 1.0625rem ink quote, then the name in Nunito 800 and the store in `ink-shade` on one baseline; 10px between the three. The section opens with a headline and a lede that states the store ratings.

### Avatar

A 40px disc (any size; font is 34% of it, the online dot 21%, min 10px). With `src` it is a photo (`object-fit: cover`, lazy, `muted-fill` while loading); without one it is Nunito 800 initials on a solid tone: blue, green, violet, or ink. An online dot is green with a 2px ground ring.

### Inputs / Fields

- **Style:** 48px pill, `muted-fill` background, 1px transparent border, 0 18px padding, 0.9375rem ink text, `text-quiet` placeholder. The newsletter field is 30rem max with the button 8px to its right (stacked on phones).
- **Focus:** background lifts to ground, border becomes blue; no outer ring.
- **Status:** a 0.8125rem line below in `text-quiet`, turning green on success and red on error.

### Navigation

- **Header:** sticky, 64px, ground-coloured, a hairline appears at the bottom after 8px of scroll. Links (How it works, Plans, Blog, Docs) are 36px pills (0.9375rem 600, `ink-shade`; hover ink on `muted-fill`), hidden at 900px and below. Tools on the right: the GitHub star pill (hairline, 36px), the 40px theme toggle, and the sm CTA (dark while the page's yellow is on screen, yellow once it leaves; hidden on phones), then the 40px hairline menu button.
- **Bottom sheet (mobile menu):** the app's sheet — 38×4px grabber, 28px top corners, sheet shadow, 24px side padding plus safe-area bottom, rises over 360ms on the drawer curve `cubic-bezier(0.32, 0.72, 0, 1)` while the backdrop only fades in 200ms. Links are hairline rows (1.0625rem 600) with a quiet chevron or external icon; the yellow CTA sits full-width at the bottom.
- **Footer:** four groups under 0.8125rem `text-quiet` headings; links are 32px-tall 0.9375rem 600 ink, blue on hover.
- **Replica tab bar:** four tabs, 22px stroke icons, 11px 600 labels, `text-tertiary` at rest and blue when active; unread badge in error red.

### Chapter (signature)

One idea, one phone. A `1fr / 1fr` grid, 560px minimum, with a blue lowercase Chapter heading and 1.125rem `ink-shade` prose (40ch) on one side and a 390px phone at zoom 0.72 on the other; consecutive chapters flip sides. On `inview` (threshold 0.3, once) the text rises from 12px below over 500ms opacity / 600ms transform `ease-out`, and the phone slides in from 40px on its own side 80ms later; the screen inside then plays its own moment. Under reduced motion everything is simply present.

### Phone Frame (signature)

A 390px device with 36px corners, a hairline edge, the phone shadow and a 9:41 status bar, `user-select: none` because nothing inside is a control; `height="auto"` hugs short screens like the paywall. Screens are real HTML at the app's sizes: a 16px body, `muted-fill` received bubbles and blue-tint sent bubbles (20px radius, 6px tail), a green-tint correction card (16px radius), a pill compose field with a yellow send button, and photo avatars from `static/images/people/`. Each screen plays one authored moment on `inview` (threshold 0.35, once): the chat lands two messages, a typing state and the correction at 250 / 1100 / 1900 / 3100ms and, with `loop`, replays every 8 seconds; Discover and Feed rows rise from 10px over 400ms, 60ms apart. A 13px `text-quiet` caption under every phone says it is a demonstration.

### Segmented Control

The app's toggle: a `muted-fill` pill track with 3px padding and a ground-coloured thumb carrying the segment shadow that slides in 200ms `ease-out`; options are 14px 600 `ink-shade`, 700 ink when active.

### Theme Toggle

A 40px hairline pill; sun and moon crossfade with a 40° quarter-turn in 200ms; a 15px blue "A" badge at the corner marks the auto (system) choice.

### FAQ Accordion

Hairline rows in a 76ch column; the 1.0625rem 600 question turns blue on hover; the `text-quiet` chevron rotates 180° and turns blue when open; height animates through `grid-template-rows: 0fr → 1fr` in 200ms with the answer fading in 60ms later.

## Do's and Don'ts

### Do:

- **Do** put exactly one yellow action in each viewport and wrap it with `ownsPrimary` so the header steps back to ink while it is visible.
- **Do** stack the yellow over an outlined secondary pill of the same width (330px, 10px gap) whenever the page asks; the two labels are "Start for free" and "I already have an account".
- **Do** write homepage chapter headings in lowercase with a full stop, at the Chapter size, blue beside a phone and ink above the yellow.
- **Do** separate content with 1px hairlines (`border-top` on the list, `border-bottom` per row) and leave the ground showing through.
- **Do** make every control a pill: 40/48/54px buttons, 48px inputs, 36px nav links, 40px icon buttons, two-line language chips.
- **Do** set headings, button labels, names, native language names and balances in Nunito 800; keep body, labels and inputs on the platform stack.
- **Do** use `text-quiet` for secondary copy on the page and keep `text-tertiary` inside the phone replicas.
- **Do** show the product as a 390px `PhoneFrame` with real HTML and photo avatars, scaled with `--phone-zoom`, and let its one animation run on `inview`; only the hero chat loops.
- **Do** reveal a chapter once: text up 12px over 500/600ms `ease-out`, phone in from 40px on its own side 80ms later, rows inside 60ms apart.
- **Do** transition colour in 200ms, presses in 160ms `ease-out`, entrances in 320–400ms `ease-out`, sheets in 360ms on the drawer curve, and honour `prefers-reduced-motion` by keeping the end state (the marquee becomes a scrollable row).
- **Do** keep `#201900` on yellow in dark mode; only the surroundings change.

### Don't:

- **Don't** add cards, tiles, panels or filled boxes to page content; the phone, the sheet, the segmented thumb and the announcement dialog are the only objects with a shadow.
- **Don't** use blue for anything that is not interactive, except the lowercase chapter heading beside a phone; never use green for anything that is not a correction or success, or orange for anything but streaks and stars.
- **Don't** put a second yellow button in a viewport; the companion is the outlined pill, and the dark pill belongs to the header and the send button.
- **Don't** put token arithmetic, plan tables or feature lists on the homepage; the mechanism is shown in the phones and the plans live on `/pro`.
- **Don't** use Nunito for running text or in inputs, or reach for a Nunito weight lighter than 700.
- **Don't** use the browser's default focus ring; the ring is 2px blue with a 2px offset and 8px radius.
- **Don't** borrow the legacy orange (`--color--secondary`) or `#ffd400` on redesigned surfaces; they remain only so blog callouts keep a value.
- **Don't** rely on hover for feedback on touch devices; hover styles are gated behind `(hover: hover) and (pointer: fine)` and the press scale is the feedback.
- **Don't** let the marquee run when it is off-screen or under the pointer; it pauses in both cases.
