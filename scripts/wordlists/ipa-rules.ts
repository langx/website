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

// — Korean —————————————————————————————————————————————————————————————

const KO_ONSET = [
	'k',
	'k͈',
	'n',
	't',
	't͈',
	'ɾ',
	'm',
	'p',
	'p͈',
	's',
	's͈',
	'',
	't͡ɕ',
	't͡ɕ͈',
	't͡ɕʰ',
	'kʰ',
	'tʰ',
	'pʰ',
	'h'
];
const KO_VOWEL = [
	'a',
	'ɛ',
	'ja',
	'jɛ',
	'ʌ',
	'e',
	'jʌ',
	'je',
	'o',
	'wa',
	'wɛ',
	'we',
	'jo',
	'u',
	'wʌ',
	'we',
	'wi',
	'ju',
	'ɯ',
	'ɰi',
	'i'
];
/** Final consonant clusters: [the one said at the end, the one that moves on before a vowel]. */
const KO_CODA: [string, string][] = [
	['', ''],
	['k', 'k'],
	['k', 'k͈'],
	['k', 's͈'],
	['n', 'n'],
	['n', 't͡ɕ'],
	['n', 'h'],
	['t', 't'],
	['l', 'ɾ'],
	['k', 'ɡ'],
	['m', 'm'],
	['l', 'b'],
	['l', 's͈'],
	['l', 'tʰ'],
	['p', 'pʰ'],
	['l', 'h'],
	['m', 'm'],
	['p', 'p'],
	['p', 's͈'],
	['t', 's'],
	['t', 's͈'],
	['ŋ', ''],
	['t', 't͡ɕ'],
	['t', 't͡ɕʰ'],
	['k', 'kʰ'],
	['t', 'tʰ'],
	['p', 'pʰ'],
	['t', 'h']
];
const KO_LAX: Record<string, string> = { k: 'ɡ', t: 'd', p: 'b', t͡ɕ: 'd͡ʑ' };
const KO_TENSE: Record<string, string> = { k: 'k͈', t: 't͈', p: 'p͈', s: 's͈', t͡ɕ: 't͡ɕ͈' };
const KO_ASPIRATE: Record<string, string> = { k: 'kʰ', t: 'tʰ', p: 'pʰ', t͡ɕ: 't͡ɕʰ' };

/**
 * Korean from Hangul, with the sound changes the spelling does not show: a
 * final consonant moves on to a following vowel ("있어" [is͈ʌ]), a final stop
 * is unreleased and a plain one after it tense, "k t p" before "n m" turn
 * nasal, a plain stop between voiced sounds is voiced ("내가" [nɛɡa]), "ㅎ"
 * aspirates the stop beside it, "ㅌ" before "이" is [t͡ɕʰ], and "ㄹ" is [ɾ] between
 * vowels and [l] elsewhere. Written [phonetic], as Wiktionary writes Korean.
 */
export function koreanIpa(word: string): string | null {
	const syls: { on: string; v: string; coda: number }[] = [];
	for (const ch of word) {
		const code = ch.codePointAt(0)! - 0xac00;
		if (code < 0 || code > 11171) return null;
		syls.push({
			on: KO_ONSET[Math.floor(code / 588)],
			v: KO_VOWEL[Math.floor((code % 588) / 28)],
			coda: code % 28
		});
	}
	if (!syls.length) return null;

	const parts: { on: string; v: string; end: string }[] = syls.map((s) => ({
		on: s.on,
		v: s.v,
		end: ''
	}));
	for (let i = 0; i < syls.length; i++) {
		const [said, moves] = KO_CODA[syls[i].coda];
		const next = parts[i + 1];
		if (!syls[i].coda) continue;
		if (next && next.on === '' && syls[i].coda !== 21) {
			// Liaison: the consonant opens the next syllable; "ㅎ" goes silent.
			const moved = moves === 'h' ? '' : moves;
			if (said !== moves && said !== 't' && said !== 'k' && said !== 'p' && moves !== 'h')
				parts[i].end = said;
			// Before "이", "ㅌ ㄷ" palatalise: "같이" [kat͡ɕʰi], "굳이" [kud͡ʑi].
			const palatal: Record<string, string> = { tʰ: 't͡ɕʰ', t: 'd͡ʑ', s: 'ɕ' };
			next.on = next.v === 'i' && palatal[moved] ? palatal[moved] : moved;
			continue;
		}
		if (moves === 'h' && next && KO_ASPIRATE[next.on]) {
			parts[i].end = said === 't' ? '' : said;
			next.on = KO_ASPIRATE[next.on];
			continue;
		}
		parts[i].end = said;
		if (next) {
			if ((said === 'k' || said === 't' || said === 'p') && next.on === 'h') {
				parts[i].end = '';
				next.on = KO_ASPIRATE[said];
			} else if ((said === 'k' || said === 't' || said === 'p') && KO_TENSE[next.on]) {
				next.on = KO_TENSE[next.on];
			} else if (
				(said === 'k' || said === 't' || said === 'p') &&
				(next.on === 'n' || next.on === 'm')
			) {
				parts[i].end = { k: 'ŋ', t: 'n', p: 'm' }[said] as string;
			} else if (next.on === 'ɾ') {
				next.on = said === 'l' || said === 'n' ? 'l' : 'n';
				if (said === 'n') parts[i].end = 'l';
			}
		}
	}

	let out = '';
	parts.forEach((p, i) => {
		let on = p.on;
		const prevEnd = i > 0 ? parts[i - 1].end : undefined;
		const voicedBefore = i > 0 && (prevEnd === '' || /^[nmŋl]$/.test(prevEnd ?? ''));
		if (voicedBefore && KO_LAX[on]) on = KO_LAX[on];
		if (on === 's' && /^[ij]/.test(p.v)) on = 'ɕ';
		if (on === 's͈' && /^[ij]/.test(p.v)) on = 'ɕ͈';
		if (on === 'ɾ' && i === 0) on = 'ɾ';
		const v = p.v === 'ɰi' && i > 0 ? 'i' : p.v;
		const end = p.end === '' ? '' : /^[ktp]$/.test(p.end) ? `${p.end}̚` : p.end;
		out += on + v + end;
	});
	return `[${out}]`;
}
