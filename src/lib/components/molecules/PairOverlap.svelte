<script lang="ts">
	/**
	 * Two languages as two circles, each the two thousand words it uses most,
	 * overlapping by exactly the share they have in common (see overlapDistance).
	 * The lens is the page's subject — the words that do not have to be learnt
	 * — so it is the one solid shape; the rest is hairline and tint.
	 *
	 * The figure is decoration for the sentence under it, which carries the
	 * number, so the drawing itself is hidden from screen readers.
	 */
	import ScriptDisc from '$lib/components/atoms/ScriptDisc.svelte';
	import { overlapDistance, sharePercent, PAIR_DEPTH } from '$lib/utils/overlap';
	import type { WordListMeta } from '$lib/data/most-common-words';

	interface Props {
		a: WordListMeta;
		b: WordListMeta;
		count: number;
	}

	let { a, b, count }: Props = $props();

	const nf = new Intl.NumberFormat('en-US');
	const R = 64;
	const W = 300;
	const H = 2 * R + 4;

	let d = $derived(overlapDistance(count / PAIR_DEPTH) * R);
	let ax = $derived(W / 2 - d / 2);
	let bx = $derived(W / 2 + d / 2);
	let clip = $derived(`overlap-${a.code}-${b.code}`);
</script>

<figure class="overlap">
	<span class="side a">
		<ScriptDisc nativeName={a.nativeName} code={a.code} size={40} />
		<span>{a.name}</span>
	</span>
	<svg viewBox="0 0 {W} {H}" aria-hidden="true">
		<defs>
			<clipPath id={clip}><circle cx={ax} cy={H / 2} r={R} /></clipPath>
		</defs>
		<circle class="set" cx={ax} cy={H / 2} r={R} />
		<circle class="set" cx={bx} cy={H / 2} r={R} />
		<circle class="lens" cx={bx} cy={H / 2} r={R} clip-path="url(#{clip})" />
		<circle class="edge" cx={ax} cy={H / 2} r={R} />
		<circle class="edge" cx={bx} cy={H / 2} r={R} />
	</svg>
	<span class="side b">
		<span>{b.name}</span>
		<ScriptDisc nativeName={b.nativeName} code={b.code} size={40} />
	</span>
	<figcaption>
		<strong class="tabular">{nf.format(count)}</strong> of the {nf.format(PAIR_DEPTH)} commonest words
		in each are the same — {sharePercent(count)} of either list.
	</figcaption>
</figure>

<style lang="scss">
	@use '$lib/scss/breakpoints' as *;

	.overlap {
		display: grid;
		grid-template-columns: 1fr minmax(0, 300px) 1fr;
		grid-template-areas: 'a svg b' 'cap cap cap';
		align-items: center;
		column-gap: var(--space-md);
		row-gap: var(--space-sm);
		margin: 0 0 var(--space-lg);
		padding: var(--space-lg) var(--space-md);
		border: 1px solid var(--color--border);
		border-radius: var(--radius-lg);

		// A phone has no room beside the circles: they take the row, and the
		// two names sit under their own circle.
		@include for-phone-only {
			grid-template-columns: 1fr 1fr;
			grid-template-areas: 'svg svg' 'a b' 'cap cap';
			padding: var(--space-md);
		}
	}

	svg {
		grid-area: svg;
		display: block;
		width: 100%;
		height: auto;
	}

	.set {
		fill: var(--color--muted);
	}

	.lens {
		fill: var(--color--text-shade);
	}

	.edge {
		fill: none;
		stroke: var(--color--border);
		stroke-width: 1;
	}

	.side {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		font-family: var(--font--title);
		font-weight: 800;
		font-size: 1.125rem;

		&.a {
			grid-area: a;
			justify-self: end;
		}

		&.b {
			grid-area: b;
			justify-self: start;
		}

		@include for-phone-only {
			font-size: 1rem;

			&.a {
				justify-self: start;
			}

			&.b {
				justify-self: end;
			}
		}
	}

	figcaption {
		grid-area: cap;
		text-align: center;
		color: var(--color--text-shade);
		font-size: 0.9375rem;

		strong {
			color: var(--color--text);
			font-family: var(--font--title);
			font-weight: 800;
		}
	}
</style>
