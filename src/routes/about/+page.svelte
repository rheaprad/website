<script lang="ts">
	import { base } from '$app/paths';
	import type { PageData } from './$types';
	import EmailLink from '$lib/components/EmailLink.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SectionHead from '$lib/components/SectionHead.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const { data } = $props<{ data: PageData }>();
	const { metadata, component, images, enhanced } = $derived(data);
	const Bio = $derived(component);
	const about = $derived(metadata ?? {});
	const photoEnhanced = $derived(about.photo ? enhanced?.[about.photo] : undefined);

	const socialLinks = $derived(
		[
			{ key: 'instagram', href: about.instagram, label: 'Instagram' },
			{ key: 'linkedin', href: about.linkedin, label: 'LinkedIn' },
			{ key: 'email', href: about.email ? `mailto:${about.email}` : '', label: 'Email' },
			{ key: 'behance', href: about.behance, label: 'Behance' },
			{ key: 'bluesky', href: about.bluesky, label: 'Bluesky' }
		].filter((s) => s.href)
	);

	const seo = $derived(about.seo ?? {});
	const shareImage = $derived(
		(seo.image && (images[seo.image] || seo.image)) ||
			(about.photo && (images[about.photo] || about.photo)) ||
			''
	);

	// The same link treatment the footer uses, so "elsewhere" reads the same
	// wherever the reader meets it.
	const linkClass =
		'text-[14px] underline-offset-4 transition-colors hover:text-primary hover:underline';

	// Click-to-copy for mailto links that live inside the markdown bio.
	// The prose is raw HTML, so we delegate from the container instead of
	// wrapping each link in <EmailLink>.
	let isDesktop = $state(false);
	let copyBubble = $state<{ x: number; y: number } | null>(null);
	let bubbleTimer: ReturnType<typeof setTimeout>;
	let proseEl = $state<HTMLElement>();

	$effect(() => {
		const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
		isDesktop = mq.matches;
		const onChange = (e: MediaQueryListEvent) => (isDesktop = e.matches);
		mq.addEventListener('change', onChange);
		return () => {
			mq.removeEventListener('change', onChange);
			clearTimeout(bubbleTimer);
		};
	});

	$effect(() => {
		if (!proseEl) return;
		proseEl.addEventListener('click', handleProseClick);
		return () => proseEl?.removeEventListener('click', handleProseClick);
	});

	async function handleProseClick(event: MouseEvent) {
		if (!isDesktop || !navigator.clipboard) return;
		const link = (event.target as HTMLElement).closest('a[href^="mailto:"]');
		if (!link) return;

		event.preventDefault();
		const email = (link as HTMLAnchorElement).href.slice('mailto:'.length);
		try {
			await navigator.clipboard.writeText(email);
		} catch {
			return;
		}
		const rect = link.getBoundingClientRect();
		copyBubble = { x: rect.left + rect.width / 2, y: rect.top };
		clearTimeout(bubbleTimer);
		bubbleTimer = setTimeout(() => (copyBubble = null), 1600);
	}
</script>

<Seo
	title="About"
	type="profile"
	description={seo.description ||
		'About Rhea Pradeep, an Indian illustrator and visual artist working across comics, picture books and bookmaking.'}
	image={shareImage}
	keywords={seo.keywords}
	noindex={seo.noindex}
/>

<!-- The page titles itself the way every other page does — a hand-inked
	 balloon — and the photograph is taped up rather than dropped in a frame, so
	 the reader meets the same paper here as on the home page. -->
<article
	class="h-card mx-auto max-w-[1100px] px-6 pt-10 pb-16
	       md:px-10 md:pt-16 md:pb-24 lg:px-16"
>
	<div class="mb-11 md:mb-16">
		<!-- A narration box: the comics idiom for an aside about the character. -->
		<PageHeader title="About" variant="caption" />
		<!-- Names the h-card this page carries; the balloon above is drawn, not
		     text a parser can read. -->
		<a href="{base}/about/" class="u-url p-name hidden">Rhea Pradeep</a>
	</div>

	<div class="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-[72px]">
		<!-- Left: photo, resume, socials -->
		<div class="w-full max-w-[440px] lg:w-2/5 lg:shrink-0">
			{#if about.photo}
				<figure class="m-0">
					<span class="taped block" style="--tilt:-1.5deg">
						<span class="tape"></span>
						{#if photoEnhanced}
							<enhanced:img
								src={photoEnhanced}
								alt="Rhea Pradeep"
								fetchpriority="high"
								class="u-photo block aspect-[3/4] w-full object-cover"
							/>
						{:else}
							<img
								src={images[about.photo] || about.photo}
								alt="Rhea Pradeep"
								width="1200"
								height="1600"
								fetchpriority="high"
								class="u-photo block aspect-[3/4] w-full object-cover"
							/>
						{/if}
					</span>
					{#if about.photo_caption}
						<figcaption class="mt-6 type-meta">{about.photo_caption}</figcaption>
					{/if}
				</figure>
			{:else}
				<div class="flex aspect-[3/4] w-full items-center justify-center bg-muted">
					<span class="type-meta">Photo</span>
				</div>
			{/if}

			{#if about.resume}
				<a
					href={about.resume}
					target="_blank"
					rel="noopener noreferrer"
					class="tactile mt-9 bg-primary px-5 py-2.5 font-display text-[16px] font-semibold text-primary-foreground"
				>
					Résumé (PDF)
				</a>
			{/if}

			{#if socialLinks.length}
				<div class="mt-12">
					<SectionHead text="elsewhere" />
					<ul class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
						{#each socialLinks as s (s.key)}
							<li>
								{#if s.href.startsWith('mailto:')}
									<EmailLink
										email={s.href.slice('mailto:'.length)}
										label={s.label}
										side="top"
										class={linkClass}
									>
										{s.label}
									</EmailLink>
								{:else}
									<a href={s.href} target="_blank" rel="noopener noreferrer me" class={linkClass}>
										{s.label}
									</a>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>

		<!-- Right: the bio, set as the site's long-form prose so it reads like a
		     post rather than a page of its own invention. -->
		<div class="min-w-0 flex-1">
			{#if Bio}
				<div bind:this={proseEl} class="prose p-note max-w-[68ch]">
					<Bio />
				</div>
			{/if}
		</div>
	</div>
</article>

{#if copyBubble}
	<div
		class="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md bg-foreground
		       px-3 py-1.5 text-xs text-background shadow-md"
		style="left: {copyBubble.x}px; top: {copyBubble.y - 8}px;"
		role="status"
	>
		Copied!
	</div>
{/if}
