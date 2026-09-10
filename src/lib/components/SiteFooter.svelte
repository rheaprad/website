<script lang="ts">

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { base } from '$app/paths';
	import EmailLink from '$lib/components/EmailLink.svelte';
	import { Button } from '$lib/components/ui/button';

	const columns = [
		{
			heading: 'Index',
			links: [
				{ href: `${base}/work/`, label: 'All work' },
				{ href: `${base}/books/`, label: 'Books' },
				{ href: `${base}/tags/comic/`, label: 'Comics' },
				{ href: `${base}/tags/illustration/`, label: 'Illustrations' },
				{ href: `${base}/tags/`, label: 'All tags' }
			]
		},
		{
			heading: 'Writing',
			links: [
				{ href: `${base}/blog/`, label: 'Blog' },
				{ href: `${base}/now/`, label: 'Now' },
				{ href: `${base}/rss.xml`, label: 'RSS' }
			]
		}
	];

	const elsewhere = [
		{ href: 'https://www.instagram.com/rhepository/', label: 'Instagram' },
		{ href: 'https://linkedin.com/in/rheapradeep', label: 'LinkedIn' },
		{ href: 'https://bsky.app/profile/rheapradeep.com', label: 'Bluesky' },
		{ href: 'https://www.behance.net/rheapradeep', label: 'Behance' }
	];

	type SignOff = { text: string; link?: { label: string; href: string } };
	const signOffs: SignOff[] = [
		{ text: 'Thanks for coming this far down the page.' },
		{ text: 'Treat people with kindness.' },
		{ text: 'Not currently managing a Cinnabon in Omaha.' },
		{ text: 'No half measures.' },
		{ text: "You've reached the long and winding bottom of the page." },

	];
	let signOff = $state(signOffs[0]);
	onMount(() => {
		signOff = signOffs[Math.floor(Math.random() * signOffs.length)];
	});

	const year = new Date().getFullYear();

	const linkClass =
		'text-[14px] underline-offset-4 transition-colors hover:text-primary hover:underline';
	const headingClass = 'text-[10px] font-medium  uppercase text-muted-foreground';

	// Sending the reader back up is a nicety, not a destination, so it stays a
	// button and honours a request for less motion.
	function toTop() {
		const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
	}
</script>

<footer class="mt-16">
	<svg
		class="block h-5 w-full fill-primary md:h-7"
		viewBox="0 0 1440 40"
		preserveAspectRatio="none"
		aria-hidden="true"
	>
		<path
			d="M0 40V21c40-8 90 5 140-1 60-7 100 10 160 4 55-6 90-16 150-9 60 7 95 17 160 12 60-5
			   90-17 150-13 60 4 100 16 160 12 60-4 95-15 155-10 60 5 95 15 155 9 60-6 100-16 160-10
			   26 3 41 6 50 5v20z"
		/>
	</svg>

	<div class="bg-primary text-primary-foreground">
		<div class="mx-auto max-w-[1100px] px-6 pt-6 pb-7 md:px-10 md:pt-7 md:pb-8 lg:px-16">
			<div
				class="rounded-lg border border-foreground/15 bg-background px-5 py-6 text-foreground
				       md:px-8 md:py-7"
			>
				<div class="grid grid-cols-2 gap-x-8 gap-y-7 md:grid-cols-[1.1fr_auto_auto_auto]">
					<div class="col-span-2 md:col-span-1">
						<p class="font-display text-[17px] font-semibold">Rhea Pradeep</p>
						{#key signOff}
							<p
								in:fade={{ duration: prefersReducedMotion.current ? 0 : 300 }}
								class="mt-1.5 max-w-[28ch] text-[13.5px] leading-[1.5] text-muted-foreground"
							>
								{signOff.text}
								{#if signOff.link}
									<a
										href={signOff.link.href}
										class="underline underline-offset-4 transition-colors hover:text-primary"
									>
										{signOff.link.label}</a
									>.
								{/if}
							</p>
						{/key}

						<p class="mt-4 {headingClass}">Say hello</p>
						<EmailLink
							email="hello@rheapradeep.com"
							label="Email"
							side="top"
							class="mt-1 inline-block font-display text-[15px] font-semibold underline-offset-4
							       transition-colors hover:text-primary hover:underline"
						>
							hello@rheapradeep.com
						</EmailLink>
					</div>

					{#each columns as col (col.heading)}
						<nav aria-label={col.heading}>
							<h2 class={headingClass}>{col.heading}</h2>
							<ul class="mt-3 space-y-2">
								{#each col.links as link (link.href)}
									<li><a href={link.href} class={linkClass}>{link.label}</a></li>
								{/each}
							</ul>
						</nav>
					{/each}

					<nav aria-label="Elsewhere">
						<h2 class={headingClass}>Elsewhere</h2>
						<ul class="mt-3 space-y-2">
							{#each elsewhere as s (s.href)}
								<li>
									<a href={s.href} target="_blank" rel="noopener noreferrer me" class={linkClass}>
										{s.label}
									</a>
								</li>
							{/each}
						</ul>
					</nav>
				</div>
			</div>

			<div
				class="mt-4 flex flex-col-reverse items-center gap-3 text-[11px]
				       sm:flex-row sm:justify-between"
			>
				<p class="opacity-80">© {year} Rhea Pradeep</p>
				<Button
					variant="outline"
					size="sm"
					onclick={toTop}
					class="h-7 rounded-full border-transparent px-4 text-[10px] font-medium
					        text-foreground uppercase"
				>
					Back to top
				</Button>
			</div>
		</div>
	</div>
</footer>
