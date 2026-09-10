<script lang="ts">
	/**
	 * The masthead for an index page (work, books, blog, a tag): the balloon
	 * title, and beneath it the ways to narrow the shelf, set as a contents line
	 * under a hand-ruled rule rather than a row of identical buttons. The active
	 * entry wears the same tactile pill as the active nav item; the rest are text
	 * with a small count, like the index at the back of a book.
	 */
	import type { Snippet } from 'svelte';
	import PageHeader, { type BalloonVariant } from '$lib/components/PageHeader.svelte';

	export interface MastheadFilter {
		href: string;
		label: string;
		count?: number;
		active?: boolean;
	}

	interface Props {
		title: string;
		sub?: string;
		variant?: BalloonVariant;
		seed?: number;
		filters?: MastheadFilter[];
		filtersLabel?: string;
		children?: Snippet;
	}

	let {
		title,
		sub = '',
		variant,
		seed,
		filters = [],
		filtersLabel = 'Narrow by',
		children
	}: Props = $props();
</script>

<header>
	<PageHeader {title} {sub} {variant} {seed} />

	{@render children?.()}

	{#if filters.length}
		<nav class="mt-7 md:mt-9" aria-label={filtersLabel}>
			<!-- The rule, ruled by hand: a long shallow wave, stroke kept at 1.5px whatever the width. -->
			<svg
				aria-hidden="true"
				class="block h-[6px] w-full text-foreground"
				viewBox="0 0 1000 6"
				preserveAspectRatio="none"
				fill="none"
			>
				<path
					d="M0 3.4 Q 60 1.2 125 3 T 250 3.6 T 375 2.4 T 500 3.2 T 625 2.6 T 750 3.8 T 875 2.8 T 1000 3.2"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					vector-effect="non-scaling-stroke"
				/>
			</svg>

			<ul class="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2.5 md:gap-x-5">
				{#each filters as f (f.href)}
					<li>
						<a
							href={f.href}
							aria-current={f.active ? 'page' : undefined}
							class="inline-block font-display text-[15px] font-semibold
							       {f.active
								? 'tactile bg-primary px-3.5 py-1 text-primary-foreground'
								: 'px-1 py-1 text-foreground underline-offset-4 hover:underline'}"
						>
							{f.label}{#if f.count !== undefined}<sup
									class="ml-1 type-num text-[11px] {f.active
										? 'opacity-80'
										: 'text-muted-foreground'}">{f.count}</sup
								>{/if}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</header>
