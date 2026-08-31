<script lang="ts">
	import BlogIndex from '$lib/components/BlogIndex.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<Seo title="Process logs" description="Work-in-progress diaries for Rhea Pradeep's projects." />

<BlogIndex
	title="Process logs"
	sub="Work-in-progress entries, each tied to a project"
	items={data.items}
	active="log"
/>
