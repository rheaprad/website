<script lang="ts">
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import TagChip from '$lib/components/TagChip.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { tagLabel } from '$lib/format';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const label = $derived(tagLabel(data.tag));
	const items = $derived(data.items);
	const otherTags = $derived(data.allTags.filter((t) => t !== data.tag));
</script>

<Seo title={label} description="Work tagged {label} by Rhea Pradeep." />

<div class="mx-auto w-full max-w-[1440px] px-5 pt-10 pb-20 md:px-8 md:pt-14">
	<div class="mb-10 md:mb-14">
		<!-- no variant: seeded from the tag label, so each tag page gets its own stable balloon -->
		<PageHeader title={label} />
		<div class="mt-6 flex flex-wrap gap-2.5">
			{#each otherTags as tag (tag)}
				<TagChip {tag} />
			{/each}
		</div>
	</div>

	<GalleryGrid {items} withYears />
</div>
