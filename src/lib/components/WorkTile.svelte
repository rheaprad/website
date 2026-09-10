<script lang="ts">
	import { base } from '$app/paths';
	import type { WorkItem } from '$lib/content';
	import { tagLabel } from '$lib/format';

	interface Props {
		item: WorkItem;
		loading?: 'lazy' | 'eager';
	}

	let { item, loading = 'lazy' }: Props = $props();

	// tags[0] is always the implicit type tag, so tags[1] is the more telling
	// one when the piece was actually tagged.
	const meta = $derived([tagLabel(item.tags[1] ?? item.tags[0]), item.year].join(' · '));
</script>

<!--
	A wall cell: the image box is sized to the work's true aspect ratio, so no
	comic panel or spread gets guillotined by a fixed crop, and a caption sits
	under it. The `masonry` action reads `data-ratio`/`data-feature` to pack the
	grid, and measures `[data-caption]` so the row span leaves room for the text.
-->
<a
	href="{base}/work/{item.slug}/"
	class="group block focus-visible:outline-none"
	data-ratio={item.ratio}
	data-feature={item.feature}
>
	<div
		data-media
		class="relative w-full overflow-hidden bg-muted transition-shadow duration-150 ease-out
		       group-hover:shadow-[4px_4px_0_0_var(--color-foreground)]
		       group-focus-visible:shadow-[4px_4px_0_0_var(--color-foreground)]
		       motion-reduce:transition-none"
		style="aspect-ratio:{item.ratio}"
	>
		<img
			src={item.cover}
			alt="Cover of {item.title}"
			{loading}
			class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out
			       group-hover:scale-[1.03] motion-reduce:transform-none"
		/>
	</div>
	<div data-caption class="px-0.5 pt-2">
		<h3 class="truncate font-display text-[14px] leading-snug font-semibold md:text-[15px]">
			{item.title}
		</h3>
		<p class="truncate type-meta">{meta}</p>
	</div>
</a>
