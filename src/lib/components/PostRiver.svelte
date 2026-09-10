<script lang="ts">
	/**
	 * The river, cut into months. A reverse-chronological list with no anchors
	 * in it is a scroll with no landmarks: you can tell that a post is older
	 * than the one above it and nothing else. The month sits in the same left
	 * rail the entries put their dates in, so the column reads top to bottom as
	 * one date ledger, and the rule to its right is the same hand-ruled wave
	 * the masthead draws under its contents line.
	 */
	import PostRiverItem from '$lib/components/PostRiverItem.svelte';
	import type { RiverEntry } from '$lib/blog-index';
	import { formatMonth, monthKey } from '$lib/format';

	interface Props {
		items: RiverEntry[];
	}

	let { items }: Props = $props();

	const months = $derived.by(() => {
		const out: { key: string; label: string; entries: RiverEntry[] }[] = [];
		for (const entry of items) {
			const key = monthKey(entry.post.date);
			const last = out[out.length - 1];
			if (last && last.key === key) last.entries.push(entry);
			else out.push({ key, label: formatMonth(entry.post.date), entries: [entry] });
		}
		return out;
	});
</script>

<div class="h-feed">
	{#each months as month (month.key)}
		<section class="month">
			<h2 class="grid items-center gap-x-8 md:grid-cols-[8rem_1fr]">
				<span class="type-section text-muted-foreground">{month.label}</span>
				<svg
					aria-hidden="true"
					class="mt-2 hidden h-[5px] w-full text-border md:mt-0 md:block"
					viewBox="0 0 1000 5"
					preserveAspectRatio="none"
					fill="none"
				>
					<path
						d="M0 2.8 Q 80 1.4 160 2.6 T 320 3 T 480 2 T 640 2.8 T 800 2.2 T 1000 2.8"
						stroke="currentColor"
						stroke-width="1"
						stroke-linecap="round"
						vector-effect="non-scaling-stroke"
					/>
				</svg>
			</h2>

			<div class="mt-8 space-y-14 md:mt-9">
				{#each month.entries as entry (entry.post.slug)}
					<PostRiverItem
						post={entry.post}
						projectTitle={entry.projectTitle}
						position={entry.position}
					/>
				{/each}
			</div>
		</section>
	{/each}
</div>

<style>
	/* Grouped by air, like the wall's years: the gap above a month is several
	   times the gap below it, so the label belongs to what follows it. */
	.month + .month {
		margin-top: 5rem;
	}
	@media (min-width: 768px) {
		.month + .month {
			margin-top: 6.5rem;
		}
	}
</style>
