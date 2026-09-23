// Weekly Search Console report: where langx.io ranks, and what moved.
//
// Reads Google's own numbers through the Search Console API with a service
// account, compares the last seven days with the seven before, and writes a
// Markdown report. No dependencies: the service-account token is a JWT signed
// with node:crypto, and everything else is fetch.
//
// Locally, with the key file kept outside the repository:
//
//   GSC_KEY_FILE=~/Developer/langx/secrets/gsc.json node scripts/gsc/rankings.mjs
//
// In CI the key arrives as the JSON itself, in GSC_KEY (the GSC_SERVICE_ACCOUNT_KEY
// secret; see .github/workflows/rankings.yml). `--out <dir>` also writes
// `<date>.md`, `<date>.json` and `latest.md` there. GSC_SITE picks the property
// (`sc-domain:langx.io` or `https://langx.io/`) when the account sees both.
//
// The key is only ever parsed and used to sign; nothing here prints it.
//
// Setting up the account, once:
//   1. Google Cloud console: a project, the "Google Search Console API"
//      enabled, and a service account in it with a JSON key.
//   2. Search Console → langx.io → Settings → Users and permissions: add the
//      service account's email (…@….iam.gserviceaccount.com), Restricted.
//   3. GitHub → Settings → Secrets and variables → Actions: the whole JSON
//      file as the GSC_SERVICE_ACCOUNT_KEY secret.
// The weekly reports then collect on the `seo-rankings` branch.
import { createSign } from 'node:crypto';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://www.googleapis.com/webmasters/v3';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

// Search Console finishes a day's numbers two to three days later. Ending the
// window three days back keeps a half-counted day from reading as a drop.
const LAG_DAYS = 3;
const WINDOW_DAYS = 7;
// 25,000 is the API's ceiling for one request; a few pages covers every query
// a site this size gets.
const ROW_LIMIT = 25000;
const MAX_PAGES = 4;
// Below this, one extra impression swings the average position by whole
// places, and the movers list fills with noise.
const MIN_IMPRESSIONS = 20;

const here = fileURLToPath(new URL('.', import.meta.url));

// — Auth ——————————————————————————————————————————————————————————————————

const b64url = (input) => Buffer.from(input).toString('base64url');

/** The service-account key, from GSC_KEY (JSON) or GSC_KEY_FILE (a path). */
export function loadKey(env = process.env) {
	let raw = env.GSC_KEY;
	if (!raw && env.GSC_KEY_FILE) {
		raw = readFileSync(env.GSC_KEY_FILE.replace(/^~(?=\/)/, homedir()), 'utf8');
	}
	if (!raw) {
		throw new Error(
			'No service-account key: set GSC_KEY_FILE to the key file, or GSC_KEY to its contents.'
		);
	}
	const key = JSON.parse(raw);
	if (!key.client_email || !key.private_key) {
		throw new Error('The key has no client_email or private_key; is it a service-account key?');
	}
	return key;
}

/** A signed JWT asking for read-only Search Console access, valid for an hour. */
export function signAssertion(key, now = Math.floor(Date.now() / 1000)) {
	const header = { alg: 'RS256', typ: 'JWT', kid: key.private_key_id };
	const claims = { iss: key.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 };
	const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`;
	const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');
	return `${unsigned}.${signature}`;
}

async function accessToken(key) {
	const res = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			assertion: signAssertion(key)
		})
	});
	const body = await res.json();
	if (!res.ok)
		throw new Error(
			`Token request failed (${res.status}): ${body.error_description ?? body.error}`
		);
	return body.access_token;
}

// — Search Console ———————————————————————————————————————————————————————

function client(token) {
	return async (path, body) => {
		const res = await fetch(`${API}${path}`, {
			method: body ? 'POST' : 'GET',
			headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
			body: body ? JSON.stringify(body) : undefined
		});
		const json = await res.json();
		if (!res.ok)
			throw new Error(`Search Console ${path} failed (${res.status}): ${json.error?.message}`);
		return json;
	};
}

/**
 * The property to read. A Domain property covers http, https and www at once,
 * so it wins when the service account has been added to both kinds.
 */
async function pickSite(call, wanted) {
	if (wanted) return wanted;
	const { siteEntry = [] } = await call('/sites');
	const sites = siteEntry.map((s) => s.siteUrl);
	const site =
		sites.find((s) => s === 'sc-domain:langx.io') ?? sites.find((s) => /\/\/langx\.io\/?$/.test(s));
	if (!site) {
		throw new Error(
			sites.length
				? `The service account sees ${sites.join(
						', '
				  )}, but not langx.io. Set GSC_SITE, or add it to the langx.io property.`
				: 'The service account sees no Search Console property. Add its email as a user on langx.io in Search Console.'
		);
	}
	return site;
}

/** Every row for one dimension over one window, paging past the 25,000 cap. */
async function rows(call, site, dimensions, { start, end }) {
	const out = [];
	for (let page = 0; page < MAX_PAGES; page++) {
		const { rows: batch = [] } = await call(
			`/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
			{
				startDate: start,
				endDate: end,
				dimensions,
				type: 'web',
				rowLimit: ROW_LIMIT,
				startRow: page * ROW_LIMIT
			}
		);
		out.push(...batch);
		if (batch.length < ROW_LIMIT) break;
	}
	return out.map((r) => ({
		key: r.keys?.[0] ?? '',
		clicks: r.clicks,
		impressions: r.impressions,
		ctr: r.ctr,
		position: r.position
	}));
}

// — Windows ——————————————————————————————————————————————————————————————

const day = (date) => date.toISOString().slice(0, 10);
const shift = (date, days) => new Date(date.getTime() + days * 86_400_000);

/** This week and the week before, both ending before the unfinished days. */
export function windows(today = new Date()) {
	const end = shift(today, -LAG_DAYS);
	const start = shift(end, -(WINDOW_DAYS - 1));
	return {
		current: { start: day(start), end: day(end) },
		previous: { start: day(shift(start, -WINDOW_DAYS)), end: day(shift(end, -WINDOW_DAYS)) }
	};
}

// — Report ————————————————————————————————————————————————————————————————

const nf = new Intl.NumberFormat('en-US');
const int = (n) => nf.format(Math.round(n ?? 0));
const pos = (n) => (n == null ? '—' : n.toFixed(1));
const pct = (n) => (n == null ? '—' : `${(n * 100).toFixed(1)}%`);
const cell = (s) => String(s).replace(/\|/g, '\\|');

/** Places gained (a smaller position is better, so the sign is flipped). */
function moved(now, before) {
	if (now == null || before == null) return '';
	const gain = before - now;
	if (Math.abs(gain) < 0.05) return ' (=)';
	return gain > 0 ? ` (↑${gain.toFixed(1)})` : ` (↓${(-gain).toFixed(1)})`;
}

function sum(list) {
	const clicks = list.reduce((a, r) => a + r.clicks, 0);
	const impressions = list.reduce((a, r) => a + r.impressions, 0);
	return { clicks, impressions, ctr: impressions ? clicks / impressions : null };
}

function table(head, lines) {
	if (!lines.length) return '_Nothing to show yet._\n';
	return (
		[
			`| ${head.join(' | ')} |`,
			`| ${head.map(() => '---').join(' | ')} |`,
			...lines.map((l) => `| ${l.map(cell).join(' | ')} |`)
		].join('\n') + '\n'
	);
}

const pathOf = (url) => url.replace(/^https?:\/\/(www\.)?langx\.io/, '') || '/';

/**
 * The Markdown report. Pure: it takes the rows already fetched, so it can be
 * checked against fixtures without a key.
 */
export function buildReport({ site, win, totals, queries, pages, tracked }) {
	const prevQuery = new Map(queries.previous.map((r) => [r.key, r]));
	const prevPage = new Map(pages.previous.map((r) => [r.key, r]));
	const nowQuery = new Map(queries.current.map((r) => [r.key, r]));

	const t = totals.current[0] ?? sum(queries.current);
	const tp = totals.previous[0] ?? sum(queries.previous);

	const byClicks = (a, b) => b.clicks - a.clicks || b.impressions - a.impressions;
	const steady = queries.current.filter(
		(r) =>
			r.impressions >= MIN_IMPRESSIONS &&
			(prevQuery.get(r.key)?.impressions ?? 0) >= MIN_IMPRESSIONS
	);
	const gain = (r) => prevQuery.get(r.key).position - r.position;

	const out = [];
	out.push(`# langx.io rankings, ${win.current.start} to ${win.current.end}`);
	out.push('');
	out.push(
		`Google Search Console, web search, property \`${site}\`. Compared with ${win.previous.start} to ${win.previous.end}. ` +
			'Position is the average rank when the page was shown; ↑ means it moved up. ' +
			`Queries with fewer than ${MIN_IMPRESSIONS} impressions in either week are left out of the movers, since one search can swing them by whole places. ` +
			'Google hides rare queries, so a tracked keyword can be missing even when the page ranks for it.'
	);
	out.push('');

	out.push('## Totals');
	out.push('');
	out.push(
		table(
			['', 'This week', 'Week before'],
			[
				['Clicks', int(t.clicks), int(tp.clicks)],
				['Impressions', int(t.impressions), int(tp.impressions)],
				['CTR', pct(t.ctr), pct(tp.ctr)],
				['Average position', pos(t.position), pos(tp.position)]
			]
		)
	);

	out.push('## Tracked keywords');
	out.push('');
	out.push(
		table(
			['Keyword', 'Position', 'Clicks', 'Impressions'],
			tracked.map((k) => {
				const now = nowQuery.get(k);
				const before = prevQuery.get(k);
				return now
					? [
							k,
							`${pos(now.position)}${moved(now.position, before?.position)}`,
							int(now.clicks),
							int(now.impressions)
					  ]
					: [k, before ? `— (was ${pos(before.position)})` : '—', '0', '0'];
			})
		)
	);

	out.push('## Top queries');
	out.push('');
	out.push(
		table(
			['Query', 'Position', 'Clicks', 'Impressions', 'CTR'],
			[...queries.current]
				.sort(byClicks)
				.slice(0, 25)
				.map((r) => [
					r.key,
					`${pos(r.position)}${moved(r.position, prevQuery.get(r.key)?.position)}`,
					int(r.clicks),
					int(r.impressions),
					pct(r.ctr)
				])
		)
	);

	const moverRow = (r) => [
		r.key,
		`${pos(prevQuery.get(r.key).position)} → ${pos(r.position)}`,
		int(r.impressions)
	];
	out.push('## Moved up');
	out.push('');
	out.push(
		table(
			['Query', 'Position', 'Impressions'],
			steady
				.filter((r) => gain(r) >= 1)
				.sort((a, b) => gain(b) - gain(a))
				.slice(0, 15)
				.map(moverRow)
		)
	);
	out.push('## Moved down');
	out.push('');
	out.push(
		table(
			['Query', 'Position', 'Impressions'],
			steady
				.filter((r) => gain(r) <= -1)
				.sort((a, b) => gain(a) - gain(b))
				.slice(0, 15)
				.map(moverRow)
		)
	);

	// Page two, seen often: the queries where a better title or a few more
	// links would move the most clicks.
	out.push('## Close to page one');
	out.push('');
	out.push(
		table(
			['Query', 'Position', 'Impressions', 'Clicks'],
			queries.current
				.filter((r) => r.position >= 8 && r.position <= 20 && r.impressions >= MIN_IMPRESSIONS)
				.sort((a, b) => b.impressions - a.impressions)
				.slice(0, 20)
				.map((r) => [r.key, pos(r.position), int(r.impressions), int(r.clicks)])
		)
	);

	out.push('## New this week');
	out.push('');
	out.push(
		table(
			['Query', 'Position', 'Impressions'],
			queries.current
				.filter((r) => r.impressions >= MIN_IMPRESSIONS && !prevQuery.has(r.key))
				.sort((a, b) => b.impressions - a.impressions)
				.slice(0, 15)
				.map((r) => [r.key, pos(r.position), int(r.impressions)])
		)
	);

	out.push('## Top pages');
	out.push('');
	out.push(
		table(
			['Page', 'Position', 'Clicks', 'Impressions', 'CTR'],
			[...pages.current]
				.sort(byClicks)
				.slice(0, 25)
				.map((r) => [
					pathOf(r.key),
					`${pos(r.position)}${moved(r.position, prevPage.get(r.key)?.position)}`,
					int(r.clicks),
					int(r.impressions),
					pct(r.ctr)
				])
		)
	);

	return out.join('\n');
}

// — Run ———————————————————————————————————————————————————————————————————

async function main() {
	const args = process.argv.slice(2);
	const outIndex = args.indexOf('--out');
	const outDir = outIndex >= 0 ? resolve(args[outIndex + 1]) : null;

	const call = client(await accessToken(loadKey()));
	const site = await pickSite(call, process.env.GSC_SITE);
	const win = windows();
	const tracked = JSON.parse(readFileSync(join(here, 'tracked.json'), 'utf8')).keywords;

	const fetchBoth = async (dimensions) => ({
		current: await rows(call, site, dimensions, win.current),
		previous: await rows(call, site, dimensions, win.previous)
	});
	const data = {
		site,
		win,
		totals: await fetchBoth([]),
		queries: await fetchBoth(['query']),
		pages: await fetchBoth(['page']),
		tracked
	};
	const report = buildReport(data);

	console.log(report);
	if (process.env.GITHUB_STEP_SUMMARY)
		appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
	if (outDir) {
		mkdirSync(outDir, { recursive: true });
		const stamp = win.current.end;
		writeFileSync(join(outDir, `${stamp}.md`), report + '\n');
		writeFileSync(join(outDir, 'latest.md'), report + '\n');
		// The raw rows, so a later question ("when did this query first show
		// up?") can be answered from history instead of from memory.
		writeFileSync(
			join(outDir, `${stamp}.json`),
			JSON.stringify({
				site,
				window: win.current,
				totals: data.totals.current,
				queries: data.queries.current,
				pages: data.pages.current
			}) + '\n'
		);
	}
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main().catch((err) => {
		console.error(err.message);
		process.exit(1);
	});
}
