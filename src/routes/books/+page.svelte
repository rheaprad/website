<script lang="ts">
	import BookCard from '$lib/components/BookCard.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	const count = $derived(data.items.length);
</script>

<Seo
	title="Books"
	description="Picture books, graphic novels and artist books by Rhea Pradeep."
/>

<div class="mx-auto w-full max-w-[1440px] px-5 pt-10 pb-20 md:px-8 md:pt-14">
	<div class="mb-10 md:mb-14">
		<PageHeader title="Books" variant="caption" />
	</div>

	<!-- Equal-sized covers in an even grid: 2 up on phones, 4 on desktop. -->
	<div class="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4">
		{#each data.items as item, i (item.slug)}
			<BookCard {item} loading={i < 8 ? 'eager' : 'lazy'} />
		{/each}
	</div>
</div>
