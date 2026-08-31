<script lang="ts">
	import type { WorkItem } from '$lib/content';
	import TagChip from '$lib/components/TagChip.svelte';

	interface Props {
		item: WorkItem;
	}

	let { item }: Props = $props();

	const rows = $derived(
		[
			{ label: 'Year', value: String(item.year) },
			{ label: 'Medium', value: item.medium ?? '' },
			{ label: 'Dimensions', value: item.dimensions ?? '' },
			{ label: 'Pages', value: item.pages ?? '' }
		].filter((r) => r.value)
	);
</script>

<dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
	{#each rows as row (row.label)}
		<dt class="type-meta">{row.label}</dt>
		<dd class="text-[15px]">{row.value}</dd>
	{/each}
	<dt class="type-meta">Tags</dt>
	<dd class="flex flex-wrap gap-1.5">
		{#each item.tags as tag (tag)}
			<TagChip {tag} />
		{/each}
	</dd>
</dl>
