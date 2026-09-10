<script lang="ts">
	/**
	 * The pair at the foot of a post or a work. Each side is one link, not a
	 * label with a link inside it — the label, the title and the meta line all
	 * name the same destination, so all three should be part of the target.
	 * Anything less means a reader aiming at a two-line block hits dead paper
	 * on two of its three lines.
	 */
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';

	interface Entry {
		href: string;
		title: string;
		meta?: string;
	}

	interface Props {
		/** The newer / previous item in the sequence. */
		prev?: Entry;
		/** The older / next item in the sequence. */
		next?: Entry;
		prevLabel?: string;
		nextLabel?: string;
	}

	let { prev, next, prevLabel = 'Newer', nextLabel = 'Older' }: Props = $props();
</script>

{#if prev || next}
	<nav class="grid gap-3 sm:grid-cols-2 sm:gap-4">
		{#if prev}
			<a href={prev.href} class="cell group block px-4 py-3.5">
				<span class="flex items-center gap-1.5 type-num text-muted-foreground">
					<HugeiconsIcon icon={ArrowLeft02Icon} size={15} aria-hidden="true" />
					{prevLabel}
				</span>
				<span class="mt-1.5 block type-title-sm transition-colors group-hover:text-primary">
					{prev.title}
				</span>
				{#if prev.meta}
					<span class="mt-0.5 block type-num text-muted-foreground">{prev.meta}</span>
				{/if}
			</a>
		{:else}
			<span class="hidden sm:block"></span>
		{/if}

		{#if next}
			<a href={next.href} class="cell group block px-4 py-3.5 sm:text-right">
				<span class="flex items-center gap-1.5 type-num text-muted-foreground sm:justify-end">
					{nextLabel}
					<HugeiconsIcon icon={ArrowRight02Icon} size={15} aria-hidden="true" />
				</span>
				<span class="mt-1.5 block type-title-sm transition-colors group-hover:text-primary">
					{next.title}
				</span>
				{#if next.meta}
					<span class="mt-0.5 block type-num text-muted-foreground">{next.meta}</span>
				{/if}
			</a>
		{/if}
	</nav>
{/if}

<style>
	/* A card of paper you can put a whole thumb on. The keyline is the only
	   thing that changes on hover — the ink inside is already doing the work. */
	.cell {
		border: 1px solid var(--border);
		background: var(--paper-2);
		transition:
			border-color 140ms ease,
			background-color 140ms ease;
	}
	.cell:hover {
		border-color: color-mix(in oklab, var(--ink) 45%, transparent);
		background: var(--paper);
	}
</style>
