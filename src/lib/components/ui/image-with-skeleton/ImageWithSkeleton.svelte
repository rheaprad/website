<script lang="ts">
	import type { Picture } from '@sveltejs/enhanced-img';
	import Image from '$lib/components/ui/Image.svelte';

	let {
		src,
		alt = '',
		class: className = '',
		aspectRatio = '3/4',
		fill = false,
		sizes,
		loading = 'lazy',
		fetchpriority
	}: {
		src: Picture | string | undefined;
		alt?: string;
		class?: string;
		aspectRatio?: string;
		/** When true, wrapper stretches to fill parent (no intrinsic aspect ratio) */
		fill?: boolean;
		sizes?: string;
		loading?: 'lazy' | 'eager';
		fetchpriority?: 'high' | 'low' | 'auto';
	} = $props();
</script>

<!--
	The box is reserved by `aspect-ratio` and tinted by `bg-muted`, both present
	in the prerendered HTML, so there is nothing left for a skeleton to cover.

	The previous version faded the image in on an `onload` handler. On a
	prerendered page the image often finishes loading *before* hydration attaches
	that handler — the event has already fired, `loaded` never flips, and the
	image sits at `opacity-0` permanently. It was eager, too, so it downloaded
	full-size covers in order to keep them invisible.
-->
<div
	class="relative overflow-hidden bg-muted {fill ? 'h-full w-full' : ''}"
	style={fill ? undefined : `aspect-ratio: ${aspectRatio}`}
>
	<Image
		{src}
		{alt}
		{sizes}
		{loading}
		{fetchpriority}
		class="h-full w-full object-cover {className}"
	/>
</div>
