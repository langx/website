/**
 * Spelling-to-IPA rules for languages written close enough to the way they are
 * said that a table and a few rules read them better than eSpeak does. Each
 * one is held to the same test as eSpeak in build-ipa.ts — agreement with
 * Wiktionary on words both cover — before it fills a single gap. Turkish has
 * its own file, ipa-turkish.ts, for its stress rules.
 *
 * Each function takes a lowercased word and returns the IPA with its
 * brackets, or null for a word it cannot read (a foreign letter, no vowel).
 */

/** Splits a word into letters, longest spelling first: "sh" before "s". */
function tokens(word: string, spellings: string[]): string[] | null {
	const sorted = [...spellings].sort((a, b) => b.length - a.length);
	const out: string[] = [];
	let i = 0;
	while (i < word.length) {
		const hit = sorted.find((s) => word.startsWith(s, i));
		if (!hit) return null;
		out.push(hit);
		i += hit.length;
	}
	return out;
}

// — Estonian ———————————————————————————————————————————————————————————

const ET_VOWEL: Record<string, string> = {
	a: 'ɑ',
	e: 'e',
	i: 'i',
	o: 'o',
	u: 'u',
	õ: 'ɤ',
	ä: 'æ',
	ö: 'ø',
	ü: 'y'
};
const ET_CONS: Record<string, string> = {
	b: 'b̥',
	d: 'd̥',
	g: 'ɡ̊',
	f: 'f',
	h: 'h',
	j: 'j',
	k: 'k',
	l: 'l',
	m: 'm',
	n: 'n',
	p: 'p',
	r: 'r',
	s: 's',
	š: 'ʃ',
	z: 's',
	ž: 'ʒ',
	t: 't',
	v: 'v',
	w: 'v',
	c: 'ts',
	x: 'ks',
	q: 'k',
	y: 'i'
};

/**
 * Estonian: stress on the first syllable, a doubled letter is a long sound,
 * and b d g are the voiceless "soft" stops Wiktionary writes /b̥ d̥ ɡ̊/.
 * Palatalisation and the third degree of length are not in the spelling, so
 * they are not here either.
 */
export function estonianIpa(word: string): string | null {
	const letters = [...word];
	if (letters.some((c) => !(c in ET_VOWEL) && !(c in ET_CONS))) return null;
	const isV = (c: string | undefined) => c !== undefined && c in ET_VOWEL;
	if (!letters.some(isV)) return null;

	let out = '';
	let vowelsSeen = 0;
	for (let i = 0; i < letters.length; i++) {
		const c = letters[i];
		const prev = letters[i - 1];
		if (c === prev) {
			out += 'ː'; // "aa", "tt": one long sound
			continue;
		}
		if (isV(c)) {
			// A second, different vowel in a row closes a diphthong: "ai" /ɑi̯/.
			if (isV(prev)) {
				out += `${ET_VOWEL[c]}̯`;
				continue;
			}
			vowelsSeen++;
			out += ET_VOWEL[c];
		} else if (c === 'n' && (letters[i + 1] === 'k' || letters[i + 1] === 'g')) {
			out += 'ŋ';
		} else {
			out += ET_CONS[c];
		}
	}
	return vowelsSeen > 1 ? `/ˈ${out}/` : `/${out}/`;
}

// — Albanian ———————————————————————————————————————————————————————————

const SQ: Record<string, string> = {
	a: 'a',
	b: 'b',
	c: 't͡s',
	ç: 't͡ʃ',
	d: 'd',
	dh: 'ð',
	e: 'ɛ',
	ë: 'ə',
	f: 'f',
	g: 'ɡ',
	gj: 'ɟ',
	h: 'h',
	i: 'i',
	j: 'j',
	k: 'k',
	l: 'l',
	ll: 'ɫ',
	m: 'm',
	n: 'n',
	nj: 'ɲ',
	o: 'ɔ',
	p: 'p',
	q: 'c',
	r: 'ɾ',
	rr: 'r',
	s: 's',
	sh: 'ʃ',
	t: 't',
	th: 'θ',
	u: 'u',
	v: 'v',
	x: 'd͡z',
	xh: 'd͡ʒ',
	y: 'y',
	z: 'z',
	zh: 'ʒ'
};

/**
 * Albanian: one sound per letter or digraph ("gj" /ɟ/, "q" /c/, "ë" /ə/).
 * Stress is left unmarked. It usually falls on the stem's last syllable, but
 * the stem is not in the spelling, and Wiktionary itself marks it on some
 * entries and not others.
 */
export function albanianIpa(word: string): string | null {
	const parts = tokens(word, Object.keys(SQ));
	if (!parts || !parts.some((p) => /[aeëiouy]/.test(p))) return null;
	return `/${parts.map((p) => SQ[p]).join('')}/`;
}

// — Georgian ———————————————————————————————————————————————————————————

const KA: Record<string, string> = {
	ა: 'a',
	ბ: 'b',
	გ: 'ɡ',
	დ: 'd',
	ე: 'e',
	ვ: 'v',
	ზ: 'z',
	თ: 'tʰ',
	ი: 'i',
	კ: 'kʼ',
	ლ: 'l',
	მ: 'm',
	ნ: 'n',
	ო: 'o',
	პ: 'pʼ',
	ჟ: 'ʒ',
	რ: 'ɾ',
	ს: 's',
	ტ: 'tʼ',
	უ: 'u',
	ფ: 'pʰ',
	ქ: 'kʰ',
	ღ: 'ʁ',
	// [qʼ] in the textbooks; Wiktionary writes the uvular fricative it usually
	// is, and a table should not mix the two.
	ყ: 'χʼ',
	შ: 'ʃ',
	ჩ: 't͡ʃʰ',
	ც: 't͡sʰ',
	ძ: 'd͡z',
	წ: 't͡sʼ',
	ჭ: 't͡ʃʼ',
	ხ: 'χ',
	ჯ: 'd͡ʒ',
	ჰ: 'h'
};
/** A voiced stop at the end of a word is said voiceless and aspirated. */
const KA_FINAL: Record<string, string> = { ბ: 'pʰ', დ: 'tʰ', გ: 'kʰ' };

/**
 * Georgian: one letter, one sound, with ejectives /kʼ/ and aspirates /kʰ/
 * kept apart as the script keeps them. Written [phonetic], as Wiktionary
 * writes Georgian, because the one rule beyond the letters is phonetic: a
 * final "ბ დ გ" is devoiced, "თავად" [tʰavatʰ], and "ვ" after a consonant
 * rounds it, "ხვალ" [χʷal]. Georgian stress is weak and
 * Wiktionary leaves it out; so does this.
 */
export function georgianIpa(word: string): string | null {
	const letters = [...word];
	if (letters.some((c) => !(c in KA))) return null;
	if (!letters.some((c) => 'აეიოუ'.includes(c))) return null;
	const vowel = (c: string | undefined) => c !== undefined && 'აეიოუ'.includes(c);
	const out = letters.map((c, i) => {
		if (i === letters.length - 1 && c in KA_FINAL) return KA_FINAL[c];
		// "ვ" between a consonant and a vowel rounds the consonant: "ხვალ" [χʷal].
		if (c === 'ვ' && i > 0 && !vowel(letters[i - 1]) && vowel(letters[i + 1])) return 'ʷ';
		return KA[c];
	});
	return `[${out.join('')}]`;
}

// — Galician ———————————————————————————————————————————————————————————

const GL_VOWELS = 'aeiouáéíóú';
const GL_ACCENTED: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };

/**
 * Galician: Spanish-like spelling with "x" /ʃ/, "nh" /ŋ/ and "z", "ce, ci"
 * /θ/; Spanish-like stress — a written accent wins, then the second-last
 * syllable for a word ending in a vowel, "n" or "s", the last otherwise.
 * Open and closed "e" and "o" are not in the spelling; the closed ones are
 * written, and the test in build-ipa.ts does not count the difference.
 */
export function galicianIpa(word: string): string | null {
	if (/[^a-zñáéíóúü]/.test(word) || !/[aeiouáéíóú]/.test(word)) return null;
	const letters = [...word];
	const isV = (c: string | undefined) => c !== undefined && GL_VOWELS.includes(c);

	// Syllable nuclei: runs of vowels, split where two strong vowels meet or
	// an accented "í ú" stands on its own ("ra-íz").
	const nuclei: { start: number; end: number; accented: boolean }[] = [];
	for (let i = 0; i < letters.length; i++) {
		if (!isV(letters[i])) continue;
		const last = nuclei[nuclei.length - 1];
		// Only an unaccented "i u" is weak: "í ú" stand alone, "ru-í-do".
		const weak = (c: string) => c === 'i' || c === 'u';
		// "qu", "gu" before e/i: the "u" is spelling, not a vowel.
		if (
			letters[i] === 'u' &&
			(letters[i - 1] === 'q' || letters[i - 1] === 'g') &&
			/[eéií]/.test(letters[i + 1] ?? '')
		)
			continue;
		const alone = (c: string) => c === 'í' || c === 'ú';
		if (
			last &&
			last.end === i - 1 &&
			(weak(letters[i]) || weak(letters[i - 1])) &&
			!alone(letters[i]) &&
			!alone(letters[i - 1])
		) {
			last.end = i;
			last.accented ||= letters[i] in GL_ACCENTED;
		} else {
			nuclei.push({ start: i, end: i, accented: letters[i] in GL_ACCENTED });
		}
	}
	if (!nuclei.length) return null;

	let stress = nuclei.findIndex((n) => n.accented);
	if (stress < 0) {
		stress = /[aeiouns]$/.test(word) && nuclei.length > 1 ? nuclei.length - 2 : nuclei.length - 1;
	}
	// The stressed syllable starts at its onset: of the consonants since the
	// last vowel, one opens it — two for "bl", "tr" and the like, or a digraph.
	let onset = 0;
	if (stress > 0) {
		const at = nuclei[stress].start;
		const cluster = letters.slice(nuclei[stress - 1].end + 1, at).join('');
		const keep = /^(ch|ll|nh|qu|gu|rr|[bcdfgptv][lr])$/.test(cluster.slice(-2))
			? 2
			: Math.min(1, cluster.length);
		onset = at - keep;
	}

	let out = '';
	for (let i = 0; i < letters.length; i++) {
		if (nuclei.length > 1 && i === onset) out += 'ˈ';
		const c = letters[i];
		const next = letters[i + 1] ?? '';
		const prev = letters[i - 1] ?? '';
		const two = c + next;
		if (two === 'ch') {
			out += 't͡ʃ';
			i++;
		} else if (two === 'll') {
			out += 'ʎ';
			i++;
		} else if (two === 'nh') {
			out += 'ŋ';
			i++;
		} else if (two === 'rr') {
			out += 'r';
			i++;
		} else if (two === 'qu' && /[eéií]/.test(letters[i + 2] ?? '')) {
			out += 'k';
			i++;
		} else if (two === 'gu' && /[eéií]/.test(letters[i + 2] ?? '')) {
			out += 'ɡ';
			i++;
		} else if (c === 'c') out += /[eéií]/.test(next) ? 'θ' : 'k';
		else if (c === 'g') out += /[eéií]/.test(next) ? 'ʃ' : 'ɡ';
		else if (c === 'z') out += 'θ';
		else if (c === 'x') out += 'ʃ';
		else if (c === 'v' || c === 'b') out += 'b';
		else if (c === 'h') continue;
		else if (c === 'ñ') out += 'ɲ';
		else if (c === 'q') out += 'k';
		else if (c === 'j') out += 'x';
		else if (c === 'y') out += 'ʝ';
		else if (c === 'r') out += i === 0 || 'lns'.includes(prev) ? 'r' : 'ɾ';
		else if (c === 'n')
			out += /[kgcq]/.test(next) && !/[eéií]/.test(letters[i + 2] ?? '') ? 'ŋ' : 'n';
		else if (isV(c)) {
			const plain = GL_ACCENTED[c] ?? c;
			// An unstressed "i u" beside another vowel is a glide: "moito" /ˈmojto/.
			const glide =
				(plain === 'i' || plain === 'u') &&
				!(c in GL_ACCENTED) &&
				(isV(prev) || isV(next)) &&
				!(isV(prev) && isV(next)) &&
				// Of two weak vowels the second is the vowel: "ui" /wi/, "iu" /ju/.
				!(prev === 'i' || prev === 'u');
			const inNucleusWithOther = nuclei.some(
				(n) => n.start !== n.end && i >= n.start && i <= n.end
			);
			out += glide && inNucleusWithOther ? (plain === 'i' ? 'j' : 'w') : plain;
		} else out += c === 'ü' ? 'w' : c;
	}
	return `/${out}/`;
}

// — Malay ——————————————————————————————————————————————————————————————

const MS: Record<string, string> = {
	a: 'a',
	b: 'b',
	c: 't͡ʃ',
	d: 'd',
	e: 'ə',
	f: 'f',
	g: 'ɡ',
	gh: 'ɣ',
	h: 'h',
	i: 'i',
	j: 'd͡ʒ',
	k: 'k',
	kh: 'x',
	l: 'l',
	m: 'm',
	n: 'n',
	ng: 'ŋ',
	ny: 'ɲ',
	o: 'o',
	p: 'p',
	q: 'k',
	r: 'r',
	s: 's',
	sy: 'ʃ',
	t: 't',
	u: 'u',
	v: 'v',
	w: 'w',
	x: 'ks',
	y: 'j',
	z: 'z'
};

/**
 * Malay: "e" is read /ə/, as it is in about five words of six ("é" /e/ is
 * not written apart), "ng ny sy kh" are one sound each, and the stress falls
 * on the second-last syllable — the last, where the second-last has only /ə/,
 * "belajar" /bəˈlad͡ʒar/ but "semua" /səˈmua/.
 */
export function malayIpa(word: string): string | null {
	const parts = tokens(word, Object.keys(MS));
	if (!parts) return null;
	const sounds = parts.map((p) => MS[p]);
	const vowelAt = sounds.flatMap((s, i) => (/^[aəiou]$/.test(s) ? [i] : []));
	if (!vowelAt.length) return null;

	// "ai", "au", "oi" at the end of a word are one syllable: "sampai", "pulau".
	const last = vowelAt.length - 1;
	const diphthong =
		vowelAt.length > 1 &&
		vowelAt[last] === sounds.length - 1 &&
		vowelAt[last - 1] === vowelAt[last] - 1 &&
		/^(ai|au|oi)$/.test(sounds[vowelAt[last - 1]] + sounds[vowelAt[last]]);
	if (diphthong) {
		sounds[vowelAt[last]] += '̯';
		vowelAt.pop();
	}

	let out = sounds;
	if (vowelAt.length > 1) {
		let target = vowelAt.length - 2;
		if (sounds[vowelAt[target]] === 'ə') target++;
		const v = vowelAt[target];
		// The syllable opens on the single consonant before its vowel, if any.
		const onset = v > 0 && !/^[aəiou]/.test(sounds[v - 1]) ? v - 1 : v;
		out = [...sounds.slice(0, onset), 'ˈ', ...sounds.slice(onset)];
	}
	return `/${out.join('')}/`;
}
