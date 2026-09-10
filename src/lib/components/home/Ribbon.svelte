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
	interface Props {
		images: string[];
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
			{#each scraps as src, i (i)}
				<figure class="ribbon-scrap" style="--tilt:{TILTS[i % TILTS.length]}deg">
					<span class="ribbon-tape"></span>
					<img {src} alt="" loading={i < 4 ? 'eager' : 'lazy'} decoding="async" />
				</figure>
			{/each}
		</div>
	</div>
{/if}
