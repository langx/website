---
slug: get-rewarded-for-teaching-your-language
title: 'Get rewarded for teaching your language: how LangX scores a conversation'
seoTitle: 'Get rewarded for teaching your language: how it works'
date: 2026-09-23T09:00:00.000Z
excerpt: In a language exchange the valuable thing is helping someone else, so that is what LangX pays for. A correction is worth ten messages; here is the rest.
coverImage: /images/posts/get-rewarded-for-teaching-your-language.png
author:
  name: xuelink
  url: https://github.com/xuelink
tags:
  - LangX Token
  - Language Exchange
keywords:
  - language exchange app with rewards
  - get rewarded for teaching your language
  - earn points for language exchange
  - language exchange points
  - langx token
---

<script>
  import KeyTakeaways from "$lib/components/blog/KeyTakeaways.svelte";
  import AppDemo from "$lib/components/blog/AppDemo.svelte";
  import StatRow from "$lib/components/blog/StatRow.svelte";
</script>

Most apps that reward you for learning a language reward you for doing it on
your own: a lesson finished, a quiz passed, a streak kept. A language exchange
works differently. What makes it useful is the other person — somebody who
speaks the language you are learning, taking the time to help you with it,
while you do the same for them.

So that is what LangX rewards. You earn **LangX Tokens**, an in-app point, for
talking to people in the language you are learning and, above all, for helping
them with yours.

<KeyTakeaways items={[
  "LangX Tokens are an in-app point for talking in the language you learn and, above all, for helping others with yours.",
  "A message earns 1 token; correcting someone's sentence or answering a pronunciation request earns 10.",
  "Corrections have no daily cap. Messages pay up to 200 a day, at most 60 from any one person.",
  "Tokens buy a streak freeze, a filled-in day and cosmetics, never a paid feature.",
  "They are not a cryptocurrency: they cannot be bought, sold, traded or withdrawn."
]} />

## A correction is worth ten messages

| What you do                                                  | Tokens |
| ------------------------------------------------------------ | ------ |
| Send a message                                               | 1      |
| Correct someone else's sentence                              | 10     |
| Answer a pronunciation request with a recording              | 10     |
| Start a conversation where both of you have spoken           | 15     |
| Finish a review of ten Echo cards                            | 5      |

The gap between a message and a correction is deliberate. Sending a message is
the easy part of an exchange. Stopping to fix a stranger's sentence — and
explaining why — is the part that actually teaches somebody something, and it
is the harder thing to ask of anyone. A recording of how a word is said pays
the same as a written correction, because it is the same act in a different
medium.

Corrections have **no daily cap**. Teaching is the behaviour the app exists
for, so there is no point at which doing more of it stops counting.

<AppDemo
  screen="feed"
  title="Where the ten-token answers are"
  text="The Feed collects sentences and pronunciation requests from people learning your language. Correcting one, or answering with a recording, is worth ten messages."
/>

## The caps are there so grinding does not win

Messages are a different story. Up to **200 messages a day** pay, and at most
**60 from any one person** — so reaching the ceiling takes real conversations
with at least four people. Two accounts typing at each other all day stop
earning long before anyone who is actually practising would.

On top of that, a **daily pool of 5,000 tokens** is shared at the end of each
day among everyone who was active, in proportion to how active they were.
Nobody can take more than 5% of it. The score behind it counts new
conversations, corrections and the number of different people you talked to
more heavily than raw message volume: talking to four people beats sending four
times as many messages to one.

<StatRow stats={[
  { value: "200", label: "messages a day that pay" },
  { value: "60", label: "paid messages from any one person" },
  { value: "5,000", label: "tokens in the daily shared pool" },
  { value: "5%", label: "the most of the pool one person can take" }
]} />

Streaks pay too — a bonus at 7, 30, 100, 180, 365, 730 and 1,095 days, from 50
tokens at the first milestone to 25,000 at the last.

## What you can spend them on

The list is short on purpose:

- **A streak freeze** (200), so one bad day does not undo months of practice.
- **Filling in a missed day** (600), within the last two weeks, twice a month.
- **Frames and titles** for your profile, from 1,000 to 100,000.
- **Sticker packs** to send in a chat, from 1,000.

Tokens **cannot buy a paid feature**. If they could, farming tokens would
become a way around subscribing, and the subscription is what pays for the
app. Keeping them to cosmetics and the streak is what lets the app be generous
with them.

## What they are not

LangX Token is **not a cryptocurrency**. It is not on a blockchain, it cannot
be bought, sold, traded, sent to someone else or withdrawn, and it has no cash
value. An earlier version of LangX described something tradable; that was
never built and is not planned. If you had tokens in the old app, your balance
carried over, divided by 100 — [the reasoning is here](/welcome-back).

## Every number, in one place

These are the current values, and they are public: they live in the app's
open-source code, and they will be tuned as we learn how the economy behaves
with real activity. The full set — the pool formula, the hourly gift, invites —
is on [token.langx.io](https://token.langx.io), in the app's eight languages,
and in [every rule](/tokens) on this site.

The quickest way to see it work is to write to somebody and fix one of their
sentences. That is ten tokens, and somebody's language got a little better.
