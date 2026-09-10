<script lang="ts">
	import { base } from '$app/paths';
	import EmailLink from '$lib/components/EmailLink.svelte';


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
</script>

<footer class="mt-16 bg-primary text-primary-foreground">
	<div class="mx-auto max-w-[1100px] px-6 py-12 md:px-10 md:pt-16 lg:px-16">
		<div class="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
			{#each columns as col (col.heading)}
				<nav aria-label={col.heading}>
					<h2 class="font-display text-[14px] font-semibold tracking-[0.09em] uppercase opacity-80">
						{col.heading}
					</h2>
					<ul class="mt-4 space-y-2.5">
						{#each col.links as link (link.href)}
							<li>
								<a
									href={link.href}
									class="text-[15px] underline-offset-3 hover:underline"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			{/each}
			<nav aria-label="Elsewhere">
				<h2 class="font-display text-[14px] font-semibold tracking-[0.09em] uppercase opacity-80">
					Elsewhere
				</h2>
				<ul class="mt-4 space-y-2.5">
					{#each elsewhere as s (s.href)}
						<li>
							<a
								href={s.href}
								target="_blank"
								rel="noopener noreferrer me"
								class="text-[15px] underline-offset-3 hover:underline"
							>
								{s.label}
							</a>
						</li>
					{/each}
					<li>
						<EmailLink
							email="hello@rheapradeep.com"
							label="Email"
							side="top"
							class="text-[15px] underline-offset-3 hover:underline"
						>
							Email
						</EmailLink>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</footer>
