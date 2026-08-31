<script lang="ts">
	import type { Post } from '$lib/content';
	import { formatDate } from '$lib/format';

	interface Props {
		post: Post;
		/** Resolved title of the work this post belongs to (for logs/notes with a project). */
		projectTitle?: string;
	}

	let { post, projectTitle }: Props = $props();

	const kindLabel = $derived(post.kind === 'log' ? 'process log' : post.kind);
</script>

<article class="h-entry">
	<p class="type-meta flex flex-wrap items-baseline gap-x-2">
		<a href="/blog/{post.slug}/" class="u-url transition-colors hover:text-primary">
			<time class="dt-published" datetime={post.date}>{formatDate(post.date)}</time>
		</a>
		<span>{kindLabel}</span>
		{#if post.project && projectTitle}
			<a href="/work/{post.project}/" class="transition-colors hover:text-primary">
				{projectTitle}
			</a>
		{/if}
	</p>

	{#if post.kind === 'essay'}
		{#if post.title}
			<h2 class="mt-2">
				<a
					href="/blog/{post.slug}/"
					class="p-name font-display text-[24px] font-semibold transition-colors hover:text-primary"
				>
					{post.title}
				</a>
			</h2>
		{/if}
		{#if post.description}
			<p class="p-summary mt-2 text-[16px] text-muted-foreground">{post.description}</p>
		{/if}
	{:else}
		{#if post.title}
			<h2 class="mt-2">
				<a
					href="/blog/{post.slug}/"
					class="p-name font-display text-[19px] font-semibold transition-colors hover:text-primary"
				>
					{post.title}
				</a>
			</h2>
		{/if}
		{#if post.image}
			<a href="/blog/{post.slug}/" class="mt-4 block">
				<img src={post.image} alt={post.title ?? ''} loading="lazy" class="block w-full" />
			</a>
		{/if}
		<div class="e-content prose mt-4">
			<post.component />
		</div>
	{/if}
</article>
