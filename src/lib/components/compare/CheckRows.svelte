<script lang="ts">
	import { COMPETITORS, type Competitor } from '$lib/data/competitors';
	import { appIcon } from '$lib/data/app-icons';
	import { inview } from '$lib/utils/inview';

	/**
	 * The table further down, as a picture: one row per thing a comparison
	 * turns on, every app's icon in every row, lit where the app has it. The
	 * counts come out of competitors.ts at build time, so a corrected cell
	 * there moves an icon here; nothing is drawn by hand.
	 */
	type Row = { label: string; note: string; has: (c: Competitor) => boolean };

	const ROWS: Row[] = [
		{
			label: 'Talk with real people, free',
			note: 'A person to chat with, without paying a tutor',
			has: (c) => c.people === 'yes' && c.freePlan === 'yes'
		},
		{
			label: 'A free plan you can keep',
			note: 'Not a trial and not one lesson',
			has: (c) => c.freePlan === 'yes'
		},
		{
			label: 'Free lessons or packs to study alone',
			note: 'Something to learn from before anyone replies',
			has: (c) => c.kind === 'course' && c.freePlan === 'yes'
		},
		{
			label: 'No ads on any plan',
			note: 'Not even on the free one',
			has: (c) => c.ads === 'none'
		},
		{
			label: 'Open source',
			note: 'The code is public and yours to run',
			has: (c) => c.openSource
		}
	];

	// LangX has every row; that is the point of the page and true of the app
	// (the self-study row is Echo: free packs, see echo.ts).
	const rows = ROWS.map((r) => {
		const apps = [
			{ name: 'LangX', lit: true },
			...COMPETITORS.map((c) => ({ name: c.name, lit: r.has(c) }))
		];
		return { ...r, apps, count: apps.filter((a) => a.lit).length };
	});
	const total = COMPETITORS.length + 1;

	const named = (apps: { name: string; lit: boolean }[]) =>
		apps
			.filter((a) => a.lit)
			.map((a) => a.name)
			.join(', ');
</script>

<figure class="check" use:inview={{ threshold: 0.25 }}>
	<figcaption class="head">
		<span class="eyebrow">By the numbers</span>
		<h2>Who ticks which box</h2>
		<p>
			All {total} apps on this page, one row per thing that decides a comparison. A lit icon has it.
		</p>
	</figcaption>

	<ul class="rows" role="list">
		{#each rows as r, i}
			<li class="row" style="--i:{i}">
				<div class="label">
					<span class="t">{r.label}</span>
					<span class="n">{r.note}</span>
				</div>
				<div class="icons" role="img" aria-label="{r.count} of {total}: {named(r.apps)}">
					{#each r.apps as a, j}
						{#if appIcon(a.name)}
							<img
								src={appIcon(a.name)}
								alt=""
								title={a.name}
								class:lit={a.lit}
								style="--j:{j}"
								width="32"
								height="32"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<span class="blank" class:lit={a.lit} style="--j:{j}" title={a.name}>{a.name[0]}</span>
						{/if}
					{/each}
				</div>
				<span class="count"><b class="tabular">{r.count}</b> of {total}</span>
			</li>
		{/each}
	</ul>

	<p class="source">
		From the side-by-side table below, checked against each app's own site and store listing in
		September 2026.
	</p>
</figure>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.check {
		margin: 0;
		padding: var(--space-2xl) 0 0;

		@include for-phone-only {
			padding-top: var(--space-xl);
		}
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: 12px;
		max-width: 60ch;

		h2 {
			margin: 0;
			font-weight: 900;
			font-size: clamp(1.625rem, 3vw, 2.125rem);
			line-height: 1.15;
		}

		p {
			margin: 0;
			font-size: 1.0625rem;
			line-height: 1.6;
			color: var(--color--text-shade);
		}
	}

	// Hairline rows, the site's list grammar: the label, the strip of icons,
	// and the count on the right.
	.rows {
		margin: var(--space-md) 0 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--color--border);
	}

	.row {
		display: grid;
		grid-template-columns: minmax(11rem, 15rem) minmax(0, 1fr) auto;
		gap: 10px 24px;
		align-items: center;
		padding: 18px 0;
		border-bottom: 1px solid var(--color--border);

		@include for-tablet-portrait-down {
			grid-template-columns: minmax(0, 1fr) auto;

			.icons {
				grid-column: 1 / -1;
			}
		}
	}

	.label {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.t {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.0625rem;
		line-height: 1.3;
	}

	.n {
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color--text-quiet);
	}

	.icons {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	// Every app in every row; the ones without the thing stay grey and faint,
	// so the strip reads as a bar whose length is the count.
	img,
	.blank {
		width: 32px;
		height: 32px;
		border-radius: 9px;
		box-shadow: 0 0 0 1px var(--color--border);
		filter: grayscale(1);
		opacity: 0.22;
		flex: 0 0 auto;
	}

	.blank {
		display: grid;
		place-items: center;
		background: var(--color--muted);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.875rem;
		color: var(--color--text-quiet);
	}

	// The lit ones pop in, left to right, the first time the rows are seen.
	.lit {
		filter: none;
		opacity: 0;
		transform: scale(0.6);
		transition: opacity 320ms var(--ease-out), transform 420ms var(--ease-out);
		transition-delay: calc(var(--i) * 120ms + var(--j) * 28ms);
	}

	:global(.is-in) .lit {
		opacity: 1;
		transform: none;
	}

	.count {
		font-size: 0.875rem;
		color: var(--color--text-quiet);
		white-space: nowrap;

		b {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.375rem;
			color: var(--color--text);
			margin-right: 2px;
		}
	}

	.source {
		margin: 14px 0 0;
		font-size: 0.8125rem;
		color: var(--color--text-quiet);
		max-width: 70ch;
	}

	@media (prefers-reduced-motion: reduce) {
		.lit {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
