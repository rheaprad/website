<script lang="ts">
	import BlogIndex from '$lib/components/BlogIndex.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<Seo title="Essays" description="Long-form writing by Rhea Pradeep." />

<BlogIndex
	title="Essays"
	items={data.items}
	counts={data.counts}
	active="essay"
/>
