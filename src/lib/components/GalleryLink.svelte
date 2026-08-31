<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		image: any;
		alt?: string;
		class?: string;
		imageClass?: string;
		children?: Snippet;
	}

	let {
		image,
		alt = '',
		class: className = '',
		imageClass = 'w-full h-full object-cover',
		children
	}: Props = $props();

	function getGalleryData(imgObj: any) {
		if (!imgObj) return { src: '', w: 1920, h: 1080, srcset: '' };
		if (typeof imgObj === 'string') return { src: imgObj, w: 1920, h: 1080, srcset: imgObj };

		const src = imgObj.img?.src || '';
		const w = imgObj.img?.w || 1920;
		const h = imgObj.img?.h || 1080;

		let srcset = src;
		if (imgObj.sources) {
			const format = imgObj.sources.webp ? 'webp' : Object.keys(imgObj.sources)[0];
			if (format && imgObj.sources[format]) {
				srcset = imgObj.sources[format].map((s: any) => `${s.src} ${s.w}w`).join(', ');
			}
		}

		return { src, w, h, srcset };
	}

	let data = $derived(getGalleryData(image));
</script>

<a
	href={data.src}
	data-img={data.srcset}
	data-width={data.w}
	data-height={data.h}
	data-alt={alt}
	class="gallery-link {className}"
>
	{#if children}
		{@render children()}
	{:else}
		<Image src={image} {alt} class={imageClass} />
	{/if}
</a>
