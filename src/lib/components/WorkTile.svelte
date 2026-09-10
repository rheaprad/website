<script lang="ts">
	import { base } from '$app/paths';
	import type { WorkItem } from '$lib/content';
	import Image from '$lib/components/ui/Image.svelte';
	import { tagLabel } from '$lib/format';

	interface Props {
		item: WorkItem;
		loading?: 'lazy' | 'eager';
		/** The one tile per page that is the LCP. */
		priority?: boolean;
	}

	let { item, loading = 'lazy', priority = false }: Props = $props();

	/**
	 * A shelf cell is a whole row on a phone and up to ~1000px for a panorama on
	 * a wide screen — `--row-max` runs 1/2/3/4 and `--row-h` 420/260/300/380,
	 * inside a container capped at 1376.
	 */
	const SIZES =
		'(min-width: 1280px) 1100px, (min-width: 768px) 62vw, (min-width: 640px) 72vw, calc(100vw - 40px)';

	// tags[0] is always the implicit type tag, so tags[1] is the more telling
	// one when the piece was actually tagged.
	const meta = $derived([tagLabel(item.tags[1] ?? item.tags[0]), item.year].join(' · '));
</script>

<!--
	A shelf cell: the image box is sized to the work's true aspect ratio, so no
	comic panel or spread gets guillotined by a fixed crop, and a caption sits
	under it. The `shelf` action reads `data-ratio`/`data-feature` to justify the
	row, so both attributes must stay on the cell root.
-->
<a
	href="{base}/work/{item.slug}/"
	class="group block focus-visible:outline-none"
	data-ratio={item.ratio}
	data-feature={item.feature}
	style="--ratio:{item.ratio}"
>
	<div
		data-media
		class="relative w-full overflow-hidden bg-muted transition-shadow duration-150 ease-out
		       group-hover:shadow-[4px_4px_0_0_var(--color-foreground)]
		       group-focus-visible:shadow-[4px_4px_0_0_var(--color-foreground)]
		       motion-reduce:transition-none"
		style="aspect-ratio:{item.ratio}"
	>
		<Image
			src={item.coverPicture ?? item.cover}
			alt="Cover of {item.title}"
			sizes={SIZES}
			loading={priority ? 'eager' : loading}
			fetchpriority={priority ? 'high' : undefined}
			class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out
			       group-hover:scale-[1.03] motion-reduce:transform-none"
		/>
	</div>
	<div data-caption class="px-0.5 pt-2">
		<!-- Wraps rather than truncates: a phone cell is narrower than the title
		     of half the work on this wall, and a clipped title is worse than a
		     title on two lines. Only from the tablet shelf up, where a cell is
		     wide enough to hold one, is a single line enforced. -->
		<h3 class="font-display text-lg leading-snug font-semibold text-pretty sm:truncate md:text-xl">
			{item.title}
		</h3>
		<p class="type-meta first-letter:uppercase sm:truncate">{meta}</p>
	</div>
</a>
