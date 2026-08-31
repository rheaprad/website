<script lang="ts">
	import type { Post } from '$lib/content';
	import PostRiverItem from '$lib/components/PostRiverItem.svelte';

	interface Props {
		items: { post: Post; projectTitle?: string }[];
	}

	let { items }: Props = $props();
</script>

<div class="h-feed space-y-16">
	{#each items as { post, projectTitle } (post.slug)}
		<PostRiverItem {post} {projectTitle} />
	{/each}
</div>
