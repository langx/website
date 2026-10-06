<script lang="ts">
	/**
	 * A long list's table of contents, drawn: one card per level, a meter for
	 * how hard it is, and its themes as links to the headings below. For posts
	 * whose sections are a ladder (beginner → advanced) rather than a sequence.
	 */
	type Theme = { label: string; href: string };
	type Level = {
		name: string;
		/** "Questions 1–70" — what the reader will find under it. */
		range: string;
		/** One line on what the level practices. */
		note?: string;
		themes: Theme[];
	};

	interface Props {
		title?: string;
		levels: Level[];
	}

	let { title = '', levels }: Props = $props();

	const id = $props.id();
</script>

<!-- The title is a <p>, not a <figcaption>: the post styles centre every
     figcaption as an image caption, and this one heads a figure. -->
<figure class="map" aria-labelledby={title ? id : undefined}>
	{#if title}<p class="title" {id}>{title}</p>{/if}
	<ol>
		{#each levels as level, i}
			<li>
				<div class="head">
					<span class="meter" aria-hidden="true">
						{#each [...levels.keys()] as j}
							<span class:on={j <= i}></span>
						{/each}
					</span>
					<span class="name">{level.name}</span>
				</div>
				<p class="range">{level.range}</p>
				{#if level.note}<p class="note">{level.note}</p>{/if}
				<ul role="list">
					{#each level.themes as t}
						<li><a href={t.href}>{t.label}</a></li>
					{/each}
				</ul>
			</li>
		{/each}
	</ol>
</figure>

<style lang="scss">
	.map {
		margin: var(--space-lg) 0;
	}

	.title {
		margin: 0 0 14px;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.0625rem;
	}

	ol {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 12px;

		> li {
			margin: 0;
			padding: 16px 16px 12px;
			border: 1px solid var(--color--border);
			border-radius: var(--radius-lg);
			background: var(--color--surface);
		}
	}

	.head {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	// Signal-strength bars: one more filled for each step up the ladder.
	.meter {
		display: inline-flex;
		align-items: flex-end;
		gap: 2px;
		height: 16px;

		span {
			width: 4px;
			border-radius: 1px;
			background: var(--color--border);

			&:nth-child(1) {
				height: 8px;
			}
			&:nth-child(2) {
				height: 12px;
			}
			&:nth-child(3) {
				height: 16px;
			}

			&.on {
				background: var(--color--accent);
			}
		}
	}

	.name {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.0625rem;
		color: var(--color--text);
	}

	.range {
		margin: 4px 0 0;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color--accent);
		font-variant-numeric: tabular-nums;
	}

	.note {
		margin: 4px 0 0;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color--text-shade);
	}

	ul {
		margin: 12px 0 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;

		li {
			margin: 0;
		}
	}

	a {
		display: inline-block;
		padding: 4px 8px;
		border-radius: var(--radius-sm);
		background: var(--color--accent-tint);
		color: var(--color--accent);
		font-size: 0.8125rem;
		font-weight: 600;
		line-height: 1.4;
		text-decoration: none;
		transition: background-color var(--dur-fast) ease;

		&:hover {
			background: var(--color--border);
		}
	}
</style>
