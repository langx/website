---
slug: langx-v2-what-changes-and-why
title: 'LangX v2: what changes, and why'
date: 2026-08-27T09:00:00.000Z
excerpt: v2 is a ground-up rebuild. It also breaks two promises v1 made in public, and we would rather explain that here than let you find it in a Terms diff.
coverImage: /images/posts/Promo.png
author:
  name: xuelink
  url: https://github.com/xuelink
tags:
  - LangX v2
  - Announcement
  - Open Source
keywords:
  - langx v2
  - language exchange app
  - langx pro
  - langx token
---

<script>
  import Callout from "$lib/components/molecules/Callout.svelte";
</script>

LangX v2 is a rebuild rather than an update: a new app, a new API, and a new
database underneath the same two store listings. Most of this post is not about
the rebuild. It is about the two things v1 promised in public that v2 does not
keep, because those are the parts you deserve to hear from us rather than
discover.

## First, what is actually new

Matching now runs in **both directions**. You only see people who speak the
language you are learning *and* are learning the language you speak, so every
conversation has something in it for both of you rather than one person doing a
favour.

You can **correct any message** by tapping it, and translation is built into the
chat so you never leave the conversation to look something up. There are daily
streaks, LangX Tokens for talking and teaching, and weekly, monthly, yearly and
all-time leaderboards.

## The first broken promise: LangX is no longer free of charge

v1 said LangX was free with no in-app purchases. v2 introduces two paid
subscriptions, **Fluent** and **Polyglot**, and three things that used to be
free are part of them:

- Filtering discovery by gender and city — country, age and level stay free
- Seeing **who** viewed your profile — the count stays free
- Browsing without leaving a trace

There are also two new limits on the free plan: **5 new conversations you
start** and **20 translations**, each per rolling 24 hours.

<Callout type="info">
Replying to every message you receive is unlimited, and so is writing
corrections, on every plan. The free plan limits how many conversations you can
<em>open</em>, never how much you can talk.
</Callout>

Corrections being unlimited is not an oversight we will quietly close later.
Rate-limiting the free side of a language exchange would shrink what a paying
user *receives* just as much as what a free user gives — the person correcting
your sentences is usually someone on the free plan.

The honest reason for the paywall is that the app costs money to run and had no
revenue. We would rather charge for filters than sell your attention: there are
no ads, no advertising identifiers, and no third-party analytics SDK. The code
stays open source under BSD-3, and you can host your own instance.

The full comparison is on the [plans page](/pro).

## The second: LangX Token is not what the litepaper described

v1 shipped a token with wallets, a token leaderboard, and a litepaper
describing something tradable, staked and eventually listed on an exchange.

**The name stays. The trading does not.**

LangX Token in v2 is an in-app point. You earn it by practising and by teaching
— correcting someone else's sentence is worth five times sending a message —
and you spend it on a streak freeze or on cosmetic frames and titles. That is
the complete list of things to spend it on, and it is complete on purpose: if
tokens could buy a Pro feature, farming tokens would become a substitute for
subscribing.

It cannot be bought, sold, traded, staked, transferred or withdrawn, and it is
not on a blockchain. **The on-chain design in the old litepaper is not being
built.** If that is ever revisited it will be a new document after legal
review, not a continuation of the old one.

<Callout type="warning">
Your v1 balance carries over, <strong>divided by 100</strong>. Nothing in v1 was
ever bought or sold — what looked like a purchase log was a daily payout
calculation — so every balance was earned and there is no reason not to honour
it. But the two economies were never on the same scale: v1 balances run to 2.28
million while a very active day in v2 is around 700 tokens. Credited
one-for-one, the largest v1 balance would sit roughly nine years ahead of anyone
new and the all-time table would never move again. Divided, it starts about 32
days ahead — a real head start that someone can actually close.
</Callout>

## If you used LangX before

Your username is reserved for you and your streak is frozen rather than reset.
You do have to **sign up again with the same email address**: the old password
hashes could not be migrated. There is a welcome-back bonus when your profile is
restored.

Everything about coming back is on the [welcome back page](/welcome-back).

## What is missing in the first release

Badges are not in v2's first release and are planned to return. LangX Copilot,
the private in-chat feedback feature, is a later release too. We would rather
list the gaps than let the site advertise something the app does not do — which,
for what it is worth, is the same reason this post exists.
