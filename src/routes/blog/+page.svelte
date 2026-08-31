<script lang="ts">
	import BlogIndex from '$lib/components/BlogIndex.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<Seo title="Blog" description="Notes, process logs and essays by Rhea Pradeep." />

<BlogIndex
	title="Blog"
	sub="Sketchbook notes, process logs and the occasional essay"
	items={data.items}
	active="all"
/>
