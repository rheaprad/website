<script lang="ts">
	import portrait from '$lib/content/home-page/portrait_r.webp';
	import * as Popover from '$lib/components/ui/popover';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { navState } from '$lib/nav.svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';

	// Pages (e.g. work details) can make the header a transparent overlay.
	// SSR reads page.data.nav; the client refines via the navState store.
	const transparentNav = $derived(navState.transparent || !!page.data?.nav?.transparent);

	// Scroll-direction reveal: on overlay pages the header rides the hero at the
	// top, slips away as you read down, and fades back in the moment you scroll up.
	let scrollY = $state(0);
	let lastY = 0;
	let scrolledUp = $state(false);
	const atTop = $derived(scrollY < 80);
	const showHeader = $derived(!transparentNav || atTop || scrolledUp);

	$effect(() => {
		const y = scrollY;
		// A few px of slack so trackpad jitter doesn't flicker the header.
		if (y < lastY - 4) scrolledUp = true;
		else if (y > lastY + 4) scrolledUp = false;
		lastY = y;
	});

	// Overlay styling only applies while we're still over the hero; once the
	// header re-enters on scroll-up it wears its normal solid look.
	const overlay = $derived(transparentNav && atTop);
	const navDark = $derived(
		overlay && (navState.transparent ? navState.text : (page.data?.nav?.text ?? 'light')) === 'dark'
	);
	const navTextClass = $derived(navDark ? 'text-gray-900' : 'text-white');
	const barBg = $derived(overlay ? (navDark ? 'bg-gray-900' : 'bg-white') : 'bg-foreground');

	let mobileOpen = $state(false);

	// The homepage masthead already introduces her; don't repeat it in the header.
	const isHome = $derived(page.url.pathname === `${base}/`);

	const navLinks = [
		{ href: `${base}/`, label: 'Home' },
		{ href: `${base}/work/`, label: 'Work' },
		{ href: `${base}/books/`, label: 'Books' },
		{ href: `${base}/blog/`, label: 'Blog' },
		{ href: `${base}/about/`, label: 'About' },
		{ href: `${base}/now/`, label: 'Now' }
	];

	// `startsWith` alone would match every path against the "/" home link.
	const isActive = (href: string) =>
		href === `${base}/`
			? page.url.pathname === href
			: page.url.pathname === href || page.url.pathname.startsWith(href);
</script>

<svelte:window bind:scrollY />

{#if showHeader}
	<header
		transition:fly={{ y: -64, duration: prefersReducedMotion.current ? 0 : 300, easing: cubicOut }}
		class="z-50 flex h-16 items-center px-6 transition-[background-color,box-shadow] duration-300
		       ease-out md:px-10 lg:px-16
		       {transparentNav ? 'fixed inset-x-0 top-0' : 'sticky top-0'}
		       {overlay
			? 'bg-transparent'
			: 'bg-background/95 shadow-[0_1px_8px_rgb(0_0_0/0.06)] backdrop-blur-sm'}"
	>
		{#if !isHome}
			<a href="{base}/" class="flex flex-shrink-0 items-center gap-3">
				<img class="h-8 w-8 rounded-full object-cover" src={portrait} alt="" />
				<span
					class="font-display text-[17px] font-semibold
				       {overlay ? navTextClass : 'text-foreground'}"
				>
					Rhea Pradeep
				</span>
			</a>
		{/if}

		<!-- Desktop nav -->
		<nav class="ml-auto hidden items-center gap-3 text-[15px] md:flex">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					class="rounded-full px-3 py-1 transition-colors
				       {overlay
						? `${navTextClass} hover:opacity-70`
						: isActive(link.href)
							? 'tactile bg-primary font-medium text-primary-foreground'
							: 'text-foreground hover:bg-primary/10 hover:text-primary'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- Mobile hamburger -->
		<div class="ml-auto flex md:hidden">
			<Popover.Root bind:open={mobileOpen}>
				<Popover.Trigger>
					{#snippet child({ props })}
						<button
							{...props}
							class="flex touch-manipulation items-center gap-2.5
						       {overlay ? navTextClass : 'text-foreground'}"
							aria-label="Toggle menu"
						>
							<div class="relative flex h-6 w-5 items-center justify-center">
								<div class="relative size-5">
									<span
										class="absolute start-0 block h-0.5 w-5 {barBg} transition-all duration-100
									       {mobileOpen ? 'top-[0.5rem] -rotate-45' : 'top-1'}"
									></span>
									<span
										class="absolute start-0 block h-0.5 w-5 {barBg} transition-all duration-100
									       {mobileOpen ? 'top-[0.5rem] rotate-45' : 'top-3'}"
									></span>
								</div>
							</div>
						</button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content
					class="mt-4 w-(--bits-popover-content-available-width) rounded-none border-x-0
				       border-t-0 border-b border-border bg-background p-0 shadow-none"
					align="end"
					side="bottom"
					sideOffset={0}
				>
					<nav class="flex flex-col gap-6 px-6 py-8 text-right">
						{#each navLinks as link (link.href)}
							<a
								href={link.href}
								onclick={() => {
									mobileOpen = false;
								}}
								class="font-display text-[22px] font-medium
							       {isActive(link.href) ? 'text-primary' : 'text-foreground'}"
							>
								{link.label}
							</a>
						{/each}
					</nav>
				</Popover.Content>
			</Popover.Root>
		</div>
	</header>
{/if}
