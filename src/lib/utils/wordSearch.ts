/**
 * Client for the sharded word index under /data/most-common-words/idx.
 *
 * The site is static, so there is no server to ask. Instead the index is split
 * into shards by the first character of the key, and a query fetches only the
 * shard it lands in — a hundred kilobytes or so, gzipped by the CDN, then kept
 * in memory for the rest of the visit.
 *
 * `bucket()` MUST stay in step with `bucketOf()` in
 * scripts/wordlists/build-index.ts. If they disagree the lookup fetches a file
 * that is not there and the search silently returns nothing.
 */

/** Latin, Cyrillic and Greek letters plus digits get a shard each. */
const PER_LETTER = /[a-z0-9À-ɏͰ-ϿЀ-ӿ]/u;
const HASHED_SHARDS = 24;
const BASE = '/data/most-common-words/idx';

export interface WordHit {
	/** ISO 639-1 code of the language the word belongs to. */
	code: string;
	/** The same for every hit in a group — carried so both result shapes match. */
	word: string;
	rank: number;
	gloss: string;
}

export interface EnglishHit {
	code: string;
	word: string;
	rank: number;
	gloss: string;
}

interface Stats {
	wordDepth: number;
	englishDepth: number;
	/** Bucket names that were re-split on two characters. */
	split: { w: string[]; e: string[] };
}

let stats: Stats | null = null;
const shards = new Map<string, Record<string, unknown[][]>>();
const inflight = new Map<string, Promise<unknown>>();

/** Deduplicated fetch: three keystrokes into one shard make one request. */
function once<T>(key: string, run: () => Promise<T>): Promise<T> {
	if (!inflight.has(key))
		inflight.set(
			key,
			run().catch(() => null)
		);
	return inflight.get(key) as Promise<T>;
}

async function loadStats(): Promise<Stats | null> {
	if (stats) return stats;
	const s = await once('stats', async () => {
		const res = await fetch(`${BASE}/stats.json`);
		return res.ok ? ((await res.json()) as Stats) : null;
	});
	stats = s;
	return s;
}

function firstChar(key: string): string {
	return [...key.toLowerCase()][0] ?? '_';
}

function bucket(key: string, split: string[]): string {
	const c = firstChar(key);
	if (!PER_LETTER.test(c)) {
		let h = 0;
		for (const ch of c) h = (h * 31 + (ch.codePointAt(0) as number)) >>> 0;
		return `x${h % HASHED_SHARDS}`;
	}
	// Oversized letters were split again on the first two characters.
	if (split.includes(c)) return [...key.toLowerCase()].slice(0, 2).join('') || c;
	return c;
}

async function loadShard(dir: 'w' | 'e', key: string) {
	const s = await loadStats();
	if (!s) return null;
	const name = bucket(key, s.split[dir]);
	const cacheKey = `${dir}/${name}`;
	if (shards.has(cacheKey)) return shards.get(cacheKey)!;
	const data = await once(cacheKey, async () => {
		const res = await fetch(`${BASE}/${dir}/${encodeURIComponent(name)}.json`);
		return res.ok ? await res.json() : null;
	});
	if (data) shards.set(cacheKey, data as Record<string, unknown[][]>);
	return data as Record<string, unknown[][]> | null;
}

/**
 * A query needs at least this many characters. One character would fetch a
 * shard on every keystroke of a word the visitor has not finished typing.
 */
export const MIN_QUERY = 2;

/** What does this word mean, and whose is it? */
export async function lookupWord(query: string): Promise<{ key: string; hits: WordHit[] }[]> {
	const q = query.trim().toLowerCase();
	if (q.length < MIN_QUERY) return [];
	const shard = await loadShard('w', q);
	if (!shard) return [];
	const out: { key: string; hits: WordHit[] }[] = [];
	for (const key of Object.keys(shard)) {
		if (!key.startsWith(q)) continue;
		out.push({
			key,
			hits: (shard[key] as [string, number, string][]).map(([code, rank, gloss]) => ({
				code,
				word: key,
				rank,
				gloss
			}))
		});
		if (out.length > 40) break;
	}
	// Exact match first, then shortest — "water" before "watercolour".
	out.sort((a, b) => (a.key === q ? -1 : b.key === q ? 1 : a.key.length - b.key.length));
	return out.slice(0, 4);
}

/** How do you say this English word in each language? */
export async function lookupEnglish(query: string): Promise<{ key: string; hits: EnglishHit[] }[]> {
	const q = query.trim().toLowerCase();
	if (q.length < MIN_QUERY) return [];
	const shard = await loadShard('e', q);
	if (!shard) return [];
	const out: { key: string; hits: EnglishHit[] }[] = [];
	for (const key of Object.keys(shard)) {
		if (!key.startsWith(q)) continue;
		out.push({
			key,
			hits: (shard[key] as [string, string, number, string][]).map(([code, word, rank, gloss]) => ({
				code,
				word,
				rank,
				gloss
			}))
		});
		if (out.length > 40) break;
	}
	out.sort((a, b) => (a.key === q ? -1 : b.key === q ? 1 : a.key.length - b.key.length));
	return out.slice(0, 3);
}
