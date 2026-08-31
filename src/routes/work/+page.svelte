<script lang="ts">
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import TagChip from '$lib/components/TagChip.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<Seo
	title="Work"
	description="The complete catalog of Rhea Pradeep's books, comics and illustrations."
/>

<div class="px-1 pt-10 pb-16 md:px-2 md:pt-14">
	<div class="mb-10 px-5 md:px-8">
		<PageHeader title="Work" variant="speech" />
		<div class="mt-6 flex flex-wrap gap-2.5">
			{#each data.tags as tag (tag)}
				<TagChip {tag} />
			{/each}
		</div>
	</div>

	<GalleryGrid items={data.items} withYears />
</div>
