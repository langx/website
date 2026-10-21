/**
 * The chapter rise: every `[data-rise]` inside the node rises 12px and fades
 * in, 80ms after the one before, once, when the node is half in view.
 *
 * The start state is the class `rise-wait`, added here and only when the
 * node is still below the fold as the script runs. A page without script, a
 * visitor with reduced motion and a chapter already on screen all get the
 * finished state; the HTML never hides anything.
 */
export function rise(node: HTMLElement): { destroy(): void } {
	const noop = { destroy() {} };
	if (typeof IntersectionObserver === 'undefined') return noop;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return noop;
	if (node.getBoundingClientRect().top < window.innerHeight) return noop;

	const items = Array.from(node.querySelectorAll<HTMLElement>('[data-rise]'));
	if (items.length === 0) return noop;

	items.forEach((el, i) => {
		el.style.transitionDelay = `${i * 80}ms`;
		el.classList.add('rise-wait');
	});

	const observer = new IntersectionObserver(
		(entries) => {
			if (!entries.some((e) => e.isIntersecting)) return;
			items.forEach((el) => el.classList.remove('rise-wait'));
			observer.disconnect();
		},
		{ threshold: 0.5 }
	);
	observer.observe(node);

	return { destroy: () => observer.disconnect() };
}
