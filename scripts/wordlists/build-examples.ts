/**
 * Attaches one real example sentence, with an English translation, to the
 * commonest words of each language.
 *
 *   node --max-old-space-size=8192 scripts/wordlists/build-examples.ts
 *
 * Source: Tatoeba (https://tatoeba.org), CC BY 2.0 FR. Sentences are written
 * by people rather than generated, which is the point — a frequency list tells
 * you a word is common, and a sentence tells you what it does.
 *
 * Downloads are cached under .cache/tatoeba so a re-run costs nothing. The
 * links file is 143 MB compressed and is streamed once for every language, not
 * once per language: holding a translation map for eight million sentences at
 * the same time as the sentence texts is what needs the larger heap above.
 */
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { WORDLIST_LANGUAGES } from './languages.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const CACHE = path.join(ROOT, '.cache/tatoeba');
const OUT = path.join(ROOT, 'static/data/most-common-words/ex');
const BASE = 'https://downloads.tatoeba.org/exports';

/** Examples are only worth carrying for the words a page actually renders. */
const DEPTH = 1000;
/** Long enough to show the word working, short enough to read in a table. */
const MIN_LEN = 12;
const MAX_LEN = 90;

async function cached(name: string, url: string) {
	await mkdir(CACHE, { recursive: true });
	const file = path.join(CACHE, name);
	try {
		if ((await stat(file)).size > 0) return file;
	} catch {
		// not cached yet
	}
	process.stdout.write(`  downloading ${name}… `);
	const res = await fetch(url);
	if (!res.ok || !res.body) throw new Error(`${res.status} ${url}`);
	await pipeline(Readable.fromWeb(res.body as never), createWriteStream(file));
	console.log('done');
	return file;
}

/** Streams a .bz2 through the system bunzip2 — Node has no built-in decoder. */
function bunzip(file: string) {
	const proc = spawn('bunzip2', ['-c', file], { stdio: ['ignore', 'pipe', 'ignore'] });
	return createInterface({ input: proc.stdout, crlfDelay: Infinity });
}

async function run() {
	// 1. Every English sentence, by id.
	console.log('English sentences…');
	const english = new Map<number, string>();
	for await (const line of bunzip(
		await cached('eng.tsv.bz2', `${BASE}/per_language/eng/eng_sentences.tsv.bz2`)
	)) {
		const tab = line.indexOf('\t');
		const tab2 = line.indexOf('\t', tab + 1);
		if (tab2 < 0) continue;
		english.set(Number(line.slice(0, tab)), line.slice(tab2 + 1));
	}
	console.log(`  ${english.size.toLocaleString('en-US')} English sentences`);

	// 2. One pass over the links: for anything translated into English, remember
	//    which English sentence it points at.
	console.log('Translation links…');
	const toEnglish = new Map<number, number>();
	for await (const line of bunzip(await cached('links.tar.bz2', `${BASE}/links.tar.bz2`))) {
		const tab = line.lastIndexOf('\t');
		if (tab < 1) continue;
		const a = Number(line.slice(line.lastIndexOf('\t', tab - 1) + 1, tab));
		const b = Number(line.slice(tab + 1));
		if (!a || !b) continue;
		if (english.has(b) && !toEnglish.has(a)) toEnglish.set(a, b);
	}
	console.log(`  ${toEnglish.size.toLocaleString('en-US')} sentences have an English translation`);

	await mkdir(OUT, { recursive: true });
	const summary: string[] = [];

	for (const lang of WORDLIST_LANGUAGES) {
		let listed: string;
		try {
			listed = await readFile(
				path.join(ROOT, 'static/data/most-common-words', `${lang.slug}.tsv`),
				'utf8'
			);
		} catch {
			continue; // language has no list; nothing to annotate
		}

		let file: string;
		try {
			file = await cached(
				`${lang.iso3}.tsv.bz2`,
				`${BASE}/per_language/${lang.iso3}/${lang.iso3}_sentences.tsv.bz2`
			);
		} catch {
			console.log(`  ${lang.code}: no Tatoeba export`);
			continue;
		}

		// Only sentences that carry an English translation are any use here.
		const usable: [string, string][] = [];
		for await (const line of bunzip(file)) {
			const tab = line.indexOf('\t');
			const tab2 = line.indexOf('\t', tab + 1);
			if (tab2 < 0) continue;
			const id = Number(line.slice(0, tab));
			const text = line.slice(tab2 + 1);
			if (text.length < MIN_LEN || text.length > MAX_LEN) continue;
			const eng = toEnglish.get(id);
			if (eng === undefined) continue;
			usable.push([text, english.get(eng) as string]);
		}

		const wanted = listed
			.split('\n')
			.slice(1, DEPTH + 1)
			.filter(Boolean)
			.map((line) => line.split('\t'));

		const rows: string[] = [];
		if (lang.script === 'Han') {
			// Chinese is written without spaces, so there are no tokens to index.
			// Scanning for the substring is slower but it is the only thing that
			// works — token matching found an example for 13% of the words.
			for (const [rank, word] of wanted) {
				let best: [string, string] | undefined;
				for (const pair of usable) {
					if (!pair[0].includes(word)) continue;
					if (!best || pair[0].length < best[0].length) best = pair;
				}
				if (best) rows.push(`${rank}\t${best[0]}\t${best[1]}`);
			}
		} else {
			// Index by lowercased word so a lookup is a map hit rather than a scan
			// of every sentence for every word.
			const byWord = new Map<string, [string, string]>();
			for (const pair of usable) {
				for (const token of pair[0].toLowerCase().split(/[^\p{L}\p{M}'’-]+/u)) {
					if (token.length < 2) continue;
					const existing = byWord.get(token);
					// Shortest wins: it is the one that reads as an example.
					if (!existing || pair[0].length < existing[0].length) byWord.set(token, pair);
				}
			}
			for (const [rank, word] of wanted) {
				const hit = byWord.get(word.toLowerCase());
				if (hit) rows.push(`${rank}\t${hit[0]}\t${hit[1]}`);
			}
		}

		if (rows.length) {
			await writeFile(
				path.join(OUT, `${lang.slug}.tsv`),
				`rank\tsentence\tenglish\n${rows.join('\n')}\n`
			);
		}
		const pct = Math.round((rows.length / DEPTH) * 100);
		summary.push(`${lang.code}:${pct}%`);
		console.log(
			`  ${lang.code} ${lang.name}: ${rows.length}/${DEPTH} of the top words have an example (${pct}%)`
		);
	}

	console.log(`\n${summary.length} languages: ${summary.join(' ')}`);
}

await run();
