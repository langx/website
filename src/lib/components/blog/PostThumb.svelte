<script lang="ts">
	/**
	 * The square beside a post in a list, drawn from what the post is. It
	 * replaces the drawn thumbnails, which were one glyph on a tint — "vs" for
	 * every comparison, "Aa" for every word list — and so told the rows apart
	 * by colour only. The same rules as the art above a post (PostArt):
	 *
	 * - a comparison: the apps' own icons, LangX first
	 * - an alphabet guide: a letter of that script
	 * - a vocabulary post: four scripts
	 * - a note from the team: the LangX icon
	 * - anything else: two of the people from the app's demo screens
	 *
	 * Decoration beside a title that already says it all, so hidden from
	 * screen readers.
	 */
	import { appIcon } from '$lib/data/app-icons';
	import { COMPETITORS } from '$lib/data/competitors';
	import { WORD_LISTS } from '$lib/data/most-common-words';
	import { signatureLetter } from '$lib/data/alphabet-guides';

	export let title: string;
	export let slug: string;
	export let tags: string[] | undefined = undefined;
	/** The apps the post is about, title first (see appsIn in blog-posts/utils). */
	export let apps: string[] | undefined = undefined;

	const TEAM = ['LangX v2', 'Announcement', 'Transparency', 'Cloud Storage', 'Reddit'];

	/** A stable number per post, so the same post always draws the same way. */
	const seed = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

	$: named = COMPETITORS.map((c) => c.name).filter((n) => title.includes(n));
	// The slug first ("korean-alphabet-guide"), the title only as a fallback.
	$: alphabet = /alphabet/i.test(slug)
		? WORD_LISTS.find((l) => slug.startsWith(`${l.slug}-`)) ??
		  WORD_LISTS.find((l) => title.includes(l.name))
		: undefined;

	$: kind = tags?.some((t) => TEAM.includes(t))
		? 'team'
		: // "Is Tandem Safe?" is about Tandem whatever it is tagged.
		named.length || (tags?.includes('Comparison') && apps?.length)
		? 'versus'
		: alphabet
		? 'alphabet'
		: tags?.includes('Vocabulary')
		? 'scripts'
		: 'people';

	/**
	 * Who is on the tile. One app named: LangX and it. Two named without LangX
	 * ("Tandem vs HelloTalk"): those two. A roundup: LangX and the three the
	 * post comes back to most. Only apps with an icon make it on.
	 */
	$: icons = (() => {
		const pick = (list: string[]) =>
			list.map((n) => appIcon(n)).filter((src): src is string => Boolean(src));
		if (named.length === 1) return pick(['LangX', named[0]]);
		if (named.length === 2 && !title.includes('LangX')) return pick(named);
		return pick(['LangX', ...(apps ?? named)]).slice(0, 4);
	})();

	$: letter = alphabet ? signatureLetter(alphabet.code, alphabet.nativeName) : '';

	/** Letters from eight scripts; each vocabulary post shows four of them. */
	const SCRIPTS = [
		{ ch: 'A', lang: 'en' },
		{ ch: 'Ж', lang: 'ru' },
		{ ch: 'ع', lang: 'ar' },
		{ ch: '한', lang: 'ko' },
		{ ch: 'अ', lang: 'hi' },
		{ ch: 'Ω', lang: 'el' },
		{ ch: '中', lang: 'zh' },
		{ ch: 'ა', lang: 'ka' }
	];
	$: scripts = [0, 1, 2, 3].map((i) => SCRIPTS[(seed(slug) + i * 3) % SCRIPTS.length]);

	/** The people from the app's demo screens (static/images/people). */
	const PEOPLE = ['lucia', 'daniel', 'kenji', 'maria', 'sofia', 'mateo', 'ana', 'javier'];
	$: pair = [PEOPLE[seed(slug) % PEOPLE.length], PEOPLE[(seed(slug) + 3) % PEOPLE.length]];
</script>

<span class="art {kind}" aria-hidden="true">
	{#if kind === 'versus' && icons.length}
		<span class="icons n{icons.length}">
			{#each icons as src}
				<img {src} alt="" width="40" height="40" loading="lazy" decoding="async" />
			{/each}
		</span>
	{:else if kind === 'team'}
		<img class="solo" src="/images/apps/langx.png" alt="" width="48" height="48" loading="lazy" />
	{:else if kind === 'alphabet'}
		<span class="letter" lang={alphabet?.code}>{letter}</span>
	{:else if kind === 'scripts'}
		<span class="grid">
			{#each scripts as s}<span lang={s.lang}>{s.ch}</span>{/each}
		</span>
	{:else}
		<span class="pair">
			{#each pair as who}
				<img src="/images/people/{who}.webp" alt="" width="40" height="40" loading="lazy" />
			{/each}
			<span class="bubble" />
		</span>
	{/if}
</span>

<style lang="scss">
	// The tile fills whatever square the list gives it (88px, 64px on phones),
	// so every size below is a share of it.
	.art {
		position: relative;
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		container-type: size;
		background: var(--color--muted);
		user-select: none;
	}

	img {
		display: block;
		object-fit: cover;
	}

	// App icons keep the App Store's rounded square, a hairline ring so a
	// white icon does not melt into a light tile.
	.icons {
		display: grid;
		gap: 6cqw;

		img {
			width: 40cqw;
			height: 40cqw;
			border-radius: 22%;
			box-shadow: 0 0 0 1px var(--color--border);
		}

		// Two: overlapping on the diagonal, LangX in front.
		&.n2 {
			grid-template-columns: 1fr;
			width: 72cqw;
			height: 72cqw;

			img {
				grid-area: 1 / 1;
				width: 46cqw;
				height: 46cqw;

				&:first-child {
					align-self: end;
					justify-self: start;
					z-index: 1;
					box-shadow: 0 0 0 2cqw var(--color--muted);
				}

				&:last-child {
					align-self: start;
					justify-self: end;
				}
			}
		}

		&.n3,
		&.n4 {
			grid-template-columns: repeat(2, auto);
		}
	}

	.solo {
		width: 54cqw;
		height: 54cqw;
		border-radius: 22%;
		box-shadow: 0 0 0 1px var(--color--border);
	}

	.letter {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 52cqw;
		line-height: 1;
		color: var(--color--text);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, 38cqw);
		gap: 4cqw;

		span {
			display: grid;
			place-items: center;
			height: 38cqw;
			border-radius: 10cqw;
			background: var(--color--background);
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 22cqw;
			line-height: 1;
		}
	}

	// Two people, a little apart, and the app's own blue bubble between them.
	.pair {
		position: relative;
		width: 76cqw;
		height: 64cqw;

		img {
			position: absolute;
			width: 44cqw;
			height: 44cqw;
			border-radius: var(--radius-pill);
			box-shadow: 0 0 0 2cqw var(--color--muted);

			&:first-child {
				left: 0;
				top: 0;
			}

			&:nth-child(2) {
				right: 0;
				bottom: 0;
			}
		}
	}

	.bubble {
		position: absolute;
		right: 2cqw;
		top: 2cqw;
		width: 26cqw;
		height: 18cqw;
		border-radius: 9cqw 9cqw 9cqw 2cqw;
		background: var(--color--accent-tint);
	}
</style>
