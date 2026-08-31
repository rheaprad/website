<script lang="ts">
	import { base } from '$app/paths';
	import type { WorkItem } from '$lib/content';

	interface Props {
		item: WorkItem;
		loading?: 'lazy' | 'eager';
	}

	let { item, loading = 'lazy' }: Props = $props();
</script>

<!--
	A wall cell sized to the work's true aspect ratio (`--ratio`), so the image
	is shown whole — no comic panel or spread gets guillotined by a fixed crop.
	The `masonry` action reads `data-ratio`/`data-feature` to pack the grid.
-->
<a
	href="{base}/work/{item.slug}/"
	class="group block overflow-hidden bg-muted"
	style="--ratio:{item.ratio}"
	data-ratio={item.ratio}
	data-feature={item.feature}
>
	<img
		src={item.cover}
		alt={item.title}
		{loading}
		class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
	/>
	<span
		class="pointer-events-none absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3
		       bg-gradient-to-t from-black/70 to-transparent px-3 pt-10 pb-2.5 opacity-0
		       transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
	>
		<span class="font-display text-[15px] font-semibold text-white">{item.title}</span>
		<span class="text-[12px] text-white/80 tabular-nums">{item.year}</span>
	</span>
</a>
