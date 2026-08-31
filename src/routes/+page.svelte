<script lang="ts">
	import portrait from '$lib/content/home-page/portrait_r.webp';
	import Seo from '$lib/components/Seo.svelte';
	import SectionHead from '$lib/components/SectionHead.svelte';
	import WorkTile from '$lib/components/WorkTile.svelte';
	import { masonry } from '$lib/gallery/masonry';
	import { formatDate } from '$lib/format';
	import { site } from '$lib/seo/config';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const { gallery, recently, latestNote, latestEssay } = $derived(data);
</script>

<Seo />

<!-- Masthead -->
<section class="h-card mx-auto max-w-[720px] px-6 py-12 text-center md:py-16">
	<img
		src={portrait}
		alt="Rhea Pradeep"
		class="u-photo mx-auto h-20 w-20 rounded-full object-cover md:h-24 md:w-24"
	/>
	<h1 class="mt-5 font-display text-[40px] leading-[1.05] font-bold md:text-[56px]">
		<a href="/" class="u-url p-name">{site.name}</a>
	</h1>
	<p class="p-note mx-auto mt-4 max-w-[48ch] text-[15px] leading-[1.65] text-muted-foreground md:text-[16px]">
		{site.description}
	</p>
</section>

<!-- The work, with the site's pulse woven into the grid -->
<section class="px-1 md:px-2">
	<div class="wall" use:masonry>
		{#each gallery.slice(0, 2) as item (item.slug)}
			<WorkTile {item} loading="eager" />
		{/each}

		<!-- Recently cell: an editorial tile that lives in the wall like any work. -->
		<div
			class="overflow-hidden bg-primary text-primary-foreground"
			style="--ratio:1.15"
			data-ratio="1.15"
			data-cols="2"
		>
			<div class="absolute inset-0 flex flex-col p-5 md:p-6">
				<SectionHead text="recently" tone="inverse" />
				<ul class="flex min-h-0 flex-1 flex-col justify-evenly overflow-hidden">
					{#each recently.slice(0, 4) as entry (entry.href + entry.action + entry.date)}
						<li class="leading-snug">
							<time class="type-meta block !text-primary-foreground/70" datetime={entry.date}>
								{formatDate(entry.date)} · {entry.action} {entry.kind}
							</time>
							<a
								href={entry.href}
								class="font-display text-[16px] font-semibold underline-offset-3 hover:underline md:text-[18px]"
							>
								{entry.title}
							</a>
						</li>
					{/each}
				</ul>
				<a href="/log/" class="text-[13px] underline underline-offset-3">full site log</a>
			</div>
		</div>

		{#each gallery.slice(2, 5) as item (item.slug)}
			<WorkTile {item} />
		{/each}

		<!-- Blog cell -->
		{#if latestNote || latestEssay}
			<div
				class="overflow-hidden bg-foreground text-background"
				style="--ratio:1.15"
				data-ratio="1.15"
				data-cols="2"
			>
				<div class="absolute inset-0 flex flex-col p-5 md:p-6">
					<SectionHead text="from the blog" tone="inverse" />
					<div class="flex min-h-0 flex-1 flex-col justify-evenly overflow-hidden">
						{#if latestNote}
							<div class="leading-snug">
								<time class="type-meta block !text-background/60" datetime={latestNote.post.date}>
									{formatDate(latestNote.post.date)} · note
								</time>
								<a
									href="/blog/{latestNote.post.slug}/"
									class="font-display text-[16px] font-semibold underline-offset-3 hover:underline md:text-[18px]"
								>
									{latestNote.post.title ??
										(latestNote.projectTitle ? `From ${latestNote.projectTitle}` : 'Sketchbook note')}
								</a>
							</div>
						{/if}
						{#if latestEssay}
							<div class="leading-snug">
								<time class="type-meta block !text-background/60" datetime={latestEssay.date}>
									{formatDate(latestEssay.date)} · essay
								</time>
								<a
									href="/blog/{latestEssay.slug}/"
									class="font-display text-[16px] font-semibold underline-offset-3 hover:underline md:text-[18px]"
								>
									{latestEssay.title}
								</a>
								{#if latestEssay.description}
									<p class="mt-1 text-[13px] opacity-70">{latestEssay.description}</p>
								{/if}
							</div>
						{/if}
					</div>
					<a href="/blog/" class="text-[13px] underline underline-offset-3">the blog</a>
				</div>
			</div>
		{/if}

		{#each gallery.slice(5, 8) as item (item.slug)}
			<WorkTile {item} />
		{/each}
	</div>

	<p class="py-10 text-center">
		<a
			href="/work/"
			class="tactile bg-primary px-6 py-2.5 font-display text-[16px] font-semibold text-primary-foreground"
		>
			Browse all work
		</a>
	</p>
</section>
