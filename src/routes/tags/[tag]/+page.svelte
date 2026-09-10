<script lang="ts">
	import { base } from '$app/paths';
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import PageMasthead from '$lib/components/PageMasthead.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { tagLabel } from '$lib/format';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const label = $derived(tagLabel(data.tag));
	const items = $derived(data.items);

	// The same index line as /work, with this tag lit instead of "everything".
	const filters = $derived([
		{ href: `${base}/work/`, label: 'everything' },
		...data.tags.map(({ tag, count }) => ({
			href: `${base}/tags/${tag}/`,
			label: tagLabel(tag),
			count,
			active: tag === data.tag
		}))
	]);
</script>

<Seo title={label} description="Work tagged {label} by Rhea Pradeep." />

<div class="mx-auto w-full max-w-[1440px] px-5 pt-10 pb-20 md:px-8 md:pt-14">
	<div class="mb-12 md:mb-16">
		<!-- no variant: seeded from the tag label, so each tag page gets its own stable balloon -->
		<PageMasthead title={label} {filters} />
	</div>

	<GalleryGrid {items} withYears />
</div>
