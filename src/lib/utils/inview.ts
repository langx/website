/**
 * Adds `is-in` to an element once it has scrolled into view. Screens use it to
 * play their one authored moment (a chart growing, a correction arriving) when
 * the visitor actually looks at them, never on page load off-screen.
 *
 * With `prefers-reduced-motion: reduce` the class is added immediately; the
 * CSS behind it drops the movement and keeps the end state.
 */
export function inview(
	node: HTMLElement,
	options: { threshold?: number; once?: boolean } = {}
): { destroy(): void } {
	const { threshold = 0.35, once = true } = options;

	const reduce =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (reduce || typeof IntersectionObserver === 'undefined') {
		node.classList.add('is-in');
		node.dispatchEvent(new CustomEvent('enter'));
		return { destroy() {} };
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('is-in');
					node.dispatchEvent(new CustomEvent('enter'));
					if (once) observer.unobserve(node);
				} else if (!once) {
					node.classList.remove('is-in');
				}
			}
		},
		{ threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
