/**
 * The languages that get a "most common words" page.
 *
 * `code`, `name` and `nativeName` are copied from
 * `langx/packages/shared/src/languages.ts`, the same way
 * `src/lib/data/languages.ts` copies the homepage strip. Nothing checks that
 * they still agree, so re-copy them if that file changes.
 *
 * `freq` is the directory name in hermitdave/FrequencyWords, which is not
 * always the ISO 639-1 code. `wiktionary` is the language's English name on
 * kaikki.org, which is not always `name` either (Norwegian is the awkward one).
 *
 * `script` is the Unicode script the language is written in. A token holding
 * anything outside it is thrown away, which is what keeps Cyrillic out of the
 * Spanish list. It does NOT keep English out of the Spanish list — both are
 * Latin — so the dictionary check in `build.ts` is what does that.
 */
export interface WordlistLanguage {
	code: string;
	name: string;
	nativeName: string;
	slug: string;
	freq: string;
	wiktionary: string;
	script: string;
}

export const WORDLIST_LANGUAGES: WordlistLanguage[] = [
	['af', 'Afrikaans', 'Afrikaans', 'af', 'Afrikaans', 'Latin'],
	['ar', 'Arabic', 'العربية', 'ar', 'Arabic', 'Arabic'],
	['bg', 'Bulgarian', 'български език', 'bg', 'Bulgarian', 'Cyrillic'],
	['bn', 'Bengali', 'বাংলা', 'bn', 'Bengali', 'Bengali'],
	['br', 'Breton', 'brezhoneg', 'br', 'Breton', 'Latin'],
	['bs', 'Bosnian', 'bosanski jezik', 'bs', 'Serbo-Croatian', 'Latin'],
	['ca', 'Catalan', 'català', 'ca', 'Catalan', 'Latin'],
	['cs', 'Czech', 'čeština', 'cs', 'Czech', 'Latin'],
	['da', 'Danish', 'dansk', 'da', 'Danish', 'Latin'],
	['de', 'German', 'Deutsch', 'de', 'German', 'Latin'],
	['el', 'Greek', 'Ελληνικά', 'el', 'Greek', 'Greek'],
	['en', 'English', 'English', 'en', 'English', 'Latin'],
	['eo', 'Esperanto', 'Esperanto', 'eo', 'Esperanto', 'Latin'],
	['es', 'Spanish', 'Español', 'es', 'Spanish', 'Latin'],
	['et', 'Estonian', 'eesti', 'et', 'Estonian', 'Latin'],
	['eu', 'Basque', 'euskara', 'eu', 'Basque', 'Latin'],
	['fa', 'Persian', 'فارسی', 'fa', 'Persian', 'Arabic'],
	['fi', 'Finnish', 'suomi', 'fi', 'Finnish', 'Latin'],
	['fr', 'French', 'français', 'fr', 'French', 'Latin'],
	['gl', 'Galician', 'Galego', 'gl', 'Galician', 'Latin'],
	['he', 'Hebrew', 'עברית', 'he', 'Hebrew', 'Hebrew'],
	['hi', 'Hindi', 'हिन्दी', 'hi', 'Hindi', 'Devanagari'],
	['hr', 'Croatian', 'hrvatski jezik', 'hr', 'Serbo-Croatian', 'Latin'],
	['hu', 'Hungarian', 'magyar', 'hu', 'Hungarian', 'Latin'],
	['hy', 'Armenian', 'Հայերեն', 'hy', 'Armenian', 'Armenian'],
	['id', 'Indonesian', 'Bahasa Indonesia', 'id', 'Indonesian', 'Latin'],
	['is', 'Icelandic', 'Íslenska', 'is', 'Icelandic', 'Latin'],
	['it', 'Italian', 'Italiano', 'it', 'Italian', 'Latin'],
	['ka', 'Georgian', 'ქართული', 'ka', 'Georgian', 'Georgian'],
	['kk', 'Kazakh', 'қазақ тілі', 'kk', 'Kazakh', 'Cyrillic'],
	['ko', 'Korean', '한국어', 'ko', 'Korean', 'Hangul'],
	['lt', 'Lithuanian', 'lietuvių kalba', 'lt', 'Lithuanian', 'Latin'],
	['lv', 'Latvian', 'latviešu valoda', 'lv', 'Latvian', 'Latin'],
	['mk', 'Macedonian', 'македонски јазик', 'mk', 'Macedonian', 'Cyrillic'],
	['ml', 'Malayalam', 'മലയാളം', 'ml', 'Malayalam', 'Malayalam'],
	['ms', 'Malay', 'Bahasa Melayu', 'ms', 'Malay', 'Latin'],
	['nl', 'Dutch', 'Nederlands', 'nl', 'Dutch', 'Latin'],
	['no', 'Norwegian', 'Norsk', 'no', 'Norwegian Bokmål', 'Latin'],
	['pl', 'Polish', 'język polski', 'pl', 'Polish', 'Latin'],
	['pt', 'Portuguese', 'Português', 'pt', 'Portuguese', 'Latin'],
	['ro', 'Romanian', 'Română', 'ro', 'Romanian', 'Latin'],
	['ru', 'Russian', 'Русский', 'ru', 'Russian', 'Cyrillic'],
	['si', 'Sinhala', 'සිංහල', 'si', 'Sinhala', 'Sinhala'],
	['sk', 'Slovak', 'slovenčina', 'sk', 'Slovak', 'Latin'],
	['sl', 'Slovenian', 'slovenski jezik', 'sl', 'Slovene', 'Latin'],
	['sq', 'Albanian', 'Shqip', 'sq', 'Albanian', 'Latin'],
	['sr', 'Serbian', 'српски језик', 'sr', 'Serbo-Croatian', 'Latin'],
	['sv', 'Swedish', 'Svenska', 'sv', 'Swedish', 'Latin'],
	['ta', 'Tamil', 'தமிழ்', 'ta', 'Tamil', 'Tamil'],
	['te', 'Telugu', 'తెలుగు', 'te', 'Telugu', 'Telugu'],
	['tl', 'Tagalog', 'Wikang Tagalog', 'tl', 'Tagalog', 'Latin'],
	['tr', 'Turkish', 'Türkçe', 'tr', 'Turkish', 'Latin'],
	['uk', 'Ukrainian', 'Українська', 'uk', 'Ukrainian', 'Cyrillic'],
	['ur', 'Urdu', 'اردو', 'ur', 'Urdu', 'Arabic'],
	['vi', 'Vietnamese', 'Tiếng Việt', 'vi', 'Vietnamese', 'Latin'],
	['zh', 'Chinese', '中文', 'zh_cn', 'Chinese', 'Han']
].map(([code, name, nativeName, freq, wiktionary, script]) => ({
	code,
	name,
	nativeName,
	slug: name.toLowerCase().replace(/[^a-z]+/g, '-'),
	freq,
	wiktionary,
	script
}));
