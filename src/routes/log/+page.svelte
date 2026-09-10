<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import RecentlyList from '$lib/components/RecentlyList.svelte';
	import SectionHead from '$lib/components/SectionHead.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';
	import { pages } from '$lib/page-copy';

	const copy = pages.log;

	const { data }: { data: PageData } = $props();
</script>

<Seo title={copy.title} description={copy.description} />

<div class="mx-auto max-w-[900px] px-6 py-10 md:px-10 md:py-14">
	<PageHeader title={copy.title} sub={copy.sub} variant="caption" />

	{#each data.months as month (month.key)}
		<div class="mt-12 mb-6">
			<SectionHead text={month.label.toLowerCase()} />
		</div>
		<RecentlyList entries={month.entries} />
	{/each}
</div>
