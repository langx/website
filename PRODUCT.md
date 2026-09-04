# Product

<!-- impeccable:product-schema 1 -->

_Written from repository evidence (`langx/docs/store/listing.md`,
`langx/docs/legal/promise-change.md`, `langx/docs/token-messaging-brief.md`,
`langx/packages/shared/src/limits.ts`) and the design handoff, in an unattended
session. Facts marked **inferred** were not confirmed by a person._

## Platform

web

## Users

- **Language learners looking for a real conversation partner**, on a phone,
  usually arriving from an app-store listing, a search for "language exchange
  app" or "open source alternative to Tandem", or a link shared in a language
  community. Their job on this site: understand what LangX is, believe it is
  worth installing, and get to the store or the web app.
- **Returning v1 users** who need to know what changed (sign up again, token
  balance divided by 100, some free things now paid).
- **Contributors and self-hosters** (secondary): looking for the source, the
  licence, Discord and the docs.

## Product Purpose

LangX matches you with people who speak the language you are learning and are
learning the language you speak, then gives the conversation the tools that
make it teach: corrections on any message, translation inside the chat, voice
and photo messages, a daily streak and an in-app token. The site exists to
replace langx.io and send visitors to the app (iOS, Android, web).

## Positioning

Matching runs in **both directions**, and **corrections are unlimited on every
plan** — the part that teaches is never rationed. The app and API are open
source (BSD-3) and self-hostable. No ads and no advertising identifiers. There **is** a
third-party analytics SDK — PostHog, on its EU cloud, screen names and a short
list of events keyed by the LangX user id, no session recording, off in
Settings → Privacy. It arrived after this file was written and after the
privacy policy said there was none; both have been corrected. Any claim about
tracking on a new page has to be checked against
`langx/docs/store/privacy-data-safety.md`, which is written from the code. "Open source alternative to Tandem" is an existing,
published line.

## Operating Context

- The site is static (SvelteKit + adapter-static) on Cloudflare Pages, deployed
  from `main`. It carries the blog (mdsvex), legal pages, plans, token page and
  a welcome-back page for v1 users.
- Plan limits, token rules and cosmetics are **mirrored by hand** from
  `langx/packages/shared` into `src/lib/data/*.ts`; every number on the site
  must come from those files.
- The newsletter form posts to the frozen v1 API (`api.langx.io/api/mail`).

## Capabilities and Constraints

- Three plans: Free, Fluent (`pro`), Polyglot (`pro_plus`). Prices are set per
  region and shown in the app; the site does not print prices.
- Free: 5 new conversations and 20 translations per rolling 24 h; replies and
  corrections unlimited; 1 learning + 1 native language; country/age/level
  filters. Fluent: unlimited new conversations, 300 translations, gender/city
  filters, 2+2 languages. Polyglot: who viewed you, incognito, Nearby, 1000
  translations, 5+5 languages, LangX Copilot (not yet shipped).
- LangX Token is an in-app point: cannot be bought, sold, traded, staked,
  withdrawn, transferred, is not on a blockchain, cannot unlock a paid plan.
  Never use "staking", "trading", "marketplace", "wallet address", "refer and
  earn", "payout".
- Badges are not in v2's first release. Voice and photo messages are shipped.
- Minimum age 18. v1 users must sign up again; balances carry over ÷100 plus a
  250-token welcome-back bonus.
- The app lists 182 languages (`languages.ts`).

## Brand Commitments

- Name: LangX. Wordmark and interlocking-hook mark (`src/lib/images/logo.svg`).
- The v3 mobile design handoff (Claude Design, 30 Aug 2026) is **binding** for
  the site's visual language: Nunito 800 display, platform body stack, white
  ground, yellow `#ffc409` reserved for the one committing action per screen,
  blue `#3b6cf6` for everything interactive, corrections green, Copilot blue,
  plain lists with hairline dividers instead of cards, pill controls.
- Dark theme via `[data-theme='dark']` and `auto`.

## Evidence on Hand

- Seven real Google Play reviews (names and text in `Testimonials.svelte`).
- 18 blog posts under `src/routes/(blog-article)/`.
- Store links: App Store id6474187141, Google Play
  `tech.newchapter.languageXchange`, web app `app.langx.io`.
- **No** user counts, no press, no benchmarks — do not invent them. The
  screenshots in `static/images/features/` are v1's UI and must not be shown as
  v2.

## Product Principles

1. Every claim on the site is true of the shipping app today; "coming soon" is
   said out loud.
2. Teaching is the product: corrections and replies stay unlimited and the site
   says so in the same breath as any limit.
3. The token is a point, not money. Describe it plainly, never aspirationally.
4. The site speaks the app's own visual language; a screen on the site should
   look like the screen in the app.
5. Returning users hear the hard parts from us first.

## Accessibility & Inclusion

Contrast at WCAG AA in both themes; keyboard-reachable navigation and
accordion; `prefers-reduced-motion` respected for every choreographed motion.
