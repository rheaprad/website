<script lang="ts">
	interface Props {
		/** Enhanced-image object (from a `?enhanced` import) or a plain URL string. */
		src: any;
		alt?: string;
		class?: string;
		loading?: 'lazy' | 'eager';
		/** Rendered width hint, so an enhanced source picks a candidate that
		 *  matches the slot instead of assuming the full viewport. */
		sizes?: string;
	}

	let { src, alt = '', class: className = '', loading = 'lazy', sizes }: Props = $props();
</script>

{#if typeof src === 'string'}
	<img {src} {alt} {loading} {sizes} class={className} />
{:else if src}
	<enhanced:img {src} {alt} {loading} {sizes} class={className} />
{/if}
