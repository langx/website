<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Button from '$lib/components/atoms/Button.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import Cell from './Cell.svelte';
	import { COMPETITORS, type Competitor } from '$lib/data/competitors';
	import { appIcon } from '$lib/data/app-icons';
	import { ADS, FREE, KIND_LABEL, LANGX, PEOPLE, verdict } from '$lib/data/compare';

	/**
	 * The hook at the top of /compare. Most visitors arrive with one app in
	 * mind — "open source alternative to Tandem", "LangX vs HelloTalk" — so
	 * the first thing after the ask is that app, next to LangX, in six rows.
	 *
	 * Before hydration every chip is a link to the app's own comparison post,
	 * so the row is a plain list of links for crawlers and for anyone without
	 * script; once hydrated the chips become buttons that swap the panel in
	 * place. Every word in the panel comes from competitors.ts, so it is as
	 * true as the table further down and never has a claim of its own.
	 */
	const apps = COMPETITORS;
	let selected: Competitor = apps[0];
	let hydrated = false;
	let reduce = false;

	const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

	onMount(() => {
		hydrated = true;
		reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		// `/compare?vs=hellotalk` opens on that app, for links from the posts.
		const vs = new URLSearchParams(window.location.search).get('vs');
		if (vs) {
			const hit = apps.find((c) => key(c.name) === key(vs));
			if (hit) selected = hit;
		}
	});

	$: icon = appIcon(selected.name);
</script>

<section id="pick" class="pick" aria-labelledby="pick-title">
	<header class="head">
		<span class="eyebrow">Head to head</span>
		<h2 id="pick-title">Which app are you comparing?</h2>
		<p>Pick one. The same six rows for every app, and the full write-up one tap further.</p>
	</header>

	<ul class="chips" role="list">
		{#each apps as c (c.slug)}
			<li>
				{#if hydrated}
					<button
						type="button"
						class="chip"
						class:on={c === selected}
						class:bare={!appIcon(c.name)}
						aria-pressed={c === selected}
						on:click={() => (selected = c)}
					>
						{#if appIcon(c.name)}
							<img class="icon" src={appIcon(c.name)} alt="" width="26" height="26" loading="lazy" />
						{/if}
						{c.name}
					</button>
				{:else}
					<a class="chip" class:on={c === selected} class:bare={!appIcon(c.name)} href="/{c.slug}">
						{#if appIcon(c.name)}
							<img class="icon" src={appIcon(c.name)} alt="" width="26" height="26" loading="lazy" />
						{/if}
						{c.name}
					</a>
				{/if}
			</li>
		{/each}
	</ul>

	<div class="panel" aria-live="polite">
		{#key selected.slug}
			<div class="duel" in:fly={{ y: 10, duration: reduce ? 0 : 260 }}>
				<div class="heads">
					<div class="side us">
						<img class="app" src={appIcon('LangX')} alt="" width="56" height="56" />
						<span class="name">LangX</span>
						<span class="what">{LANGX.what}</span>
					</div>
					<span class="vs" aria-hidden="true">vs</span>
					<div class="side them">
						{#if icon}
							<img class="app" src={icon} alt="" width="56" height="56" />
						{:else}
							<span class="app blank" aria-hidden="true">{selected.name[0]}</span>
						{/if}
						<span class="name">{selected.name}</span>
						<span class="what">{selected.what}</span>
					</div>
				</div>

				<div class="rows" role="table" aria-label="LangX and {selected.name}, side by side">
					<div class="row" role="row">
						<span class="k" role="rowheader">Kind</span>
						<span class="v" role="cell">{LANGX.kind}</span>
						<span class="v" role="cell">{KIND_LABEL[selected.kind]}</span>
					</div>
					<div class="row" role="row">
						<span class="k" role="rowheader">Talk with real people</span>
						<span class="v" role="cell"><Cell {...LANGX.people} /></span>
						<span class="v" role="cell"><Cell {...PEOPLE[selected.people]} /></span>
					</div>
					<div class="row" role="row">
						<span class="k" role="rowheader">Free plan</span>
						<span class="v" role="cell">
							<Cell {...LANGX.freePlan} />
							<span class="note">{LANGX.free}</span>
						</span>
						<span class="v" role="cell">
							<Cell {...FREE[selected.freePlan]} />
							<span class="note">{selected.free}</span>
						</span>
					</div>
					<div class="row" role="row">
						<span class="k" role="rowheader">Ads</span>
						<span class="v" role="cell"><Cell {...LANGX.ads} /></span>
						<span class="v" role="cell"><Cell {...ADS[selected.ads]} /></span>
					</div>
					<div class="row" role="row">
						<span class="k" role="rowheader">Open source</span>
						<span class="v" role="cell"><Cell {...LANGX.openSource} /></span>
						<span class="v" role="cell">
							<Cell mark={selected.openSource ? 'yes' : 'no'} text={selected.openSource ? 'Yes' : 'No'} />
						</span>
					</div>
					<div class="row" role="row">
						<span class="k" role="rowheader">Best for</span>
						<span class="v" role="cell">{LANGX.bestFor}</span>
						<span class="v" role="cell">{selected.bestFor}</span>
					</div>
				</div>

				<p class="verdict">{verdict(selected)}</p>

				<div class="actions">
					<Button href="/{selected.slug}" variant="secondary" size="md">
						Read LangX vs {selected.name}
						<UiIcon name="arrow-right" size={18} />
					</Button>
					<Button href="https://get.langx.io" variant="ghost" size="md">Try LangX free</Button>
				</div>
			</div>
		{/key}
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.pick {
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

	// One pill per app, its store icon in the rounded end. The chosen one is
	// the app's selected filter chip: ink, inverse text.
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: var(--space-md) 0 0;
		padding: 0;
		list-style: none;

		li {
			margin: 0;
		}
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 40px;
		padding: 0 14px 0 6px;
		border: 1px solid var(--color--border);
		border-radius: var(--radius-pill);
		background: var(--color--surface);
		color: var(--color--text);
		font-family: var(--font--title);
		font-size: 0.9375rem;
		font-weight: 800;
		line-height: 1;
		cursor: pointer;
		text-decoration: none;
		transition: background-color var(--dur-fast) ease, border-color var(--dur-fast) ease,
			color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);

		&.bare {
			padding-left: 14px;
		}

		&:active {
			transform: scale(0.97);
		}

		@media (hover: hover) and (pointer: fine) {
			&:hover:not(.on) {
				border-color: var(--color--accent);
				color: var(--color--accent);
			}
		}

		&.on {
			background: var(--color--text);
			border-color: var(--color--text);
			color: var(--color--text-inverse);
		}
	}

	.icon {
		width: 26px;
		height: 26px;
		border-radius: 8px;
		box-shadow: 0 0 0 1px var(--color--border);
	}

	// The two apps, then the rows, in the plans' card.
	.panel {
		margin-top: var(--space-md);
		border: 2px solid var(--color--border);
		border-radius: var(--radius-xl);
		padding: 24px;
		background: var(--color--surface);

		@include for-phone-only {
			padding: 18px 16px;
		}
	}

	// The two apps sit on the same columns as the cells under them, so an icon
	// stands over its own answers; the label column is left empty and the
	// "vs" badge straddles the gap between the two, on the icon row.
	.heads {
		display: grid;
		grid-template-columns: minmax(6rem, 9rem) minmax(0, 1fr) minmax(0, 1fr);
		column-gap: 16px;
		align-items: start;

		@include for-phone-only {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
		grid-row: 1;

		&.us {
			grid-column: 2;
		}

		&.them {
			grid-column: 3;
		}

		@include for-phone-only {
			&.us {
				grid-column: 1;
			}

			&.them {
				grid-column: 2;
			}
		}

		.app {
			width: 56px;
			height: 56px;
			border-radius: 14px;
			box-shadow: 0 0 0 1px var(--color--border);
			margin-bottom: 8px;
			object-fit: cover;
		}

		// An app with no icon left in the stores gets its initial on the muted fill.
		.blank {
			display: grid;
			place-items: center;
			background: var(--color--muted);
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.5rem;
			color: var(--color--text-quiet);
		}

		.name {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.25rem;
			line-height: 1.2;
		}

		.what {
			font-size: 0.875rem;
			line-height: 1.45;
			color: var(--color--text-shade);
			text-wrap: pretty;
		}
	}

	.vs {
		grid-column: 2;
		grid-row: 1;
		justify-self: end;
		align-self: start;
		// Centred on the 56px icon, and pushed half its width plus half the
		// gap to the right so it sits between the two columns.
		margin-top: 8px;
		transform: translateX(calc(50% + 8px));
		z-index: 1;
		display: inline-flex;

		@include for-phone-only {
			grid-column: 1;
		}
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--color--muted);
		font-family: var(--font--title);
		font-weight: 800;
		color: var(--color--text-shade);
	}

	.rows {
		margin-top: 20px;
		border-top: 1px solid var(--color--border);
	}

	.row {
		display: grid;
		grid-template-columns: minmax(6rem, 9rem) minmax(0, 1fr) minmax(0, 1fr);
		gap: 6px 16px;
		padding: 12px 0;
		border-bottom: 1px solid var(--color--border);
		align-items: start;

		// This list is closed at both ends, so the last row keeps its hairline.
		// The global .rows rule drops it, and under Svelte 5 a plain scoped
		// selector no longer outweighs that rule.
		.rows > &:last-child {
			border-bottom: 1px solid var(--color--border);
		}

		@include for-phone-only {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}
	}

	.k {
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--color--text-quiet);
		padding-top: 2px;

		@include for-phone-only {
			grid-column: 1 / -1;
			padding-top: 0;
		}
	}

	.v {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
		font-size: 0.9375rem;
		line-height: 1.45;
		color: var(--color--text);
	}

	.note {
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color--text-quiet);
	}

	.verdict {
		margin: 18px 0 0;
		font-size: 1rem;
		line-height: 1.55;
		color: var(--color--text-shade);
		max-width: 64ch;
		text-wrap: pretty;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 12px;
		margin-top: 18px;
	}
</style>
