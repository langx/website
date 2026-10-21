---
name: LangX
description: Colour blocks from the v3 app — one partner hue per chapter, ink on every block in both schemes, Nunito 900 lower-case headings that end in a full stop, one yellow action per viewport, no shadows.
colors:
  tangerine: '#ff9f52'
  tangerine-dark: '#f08a3c'
  lime: '#b8e15c'
  lime-dark: '#a2cf45'
  mint: '#5fdc98'
  mint-dark: '#45c883'
  aqua: '#48d3d0'
  aqua-dark: '#2fbfbc'
  sky: '#74b9ff'
  sky-dark: '#5aa5f5'
  lilac: '#bba4ff'
  lilac-dark: '#a68cf5'
  ink: '#14161b'
  on-ink: '#ffffff'
  yellow: '#ffc409'
  yellow-hover: '#e0ac08'
  on-yellow: '#14161b'
  blue: '#3b6cf6'
  on-blue: '#ffffff'
  link: '#2a54d0'
  link-dark: '#8aa6ff'
  correction-green: '#0b7a3e'
  correction-green-dark: '#5ee39a'
  online: '#12a26e'
  error: '#e5484d'
  ground: '#ffffff'
  ground-dark: '#0c0d10'
  surface: '#f2f2ee'
  surface-dark: '#1a1c21'
  line: '#e4e4df'
  line-dark: '#2a2d33'
  text: '#14161b'
  text-dark: '#f2f3f5'
  muted: '#5a5f69'
  muted-dark: '#a3a8b3'
  footer: '#14161b'
  footer-dark: '#000000'
typography:
  display-hero:
    fontFamily: "Nunito, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '96px (50px under 900px)'
    fontWeight: 900
    lineHeight: '92px (50px)'
    letterSpacing: '-0.025em'
  display-chapter:
    fontFamily: "Nunito, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '80px (44px under 900px)'
    fontWeight: 900
    lineHeight: '80px (45px)'
    letterSpacing: '-0.0225em'
  display-section:
    fontFamily: "Nunito, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '64px (38px under 900px)'
    fontWeight: 900
    lineHeight: '66px (40px)'
    letterSpacing: '-0.022em'
  label:
    fontFamily: "Nunito, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '17px'
    fontWeight: 900
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: '19px on a block, 16px elsewhere'
    fontWeight: 500
    lineHeight: 1.5
rounded:
  chip: '999px'
  pill: '999px'
  card: '24px'
  phone: '52px'
spacing:
  gutter-phone: '16px'
  column: '1080px'
  block-desktop: '96px'
  block-hero-desktop: '72px 96px'
components:
  button-primary:
    backgroundColor: '{colors.yellow}'
    textColor: '{colors.on-yellow}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    height: '56px'
  button-ink:
    backgroundColor: '{colors.ink} on a block; {colors.text} on the ground'
    textColor: '{colors.on-ink}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    height: '56px'
  button-arrow:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.on-ink}'
    rounded: '{rounded.pill}'
    height: '48px'
  tag-ink:
    backgroundColor: '{colors.ink}'
    textColor: 'the block hue'
    rounded: '{rounded.chip}'
    height: '28px'
  block:
    backgroundColor: 'one partner hue'
    textColor: '{colors.ink}'
    padding: '{spacing.block-desktop}'
---

# Design System: LangX

## Overview

**Creative North Star: "Colour blocks"**

langx.io is built from the same material as the LangX v3 app. A page is a
stack of full-width colour blocks, one idea per block, each on one of six
partner hues. Everything on a block is ink, `#14161b`, in light **and** dark:
only the hues deepen in dark mode, so contrast is measured once per hue and
holds in both schemes (`src/lib/scss/contrast.test.ts`). Between the blocks
the page shows its own ground, white or `#0c0d10`.

Headings are Nunito 900, lower case, and end in a full stop: "talk to people
who speak it." Body copy is the platform sans, short sentences, Duolingo
pacing. Controls are pills. There are no shadows anywhere: depth is colour.

The app is shown, not described. Each chapter carries a phone drawn in live
HTML (`components/phone/*`), 300–320px wide and never scaled, with UI text no
smaller than 12px.

## Colors

### The six partner hues

| Hue       | Light     | Dark      | Typical use      |
| --------- | --------- | --------- | ---------------- |
| tangerine | `#ff9f52` | `#f08a3c` | People           |
| lime      | `#b8e15c` | `#a2cf45` | Streaks, Tools   |
| mint      | `#5fdc98` | `#45c883` | Calls, 404       |
| aqua      | `#48d3d0` | `#2fbfbc` | Corrections, FAQ |
| sky       | `#74b9ff` | `#5aa5f5` | Echo             |
| lilac     | `#bba4ff` | `#a68cf5` | Hero, Download   |

A block is `data-hue="<hue>"` on any element (or the `Block` atom). It sets
the background, sets the text to ink, and leaves `--block` for children that
need the block's own colour (an ink chip's letters, an avatar ring).

### Yellow, blue, green

- **Yellow** `#ffc409`, text `#14161b`: the committing action. Once per
  viewport; the same in both schemes.
- **Blue** `#3b6cf6`, text white: the one closing block, and the focus ring
  (3px, 3px offset; white on the blue block). As text, links use `link`
  (`#2a54d0`, dark `#8aa6ff`) so they pass 4.5:1 on the ground. A link on a
  hue is ink and underlined.
- **Green** `#0b7a3e` (dark `#5ee39a`): corrections only.

### Ground and text

Ground `#ffffff` / `#0c0d10`; surface (cards, FAQ rows, chips) `#f2f2ee` /
`#1a1c21`; line `#e4e4df` / `#2a2d33`; text `#14161b` / `#f2f3f5`; muted text
`#5a5f69` / `#a3a8b3`. The footer is ink in light and black in dark.

### Named rules

**One yellow per viewport.** A section that carries the page's committing
action registers with `ownsPrimary` (`stores/cta.ts`). While it is on screen
the header's button is ink; when the last one scrolls away the header takes
the yellow.

**Ink never inverts on a block.** Only the hue changes between schemes.

**No shadows.** `--shadow-*` are `none` and stay that way.

## Typography

| Class              | Desktop | Under 900px | Use                          |
| ------------------ | ------- | ----------- | ---------------------------- |
| `.display-hero`    | 96 / 92 | 50 / 50     | The H1, the closing call     |
| `.display-chapter` | 80 / 80 | 44 / 45     | A chapter heading on a block |
| `.display-section` | 64 / 66 | 38 / 40     | A section on the ground      |

All Nunito 900, negative tracking, `text-wrap: balance`. Labels on buttons
and chips are Nunito 900 in sentence case. Body on a block is 19px/28px, 500.

## Layout

The content column is 1080px (180px either side at 1440). On a phone the
gutter is 16px and nothing scrolls sideways. A chapter is a two-column grid:
copy and a 320px phone, the phone alternating sides. On a phone the copy
comes first and the phone sits at real size under it, cut off by the next
block.

## Motion

- Press: scale 0.97 over 120ms. No ledge, no shadow.
- Chapter rise: tag, heading, text and link rise 12px, 80ms apart, once, when
  the chapter is half in view.
- Bubble build: bubbles 450ms apart, rising 12px. The hero loops every 8s; a
  chapter plays once.
- Nothing is hidden in the HTML. The script adds the start state only after
  it runs, so a page without JS (`csr = dev`) and a visitor with reduced
  motion both get the finished frame.

## Components

- **Button** (`atoms/Button.svelte`): `primary` (yellow), `ink` (the older
  `secondary` and `dark` draw it too), `arrow` (ink with a trailing arrow),
  `light` (white on blue), `outline`, `ghost`. Sizes 44 / 48 / 56px.
- **Tag** (`atoms/Tag.svelte`): `ink` is the chapter tag, an ink pill whose
  letters are the block's hue.
- **Block** (`atoms/Block.svelte`): a full-width hue with the 1080px column
  inside.
- **Header**: wears the first block's hue at the top of the page (a layout's
  page passes it as `hue` in its load data) and goes back to the ground once
  the page scrolls. Four links; on a phone they fold into a `<details>` menu
  that opens without script.
- **Footer**: brand, the two store pills, and the link groups that give every
  guide, tool and comparison a sitewide link.
- **Theme toggle**: a 48px ring in the colour of what it sits on. The theme
  store and the pre-paint script in `app.html` are unchanged.

## Do and don't

Do: one idea per block; ink on hues; a full stop at the end of a heading;
real copy that is true today.

Don't: shadows, gradients, a second yellow in view, blue text on a hue, token
arithmetic on the homepage, scaled-down phones, start states written into the
HTML.
