<script lang="ts">
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import TagChip from '$lib/components/TagChip.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { tagLabel } from '$lib/format';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const label = $derived(tagLabel(data.tag));
	const items = $derived(data.groups.flatMap((g) => g.items));
	const otherTags = $derived(data.allTags.filter((t) => t !== data.tag));
</script>

<Seo title={label} description="Work tagged {label} by Rhea Pradeep." />

<div class="px-1 pt-10 pb-16 md:px-2 md:pt-14">
	<div class="mb-10 px-5 md:px-8">
		<!-- no variant: seeded from the tag label, so each tag page gets its own stable balloon -->
		<PageHeader title={label} />
		<div class="mt-6 flex flex-wrap gap-2.5">
			{#each otherTags as tag (tag)}
				<TagChip {tag} />
			{/each}
		</div>
	</div>

	<GalleryGrid {items} withYears={false} class="grid-cols-2 md:grid-cols-3 xl:grid-cols-4" />
</div>
