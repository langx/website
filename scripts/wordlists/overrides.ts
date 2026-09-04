/**
 * Hand-checked glosses that override what the scorer picked.
 *
 * The scorer in `build.ts` reads Wiktionary, which lists senses in its own
 * order and often leads with a grammatical description or a rare reading. It
 * gets the great majority right, but at the very top of a frequency list —
 * where every visitor looks, and where the words are short function words with
 * several unrelated entries — it makes ties it cannot break. German "das" is
 * both the article "the" and the relative pronoun "which"; French "la" is both
 * "the" and "her". No weighting settles those, because both readings are real
 * and both are common.
 *
 * So this is the human pass, recorded once rather than redone by hand on every
 * rebuild. Keyed `<language code>:<word>`, lowercased, as the word appears in
 * the list.
 *
 * Only add an entry you are confident about. A language missing from here has
 * simply not been reviewed yet, which is the honest state for most of the
 * fifty-three.
 */
export const GLOSS_OVERRIDES: Record<string, string> = {
	// Spanish
	'es:de': 'of, from',
	'es:lo': 'it; the',
	'es:me': 'me',
	'es:los': 'the',
	'es:se': 'oneself, himself, herself',
	'es:esto': 'this',
	'es:mi': 'my',
	'es:su': 'his, her, their',
	'es:tu': 'your',
	'es:al': 'to the, at the',
	'es:la': 'the',
	'es:el': 'the',
	'es:las': 'the',
	'es:un': 'a, an',
	'es:una': 'a, an',

	// French
	'fr:de': 'of, from',
	'fr:la': 'the; her',
	'fr:pas': 'not',
	'fr:a': 'has',

	// German
	'de:ich': 'I',
	'de:das': 'the; that, which',
	'de:die': 'the',
	'de:der': 'the',
	'de:es': 'it',
	'de:sie': 'she; they; you',

	// Polish
	'pl:to': 'this, it',
	'pl:w': 'in, at',
	'pl:na': 'on',
	'pl:z': 'with; from',
	'pl:się': 'oneself, self',
	'pl:że': 'that',

	// Russian
	'ru:это': 'this, it',
	'ru:мне': 'to me',
	'ru:ты': 'you',
	'ru:он': 'he',
	'ru:что': 'what; that',
	'ru:не': 'not',

	// Italian
	'it:di': 'of',
	'it:a': 'to, at',
	'it:un': 'a, an',
	'it:che': 'that, which',

	// Dutch
	'nl:ik': 'I',
	'nl:je': 'you',
	'nl:het': 'the; it',
	'nl:de': 'the',
	'nl:dat': 'that',
	'nl:is': 'to be',
	'nl:een': 'a, an',
	'nl:niet': 'not',

	// Turkish
	'tr:mi': 'question particle',
	'tr:mı': 'question particle',
	'tr:için': 'for',

	// Portuguese
	'pt:é': 'to be',
	'pt:um': 'a, an'
};
