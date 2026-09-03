<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import LevelBars from '$lib/components/atoms/LevelBars.svelte';
	import Segmented from '$lib/components/atoms/Segmented.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';
	import TabBar from './TabBar.svelte';
	import { inview } from '$lib/utils/inview';

	const people = [
		{
			initials: 'LM',
			photo: '/images/people/lucia.webp',
			tone: 'accent',
			name: 'Lucía M.',
			age: 26,
			streak: 41,
			online: true,
			pair: 'Spanish → English',
			level: 2,
			bio: 'Madrid. I correct everything, sorry in advance.'
		},
		{
			initials: 'JR',
			photo: '/images/people/javier.webp',
			tone: 'success',
			name: 'Javier R.',
			age: 31,
			streak: 7,
			online: false,
			pair: 'Spanish, Catalan → English',
			level: 3,
			bio: 'Teaching myself English from song lyrics. It is going badly.'
		},
		{
			initials: 'AC',
			photo: '/images/people/ana.webp',
			tone: 'ink',
			name: 'Ana C.',
			age: 24,
			streak: 0,
			online: true,
			pair: 'Spanish → English',
			level: 1,
			bio: 'Day one. Voice notes only — typing English takes me an hour.'
		},
		{
			initials: 'MP',
			photo: '/images/people/mateo.webp',
			tone: 'accent',
			name: 'Mateo P.',
			age: 29,
			streak: 122,
			online: false,
			pair: 'Spanish → English',
			level: 4,
			bio: 'Buenos Aires. Happy to explain the subjunctive again.'
		}
	] as const;
</script>

<div class="screen" use:inview={{ threshold: 0.35 }}>
	<div class="head">
		<div class="title-row">
			<h2 class="title">Discover</h2>
			<UiIcon name="filter" size={22} />
		</div>
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
						{#if p.streak}<span class="streak">🔥 {p.streak}</span>{/if}
					</div>
					<div class="pair">
						<span>{p.pair}</span>
						<LevelBars level={p.level} />
					</div>
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
		padding: 14px 24px 0;
	}

	.title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.title {
		margin: 0;
		font-size: 34px;
		font-weight: 800;
		line-height: 1.15;
		letter-spacing: 0;
	}

	.seg {
		margin-top: 18px;
	}

	.list {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		padding: 6px 24px 0;
	}

	.person {
		display: flex;
		gap: 14px;
		padding: 20px 0;
		border-bottom: 1px solid var(--color--border);

		&:last-child {
			border-bottom: 0;
		}
	}

	.body {
		flex: 1;
		min-width: 0;
	}

	.line {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.name {
		font-family: var(--font--title);
		font-size: 17px;
		font-weight: 800;
	}

	.age {
		font-size: 14px;
		color: var(--color--text-shade);
	}

	.streak {
		margin-left: auto;
		font-size: 13px;
		color: var(--color--text-shade);
		white-space: nowrap;
		flex: 0 0 auto;
	}

	.pair {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color--accent);
		margin-top: 3px;
	}

	.bio {
		font-size: 15px;
		line-height: 1.5;
		color: var(--color--text-shade);
		margin-top: 5px;
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
