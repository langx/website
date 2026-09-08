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
	 * the three sorts, then one hairline row per person.
	 */
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
