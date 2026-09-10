<script lang="ts">
	import './layout.css';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	// The three faces that carry every page title and caption. They are referenced
	// from CSS, so Vite hashes them and the browser only discovers them after the
	// stylesheet parses — by which time first paint has already happened in a
	// fallback. Importing the URLs lets us preload them in the document head.
	import clauthboundBold from '$lib/fonts/Clauthbound-Bold.woff2?url';
	import clauthboundSemibold from '$lib/fonts/Clauthbound-Semibold.woff2?url';
	import scorekardRegular from '$lib/fonts/Scorekard-Regular.woff2?url';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preload" as="font" type="font/woff2" href={clauthboundBold} crossorigin="anonymous" />
	<link
		rel="preload"
		as="font"
		type="font/woff2"
		href={clauthboundSemibold}
		crossorigin="anonymous"
	/>
	<link rel="preload" as="font" type="font/woff2" href={scorekardRegular} crossorigin="anonymous" />
</svelte:head>

<SiteHeader />

<main class="flex-1">
	{@render children()}
</main>

<SiteFooter />
