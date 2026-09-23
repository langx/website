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
// The trend charts. Search Console keeps sixteen months, so twelve weeks are
// fetched fresh each run and no history has to be carried between runs.
const TREND_WEEKS = 12;
// Query-by-day rows run to one row per query per day it was seen, far more
// than query rows over one week; allow more pages for them.
const TREND_MAX_PAGES = 20;
// A keyword line needs a few points to say anything, and more than a handful
// of small charts buries the rest of the report.
const MIN_TREND_POINTS = 3;
const TREND_KEYWORDS = 6;

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

/** The API's rows as they come (`keys` in dimension order), paging past the 25,000 cap. */
async function fetchRows(call, site, dimensions, { start, end }, maxPages = MAX_PAGES) {
	const out = [];
	for (let page = 0; page < maxPages; page++) {
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
		if (batch.length < ROW_LIMIT) return out;
	}
	// Every page came back full, so there may be more. Said on stderr, so the
	// report itself stays clean, but a short count does not pass unnoticed.
	console.warn(
		`Stopped at ${out.length} rows for [${dimensions}] ${start}..${end}; there may be more.`
	);
	return out;
}

/** Every row for one dimension over one window. */
async function rows(call, site, dimensions, win) {
	return (await fetchRows(call, site, dimensions, win)).map((r) => ({
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

/**
 * The trend weeks, oldest first: seven-day runs ending on the report's last
 * day, so the newest point is exactly the report's "this week". Calendar
 * weeks would leave the newest one half counted most Mondays.
 */
export function trendWeeks(end, count = TREND_WEEKS) {
	const last = new Date(`${end}T00:00:00Z`);
	return Array.from({ length: count }, (_, i) => {
		const weekEnd = shift(last, -(count - 1 - i) * WINDOW_DAYS);
		return { start: day(shift(weekEnd, -(WINDOW_DAYS - 1))), end: day(weekEnd) };
	});
}

// — Trends ———————————————————————————————————————————————————————————————

// Position buckets for the query counts: the top three take most clicks,
// 4–10 is the rest of page one, 11–20 is page two. A query's weekly average
// is rounded first, as Search Console's own interface shows it, so 3.4 counts
// as third.
const BUCKETS = [
	{ label: '1–3', max: 3 },
	{ label: '4–10', max: 10 },
	{ label: '11–20', max: 20 },
	{ label: '21+', max: Infinity }
];

/**
 * Daily rows folded into the trend weeks. `days` has keys [date]; `queryDays`
 * has keys [query, date]. Position is averaged weighted by impressions, the
 * way Search Console averages it across days: a day with one impression at 40
 * should not count as much as a day with a hundred at 5. Pure, like
 * buildReport.
 */
export function weeklyTrends({ weeks, days, queryDays, tracked }) {
	const first = Date.parse(weeks[0].start);
	const weekOf = (date) => {
		const i = Math.floor((Date.parse(date) - first) / (WINDOW_DAYS * 86_400_000));
		return i >= 0 && i < weeks.length ? i : -1;
	};
	const blank = () => weeks.map(() => ({ clicks: 0, impressions: 0, weighted: 0 }));
	const add = (acc, r) => {
		acc.clicks += r.clicks;
		acc.impressions += r.impressions;
		acc.weighted += r.position * r.impressions;
	};
	const settle = ({ clicks, impressions, weighted }) => ({
		clicks,
		impressions,
		position: impressions ? weighted / impressions : null
	});

	const totals = blank();
	for (const r of days) {
		const i = weekOf(r.keys[0]);
		if (i >= 0) add(totals[i], r);
	}

	const byQuery = new Map();
	for (const r of queryDays) {
		const i = weekOf(r.keys[1]);
		if (i < 0) continue;
		if (!byQuery.has(r.keys[0])) byQuery.set(r.keys[0], blank());
		add(byQuery.get(r.keys[0])[i], r);
	}

	const buckets = weeks.map(() => BUCKETS.map(() => 0));
	for (const perWeek of byQuery.values()) {
		perWeek.forEach((w, i) => {
			if (!w.impressions) return;
			const rank = Math.round(w.weighted / w.impressions);
			buckets[i][BUCKETS.findIndex((b) => rank <= b.max)]++;
		});
	}

	return {
		weeks,
		totals: totals.map(settle),
		buckets,
		keywords: tracked
			.filter((k) => byQuery.has(k))
			.map((k) => ({
				keyword: k,
				weeks: byQuery.get(k).map((w) => (w.impressions ? settle(w) : null))
			}))
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

// — Charts ————————————————————————————————————————————————————————————————
// Mermaid `xychart-beta` blocks: GitHub draws them in .md files and in Actions
// job summaries, so the report needs no image files and no chart library.

const shortDate = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	timeZone: 'UTC'
});
const dateLabel = (iso) => shortDate.format(new Date(`${iso}T00:00:00Z`));

// Mermaid strings have no escape for a double quote, and a query can hold one.
const quoted = (s) => `"${String(s).replace(/"/g, "'")}"`;

/** A round number at or above n (1, 2, 2.5 or 5 times a power of ten), for the axis top. */
function roundUp(n) {
	if (!(n > 0)) return 1;
	const unit = 10 ** Math.floor(Math.log10(n));
	return [1, 2, 2.5, 5, 10].map((m) => m * unit).find((v) => v >= n);
}

/**
 * One chart and, under it, the same numbers as a line of text: for a reader
 * whose viewer does not draw Mermaid, and for a search through the history.
 * `points` are [label, value] pairs; a null value (a week with no data) is
 * left out of both, since xychart has no way to draw a gap.
 */
function chart({ title, axis, kind, points, format, small = false }) {
	const shown = points.filter(([, v]) => v != null);
	if (!shown.length) return `_${title}: no data yet._\n`;
	const values = shown.map(([, v]) => v);
	let range;
	if (axis === 'Position') {
		// Written high to low, so rank 1 sits at the top of the chart and a line
		// going up means a better rank, as in Search Console.
		const top = Math.max(1, Math.floor(Math.min(...values)));
		const bottom = Math.max(Math.ceil(Math.max(...values)), top + 1);
		range = `${bottom} --> ${top}`;
	} else {
		range = `0 --> ${roundUp(Math.max(...values))}`;
	}
	const round = (v) => (axis === 'Position' ? Number(v.toFixed(1)) : Math.round(v));
	return [
		'```mermaid',
		// Smaller than the default 700 × 500, so the keyword and bucket charts
		// read as a set of small multiples rather than a wall of full charts.
		...(small ? ['---', 'config:', '  xyChart:', '    width: 500', '    height: 260', '---'] : []),
		'xychart-beta',
		`  title ${quoted(title)}`,
		`  x-axis [${shown.map(([l]) => quoted(l)).join(', ')}]`,
		`  y-axis ${quoted(axis)} ${range}`,
		`  ${kind} [${values.map(round).join(', ')}]`,
		'```',
		'',
		shown.map(([l, v]) => `${l}: ${format(v)}`).join(' · '),
		''
	].join('\n');
}

/** The Trends section: site totals, query counts by rank, and the tracked keywords over time. */
function trendSection(trends) {
	const { weeks, totals, buckets, keywords } = trends;
	const labels = weeks.map((w) => dateLabel(w.end));
	const series = (values) => labels.map((l, i) => [l, values[i]]);
	const out = [];

	out.push('## Trends');
	out.push('');
	out.push(
		`The last ${weeks.length} weeks, ${weeks[0].start} to ${weeks.at(-1).end}. ` +
			'Each point is the seven days ending on the date shown; the last one is this report’s week.'
	);
	out.push('');

	out.push(
		chart({
			title: 'Clicks per week',
			axis: 'Clicks',
			kind: 'bar',
			points: series(totals.map((t) => t.clicks)),
			format: int
		})
	);
	out.push(
		chart({
			title: 'Impressions per week',
			axis: 'Impressions',
			kind: 'bar',
			points: series(totals.map((t) => t.impressions)),
			format: int
		})
	);
	out.push(
		chart({
			title: 'Average position per week',
			axis: 'Position',
			kind: 'line',
			points: series(totals.map((t) => t.position)),
			format: pos
		})
	);
	out.push(
		'Lower is better. The axis runs from the worst position at the bottom to the best at the top, so a rising line is a gain.'
	);
	out.push('');

	out.push('### Queries by position');
	out.push('');
	out.push(
		'How many queries averaged each rank that week. Search Console leaves rare queries out of query rows, so these add up to less than every search.'
	);
	out.push('');
	BUCKETS.forEach((b, j) => {
		out.push(
			chart({
				title: `Queries at position ${b.label}`,
				axis: 'Queries',
				kind: 'bar',
				points: series(buckets.map((w) => w[j])),
				format: int,
				small: true
			})
		);
	});

	const impressionsOf = (k) => k.weeks.reduce((a, w) => a + (w?.impressions ?? 0), 0);
	const enough = keywords.filter((k) => k.weeks.filter(Boolean).length >= MIN_TREND_POINTS);
	const shown = [...enough]
		.sort((a, b) => impressionsOf(b) - impressionsOf(a))
		.slice(0, TREND_KEYWORDS);
	const thin = keywords.length - enough.length;

	out.push('### Tracked keywords over time');
	out.push('');
	out.push(
		`Average position per week for the tracked keywords seen in at least ${MIN_TREND_POINTS} weeks, the ${TREND_KEYWORDS} with the most impressions first. ` +
			'Weeks the keyword was not seen are skipped, so the points are not always evenly spaced in time.' +
			(enough.length > shown.length
				? ` ${enough.length - shown.length} more have enough weeks but fewer impressions.`
				: '') +
			(thin ? ` ${thin} more were seen in fewer than ${MIN_TREND_POINTS} weeks.` : '')
	);
	out.push('');
	if (!shown.length) out.push('_Nothing to show yet._\n');
	for (const k of shown) {
		out.push(
			chart({
				title: k.keyword,
				axis: 'Position',
				kind: 'line',
				points: series(k.weeks.map((w) => w?.position)),
				format: pos,
				small: true
			})
		);
	}

	return out.join('\n');
}

/**
 * The Markdown report. Pure: it takes the rows already fetched, so it can be
 * checked against fixtures without a key. `trends` is weeklyTrends()'s result.
 */
export function buildReport({ site, win, totals, queries, pages, tracked, trends }) {
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

	// Optional, so a caller with only this week's rows still gets a report.
	if (trends) out.push(trendSection(trends));

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
	const weeks = trendWeeks(win.current.end);
	const trendRange = { start: weeks[0].start, end: weeks.at(-1).end };
	const data = {
		site,
		win,
		totals: await fetchBoth([]),
		queries: await fetchBoth(['query']),
		pages: await fetchBoth(['page']),
		tracked,
		trends: weeklyTrends({
			weeks,
			tracked,
			days: await fetchRows(call, site, ['date'], trendRange),
			queryDays: await fetchRows(call, site, ['query', 'date'], trendRange, TREND_MAX_PAGES)
		})
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
