/**
 * Site-wide SEO defaults. `SITE_DEFAULTS` is the fallback of last resort; the
 * live values come from `settings/site.json`, which the CMS owns. Every field
 * is merged through `str`/`list`, so a field the editor blanks out falls back
 * to the default rather than rendering empty.
 */
import raw from '$lib/content/settings/site.json';

const SITE_DEFAULTS = {
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
	email: 'rheapradeep01@gmail.com',
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
	socials: {
		instagram: 'https://www.instagram.com/rhepository/',
		linkedin: 'https://linkedin.com/in/rheapradeep',
		bluesky: 'https://bsky.app/profile/rheapradeep.com',
		behance: 'https://www.behance.net/rheapradeep'
	}
} as const;

/** A CMS string that is missing, null, empty or all-whitespace is no string at all. */
const str = (v: unknown, fallback: string): string =>
	typeof v === 'string' && v.trim() ? v.trim() : fallback;

/** Same, for a list: Sveltia writes `[]` for a cleared list, which must also fall back. */
const list = (v: unknown, fallback: readonly string[]): string[] => {
	if (!Array.isArray(v)) return [...fallback];
	const kept = v
		.filter((s): s is string => typeof s === 'string' && !!s.trim())
		.map((s) => s.trim());
	return kept.length ? kept : [...fallback];
};

const rawSocials = (raw.socials ?? {}) as Record<string, unknown>;
const socials = {
	instagram: str(rawSocials.instagram, SITE_DEFAULTS.socials.instagram),
	linkedin: str(rawSocials.linkedin, SITE_DEFAULTS.socials.linkedin),
	bluesky: str(rawSocials.bluesky, SITE_DEFAULTS.socials.bluesky),
	behance: str(rawSocials.behance, SITE_DEFAULTS.socials.behance)
};

export const site = {
	name: str(raw.name, SITE_DEFAULTS.name),
	author: str(raw.author, SITE_DEFAULTS.author),
	tagline: str(raw.tagline, SITE_DEFAULTS.tagline),
	description: str(raw.description, SITE_DEFAULTS.description),
	defaultImage: str(raw.default_image, SITE_DEFAULTS.defaultImage),
	email: str(raw.contact_email, SITE_DEFAULTS.email),
	keywords: list(raw.keywords, SITE_DEFAULTS.keywords),
	socials,
	/** Profiles for schema.org `sameAs` — derived from `socials`, so there is one list, not three. */
	sameAs: [socials.instagram, socials.linkedin, socials.bluesky, socials.behance].filter(Boolean),
	// Build infrastructure, deliberately not CMS-editable: a typo in either would
	// silently break every canonical URL, OG tag and sitemap entry at once.
	url: SITE_DEFAULTS.url,
	locale: SITE_DEFAULTS.locale
};

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
