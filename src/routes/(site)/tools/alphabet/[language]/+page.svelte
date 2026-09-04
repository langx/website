<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { ownsPrimary } from '$lib/stores/cta';
	import { siteBaseUrl } from '$lib/data/meta';
	import type { Alphabet } from '$lib/data/alphabets';
	import type { WordListMeta } from '$lib/data/most-common-words';

	export let data: {
		lang: WordListMeta;
		alphabet: Alphabet;
		cousins: WordListMeta[];
		others: { alphabet: Alphabet; lang: WordListMeta }[];
	};
	$: ({ lang, alphabet, cousins, others } = data);

	const nf = new Intl.NumberFormat('en-US');
	$: path = `/tools/alphabet/${lang.slug}`;
	$: count = alphabet.groups.reduce((n, g) => n + g.letters.length, 0);
	$: title = `The ${lang.name} alphabet`;

	const KIND: Record<string, string> = {
		alphabet: 'An alphabet: vowels and consonants are letters of equal standing.',
		abjad: 'An abjad: the consonants are written and the short vowels are not.',
		abugida:
			'An abugida: each consonant carries a vowel already, and other vowels are marks on it.',
		featural: "A featural script: a letter's shape shows how the sound is made."
	};

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
						name: 'Alphabets',
						item: `${siteBaseUrl}/tools/alphabet`
					},
					{ '@type': 'ListItem', position: 3, name: title }
				]
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

<Seo
	{title}
	{path}
	description="All {count} letters of the {lang.name} alphabet, each with its name and roughly how it sounds. Free, no account."
/>

<svelte:head>
	{@html ldScript}
</svelte:head>

<div class="container">
	<PageHeader
		{title}
		lede="{count} letters, each with its name and roughly the sound it makes. The sounds are English approximations — enough to sound a word out, not enough to pass for a local."
	/>

	<p class="kind">
		<ScriptDisc nativeName={lang.nativeName} code={lang.code} size={34} />
		<span>{alphabet.script} · {KIND[alphabet.kind]}</span>
	</p>

	<p class="note">{alphabet.note}</p>

	{#each alphabet.groups as group}
		<section class="group">
			{#if alphabet.groups.length > 1}<h2>{group.title}</h2>{/if}
			<ul class="letters" class:rtl={alphabet.rtl} role="list">
				{#each group.letters as l}
					<li>
						<span class="glyph" lang={lang.code}>{l.c}</span>
						<span class="meta">
							<span class="name">{l.name}</span>
							<span class="sound">{l.sound}</span>
						</span>
					</li>
				{/each}
			</ul>
		</section>
	{/each}

	<section class="next">
		<h2>Now read something in it</h2>
		<p>
			The letters are the smaller half. The
			<a href="/tools/most-common-words/{lang.slug}"
				>{nf.format(lang.count)} commonest {lang.name} words</a
			> are where they start meaning something.
		</p>
		{#if cousins.length}
			<p class="cousins">
				{alphabet.script} is also used for
				{#each cousins as c, i}<a href="/tools/alphabet/{c.slug}">{c.name}</a>{i <
					cousins.length - 2
						? ', '
						: i === cousins.length - 2
						? ' and '
						: ''}{/each}. The letters mostly carry over; a handful do not.
			</p>
		{/if}
	</section>

	<nav class="others" aria-label="Other alphabets">
		<h2>Other alphabets</h2>
		<ul role="list">
			{#each others as o}
				<li>
					<a href="/tools/alphabet/{o.lang.slug}">
						<ScriptDisc nativeName={o.lang.nativeName} code={o.lang.code} size={30} />
						{o.lang.name}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<section class="cta">
		<h2>Reading it is one thing.</h2>
		<p>Being understood when you say it is another. That takes a person.</p>
		<div use:ownsPrimary>
			<Button href="https://app.langx.io" variant="primary" size="lg">Start for free</Button>
		</div>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.kind {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		color: var(--color--text-shade);
		font-size: 0.9375rem;
		padding-bottom: var(--space-sm);
	}

	.note {
		color: var(--color--text-shade);
		max-width: 66ch;
		margin-bottom: var(--space-lg);
	}

	.group {
		padding-bottom: var(--space-lg);

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.125rem;
			color: var(--color--text-quiet);
			margin-bottom: var(--space-2xs);
		}
	}

	// A grid of letters rather than a list of rows: the glyph is the content,
	// and seeing them together is how a script starts to look like a system.
	.letters {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
		gap: 0 var(--space-lg);
		border-top: 1px solid var(--color--border);

		li {
			display: flex;
			align-items: baseline;
			gap: var(--space-sm);
			padding: 12px 0;
			border-bottom: 1px solid var(--color--border);
		}

		&.rtl .glyph {
			direction: rtl;
		}
	}

	.glyph {
		flex: 0 0 auto;
		min-width: 2.4em;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.375rem;
		line-height: 1.3;
	}

	.meta {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.name {
		font-size: 0.9375rem;
		font-weight: 600;
	}

	.sound {
		font-size: 0.8125rem;
		color: var(--color--text-quiet);
	}

	.next,
	.others,
	.cta {
		border-top: 1px solid var(--color--border);
		padding: var(--space-xl) 0;

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			letter-spacing: -0.015em;
			margin-bottom: var(--space-2xs);
		}
	}

	.next {
		p {
			color: var(--color--text-shade);
			max-width: 62ch;
		}

		a {
			color: var(--color--accent);
		}
	}

	.cousins {
		margin-top: var(--space-2xs);
	}

	.others ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-md);
		margin-top: var(--space-sm);
	}

	.others a {
		display: inline-flex;
		align-items: center;
		gap: var(--space-3xs);
		color: var(--color--text);
	}

	.cta {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		p {
			color: var(--color--text-shade);
			max-width: 46ch;
			margin-bottom: var(--space-md);
		}
	}
</style>
