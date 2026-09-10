<script lang="ts">
	import { base } from '$app/paths';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';

	/**
	 * A way in. Each door into the rest of the site is fronted by a real piece
	 * of work rather than an icon, so the picture does the labelling and the
	 * word underneath only confirms it. Shares the pressed-card feel of
	 * BookCard so the two never read as different systems.
	 */
	interface Props {
		href: string;
		label: string;
		note: string;
		thumb: string;
		loading?: 'lazy' | 'eager';
	}

	let { href, label, note, thumb, loading = 'lazy' }: Props = $props();
</script>

<a
	href={base + href}
	class="group block overflow-hidden border border-border bg-background
	       transition-[transform,box-shadow,border-color] duration-150 ease-out
	       hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-foreground
	       hover:shadow-[4px_4px_0_0_var(--color-foreground)]
	       focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 focus-visible:border-foreground
	       focus-visible:shadow-[4px_4px_0_0_var(--color-foreground)] focus-visible:outline-none
	       active:translate-x-0 active:translate-y-0 active:shadow-none
	       motion-reduce:transform-none motion-reduce:transition-none"
>
	<AspectRatio ratio={1} class="overflow-hidden border-b border-border bg-muted">
		<img
			src={thumb}
			alt=""
			{loading}
			class="h-full w-full object-cover transition-transform duration-500 ease-out
			       group-hover:scale-[1.04] motion-reduce:transform-none"
		/>
	</AspectRatio>
	<div class="px-3 py-2.5">
		<h3 class="truncate font-display text-[15px] leading-snug font-semibold lowercase md:text-base">
			{label}
		</h3>
		<p class="truncate type-meta">{note}</p>
	</div>
</a>
