<script lang="ts">
	import { base } from '$app/paths';
	import Image from '$lib/components/ui/Image.svelte';
	import type { WorkItem } from '$lib/content';

	/**
	 * A book staged for the shelf.
	 *
	 * The cover is presented as a physical object resting on a lit backdrop:
	 * never cropped, lipped so a pale edge still separates, and lit from the
	 * upper left by the same source that throws its shadow down and to the
	 * right. The backdrop takes the book's own dominant colour, pulled into a
	 * narrow lightness band so ten unrelated books still read as one set.
	 *
	 * No type is set on the card face — this is a mockup of an object, not a
	 * redesign of the artwork.
	 */
	interface Props {
		item: WorkItem;
		/** Card aspect ratio (w/h). Square keeps portrait and landscape books
		 *  equally at home; the set here runs 0.75 to 1.69. */
		frame?: number;
		loading?: 'lazy' | 'eager';
	}

	let { item, frame = 1, loading = 'lazy' }: Props = $props();

	const meta = $derived([item.medium, item.year].filter(Boolean).join(' · '));

	const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

	/**
	 * How much of the card the book may occupy, as a percentage of the frame.
	 * The margin is the whole point: a book photographed for a catalogue sits
	 * in air, and cropping to the edge turns an object back into a texture.
	 */
	const SAFE = { w: 76, h: 72 };

	/**
	 * Fit the cover's true proportions into the safe area, never cropping.
	 * Everything resolves in `cqw` — one unit is 1% of the card's width — so
	 * the staging scales with the grid and the maths stays in one currency
	 * even when the frame isn't square.
	 */
	const geo = $derived.by(() => {
		const ratio = item.ratio > 0 ? item.ratio : 0.8;
		const availW = SAFE.w;
		const availH = SAFE.h / frame;
		const widthLimited = ratio >= availW / availH;
		return {
			w: +(widthLimited ? availW : availH * ratio).toFixed(2),
			h: +(widthLimited ? availW / ratio : availH).toFixed(2)
		};
	});

	/**
	 * The backdrop tone. Hue and colourfulness are read from the cover at build
	 * time; the lightness band lives here, and is nudged away from the cover's
	 * own lightness so a pale book doesn't dissolve into its backdrop and a
	 * dark one doesn't vanish. The narrow band is what makes the set cohere.
	 */
	const tone = $derived.by(() => {
		const p = item.plate;
		return {
			h: p.hue,
			c: +(0.075 * clamp(p.chroma, 0, 1)).toFixed(4),
			l: +(0.78 - 0.2 * p.light).toFixed(3),
			dark: +(0.3 + 0.1 * (1 - p.light)).toFixed(3)
		};
	});

	const vars = $derived(
		[
			`--plate-h:${tone.h}`,
			`--plate-c:${tone.c}`,
			`--plate-l:${tone.l}`,
			`--plate-l-dark:${tone.dark}`,
			`--frame:${frame}`,
			`--bw:${geo.w}cqw`,
			`--bh:${geo.h}cqw`
		].join(';')
	);

	// Two up on phones, three on tablets, four on desktop inside a 1440 shell.
	const sizes = '(min-width: 1024px) 23vw, (min-width: 640px) 30vw, 45vw';
</script>

<a href="{base}/work/{item.slug}/" class="card group block focus-visible:outline-none">
	<div class="frame" style={vars}>
		<div class="stage">
			<span class="grain" aria-hidden="true"></span>
			<div class="object">
				<Image
					src={item.coverEnhanced ?? item.cover}
					alt="Cover of {item.title}"
					{loading}
					{sizes}
					class="h-full w-full object-cover"
				/>
			</div>
		</div>
	</div>

	<div class="px-0.5 pt-2.5">
		<h2 class="font-display truncate text-[15px] leading-snug font-semibold md:text-base">
			{item.title}
		</h2>
		{#if meta}
			<p class="type-meta mt-0.5 truncate">{meta}</p>
		{/if}
	</div>
</a>

<style>
	.frame {
		/* Every length inside resolves against the card, so one component works
		   from a 150px phone cell to a 340px desktop cell. */
		container-type: size;
		position: relative;
		aspect-ratio: var(--frame);
		overflow: hidden;

		/* Derived tones, kept as fragments rather than finished colours so alpha
		   can be applied at each use site. */
		--tone: var(--plate-l) var(--plate-c) var(--plate-h);
		--tone-hi: calc(var(--plate-l) + 0.018) calc(var(--plate-c) * 0.94) var(--plate-h);
		--tone-lo: calc(var(--plate-l) - 0.03) calc(var(--plate-c) * 1.06) var(--plate-h);
		/* Shadows take the backdrop's hue rather than black: a shadow is the
		   surface with the light taken away, and neutral grey gives away the
		   fake. They also stay slightly more saturated than the surface, which
		   is what a shaded pigment actually does. */
		--shade: calc(var(--plate-l) - 0.46) calc(var(--plate-c) * 1.5) var(--plate-h);

		/* Near enough to flat. An earlier version lit the plate with a broad
		   white key and a dark ambient pool, and the two between them bleached
		   the colour out of it and left the artwork floating in haze. What is
		   left is the faintest falloff toward the foot, which is all a painted
		   seamless actually shows. */
		background: linear-gradient(178deg, oklch(var(--tone-hi)) 0%, oklch(var(--tone-lo)) 100%);
		box-shadow: inset 0 0 0 1px oklch(var(--shade) / 0.12);
		transition: box-shadow 150ms ease-out;
	}

	:global(.dark) .frame {
		--plate-l: var(--plate-l-dark);
	}

	/* The site's tactile idiom — an inked offset — so the shelf still belongs
	   to the same catalogue as the rest of the wall. */
	.card:hover .frame,
	.card:focus-visible .frame {
		box-shadow:
			inset 0 0 0 1px oklch(var(--shade) / 0.16),
			4px 4px 0 0 var(--color-foreground);
	}
	.card:focus-visible .frame {
		outline: 2px solid var(--color-ring);
		outline-offset: 2px;
	}

	.stage {
		position: absolute;
		inset: 0;
	}

	/*
	 * The object sits a little above centre, so the shadow has somewhere to
	 * fall — which is what reads as weight.
	 */
	.object {
		position: absolute;
		left: 50%;
		top: 50%;
		width: var(--bw);
		height: var(--bh);
		transform: translate(-50%, -53%);
		background: oklch(var(--tone-lo));

		/*
		 * Elevation unit. Every offset and blur below is a multiple of it, so
		 * the shadow scales with the card instead of looking heavy on a phone
		 * cell and weightless on a wide one.
		 *
		 * It lives here rather than on .frame because a custom property is
		 * substituted on the element that DECLARES it: a recipe written on
		 * .frame could never see a --u defined on its child, and .frame cannot
		 * read its own container units either.
		 */
		--u: 0.62cqw;

		box-shadow: var(--rest-shadow);
		transition:
			transform 450ms cubic-bezier(0.22, 0.7, 0.2, 1),
			box-shadow 450ms cubic-bezier(0.22, 0.7, 0.2, 1);
	}

	/*
	 * A real shadow is a stack, not a blur. Each layer doubles the offset and
	 * blur of the one before while its alpha falls away, which is roughly what
	 * a penumbra does as it widens: dark and tight where the print touches the
	 * surface, faint and broad by the time it has travelled.
	 *
	 * The light sits above and slightly to the left — the same place the
	 * backdrop highlight and the sheen come from — so every layer is offset
	 * twice as far down as it is across. The last entry is ambient: no offset
	 * at all, just the general occlusion of a flat thing lying on a surface.
	 *
	 * After Josh Comeau, Designing Beautiful Shadows in CSS, and Tobias Ahlin,
	 * Smoother & sharper shadows with layered box-shadows.
	 */
	.object {
		--rest-shadow:
			0 0 0 1px oklch(var(--shade) / 0.3),
			calc(var(--u) * 0.5) var(--u) var(--u) oklch(var(--shade) / 0.34),
			var(--u) calc(var(--u) * 2) calc(var(--u) * 2) oklch(var(--shade) / 0.26),
			calc(var(--u) * 2) calc(var(--u) * 4) calc(var(--u) * 4) oklch(var(--shade) / 0.2),
			calc(var(--u) * 4) calc(var(--u) * 8) calc(var(--u) * 8) oklch(var(--shade) / 0.14),
			calc(var(--u) * 8) calc(var(--u) * 16) calc(var(--u) * 16) oklch(var(--shade) / 0.07),
			0 0 calc(var(--u) * 14) oklch(var(--shade) / 0.09);

		/* Lifted: the whole stack travels and softens, and the contact layer
		   loses its bite — an object leaving a surface stops touching it. */
		--lift-shadow:
			0 0 0 1px oklch(var(--shade) / 0.3),
			calc(var(--u) * 0.75) calc(var(--u) * 1.5) calc(var(--u) * 2.5) oklch(var(--shade) / 0.24),
			calc(var(--u) * 1.5) calc(var(--u) * 3) calc(var(--u) * 5) oklch(var(--shade) / 0.21),
			calc(var(--u) * 3) calc(var(--u) * 6) calc(var(--u) * 10) oklch(var(--shade) / 0.17),
			calc(var(--u) * 6) calc(var(--u) * 12) calc(var(--u) * 20) oklch(var(--shade) / 0.12),
			calc(var(--u) * 12) calc(var(--u) * 24) calc(var(--u) * 36) oklch(var(--shade) / 0.06),
			0 0 calc(var(--u) * 22) oklch(var(--shade) / 0.1);
	}

	.card:hover .object,
	.card:focus-visible .object {
		transform: translate(-50%, -55.5%);
		box-shadow: var(--lift-shadow);
	}

	/* The same paper grain the page carries, so the card doesn't read as a
	   cleaner, flatter material than everything around it. */
	.grain {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.4;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
	}

	@media (prefers-reduced-motion: reduce) {
		.frame,
		.object {
			transition: none;
		}
		.card:hover .object,
		.card:focus-visible .object {
			transform: translate(-50%, -53%);
		}
	}
</style>
