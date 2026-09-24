<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import { ALPHABETS } from '$lib/data/alphabets';
	import { WORD_LISTS } from '$lib/data/most-common-words';
	import { alphabetGuide } from '$lib/data/alphabet-guides';

	const rows = ALPHABETS.map((a) => ({
		a,
		lang: WORD_LISTS.find((l) => l.code === a.code),
		count: a.groups.reduce((n, g) => n + g.letters.length, 0)
	})).filter((r) => r.lang);

	const guides = rows
		.map((r) => ({ name: r.lang?.name ?? '', href: alphabetGuide(r.lang?.slug) }))
		.filter((g) => g.href)
		.sort((a, b) => a.name.localeCompare(b.name));
</script>

<Seo
	title="Alphabets"
	path="/tools/alphabet"
	description="Every letter of {ALPHABETS.length} writing systems — Greek, Cyrillic, Arabic, Hangul, Devanagari and more — with names and sounds. Free, no account."
/>

<div class="container">
	<PageHeader
		eyebrow="Tools"
		title="Alphabets"
		lede="Every letter of {ALPHABETS.length} writing systems, with what each one is called and roughly how it sounds. The scripts here are the ones you cannot guess your way through."
	/>

	<ul class="rows" role="list">
		{#each rows as r}
			<li>
				<a href="/tools/alphabet/{r.lang?.slug}">
					<ScriptDisc nativeName={r.lang?.nativeName ?? ''} code={r.lang?.code} size={34} />
					<span class="name">{r.lang?.name}</span>
					<span class="script">{r.a.script}</span>
					<span class="n tabular">{r.count} letters</span>
				</a>
			</li>
		{/each}
	</ul>

	{#if guides.length}
		<section class="guides">
			<h2>Beginner's guides</h2>
			<p>How each script works, the letters that trip people up, and a plan to learn it.</p>
			<ul role="list">
				{#each guides as g}
					<li><a href={g.href}>The {g.name} alphabet</a></li>
				{/each}
			</ul>
		</section>
	{/if}

	<p class="note">
		Chinese is missing on purpose: it has no alphabet, and a list of letters is the wrong shape for
		it. The Latin-script languages are missing for the opposite reason — if you are reading this you
		already have their letters.
	</p>
</div>

<style lang="scss">
	@use '$lib/scss/breakpoints' as *;

	.rows {
		border-top: 1px solid var(--color--border);

		li {
			border-bottom: 1px solid var(--color--border);
		}

		a {
			display: grid;
			grid-template-columns: auto minmax(7rem, auto) 1fr auto;
			align-items: center;
			gap: var(--space-sm);
			padding: 14px 0;
			color: var(--color--text);
		}
	}

	.name {
		font-family: var(--font--title);
		font-weight: 800;
	}

	.script {
		color: var(--color--text-shade);
		font-size: 0.9375rem;
	}

	.n {
		color: var(--color--text-quiet);
		font-size: 0.8125rem;
	}

	@include for-phone-only {
		.script {
			display: none;
		}
		.rows a {
			grid-template-columns: auto 1fr auto;
		}
	}

	.guides {
		margin-top: var(--space-xl);

		h2 {
			margin-bottom: 4px;
		}

		p {
			color: var(--color--text-shade);
			margin-bottom: var(--space-sm);
		}

		ul {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			margin: 0;
			padding: 0;
			list-style: none;
		}

		a {
			display: inline-block;
			padding: 6px 14px;
			border-radius: var(--radius-pill);
			background: var(--color--muted);
			font-weight: 700;
			font-size: 0.9375rem;
			color: var(--color--text);
		}
	}

	.note {
		margin-top: var(--space-lg);
		color: var(--color--text-quiet);
		max-width: 64ch;
		font-size: 0.9375rem;
	}
</style>
