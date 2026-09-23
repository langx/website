<script lang="ts">
	/**
	 * The picture at the top of a post, drawn from what the post is rather than
	 * from an image file. Every post had a title and then text; this gives each
	 * one something to look at before the reading starts, without anyone
	 * drawing 80 covers — and the drawn covers only repeat the title in type.
	 *
	 * - a comparison: the apps it compares, as discs, LangX's mark first
	 * - an alphabet guide: the script itself — its signature letter with the
	 *   name and sound, and the letters that open the alphabet beside it
	 * - a vocabulary post: language chips, the homepage marquee's own pill
	 * - a note from the team: the mark
	 * - anything else: the thing the app is about — a message and its correction
	 *
	 * All of it is decoration, so it is hidden from screen readers; the heading
	 * above already says what the post is.
	 */
	import Logo from '$lib/components/atoms/Logo.svelte';
	import { WORD_LISTS } from '$lib/data/most-common-words';
	import { appIcon } from '$lib/data/app-icons';
	import type { BlogPost, PostScript } from '$lib/utils/types';

	export let post: BlogPost;
	/** The script an alphabet guide teaches, from the layout's server load. */
	export let script: PostScript | undefined = undefined;

	/** The blog index's own grouping: these are notes from the team. */
	const TEAM = ['LangX v2', 'Announcement', 'Transparency', 'Cloud Storage', 'Reddit'];

	$: tags = post.tags ?? [];
	$: apps = post.apps ?? [];
	$: kind = script
		? 'alphabet'
		: tags.some((t) => TEAM.includes(t))
		? 'team'
		: tags.includes('Comparison') && apps.length
		? 'versus'
		: tags.includes('Vocabulary')
		? 'languages'
		: 'chat';

	/**
	 * Who faces whom, from the title first:
	 * - one app named ("Open Source Alternative to HelloTalk") — LangX vs it;
	 * - two named without LangX ("Tandem vs HelloTalk") — those two;
	 * - otherwise a roundup — LangX and the apps the body keeps returning to,
	 *   six at most, which is what a phone fits in two rows.
	 */
	$: sides = (() => {
		const titled = apps.filter((a) => post.title.includes(a));
		if (titled.length === 1) return ['LangX', titled[0]];
		if (titled.length === 2 && !post.title.includes('LangX')) return titled;
		return ['LangX', ...apps].slice(0, 6);
	})();

	const initials = (name: string) =>
		name
			.split(/\s+/)
			.map((w) => w[0])
			.join('')
			.slice(0, 2);

	/** A spread of scripts, so the row reads as "languages" at a glance. */
	const CHIPS = ['es', 'ar', 'ko', 'hi', 'ru', 'zh', 'el', 'ka', 'tr', 'he']
		.map((code) => WORD_LISTS.find((l) => l.code === code))
		.filter((l): l is (typeof WORD_LISTS)[number] => Boolean(l));
</script>

<figure class="art {kind}" aria-hidden="true">
	{#if kind === 'versus'}
		<div class="discs" class:many={sides.length > 2}>
			{#each sides as name, i}
				{#if i === 1 && sides.length === 2}<span class="vs">vs</span>{/if}
				<div class="app">
					{#if appIcon(name)}
						<img class="icon" src={appIcon(name)} alt="" width="72" height="72" loading="lazy" />
					{:else}
						<span class="disc" class:mark={name === 'LangX'}>
							{#if name === 'LangX'}
								<Logo variant="mark" height={sides.length > 2 ? 24 : 32} href={undefined} />
							{:else}
								{initials(name)}
							{/if}
						</span>
					{/if}
					<span class="name">{name}</span>
				</div>
			{/each}
		</div>
	{:else if kind === 'alphabet' && script}
		<div class="script" lang={script.code}>
			<div class="featured">
				<span class="big">{script.featured.c}</span>
				<span class="letter-name">{script.featured.name}</span>
				<span class="sound">{script.featured.sound}</span>
			</div>
			<ul class="wall" dir={script.rtl ? 'rtl' : 'ltr'}>
				{#each script.others as c}<li>{c}</li>{/each}
			</ul>
		</div>
	{:else if kind === 'languages'}
		<ul class="chips">
			{#each CHIPS as l}
				<li lang={l.code}>
					<span class="native">{l.nativeName.split(/\s+/)[0]}</span>
					<span class="english">{l.name}</span>
				</li>
			{/each}
		</ul>
	{:else if kind === 'team'}
		<div class="team">
			<Logo height={36} href={undefined} />
		</div>
	{:else}
		<!-- The homepage chat, frozen at its last beat: a question, an answer
		     with a slip in it, and the correction that fixes it. -->
		<div class="chat">
			<span class="bubble them" lang="es">¿Cómo fue tu fin de semana?</span>
			<span class="bubble mine" lang="es"
				>Fui a la playa. Hacía mucho calor y yo no llevé agua.</span
			>
			<div class="correction">
				<span class="from">Correction from Lucía</span>
				<span class="fixed" lang="es">Hacía mucho calor y <s>yo</s> no llevé agua.</span>
			</div>
		</div>
	{/if}
</figure>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.art {
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 176px;
		padding: var(--space-lg) var(--space-md);
		border: 1px solid var(--color--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		user-select: none;
	}

	// — Versus ———————————————————————————————————————————————————————

	.discs {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: var(--space-lg);

		// Six across in the text column, three and three on a phone — never
		// five and a lonely one.
		&.many {
			flex-wrap: wrap;
			gap: var(--space-md);
			max-width: calc(6 * 80px + 5 * var(--space-md));

			@include for-phone-only {
				max-width: calc(3 * 80px + 2 * var(--space-md));
			}

			.app {
				width: 80px;
			}
		}
	}

	.app {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: 96px;
	}

	.disc {
		display: grid;
		place-items: center;
		width: 72px;
		height: 72px;
		border-radius: var(--radius-pill);
		background: var(--color--muted);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.5rem;
		color: var(--color--text);

		// The mark sits on the ground with the app's own hairline, so LangX is
		// the one disc that is not a grey placeholder.
		&.mark {
			background: var(--color--background);
			border: 1px solid var(--color--border);
		}

		.many & {
			width: 56px;
			height: 56px;
			font-size: 1.125rem;
		}
	}

	// Each app's own App Store icon, in the store's rounded square, with a
	// hairline so a white icon still has an edge on the white card.
	.icon {
		display: block;
		width: 72px;
		height: 72px;
		border-radius: 22%;
		box-shadow: 0 0 0 1px var(--color--border);

		.many & {
			width: 56px;
			height: 56px;
		}
	}

	.name {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
		text-align: center;
		line-height: 1.25;
	}

	.vs {
		align-self: center;
		margin-top: -28px;
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color--text-quiet);
	}

	// — Alphabet ———————————————————————————————————————————————————————

	// One letter large with what it is called and how it sounds, the way the
	// chart on /tools/alphabet sets each one, and the alphabet's opening
	// letters in a block beside it: the script, before a word about it.
	.script {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-xl);

		@include for-phone-only {
			gap: var(--space-md);
		}
	}

	.featured {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 7rem;
		text-align: center;
	}

	.big {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 5rem;
		line-height: 1.15;
		color: var(--color--text);

		@include for-phone-only {
			font-size: 4rem;
		}
	}

	.letter-name {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1rem;
	}

	.sound {
		font-size: 0.8125rem;
		color: var(--color--text-quiet);
	}

	.wall {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(5, 44px);
		gap: 6px;

		li {
			display: grid;
			place-items: center;
			height: 44px;
			border-radius: 12px;
			background: var(--color--muted);
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 1.25rem;
			line-height: 1;
			color: var(--color--text-shade);
		}

		// Four across on a phone, three rows: twelve letters, no ragged end.
		@include for-phone-only {
			grid-template-columns: repeat(4, 38px);

			li {
				height: 38px;
				font-size: 1.125rem;
			}

			li:nth-child(n + 13) {
				display: none;
			}
		}
	}

	// — Languages ————————————————————————————————————————————————————

	.chips {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		max-width: 560px;

		li {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1px;
			padding: 9px 18px;
			border: 1px solid var(--color--border);
			border-radius: var(--radius-pill);
			background: var(--color--background);
		}
	}

	.native {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1rem;
	}

	.english {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color--text-quiet);
	}

	// — Chat —————————————————————————————————————————————————————————

	.chat {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: min(100%, 360px);
	}

	.bubble {
		max-width: 85%;
		padding: 10px 14px;
		font-size: 0.9375rem;
		line-height: 1.4;

		&.them {
			align-self: flex-start;
			background: var(--color--muted);
			border-radius: var(--radius-bubble) var(--radius-bubble) var(--radius-bubble) 6px;
		}

		&.mine {
			align-self: flex-end;
			background: var(--color--accent-tint);
			border-radius: var(--radius-bubble) var(--radius-bubble) 6px var(--radius-bubble);
		}
	}

	// Green belongs to corrections, and this is one.
	.correction {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-top: 4px;
		padding: 12px 14px;
		background: var(--color--success-tint);
		border-radius: var(--radius-lg);

		.from {
			font-size: 0.6875rem;
			font-weight: 700;
			letter-spacing: 0.04em;
			text-transform: uppercase;
			color: var(--color--success);
		}

		.fixed {
			font-size: 0.9375rem;
		}

		s {
			color: var(--color--text-quiet);
		}
	}

	@include for-phone-only {
		.art {
			min-height: 144px;
		}

		.discs:not(.many) {
			gap: var(--space-md);
		}
	}
</style>
