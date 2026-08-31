<script lang="ts">
	// Dev-only comparison page: the hand-inked balloon header in its five variants,
	// with different title lengths to check the text always sits neatly inside.
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { BalloonVariant } from '$lib/components/PageHeader.svelte';

	const rows: { variant: BalloonVariant; title: string; sub?: string }[] = [
		{ variant: 'speech', title: 'Work', sub: 'Books, comics and illustrations' },
		{ variant: 'caption', title: 'Site log', sub: 'Everything added or updated, newest first' },
		{ variant: 'thought', title: 'Blog' },
		{ variant: 'burst', title: 'Illustrations' },
		{ variant: 'whisper', title: 'About' }
	];
</script>

<svelte:head><title>header lab</title><meta name="robots" content="noindex" /></svelte:head>

<div class="mx-auto flex max-w-[900px] flex-col gap-20 px-6 py-16 md:px-10">
	{#each rows as r (r.variant)}
		<section>
			<div class="type-section mb-6 text-muted-foreground">{r.variant}</div>
			<PageHeader title={r.title} variant={r.variant} sub={r.sub} />
		</section>
	{/each}
</div>
