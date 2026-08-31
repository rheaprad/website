<script lang="ts">
	/**
	 * Hand-inked balloon page header. The balloon outline is generated per title: a
	 * seeded wobbly walk around the measured text box, so the shape always hugs the
	 * text neatly, whatever its length. Five balloon vocabularies from comics:
	 *   speech  — smooth balloon with a tail
	 *   thought — scalloped cloud with trailing bubbles
	 *   burst   — spiky shout balloon
	 *   caption — hand-ruled narration box
	 *   whisper — dashed outline with a tail
	 * A light turbulence filter roughens the stroke so it reads as pen on paper.
	 * Deterministic per (title, variant); when no variant is given, one is picked
	 * from the title's hash so ad-hoc pages (tags etc.) vary but stay stable.
	 */
	export type BalloonVariant = 'speech' | 'thought' | 'burst' | 'caption' | 'whisper';

	interface Props {
		title: string;
		sub?: string;
		variant?: BalloonVariant;
		seed?: number;
	}
	let { title, sub = '', variant, seed }: Props = $props();

	const uid = $props.id();

	const INK = 'var(--color-foreground)';
	const PAPER = 'oklch(0.995 0.002 95)';
	const VARIANTS: BalloonVariant[] = ['speech', 'thought', 'burst', 'caption', 'whisper'];

	function hashSeed(s: string): number {
		let h = 2166136261;
		for (let i = 0; i < s.length; i++) {
			h ^= s.charCodeAt(i);
			h = Math.imul(h, 16777619);
		}
		return h >>> 0;
	}
	function mulberry32(a: number): () => number {
		let s = a >>> 0;
		return () => {
			s |= 0;
			s = (s + 0x6d2b79f5) | 0;
			let t = Math.imul(s ^ (s >>> 15), 1 | s);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	const kind: BalloonVariant = $derived(variant ?? VARIANTS[hashSeed(title) % VARIANTS.length]);

	type Pt = { x: number; y: number };

	// clockwise walk around a rect, one jittered point every ~step px
	function perimeter(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		step: number,
		jit: number,
		rnd: () => number
	): Pt[] {
		const pts: Pt[] = [];
		const edges = [
			[x0, y0, x1, y0],
			[x1, y0, x1, y1],
			[x1, y1, x0, y1],
			[x0, y1, x0, y0]
		];
		for (const [ax, ay, bx, by] of edges) {
			const len = Math.hypot(bx - ax, by - ay);
			const n = Math.max(2, Math.round(len / step));
			for (let i = 0; i < n; i++) {
				const t = i / n;
				pts.push({
					x: ax + (bx - ax) * t + (rnd() * 2 - 1) * jit,
					y: ay + (by - ay) * t + (rnd() * 2 - 1) * jit
				});
			}
		}
		return pts;
	}

	// closed path through midpoints — soft, organically rounded balloon body
	function smoothPath(pts: Pt[]): string {
		const n = pts.length;
		let d = `M ${((pts[0].x + pts[n - 1].x) / 2).toFixed(1)} ${((pts[0].y + pts[n - 1].y) / 2).toFixed(1)}`;
		for (let i = 0; i < n; i++) {
			const p = pts[i];
			const q = pts[(i + 1) % n];
			d += ` Q ${p.x.toFixed(1)} ${p.y.toFixed(1)} ${((p.x + q.x) / 2).toFixed(1)} ${((p.y + q.y) / 2).toFixed(1)}`;
		}
		return d + ' Z';
	}

	// straight jittered segments — a box ruled by hand
	function ruledPath(pts: Pt[]): string {
		return 'M ' + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ') + ' Z';
	}

	// outward arcs between points — thought cloud scallops
	function cloudPath(pts: Pt[], bulge: number, cx: number, cy: number): string {
		const n = pts.length;
		let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
		for (let i = 0; i < n; i++) {
			const p = pts[i];
			const q = pts[(i + 1) % n];
			const mx = (p.x + q.x) / 2;
			const my = (p.y + q.y) / 2;
			const dl = Math.hypot(mx - cx, my - cy) || 1;
			d += ` Q ${(mx + ((mx - cx) / dl) * bulge).toFixed(1)} ${(my + ((my - cy) / dl) * bulge).toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
		}
		return d + ' Z';
	}

	// alternate spikes out / notches in along the normal — shout burst
	function burstPath(pts: Pt[], spike: number, cx: number, cy: number, rnd: () => number): string {
		const out = pts.map((p, i) => {
			const dl = Math.hypot(p.x - cx, p.y - cy) || 1;
			const off = i % 2 === 0 ? spike * (0.7 + rnd() * 0.6) : -4;
			return `${(p.x + ((p.x - cx) / dl) * off).toFixed(1)} ${(p.y + ((p.y - cy) / dl) * off).toFixed(1)}`;
		});
		return 'M ' + out.join(' L ') + ' Z';
	}

	// measured content box of the wrapper (the padded title area)
	let w = $state(0);
	let h = $state(0);

	const geo = $derived.by(() => {
		if (w < 10 || h < 10) return null;
		const rnd = mulberry32(seed ?? hashSeed(title + kind));
		// clearance so spikes / scallops stay inside the svg box
		const m = kind === 'burst' ? 16 : kind === 'thought' ? 15 : 4;
		const x0 = m,
			y0 = m,
			x1 = w - m,
			y1 = h - m,
			cx = w / 2,
			cy = h / 2;

		let d = '';
		if (kind === 'thought') {
			d = cloudPath(perimeter(x0, y0, x1, y1, 42, 2, rnd), 13, cx, cy);
		} else if (kind === 'burst') {
			d = burstPath(perimeter(x0, y0, x1, y1, 36, 1.5, rnd), 21, cx, cy, rnd);
		} else if (kind === 'caption') {
			d = ruledPath(perimeter(x0, y0, x1, y1, 34, 1.3, rnd));
		} else {
			d = smoothPath(perimeter(x0, y0, x1, y1, 30, 1.6, rnd));
		}

		// speech / whisper tail: an open V from just inside the bottom edge, so its
		// paper fill covers the body stroke where they join
		let tail = '';
		if (kind === 'speech' || kind === 'whisper') {
			const bx = x0 + (x1 - x0) * 0.16;
			const bw = Math.min(34, (x1 - x0) * 0.16);
			const ap = { x: bx - bw * 0.55 + (rnd() * 2 - 1) * 3, y: y1 + 24 + rnd() * 6 };
			tail = `M ${(bx + bw).toFixed(1)} ${(y1 - 2.5).toFixed(1)} L ${ap.x.toFixed(1)} ${ap.y.toFixed(1)} L ${bx.toFixed(1)} ${(y1 - 2.5).toFixed(1)}`;
		}

		// thought trail: two shrinking bubbles below-left
		let bubbles: { cx: number; cy: number; r: number }[] = [];
		if (kind === 'thought') {
			const bx = x0 + (x1 - x0) * 0.13;
			bubbles = [
				{ cx: bx, cy: y1 + 17, r: 7 },
				{ cx: bx - 16, cy: y1 + 31, r: 4 }
			];
		}
		return { d, tail, bubbles };
	});

	const pad = $derived(
		kind === 'burst'
			? 'px-[0.85em] py-[0.55em]'
			: kind === 'thought'
				? 'px-[0.7em] py-[0.5em]'
				: 'px-[0.55em] py-[0.32em]'
	);
	const dash = $derived(kind === 'whisper' ? '7 5' : 'none');
	// the tail / trailing bubbles hang below the balloon; give the sub room to clear them
	const subGap = $derived(kind === 'caption' || kind === 'burst' ? 'mt-4' : 'mt-9');
</script>

<div class="inline-block">
	<div
		class="relative inline-block {pad} text-[clamp(2.4rem,7.5vw,4.5rem)]"
		bind:clientWidth={w}
		bind:clientHeight={h}
	>
		{#if geo}
			<svg
				aria-hidden="true"
				class="absolute inset-0 h-full w-full overflow-visible"
				viewBox="0 0 {w} {h}"
			>
				<filter id="wobble-{uid}" x="-15%" y="-15%" width="130%" height="130%">
					<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="9" result="n" />
					<feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
				</filter>
				<g style="filter: url(#wobble-{uid});">
					<path
						d={geo.d}
						fill={PAPER}
						stroke={INK}
						stroke-width="2.5"
						stroke-linejoin="round"
						stroke-dasharray={dash}
					/>
					{#if geo.tail}
						<path
							d={geo.tail}
							fill={PAPER}
							stroke={INK}
							stroke-width="2.5"
							stroke-linejoin="round"
							stroke-linecap="round"
							stroke-dasharray={dash}
						/>
					{/if}
					{#each geo.bubbles as b (b.r)}
						<ellipse
							cx={b.cx}
							cy={b.cy}
							rx={b.r * 1.15}
							ry={b.r}
							fill={PAPER}
							stroke={INK}
							stroke-width="2"
						/>
					{/each}
				</g>
			</svg>
		{/if}

		<h1 class="font-display relative leading-[0.95] font-bold whitespace-nowrap">
			{title}
		</h1>
	</div>

	{#if sub}
		<p class="type-meta ml-[0.5em] {subGap}">{sub}</p>
	{/if}
</div>
