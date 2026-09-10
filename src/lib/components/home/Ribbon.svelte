<script lang="ts">
	/**
	 * A ribbon of scraps taped along the wall under the masthead: the landing
	 * pictures she authored in the CMS, drifting past at reading pace. It runs
	 * full-bleed and is decorative, since the work itself is catalogued below,
	 * so it's hidden from assistive tech and stops moving on hover, on focus,
	 * and whenever the reader has asked for less motion.
	 *
	 * The track holds the scraps twice; the animation travels exactly half its
	 * width, so the second copy lands where the first began and the loop has no
	 * seam. Heights are fixed and widths are left to the pictures, so nothing is
	 * cropped, the same bargain the wall and the shelf make.
	 */
	import type { StripImage } from '$lib/content';
	import Image from '$lib/components/ui/Image.svelte';

	interface Props {
		images: StripImage[];
		/** Seconds for one full pass. Longer reads as calmer. */
		duration?: number;
	}

	let { images, duration = 90 }: Props = $props();

	// A repeating, non-uniform lean: enough to look pinned by hand, never enough
	// to look broken. Five leans against a row of eight, so the pattern never
	// settles into a visible rhythm.
	const TILTS = [-1.6, 1.1, -0.7, 1.8, -1.2];

	// The second copy exists only to hide the seam in the loop. With the
	// animation off it would just be the same scraps twice, so drop it.
	let still = $state(false);
	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		still = mq.matches;
		const onChange = (e: MediaQueryListEvent) => (still = e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	const scraps = $derived(still ? images : [...images, ...images]);
</script>

{#if images.length}
	<div class="ribbon" style="--ribbon-duration:{duration}s" aria-hidden="true">
		<div class="ribbon-track">
			{#each scraps as scrap, i (i)}
				<figure class="ribbon-scrap" style="--tilt:{TILTS[i % TILTS.length]}deg">
					<span class="ribbon-tape"></span>
					<!-- Decoration, and it sits beside the masthead portrait that is the
					     page's LCP. Nothing here is ever eager or high priority: the
					     first four scraps used to be, which put ~4MB of aria-hidden
					     images ahead of the content on the critical path.

					     The width/height the picture carries is also what stops the
					     track reflowing: `.ribbon-scrap img` is `height: var(--ribbon-h);
					     width: auto`, so without an intrinsic ratio each scrap is 0px
					     wide until its bytes land, and the drift animation translates
					     by -50% of a width that keeps changing underneath it. -->
					<Image
						src={scrap.picture ?? scrap.src}
						alt=""
						sizes="(min-width: 768px) 260px, 180px"
						loading="lazy"
						fetchpriority="low"
					/>
				</figure>
			{/each}
		</div>
	</div>
{/if}
