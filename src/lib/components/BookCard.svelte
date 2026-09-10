<script lang="ts">
	import { base } from '$app/paths';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import type { WorkItem } from '$lib/content';

	interface Props {
		item: WorkItem;
		/** Thumbnail aspect ratio (w/h) — uniform across the whole shelf. */
		ratio?: number;
		loading?: 'lazy' | 'eager';
	}

	let { item, ratio = 0.8, loading = 'lazy' }: Props = $props();

	const meta = $derived([item.medium, item.year].filter(Boolean).join(' · '));
</script>

<a
	href="{base}/work/{item.slug}/"
	class="group border-border bg-background block overflow-hidden border
	       transition-[transform,box-shadow,border-color] duration-150 ease-out
	       hover:border-foreground hover:-translate-x-0.5 hover:-translate-y-0.5
	       hover:shadow-[4px_4px_0_0_var(--color-foreground)]
	       focus-visible:border-foreground focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5
	       focus-visible:shadow-[4px_4px_0_0_var(--color-foreground)] focus-visible:outline-none
	       active:translate-x-0 active:translate-y-0 active:shadow-none
	       motion-reduce:transform-none motion-reduce:transition-none"
>
	<AspectRatio {ratio} class="border-border bg-muted overflow-hidden border-b">
		<img
			src={item.cover}
			alt="Cover of {item.title}"
			{loading}
			class="h-full w-full object-cover transition-transform duration-500 ease-out
			       group-hover:scale-[1.03] motion-reduce:transform-none"
		/>
	</AspectRatio>

	<div class="px-3 py-2.5 md:px-3.5 md:py-3">
		<h2 class="font-display truncate text-[15px] leading-snug font-semibold md:text-base">
			{item.title}
		</h2>
		{#if meta}
			<p class="type-meta mt-0.5 truncate">{meta}</p>
		{/if}
	</div>
</a>
