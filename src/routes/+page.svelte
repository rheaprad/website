<script lang="ts">
	import { base } from '$app/paths';
	import portrait from '$lib/content/home-page/portrait_r.webp';
	import Seo from '$lib/components/Seo.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SectionHead from '$lib/components/SectionHead.svelte';
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import EmailLink from '$lib/components/EmailLink.svelte';
	import Ribbon from '$lib/components/home/Ribbon.svelte';
	import DoorCard from '$lib/components/home/DoorCard.svelte';
	import Postmark from '$lib/components/home/Postmark.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import postcardPicture from '$lib/content/home-page/landing-01.webp';
	import { formatDate } from '$lib/format';
	import { site } from '$lib/seo/config';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const { strip, shelf, doors, feed } = $derived(data);
</script>

<Seo />

<!-- ─── Masthead ────────────────────────────────────────────────
	 She introduces herself in her own idiom: the name inside a hand-inked
	 balloon, the way every other page titles itself, and her photograph taped
	 up beside it with a note in the margin. -->
<section class="h-card mx-auto w-full max-w-[1100px] px-6 pt-10 pb-2 md:px-10 md:pt-16">
	<div
		class="flex flex-col-reverse items-start gap-10 md:flex-row md:items-center md:justify-between md:gap-14"
	>
		<div class="min-w-0 md:max-w-[34rem]">
			<a href="{base}/" class="u-url p-name inline-block">
				<PageHeader title={site.name} variant="speech" />
			</a>

			<Badge
				variant="outline"
				class="mt-7 h-auto px-2.5 py-1 font-display text-[13px] tracking-wide"
			>
				{site.tagline}
			</Badge>

			<p
				class="p-note mt-4 max-w-[46ch] text-[15px] leading-[1.7] text-muted-foreground md:text-base"
			>
				{site.description}
			</p>

			<div class="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
				<a
					href="{base}/work/"
					class="tactile bg-primary px-5 py-2.5 font-display text-[16px] font-semibold text-primary-foreground"
				>
					See the work
				</a>
				<a
					href="{base}/about/"
					class="font-display text-[16px] font-semibold underline-offset-4 hover:underline"
				>
					More about me
				</a>
			</div>
		</div>

		<!-- Portrait, taped to the page with a note in the margin. -->
		<span
			class="ann ann-n ann-no-mark shrink-0"
			data-note="that's me"
			style="--ann-color: var(--color-primary)"
		>
			<span class="taped block w-[168px] md:w-[220px]" style="--tilt:-2.5deg">
				<span class="tape"></span>
				<img
					src={portrait}
					alt="Rhea Pradeep"
					class="u-photo block aspect-square w-full object-cover"
				/>
			</span>
		</span>
	</div>
</section>

<!-- ─── Ribbon ──────────────────────────────────────────────────
	 Full-bleed offcuts from the sketchbook, drifting past. -->
<Ribbon images={strip} />

<!-- ─── Selected work ───────────────────────────────────────────
	 The same shelf the catalog uses, so a piece looks identical wherever the
	 reader meets it. Nothing but art lives in here. -->
<section class="mx-auto w-full max-w-[1440px] px-5 md:px-8">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-9">
		<SectionHead text="selected work" />
		<a
			href="{base}/work/"
			class="font-display text-[15px] font-semibold underline-offset-4 hover:underline md:text-base"
		>
			all work →
		</a>
	</div>

	<GalleryGrid items={shelf} withYears={false} />
</section>

<!-- ─── Doors ───────────────────────────────────────────────────
	 Everything the header hides behind a menu, laid out as pictures. -->
<section class="mx-auto w-full max-w-[1440px] px-5 pt-20 md:px-8 md:pt-28">
	<SectionHead text="wander in" />
	<div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-8 md:gap-4 lg:grid-cols-6">
		{#each doors as door (door.href)}
			<DoorCard {...door} />
		{/each}
	</div>
</section>

<!-- ─── Lately ─────────────────────────────────────────────────
	 One feed rather than two columns. A new drawing and a new essay are both
	 just the next thing she made, and standing them in separate boxes made the
	 page argue with itself about which mattered more. Set tight, as an index:
	 the thumbnail identifies the thing, the line names it, and nothing else
	 competes. A piece with no picture of its own gets a pen mark instead of an
	 empty grey square. -->
<section class="mx-auto w-full max-w-[820px] px-5 pt-20 md:px-8 md:pt-28">
	<SectionHead text="lately" />

	<ul class="mt-5 border-t border-border md:mt-7">
		{#each feed as entry (entry.href + entry.action + entry.date)}
			<li class="border-b border-border">
				<a href={base + entry.href} class="group flex items-center gap-3.5 py-3 md:gap-4">
					<span
						class="grid size-12 shrink-0 place-items-center overflow-hidden border border-border bg-muted md:size-14"
					>
						{#if entry.thumb}
							<img
								src={entry.thumb}
								alt=""
								loading="lazy"
								class="h-full w-full object-cover transition-transform duration-500 ease-out
								       group-hover:scale-[1.06] motion-reduce:transform-none"
							/>
						{:else}
							<!-- Nothing to show: a pen stroke reads better than an empty grey square. -->
							<svg
								viewBox="0 0 76 20"
								fill="none"
								aria-hidden="true"
								class="w-7 text-muted-foreground"
							>
								<path
									d="M3 11C10 3 18 18 26 10S42 2 50 10s16 8 23 0"
									stroke="currentColor"
									stroke-width="2.25"
									stroke-linecap="round"
									vector-effect="non-scaling-stroke"
								/>
							</svg>
						{/if}
					</span>

					<span class="min-w-0 flex-1">
						<span
							class="block truncate font-display text-[16px] leading-snug font-semibold underline-offset-3 group-hover:underline md:text-[17px]"
						>
							{entry.title}
						</span>
						<span class="block truncate type-meta">
							{entry.kind} · {entry.action}
							{formatDate(entry.date)}
						</span>
					</span>

					<span
						class="hidden shrink-0 text-[17px] text-muted-foreground transition-transform duration-150
						       group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none sm:block"
						aria-hidden="true"
					>
						→
					</span>
				</a>
			</li>
		{/each}
	</ul>

	<a
		href="{base}/blog/"
		class="mt-4 inline-block text-[14px] underline underline-offset-3 hover:no-underline"
	>
		everything I've written
	</a>
</section>

<!-- ─── Say hello ───────────────────────────────────────────────
	 A postcard, because that is what one artist sends another. What sells it is
	 not the layout but the small print of the object: rounded corners, warmer
	 card stock than the page it lies on, a keyline, a contact shadow under the
	 near edge, the ruled address block, and a frank struck across the stamp.
	 Deliberately a different paper object from the taped scraps above, so the
	 page doesn't tape everything to the wall twice. -->
<section class="mx-auto w-full max-w-[1040px] px-6 pt-20 pb-4 md:px-10 md:pt-28">
	<div class="postcard grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
		<div class="postcard-pic">
			<img src={postcardPicture} alt="" loading="lazy" />
		</div>

		<div class="postcard-note">
			<div class="postcard-frank" aria-hidden="true">
				<span class="stamp">
					<img src={portrait} alt="" loading="lazy" />
				</span>
				<Postmark class="postcard-postmark" />
			</div>

			<p class="type-section text-muted-foreground">say hello</p>

			<h2
				class="mt-3 max-w-[14ch] font-display text-[clamp(1.6rem,4vw,2.5rem)] leading-[1.08] font-bold"
			>
				Commissions, collaborations, or just a nice note.
			</h2>

			<p class="mt-5 max-w-[34ch] text-[15px] leading-[2.25] md:text-base">
				Write to
				<span class="ann ann-amber ann-circle whitespace-nowrap">
					<EmailLink
						email="hello@rheapradeep.com"
						side="top"
						class="font-display text-[16px] font-semibold md:text-[18px]"
					>
						hello@rheapradeep.com
					</EmailLink>
				</span>, or come find me on
				<a
					href="https://www.instagram.com/rhepository/"
					target="_blank"
					rel="noopener noreferrer me"
					class="underline underline-offset-4 hover:no-underline">Instagram</a
				>
				and
				<a
					href="https://www.behance.net/rheapradeep"
					target="_blank"
					rel="noopener noreferrer me"
					class="underline underline-offset-4 hover:no-underline">Behance</a
				>.
			</p>

			<span class="postcard-lines" aria-hidden="true"></span>
		</div>
	</div>
</section>
