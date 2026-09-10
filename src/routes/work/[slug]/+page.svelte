<script lang="ts">
	import { base } from '$app/paths';
	import { ImageWithSkeleton } from '$lib/components/ui/image-with-skeleton';
	import { Lightbox, type LightboxItem } from '$lib/components/ui/lightbox';
	import Image from '$lib/components/ui/Image.svelte';
	import { navState, resetNav } from '$lib/nav.svelte';
	import MetaList from '$lib/components/MetaList.svelte';
	import SectionHead from '$lib/components/SectionHead.svelte';
	import TagChip from '$lib/components/TagChip.svelte';
	import PrevNext from '$lib/components/PrevNext.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';
	import { site } from '$lib/seo/config';

	const { data }: { data: PageData } = $props();
	const { item, related, adjacent, posts } = $derived(data);
	const isBook = $derived(item.type === 'book');

	// Books drive the global transparent-overlay nav while this page is shown.
	$effect(() => {
		if (!isBook) return;
		navState.transparent = true;
		navState.text = item.navText;
		return () => resetNav();
	});

	// Colours are baked into frontmatter by `scripts/extract-book-colors.mjs`,
	// which runs from `prebuild`. There used to be a client-side canvas fallback
	// here "for items added via the CMS between builds" — but a CMS commit
	// triggers a rebuild, and prebuild runs before it, so the branch never fired
	// in production. It cost a second full-resolution fetch of the hero, a late
	// recolour of the <h1>, and a nav-text flip on book pages.
	const titleColor = $derived(item.titleColor || '');
	const description = $derived(
		item.seo.description ||
			`${item.title}, ${[item.medium ?? item.type, String(item.year)].join(', ')}. By ${site.author}.`
	);

	let lbOpen = $state(false);
	let lbIndex = $state(0);
	const lightboxItems = $derived<LightboxItem[]>(
		item.gallery.length > 0
			? item.gallery.map((g) => ({
					src: g.src,
					picture: g.picture,
					title: item.title,
					caption: g.caption
				}))
			: item.hero
				? [
						{
							src: item.hero,
							picture: item.heroPicture,
							title: item.title,
							caption: item.caption ?? ''
						}
					]
				: []
	);

	function openLightbox(i: number) {
		lbIndex = i;
		lbOpen = true;
	}
</script>

<Seo
	type="article"
	title={item.seo.title || item.title}
	{description}
	image={item.seo.image || item.hero}
	published={item.date}
	modified={item.updated}
	tags={item.tags}
	keywords={item.seo.keywords}
	noindex={item.seo.noindex}
/>

{#if isBook && item.hero}
	<!-- Full-bleed hero — starts at the very top, behind the transparent header.
	     The floating card gives a glimpse of what this is; it scrolls away with the hero. -->
	<div class="relative w-full">
		<Image
			src={item.heroPicture ?? item.hero}
			alt={item.title}
			sizes="100vw"
			loading="eager"
			fetchpriority="high"
			class="block h-auto w-full"
		/>
		<!-- Sticky card: rides the bottom of the viewport while the hero is on screen,
		     then parks at the hero's bottom edge once we've scrolled past it. -->
		<div class="pointer-events-none absolute inset-0 hidden justify-end p-4 sm:flex md:p-8">
			<div
				class="pointer-events-auto sticky bottom-4 mt-auto h-fit max-w-[320px] rounded-md bg-background/95 p-5 shadow-[0_8px_30px_rgb(0_0_0/0.18)]
				       backdrop-blur-sm md:bottom-8"
			>
				<p class="font-display text-[20px] leading-tight font-bold">{item.title}</p>
				<p class="mt-1.5 type-meta">
					{[String(item.year), item.medium ?? item.type, item.dimensions]
						.filter(Boolean)
						.join(' · ')}
				</p>
				<div class="mt-3 flex flex-wrap gap-2">
					{#each item.tags as tag (tag)}
						<TagChip {tag} />
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<article class="mx-auto max-w-[900px] px-6 pt-10 pb-4 md:px-10 md:pt-14">
	{#if !isBook && item.hero}
		<button type="button" onclick={() => openLightbox(0)} class="block w-full">
			<Image
				src={item.heroPicture ?? item.hero}
				alt={item.title}
				sizes="(min-width: 900px) 820px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)"
				loading="eager"
				fetchpriority="high"
				class="w-full"
			/>
		</button>
	{/if}

	<h1
		class="type-display {!isBook && item.hero ? 'mt-8' : ''}"
		style={titleColor ? `color:${titleColor}` : undefined}
	>
		{item.title}
	</h1>

	<div class="mt-6">
		<MetaList {item} />
	</div>

	{#if item.component}
		<div class="prose mt-8 max-w-[68ch]">
			<item.component />
		</div>
	{/if}
</article>

{#if item.gallery.length > 0}
	<section class="mx-auto max-w-[1100px] px-6 pt-8 pb-6 md:px-10">
		<div class="columns-2 gap-2 md:gap-3 lg:columns-3 lg:gap-4">
			{#each item.gallery as image, i (image.src)}
				<button
					type="button"
					onclick={() => openLightbox(i)}
					class="group mb-2 block w-full break-inside-avoid overflow-hidden md:mb-3 lg:mb-4"
					aria-label={image.caption || item.title}
				>
					<Image
						src={image.picture ?? image.src}
						alt={image.caption || item.title}
						sizes="(min-width: 1100px) 330px, (min-width: 1024px) 31vw, 46vw"
						loading="lazy"
						class="block w-full transition-transform duration-500 group-hover:scale-[1.03]"
					/>
				</button>
			{/each}
		</div>
	</section>
{/if}

<div class="mx-auto max-w-[900px] px-6 md:px-10">
	{#if posts.length > 0}
		<section class="mt-14">
			<SectionHead text="posts about this work" />
			<ul class="mt-6 space-y-3">
				{#each posts as post (post.slug)}
					<li class="flex items-baseline gap-2">
						<time class="w-24 flex-shrink-0 type-meta" datetime={post.date}>
							{formatDate(post.date)}
						</time>
						<a
							href="{base}/blog/{post.slug}/"
							class="min-w-0 truncate text-[15px] transition-colors hover:text-primary"
						>
							{post.title ?? post.description ?? formatDate(post.date)}
						</a>
						<span class="leader"></span>
						<span class="flex-shrink-0 type-meta">
							{post.kind === 'log' ? 'process log' : post.kind}
						</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if related.length > 0}
		<section class="mt-14">
			<SectionHead text="related work" />
			<div class="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:gap-x-6">
				{#each related as other (other.slug)}
					<a href="{base}/work/{other.slug}/" class="group block">
						<div class="mb-3 overflow-hidden">
							<ImageWithSkeleton
								src={other.coverPicture ?? other.cover}
								alt={other.title}
								aspectRatio="3/4"
								sizes="(min-width: 900px) 260px, (min-width: 768px) 30vw, 46vw"
								class="transition-transform duration-300 group-hover:scale-[1.02]"
							/>
						</div>
						<p
							class="font-display text-[15px] font-semibold transition-colors group-hover:text-primary"
						>
							{other.title}
						</p>
						<p class="mt-0.5 type-meta">{other.year} · {other.medium ?? other.type}</p>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<div class="mt-14 pb-14 md:pb-20">
		<PrevNext
			prev={adjacent.prev && {
				href: `${base}/work/${adjacent.prev.slug}/`,
				title: adjacent.prev.title,
				meta: String(adjacent.prev.year)
			}}
			next={adjacent.next && {
				href: `${base}/work/${adjacent.next.slug}/`,
				title: adjacent.next.title,
				meta: String(adjacent.next.year)
			}}
		/>
	</div>
</div>

<Lightbox items={lightboxItems} bind:open={lbOpen} bind:index={lbIndex} />
