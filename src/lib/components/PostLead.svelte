<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	/**
	 * The newest post, given the front page of the shelf.
	 *
	 * An index that treats every entry identically has no editor in it — the
	 * most recent thing is the only thing a returning reader is looking for,
	 * and it was previously indistinguishable from a post from last spring.
	 * This is the one lead per index: picture at plate size, title at a size
	 * nothing else on the page reaches, and a die-cut "latest" sticker over
	 * the corner so the hierarchy is stated rather than implied. The picture
	 * keeps its own proportions — nothing on this site crops artwork to fit a
	 * layout — so the lead is as tall as the newest post happens to be.
	 *
	 * Only the blog's own front page runs a lead. The per-kind pages are
	 * shelves of one kind of thing, where singling out the newest says less.
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
		projectTitle?: string;
		position?: { index: number; total: number };
	}

	let { post, projectTitle, position }: Props = $props();

	const href = $derived(`${base}/blog/${post.slug}/`);
	const blurb = $derived(post.description || post.excerpt);
	const read = $derived(readingTime(post.words));
	const heading = $derived(
		post.title ??
			(projectTitle ? `${projectTitle}, ${formatDate(post.date)}` : formatDate(post.date))
	);
</script>

<article class="h-entry">
	<div class="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-center md:gap-10">
		{#if post.image}
			<a {href} class="group block">
				<figure class="taped plate" style="--tilt:-0.5deg">
					<span class="tape" aria-hidden="true"></span>
					<Image
						src={post.imagePicture ?? post.image}
						alt={post.title ?? ''}
						sizes="(min-width: 880px) 360px, (min-width: 768px) 43vw, calc(100vw - 60px)"
						loading="eager"
						fetchpriority="high"
						class="block h-auto w-full"
					/>
					<span
						class="sticker absolute -top-3 -right-3 z-10 px-3 py-1 font-display text-[12px]
						       font-bold tracking-[0.1em] text-foreground"
						style="--tilt:1.5deg"
					>
						latest
					</span>
				</figure>
			</a>
		{/if}

		<div class={post.image ? '' : 'md:col-span-2 md:max-w-[26ch]'}>
			<div class="flex flex-wrap items-center gap-x-3 gap-y-1">
				{#if !post.image}
					<span
						class="sticker px-3 py-1 font-display text-[12px] font-bold tracking-[0.1em]
						       text-foreground"
						style="--tilt:-1.5deg"
					>
						latest
					</span>
				{/if}
				<PostKindMark kind={post.kind} />
				<time class="dt-published type-num text-muted-foreground" datetime={post.date}>
					{formatDate(post.date)}
				</time>
			</div>

			<h2 class="mt-3">
				<a
					{href}
					class="p-name font-title text-[clamp(1.7rem,3.4vw,2.4rem)] leading-[1.12] font-bold
					       transition-colors hover:text-primary"
				>
					{heading}
				</a>
			</h2>

			{#if post.kind === 'log' && projectTitle && post.project}
				<p class="mt-2.5 flex flex-wrap items-baseline gap-x-2">
					<a
						href="{base}/work/{post.project}/"
						class="type-title-sm underline decoration-[1.5px] underline-offset-4
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

			{#if blurb}
				<p class="p-summary mt-3 max-w-[46ch] text-[17px] leading-[1.6] text-muted-foreground">
					{blurb}
				</p>
			{/if}

			<p class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1">
				<a
					{href}
					class="tactile inline-flex items-center gap-2 bg-primary px-4 py-1.5 font-display
					       text-[14px] font-semibold tracking-[0.06em] text-primary-foreground"
				>
					read it
					<HugeiconsIcon icon={ArrowRight02Icon} size={15} aria-hidden="true" />
				</a>
				{#if read}
					<span class="type-num text-muted-foreground">{read}</span>
				{/if}
			</p>
		</div>
	</div>
</article>

<style>
	/* The lead's picture is a plate, not a scrap: it holds still, and only the
	   shadow deepens — a scrap that straightens is a gesture for small things. */
	.plate {
		transition: box-shadow 240ms ease;
	}
	.group:hover .plate {
		box-shadow:
			0 0 0 1px var(--border),
			5px 10px 28px color-mix(in oklab, var(--ink) 20%, transparent);
	}
	@media (prefers-reduced-motion: reduce) {
		.plate {
			transition: none;
		}
	}
</style>
