---
slug: spaced-repetition-language-learning
title: 'Spaced Repetition for Language Learning: A Practical Guide'
date: 2026-09-23T01:00:00.000Z
excerpt: 'How spaced repetition works for language learning, Anki and its alternatives, what to put on your flashcards, and a simple daily routine you can keep up.'
coverImage: /images/posts/spaced-repetition-language-learning.png
thumbnail: /images/posts/spaced-repetition-language-learning-thumb.png
author:
  name: xuelink
  url: https://github.com/xuelink
tags:
  - Vocabulary
  - Language Learning
  - Guide
keywords:
  - spaced repetition language learning
  - spaced repetition
  - anki for language learning
  - anki alternatives
  - flashcards for language learning
  - spaced repetition system
  - forgetting curve
---

<script>
  import Callout from "$lib/components/molecules/Callout.svelte";
  import KeyTakeaways from "$lib/components/blog/KeyTakeaways.svelte";
  import Steps from "$lib/components/blog/Steps.svelte";
  import ProsCons from "$lib/components/blog/ProsCons.svelte";
  import AppDemo from "$lib/components/blog/AppDemo.svelte";
</script>

Spaced repetition is a way of reviewing flashcards at gradually longer
intervals, timed so you see each word just before you would forget it. For
language learners it is the most efficient way to keep thousands of words in
long-term memory: a free app such as Anki schedules the reviews for you, and
fifteen to twenty minutes a day is enough to add and keep new vocabulary
steadily.

This guide explains why it works, compares Anki with its main alternatives,
shows what belongs on a good card, and gives you a daily routine. It also covers
the part most flashcard guides skip: where the words should come from, and how
to use them once you have them.

<KeyTakeaways items={[
  "Spaced repetition schedules each review just before you would forget, so every review strengthens the memory.",
  "It builds on the Ebbinghaus forgetting curve, the spacing effect, and the benefit of testing yourself rather than rereading.",
  "Anki is the free, open source standard; Memrise, Clozemaster and Mochi are friendlier options with less control.",
  "Put frequent words, whole sentences, audio and words from your own conversations on cards.",
  "Do reviews first every day, cap new cards, and use the words in real conversation so they stick."
]} />

## How does spaced repetition work?

The science behind spaced repetition goes back to Hermann Ebbinghaus, who tested
his own memory of nonsense syllables and published the results in 1885. He
described what is now called the **forgetting curve**: memory drops quickly
after you learn something, then more slowly. He also found that relearning the
same material was faster each time, and that spreading repetitions out worked
better than cramming them together.

That second finding, the **spacing effect**, is one of the most replicated
results in memory research. A large review by Cepeda and colleagues (2006)
confirmed that spaced practice beats massed practice across many studies.
A second principle does the rest: the **testing effect**. Roediger and Karpicke
(2006) showed that trying to recall information strengthens memory more than
reading it again. A flashcard that makes you produce the answer before you see
it uses both.

Put together, the logic is simple:

1. You learn a new word and review it soon, before it fades.
2. Each time you recall it successfully, the next review is pushed further
   away, because the memory now lasts longer.
3. If you forget it, the interval shrinks again and the card comes back soon.

Over time, words you know well appear rarely and words you struggle with appear
often. That is why a few minutes a day can maintain a vocabulary of thousands of
words.

## From Pimsleur to Anki: spaced repetition systems explained

Several systems have put this into practice, each a little smarter than the one
before.

| System | Who and when | How it schedules |
|---|---|---|
| Graduated interval recall | Paul Pimsleur, "A Memory Schedule" (1967) | A fixed series of growing intervals, designed for audio courses |
| Leitner system | Sebastian Leitner, *So lernt man lernen* (1972) | Paper cards move up a series of boxes when you get them right, back to box one when you don't; each box is reviewed less often |
| SM-2 | Piotr Woźniak, for SuperMemo, late 1980s | Each card gets its own interval and "ease", adjusted by how well you remember it |
| FSRS | Free Spaced Repetition Scheduler, available in Anki since version 23.10 (2023) | A model of your memory, fitted to your own review history, predicts when you are likely to forget |

Pimsleur's schedule is a good illustration of the idea. The intervals in his
paper were 5 seconds, 25 seconds, 2 minutes, 10 minutes, 1 hour, 5 hours, 1 day,
5 days, 25 days, 4 months and 2 years, each roughly five times the last. The
Pimsleur audio courses are still built around recall at growing intervals.

Modern apps go further by giving every card its own schedule. According to
Anki's own FAQ, Anki offers an algorithm based on SM-2 and, since version 23.10,
FSRS as an alternative you can switch on in the deck options.

## Anki and its alternatives

At the time of writing (September 2026), these are the spaced repetition tools
most language learners choose between.

| Tool | What it is | Good for | Watch out for |
|---|---|---|---|
| [Anki](https://apps.ankiweb.net) | Open source flashcard app for desktop, Android (AnkiDroid) and iOS (AnkiMobile) | Full control, any language, audio and images, shared decks | Plain interface and a learning curve; the iOS app is paid, desktop and AnkiDroid are free |
| [Memrise](https://www.memrise.com) | Official courses built on native-speaker videos, with spaced review | Beginners who want ready-made content | Less control over what you review |
| [Clozemaster](https://www.clozemaster.com) | Fill-in-the-gap sentences with spaced review | Intermediate learners growing vocabulary in context | Sentences can be random; custom repetition settings are on its paid plan |
| [Mochi](https://mochi.cards) | Markdown notes and flashcards with spaced repetition | People who like writing their own notes | A general tool, not built for languages |
| [SuperMemo](https://www.supermemo.com/en) | The original spaced repetition software, now with language courses | Learners curious about the original | Less common among language learners today |
| Paper Leitner box | Index cards and a few boxes | Learners who want to stay off screens | No audio, manual scheduling |

<ProsCons
  name="Anki for language learning"
  pros={[
    "Free on desktop and Android, and open source",
    "Works for any language and any script",
    "Cards can hold audio, images and example sentences",
    "Choice of SM-2 based scheduling or FSRS"
  ]}
  cons={[
    "Takes some setup before it feels comfortable",
    "Easy to add too many cards and drown in reviews",
    "Shared decks are often full of words you don't need yet",
    "The iOS app is paid"
  ]}
/>

If you are unsure, start with Anki. Its defaults are fine, it will still be
there in ten years, and every other tool on this list can be replaced later
without losing the habit. For a comparison of Memrise with a conversation app,
see [LangX vs Memrise](/open-source-alternative-to-memrise).

## What should you put on your flashcards?

The app matters less than the cards. A bad deck reviewed perfectly still teaches
you the wrong things.

**Start with the most frequent words.** A small number of words make up most of
what you hear and read, so learning them first gives the fastest return. Our
free [most common words lists](/tools/most-common-words) give you up to 10,000
words per language in frequency order, with meanings, and you can download them
as a file that imports into Anki. Popular lists include
[Spanish](/tools/most-common-words/spanish),
[French](/tools/most-common-words/french),
[German](/tools/most-common-words/german),
[Korean](/tools/most-common-words/korean) and
[Chinese](/tools/most-common-words/chinese). How far to go is covered in [how
many words you need to be fluent](/how-many-words-do-you-need-to-be-fluent).

**Use sentences, not just single words.** A word on its own tells you its
meaning. A word in a sentence also tells you its grammar, its usual partners and
its tone. Put a short example sentence on every card, and consider cloze cards,
where one word in the sentence is blanked out.

**Add audio.** If you only ever see a word, you will not recognize it when you
hear it. Many decks include recordings; for single words, our [pronunciation
tool](/tools/say) lets you hear everyday words like [understand](/tools/say/understand)
said aloud.

**Make both directions, but not for everything.** Recognition cards (target
language to meaning) are easy. Production cards (meaning to target language)
are harder and better for speaking. Save production cards for words you want to
use.

**Add the words you actually needed.** The best cards come from your own
life: a word you looked up in a text, a phrase you couldn't find in a
conversation, a sentence a native speaker corrected. You already know why it
matters, so it sticks.

| Card type | Front | Back |
|---|---|---|
| Recognition | *Tengo que irme.* | I have to go. (audio) |
| Production | I have to go. | *Tengo que irme.* |
| Cloze | *Tengo que ___ .* (I have to go.) | *irme* |
| Correction | What you wrote: *Yo soy 25 años.* | Corrected: *Tengo 25 años.* (age uses tener) |

<Callout type="warning">
Don't put long word lists, full conjugation tables or grammar rules on single
cards. If a card needs more than a few seconds to answer, split it up.
</Callout>

## A daily spaced repetition routine

Consistency matters more than volume. Spaced repetition only works if you show
up when the reviews are due, which is why [consistent
practice](/why-consistent-practice-is-key-to-language-learning-success) is the
whole game here.

<Steps
  title="15 to 20 minutes a day"
  steps={[
    { title: "Do all due reviews first", text: "Before adding anything new. Reviews that pile up are the main reason people quit." },
    { title: "Say every answer out loud", text: "It turns a reading drill into a speaking drill and helps you remember the sound." },
    { title: "Add a small, fixed number of new cards", text: "Ten to twenty new cards a day is sustainable for most people. Fewer if reviews start taking too long." },
    { title: "Take new cards from your own week", text: "Words from what you read and heard, and corrections from your conversations, before generic lists." },
    { title: "Grade yourself honestly", text: "If you hesitated or half-remembered, mark it as hard or wrong. The schedule is only as good as your answers." },
    { title: "Use three of today's words", text: "Write them in a message or say them to a partner the same day." }
  ]}
/>

A useful rule: each new card creates a stream of future reviews, so your daily
review load grows with every card you add. If reviews regularly take more than
your planned time, stop adding new cards for a few days rather than skipping
reviews.

## Common spaced repetition mistakes

- **Downloading a giant shared deck.** You end up reviewing words you will never
  meet. Build your own, or trim a shared deck hard.
- **Skipping days.** Reviews don't disappear; they pile up. Short daily sessions
  beat long weekly ones.
- **Cards with no context.** "Bank" on a card is ambiguous. "I left my keys at
  the bank" is not.
- **Rereading instead of recalling.** Flipping the card before you have tried to
  answer throws away the testing effect.
- **Stopping at recognition.** Knowing a word when you see it is not the same as
  being able to say it. Use production cards and real conversation.

## Spaced repetition is half the job: use the words

Flashcards keep words from fading. They don't teach you how to use them in a
real exchange, at speed, with someone waiting for your answer. That needs input
and conversation. Our guides to [comprehensible input](/comprehensible-input)
and the [shadowing technique](/shadowing-technique-language-learning) cover the
other two pieces.

A conversation partner also feeds your deck. In LangX, you are matched with
people who speak the language you are learning and are learning yours. When your
partner corrects one of your messages (you hold a message to correct it, and
corrections are unlimited on every plan), you get a ready-made correction card:
what you wrote, and what a native speaker would say. On the Polyglot
[plan](/pro), you can export a conversation's saved phrases to a file that opens
in Anki.

<AppDemo
  screen="chat"
  title="Every correction is a flashcard waiting to happen"
  text="Your partner holds your message to correct it. Save the corrected sentence, review it with spaced repetition, and use it again in your next conversation."
/>

The loop is what makes it work: meet a word in conversation or reading, review
it until it sticks, then use it again with a real person. If you have learned a
language before and let it slip, the same loop helps you [get it
back](/stop-the-struggle-how-to-remember-your-foreign-languages-even-after-years).

## FAQ

### Does spaced repetition work for language learning?

Yes, for vocabulary and fixed phrases it is one of the most efficient methods
available, because it combines the spacing effect and the testing effect, both
well established in memory research. It is not a complete method on its own:
you still need listening, reading and speaking.

### Is Anki good for learning languages?

Anki is free on desktop and Android, open source, and works for any language,
which is why so many learners use it. The downside is setup: you need to choose
or make good cards and keep the number of new cards under control.

### How many new flashcards should I add per day?

Ten to twenty new cards a day is a common, sustainable range. The real limit is
review time: if daily reviews take longer than you can keep up with, add fewer.

### What is the difference between Anki's SM-2 and FSRS?

SM-2 adjusts each card's interval with a fixed formula based on how easily you
answer. FSRS, available in Anki since version 23.10, models your memory from
your own review history to predict when you are likely to forget. Both work;
FSRS is optional and switched on in the deck options.

### Is spaced repetition better than learning words in context?

They work best together. Learn words in context from reading, listening and
conversation, then use spaced repetition to keep the ones you want.
