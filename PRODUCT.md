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
privacy policy said there was none; both have been corrected. **This site has
analytics too**, since September 2026: the same PostHog, in cookieless mode, so
it writes nothing to the visitor's browser and there is still no cookie banner.
A "no trackers" line is false on both, but "nothing is stored on your device" is
true of the site. Any claim about
tracking on a new page has to be checked against
`langx/docs/store/privacy-data-safety.md`, which is written from the code. "Open source alternative to Tandem" is an existing,
published line.

## Operating Context

- The site is static (SvelteKit + adapter-static) on Cloudflare Pages, deployed
  from `main`. The one exception is `functions/relay/`, a Pages Function that
  forwards analytics to PostHog from our own domain so that blockers do not
  drop the page views; every other path is a file. It carries the blog (mdsvex), legal pages, plans, token page and
  a welcome-back page for v1 users.
- Plan limits, token rules and cosmetics are **mirrored by hand** from
  `langx/packages/shared` into `src/lib/data/*.ts`; every number on the site
  must come from those files.
- The community guidelines page is a word-for-word copy of
  `langx/docs/community-guidelines.md`, kept by hand in
  `src/lib/components/organisms/CommunityGuidelines.md`.
- The newsletter form posts to the frozen v1 API (`api.langx.io/api/mail`).

## Capabilities and Constraints

- Two plans: Free and Pro (`pro`). Pro replaced Fluent and Polyglot in
  September 2026. Prices are set per region and shown in the app; /plans
  prints the US prices from `src/lib/data/prices.ts` ($9.99 a month, $79.99 a
  year) and says the store shows the local one. Pro is monthly or yearly;
  only yearly starts with a free week (for someone who has not had Pro), and
  it works out to 3 months free.
- Free: 5 new conversations and 20 translations per rolling 24 h; replies and
  corrections unlimited; 1 learning + 1 native language; country/age/level
  filters. Every plan: 500 photo/video/voice messages a day (fair use), 10
  profile photos. Pro: unlimited new conversations, unlimited translations
  (fair use), gender/city filters, Nearby, Boosted, who viewed you, incognito,
  send in their language, phrase export, 5+5 languages, a larger Copilot
  allowance.
- LangX Copilot: an AI helper inside a chat with a real person, in the app
  (3.0) as a beta on Free and Pro, for every account with a verified email.
  Its answers carry the label "Copilot · Beta". Four helps, named as the app
  names them: Check my sentence, Say it in {language}, Explain, Reply ideas.
  Every plan has a daily allowance, Pro's is larger, and the app shows what is
  left; never print the numbers, never say "unlimited". Never present it as
  a Pro feature either ("part of Pro", "Pro only", "get it with Pro"): since
  26 October 2026 it is open to everybody, and Pro just gives more answers.
  The person you talk to sees none of its answers and nothing is sent unless
  you send it. Anthropic runs the model (name Anthropic, not a model); Explain
  and Reply ideas send the other person's words, after a consent sheet; it
  turns off in Settings and answers can be reported. Never "private", "only
  you see it", "rolling out" or "may not be on for your account". Echo,
  Translate and people's corrections are not Copilot. The full story is on
  copilot.langx.io and in privacy policy §2.6.
- LangX Token is an in-app point: cannot be bought, sold, traded, staked,
  withdrawn, transferred, is not on a blockchain, cannot unlock a paid plan.
  Never use "staking", "trading", "marketplace", "wallet address", "refer and
  earn", "payout".
- Badges are not in v2's first release. Voice and photo messages are shipped.
- Voice and video calls: live in the web app since 5 October 2026 and in the
  iPhone app since 2.9; not yet on Android (say "on iPhone and the web;
  Android soon").
  You can call someone once they have sent you 5 messages; free on every plan;
  Settings → Privacy → Allow calls turns them off both ways. Calls are relayed
  (no IP shared) and never recorded. They earn no tokens and no streak day.
- Minimum age 16 (18 until langx/langx#1109; the Terms and Privacy Policy say
  16). v1 users must sign up again; balances carry over ÷100 plus a 250-token
  welcome-back bonus.
- The app lists 183 languages (`languages.ts`).

## Brand Commitments

- Name: LangX. Wordmark and interlocking-hook mark (`src/lib/images/logo.svg`).
- The site follows the app's v3 design (see DESIGN.md): colour blocks in six
  partner hues with ink `#14161b` on them in both schemes, Nunito 900
  lower-case headings ending in a full stop, platform body stack, yellow
  `#ffc409` for the one committing action per viewport, blue `#3b6cf6` for
  the closing block and links, corrections green, pill controls, no shadows.
  The site may ship before app 3.0, so copy and phones show nothing that only
  3.0 has (no 3.0 tab names, partner streaks or automatic Echo cards).
- Dark theme via `[data-theme='dark']` and `auto`.

## Evidence on Hand

- Twelve real Google Play reviews (names, text and photos in
  `src/lib/data/reviews.ts`; the homepage shows the first six, /compare all).
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
