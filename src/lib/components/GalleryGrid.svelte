<script lang="ts">
	import { getYearGroups, type WorkItem } from '$lib/content';
	import WorkTile from '$lib/components/WorkTile.svelte';
	import { shelf } from '$lib/gallery/shelf';

	interface Props {
		items: WorkItem[];
		/** Break the shelf into one section per year, each under its own heading. */
		withYears?: boolean;
		class?: string;
	}

	let { items, withYears = true, class: className = '' }: Props = $props();

	// One shelf per year, so a year heading always owns exactly the works
	// beneath it — no piece can be ambiguous about which year it belongs to.
	const groups = $derived(withYears ? getYearGroups(items) : [{ year: 0, items }]);

	// Above-the-fold covers stay eager whichever section they land in. Three,
	// not six: past the first row these are competing with the LCP, not helping.
	const eager = $derived(new Set(items.slice(0, 3).map((i) => i.slug)));
	const lcp = $derived(items[0]?.slug);
</script>

{#each groups as group (group.year)}
	<section class="year-group {className}">
		{#if withYears}
			<h2 class="type-year">{group.year}</h2>
		{/if}
		<div class="shelf" use:shelf={group.items}>
			{#each group.items as item (item.slug)}
				<WorkTile
					{item}
					loading={eager.has(item.slug) ? 'eager' : 'lazy'}
					priority={item.slug === lcp}
				/>
			{/each}
		</div>
	</section>
{/each}
