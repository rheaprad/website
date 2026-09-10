<script lang="ts">
	import { base } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SectionHead from '$lib/components/SectionHead.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';
	import { pages } from '$lib/page-copy';

	const copy = pages.now;

	const { data }: { data: PageData } = $props();
	const { now } = $derived(data);
</script>

<Seo title={copy.title} description={copy.description} />

<!-- A page with one thing to say, so it is set like the blog: the same measure,
	 the same margins, the balloon title every other page wears. The date is the
	 point of a now page, so it is marked up as one rather than left as loose
	 text, and the note itself sits under a section head like every other run of
	 content on the site. -->
<article class="h-entry mx-auto max-w-[720px] px-6 pt-10 pb-16 md:px-10 md:pt-14 md:pb-20">
	<span class="p-author h-card hidden">
		<a class="u-url p-name" href="{base}/about/">Rhea Pradeep</a>
	</span>

	<header>
		<PageHeader title="Now" variant="whisper" />
		<!-- The header's own `sub` slot would set this, but a now page's date is
		     worth marking as a date; the setting is the one `sub` uses, with a
		     little more clearance under the balloon's tail. -->
		<p class="mt-10 ml-[0.5em] type-meta">
			Updated
			<time class="dt-updated" datetime={now.updated}>{formatDate(now.updated)}</time>
		</p>
	</header>

	<section class="mt-12 md:mt-16">
		<SectionHead text="what I'm on" />
		<div class="e-content prose mt-5 md:mt-6">
			<now.component />
		</div>
	</section>

	<!-- Where to go next, in the same hand the home page uses to send a reader
	     on to the catalog. -->
	<nav class="mt-14 flex flex-wrap items-center gap-x-7 gap-y-3 md:mt-16" aria-label="Read on">
		<a
			href="{base}/blog/"
			class="inline-flex items-center gap-1.5 font-display text-[15px] font-semibold underline-offset-4 hover:underline md:text-base"
		>
			process logs & notes
			<HugeiconsIcon icon={ArrowRight02Icon} size={18} aria-hidden="true" />
		</a>
		<a
			href="{base}/work/"
			class="inline-flex items-center gap-1.5 font-display text-[15px] font-semibold underline-offset-4 hover:underline md:text-base"
		>
			all work
			<HugeiconsIcon icon={ArrowRight02Icon} size={18} aria-hidden="true" />
		</a>
	</nav>
</article>
