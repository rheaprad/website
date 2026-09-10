<script lang="ts">
	import { base } from '$app/paths';
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import PageMasthead from '$lib/components/PageMasthead.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { tagLabel } from '$lib/format';
	import type { PageData } from './$types';
	import { pages } from '$lib/page-copy';

	const { data }: { data: PageData } = $props();

	const copy = pages.work;

	const filters = $derived([
		{ href: `${base}/work/`, label: 'everything', count: data.items.length, active: true },
		...data.tags.map(({ tag, count }) => ({
			href: `${base}/tags/${tag}/`,
			label: tagLabel(tag),
			count
		}))
	]);
</script>

<Seo title={copy.title} description={copy.description} />

<div class="mx-auto w-full max-w-[1440px] px-5 pt-10 pb-20 md:px-8 md:pt-14">
	<div class="mb-12 md:mb-16">
		<PageMasthead title={copy.title} sub={copy.sub} variant="speech" {filters} />
	</div>

	<GalleryGrid items={data.items} withYears />
</div>
