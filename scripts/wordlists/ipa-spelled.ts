/**
 * How Wiktionary spells a word out, for the words it gives no IPA: the
 * vowelled form of an Arabic or Hebrew word ("יָדַעְתִּי"), the stressed form
 * of a Bulgarian or Lithuanian one ("е́зерото", "kàs"), and the romanisation
 * nearly every non-Latin entry carries ("yadá'ti", "farzand-ân", "samandar").
 * A person wrote each of them, and each says what the plain spelling does not
 * — the vowels, the stress — so a rule set can read it where it could not
 * read the word itself. ipa-translit.ts has those rules.
 *
 * An unvowelled spelling is often several words: Hebrew שכן is "shakhán" (he
 * dwelt) and "shakhén" (neighbour). The list already chose which one it means
 * when it chose the English meaning, so the entry whose senses include that
 * meaning wins; then an entry for the word itself over a row of another
 * word's inflection table; then any.
 */
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { createGunzip } from 'node:zlib';

export interface Spelled {
	/** The spelling with its vowel points or stress marks, if Wiktionary gives one. */
	canon?: string;
	/** The romanisation, if Wiktionary gives one. */
	roman?: string;
	/** Every romanisation given: Persian has a Classical one and an Iranian one. */
	romans?: string[];
}

/**
 * The plain spelling a vowelled or stressed one is written as: without Latin
 * and Cyrillic accents, Arabic vowel marks and tatweel, or Hebrew points. Not
 * without every combining mark — in the Indian scripts those are the vowels
 * themselves, and stripping them made हो "ho" the same word as हाँ "hā̃"; the
 * Arabic hamza is a letter too, or أمر "ʔamr" is امر "imr".
 */
export function bare(s: string): string {
	return s
		.normalize('NFD')
		.replace(
			/[\u0300-\u036f\u064b-\u0652\u0670\u0640\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7]/g,
			''
		)
		.normalize('NFC')
		.toLowerCase();
}

/** The first meaningful stretch of a gloss, for comparing two of them. */
function core(gloss: string): string {
	return gloss
		.toLowerCase()
		.replace(/\([^)]*\)/g, '')
		.split(/[,;]/)[0]
		.replace(/^(to|a|an|the)\s+/, '')
		.trim();
}

type Sense = { glosses?: string[] };
type Form = { form?: string; tags?: string[]; roman?: string };
type Sound = { zh_pron?: string; tags?: string[] };

/**
 * Standard Mandarin pinyin from a Chinese entry's sounds, which is where
 * Chinese keeps its romanisation: "shūfu". Dialect readings are tagged with
 * their city and left alone.
 */
function pinyin(sounds: Sound[] | undefined): string | undefined {
	const hit = sounds?.find(
		(s) =>
			s.zh_pron &&
			s.tags?.includes('Mandarin') &&
			s.tags.includes('Pinyin') &&
			s.tags.every((t) => ['Mandarin', 'Pinyin', 'Standard'].includes(t))
	);
	return hit?.zh_pron?.split(' (')[0];
}

export async function spelledFor(
	dump: string,
	glosses: Map<string, string>
): Promise<Map<string, Spelled[]>> {
	const want = new Map([...glosses.keys()].map((w) => [bare(w), w]));
	// Every candidate, best first: the likeliest may carry only a vowelled
	// spelling and no romanisation, and the next one the romanisation.
	const found = new Map<string, (Spelled & { score: number })[]>();
	const offer = (word: string, s: Spelled, score: number) => {
		if (!s.canon && !s.roman && !s.romans?.length) return;
		if (!found.has(word)) found.set(word, []);
		found.get(word)?.push({ ...s, score });
	};

	const rl = createInterface({
		input: createReadStream(dump).pipe(createGunzip()),
		crlfDelay: Infinity
	});
	for await (const line of rl) {
		let rec: { word?: string; pos?: string; senses?: Sense[]; forms?: Form[]; sounds?: Sound[] };
		try {
			rec = JSON.parse(line);
		} catch {
			continue;
		}
		// A letter's entry is not the word spelled the same (Spanish "y"), but a
		// Chinese character's entry is the word.
		if (!rec.word || (rec.pos === 'character' && !/\p{Script=Han}/u.test(rec.word))) continue;
		// A name is read like any word ("Англии" is still [ɐnˈɡlʲiɪ]) but loses
		// to a common word spelled the same.
		const name = rec.pos === 'name' ? -2 : 0;
		const meanings = (rec.senses ?? []).flatMap((s) => s.glosses ?? []).map(core);
		const matches = (word: string) => {
			const g = glosses.get(word);
			return g ? meanings.includes(core(g)) : false;
		};
		const forms = rec.forms ?? [];

		// The entry for the word itself.
		const self = want.get(bare(rec.word));
		if (self) {
			const canon = forms.find(
				(f) => f.tags?.includes('canonical') && f.form && bare(f.form) === bare(rec.word as string)
			)?.form;
			const romans = forms
				.filter((f) => f.tags?.includes('romanization'))
				.map((f) => f.form as string);
			const zh = pinyin(rec.sounds);
			if (zh) romans.push(zh);
			const stressed = rec.word !== bare(rec.word) ? rec.word : undefined;
			offer(
				self,
				{ canon: canon ?? stressed, roman: romans[0], romans },
				(matches(self) ? 10 : 0) + 3 + name
			);
		}

		// A row of another word's inflection table that spells this one out.
		for (const f of forms) {
			if (!f.form || f.tags?.includes('canonical') || f.tags?.includes('romanization')) continue;
			const other = want.get(bare(f.form));
			if (!other || other === rec.word) continue;
			const marked = f.form !== bare(f.form);
			if (!marked && !f.roman) continue;
			const romans = f.roman?.split(' / ');
			offer(
				other,
				{ canon: marked ? f.form : undefined, roman: romans?.[0], romans },
				(matches(other) ? 5 : 0) + name
			);
		}
	}
	return new Map(
		[...found].map(([w, list]) => [
			w,
			list
				.sort((a, b) => b.score - a.score)
				.map(({ canon, roman, romans }) => ({ canon, roman, romans }))
		])
	);
}
