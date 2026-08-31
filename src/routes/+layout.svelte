<script lang="ts">
	import './layout.css';
	import portrait from '$lib/content/home-page/portrait_r.webp';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<!-- Favicon uses the portrait logo for now; a dedicated icon can replace it later. -->
	<link rel="icon" href={portrait} />
	<link rel="apple-touch-icon" href={portrait} />
</svelte:head>

<SiteHeader />

<main class="flex-1">
	{@render children()}
</main>

<SiteFooter />
