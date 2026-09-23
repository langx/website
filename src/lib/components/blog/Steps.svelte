<script lang="ts">
	/** A plan or a process as a numbered path, for how-tos and day-by-day plans. */
	type Step = { title: string; text?: string; label?: string };
	export let steps: Step[];
	export let title = '';
</script>

<figure class="steps">
	{#if title}<figcaption>{title}</figcaption>{/if}
	<ol>
		{#each steps as s, i}
			<li>
				<span class="n" aria-hidden="true">{s.label ?? i + 1}</span>
				<div>
					<p class="t" dir="auto">{s.title}</p>
					{#if s.text}<p class="x" dir="auto">{s.text}</p>{/if}
				</div>
			</li>
		{/each}
	</ol>
</figure>

<style lang="scss">
	.steps {
		margin: var(--space-lg) 0;
	}

	figcaption {
		margin-bottom: 14px;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.0625rem;
	}

	ol {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0;
	}

	li {
		position: relative;
		display: grid;
		grid-template-columns: 40px 1fr;
		gap: 14px;
		margin: 0;
		padding-bottom: 18px;

		&:not(:last-child)::before {
			content: '';
			position: absolute;
			left: 19px;
			top: 40px;
			bottom: 4px;
			width: 2px;
			border-radius: 2px;
			background: var(--color--border);
		}
	}

	.n {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--color--accent-tint);
		color: var(--color--accent);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
		white-space: nowrap;
	}

	.t {
		margin: 8px 0 2px;
		font-weight: 700;
	}

	.x {
		margin: 0;
		color: var(--color--text-shade);
		line-height: 1.55;
	}
</style>
