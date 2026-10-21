/**
 * Builds a chat thread one bubble at a time: every `[data-b]` inside the node
 * rises 12px and fades in, 450ms after the one before.
 *
 * - `loop` (the hero) holds the finished thread first and starts building
 *   after 8s, then again every 8s while it is on screen. Holding first means
 *   the page never paints a full thread and then empties it.
 * - `once` (a chapter) hides the bubbles only if the thread is still below
 *   the fold when the script runs, then builds them when it is half in view.
 *
 * Nothing is hidden in the HTML: the start state is a class this action adds.
 * Without script, and with reduced motion, the finished thread is what shows.
 */
export function bubbleBuild(
	node: HTMLElement,
	mode: 'loop' | 'once' | 'none' = 'once'
): { destroy(): void } {
	const noop = { destroy() {} };
	if (mode === 'none' || typeof IntersectionObserver === 'undefined') return noop;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return noop;

	const items = Array.from(node.querySelectorAll<HTMLElement>('[data-b]'));
	if (items.length === 0) return noop;

	const GAP = 450;
	const CYCLE = 8000;
	let timers: number[] = [];
	let visible = false;

	const clear = () => {
		timers.forEach((t) => clearTimeout(t));
		timers = [];
	};
	const showAll = () => {
		clear();
		node.classList.remove('b-building');
		items.forEach((el) => el.classList.remove('b-on'));
	};
	const build = () => {
		clear();
		items.forEach((el) => el.classList.remove('b-on'));
		node.classList.add('b-building');
		items.forEach((el, i) =>
			timers.push(window.setTimeout(() => el.classList.add('b-on'), 200 + i * GAP))
		);
		if (mode === 'loop') timers.push(window.setTimeout(build, CYCLE));
	};

	if (mode === 'once') {
		const rect = node.getBoundingClientRect();
		if (rect.top < window.innerHeight) return noop;
		node.classList.add('b-building');
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting && !visible) {
					visible = true;
					if (mode === 'once') {
						build();
						observer.disconnect();
					} else {
						timers.push(window.setTimeout(build, CYCLE));
					}
				} else if (!entry.isIntersecting && visible) {
					visible = false;
					if (mode === 'loop') showAll();
				}
			}
		},
		{ threshold: 0.5 }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
			clear();
		}
	};
}
