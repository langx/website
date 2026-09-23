<script lang="ts">
	/** What an app does well and where it falls short, as two short lists. */
	export let name = '';
	export let pros: string[];
	export let cons: string[];
</script>

<div class="pc">
	<section class="col pros">
		<span class="name">{name ? `${name}: good at` : 'Good at'}</span>
		<ul role="list">
			{#each pros as p}<li><span aria-hidden="true">+</span>{p}</li>{/each}
		</ul>
	</section>
	<section class="col cons">
		<span class="name">{name ? `${name}: watch out for` : 'Watch out for'}</span>
		<ul role="list">
			{#each cons as c}<li><span aria-hidden="true">−</span>{c}</li>{/each}
		</ul>
	</section>
</div>

<style lang="scss">
	.pc {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin: var(--space-md) 0 var(--space-lg);

		@media (max-width: 620px) {
			grid-template-columns: 1fr;
		}
	}

	.col {
		padding: 16px 18px;
		border-radius: var(--radius-lg);
	}

	.pros {
		background: var(--color--success-tint);
	}

	.cons {
		background: var(--color--muted);
	}

	.name {
		display: block;
		margin: 0 0 10px;
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 0.9375rem;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 6px;
	}

	li {
		display: grid;
		grid-template-columns: 14px 1fr;
		gap: 6px;
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.45;

		span {
			font-weight: 800;
		}
	}

	.pros span {
		color: var(--color--success);
	}

	.cons span {
		color: var(--color--text-tertiary);
	}
</style>
