<script lang="ts">
	import { reveal } from '$lib/utils/reveal';

	// What a Fluent day looks like inside the app. The 300 is Fluent's
	// translation cap in `data/plans.ts`; the 12 is a morning's use.
	const used = 12;
	const cap = 300;
</script>

<div
	class="card"
	role="img"
	aria-label="A Fluent account's day: unlimited chats, 12 of 300 translations used, two languages each way"
	data-reveal
	use:reveal={{ y: 40 }}
>
	<div class="head">
		<span class="plan">Fluent</span>
		<span class="since">your plan · since March</span>
	</div>
	<ul class="rows" role="list">
		<li>
			<span class="k">New conversations today</span>
			<span class="v">Unlimited</span>
		</li>
		<li>
			<span class="k">Translations today</span>
			<span class="v tabular">{used} of {cap}</span>
			<span class="bar" aria-hidden="true"><i style="width:{(used / cap) * 100}%" /></span>
		</li>
		<li>
			<span class="k">Learning</span>
			<span class="chips" aria-hidden="true"><span>Español</span><span>日本語</span></span>
		</li>
		<li>
			<span class="k">Native</span>
			<span class="chips" aria-hidden="true"><span>English</span><span>Türkçe</span></span>
		</li>
		<li>
			<span class="k">Filters</span>
			<span class="v">country · age · level · gender · city</span>
		</li>
	</ul>
</div>

<style lang="scss">
	.card {
		background: var(--color--surface);
		border: 2px solid var(--color--accent);
		border-radius: var(--radius-xl);
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.head {
		display: flex;
		align-items: baseline;
		gap: 10px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--color--border);
	}

	.plan {
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.25rem;
		color: var(--color--accent-shade);
	}

	.since {
		font-size: 0.75rem;
		color: var(--color--text-shade);
	}

	li {
		padding: 12px 0;
		border-bottom: 1px solid var(--color--border);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 12px;

		&:last-child {
			border-bottom: 0;
			padding-bottom: 0;
		}
	}

	.k {
		flex: 1 1 auto;
		font-size: 0.875rem;
		color: var(--color--text-shade);
	}

	.v {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
	}

	.bar {
		flex: 1 0 100%;
		height: 6px;
		border-radius: var(--radius-pill);
		background: var(--color--muted);
		overflow: hidden;

		i {
			display: block;
			height: 100%;
			border-radius: inherit;
			background: var(--color--accent);
		}
	}

	.chips {
		display: flex;
		gap: 6px;

		span {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: 0.8125rem;
			padding: 3px 10px;
			border-radius: var(--radius-pill);
			border: 1px solid var(--color--border);
		}
	}
</style>
