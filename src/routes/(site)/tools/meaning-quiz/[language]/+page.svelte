<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import SpeakButton from '$lib/components/atoms/SpeakButton.svelte';
	import Ipa from '$lib/components/atoms/Ipa.svelte';
	import VoiceCredit from '$lib/components/atoms/VoiceCredit.svelte';
	import PageHeader from '$lib/components/organisms/PageHeader.svelte';
	import QuizTrack from '$lib/components/atoms/QuizTrack.svelte';
	import QuizMark from '$lib/components/atoms/QuizMark.svelte';
	import { siteBaseUrl } from '$lib/data/meta';
	import { ownsPrimary } from '$lib/stores/cta';
	import type { WordListMeta } from '$lib/data/most-common-words';

	type Entry = { rank: number; word: string; english: string; ipa: string };

	export let data: {
		meta: WordListMeta;
		pool: Entry[];
		rounds: number;
		options: number;
	};
	$: ({ meta, pool, rounds: ROUNDS, options: OPTIONS } = data);

	const today = new Date().toISOString().slice(0, 10);

	/** Deterministic by day, so a shared score is a shared quiz. */
	function rng(seed: number) {
		let s = seed >>> 0;
		return () => {
			s = (s * 1664525 + 1013904223) >>> 0;
			return s / 4294967296;
		};
	}

	type Round = { word: string; rank: number; ipa: string; answer: string; options: string[] };

	$: rounds = (() => {
		const rand = rng(Math.floor(Date.parse(today) / 86_400_000) + meta.code.charCodeAt(0) * 7919);
		const out: Round[] = [];
		const used = new Set<number>();
		let guard = 0;
		while (out.length < ROUNDS && guard++ < 5000) {
			const i = Math.floor(rand() * pool.length);
			if (used.has(i)) continue;
			used.add(i);
			const entry = pool[i];
			const options = [entry.english];
			while (options.length < OPTIONS) {
				const other = pool[Math.floor(rand() * pool.length)].english;
				if (!options.includes(other)) options.push(other);
			}
			for (let k = options.length - 1; k > 0; k--) {
				const j = Math.floor(rand() * (k + 1));
				[options[k], options[j]] = [options[j], options[k]];
			}
			out.push({
				word: entry.word,
				rank: entry.rank,
				ipa: entry.ipa,
				answer: entry.english,
				options
			});
		}
		return out;
	})();

	let at = 0;
	let picked: (string | null)[] = [];
	let copied = '';

	$: if (rounds.length && picked.length !== rounds.length) picked = Array(rounds.length).fill(null);

	function choose(option: string) {
		if (picked[at] !== null) return;
		picked = picked.map((p, i) => (i === at ? option : p));
	}

	function next() {
		if (at < rounds.length - 1) at++;
	}

	function again() {
		at = 0;
		picked = Array(rounds.length).fill(null);
	}

	$: answered = picked.filter((p) => p !== null).length;
	$: score = rounds.filter((r, i) => picked[i] === r.answer).length;
	$: finished = rounds.length > 0 && answered === rounds.length;
	$: steps = rounds.map((r, i) =>
		picked[i] === null ? (i === at ? 'now' : null) : picked[i] === r.answer ? 'right' : 'wrong'
	) as ('right' | 'wrong' | 'now' | null)[];

	async function copyResult() {
		const grid = rounds.map((r, i) => (picked[i] === r.answer ? '🟩' : '🟥')).join('');
		const url = `${window.location.origin}/tools/meaning-quiz/${meta.slug}`;
		const text = `${meta.name} meanings — ${today} — ${score}/${rounds.length}\n\n${grid}\n\n${url}`;
		try {
			await navigator.clipboard.writeText(text);
			copied = 'Result copied';
		} catch {
			copied = 'Could not reach the clipboard';
		}
		setTimeout(() => (copied = ''), 2500);
	}

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
						name: 'Meaning quiz',
						item: `${siteBaseUrl}/tools/meaning-quiz`
					},
					{ '@type': 'ListItem', position: 3, name: meta.name }
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
	title="{meta.name} vocabulary quiz: ten common words a day"
	path="/tools/meaning-quiz/{meta.slug}"
	description="A daily {meta.name} vocabulary quiz: ten common words, four English meanings each. Drawn from the 1,500 words {meta.name} uses most. Free, no account."
/>

<svelte:head>
	{@html ldScript}
</svelte:head>

<div class="container">
	<PageHeader
		eyebrow="Tools"
		title="What do these {meta.name} words mean?"
		lede="Ten words a day, all of them from the first fifteen hundred {meta.name} uses most — so these are
		words you would meet, not dictionary curiosities."
	/>

	{#if finished}
		<section class="result">
			<p class="big tabular">{score}<span>/{rounds.length}</span></p>
			<QuizTrack large steps={rounds.map((r, i) => (picked[i] === r.answer ? 'right' : 'wrong'))} />

			<ul class="review" role="list">
				{#each rounds as r, i}
					<li class:wrong={picked[i] !== r.answer}>
						<QuizMark right={picked[i] === r.answer} />
						<span class="w"
							><span lang={meta.code}>{r.word}</span>
							<SpeakButton
								code={meta.code}
								rank={r.rank}
								label="Hear {r.word} in {meta.name}"
								size={28}
							/>
							<Ipa ipa={r.ipa} /></span
						>
						<span class="a">{r.answer}</span>
						{#if picked[i] !== r.answer}<span class="you">you said “{picked[i]}”</span>{/if}
					</li>
				{/each}
			</ul>

			<div class="after">
				<button type="button" class="share" on:click={copyResult}>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M12 15V4" /><path d="m8 8 4-4 4 4" />
						<path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
					</svg>
					Copy result
				</button>
				<button type="button" class="again" on:click={again}>Try again</button>
				<a class="see" href="/tools/most-common-words/{meta.slug}">See the whole list</a>
			</div>
			{#if copied}<p class="copied" aria-live="polite">{copied}</p>{/if}
			<p class="tomorrow">A new ten tomorrow.</p>
		</section>
	{:else if rounds.length}
		{@const r = rounds[at]}
		<p class="progress">Word {at + 1} of {rounds.length}</p>
		<QuizTrack {steps} />
		<!-- Hearing the word gives nothing away: the question is what it means. -->
		<p class="word">
			<span lang={meta.code}>{r.word}</span>
			<SpeakButton code={meta.code} rank={r.rank} label="Hear {r.word} in {meta.name}" size={44} />
			<!-- Nor does reading it: the sound of a word is not its meaning. -->
			<span class="say"><Ipa ipa={r.ipa} large /></span>
		</p>

		<ul class="options" role="list">
			{#each r.options as option}
				<li>
					<button
						type="button"
						class:right={picked[at] !== null && option === r.answer}
						class:wrong={picked[at] === option && option !== r.answer}
						disabled={picked[at] !== null}
						on:click={() => choose(option)}
					>
						{option}
					</button>
				</li>
			{/each}
		</ul>

		<p class="verdict" aria-live="polite">
			{#if picked[at] !== null}
				{picked[at] === r.answer ? 'Right.' : `Not quite — it means “${r.answer}”.`}
			{/if}
		</p>

		{#if picked[at] !== null}
			<div class="nextwrap">
				<button type="button" class="next" on:click={next}>
					{at === rounds.length - 1 ? 'See the result' : 'Next word'}
				</button>
			</div>
		{/if}
	{/if}

	<VoiceCredit codes={[meta.code]} />

	<section class="cta">
		<h2>Knowing a word and using it are different things.</h2>
		<p>The second one needs somebody on the other end.</p>
		<div use:ownsPrimary>
			<Button href="https://get.langx.io" variant="primary" size="lg">Start for free</Button>
		</div>
	</section>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.progress {
		color: var(--color--text-quiet);
		font-size: 0.8125rem;
	}

	.word {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px 12px;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: clamp(2.125rem, 1.4rem + 3vw, 3.5rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
		padding: var(--space-sm) 0 var(--space-lg);
		overflow-wrap: anywhere;

		.say {
			flex-basis: 100%;
			line-height: 1.5;
			letter-spacing: 0;
		}
	}

	.options {
		margin-bottom: var(--space-2xl);
		display: grid;
		gap: var(--space-2xs);
		max-width: 560px;

		button {
			width: 100%;
			min-height: 56px;
			padding: var(--space-2xs) var(--space-sm);
			border-radius: var(--radius-lg);
			border: 1px solid var(--color--border);
			background: none;
			color: var(--color--text);
			font-family: var(--font--default);
			font-size: 1rem;
			text-align: left;
			cursor: pointer;
			transition: border-color var(--dur-fast) ease, color var(--dur-fast) ease;

			&:disabled {
				cursor: default;
			}

			// The answer is the one filled shape, and each state has a mark as
			// well as a colour: green and red alone are one colour to a lot of
			// people. The same tokens and marks as /tools/guess-the-language.
			&.right,
			&.wrong {
				display: flex;
				align-items: center;
				gap: var(--space-2xs);

				&::after {
					margin-left: auto;
					font-size: 1rem;
					line-height: 1;
				}
			}

			&.right {
				border-color: var(--color--success);
				background: var(--color--success-tint);
				color: var(--color--success);
				font-weight: 600;

				&::after {
					content: '✓';
				}
			}

			&.wrong {
				border-color: var(--color--error);
				color: var(--color--error);

				&::after {
					content: '✕';
				}
			}

			@media (hover: hover) and (pointer: fine) {
				&:not(:disabled):hover {
					border-color: var(--color--text);
				}
			}
		}
	}

	.verdict {
		// Holds its line before the answer, so choosing does not push the page.
		min-height: 1.5em;
		margin: calc(var(--space-2xl) * -1 + var(--space-sm)) 0 0;
		font-family: var(--font--title);
		font-weight: 800;
	}

	.nextwrap {
		margin-top: var(--space-sm);
		padding-bottom: var(--space-2xl);
	}

	.next,
	.again {
		height: 48px;
		padding: 0 22px;
		border-radius: var(--radius-pill);
		border: 1px solid var(--color--text);
		background: none;
		color: var(--color--text);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
		cursor: pointer;
	}

	.again {
		height: 44px;
		padding: 0 20px;
	}

	.result {
		padding: var(--space-sm) 0 var(--space-xl);
	}

	.big {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: clamp(2.125rem, 1.4rem + 3vw, 3.5rem);
		line-height: 1;

		span {
			color: var(--color--text-quiet);
		}
	}

	.review {
		border-top: 1px solid var(--color--border);

		li {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: var(--space-2xs) var(--space-sm);
			padding: 12px 0;
			border-bottom: 1px solid var(--color--border);
		}

		.w {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.125rem;
			min-width: 8rem;
		}

		.a {
			color: var(--color--text-shade);
		}

		.you {
			margin-left: auto;
			color: var(--color--text-quiet);
			font-size: 0.8125rem;
		}
	}

	.after {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-md);
		margin-top: var(--space-lg);
	}

	.share {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 44px;
		padding: 0 20px;
		border-radius: var(--radius-pill);
		border: 1px solid var(--color--text);
		background: none;
		color: var(--color--text);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
		cursor: pointer;

		svg {
			width: 17px;
			height: 17px;
			fill: none;
			stroke: currentColor;
			stroke-width: 2;
			stroke-linecap: round;
			stroke-linejoin: round;
		}
	}

	.see {
		color: var(--color--accent);
		font-weight: 600;
	}

	.copied,
	.tomorrow {
		margin-top: var(--space-2xs);
		color: var(--color--text-quiet);
		font-size: 0.8125rem;
	}

	.cta {
		border-top: 1px solid var(--color--border);
		padding: var(--space-xl) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		h2 {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem);
			letter-spacing: -0.015em;
			max-width: 22ch;
		}

		p {
			color: var(--color--text-shade);
			max-width: 46ch;
			margin: var(--space-2xs) 0 var(--space-md);
		}
	}
</style>
