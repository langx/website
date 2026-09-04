/**
 * Builds the search index behind the dictionary search on
 * /tools/most-common-words.
 *
 *   node scripts/wordlists/build-index.ts
 *
 * Reads the .tsv files build.ts already wrote, so it needs no network and runs
 * in seconds. Run it after build.ts, or on its own after editing overrides.
 *
 * The search has to work in two directions on a static site with no server:
 *
 *   agua  -> Spanish, rank 112, "water"          (what is this word?)
 *   water -> agua, eau, Wasser, su, вода…        (how do I say this?)
 *
 * Loading 407,063 rows into the browser is out of the question, so the index is
 * sharded by the first character of the key and the page fetches only the one
 * or two shards a query touches — a few tens of kilobytes, gzipped by the CDN.
 */
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DATA = path.join(ROOT, 'static/data/most-common-words');
const OUT = path.join(DATA, 'idx');

/**
 * The English direction only indexes each language's commonest words. The whole
 * list would triple the index for rows nobody searches an English word to
 * reach, and "how do I say water" is a beginner's question by nature.
 */
const ENGLISH_DEPTH = 2500;
/**
 * The word direction is capped too. Indexing all 407,063 rows produced a 29 MB
 * index on top of the 14 MB of lists — for a long tail nobody types into a
 * cross-language search. The per-language pages still search their whole list.
 */
const WORD_DEPTH = 5000;
/** At most this many meaningful words per gloss become search keys. */
const TOKENS_PER_GLOSS = 3;
/**
 * One row per language per key, keeping that language's commonest word for it.
 * "water" then answers with at most one Spanish word, and the page can say "in
 * 37 languages" and be telling the truth. It is also what keeps the English
 * index from being 12 MB: a token like "person" appears in thousands of
 * glosses, and the second Spanish one is noise.
 */
const ROWS_PER_KEY = 53;
/**
 * A shard past this many bytes is re-split on two characters. Splitting harder
 * makes each fetch smaller but multiplies the file count, and every shard is a
 * git object: at 160 KB the index was 2,149 files. This trades a slightly
 * bigger first fetch — gzip does the real work — for a repo that stays sane.
 */
const SPLIT_ABOVE = 420_000;

/**
 * Dropped from gloss keys: they match half the dictionary and answer nothing.
 * Grammatical descriptions ("third-person singular") are full of them.
 */
const STOP = new Set(
	`a an the of to in on at for with by from as and or not is are be am was were been being
	 it its this that these those he she they them his her their you your i me my we our us
	 used use using form forms formed singular plural masculine feminine neuter nominative
	 accusative dative genitive person first second third indicative present past future
	 tense verb noun adjective adverb pronoun particle prefix suffix denotes indicating
	 indicates expressing expresses something someone one two into onto out up down off
	 which who whom whose what when where how why also more most less least very such
	 does do did done has have had having will would can could may might must shall should
	 there here then than so if but because while during before after above below over under
	 again further once about against between through no nor only own same too s t`.split(/\s+/)
);

interface Meta {
	code: string;
	slug: string;
	name: string;
}

function short(gloss: string): string {
	if (gloss.length <= 46) return gloss;
	const cut = gloss.slice(0, 46);
	const sp = cut.lastIndexOf(' ');
	return (sp > 24 ? cut.slice(0, sp) : cut) + '…';
}

function tokenise(gloss: string): string[] {
	const out: string[] = [];
	for (const raw of gloss.toLowerCase().split(/[^\p{L}\p{M}'’-]+/u)) {
		const t = raw.replace(/^[-'’]+|[-'’]+$/g, '');
		if (t.length < 2 || STOP.has(t)) continue;
		if (!out.includes(t)) out.push(t);
		if (out.length === TOKENS_PER_GLOSS) break;
	}
	return out;
}

/**
 * Latin, Cyrillic, Greek and the digits get a shard per letter, so typing one
 * character already narrows the fetch and a prefix filter runs in memory
 * afterwards. Every other script — Han alone has thousands of distinct first
 * characters — is folded into 24 hashed shards, because a file per ideograph
 * meant 3,361 files for the word index. The client computes the same name.
 */
const PER_LETTER = /[a-z0-9\u00c0-\u024f\u0370-\u03ff\u0400-\u04ff]/u;
const HASHED_SHARDS = 24;

export function bucketOf(key: string): string {
	const c = [...key.toLowerCase()][0] ?? '_';
	if (PER_LETTER.test(c)) return c;
	let h = 0;
	for (const ch of c) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
	return `x${h % HASHED_SHARDS}`;
}

async function run() {
	const manifestSrc = await readFile(path.join(ROOT, 'src/lib/data/most-common-words.ts'), 'utf8');
	const langs: Meta[] = [
		...manifestSrc.matchAll(/code: '([^']+)', slug: '([^']+)', name: "([^"]+)"/g)
	].map((m) => ({ code: m[1], slug: m[2], name: m[3] }));
	if (!langs.length) throw new Error('No languages in the manifest — run build.ts first');

	// key -> rows. Values stay as arrays rather than objects; at this many
	// entries the repeated field names would be most of the file.
	const words = new Map<string, (string | number)[][]>();
	const english = new Map<string, (string | number)[][]>();

	for (const lang of langs) {
		const tsv = await readFile(path.join(DATA, `${lang.slug}.tsv`), 'utf8');
		for (const line of tsv.split('\n').slice(1)) {
			if (!line) continue;
			const [rankRaw, word, gloss] = line.split('\t');
			const rank = Number(rankRaw);
			if (!word || !gloss) continue;

			if (rank <= WORD_DEPTH) {
				const wkey = word.toLowerCase();
				if (!words.has(wkey)) words.set(wkey, []);
				// Truncated: the index is for recognising a word, and the full
				// gloss is one click away on the language page.
				words.get(wkey)!.push([lang.code, rank, short(gloss)]);
			}

			if (rank <= ENGLISH_DEPTH) {
				for (const token of tokenise(gloss)) {
					if (!english.has(token)) english.set(token, []);
					english.get(token)!.push([lang.code, word, rank, short(gloss)]);
				}
			}
		}
	}

	// Commonest first, then one row per language, so a result list is a list of
	// languages rather than a list of near-synonyms from the same one.
	const oneEach = (map: Map<string, (string | number)[][]>, rankAt: number) => {
		for (const [k, rows] of map) {
			rows.sort((a, b) => (a[rankAt] as number) - (b[rankAt] as number));
			const seen = new Set<string>();
			const kept: (string | number)[][] = [];
			for (const r of rows) {
				if (seen.has(r[0] as string)) continue;
				seen.add(r[0] as string);
				kept.push(r);
				if (kept.length === ROWS_PER_KEY) break;
			}
			map.set(k, kept);
		}
	};
	oneEach(words, 1);
	oneEach(english, 2);

	let files = 0;
	let bytes = 0;
	/** Buckets that were split on two characters, for the client to mirror. */
	const split: Record<string, string[]> = { w: [], e: [] };

	for (const [dir, map] of [
		['w', words],
		['e', english]
	] as const) {
		const buckets = new Map<string, Record<string, unknown>>();
		for (const [key, rows] of map) {
			const b = bucketOf(key);
			if (!buckets.has(b)) buckets.set(b, {});
			buckets.get(b)![key] = rows;
		}

		// A first-letter shard can still be enormous — "s" held 622 KB. Split
		// those on two characters so one keystroke never costs half a megabyte.
		for (const [b, obj] of [...buckets]) {
			if (Buffer.byteLength(JSON.stringify(obj)) <= SPLIT_ABOVE) continue;
			if (b.startsWith('x')) continue; // already hashed; no prefix to split on
			buckets.delete(b);
			split[dir].push(b);
			for (const [key, rows] of Object.entries(obj)) {
				const two = [...key].slice(0, 2).join('') || b;
				if (!buckets.has(two)) buckets.set(two, {});
				buckets.get(two)![key] = rows;
			}
		}

		await mkdir(path.join(OUT, dir), { recursive: true });
		for (const [b, obj] of buckets) {
			// Percent-encoded so a Cyrillic or Han shard is a safe path anywhere.
			const body = JSON.stringify(obj);
			await writeFile(path.join(OUT, dir, `${encodeURIComponent(b)}.json`), body);
			files++;
			bytes += Buffer.byteLength(body);
		}
		console.log(`${dir}: ${map.size.toLocaleString('en-US')} keys in ${buckets.size} shards`);
	}

	const stats = {
		languages: langs.length,
		wordKeys: words.size,
		englishKeys: english.size,
		wordDepth: WORD_DEPTH,
		englishDepth: ENGLISH_DEPTH,
		hashedShards: HASHED_SHARDS,
		rowsPerKey: ROWS_PER_KEY,
		split
	};
	await writeFile(path.join(OUT, 'stats.json'), JSON.stringify(stats));
	console.log(
		`${files} files, ${(bytes / 1048576).toFixed(1)} MB total ` +
			`(a query fetches one shard, not the set)`
	);
}

await rm(OUT, { recursive: true, force: true });
await run();
