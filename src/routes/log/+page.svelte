<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import RecentlyList from '$lib/components/RecentlyList.svelte';
	import SectionHead from '$lib/components/SectionHead.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<Seo
	title="Site log"
	description="Everything added to or updated on rheapradeep.com, in order."
/>

<div class="mx-auto max-w-[900px] px-6 py-10 md:px-10 md:py-14">
	<PageHeader title="Site log" sub="Everything added or updated, newest first" variant="caption" />

	{#each data.months as month (month.key)}
		<div class="mt-12 mb-6">
			<SectionHead text={month.label.toLowerCase()} />
		</div>
		<RecentlyList entries={month.entries} />
	{/each}
</div>
