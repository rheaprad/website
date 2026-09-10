<script lang="ts">
	import BlogIndex from '$lib/components/BlogIndex.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';
	import { pages } from '$lib/page-copy';

	const copy = pages.notes;

	const { data }: { data: PageData } = $props();
</script>

<Seo title={copy.title} description={copy.description} />

<BlogIndex
	title={copy.title}
	sub={copy.sub}
	items={data.items}
	counts={data.counts}
	active="note"
/>
