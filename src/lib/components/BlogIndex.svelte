<script lang="ts">
	/**
	 * The blog and its three per-kind shelves, all off one component.
	 *
	 * The page is wider than a reading measure on purpose: the river carries a
	 * date rail in the left margin and full-column pictures to the right of it,
	 * which is a catalogue layout, not an article. Posts themselves go back to
	 * 720px, where they belong.
	 *
	 * Only the front page runs a lead. On `/blog/notes/` every entry is a note
	 * and singling out the newest one says nothing a reader can't see from the
	 * order — so those pages are an even shelf, and the air between months does
	 * all the structural work.
	 */
	import { base } from '$app/paths';
	import PageMasthead from '$lib/components/PageMasthead.svelte';
	import PostLead from '$lib/components/PostLead.svelte';
	import PostRiver from '$lib/components/PostRiver.svelte';
	import type { RiverEntry } from '$lib/blog-index';

	type Kind = 'all' | 'note' | 'log' | 'essay';

	interface Props {
		title: string;
		sub?: string;
		items: RiverEntry[];
		counts: Record<Kind, number>;
		active: Kind;
	}

	let { title, sub = '', items, counts, active }: Props = $props();

	const kinds: { key: Kind; href: string; label: string }[] = [
		{ key: 'all', href: `${base}/blog/`, label: 'everything' },
		{ key: 'note', href: `${base}/blog/notes/`, label: 'notes' },
		{ key: 'log', href: `${base}/blog/logs/`, label: 'process logs' },
		{ key: 'essay', href: `${base}/blog/essays/`, label: 'essays' }
	];

	const filters = $derived(
		kinds.map((k) => ({
			href: k.href,
			label: k.label,
			count: counts[k.key],
			active: active === k.key
		}))
	);

	const lead = $derived(active === 'all' && items.length > 1 ? items[0] : undefined);
	const rest = $derived(lead ? items.slice(1) : items);
</script>

<div class="mx-auto max-w-[880px] px-6 py-10 md:px-10 md:py-14">
	<PageMasthead {title} variant="thought" {sub} {filters} filtersLabel="Post kinds">
		<span class="p-author h-card hidden">
			<a class="u-url p-name" href="{base}/about/">Rhea Pradeep</a>
		</span>
	</PageMasthead>

	{#if lead}
		<div class="mt-12 md:mt-14">
			<PostLead post={lead.post} projectTitle={lead.projectTitle} position={lead.position} />
		</div>
	{/if}

	<div class={lead ? 'mt-20 md:mt-24' : 'mt-14'}>
		<PostRiver items={rest} />
	</div>

	{#if items.length === 0}
		<p class="mt-14 type-meta">Nothing here yet.</p>
	{/if}

	<p class="mt-20">
		<a
			href="{base}/rss.xml"
			class="tactile inline-block bg-background px-4 py-1.5 font-display text-[13px]
			       font-semibold tracking-[0.08em] text-foreground hover:bg-primary/10"
		>
			follow via RSS
		</a>
	</p>
</div>
