<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import GithubIcon from '$lib/icons/socials/github.svelte';

	/**
	 * The open-source chapter. Every line here is a fact somebody can check in a
	 * minute, which is the only kind of claim this section is allowed to make:
	 * the licence file, the repository, the self-hosting guide.
	 *
	 * Deliberately says nothing about tracking or analytics. The app ships a
	 * product-analytics SDK, so a "no trackers" line here would be false — see
	 * the note in PRODUCT.md.
	 */
	const repo = 'langx/langx';
	let stars = -1;

	onMount(async () => {
		try {
			const res = await fetch(`https://api.github.com/repos/${repo}`);
			if (!res.ok) return;
			stars = (await res.json()).stargazers_count ?? -1;
		} catch {
			// Rate-limited or offline. The count is decoration; the facts are not.
		}
	});

	const facts = [
		{ big: 'BSD-3', small: 'licensed — use it, fork it, sell it' },
		{ big: 'Every line', small: 'of the app and the API, in the open' },
		{ big: 'Self-hostable', small: 'run the whole thing on your own server' }
	];
</script>

<section class="os">
	<div class="container">
		<h2>open source. all of it.</h2>
		<p class="lede">
			Not a public mirror, not an SDK, not the client with the interesting half missing. The app you
			install and the server it talks to are the same code you can read, change and run yourself.
		</p>

		<dl class="facts">
			{#each facts as f}
				<div>
					<dt>{f.big}</dt>
					<dd>{f.small}</dd>
				</div>
			{/each}
		</dl>

		<div class="actions">
			<Button href="https://github.com/{repo}" variant="secondary" size="md">
				<span class="gh"><GithubIcon /></span>
				Read the source
				{#if stars > 0}<span class="stars">{stars.toLocaleString('en-US')}</span>{/if}
			</Button>
			<a class="ghost" href="https://github.com/langx/langx/contribute">Good first issues</a>
		</div>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.os {
		border-top: 1px solid var(--color--border);
		padding: var(--space-3xl) 0;

		@include for-phone-only {
			padding: var(--space-2xl) 0;
		}
	}

	// The chapter voice: lowercase, ending in a full stop. Ink rather than blue,
	// because there is no phone beside it.
	h2 {
		font-family: var(--font--title);
		font-weight: 800;
		font-size: clamp(2rem, 1.4rem + 2.4vw, 3rem);
		line-height: 1.05;
		letter-spacing: -0.02em;
		max-width: 16ch;
	}

	.lede {
		font-size: 1.125rem;
		line-height: 1.6;
		color: var(--color--text-shade);
		max-width: 52ch;
		margin-top: var(--space-sm);
	}

	// Hairlines and figures, not cards — the same device the tools pages use.
	.facts {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		border-top: 1px solid var(--color--border);
		border-bottom: 1px solid var(--color--border);
		margin: var(--space-xl) 0 var(--space-lg);

		> div {
			padding: var(--space-md) var(--space-md) var(--space-md) 0;

			+ div {
				border-left: 1px solid var(--color--border);
				padding-left: var(--space-md);
			}
		}

		dt {
			font-family: var(--font--title);
			font-weight: 800;
			font-size: clamp(1.375rem, 1.1rem + 1.1vw, 1.875rem);
			line-height: 1.1;
			letter-spacing: -0.02em;
		}

		dd {
			margin-top: var(--space-2xs);
			font-size: 0.8125rem;
			line-height: 1.4;
			color: var(--color--text-quiet);
			max-width: 24ch;
		}

		@include for-phone-only {
			grid-template-columns: 1fr;

			> div + div {
				border-left: 0;
				padding-left: 0;
				border-top: 1px solid var(--color--border);
			}
		}
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-sm);
	}

	.gh {
		display: inline-flex;
		width: 18px;
		height: 18px;
	}

	.stars {
		font-variant-numeric: tabular-nums;
		color: var(--color--text-quiet);
	}

	.ghost {
		color: var(--color--accent);
		font-size: 0.9375rem;
		font-weight: 600;
		padding: 0 10px;
	}

	// No scroll reveal here, deliberately. The other chapters fade in because
	// what they hold is a demonstration; this one holds claims about the licence
	// and the source, and a claim that depends on an IntersectionObserver firing
	// is a claim that can fail to appear at all.
</style>
