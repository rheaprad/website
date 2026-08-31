<!--
	Reusable SEO head component. Drop <Seo … /> into any page.

	It emits <title>, description, canonical, Open Graph, Twitter Card and
	schema.org JSON-LD. Everything falls back to the site defaults in
	$lib/seo/config, so a bare <Seo /> is already sensible; pass props (usually
	from CMS frontmatter) to override per page/content.

	Image note: pass an already-resolved URL (http(s) or a built asset path like
	/_app/…). Raw CMS content paths (/src/lib/content/…) won't resolve publicly —
	resolve them in the page's load via its images map first.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/seo/config';

	interface Props {
		/** Page/content title. Appended with the site name; omit for the site default. */
		title?: string;
		description?: string;
		/** Resolved image URL. Falls back to the site share card. */
		image?: string;
		/** Content kind — drives OG type + which JSON-LD schema is emitted. */
		type?: 'website' | 'article' | 'profile';
		/** Absolute canonical URL. Defaults to the site origin + current path. */
		canonical?: string;
		keywords?: string | string[];
		author?: string;
		/** ISO or date-like string; emitted for articles. */
		published?: string;
		modified?: string;
		tags?: string[];
		noindex?: boolean;
		/** Escape hatch: supply a fully-formed JSON-LD object to replace the default. */
		jsonLd?: Record<string, unknown>;
	}

	let {
		title = '',
		description = '',
		image = '',
		type = 'website',
		canonical = '',
		keywords = '',
		author = site.author,
		published = '',
		modified = '',
		tags = [],
		noindex = false,
		jsonLd
	}: Props = $props();

	const fullTitle = $derived(title ? `${title} | ${site.name}` : `${site.name} · ${site.tagline}`);
	const metaDescription = $derived(description || site.description);
	const path = $derived(page.url?.pathname ?? '/');
	const canonicalUrl = $derived(canonical || `${site.url}${path}`);

	const absImage = $derived.by(() => {
		const img = image || site.defaultImage;
		if (/^https?:\/\//.test(img)) return img;
		return `${site.url}${img.startsWith('/') ? '' : '/'}${img}`;
	});

	const metaKeywords = $derived(
		(Array.isArray(keywords) ? keywords.filter(Boolean).join(', ') : keywords) ||
			site.keywords.join(', ')
	);

	const toIso = (d: string) => {
		if (!d) return '';
		const t = new Date(d);
		return Number.isNaN(t.getTime()) ? '' : t.toISOString();
	};
	const publishedIso = $derived(toIso(published));
	const modifiedIso = $derived(toIso(modified));

	const structured = $derived.by(() => {
		if (jsonLd) return jsonLd;

		if (type === 'article') {
			return {
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: title || site.name,
				description: metaDescription,
				url: canonicalUrl,
				image: absImage,
				author: { '@type': 'Person', name: author, url: site.url },
				publisher: { '@type': 'Person', name: site.name, url: site.url },
				...(publishedIso && { datePublished: publishedIso }),
				...(modifiedIso && { dateModified: modifiedIso }),
				...(tags.length && { keywords: tags.join(', ') }),
				mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl }
			};
		}

		if (type === 'profile') {
			return {
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: site.name,
				url: site.url,
				image: absImage,
				description: metaDescription,
				jobTitle: site.tagline,
				sameAs: site.sameAs
			};
		}

		return {
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: site.name,
			url: site.url,
			description: metaDescription
		};
	});

	// JSON-LD, with the closing tag escaped so it can't terminate the block early.
	const jsonLdScript = $derived(
		`<script type="application/ld+json">${JSON.stringify(structured)}<\/script>`
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={metaDescription} />
	<meta name="author" content={author} />
	<meta name="keywords" content={metaKeywords} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={absImage} />
	<meta property="og:locale" content={site.locale} />
	{#if type === 'article'}
		{#if publishedIso}
			<meta property="article:published_time" content={publishedIso} />
		{/if}
		{#if modifiedIso}
			<meta property="article:modified_time" content={modifiedIso} />
		{/if}
		<meta property="article:author" content={author} />
		{#each tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={absImage} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdScript}
</svelte:head>
