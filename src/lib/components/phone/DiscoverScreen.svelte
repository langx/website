<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import LevelBars from '$lib/components/atoms/LevelBars.svelte';
	import Segmented from '$lib/components/atoms/Segmented.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import TabBar from './TabBar.svelte';
	import { inview } from '$lib/utils/inview';

	/**
	 * `app/(app)/(tabs)/discover` from the design handoff: the title with a
	 * search and a filter button, the language pair the list is filtered by,
	 * the three sorts, the boosted strip, then one hairline row per person.
	 */

	/**
	 * The paying members above the list, Polyglot first — `BoostedProfiles` in
	 * the app. Four faces the list below does not use, so one screen never
	 * shows the same person twice; `sofia` is the example account on `me` and
	 * stays out for the same reason.
	 *
	 * The app hides the strip entirely when nobody qualifies. Here somebody
	 * always does: this is the shot the stores get, and an empty strip is the
	 * one state it must not show.
	 */
	const boosted = [
		{
			initials: 'MG',
			photo: '/images/people/maria.webp',
			tone: 'accent',
			name: 'María',
			pair: 'Spanish → English',
			tier: 'POLYGLOT',
			online: true
		},
		{
			initials: 'DK',
			photo: '/images/people/daniel.webp',
			tone: 'success',
			name: 'Daniel',
			pair: 'German → English',
			tier: 'POLYGLOT',
			online: false
		},
		{
			initials: 'KT',
			photo: '/images/people/kenji.webp',
			tone: 'ink',
			name: 'Kenji',
			pair: 'Japanese → English',
			tier: 'FLUENT',
			online: true
		},
		{
			initials: 'SR',
			photo: '/images/people/sofia.webp',
			tone: 'accent',
			name: 'Sofia',
			pair: 'Portuguese → English',
			tier: 'POLYGLOT',
			online: false
		}
	] as const;

	const people = [
		{
			initials: 'LM',
			photo: '/images/people/lucia.webp',
			tone: 'accent',
			name: 'Lucía M.',
			age: 26,
			flag: '🇪🇸',
			streak: 41,
			online: true,
			pair: 'Spanish → English',
			level: 2,
			distance: '4 km away',
			bio: 'Madrid. I correct everything, sorry in advance.'
		},
		{
			initials: 'JR',
			photo: '/images/people/javier.webp',
			tone: 'success',
			name: 'Javier R.',
			age: 31,
			flag: '🇪🇸',
			streak: 7,
			online: false,
			pair: 'Spanish, Catalan → English',
			level: 3,
			distance: '',
			bio: 'Teaching myself English from song lyrics. It is going badly.'
		},
		{
			initials: 'AC',
			photo: '/images/people/ana.webp',
			tone: 'ink',
			name: 'Ana C.',
			age: 24,
			flag: '🇪🇸',
			streak: 0,
			online: true,
			pair: 'Spanish → English',
			level: 1,
			distance: '',
			bio: 'Day one. Voice notes only — typing English takes me an hour.'
		},
		{
			initials: 'MP',
			photo: '/images/people/mateo.webp',
			tone: 'accent',
			name: 'Mateo P.',
			age: 29,
			flag: '🇦🇷',
			streak: 122,
			online: false,
			pair: 'Spanish → English',
			level: 4,
			distance: '',
			bio: 'Buenos Aires. Happy to explain the subjunctive again.'
		}
	] as const;
</script>

<div class="screen" use:inview={{ threshold: 0.35 }}>
	<div class="head">
		<div class="title-row">
			<h2 class="title">Discover</h2>
			<span class="icon-btn"><UiIcon name="search" size={22} /></span>
			<span class="icon-btn filters">
				<UiIcon name="sliders" size={22} />
				<span class="count">2</span>
			</span>
		</div>
		<span class="pair-label">English ↔ Spanish</span>
		<div class="seg"><Segmented options={['For you', 'Active', 'Nearby']} active={0} /></div>
	</div>

	<!--
		Full-bleed: the negative margin cancels the screen's gutter and the strip's
		own padding puts it back, so the fourth card sits half off the edge and
		says there is more to the right.
	-->
	<div class="boosted">
		<div class="boosted-head">
			<span class="boosted-title"><UiIcon name="zap" size={15} />Boosted</span>
			<span class="boosted-what">What is this?</span>
		</div>
		<div class="strip">
			{#each boosted as b}
				<div class="boost-card">
					<span class="ring">
						<Avatar
							src={b.photo}
							initials={b.initials}
							tone={b.tone}
							size={64}
							online={b.online}
							name={b.name}
						/>
					</span>
					<span class="boost-text">
						<span class="boost-name">{b.name}</span>
						<span class="boost-pair">{b.pair}</span>
					</span>
					<span class="boost-plan">{b.tier}</span>
				</div>
			{/each}
		</div>
	</div>

	<ul class="list" role="list">
		{#each people as p}
			<li class="person">
				<Avatar
					src={p.photo}
					initials={p.initials}
					tone={p.tone}
					size={56}
					online={p.online}
					name={p.name}
				/>
				<div class="body">
					<div class="line">
						<span class="name">{p.name}</span>
						<span class="age">{p.age}</span>
						<span class="flag" aria-hidden="true">{p.flag}</span>
						{#if p.streak}
							<span class="streak"><UiIcon name="zap" size={13} />{p.streak}</span>
						{/if}
					</div>
					<div class="pair">
						<span>{p.pair}</span>
						<LevelBars level={p.level} />
					</div>
					{#if p.distance}
						<div class="distance">{p.distance}</div>
					{/if}
					<div class="bio">{p.bio}</div>
				</div>
			</li>
		{/each}
	</ul>

	<TabBar active="discover" unread={3} />
</div>

<style lang="scss">
	.screen {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}

	.head {
		padding: 12px 20px 0;
	}

	.title-row {
		display: flex;
		align-items: center;
		gap: 14px;
		min-height: 48px;
	}

	.title {
		margin: 0;
		flex: 1;
		font-size: 34px;
		font-weight: 800;
		line-height: 1.15;
		letter-spacing: 0;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		color: var(--color--text);
		flex: 0 0 auto;
	}

	// The filter button carries the number of filters that are on.
	.filters {
		width: auto;
		gap: 6px;
	}

	.count {
		min-width: 18px;
		padding: 0 5px;
		background: var(--color--accent);
		color: #fff;
		border-radius: var(--radius-pill);
		font-size: 11px;
		font-weight: 700;
		line-height: 18px;
		text-align: center;
	}

	// The pair the list is filtered by — a shortcut back into the filters.
	.pair-label {
		display: block;
		margin-top: 2px;
		font-size: 14px;
		font-weight: 700;
		color: var(--color--accent);
	}

	.seg {
		margin-top: 18px;
	}

	// The paid strip. Full-bleed, so the gutter is cancelled here and returned
	// by the strip's own padding.
	.boosted {
		margin: 24px -20px 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.boosted-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 0 20px;
	}

	.boosted-title {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font--title);
		font-size: 17px;
		font-weight: 800;
		color: var(--color--text);

		// The bolt is the one thing on this screen in the paid colour.
		:global(svg) {
			color: var(--color--pro);
		}
	}

	.boosted-what {
		font-size: 13px;
		font-weight: 600;
		color: var(--color--text-shade);
	}

	.strip {
		display: flex;
		gap: 12px;
		padding: 0 20px 4px;
		overflow: hidden;
	}

	.boost-card {
		flex: 0 0 auto;
		width: 132px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 16px 12px 14px;
		border-radius: var(--radius-xl);
		background: var(--color--muted);
		text-align: center;
	}

	// The ring is what marks a card as boosted at a glance; the gap inside it
	// is the card's own fill showing through.
	.ring {
		display: flex;
		padding: 3px;
		border: 3px solid var(--color--pro);
		border-radius: var(--radius-pill);
	}

	.boost-text {
		display: flex;
		flex-direction: column;
		gap: 3px;
		width: 100%;
		min-width: 0;
	}

	// First name only: two words do not fit 132px, and an ellipsis through
	// somebody's surname reads worse than leaving it for the profile.
	.boost-name {
		font-family: var(--font--title);
		font-size: 15px;
		font-weight: 800;
		color: var(--color--text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.boost-pair {
		font-size: 12px;
		font-weight: 600;
		color: var(--color--accent);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	// A brand mark rather than a translated string — the same word in every
	// locale, as on `me`.
	.boost-plan {
		padding: 4px 10px;
		border-radius: var(--radius-pill);
		background: var(--color--accent-tint);
		color: var(--color--pro);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		white-space: nowrap;
	}

	.list {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		padding: 8px 20px 0;
	}

	.person {
		display: flex;
		gap: 16px;
		align-items: flex-start;
		padding: 20px 0;
		border-bottom: 1px solid var(--color--border);

		&:last-child {
			border-bottom: 0;
		}
	}

	.body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.line {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.name {
		font-family: var(--font--title);
		font-size: 17px;
		font-weight: 800;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.age {
		font-size: 14px;
		color: var(--color--text-shade);
	}

	.flag {
		font-size: 15px;
	}

	.streak {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: 13px;
		color: var(--color--text-shade);
		white-space: nowrap;
		flex: 0 0 auto;
	}

	.pair {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color--accent);
	}

	.distance {
		font-size: 13px;
		color: var(--color--text-shade);
	}

	// Two lines, then it stops — the app clamps the bio so every row is the
	// same shape however much someone wrote.
	.bio {
		font-size: 15px;
		line-height: 1.45;
		color: var(--color--text-shade);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	// Rows land one after another, 60ms apart, the first time the screen is seen.
	.person {
		opacity: 0;
		transform: translateY(10px);
		transition: opacity 400ms var(--ease-out), transform 400ms var(--ease-out);
	}
	.person:nth-child(2) {
		transition-delay: 60ms;
	}
	.person:nth-child(3) {
		transition-delay: 120ms;
	}
	.person:nth-child(4) {
		transition-delay: 180ms;
	}
	:global(.is-in) .person {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.person {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
