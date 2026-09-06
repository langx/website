/**
 * The logo mark in three dimensions: the two hooks from `Logo.svelte`,
 * extruded, lit, and turning slowly on a vertical axis. For the closing
 * section of the homepage.
 *
 * Kept out of the Svelte component for the same reason as `scene.ts`: the
 * component imports it in `onMount`, so `three` never runs at prerender and
 * only ships to the homepage.
 */
import {
	Clock,
	DirectionalLight,
	ExtrudeGeometry,
	Group,
	HemisphereLight,
	Mesh,
	MeshStandardMaterial,
	PerspectiveCamera,
	Scene,
	WebGLRenderer
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

export interface MarkColors {
	ink: string;
	yellow: string;
}

export interface MarkOptions {
	colors: MarkColors;
	/** `false` draws one still frame, turned a little (reduced motion). */
	animate: boolean;
}

export interface MarkHandle {
	setColors(colors: MarkColors): void;
	setPaused(paused: boolean): void;
	destroy(): void;
}

// The drawing from Logo.svelte, in its own 14.6 × 21.544 box.
const WIDTH = 14.6;
const HEIGHT = 21.544;
const INK =
	'm14.539 4.475-1.712 1.2s-2.252-3.189-5.588-1.2A4.123 4.123 0 0 0 5.618 6.41a4.751 4.751 0 0 0 .221 3.783l-1.654 1.145S1.319 6.776 5.369 3.193a6.685 6.685 0 0 1 5.47-1.316 6.3 6.3 0 0 1 3.7 2.598Z';
const YELLOW =
	'm0 14.076 1.715-1.188s2.307 3.177 5.641 1.188a4.088 4.088 0 0 0 1.656-1.875 4.757 4.757 0 0 0-.311-3.842l1.817-1.115s2.745 4.625-1.305 8.207a6.717 6.717 0 0 1-5.509 1.239A6.3 6.3 0 0 1 0 14.076Z';
const DEPTH = 2.4;
const SPIN = 0.5; // radians per second

function extrude(d: string, material: MeshStandardMaterial): Mesh {
	const { paths } = new SVGLoader().parse(
		`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`
	);
	const shapes = paths.flatMap((path) => SVGLoader.createShapes(path));
	const geometry = new ExtrudeGeometry(shapes, {
		depth: DEPTH,
		curveSegments: 24,
		bevelEnabled: true,
		bevelThickness: 0.3,
		bevelSize: 0.25,
		bevelSegments: 4
	});
	// Centre the drawing on the axis it turns about.
	geometry.translate(-WIDTH / 2, -HEIGHT / 2, -DEPTH / 2);
	return new Mesh(geometry, material);
}

export function createMark(container: HTMLElement, options: MarkOptions): MarkHandle {
	// Throws when the browser has no WebGL; the component shows the flat mark then.
	const renderer = new WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setClearColor(0x000000, 0);
	container.appendChild(renderer.domElement);

	const scene = new Scene();
	const camera = new PerspectiveCamera(30, 1, 1, 200);
	camera.position.set(0, 0, 46);
	camera.lookAt(0, 0, 0);

	scene.add(new HemisphereLight(0xffffff, 0x666666, 2.2));
	const key = new DirectionalLight(0xffffff, 2.4);
	key.position.set(2, 3, 5);
	scene.add(key);

	const inkMaterial = new MeshStandardMaterial({ color: options.colors.ink, roughness: 0.55 });
	const yellowMaterial = new MeshStandardMaterial({
		color: options.colors.yellow,
		roughness: 0.55
	});

	// SVG y runs down; a half turn about x puts the drawing the right way up.
	const flip = new Group();
	flip.rotation.x = Math.PI;
	flip.add(extrude(INK, inkMaterial), extrude(YELLOW, yellowMaterial));
	const spin = new Group();
	spin.add(flip);
	// A still frame straight on is a flat logo; turned a little, it reads as a solid.
	spin.rotation.y = 0.5;
	scene.add(spin);

	function render() {
		renderer.render(scene, camera);
	}

	const clock = new Clock(false);
	let raf = 0;
	let running = false;
	let paused = false;

	function frame() {
		raf = requestAnimationFrame(frame);
		const dt = Math.min(clock.getDelta(), 0.05);
		spin.rotation.y += dt * SPIN;
		render();
	}

	function start() {
		if (running || !options.animate) return;
		running = true;
		clock.start();
		frame();
	}

	function stop() {
		if (!running) return;
		running = false;
		cancelAnimationFrame(raf);
		clock.stop();
	}

	function resize() {
		const size = container.clientWidth;
		if (!size) return;
		renderer.setSize(size, size, false);
		render();
	}
	const observer = new ResizeObserver(resize);
	observer.observe(container);
	resize();
	if (!paused) start();

	return {
		setColors(colors) {
			inkMaterial.color.set(colors.ink);
			yellowMaterial.color.set(colors.yellow);
			if (!running) render();
		},
		setPaused(next) {
			paused = next;
			if (paused) stop();
			else start();
		},
		destroy() {
			stop();
			observer.disconnect();
			flip.traverse((node) => {
				if (node instanceof Mesh) node.geometry.dispose();
			});
			inkMaterial.dispose();
			yellowMaterial.dispose();
			renderer.dispose();
			renderer.domElement.remove();
		}
	};
}
