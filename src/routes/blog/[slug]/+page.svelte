<script lang="ts">
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import TagChip from '$lib/components/TagChip.svelte';
	import PrevNext from '$lib/components/PrevNext.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const { post, projectTitle, projectSlug, prevNext } = $derived(data);

	const kindLabel = $derived(post.kind === 'log' ? 'process log' : post.kind);
	const shareImage = $derived(post.seo.image || post.image || '');
</script>

<Seo
	type="article"
	title={post.seo.title || post.title || formatDate(post.date)}
	description={post.seo.description || post.description}
	image={shareImage}
	published={post.date}
	modified={post.updated}
	tags={post.tags}
	keywords={post.seo.keywords}
	noindex={post.seo.noindex}
/>

<article class="h-entry mx-auto max-w-[720px] px-6 pt-10 pb-16 md:px-10 md:pt-14 md:pb-20">
	<span class="p-author h-card hidden">
		<a class="u-url p-name" href="{base}/about/">Rhea Pradeep</a>
	</span>

	<!-- Context line: date · kind · project -->
	<p class="type-meta flex flex-wrap items-baseline gap-x-2">
		<time class="dt-published" datetime={post.date}>{formatDate(post.date)}</time>
		<span>{kindLabel}</span>
		{#if projectSlug && projectTitle}
			<a href="{base}/work/{projectSlug}/" class="transition-colors hover:text-primary">
				{projectTitle}
			</a>
		{/if}
		{#if post.updated}
			<span>· updated <time class="dt-updated" datetime={post.updated}>{formatDate(post.updated)}</time></span>
		{/if}
	</p>

	{#if post.kind === 'essay'}
		{#if post.title}
			<h1 class="p-name type-display mt-4">{post.title}</h1>
		{/if}
		{#if post.description}
			<p class="p-summary mt-4 text-[18px] leading-[1.6] text-muted-foreground">
				{post.description}
			</p>
		{/if}
		{#if post.image}
			<img src={post.image} alt={post.title ?? ''} class="u-photo mt-8 w-full" />
		{/if}
		<div class="e-content prose mt-8">
			<post.component />
		</div>
	{:else}
		{#if post.title}
			<h1 class="p-name mt-4 font-display text-[26px] font-semibold md:text-[30px]">
				{post.title}
			</h1>
		{/if}
		{#if post.image}
			<img src={post.image} alt={post.title ?? ''} class="u-photo mt-6 w-full" />
		{/if}
		<div class="e-content prose mt-6 text-[17px] md:text-[18px]">
			<post.component />
		</div>
	{/if}

	{#if post.tags.length > 0}
		<div class="mt-8 flex flex-wrap gap-1.5">
			{#each post.tags as tag (tag)}
				<span class="u-category"><TagChip {tag} /></span>
			{/each}
		</div>
	{/if}

	{#if post.kind === 'log' && projectTitle && (data.projectLogs.prev || data.projectLogs.next)}
		<div class="mt-10">
			<h2 class="type-section">More logs for {projectTitle}</h2>
			<div class="mt-4">
				<PrevNext
					prev={data.projectLogs.next && {
						href: `${base}/blog/${data.projectLogs.next.slug}/`,
						title: formatDate(data.projectLogs.next.date)
					}}
					next={data.projectLogs.prev && {
						href: `${base}/blog/${data.projectLogs.prev.slug}/`,
						title: formatDate(data.projectLogs.prev.date)
					}}
					prevLabel="Next entry"
					nextLabel="Previous entry"
				/>
			</div>
		</div>
	{/if}

	<div class="mt-10">
		<PrevNext
			prev={prevNext.prev && {
				href: `${base}/blog/${prevNext.prev.slug}/`,
				title: prevNext.prev.title ?? formatDate(prevNext.prev.date),
				meta: prevNext.prev.kind
			}}
			next={prevNext.next && {
				href: `${base}/blog/${prevNext.next.slug}/`,
				title: prevNext.next.title ?? formatDate(prevNext.next.date),
				meta: prevNext.next.kind
			}}
			prevLabel="Newer post"
			nextLabel="Older post"
		/>
	</div>

	<p class="mt-8">
		<a href="{base}/blog/" class="type-meta transition-colors hover:text-primary">← Blog</a>
	</p>
</article>
