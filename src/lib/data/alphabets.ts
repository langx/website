/**
 * Letter inventories for the languages on this site that are not written in
 * the Latin alphabet.
 *
 * Each row is `letter | name | sound`, where the sound is a rough English
 * approximation and nothing more — a real description needs the IPA and an
 * ear, and this is meant to get somebody to the point of sounding out a word.
 *
 * Chinese is absent on purpose: it has no alphabet, and a list of letters is
 * the wrong shape for it entirely.
 *
 * The scripts here fall into two kinds. An alphabet writes vowels and
 * consonants as equals. An abugida — Devanagari, Bengali, Tamil, Telugu,
 * Malayalam — writes a consonant with a vowel already in it, and marks the
 * other vowels with signs attached to that consonant; the vowels are listed in
 * their standalone forms, which is how they appear at the start of a word.
 */
export interface Letter {
	/** The character itself. */
	c: string;
	/** What the letter is called. */
	name: string;
	/** A rough English approximation of the sound. */
	sound: string;
}

export interface Alphabet {
	/** ISO 639-1 code, matching most-common-words.ts. */
	code: string;
	/** What the script is called. */
	script: string;
	/** 'alphabet' or 'abugida' — they are read differently. */
	kind: 'alphabet' | 'abugida' | 'abjad' | 'featural';
	/** Right to left? */
	rtl?: boolean;
	/** One paragraph on what is distinctive about reading it. */
	note: string;
	groups: { title: string; letters: Letter[] }[];
}

const L = (rows: string) =>
	rows
		.trim()
		.split('\n')
		.map((row) => {
			const [c, name, sound] = row.split('|').map((s) => s.trim());
			return { c, name, sound };
		});

export const ALPHABETS: Alphabet[] = [
	{
		code: 'el',
		script: 'Greek',
		kind: 'alphabet',
		note: 'Twenty-four letters, and the oldest alphabet still in use that writes vowels as letters in their own right — every European alphabet after it, including this one, descends from it. Sigma has a second form, ς, used only at the end of a word.',
		groups: [
			{
				title: 'The alphabet',
				letters: L(`
Α α | alfa | a in father
Β β | vita | v
Γ γ | gamma | soft g, or y before e and i
Δ δ | delta | th in this
Ε ε | epsilon | e in bet
Ζ ζ | zita | z
Η η | ita | ee in see
Θ θ | thita | th in thin
Ι ι | yota | ee in see
Κ κ | kappa | k
Λ λ | lamda | l
Μ μ | mi | m
Ν ν | ni | n
Ξ ξ | ksi | x in box
Ο ο | omikron | o in got
Π π | pi | p
Ρ ρ | ro | rolled r
Σ σ ς | sigma | s
Τ τ | taf | t
Υ υ | ipsilon | ee in see
Φ φ | fi | f
Χ χ | khi | ch in loch
Ψ ψ | psi | ps in lapse
Ω ω | omega | o in got
`)
			}
		]
	},
	{
		code: 'ru',
		script: 'Cyrillic',
		kind: 'alphabet',
		note: 'Thirty-three letters. Several look like Latin ones and are not: В is v, Р is r, С is s, У is u, Н is n. Two letters make no sound of their own — ь softens the consonant before it, ъ separates.',
		groups: [
			{
				title: 'The alphabet',
				letters: L(`
А а | a | a in father
Б б | be | b
В в | ve | v
Г г | ge | g
Д д | de | d
Е е | ye | ye in yes
Ё ё | yo | yo in yonder
Ж ж | zhe | s in measure
З з | ze | z
И и | i | ee in see
Й й | short i | y in boy
К к | ka | k
Л л | el | l
М м | em | m
Н н | en | n
О о | o | o in more
П п | pe | p
Р р | er | rolled r
С с | es | s
Т т | te | t
У у | u | oo in boot
Ф ф | ef | f
Х х | kha | ch in loch
Ц ц | tse | ts in cats
Ч ч | che | ch in chair
Ш ш | sha | sh
Щ щ | shcha | longer, softer sh
Ъ ъ | hard sign | silent, separates
Ы ы | y | i in bill, further back
Ь ь | soft sign | silent, softens
Э э | e | e in bet
Ю ю | yu | u in use
Я я | ya | ya in yard
`)
			}
		]
	},
	{
		code: 'uk',
		script: 'Cyrillic',
		kind: 'alphabet',
		note: 'Thirty-three letters, and not the Russian set: Ukrainian has І, Ї, Є and Ґ, and does not use Ё, Ъ, Ы or Э. Its И sounds like the English i in bill, while І is the ee sound.',
		groups: [
			{
				title: 'The alphabet',
				letters: L(`
А а | a | a in father
Б б | be | b
В в | ve | v, w at the end of a syllable
Г г | he | h
Ґ ґ | ge | hard g
Д д | de | d
Е е | e | e in bet
Є є | ye | ye in yes
Ж ж | zhe | s in measure
З з | ze | z
И и | y | i in bill
І і | i | ee in see
Ї ї | yi | yee
Й й | yot | y in boy
К к | ka | k
Л л | el | l
М м | em | m
Н н | en | n
О о | o | o in more
П п | pe | p
Р р | er | rolled r
С с | es | s
Т т | te | t
У у | u | oo in boot
Ф ф | ef | f
Х х | kha | ch in loch
Ц ц | tse | ts in cats
Ч ч | che | ch in chair
Ш ш | sha | sh
Щ щ | shcha | shch
Ь ь | soft sign | silent, softens
Ю ю | yu | u in use
Я я | ya | ya in yard
`)
			}
		]
	},
	{
		code: 'bg',
		script: 'Cyrillic',
		kind: 'alphabet',
		note: 'Thirty letters — the smallest Cyrillic alphabet here. Bulgarian keeps ъ as a full vowel rather than a silent sign, which is why it turns up in ordinary words like българия.',
		groups: [
			{
				title: 'The alphabet',
				letters: L(`
А а | a | a in father
Б б | bŭ | b
В в | vŭ | v
Г г | gŭ | g
Д д | dŭ | d
Е е | e | e in bet
Ж ж | zhŭ | s in measure
З з | zŭ | z
И и | i | ee in see
Й й | i kratko | y in boy
К к | kŭ | k
Л л | lŭ | l
М м | mŭ | m
Н н | nŭ | n
О о | o | o in more
П п | pŭ | p
Р р | rŭ | rolled r
С с | sŭ | s
Т т | tŭ | t
У у | u | oo in boot
Ф ф | fŭ | f
Х х | hŭ | h
Ц ц | tsŭ | ts in cats
Ч ч | chŭ | ch in chair
Ш ш | shŭ | sh
Щ щ | shtŭ | sht
Ъ ъ | er goljam | u in but
Ь ь | er malŭk | silent, softens
Ю ю | yu | u in use
Я я | ya | ya in yard
`)
			}
		]
	},
	{
		code: 'mk',
		script: 'Cyrillic',
		kind: 'alphabet',
		note: 'Thirty-one letters. Macedonian adds Ѓ, Ќ, Ѕ, Љ, Њ and Џ, and writes every sound with one letter — there are no digraphs and no silent letters, so a word is said exactly as it is spelled.',
		groups: [
			{
				title: 'The alphabet',
				letters: L(`
А а | a | a in father
Б б | be | b
В в | ve | v
Г г | ge | g
Д д | de | d
Ѓ ѓ | gje | soft g, close to j in jury
Е е | e | e in bet
Ж ж | zhe | s in measure
З з | ze | z
Ѕ ѕ | dze | ds in adds
И и | i | ee in see
Ј ј | je | y in yes
К к | ka | k
Л л | el | l
Љ љ | lje | lli in million
М м | em | m
Н н | en | n
Њ њ | nje | ni in onion
О о | o | o in more
П п | pe | p
Р р | er | rolled r
С с | es | s
Т т | te | t
Ќ ќ | kje | soft k, close to ch
У у | u | oo in boot
Ф ф | ef | f
Х х | ha | h
Ц ц | tse | ts in cats
Ч ч | che | ch in chair
Џ џ | dzhe | j in jam
Ш ш | sha | sh
`)
			}
		]
	},
	{
		code: 'he',
		script: 'Hebrew',
		kind: 'abjad',
		rtl: true,
		note: 'Twenty-two letters, written right to left, and ordinarily without vowels — a reader supplies them from the word. Five letters take a different shape at the end of a word, listed beside them here.',
		groups: [
			{
				title: 'The alphabet',
				letters: L(`
א | alef | silent, carries a vowel
ב | bet | b, or v without the dot
ג | gimel | g
ד | dalet | d
ה | he | h
ו | vav | v, or the o and u vowels
ז | zayin | z
ח | het | ch in loch
ט | tet | t
י | yod | y, or the i vowel
כ ך | kaf | k, or ch in loch
ל | lamed | l
מ ם | mem | m
נ ן | nun | n
ס | samekh | s
ע | ayin | silent, carries a vowel
פ ף | pe | p, or f
צ ץ | tsadi | ts in cats
ק | qof | k
ר | resh | r, in the throat
ש | shin | sh, or s
ת | tav | t
`)
			}
		]
	},
	{
		code: 'hy',
		script: 'Armenian',
		kind: 'alphabet',
		note: 'Thirty-nine letters, devised in the fifth century for this language alone and used for nothing else since. It writes vowels and consonants as equals, and the order below is the traditional one.',
		groups: [
			{
				title: 'The alphabet',
				letters: L(`
Ա ա | ayb | a in father
Բ բ | ben | b
Գ գ | gim | g
Դ դ | da | d
Ե ե | ech | ye at the start, e elsewhere
Զ զ | za | z
Է է | eh | e in bet
Ը ը | et | u in but
Թ թ | to | t with a puff of air
Ժ ժ | zhe | s in measure
Ի ի | ini | ee in see
Լ լ | liwn | l
Խ խ | xeh | ch in loch
Ծ ծ | ca | ts
Կ կ | ken | k
Հ հ | ho | h
Ձ ձ | ja | dz
Ղ ղ | ghat | French r
Ճ ճ | cheh | ch
Մ մ | men | m
Յ յ | yi | y
Ն ն | now | n
Շ շ | sha | sh
Ո ո | vo | vo at the start, o elsewhere
Չ չ | cha | ch with a puff of air
Պ պ | peh | p
Ջ ջ | jheh | j in jam
Ռ ռ | ra | rolled r
Ս ս | seh | s
Վ վ | vew | v
Տ տ | tiwn | t
Ր ր | reh | r
Ց ց | co | ts with a puff of air
Ւ ւ | yiwn | w
Փ փ | piwr | p with a puff of air
Ք ք | keh | k with a puff of air
Օ օ | oh | o in more
Ֆ ֆ | feh | f
և | yev | yev, a ligature meaning "and"
`)
			}
		]
	},
	{
		code: 'ka',
		script: 'Georgian',
		kind: 'alphabet',
		note: 'Thirty-three letters and no capitals at all — Georgian simply has no upper case, so a name and a noun look alike. The shapes are rounded and unrelated to any other script in use.',
		groups: [
			{
				title: 'The alphabet',
				letters: L(`
ა | an | a in father
ბ | ban | b
გ | gan | g
დ | don | d
ე | en | e in bet
ვ | vin | v
ზ | zen | z
თ | tan | t with a puff of air
ი | in | ee in see
კ | kan | sharp k
ლ | las | l
მ | man | m
ნ | nar | n
ო | on | o in more
პ | par | sharp p
ჟ | zhan | s in measure
რ | rae | rolled r
ს | san | s
ტ | tar | sharp t
უ | un | oo in boot
ფ | par | p with a puff of air
ქ | kan | k with a puff of air
ღ | ghan | French r
ყ | qar | k from the throat
შ | shin | sh
ჩ | chin | ch with a puff of air
ც | can | ts with a puff of air
ძ | jil | dz
წ | cil | sharp ts
ჭ | char | sharp ch
ხ | xan | ch in loch
ჯ | jhan | j in jam
ჰ | hae | h
`)
			}
		]
	},
	{
		code: 'ko',
		script: 'Hangul',
		kind: 'featural',
		note: "Fourteen consonants and ten vowels, invented in 1443 and designed rather than inherited: a consonant's shape shows where in the mouth it is made. Letters are not written in a line but packed into square blocks, one per syllable, which is why Korean looks dense and is in fact the quickest script here to learn.",
		groups: [
			{
				title: 'Consonants',
				letters: L(`
ㄱ | giyeok | g or k
ㄴ | nieun | n
ㄷ | digeut | d or t
ㄹ | rieul | between r and l
ㅁ | mieum | m
ㅂ | bieup | b or p
ㅅ | siot | s
ㅇ | ieung | silent at the start, ng at the end
ㅈ | jieut | j
ㅊ | chieut | ch
ㅋ | kieuk | k with a puff of air
ㅌ | tieut | t with a puff of air
ㅍ | pieup | p with a puff of air
ㅎ | hieut | h
`)
			},
			{
				title: 'Vowels',
				letters: L(`
ㅏ | a | a in father
ㅑ | ya | ya in yard
ㅓ | eo | u in but
ㅕ | yeo | yu in yummy
ㅗ | o | o in more
ㅛ | yo | yo in yodel
ㅜ | u | oo in boot
ㅠ | yu | you
ㅡ | eu | oo said with a flat mouth
ㅣ | i | ee in see
`)
			}
		]
	},
	{
		code: 'ar',
		script: 'Arabic',
		kind: 'abjad',
		rtl: true,
		note: 'Twenty-eight letters, written right to left and joined up — every letter changes shape depending on whether it opens, sits inside or ends a word, and six of them never join to the left. Short vowels are not written; a reader supplies them.',
		groups: [
			{
				title: 'The alphabet',
				letters: L(`
ا | alif | long a
ب | ba | b
ت | ta | t
ث | tha | th in thin
ج | jim | j
ح | ha | hard h from the throat
خ | kha | ch in loch
د | dal | d
ذ | dhal | th in this
ر | ra | rolled r
ز | zay | z
س | sin | s
ش | shin | sh
ص | sad | heavy s
ض | dad | heavy d
ط | ta | heavy t
ظ | za | heavy th
ع | ayn | a catch deep in the throat
غ | ghayn | French r
ف | fa | f
ق | qaf | k from the back of the throat
ك | kaf | k
ل | lam | l
م | mim | m
ن | nun | n
ه | ha | h
و | waw | w, or long u
ي | ya | y, or long i
`)
			}
		]
	},
	{
		code: 'fa',
		script: 'Arabic',
		kind: 'abjad',
		rtl: true,
		note: 'The Arabic script with four letters added for sounds Arabic does not have — پ, چ, ژ and گ. Persian is an Indo-European language wearing a Semitic script, so the alphabet is borrowed while the grammar underneath is closer to English than to Arabic.',
		groups: [
			{
				title: 'The alphabet',
				letters: L(`
ا | alef | long a
ب | be | b
پ | pe | p
ت | te | t
ث | se | s
ج | jim | j
چ | che | ch
ح | he | h
خ | khe | ch in loch
د | dal | d
ذ | zal | z
ر | re | rolled r
ز | ze | z
ژ | zhe | s in measure
س | sin | s
ش | shin | sh
ص | sad | s
ض | zad | z
ط | ta | t
ظ | za | z
ع | eyn | a catch in the throat
غ | ghayn | French r
ف | fe | f
ق | qaf | French r
ک | kaf | k
گ | gaf | g
ل | lam | l
م | mim | m
ن | nun | n
و | vav | v, or long u
ه | he | h
ی | ye | y, or long i
`)
			}
		]
	},
	{
		code: 'hi',
		script: 'Devanagari',
		kind: 'abugida',
		note: 'A consonant already contains the vowel a; the other vowels are written as marks attached to it, and the standalone vowel letters below appear only at the start of a word. The horizontal line along the top is drawn last and strings the word together.',
		groups: [
			{
				title: 'Vowels',
				letters: L(`
अ | a | u in but
आ | aa | a in father
इ | i | i in bit
ई | ii | ee in see
उ | u | u in put
ऊ | uu | oo in boot
ऋ | ri | ri
ए | e | e in they
ऐ | ai | a in cat
ओ | o | o in go
औ | au | o in dog
`)
			},
			{
				title: 'Consonants',
				letters: L(`
क | ka | k
ख | kha | k with a puff of air
ग | ga | g
घ | gha | g with a puff of air
ङ | nga | ng
च | cha | ch
छ | chha | ch with a puff of air
ज | ja | j
झ | jha | j with a puff of air
ञ | nya | ny in canyon
ट | ta | t, tongue curled back
ठ | tha | the same with a puff of air
ड | da | d, tongue curled back
ढ | dha | the same with a puff of air
ण | na | n, tongue curled back
त | ta | t on the teeth
थ | tha | the same with a puff of air
द | da | d on the teeth
ध | dha | the same with a puff of air
न | na | n
प | pa | p
फ | pha | p with a puff of air
ब | ba | b
भ | bha | b with a puff of air
म | ma | m
य | ya | y
र | ra | r
ल | la | l
व | va | v or w
श | sha | sh
ष | sha | sh, tongue curled back
स | sa | s
ह | ha | h
`)
			}
		]
	},
	{
		code: 'bn',
		script: 'Bengali',
		kind: 'abugida',
		note: 'Like Devanagari it hangs from a line along the top and a consonant carries its vowel already — but the shapes are rounder and the built-in vowel is closer to an o than an a. Bengali has no grammatical gender at all.',
		groups: [
			{
				title: 'Vowels',
				letters: L(`
অ | a | o in got
আ | aa | a in father
ই | i | i in bit
ঈ | ii | ee in see
উ | u | u in put
ঊ | uu | oo in boot
ঋ | ri | ri
এ | e | e in they
ঐ | oi | oy in boy
ও | o | o in go
ঔ | ou | ow in low
`)
			},
			{
				title: 'Consonants',
				letters: L(`
ক | ka | k
খ | kha | k with a puff of air
গ | ga | g
ঘ | gha | g with a puff of air
ঙ | nga | ng
চ | cha | ch
ছ | chha | ch with a puff of air
জ | ja | j
ঝ | jha | j with a puff of air
ঞ | nya | ny in canyon
ট | ta | t, tongue curled back
ঠ | tha | the same with a puff of air
ড | da | d, tongue curled back
ঢ | dha | the same with a puff of air
ণ | na | n, tongue curled back
ত | ta | t on the teeth
থ | tha | the same with a puff of air
দ | da | d on the teeth
ধ | dha | the same with a puff of air
ন | na | n
প | pa | p
ফ | pha | p with a puff of air
ব | ba | b
ভ | bha | b with a puff of air
ম | ma | m
য | ja | j
র | ra | r
ল | la | l
শ | sha | sh
ষ | sha | sh
স | sa | s
হ | ha | h
`)
			}
		]
	},
	{
		code: 'ta',
		script: 'Tamil',
		kind: 'abugida',
		note: 'The smallest consonant set of the Indian scripts here — eighteen, where Devanagari has thirty-three — because Tamil does not write the puffed and voiced pairs separately; whether ப is p or b depends on where it sits in the word. It has been written continuously for more than two thousand years.',
		groups: [
			{
				title: 'Vowels',
				letters: L(`
அ | a | u in but
ஆ | aa | a in father
இ | i | i in bit
ஈ | ii | ee in see
உ | u | u in put
ஊ | uu | oo in boot
எ | e | e in bet
ஏ | ee | e in they
ஐ | ai | i in like
ஒ | o | o in got
ஓ | oo | o in go
ஔ | au | ow in cow
`)
			},
			{
				title: 'Consonants',
				letters: L(`
க | ka | k or g
ங | nga | ng
ச | cha | ch or s
ஞ | nya | ny in canyon
ட | ta | t, tongue curled back
ண | na | n, tongue curled back
த | tha | t on the teeth
ந | na | n on the teeth
ப | pa | p or b
ம | ma | m
ய | ya | y
ர | ra | r
ல | la | l
வ | va | v
ழ | zha | r and l at once, unique to Tamil
ள | la | l, tongue curled back
ற | ra | hard r
ன | na | n
`)
			}
		]
	},
	{
		code: 'te',
		script: 'Telugu',
		kind: 'abugida',
		note: 'Rounded shapes, because it was written on palm leaves that a straight stroke would have split. Most words end in a vowel, which is what earns Telugu its nickname as the Italian of the East.',
		groups: [
			{
				title: 'Vowels',
				letters: L(`
అ | a | u in but
ఆ | aa | a in father
ఇ | i | i in bit
ఈ | ii | ee in see
ఉ | u | u in put
ఊ | uu | oo in boot
ఋ | ru | ru
ఎ | e | e in bet
ఏ | ee | e in they
ఐ | ai | i in like
ఒ | o | o in got
ఓ | oo | o in go
ఔ | au | ow in cow
`)
			},
			{
				title: 'Consonants',
				letters: L(`
క | ka | k
ఖ | kha | k with a puff of air
గ | ga | g
ఘ | gha | g with a puff of air
ఙ | nga | ng
చ | cha | ch
ఛ | chha | ch with a puff of air
జ | ja | j
ఝ | jha | j with a puff of air
ఞ | nya | ny in canyon
ట | ta | t, tongue curled back
ఠ | tha | the same with a puff of air
డ | da | d, tongue curled back
ఢ | dha | the same with a puff of air
ణ | na | n, tongue curled back
త | ta | t on the teeth
థ | tha | the same with a puff of air
ద | da | d on the teeth
ధ | dha | the same with a puff of air
న | na | n
ప | pa | p
ఫ | pha | p with a puff of air
బ | ba | b
భ | bha | b with a puff of air
మ | ma | m
య | ya | y
ర | ra | r
ల | la | l
వ | va | v
శ | sha | sh
ష | sha | sh, tongue curled back
స | sa | s
హ | ha | h
ళ | la | l, tongue curled back
`)
			}
		]
	},
	{
		code: 'ml',
		script: 'Malayalam',
		kind: 'abugida',
		note: 'The roundest of the Indian scripts and the one with the most letters, because Malayalam kept sounds its neighbours dropped. Words run long: it stacks endings the way Turkish does and writes the whole thing as one piece.',
		groups: [
			{
				title: 'Vowels',
				letters: L(`
അ | a | u in but
ആ | aa | a in father
ഇ | i | i in bit
ഈ | ii | ee in see
ഉ | u | u in put
ഊ | uu | oo in boot
ഋ | ru | ru
എ | e | e in bet
ഏ | ee | e in they
ഐ | ai | i in like
ഒ | o | o in got
ഓ | oo | o in go
ഔ | au | ow in cow
`)
			},
			{
				title: 'Consonants',
				letters: L(`
ക | ka | k
ഖ | kha | k with a puff of air
ഗ | ga | g
ഘ | gha | g with a puff of air
ങ | nga | ng
ച | cha | ch
ഛ | chha | ch with a puff of air
ജ | ja | j
ഝ | jha | j with a puff of air
ഞ | nya | ny in canyon
ട | ta | t, tongue curled back
ഠ | tha | the same with a puff of air
ഡ | da | d, tongue curled back
ഢ | dha | the same with a puff of air
ണ | na | n, tongue curled back
ത | ta | t on the teeth
ഥ | tha | the same with a puff of air
ദ | da | d on the teeth
ധ | dha | the same with a puff of air
ന | na | n
പ | pa | p
ഫ | pha | p with a puff of air
ബ | ba | b
ഭ | bha | b with a puff of air
മ | ma | m
യ | ya | y
ര | ra | r
ല | la | l
വ | va | v
ശ | sha | sh
ഷ | sha | sh, tongue curled back
സ | sa | s
ഹ | ha | h
ള | la | l, tongue curled back
ഴ | zha | r and l at once
റ | ra | hard r
`)
			}
		]
	}
];
