<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	/**
	 * A post, set as the kind of thing it is.
	 *
	 * The three kinds share a body and almost nothing else. An essay is print:
	 * a masthead, a measure sized for reading, a drop cap, an ornament at the
	 * end. A log is an instalment: a docket saying which project and which
	 * entry, and the project's whole diary at the foot instead of a second
	 * prev/next widget. A note is a pinned picture with a caption under it, and
	 * the less furniture around it the better.
	 */
	import { base } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
	import Seo from '$lib/components/Seo.svelte';
	import TagChip from '$lib/components/TagChip.svelte';
	import PrevNext from '$lib/components/PrevNext.svelte';
	import PostHeader from '$lib/components/PostHeader.svelte';
	import LogDiary from '$lib/components/LogDiary.svelte';
	import { formatDate } from '$lib/format';
	import { kindVoice } from '$lib/post-kind';
	import type { PageData } from './$types';
	import { site } from '$lib/seo/config';

	const { data }: { data: PageData } = $props();
	const { post, projectTitle, projectSlug, position, diary, prevNext } = $derived(data);

	const shareImage = $derived(post.seo.image || post.image || '');

	// Notes are the one kind whose picture is the point, so they get a little
	// more room for it; the two reading kinds hold a measure.
	const measure = $derived(post.kind === 'note' ? 'max-w-[780px]' : 'max-w-[720px]');
</script>

<Seo
	type="article"
	title={post.seo.title || post.title || formatDate(post.date)}
	description={post.seo.description || post.description || post.excerpt}
	image={shareImage}
	published={post.date}
	modified={post.updated}
	tags={post.tags}
	keywords={post.seo.keywords}
	noindex={post.seo.noindex}
/>

<article class="h-entry mx-auto {measure} px-6 pt-10 pb-16 md:px-10 md:pt-14 md:pb-20">
	<span class="p-author h-card hidden">
		<a class="u-url p-name" href="{base}/about/">{site.name}</a>
	</span>

	<PostHeader {post} {projectTitle} {projectSlug} {position} />

	{#if post.image}
		{#if post.kind === 'note'}
			<!-- The note's picture is pinned, not printed: the same scrap the
			     index shows, at the width of the page. -->
			<figure class="taped mt-8" style="--tilt:-0.4deg">
				<span class="tape" aria-hidden="true"></span>
				<Image
					src={post.imagePicture ?? post.image}
					alt={post.title ?? ''}
					sizes="(min-width: 780px) 690px, (min-width: 768px) calc(100vw - 92px), calc(100vw - 60px)"
					loading="eager"
					fetchpriority="high"
					class="u-photo block h-auto w-full"
				/>
			</figure>
		{:else}
			<Image
				src={post.imagePicture ?? post.image}
				alt={post.title ?? ''}
				sizes="(min-width: 800px) 640px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)"
				loading="eager"
				fetchpriority="high"
				class="u-photo mt-8 block h-auto w-full ring-1 ring-border"
			/>
		{/if}
	{/if}

	<div
		class="e-content prose mt-8 {post.kind === 'essay'
			? 'essay-body max-w-[68ch] text-[17px] md:text-[18px]'
			: 'text-[17px] md:text-[18px]'}"
	>
		<post.component />
	</div>

	{#if post.kind === 'essay'}
		<p class="ornament-rule mt-12 text-[18px]" aria-hidden="true">
			<span class="ornament">&</span>
		</p>
	{/if}

	{#if post.tags.length > 0}
		<div class="mt-10 flex flex-wrap gap-1.5">
			{#each post.tags as tag (tag)}
				<span class="u-category"><TagChip {tag} /></span>
			{/each}
		</div>
	{/if}

	{#if post.kind === 'log' && diary.length > 1 && projectTitle && projectSlug}
		<div class="mt-14">
			<LogDiary entries={diary} current={post.slug} {projectTitle} {projectSlug} />
		</div>
	{:else if post.kind !== 'log' && projectTitle && projectSlug}
		<!-- A note that came out of a project still says so, but as one line. -->
		<p class="mt-10">
			<a
				href="{base}/work/{projectSlug}/"
				class="type-num text-primary underline underline-offset-3 transition-colors
				       hover:text-foreground"
			>
				see {projectTitle}
			</a>
		</p>
	{/if}

	<div class="mt-14 border-t border-border pt-8">
		<PrevNext
			prev={prevNext.prev && {
				href: `${base}/blog/${prevNext.prev.slug}/`,
				title: prevNext.prev.title ?? formatDate(prevNext.prev.date),
				meta: kindVoice(prevNext.prev.kind).label
			}}
			next={prevNext.next && {
				href: `${base}/blog/${prevNext.next.slug}/`,
				title: prevNext.next.title ?? formatDate(prevNext.next.date),
				meta: kindVoice(prevNext.next.kind).label
			}}
			prevLabel="Newer post"
			nextLabel="Older post"
		/>
	</div>

	<p class="mt-10">
		<a
			href="{base}/blog/"
			class="inline-flex items-center gap-1.5 type-num text-muted-foreground
			       transition-colors hover:text-primary"
		>
			<HugeiconsIcon icon={ArrowLeft02Icon} size={15} aria-hidden="true" />
			all posts
		</a>
	</p>
</article>

<style>
	/* The drop cap: an essay opening the way a printed one does, cut into three
	   lines of the first paragraph. Set in the display face, which is caps-only
	   — exactly what a versal wants — and only where there is room for it, so a
	   phone gets a plain first line rather than a letter eating the column. */
	@media (min-width: 640px) {
		.essay-body :global(> p:first-of-type::first-letter) {
			float: left;
			font-family: var(--font-display);
			font-weight: 600;
			font-size: 3.4em;
			line-height: 0.82;
			padding-right: 0.08em;
			padding-top: 0.06em;
			color: var(--primary);
		}
	}
</style>
