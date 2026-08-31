<script lang="ts">
	import type { PageData } from './$types';
	import linkedinIcon from '$lib/assets/icons/LinkedIn.png';
	import instagramIcon from '$lib/assets/icons/Instagram.png';
	import mailIcon from '$lib/assets/icons/Mail.png';
	import behanceIcon from '$lib/assets/icons/Behance.png';
	import blueskyIcon from '$lib/assets/icons/Bluesky.png';
	import resumeIcon from '$lib/assets/Resume_Icon.png';
	import EmailLink from '$lib/components/EmailLink.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const { data } = $props<{ data: PageData }>();
	const { metadata, component, images, enhanced } = $derived(data);
	const Bio = $derived(component);
	const about = $derived(metadata ?? {});
	const photoEnhanced = $derived(about.photo ? enhanced?.[about.photo] : undefined);

	const socialLinks = $derived(
		[
			{ key: 'instagram', href: about.instagram, icon: instagramIcon, label: 'Instagram' },
			{ key: 'linkedin', href: about.linkedin, icon: linkedinIcon, label: 'LinkedIn' },
			{
				key: 'email',
				href: about.email ? `mailto:${about.email}` : '',
				icon: mailIcon,
				label: 'Email'
			},
			{ key: 'behance', href: about.behance, icon: behanceIcon, label: 'Behance' },
			{ key: 'bluesky', href: about.bluesky, icon: blueskyIcon, label: 'Bluesky' }
		].filter((s) => s.href)
	);

	const seo = $derived(about.seo ?? {});
	const shareImage = $derived(
		(seo.image && (images[seo.image] || seo.image)) ||
			(about.photo && (images[about.photo] || about.photo)) ||
			''
	);

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

<article
	class="mx-auto max-w-[1100px] px-6 pt-10 pb-12
	       md:px-10 md:pt-14 md:pb-20 lg:px-16"
>
	<div class="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-[80px]">
		<!-- Left: photo, resume button, socials -->
		<div class="w-full lg:w-2/5 lg:shrink-0">
			{#if about.photo}
				<figure class="m-0">
					{#if photoEnhanced}
						<enhanced:img
							src={photoEnhanced}
							alt="Rhea Pradeep"
							fetchpriority="high"
							class="aspect-[3/4] w-full object-cover"
						/>
					{:else}
						<img
							src={images[about.photo] || about.photo}
							alt="Rhea Pradeep"
							width="1200"
							height="1600"
							fetchpriority="high"
							class="aspect-[3/4] w-full object-cover"
						/>
					{/if}
					{#if about.photo_caption}
						<figcaption
							class="mt-3 font-sans text-[13px] text-muted-foreground italic md:text-[14px]"
						>
							{about.photo_caption}
						</figcaption>
					{/if}
				</figure>
			{:else}
				<div class="flex aspect-[3/4] w-full items-center justify-center bg-muted">
					<span class="text-muted-foreground">Photo</span>
				</div>
			{/if}

			{#if about.resume}
				<a
					href={about.resume}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Resume"
					class="mt-10 block w-[240px] max-w-full transition-transform hover:scale-[1.03]"
				>
					<img src={resumeIcon} alt="Resume" class="h-auto w-full" />
				</a>
			{/if}

			{#if socialLinks.length}
				<div class="mt-8 flex justify-start gap-4">
					{#each socialLinks as s (s.key)}
						{#if s.href.startsWith('mailto:')}
							<EmailLink
								email={s.href.slice('mailto:'.length)}
								label={s.label}
								side="top"
								class="block h-[52px] w-[52px] transition-transform hover:scale-110"
							>
								<img src={s.icon} alt={s.label} class="h-full w-full object-contain" />
							</EmailLink>
						{:else}
							<a
								href={s.href}
								aria-label={s.label}
								target="_blank"
								rel="noopener noreferrer"
								class="block h-[52px] w-[52px] transition-transform hover:scale-110"
							>
								<img src={s.icon} alt={s.label} class="h-full w-full object-contain" />
							</a>
						{/if}
					{/each}
				</div>
			{/if}
		</div>

		<!-- Right: bio content -->
		<div class="max-w-3xl min-w-0 flex-1">
			{#if Bio}
				<div
					bind:this={proseEl}
					class="about-prose font-sans text-[15px] leading-[1.65] font-normal md:text-[17px]"
				>
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

<style>
	.about-prose :global(h2) {
		color: var(--primary);
		font-size: 1.25rem;
		font-weight: 400;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.about-prose :global(h2:first-child) {
		margin-top: 0;
	}

	.about-prose :global(p) {
		margin-bottom: 1.25rem;
	}

	.about-prose :global(a) {
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.about-prose :global(a:hover) {
		opacity: 0.7;
	}
</style>
