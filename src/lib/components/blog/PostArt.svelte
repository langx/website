<script lang="ts">
	/**
	 * The picture at the top of a post, drawn from what the post is rather than
	 * from an image file. Every post had a title and then text; this gives each
	 * one something to look at before the reading starts, without anyone
	 * drawing 80 covers — and the drawn covers only repeat the title in type.
	 *
	 * - a comparison: the apps it compares, as discs, LangX's mark first
	 * - a vocabulary post: language chips, the homepage marquee's own pill
	 * - a note from the team: the mark
	 * - anything else: the thing the app is about — a message and its correction
	 *
	 * All of it is decoration, so it is hidden from screen readers; the heading
	 * above already says what the post is.
	 */
	import Logo from '$lib/components/atoms/Logo.svelte';
	import { WORD_LISTS } from '$lib/data/most-common-words';
	import type { BlogPost } from '$lib/utils/types';

	export let post: BlogPost;

	/** The blog index's own grouping: these are notes from the team. */
	const TEAM = ['LangX v2', 'Announcement', 'Transparency', 'Cloud Storage', 'Reddit'];

	$: tags = post.tags ?? [];
	$: apps = post.apps ?? [];
	$: kind = tags.some((t) => TEAM.includes(t))
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
					<span class="disc" class:mark={name === 'LangX'}>
						{#if name === 'LangX'}
							<Logo variant="mark" height={sides.length > 2 ? 24 : 32} href={undefined} />
						{:else}
							{initials(name)}
						{/if}
					</span>
					<span class="name">{name}</span>
				</div>
			{/each}
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
