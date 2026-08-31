<script lang="ts">
	import type { WorkItem } from '$lib/content';
	import WorkTile from '$lib/components/WorkTile.svelte';
	import { masonry } from '$lib/gallery/masonry';

	interface Props {
		items: WorkItem[];
		/** Insert a year spine wherever the year changes. */
		withYears?: boolean;
		class?: string;
	}

	let { items, withYears = true, class: className = '' }: Props = $props();

	type Cell = { kind: 'year'; year: number } | { kind: 'work'; item: WorkItem };

	const cells = $derived.by<Cell[]>(() => {
		if (!withYears) return items.map((item) => ({ kind: 'work', item }));
		const out: Cell[] = [];
		let year: number | undefined;
		for (const item of items) {
			if (item.year !== year) {
				year = item.year;
				out.push({ kind: 'year', year });
			}
			out.push({ kind: 'work', item });
		}
		return out;
	});
</script>

<div class="wall {className}" use:masonry>
	{#each cells as cell, i (cell.kind === 'year' ? `y${cell.year}` : cell.item.slug)}
		{#if cell.kind === 'year'}
			<!-- The year, printed like a spine on the shelf. -->
			<div
				class="flex items-center justify-center bg-primary"
				style="--ratio:0.42"
				data-ratio="0.42"
			>
				<span
					class="font-display text-[44px] font-bold text-primary-foreground [writing-mode:vertical-rl] md:text-[56px]"
				>
					{cell.year}
				</span>
			</div>
		{:else}
			<WorkTile item={cell.item} loading={i < 6 ? 'eager' : 'lazy'} />
		{/if}
	{/each}
</div>
