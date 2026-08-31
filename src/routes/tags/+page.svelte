<script lang="ts">
	import { base } from '$app/paths';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { tagLabel } from '$lib/format';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<Seo title="Tags" description="Rhea Pradeep's work, indexed by tag." />

<div class="mx-auto max-w-[720px] px-6 py-10 md:px-10 md:py-14">
	<PageHeader title="Tags" variant="burst" />

	<ul class="mt-10 space-y-3">
		{#each data.tags as { tag, count, yearRange } (tag)}
			<li class="flex items-baseline gap-2">
				<a
					href="{base}/tags/{tag}/"
					class="font-display text-[18px] font-semibold transition-colors hover:text-primary"
				>
					{tagLabel(tag)}
				</a>
				<span class="leader"></span>
				<span class="type-meta">{count} · {yearRange}</span>
			</li>
		{/each}
	</ul>
</div>
