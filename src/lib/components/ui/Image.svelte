<script lang="ts">
	interface Props {
		/** Enhanced-image object (from a `?enhanced` import) or a plain URL string. */
		src: any;
		alt?: string;
		class?: string;
		loading?: 'lazy' | 'eager';
	}

	let { src, alt = '', class: className = '', loading = 'lazy' }: Props = $props();
</script>

{#if typeof src === 'string'}
	<img {src} {alt} {loading} class={className} />
{:else if src}
	<enhanced:img {src} {alt} {loading} class={className} />
{/if}
