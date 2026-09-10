<script lang="ts">
	/**
	 * The head of a post, set as whatever the post is.
	 *
	 * All three kinds used to share one line of metadata and a single
	 * `if (essay)` branch, which meant a log — an instalment of a named
	 * project's diary — announced itself with the words "process log" in the
	 * same grey as its date, and nothing else. What each kind needs at the top
	 * is genuinely different:
	 *
	 *   essay  a masthead: kicker, title at display size, the dek that was
	 *          already in the frontmatter, a byline with the reading estimate,
	 *          and a printer's ornament closing the block off from the text.
	 *   log    a docket: which project, which entry, when. Ruled like the
	 *          catalogue rows on a work page, because that is the same fact —
	 *          this belongs to that.
	 *   note   almost nothing: a date, and then the picture. A note that needs
	 *          a header isn't a note.
	 */
	import { base } from '$app/paths';
	import PostKindMark from '$lib/components/PostKindMark.svelte';
	import type { Post } from '$lib/content';
	import { formatDate } from '$lib/format';
	import { readingTime } from '$lib/post-kind';

	interface Props {
		post: Post;
		projectTitle?: string;
		projectSlug?: string;
		position?: { index: number; total: number };
	}

	let { post, projectTitle, projectSlug, position }: Props = $props();

	const read = $derived(readingTime(post.words));
</script>

<header>
	<div class="flex flex-wrap items-center gap-x-3 gap-y-1">
		<PostKindMark kind={post.kind} />
		<time class="dt-published type-num text-muted-foreground" datetime={post.date}>
			{formatDate(post.date)}
		</time>
		{#if post.updated}
			<span class="type-num text-muted-foreground">
				· updated <time class="dt-updated" datetime={post.updated}>{formatDate(post.updated)}</time>
			</span>
		{/if}
	</div>

	{#if post.kind === 'essay'}
		{#if post.title}
			<h1 class="p-name mt-5 type-display">{post.title}</h1>
		{/if}
		{#if post.description}
			<p class="p-summary mt-5 max-w-[46ch] text-[19px] leading-[1.55] text-muted-foreground">
				{post.description}
			</p>
		{/if}
		<p class="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
			<a href="{base}/about/" class="type-title-sm transition-colors hover:text-primary">
				Rhea Pradeep
			</a>
			{#if read}
				<span class="type-num text-muted-foreground">{read}</span>
			{/if}
		</p>
		<!-- A printer's mark rather than a rule: the essay starts below it. -->
		<p class="ornament-rule mt-8 text-[18px]" aria-hidden="true">
			<span class="ornament">*</span>
		</p>
	{:else if post.kind === 'log'}
		{#if post.title}
			<h1 class="p-name mt-4 type-title-lg">{post.title}</h1>
		{/if}
		{#if projectTitle && projectSlug}
			<!-- The docket. Same ruled rows as a work's catalogue entry, because
			     this is the same kind of statement: this belongs to that. -->
			<dl class="mt-6 space-y-2 border-y border-border py-4">
				<div class="flex items-baseline gap-3">
					<dt class="shrink-0 type-section text-muted-foreground">project</dt>
					<span class="leader" aria-hidden="true"></span>
					<dd class="shrink-0">
						<a
							href="{base}/work/{projectSlug}/"
							class="type-title-sm underline decoration-[1.5px] underline-offset-4
							       transition-colors hover:text-primary"
						>
							{projectTitle}
						</a>
					</dd>
				</div>
				{#if position}
					<div class="flex items-baseline gap-3">
						<dt class="shrink-0 type-section text-muted-foreground">entry</dt>
						<span class="leader" aria-hidden="true"></span>
						<dd class="shrink-0 type-num">{position.index} of {position.total}</dd>
					</div>
				{/if}
			</dl>
		{/if}
		{#if post.description}
			<p class="p-summary mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-muted-foreground">
				{post.description}
			</p>
		{/if}
	{:else if post.title}
		<h1 class="p-name mt-4 type-title-lg">{post.title}</h1>
	{/if}
</header>
