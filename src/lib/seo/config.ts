/**
 * Site-wide SEO defaults. These are the fallbacks used by <Seo> whenever a
 * page (or CMS content) doesn't supply its own value. Keep this the single
 * source of truth for the site's identity.
 */
export const site = {
	name: 'Rhea Pradeep',
	/** Canonical production origin — used to build absolute URLs (OG/Twitter/canonical). */
	url: 'https://rheapradeep.com',
	author: 'Rhea Pradeep',
	/** Shown as the browser tab title / OG title when a page has no title of its own. */
	tagline: 'Illustrator & Visual Artist',
	description:
		'I am an Indian illustrator and visual artist working across comics, ' +
		'picture books, character design and bookmaking.',
	/** Default social share image, resolved against `url`. Regenerate via scripts/make-sharecard.mjs. */
	defaultImage: '/sharecard.jpg',
	locale: 'en_US',
	keywords: [
		'Rhea Pradeep',
		'illustrator',
		'visual artist',
		'comics',
		'picture books',
		'graphic novels',
		'character design',
		'bookmaking'
	],
	/** Profiles for schema.org `sameAs` (mirrors the About page socials). */
	sameAs: [
		'https://www.instagram.com/rhepository/',
		'https://linkedin.com/in/rheapradeep',
		'https://bsky.app/profile/rheapradeep.com',
		'https://www.behance.net/rheapradeep'
	]
} as const;

/**
 * Optional SEO overrides authored in the CMS (an `seo` object on any content
 * file's frontmatter). All fields are optional; blanks fall back to defaults.
 */
export type SeoOverrides = {
	title?: string;
	description?: string;
	image?: string;
	keywords?: string;
	noindex?: boolean;
};
