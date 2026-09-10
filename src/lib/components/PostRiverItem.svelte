<script lang="ts">
	/**
	 * One entry in the blog river, drawn as the kind of thing it actually is.
	 *
	 * The river used to render every post the same way, which meant a note
	 * dumped its entire body onto the index while an essay showed a title and
	 * three words — the shortest posts shouted and the longest ones whispered.
	 * Each kind now gets its own object:
	 *
	 *   note   the picture is the post: a scrap taped to the page, at the full
	 *          width of the column. Words are an excerpt, never the whole body.
	 *   log    an instalment: the project it belongs to and where it falls in
	 *          that diary come first, because a log without them is just a note.
	 *   essay  set as print: kicker, title at title-lg, dek, and an invitation.
	 *          No body text leaking out onto the index.
	 *
	 * Size is the one thing that varies, and a picture is what earns it: an
	 * entry with an image runs the full width of the column and takes as much
	 * height as the picture wants, an entry without one stays a few lines tall.
	 * That, the word in the rail, and the shape of the entry are the whole
	 * distinction — there is no colour coding, because a rail that changes hue
	 * every entry reads as a legend for something.
	 *
	 * A date rail runs down the left on wide screens: the catalogue structure
	 * the wall already uses for years, at the scale of a single entry.
	 */
	import { base } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
	import PostKindMark from '$lib/components/PostKindMark.svelte';
	import type { Post } from '$lib/content';
	import { formatDate } from '$lib/format';
	import { readingTime } from '$lib/post-kind';

	interface Props {
		post: Post;
		/** Resolved title of the work this post belongs to (logs and some notes). */
		projectTitle?: string;
		/** Where a log falls in its project's diary. */
		position?: { index: number; total: number };
	}

	let { post, projectTitle, position }: Props = $props();

	const href = $derived(`${base}/blog/${post.slug}/`);
	const blurb = $derived(post.description || post.excerpt);
	const read = $derived(readingTime(post.words));

	// A hand-set lean, fixed per post so the same scrap hangs at the same angle
	// every visit. Kept under a degree: paper that has been put down carefully
	// is barely off true, and a page of scraps at four degrees reads as a
	// scrapbook effect rather than as paper.
	const tilt = $derived.by(() => {
		let h = 0;
		for (let i = 0; i < post.slug.length; i++) h = (h * 31 + post.slug.charCodeAt(i)) >>> 0;
		return (((h % 7) - 3) * 0.2).toFixed(2);
	});
</script>

{#snippet plate()}
	<!-- The picture at the full width of the column: this is the site that
	     doesn't crop artwork, so it keeps its own height too. -->
	<a {href} class="group block">
		<figure class="taped scrap" style="--tilt:{tilt}deg">
			<span class="tape" aria-hidden="true"></span>
			<img src={post.image} alt={post.title ?? ''} loading="lazy" class="block h-auto w-full" />
		</figure>
	</a>
{/snippet}

<article class="h-entry grid gap-x-8 gap-y-3 md:grid-cols-[8rem_1fr]">
	<!-- The rail: what it is and when. Inline on a phone, a margin on a desk. -->
	<div class="flex flex-wrap items-center gap-x-3 gap-y-1 md:block md:pt-1">
		<PostKindMark kind={post.kind} />
		<p class="md:mt-2">
			<a {href} class="u-url type-num text-muted-foreground transition-colors hover:text-primary">
				<time class="dt-published" datetime={post.date}>{formatDate(post.date)}</time>
			</a>
		</p>
	</div>

	<div>
		{#if post.kind === 'essay'}
			{#if post.title}
				<h2>
					<a {href} class="p-name type-title-lg transition-colors hover:text-primary">
						{post.title}
					</a>
				</h2>
			{/if}
			{#if blurb}
				<p class="p-summary mt-2.5 max-w-[52ch] text-[17px] leading-[1.6] text-muted-foreground">
					{blurb}
				</p>
			{/if}
			{#if post.image}
				<div class="mt-6">{@render plate()}</div>
			{/if}
			<p class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1">
				<a
					{href}
					class="inline-flex items-center gap-1.5 font-display text-[14px] font-semibold
					       tracking-[0.08em] text-primary transition-colors hover:text-foreground"
				>
					read the essay
					<HugeiconsIcon icon={ArrowRight02Icon} size={15} aria-hidden="true" />
				</a>
				{#if read}
					<span class="type-num text-muted-foreground">{read}</span>
				{/if}
			</p>
		{:else if post.kind === 'log'}
			{#if projectTitle && post.project}
				<p class="flex flex-wrap items-baseline gap-x-2">
					<a
						href="{base}/work/{post.project}/"
						class="type-title-sm text-foreground underline decoration-[1.5px] underline-offset-4
						       transition-colors hover:text-primary"
					>
						{projectTitle}
					</a>
					{#if position}
						<span class="type-num text-muted-foreground">
							entry {position.index} of {position.total}
						</span>
					{/if}
				</p>
			{/if}
			{#if post.title}
				<h2 class={projectTitle ? 'mt-1.5' : ''}>
					<a {href} class="p-name type-title transition-colors hover:text-primary">
						{post.title}
					</a>
				</h2>
			{/if}
			{#if post.image}
				<div class="mt-5">{@render plate()}</div>
			{/if}
			{#if blurb}
				<p class="p-summary mt-4 max-w-[52ch] text-[15px] leading-[1.65] text-muted-foreground">
					{blurb}
				</p>
			{/if}
		{:else}
			<!-- note: the picture is the post -->
			{#if post.image}
				{@render plate()}
			{/if}
			{#if post.title}
				<h2 class={post.image ? 'mt-5' : ''}>
					<a {href} class="p-name type-title transition-colors hover:text-primary">
						{post.title}
					</a>
				</h2>
			{/if}
			{#if blurb}
				<p
					class="p-summary max-w-[52ch] text-[15px] leading-[1.65] text-muted-foreground
					       {post.title ? 'mt-1.5' : post.image ? 'mt-5' : ''}"
				>
					{blurb}
				</p>
			{/if}
			{#if projectTitle && post.project}
				<p class="mt-2.5">
					<a
						href="{base}/work/{post.project}/"
						class="type-num text-muted-foreground underline underline-offset-3
						       transition-colors hover:text-primary"
					>
						from {projectTitle}
					</a>
				</p>
			{/if}
		{/if}
	</div>
</article>

<style>
	/* The scrap comes true when you reach for it, and the shadow deepens as it
	   lifts. Both are small on purpose — the lean it is coming back from is
	   only a fraction of a degree. */
	.scrap {
		transition:
			rotate 220ms cubic-bezier(0.22, 0.7, 0.2, 1),
			box-shadow 220ms ease;
	}
	.group:hover .scrap,
	.group:focus-visible .scrap {
		rotate: 0deg;
		box-shadow:
			0 0 0 1px var(--border),
			4px 8px 22px color-mix(in oklab, var(--ink) 18%, transparent);
	}
	@media (prefers-reduced-motion: reduce) {
		.scrap {
			transition: none;
		}
	}
</style>
