/**
 * Turkish spelling to IPA, for the words Wiktionary has no transcription for.
 *
 * Turkish is written almost the way it is said, so the sounds are a table.
 * The work is in three places:
 *
 *   - "k", "g" and "l" take their colour from the vowel of their syllable:
 *     /c ɟ l/ beside e i ö ü, /k ɡ ɫ/ beside a ı o u — "görmek" /ɟøɾˈmec/,
 *     "anlamak" /an.ɫaˈmak/. That is how Wiktionary writes them too.
 *   - "ğ" is no sound of its own: between two different vowels it drops out
 *     ("aşağı" /aʃaˈɯ/), between two the same they run into one long vowel
 *     ("ağaca" /aːˈd͡ʒa/), and before a consonant or at the end it lengthens
 *     the vowel before it ("dağ" /daː/).
 *   - Stress. Most Turkish words take it on the last syllable, and most of the
 *     words this fills in are inflected forms, which keep that rule. The
 *     suffixes that push it back are the common ones a learner meets first:
 *     "-yor" (/ɟeˈlijoɾ/), the negative "-ma/-me" (/ˈjapmadɯm/) and the future
 *     "-acağ-/-eceğ-" (/t͡ʃaɫaˈd͡ʒaɯm/). Everything subtler — place names,
 *     adverbs like "şimdi", the copula — is a lemma, and Wiktionary has those.
 *
 * A word of one syllable carries no stress mark, as in Wiktionary.
 */

const VOWELS = 'aeıioöuüâîû';
const FRONT = new Set(['e', 'i', 'ö', 'ü', 'î']);

const SOUND: Record<string, string> = {
	a: 'a',
	â: 'aː',
	b: 'b',
	c: 'd͡ʒ',
	ç: 't͡ʃ',
	d: 'd',
	e: 'e',
	f: 'f',
	h: 'h',
	ı: 'ɯ',
	i: 'i',
	î: 'iː',
	j: 'ʒ',
	m: 'm',
	n: 'n',
	o: 'o',
	ö: 'ø',
	p: 'p',
	r: 'ɾ',
	s: 's',
	ş: 'ʃ',
	t: 't',
	u: 'u',
	û: 'uː',
	ü: 'y',
	v: 'v',
	y: 'j',
	z: 'z'
};

const isVowel = (c: string) => VOWELS.includes(c);

/**
 * Splits a word into syllables the Turkish way: a lone consonant between
 * vowels opens the next syllable, and of two or more the last one does —
 * "ar.ka.daş", "türk.çe", "ok.ul" is wrong and "o.kul" is right.
 */
function syllables(word: string): string[] {
	const letters = [...word];
	const vowelAt = letters.flatMap((c, i) => (isVowel(c) ? [i] : []));
	if (vowelAt.length < 2) return [word];
	const cuts: number[] = [];
	for (let v = 0; v < vowelAt.length - 1; v++) {
		const gap = vowelAt[v + 1] - vowelAt[v] - 1;
		cuts.push(gap === 0 ? vowelAt[v + 1] : vowelAt[v + 1] - 1);
	}
	const out: string[] = [];
	let from = 0;
	for (const cut of cuts) {
		out.push(letters.slice(from, cut).join(''));
		from = cut;
	}
	out.push(letters.slice(from).join(''));
	return out;
}

/** Which syllable is stressed, by the suffixes that move it; the last one otherwise. */
function stressed(sylls: string[]): number {
	const word = sylls.join('');
	const at = (index: number) => {
		// The syllable holding the letter at `index` in the word.
		let seen = 0;
		for (let s = 0; s < sylls.length; s++) {
			seen += [...sylls[s]].length;
			if (index < seen) return s;
		}
		return sylls.length - 1;
	};
	const last = sylls.length - 1;

	// The negative: "yap-ma-dım", "gel-me-yin", "yap-mı-yor". Stress falls on
	// the syllable before it. Only after a consonant-final stem, and only with
	// a verb ending after it, so "ramazan", "yemek" and "elma" are left alone.
	const neg =
		/[^aeıioöuü](m[aeıiuü])(?=(d[ıiuü]|z|yacak|yecek|yaca|yece|m[ıiuü]ş|s[ıiuü]n|y[ıiuü]n|yor|y[ıiuü]z|y[ae]lım))/.exec(
			word
		);
	if (neg && at(neg.index + 1) > 0) return at(neg.index + 1) - 1;

	// "-yor": "ge-li-yor", "ko-nu-şu-yo-rum". Stress on the vowel before it.
	const yor = /[ıiuü]yor/.exec(word);
	if (yor) return at(yor.index);

	// The future before a vowel: "ça-la-ca-ğım", "ge-le-ce-ğiz".
	const fut = /(a|e)(cağ|ceğ)[aeıioöuü]/.exec(word);
	if (fut) return at(fut.index + 1);

	return last;
}

/** The IPA for one Turkish word, with its brackets, or null for one it cannot read. */
export function turkishIpa(raw: string): string | null {
	const word = raw.toLocaleLowerCase('tr').replace(/['’]/g, '');
	if (!word || /[^a-zçğıöşüâîû]/.test(word) || ![...word].some(isVowel)) return null;

	const sylls = syllables(word);
	const stress = sylls.length > 1 ? stressed(sylls) : -1;
	const letters = [...word];

	let out = '';
	let pos = 0;
	let skip = false;
	/** Where each syllable starts in `out`, for a stress mark that has to move. */
	const starts: number[] = [];
	sylls.forEach((syll, s) => {
		starts.push(out.length);
		if (s === stress) out += 'ˈ';
		const vowel = [...syll].find(isVowel) ?? '';
		// "kâ", "gâ": the circumflex marks a front "k" or "g" before a back vowel.
		const front = FRONT.has(vowel) || vowel === 'â';
		for (const c of syll) {
			const next = letters[pos + 1];
			const prev = letters[pos - 1];
			if (skip) {
				skip = false;
			} else if (c === 'ğ' && next && next === prev && isVowel(next)) {
				// "a-ğa" is one long "aː", in the syllable before. If this syllable
				// had the stress, so does that one now: "bil-di-ğin" /bilˈdiːn/.
				if (s === stress) {
					out = out.slice(0, -1);
					out = `${out.slice(0, starts[s - 1])}ˈ${out.slice(starts[s - 1])}`;
				}
				out += 'ː';
				skip = true;
			} else if (c === 'ğ') {
				// Between vowels it is silent; otherwise it lengthens the vowel.
				if (!(next && isVowel(next)) && prev && isVowel(prev) && !out.endsWith('ː')) out += 'ː';
			} else if (c === 'k') out += front ? 'c' : 'k';
			else if (c === 'g') out += front ? 'ɟ' : 'ɡ';
			else if (c === 'l') out += FRONT.has(vowel) || vowel === 'â' ? 'l' : 'ɫ';
			else out += SOUND[c] ?? '';
			pos++;
		}
	});
	return `/${out}/`;
}
