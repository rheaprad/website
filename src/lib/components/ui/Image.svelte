<script lang="ts">
	import type { Picture } from '@sveltejs/enhanced-img';

	interface Props {
		/** A responsive picture from `resolvePicture()`, or a plain URL for the
		 *  few paths that have none (external images, unoptimisable formats). */
		src: Picture | string | undefined;
		alt?: string;
		class?: string;
		/**
		 * How wide this image actually renders. Required on every picture source:
		 * without it the browser assumes 100vw and takes the top of the ladder.
		 *
		 * Never use em/rem here — the preload scanner picks a candidate before it
		 * has computed a font size, so it resolves those units against a different
		 * value than CSS will.
		 */
		sizes?: string;
		loading?: 'lazy' | 'eager';
		decoding?: 'async' | 'sync' | 'auto';
		fetchpriority?: 'high' | 'low' | 'auto';
		/** Only meaningful on the string fallback. A picture carries its own,
		 *  injected by the compiler — passing them here would duplicate them. */
		width?: number;
		height?: number;
		style?: string;
	}

	let {
		src,
		alt = '',
		class: className = '',
		sizes,
		loading = 'lazy',
		decoding = 'async',
		fetchpriority,
		width,
		height,
		style
	}: Props = $props();
</script>

{#if typeof src === 'string'}
	<img
		{src}
		{alt}
		{loading}
		{decoding}
		{fetchpriority}
		{sizes}
		{width}
		{height}
		{style}
		class={className}
	/>
{:else if src}
	<!-- Compiles to <picture><source…><img width height>. That injected
	     width/height pair is what removes the layout shift, so it must not be
	     passed in by hand as well. `picture { display: contents }` in layout.css
	     keeps the wrapper out of layout, so rules that already size an `img`
	     go on working. -->
	<enhanced:img
		{src}
		{alt}
		{loading}
		{decoding}
		{fetchpriority}
		{sizes}
		{style}
		class={className}
	/>
{/if}
