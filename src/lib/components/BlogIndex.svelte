<script lang="ts">
	import { base } from '$app/paths';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PostRiver from '$lib/components/PostRiver.svelte';
	import type { Post } from '$lib/content';

	interface Props {
		title: string;
		sub?: string;
		items: { post: Post; projectTitle?: string }[];
		active: 'all' | 'note' | 'log' | 'essay';
	}

	let { title, sub = '', items, active }: Props = $props();

	const filters = [
		{ key: 'all', href: `${base}/blog/`, label: 'All' },
		{ key: 'note', href: `${base}/blog/notes/`, label: 'Notes' },
		{ key: 'log', href: `${base}/blog/logs/`, label: 'Process logs' },
		{ key: 'essay', href: `${base}/blog/essays/`, label: 'Essays' }
	];
</script>

<div class="mx-auto max-w-[720px] px-6 py-10 md:px-10 md:py-14">
	<PageHeader {title} {sub} variant="thought" />

	<nav class="mt-8 flex flex-wrap gap-2.5" aria-label="Post kinds">
		{#each filters as f (f.key)}
			<a
				href={f.href}
				class="tactile px-3.5 py-1 text-[14px]
				       {active === f.key
					? 'bg-primary font-medium text-primary-foreground'
					: 'bg-background text-foreground hover:bg-primary/10'}"
			>
				{f.label}
			</a>
		{/each}
	</nav>

	<span class="p-author h-card hidden">
		<a class="u-url p-name" href="{base}/about/">Rhea Pradeep</a>
	</span>

	<div class="mt-14">
		<PostRiver {items} />
	</div>

	<p class="mt-14">
		<a href="{base}/rss.xml" class="type-meta text-primary underline underline-offset-3">
			follow via RSS
		</a>
	</p>
</div>
