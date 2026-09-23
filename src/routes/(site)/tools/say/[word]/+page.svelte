<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { siteBaseUrl } from '$lib/data/meta';
	import type { SayWord } from '$lib/data/say-words';
	import { audioSprite } from '$lib/utils/audioSprite';
	import { onDestroy } from 'svelte';

	type Row = {
		code: string;
		word: string;
		rank: number;
		gloss: string;
		name: string;
		native: string;
		slug: string;
		/** Start and length in this page's audio file, in ms; null with no voice. */
		audio: [number, number] | null;
	};
	type Credit = { language: string; name: string; url: string; licence: string };

	export let data: { entry: SayWord; rows: Row[]; nearby: SayWord[]; credits: Credit[] };
	$: ({ entry, rows, nearby, credits } = data);
	$: voiced = rows.filter((r) => r.audio).length;

	/**
	 * One audio file per page, fetched on the first press. Moving to the next
	 * word reuses this component, so the player is swapped when the slug is —
	 * and whatever the last page was saying stops with it.
	 */
	let sprite: ReturnType<typeof audioSprite> | null = null;
	let spriteFor = '';
	let playing: string | null = null;
	let presses = 0;
	$: if (entry.slug !== spriteFor) {
		sprite?.stop();
		sprite = audioSprite(`/audio/say/${entry.slug}.mp3`);
		spriteFor = entry.slug;
		playing = null;
	}
	onDestroy(() => sprite?.stop());

	async function say(r: Row) {
		if (!r.audio || !sprite) return;
		const press = ++presses;
		playing = r.code;
		try {
			await sprite.play(r.audio[0], r.audio[1]);
		} catch {
			// Offline, or the file is missing: the button simply stops glowing.
		} finally {
			if (press === presses) playing = null;
		}
	}

	const nf = new Intl.NumberFormat('en-US');
	$: title = `How to say “${entry.word}” in ${entry.count} different languages`;
	$: path = `/tools/say/${entry.slug}`;

	/**
	 * The results-page title follows how people actually search — "princess in
	 * different languages", "soul in other languages" — which is not how the
	 * page's own heading reads.
	 */
	$: cap = entry.word.charAt(0).toUpperCase() + entry.word.slice(1);
	$: seoTitle = `${cap} in Different Languages: ${entry.count} Translations`;

	/**
	 * The languages most searchers are after, in the order they are asked
	 * about. Whichever of them this word has go into the description and the
	 * quick answers above the table; the table itself stays alphabetical.
	 */
	const FEATURED = [
		'Spanish',
		'French',
		'German',
		'Italian',
		'Portuguese',
		'Chinese',
		'Korean',
		'Russian',
		'Arabic',
		'Hindi',
		'Turkish',
		'Greek'
	];
	/**
	 * Only rows that mean the word first. A row that turned up under a
	 * neighbouring sense ("noche" under dark) is fine in the table, where its
	 * gloss sits beside it, and wrong as a one-line answer. Listing the word
	 * further along is not enough when what comes first is another word:
	 * Arabic سيدة is glossed "mistress, princess", and a reader who asked for
	 * princess and got "lady" was given the wrong word. A definition in front
	 * is different — Chinese 公主, "daughter of a monarch; princess", is the
	 * word — so a first sense of three words or more does not count against it.
	 * Verbs are glossed "to read" and some nouns "a princess"; the particle is
	 * dropped before comparing, or no verb page would have an answer line.
	 */
	const primarily = (gloss: string, word: string) => {
		const senses = gloss
			.toLowerCase()
			.split(/[,;/]/)
			.map((sense) =>
				sense
					.replace(/\([^)]*\)/g, '')
					.trim()
					.replace(/^(to|a|an|the)\s+/, '')
					.replace(/[.:\s]+$/, '')
			)
			.filter(Boolean);
		const target = word.toLowerCase();
		if (senses[0] === target) return true;
		return senses.includes(target) && senses[0].split(/\s+/).length >= 3;
	};
	$: featured = FEATURED.map((name) =>
		rows.find((r) => r.name === name && primarily(r.gloss, entry.word))
	).filter((r): r is Row => Boolean(r));
	/**
	 * The words people search for most, linked from every page in the set.
	 * Taken from Search Console (June–September 2026): the pages with the most
	 * impressions, most of them sitting just below the top five, where a
	 * thousand internal links do the most good. "love", "moon" and "star" were
	 * here on a guess and drew almost no searches. "mine" draws plenty but mixes
	 * "my own" with "a mine", so it is not one to show off. The weekly report
	 * (scripts/gsc/rankings.mjs) says when this list wants redoing.
	 */
	const POPULAR = [
		'princess',
		'freedom',
		'aunt',
		'soul',
		'mountain',
		'prince',
		'monster',
		'river',
		'magic',
		'universe',
		'sword',
		'hero',
		'sea',
		'nature',
		'dark',
		'energy'
	];
	$: popular = POPULAR.filter((w) => w !== entry.slug);

	$: description = [3, 2, 1, 0]
		.map((n) => {
			const sample = featured
				.slice(0, n)
				.map((r) => `${r.name} ${r.word}`)
				.join(', ');
			return `How do you say “${entry.word}” in other languages? ${
				sample ? `${sample} — and ` : ''
			}${entry.count} languages in all, each a word people really use. Free list.`;
		})
		// Longest that still fits a results page: long words and long
		// translations drop an example rather than get cut mid-word.
		.find((d, i, all) => d.length <= 160 || i === all.length - 1) as string;

	/** Where the word is commonest tells you something the table alone does not. */
	$: commonest = rows
		.filter((r) => primarily(r.gloss, entry.word))
		.sort((a, b) => a.rank - b.rank)[0];

	/**
	 * Most rows gloss to the very word the page is about, which is a column of
	 * "water" down a page titled water. Only the ones that say something else —
	 * a narrower sense, a second meaning — are worth the space.
	 */
	const adds = (gloss: string, word: string) =>
		gloss.toLowerCase().replace(/[.,;:\s]+$/, '') !== word.toLowerCase();

	$: ld = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Tools', item: `${siteBaseUrl}/tools` },
					{
						'@type': 'ListItem',
						position: 2,
						name: 'Say it in any language',
						item: `${siteBaseUrl}/tools/say`
					},
					{ '@type': 'ListItem', position: 3, name: entry.word }
				]
			},
			{
				'@type': 'ItemList',
				name: title,
				numberOfItems: rows.length,
				itemListElement: rows.map((r, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: r.word,
					description: `${r.word} — ${r.name} for “${entry.word}”`
				}))
			}
		]
	});

	// The angle bracket is written as an escape and never appears literally in
	// this file: Svelte's parser scans the raw source, comments included, and
	// treats a script tag written out in full as a real tag.
	const LT = '\u003c';
	$: ldScript = `${LT}script type="application/ld+json">${ld
		.split(LT)
		.join('\\u003c')}${LT}/script>`;
</script>

<Seo title={seoTitle} {path} {description} />

<svelte:head>
	{@html ldScript}
</svelte:head>

<div class="container">
	<PageHeader
		eyebrow="Tools"
		{title}
		lede="Every one of these is a word that turns up in ordinary speech, not a dictionary curiosity — the number beside it is where it ranks in that language."
	/>

	{#if featured.length}
		<p class="note quick">
			“{entry.word}” in
			{#each featured.slice(0, 8) as r, i}{#if i}{' · '}{/if}{r.name}:{' '}<strong lang={r.code}
					>{r.word}</strong
				>{/each}
		</p>
	{/if}

	{#if commonest}
		<p class="note">
			It is commonest in {commonest.name}, where
			<strong lang={commonest.code}>{commonest.word}</strong>
			is the {nf.format(commonest.rank)}{commonest.rank % 10 === 1 && commonest.rank % 100 !== 11
				? 'st'
				: commonest.rank % 10 === 2 && commonest.rank % 100 !== 12
				? 'nd'
				: commonest.rank % 10 === 3 && commonest.rank % 100 !== 13
				? 'rd'
				: 'th'} most used word.
		</p>
	{/if}

	<!-- Searches split between "princess in different languages", which the
	     page heading answers, and "princess in other languages" or "words for
	     princess in other languages", which nothing on the page said. -->
	<h2 class="list-head">{cap} in other languages, A to Z</h2>
	<ul class="rows" role="list">
		{#each rows as r}
			<!-- The row is still one link to the language's list, but the link is the
			     language name stretched over the row rather than a wrapper round it:
			     a button inside a link is not a thing a browser will let you press. -->
			<li>
				<ScriptDisc nativeName={r.native} code={r.code} size={34} />
				<a class="lang" href="/tools/most-common-words/{r.slug}">{r.name}</a>
				<span class="term"
					><span lang={r.code}>{r.word}</span>{#if r.audio}<button
							type="button"
							class="say"
							class:on={playing === r.code}
							aria-label="Hear {r.word} in {r.name}"
							on:click={() => say(r)}><UiIcon name="volume" size={18} strokeWidth={2.25} /></button
						>{/if}</span
				>
				{#if adds(r.gloss, entry.word)}<span class="gloss">{r.gloss}</span>{:else}<span />{/if}
				<span class="rank tabular">#{nf.format(r.rank)}</span>
			</li>
		{/each}
	</ul>

	{#if voiced}
		<p class="credit">
			The speaker reads the word in the voice the LangX app uses for that language — synthesised,
			not a recording of a native speaker, so treat it as a guide. A row without a button has no
			reading we are free to use, or none we trust, yet.{#if credits.length}
				{' '}Voices for {#each credits as c, i}{c.language} (<a
						href={c.url}
						rel="noopener noreferrer"
						target="_blank">{c.name}</a
					>, {c.licence}){i === credits.length - 1
						? '.'
						: i === credits.length - 2
						? ' and '
						: ', '}{/each}
			{/if}
		</p>
	{/if}

	<nav class="nearby" aria-label="Other words">
		<h2>Other words</h2>
		<ul role="list">
			{#each nearby as w}
				<li><a href="/tools/say/{w.slug}">{w.word}</a></li>
			{/each}
			<li><a class="all" href="/tools/say">all words →</a></li>
		</ul>
	</nav>

	<nav class="nearby" aria-label="Popular words">
		<h2>Popular words</h2>
		<ul role="list">
			{#each popular as w}
				<li><a href="/tools/say/{w}">{w} in different languages</a></li>
			{/each}
		</ul>
	</nav>

	<nav class="nearby guides" aria-label="Guides">
		<h2>Keep going</h2>
		<ul role="list">
			<li><a href="/beautiful-words-in-different-languages">Powerful words in 20+ languages</a></li>
			<li>
				<a href="/family-words-in-different-languages">Family words in different languages</a>
			</li>
			<li>
				<a href="/how-many-words-do-you-need-to-be-fluent">How many words make you fluent?</a>
			</li>
			<li><a href="/best-language-exchange-apps">The best language exchange apps</a></li>
			<li><a href="/social-alternative-to-duolingo">A social alternative to Duolingo</a></li>
		</ul>
	</nav>

	<section class="cta">
		<h2>Knowing the word is the easy half.</h2>
		<p>Using it with someone who speaks the language is the half that sticks.</p>
		<div use:ownsPrimary>
			<Button href="https://get.langx.io" variant="primary" size="lg">Start for free</Button>
		</div>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.note {
		color: var(--color--text-shade);
		max-width: 60ch;
		margin-bottom: var(--space-md);

		strong {
			font-family: var(--font--title);
			font-weight: 800;
		}
	}

	.rows {
		border-top: 1px solid var(--color--border);

		li {
			position: relative;
			display: grid;
			grid-template-columns: auto minmax(7rem, auto) minmax(6rem, auto) 1fr auto;
			align-items: center;
			gap: var(--space-sm);
			padding: 12px 0;
			border-bottom: 1px solid var(--color--border);
			color: var(--color--text);
		}
	}

	.lang {
		color: var(--color--text-shade);
		font-size: 0.9375rem;

		// The whole row is the link, as it was before the row had a button in it.
		&::after {
			content: '';
			position: absolute;
			inset: 0;
		}
	}

	.term {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font--title);
		font-weight: 800;
		overflow-wrap: anywhere;
	}

	.say {
		// Above the stretched link, or every press would open the language list.
		position: relative;
		z-index: 1;
		flex: 0 0 auto;
		display: inline-grid;
		place-items: center;
		width: 32px;
		height: 32px;
		margin: -4px 0;
		border: 0;
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--color--accent);
		cursor: pointer;
		transition: background-color 200ms ease, transform 160ms ease-out;

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				background: var(--color--accent-tint);
			}
		}

		&:active {
			transform: scale(0.97);
		}

		&:focus-visible {
			outline: 2px solid var(--color--accent);
			outline-offset: 2px;
		}

		&.on {
			background: var(--color--accent-tint);

			:global(.ui-icon) {
				animation: speaking 0.9s ease-in-out infinite;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			&:active {
				transform: none;
			}

			&.on :global(.ui-icon) {
				animation: none;
			}
		}
	}

	@keyframes speaking {
		50% {
			opacity: 0.45;
		}
	}

	.gloss {
		color: var(--color--text-quiet);
		font-size: 0.9375rem;
		overflow-wrap: anywhere;
	}

	.rank {
		color: var(--color--text-tertiary);
		font-size: 0.8125rem;
	}

	@include for-phone-only {
		.rows li {
			grid-template-columns: auto 1fr auto;
			row-gap: 2px;
		}
		// Both pinned to the first row. With only the language placed, the word
		// was auto-placed after it — which on a three-column row is the next
		// line, under the disc.
		.lang {
			grid-column: 3;
			grid-row: 1;
			text-align: right;
		}
		.term {
			grid-column: 2;
			grid-row: 1;
		}
		.gloss {
			grid-column: 2 / 4;
		}
		.rank {
			display: none;
		}
	}

	// A label for the table rather than a new section: title face, but body
	// size, sitting on the table's own top rule.
	.list-head {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.125rem;
		letter-spacing: -0.01em;
		margin: var(--space-lg) 0 var(--space-sm);
	}

	.credit {
		font-size: 0.8125rem;
		color: var(--color--text-tertiary);
		max-width: 70ch;
		margin: var(--space-sm) 0 var(--space-md);
	}

	.nearby,
	.cta {
		border-top: 1px solid var(--color--border);
		padding: var(--space-xl) 0;

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			letter-spacing: -0.015em;
		}
	}

	.nearby ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-md);
		margin-top: var(--space-sm);
	}

	.nearby a {
		color: var(--color--text-shade);

		&.all {
			color: var(--color--accent);
		}

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				color: var(--color--text);
			}
		}
	}

	.cta {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		p {
			color: var(--color--text-shade);
			max-width: 46ch;
			margin: var(--space-2xs) 0 var(--space-md);
		}
	}
</style>
