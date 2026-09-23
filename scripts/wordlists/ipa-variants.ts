/**
 * Other spellings of the same word, under which Wiktionary may keep the
 * pronunciation the list's spelling lacks.
 */

const TONES = /[̣̀́̃̉]/;
const VI_VOWEL = /[aeiouyăâêôơư]/;

/**
 * Vietnamese: where the tone mark sits on a diphthong has two conventions,
 * "hóa" and "hoá", "thủy" and "thuỷ", and a final "y" is often "i", "lý" and
 * "lí". The list has whichever its source used; Wiktionary may have the other.
 */
export function vietnameseVariants(word: string): string[] {
	const d = word.normalize('NFD');
	const tone = d.match(TONES)?.[0];
	const base = [...d.replace(TONES, '').normalize('NFC')];
	const out = new Set<string>();
	const spell = (letters: string[]) => {
		if (!tone) return out.add(letters.join(''));
		letters.forEach((c, i) => {
			if (!VI_VOWEL.test(c)) return;
			const copy = [...letters];
			copy[i] = (c.normalize('NFD') + tone).normalize('NFC');
			out.add(copy.join('').normalize('NFC'));
		});
	};
	spell(base);
	const last = base.length - 1;
	if (base[last] === 'y' && last > 0 && !VI_VOWEL.test(base[last - 1]))
		spell([...base.slice(0, last), 'i']);
	else if (base[last] === 'i' && last > 0 && !VI_VOWEL.test(base[last - 1]))
		spell([...base.slice(0, last), 'y']);
	// Loanwords the list hyphenates, "cà-rốt", Wiktionary spells with spaces.
	if (word.includes('-')) out.add(word.replace(/-/g, ' '));
	out.delete(word.normalize('NFC'));
	return [...out];
}

/**
 * Russian: "ё" is usually printed as "е", and the subtitles the list comes
 * from print it so — "еще", "ее", "идет" — where Wiktionary spells "ещё".
 */
export function russianVariants(word: string): string[] {
	const out: string[] = [];
	for (let i = 0; i < word.length; i++) {
		if (word[i] === 'е') out.push(word.slice(0, i) + 'ё' + word.slice(i + 1));
	}
	return out;
}
