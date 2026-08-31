<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const { now } = $derived(data);
</script>

<Seo title="Now" description="What Rhea Pradeep is working on right now." />

<div class="mx-auto max-w-[720px] px-6 py-10 md:px-10 md:py-14">
	<PageHeader title="Now" sub="Updated {formatDate(now.updated)}" variant="whisper" />

	<div class="prose mt-8">
		<now.component />
	</div>

	<p class="mt-10 flex gap-4">
		<a href="/log/" class="type-meta transition-colors hover:text-primary">Site log</a>
		<a href="/blog/" class="type-meta transition-colors hover:text-primary">Blog</a>
	</p>
</div>
