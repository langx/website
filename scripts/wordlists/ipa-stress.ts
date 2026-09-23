/**
 * Moving a stress mark from before the stressed vowel, where eSpeak, goruut
 * and a romanisation's accent put it, to before the stressed syllable, where
 * IPA and Wiktionary put it.
 */

const VOWEL = /[aeiouyɑɐɒæɛəɜɞɘɵøœɶɪʏʊʌɔɤɯɨʉɚɝ]/;
const APPROXIMANT = /^[lɾrɹjwʎʁʀɫʋɥ]/;
/** Diacritics and modifier letters that belong to the letter before them. */
const MODIFIER = /[\p{M}ʰʲʷˠˤⁿˡːˑ̃]/u;

/**
 * eSpeak puts the stress mark before the stressed vowel ("aβlˈamos"); IPA and
 * Wiktionary put it before the syllable ("aˈβlamos"). Moves it back over the
 * consonants that open the syllable: all of them at the start of a word, else
 * one — two when the second is a liquid or glide, as in "bl", "tr", "kw".
 */
export function syllableStress(ipa: string): string {
	const segs: string[] = [];
	for (const ch of ipa) {
		const last = segs.length - 1;
		if (last >= 0 && (MODIFIER.test(ch) || segs[last].endsWith('͡'))) segs[last] += ch;
		else if (ch === '͡' && last >= 0) segs[last] += ch;
		else segs.push(ch);
	}
	const isCons = (s: string) => !VOWEL.test(s[0]) && !/[ˈˌ\s.‿-]/.test(s[0]) && !s.includes('̩');
	for (let i = 0; i < segs.length; i++) {
		if (segs[i] !== 'ˈ' && segs[i] !== 'ˌ') continue;
		let j = i;
		while (j > 0 && isCons(segs[j - 1])) j--;
		const cluster = i - j;
		if (!cluster) continue;
		const atStart = j === 0 || /[\s‿-]/.test(segs[j - 1]);
		let onset = 1;
		if (atStart) onset = cluster;
		else if (cluster >= 2 && APPROXIMANT.test(segs[i - 1]) && !APPROXIMANT.test(segs[i - 2]))
			onset = 2;
		const mark = segs.splice(i, 1)[0];
		segs.splice(i - onset, 0, mark);
	}
	return segs.join('');
}
