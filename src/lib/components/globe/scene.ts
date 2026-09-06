/**
 * The hero globe: a dotted sphere, a handful of cities, and arcs that grow
 * from one city to another, rest, fade, and start again somewhere else.
 *
 * Kept out of the Svelte component so Vite can tree-shake `three` into a
 * chunk that only the homepage loads, and so nothing here runs during
 * prerender — the component imports this module in `onMount`.
 */
import {
	BufferGeometry,
	Clock,
	CubicBezierCurve3,
	Float32BufferAttribute,
	Group,
	MathUtils,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Points,
	PointsMaterial,
	Scene,
	SphereGeometry,
	Texture,
	TubeGeometry,
	Vector3,
	WebGLRenderer
} from 'three';

export interface GlobeColors {
	/** The disc itself. Opaque, so arcs and dots on the far side are hidden. */
	surface: string;
	dots: string;
	arc: string;
	city: string;
}

export interface GlobeOptions {
	colors: GlobeColors;
	/** `false` draws one still frame with every arc complete (reduced motion). */
	animate: boolean;
}

export interface GlobeHandle {
	setColors(colors: GlobeColors): void;
	setPaused(paused: boolean): void;
	destroy(): void;
}

const RADIUS = 1;
const DOT_COUNT = 1600;
// Half the arcs sit on the far side at any moment, so six reads as three.
const ARC_COUNT = 6;
// Seconds. An arc grows, rests, fades, then picks a new pair of cities.
const GROW = 1.4;
const HOLD = 1.6;
const FADE = 0.8;
const SPIN = 0.06; // radians per second
const TILT = MathUtils.degToRad(23.4);
const TUBE_SEGMENTS = 64;
const TUBE_RADIAL = 5;
const TUBE_RADIUS = 0.007;

// [latitude, longitude]. Spread across continents so arcs cross the disc
// rather than huddling in one hemisphere.
const CITIES: Array<[number, number]> = [
	[41.01, 28.98], // Istanbul
	[52.52, 13.41], // Berlin
	[48.86, 2.35], // Paris
	[40.42, -3.7], // Madrid
	[51.51, -0.13], // London
	[40.71, -74.01], // New York
	[19.43, -99.13], // Mexico City
	[-23.55, -46.63], // São Paulo
	[-34.6, -58.38], // Buenos Aires
	[6.52, 3.38], // Lagos
	[30.04, 31.24], // Cairo
	[-1.29, 36.82], // Nairobi
	[19.08, 72.88], // Mumbai
	[-6.21, 106.85], // Jakarta
	[37.57, 126.98], // Seoul
	[35.68, 139.69], // Tokyo
	[-33.87, 151.21], // Sydney
	[55.76, 37.62], // Moscow
	[35.69, 51.39], // Tehran
	[43.65, -79.38] // Toronto
];

function toVector(lat: number, lon: number, r: number): Vector3 {
	const phi = MathUtils.degToRad(90 - lat);
	const theta = MathUtils.degToRad(lon + 180);
	return new Vector3(
		-r * Math.sin(phi) * Math.cos(theta),
		r * Math.cos(phi),
		r * Math.sin(phi) * Math.sin(theta)
	);
}

function arcBetween(a: Vector3, b: Vector3): CubicBezierCurve3 {
	// Longer hops rise higher, so a Tokyo–São Paulo arc clears the disc.
	const lift = RADIUS * (0.12 + a.distanceTo(b) * 0.25);
	const c1 = a
		.clone()
		.lerp(b, 0.25)
		.normalize()
		.multiplyScalar(RADIUS + lift);
	const c2 = a
		.clone()
		.lerp(b, 0.75)
		.normalize()
		.multiplyScalar(RADIUS + lift);
	return new CubicBezierCurve3(a, c1, c2, b);
}

function fibonacciSphere(count: number, r: number): Float32Array {
	const out = new Float32Array(count * 3);
	const golden = Math.PI * (3 - Math.sqrt(5));
	for (let i = 0; i < count; i++) {
		const y = 1 - (i / (count - 1)) * 2;
		const ring = Math.sqrt(1 - y * y);
		const theta = golden * i;
		out[i * 3] = Math.cos(theta) * ring * r;
		out[i * 3 + 1] = y * r;
		out[i * 3 + 2] = Math.sin(theta) * ring * r;
	}
	return out;
}

// Points render as squares by default; a soft disc texture makes them dots.
function discTexture(): Texture {
	const size = 32;
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = size;
	const ctx = canvas.getContext('2d');
	if (ctx) {
		ctx.fillStyle = '#fff';
		ctx.beginPath();
		ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
		ctx.fill();
	}
	const texture = new Texture(canvas);
	texture.needsUpdate = true;
	return texture;
}

function smoothstep(p: number): number {
	return p * p * (3 - 2 * p);
}

interface Arc {
	curve: CubicBezierCurve3;
	material: MeshBasicMaterial;
	tube: Mesh<TubeGeometry, MeshBasicMaterial>;
	head: Mesh<SphereGeometry, MeshBasicMaterial>;
	phase: 'grow' | 'hold' | 'fade';
	t: number;
}

export function createGlobe(container: HTMLElement, options: GlobeOptions): GlobeHandle {
	// Throws when the browser has no WebGL; the component hides itself then.
	const renderer = new WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setClearColor(0x000000, 0);
	container.appendChild(renderer.domElement);

	const scene = new Scene();
	const camera = new PerspectiveCamera(30, 1, 0.1, 20);
	camera.position.set(0, 0.35, 4.8);
	camera.lookAt(0, 0, 0);

	const tilt = new Group();
	tilt.rotation.z = -TILT;
	const spin = new Group();
	tilt.add(spin);
	scene.add(tilt);

	const disc = discTexture();

	const surfaceMaterial = new MeshBasicMaterial({ color: options.colors.surface });
	const surface = new Mesh(new SphereGeometry(RADIUS, 48, 48), surfaceMaterial);
	spin.add(surface);

	const dotsGeometry = new BufferGeometry();
	dotsGeometry.setAttribute(
		'position',
		new Float32BufferAttribute(fibonacciSphere(DOT_COUNT, RADIUS * 1.004), 3)
	);
	const dotsMaterial = new PointsMaterial({
		color: options.colors.dots,
		size: 2.5,
		sizeAttenuation: false,
		map: disc,
		alphaTest: 0.5,
		transparent: true,
		opacity: 0.8
	});
	spin.add(new Points(dotsGeometry, dotsMaterial));

	const cityVectors = CITIES.map(([lat, lon]) => toVector(lat, lon, RADIUS * 1.01));
	const cityGeometry = new BufferGeometry().setFromPoints(cityVectors);
	const cityMaterial = new PointsMaterial({
		color: options.colors.city,
		size: 7,
		sizeAttenuation: false,
		map: disc,
		alphaTest: 0.5
	});
	spin.add(new Points(cityGeometry, cityMaterial));

	const headGeometry = new SphereGeometry(0.018, 12, 12);
	const arcs: Arc[] = [];

	function pickPair(): [Vector3, Vector3] {
		const a = Math.floor(Math.random() * cityVectors.length);
		let b = a;
		// Skip neighbours: a Berlin–Paris arc is too short to read as travel.
		while (b === a || cityVectors[a].distanceTo(cityVectors[b]) < 0.5) {
			b = Math.floor(Math.random() * cityVectors.length);
		}
		return [cityVectors[a], cityVectors[b]];
	}

	function restart(arc: Arc, delay: number) {
		const [a, b] = pickPair();
		arc.curve = arcBetween(a, b);
		arc.tube.geometry.dispose();
		arc.tube.geometry = new TubeGeometry(arc.curve, TUBE_SEGMENTS, TUBE_RADIUS, TUBE_RADIAL, false);
		arc.tube.geometry.setDrawRange(0, 0);
		arc.head.visible = false;
		arc.material.opacity = 1;
		arc.phase = 'grow';
		arc.t = -delay;
	}

	function draw(arc: Arc, progress: number) {
		const eased = smoothstep(progress);
		arc.tube.geometry.setDrawRange(0, Math.floor(eased * TUBE_SEGMENTS) * TUBE_RADIAL * 6);
		arc.head.position.copy(arc.curve.getPoint(eased));
		arc.head.visible = true;
	}

	for (let i = 0; i < ARC_COUNT; i++) {
		const material = new MeshBasicMaterial({ color: options.colors.arc, transparent: true });
		const tube = new Mesh(new TubeGeometry(), material);
		const head = new Mesh(headGeometry, material);
		spin.add(tube, head);
		const arc: Arc = {
			curve: arcBetween(cityVectors[0], cityVectors[1]),
			material,
			tube,
			head,
			phase: 'grow',
			t: 0
		};
		arcs.push(arc);
		// Staggered starts, so the four arcs never move in lockstep.
		restart(arc, options.animate ? i * 0.6 : 0);
		if (!options.animate) draw(arc, 1);
	}

	function step(dt: number) {
		for (const arc of arcs) {
			arc.t += dt;
			if (arc.phase === 'grow') {
				if (arc.t < 0) continue;
				const p = Math.min(arc.t / GROW, 1);
				draw(arc, p);
				if (p === 1) {
					arc.phase = 'hold';
					arc.t = 0;
				}
			} else if (arc.phase === 'hold') {
				if (arc.t >= HOLD) {
					arc.phase = 'fade';
					arc.t = 0;
				}
			} else {
				arc.material.opacity = Math.max(1 - arc.t / FADE, 0);
				if (arc.t >= FADE) restart(arc, Math.random() * 0.8);
			}
		}
	}

	function render() {
		renderer.render(scene, camera);
	}

	// Mouse and pen can drag the globe; touch is left alone so the page
	// still scrolls when a thumb lands on the hero.
	let dragging = false;
	let lastX = 0;
	let lastY = 0;
	const canvas = renderer.domElement;
	canvas.style.cursor = 'grab';
	const onDown = (e: PointerEvent) => {
		if (e.pointerType === 'touch') return;
		dragging = true;
		lastX = e.clientX;
		lastY = e.clientY;
		canvas.setPointerCapture(e.pointerId);
		canvas.style.cursor = 'grabbing';
	};
	const onMove = (e: PointerEvent) => {
		if (!dragging) return;
		spin.rotation.y += (e.clientX - lastX) * 0.005;
		spin.rotation.x = MathUtils.clamp(spin.rotation.x + (e.clientY - lastY) * 0.005, -0.6, 0.6);
		lastX = e.clientX;
		lastY = e.clientY;
		if (!running) render();
	};
	const onUp = () => {
		dragging = false;
		canvas.style.cursor = 'grab';
	};
	canvas.addEventListener('pointerdown', onDown);
	canvas.addEventListener('pointermove', onMove);
	canvas.addEventListener('pointerup', onUp);
	canvas.addEventListener('pointercancel', onUp);

	const clock = new Clock(false);
	let raf = 0;
	let running = false;
	let paused = false;

	function frame() {
		raf = requestAnimationFrame(frame);
		// Cap the step so a tab that was asleep does not lurch when it wakes.
		const dt = Math.min(clock.getDelta(), 0.05);
		if (!dragging) spin.rotation.y += dt * SPIN;
		step(dt);
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
			surfaceMaterial.color.set(colors.surface);
			dotsMaterial.color.set(colors.dots);
			cityMaterial.color.set(colors.city);
			for (const arc of arcs) arc.material.color.set(colors.arc);
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
			canvas.removeEventListener('pointerdown', onDown);
			canvas.removeEventListener('pointermove', onMove);
			canvas.removeEventListener('pointerup', onUp);
			canvas.removeEventListener('pointercancel', onUp);
			surface.geometry.dispose();
			surfaceMaterial.dispose();
			dotsGeometry.dispose();
			dotsMaterial.dispose();
			cityGeometry.dispose();
			cityMaterial.dispose();
			headGeometry.dispose();
			disc.dispose();
			for (const arc of arcs) {
				arc.tube.geometry.dispose();
				arc.material.dispose();
			}
			renderer.dispose();
			canvas.remove();
		}
	};
}
