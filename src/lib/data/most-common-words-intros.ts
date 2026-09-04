import type { WordListMeta } from '$lib/data/most-common-words';

/**
 * One paragraph per language for /tools/most-common-words/<language>.
 *
 * These are written by hand and deliberately not templated. Fifty pages that
 * differ only by a name are fifty near-duplicates, and the thing worth saying
 * is different in each language anyway: that Turkish stacks suffixes, that
 * German capitalises its nouns, that Arabic leaves the short vowels out.
 *
 * Every list here counts word *forms* as they appear in speech, not dictionary
 * headwords, so in an inflected language several rows can belong to one verb.
 * Where that matters most, the paragraph says so.
 *
 * Languages with no entry fall back to `generic` below. That is not a failure
 * state — it is an honest description — but a hand-written line is better, and
 * the missing ones are worth filling in over time.
 */
const INTROS: Record<string, string> = {
	es: 'Spanish verbs carry the subject in their ending, so you will meet several forms of the same verb as separate entries here — es, era, fue and sea are all ser. Learning them as they come is closer to how the language is actually spoken than learning the infinitive alone.',
	fr: 'French elides constantly: l’, d’, c’, j’, n’ all appear here in their own right, because that is how they show up in speech. Spelling and pronunciation diverge more than in most languages on this list, so hearing these words matters as much as reading them.',
	de: 'German capitalises every noun, so the nouns are easy to pick out of this list. Watch for the separable verbs too — the prefix often travels to the end of the sentence, which is why parts like an, auf and aus rank so high on their own.',
	tr: 'Turkish builds words by stacking suffixes onto a stem, so a single Turkish word can carry what English needs a whole clause for. That means this list mixes short stems with longer built-up forms, and the endings you see repeating are doing the work that prepositions do in English.',
	ru: 'Russian nouns and adjectives change shape across six cases, so one dictionary word can appear here several times over. There is no equivalent of "the" or "a" — which is part of why the pronouns and prepositions sit so near the top.',
	ar: 'Arabic is written without its short vowels, so a written word here can stand for more than one spoken one. Words are built from three-consonant roots, and once you start noticing the roots the vocabulary stops feeling like a list and starts feeling like a system.',
	pt: 'Portuguese comes largely from Brazilian and European subtitles both, so the list mixes the two. Verb endings carry the subject, which is why the pronouns are less frequent here than an English speaker would expect.',
	it: 'Italian drops subject pronouns most of the time and lets the verb ending carry them, so the verbs near the top of this list are doing double duty. Articles combine with prepositions too — del, nel, alla — and those combined forms are counted separately.',
	nl: 'Dutch word order moves the verb around the sentence, and this list counts the pieces as they land. Look for the separable verb prefixes near the top; like German, Dutch sends them to the end of the clause.',
	pl: 'Polish has seven cases and no articles, so a single noun turns up here in several shapes and the small connecting words an English speaker expects are simply absent. The consonant clusters look worse than they sound.',
	sv: 'Swedish attaches its definite article to the end of the noun rather than putting a word in front of it, so the "the" form of a noun is a different entry here from the bare one. Word order otherwise stays close to English.',
	el: 'Greek marks its nouns for case and gender, so the articles — ο, η, το and their inflected forms — carry a lot of grammar and cluster at the top of this list. The alphabet is the smallest hurdle; the endings are the real one.',
	ko: 'Korean attaches particles directly to words to mark subject, object and topic, and this list counts them attached, the way they are actually said. That is why so many entries here look like a familiar word with an extra syllable.',
	zh: 'Chinese has no inflection at all — no tenses, no plurals, no cases — so a word in this list is the word, in every context it appears. The difficulty moves elsewhere: to tone, and to which characters combine with which.',
	uk: 'Ukrainian inflects nouns across seven cases and drops articles entirely, so one dictionary word can appear here in several forms. It shares much of its vocabulary with Russian and Polish while sounding like neither.',
	cs: 'Czech marks seven cases and has no articles, so the same noun surfaces here in several endings. The vowel-free consonant runs are real and they are pronounceable — r and l act as vowels.',
	ro: 'Romanian is a Romance language that kept its case endings and puts the definite article on the end of the noun, so it will feel half familiar to a Spanish or Italian speaker and half not.',
	hu: 'Hungarian stacks suffixes the way Turkish does and has no grammatical gender, but it does have around eighteen cases depending on how you count. Long words in this list are usually one stem carrying several endings.',
	fi: 'Finnish has fifteen cases and no articles or future tense, so this list is full of forms of the same stem with different endings. Nothing here is irregular in the way English is irregular; there is simply a lot of it.',
	vi: 'Vietnamese words do not change shape at all — no tenses, no plurals — and are written as separate syllables, so many entries here are one syllable of a two-syllable word. Tone carries meaning, and the diacritics are the tone.',
	id: 'Indonesian has no tenses, no plurals formed by ending, and no grammatical gender, which makes this one of the most approachable lists here. Repetition is how plurals are made, and prefixes do most of the rest of the work.',
	he: 'Hebrew is written right to left and usually without its vowels, so one written form here can stand for several spoken words. Like Arabic it builds vocabulary from three-letter roots.',
	fa: 'Persian is written in the Arabic script but is an Indo-European language, so the grammar is closer to English than the alphabet suggests: no grammatical gender, and a word order that mostly behaves.',
	da: 'Danish attaches the definite article to the end of the noun, and its spelling is a good deal more conservative than its pronunciation — a lot of what is written here is not fully said aloud.',
	no: 'Norwegian puts the definite article on the end of the noun and stays close to Danish in writing and to Swedish in sound. This list is Bokmål, the more widely written of the two standards.',
	ca: 'Catalan sits between Spanish and French and is not a dialect of either. It elides like French (l’, d’) and conjugates like Spanish, so both sets of forms appear here as separate entries.',
	bg: 'Bulgarian dropped the case endings that its Slavic neighbours kept and put a definite article on the end of the noun instead — unusual for the family, and it makes this list look more like Romanian than Russian in places.',
	af: 'Afrikaans grew out of seventeenth-century Dutch and simplified hard: no grammatical gender, no verb conjugation to speak of, and one past tense. A Dutch or German speaker will recognise a great deal of this list on sight.',
	sq: 'Albanian is its own branch of the Indo-European family with no close living relatives, so almost nothing here will look familiar — but it borrowed heavily from Latin, Greek and Turkish, and those loans are the footholds.',
	hy: 'Armenian has its own alphabet, invented in the fifth century and used for nothing else, and its own branch of the family tree. This is a shorter list than most here; the subtitle corpus for Armenian is small.',
	eu: 'Basque is not related to any other language on this list, or to any language anywhere. It is a genuine isolate, older in Europe than the Indo-European languages that surround it, and nothing here will remind you of anything.',
	bn: 'Bengali is written in its own script, reads left to right, and has no grammatical gender at all. Verbs change shape for how polite you are being rather than for the gender of who is speaking.',
	bs: 'Bosnian, Croatian and Serbian are close enough that speakers understand each other completely; they are counted separately here because the subtitle corpora are separate. Bosnian is written in Latin script and inflects across seven cases.',
	hr: 'Croatian shares nearly all of its grammar and vocabulary with Bosnian and Serbian — speakers understand each other without effort. Seven cases, no articles, and a free-ish word order that the case endings make unambiguous.',
	eo: 'Esperanto was constructed to be learnable: every noun ends in -o, every adjective in -a, verbs conjugate one way with no exceptions, and the whole grammar fits on a page. This list is the most regular one here by a wide margin.',
	et: 'Estonian has fourteen cases, no future tense and no grammatical gender, and is related to Finnish rather than to its Latvian and Russian neighbours. Length is meaningful: the same letters said longer are a different word.',
	gl: "Galician sits between Portuguese and Spanish and is a language in its own right, spoken in Spain's north-west. If you read either neighbour you will follow most of this list, and the differences are where the interest is.",
	ka: 'Georgian has its own rounded alphabet, no grammatical gender, no capital letters, and verbs that can carry subject and object at once. It is one of the shorter lists here — the corpus is small.',
	hi: 'Hindi is written in Devanagari, where the line across the top strings the letters of a word together. Verbs agree with gender, and the word order puts the verb at the end, so a sentence resolves late.',
	is: 'Icelandic has changed so little in a thousand years that speakers read medieval sagas without a translation. Four cases, three genders, and a habit of coining new native words rather than borrowing them.',
	lv: 'Latvian and Lithuanian are the only two Baltic languages left. Latvian stresses the first syllable of nearly every word, marks seven cases, and has no articles — the endings do that work.',
	lt: 'Lithuanian keeps more of the original Indo-European grammar than any other living language, which is why linguists keep coming back to it. Seven cases, two genders, and a stress that moves around inside a word.',
	mk: 'Macedonian is the only Slavic language on this list with a definite article stuck on the end of the noun, and it dropped the case endings its neighbours kept. Written in Cyrillic, closest to Bulgarian.',
	ms: 'Malay has no tenses, no plurals formed by ending and no grammatical gender; time is a separate word and a plural is often the noun said twice. It is very close to Indonesian — the two are mutually intelligible.',
	ml: 'Malayalam is written in its own script and is famous for agglutination: a single word can carry what English needs a clause for. It is closely related to Tamil, and both are Dravidian rather than Indo-European.',
	sr: 'Serbian is written in both Cyrillic and Latin, and this list comes from Latin-script subtitles. Grammatically it is the same language as Bosnian and Croatian: seven cases, no articles, three genders.',
	sk: 'Slovak and Czech are close enough that speakers follow each other without study. Six cases, no articles, and consonant clusters that are shorter to say than they look — r and l can carry a syllable on their own.',
	sl: 'Slovene kept the dual number: a separate set of forms for exactly two of something, which most Indo-European languages lost. Six cases as well, so one noun turns up here in several shapes.',
	tl: 'Tagalog marks who is doing what with small particles rather than word order, and the verb changes shape to say which part of the sentence is in focus. Centuries of Spanish rule left a large loan vocabulary you may already know.',
	ta: 'Tamil has been written continuously for more than two thousand years, which makes it one of the oldest living literary languages. What is written and what is spoken differ noticeably; this list, coming from subtitles, leans spoken.',
	te: 'Telugu is written in its own rounded script and is agglutinative — endings stack onto a stem to do the work of prepositions. Most words end in a vowel, which is why it gets called the Italian of the East.',
	ur: 'Urdu is written right to left in a flowing Perso-Arabic script, and shares its grammar and everyday vocabulary with Hindi almost entirely — the two diverge in their formal registers and in what they are written with.',
	en: 'English inflects very little, so the words at the top of this list are almost all function words — the, of, and, to — doing the work that endings do in other languages. That also means a form here is usually the dictionary word itself.'
};

/** Honest, and specific to the language's actual numbers. */
function generic(meta: WordListMeta): string {
	return (
		`These are the ${meta.count.toLocaleString(
			'en-US'
		)} words that come up most often in everyday ` +
		`${meta.name} (${meta.nativeName}), counted as they are actually said rather than as dictionary ` +
		`headwords — so where ${meta.name} changes a word's ending, each ending is counted on its own. ` +
		`Work down from the top: the first few hundred carry most ordinary conversation.`
	);
}

export function intro(meta: WordListMeta): string {
	return INTROS[meta.code] ?? generic(meta);
}
