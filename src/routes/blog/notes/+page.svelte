<script lang="ts">
	import BlogIndex from '$lib/components/BlogIndex.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<Seo title="Notes" description="Short sketchbook notes by Rhea Pradeep." />

<BlogIndex
	title="Notes"
	items={data.items}
	counts={data.counts}
	active="note"
/>
