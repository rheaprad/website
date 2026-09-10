/**
 * Single source of truth for all site content. Every route's load function
 * pulls from here instead of running its own import.meta.glob — the globs are
 * evaluated once at build time (fully prerendered site, so this costs nothing
 * at runtime).
 */
import type { Component } from 'svelte';
import type { SeoOverrides } from '$lib/seo/config';

export type WorkType = 'book' | 'comic' | 'illustration';
export type PostKind = 'note' | 'log' | 'essay';

export interface GalleryItem {
	src: string;
	caption: string;
}

/**
 * What the cover looks like, in three numbers, measured at build time by
 * `scripts/extract-book-colors.mjs`. BookCard turns these into the backdrop a
 * book is staged against: `hue` says which colour the book is, `chroma` how
 * much of that colour to admit, `light` how light the cover is, so the
 * backdrop can move away from it and keep the object legible. Deliberately not
 * a finished colour — lightness and chroma bands live in the card's CSS, which
 * is what keeps ten unrelated books reading as one set.
 */
export interface PlateReading {
	/** OKLCH hue in degrees, 0-360. */
	hue: number;
	/** 0-1: how colourful the cover is overall (greyscale work lands near 0.2). */
	chroma: number;
	/** 0-1: mean luminance of the cover. */
	light: number;
}

export interface WorkItem {
	slug: string;
	type: WorkType;
	title: string;
	date: string;
	updated?: string;
	year: number;
	/** Implicit type tag first, then frontmatter tags — deduped. */
	tags: string[];
	medium?: string;
	dimensions?: string;
	pages?: string;
	caption?: string;
	cover: string;
	/** Intrinsic cover aspect ratio (w/h), baked at build time. Drives the
	 *  aspect-aware gallery grid so artwork is never cropped. */
	ratio: number;
	/** Curatorial emphasis: promote a piece to a larger cell in the grid. */
	feature: boolean;
	/** Cover-derived backdrop reading; see PlateReading. */
	plate: PlateReading;
	/** Responsive `?enhanced` form of the cover, when one could be generated. */
	coverEnhanced?: unknown;
	/** Resolved hero_image, falling back to the cover. */
	hero: string;
	gallery: GalleryItem[];
	related: string[];
	titleColor?: string;
	navText: 'light' | 'dark';
	component: Component;
	seo: SeoOverrides;
}

export interface Post {
	slug: string;
	kind: PostKind;
	title?: string;
	date: string;
	updated?: string;
	description?: string;
	image?: string;
	project?: string;
	tags: string[];
	component: Component;
	seo: SeoOverrides;
}

export interface RecentEntry {
	date: string;
	action: 'added' | 'updated';
	kind: WorkType | PostKind;
	title: string;
	href: string;
	thumb?: string;
}

const workModules = import.meta.glob('/src/lib/content/art-page/*/*.md', { eager: true }) as Record<
	string,
	any
>;
const postModules = import.meta.glob('/src/lib/content/blog-page/*.md', { eager: true }) as Record<
	string,
	any
>;
const nowModules = import.meta.glob('/src/lib/content/now-page/*.md', { eager: true }) as Record<
	string,
	any
>;
const homeModules = import.meta.glob('/src/lib/content/home-page/*.md', { eager: true }) as Record<
	string,
	any
>;
const images = import.meta.glob('/src/lib/content/**/*.{jpg,jpeg,png,webp}', {
	query: '?url',
	import: 'default',
	eager: true
}) as Record<string, string>;

// Covers alone also get a responsive `?enhanced` form: they're the one image
// shown many-to-a-page, and the originals are 3-4 megapixel camera files.
// Keyed by the raw frontmatter path, not the resolved URL.
const enhancedCovers = import.meta.glob('/src/lib/content/art-page/**/cover.{jpg,jpeg,png,webp}', {
	query: '?enhanced',
	import: 'default',
	eager: true
}) as Record<string, unknown>;

export function resolveImage(path: string): string {
	if (!path) return '';
	return images[path] ?? path;
}

const slugOf = (path: string) => path.split('/').pop()?.replace('.md', '') ?? '';

const num = (v: unknown, fallback: number) => (Number.isFinite(Number(v)) ? Number(v) : fallback);

function toWorkItem(path: string, mod: any): WorkItem {
	const meta = mod.metadata ?? {};
	const type: WorkType = meta.type ?? 'illustration';
	const fmTags: string[] = Array.isArray(meta.tags) ? meta.tags : [];
	const coverPath: string = meta.cover_image ?? '';
	const cover = resolveImage(coverPath);
	const manualNav: 'light' | 'dark' | null =
		meta.nav_theme === 'Light text' ? 'light' : meta.nav_theme === 'Dark text' ? 'dark' : null;
	return {
		slug: slugOf(path),
		type,
		title: meta.title ?? '',
		date: meta.date ?? '',
		updated: meta.updated,
		year: new Date(meta.date ?? 0).getFullYear(),
		tags: [type, ...fmTags.filter((t) => t !== type)],
		medium: meta.medium || undefined,
		dimensions: meta.dimensions || undefined,
		pages: meta.pages || undefined,
		caption: meta.caption || undefined,
		cover,
		ratio: Number(meta.cover_ratio ?? meta.cover_ratio_auto) || 0.8,
		feature: meta.feature === true,
		plate: {
			// Neutral warm mid-tone when a piece hasn't been analysed yet.
			hue: num(meta.shelf_hue_auto, 70),
			chroma: num(meta.shelf_chroma_auto, 0.3),
			light: num(meta.cover_light_auto, 0.6)
		},
		coverEnhanced: enhancedCovers[coverPath],
		hero: resolveImage(meta.hero_image ?? '') || cover,
		gallery: (Array.isArray(meta.gallery) ? meta.gallery : []).map((g: any) =>
			typeof g === 'string'
				? { src: resolveImage(g), caption: '' }
				: { src: resolveImage(g.image ?? ''), caption: g.caption ?? '' }
		),
		related: Array.isArray(meta.related) ? meta.related : [],
		titleColor: meta.title_color || meta.title_color_auto || undefined,
		navText: manualNav ?? meta.nav_text_auto ?? 'light',
		component: mod.default,
		seo: meta.seo ?? {}
	};
}

function toPost(path: string, mod: any): Post {
	const meta = mod.metadata ?? {};
	return {
		slug: slugOf(path),
		kind: meta.kind ?? 'note',
		title: meta.title || undefined,
		date: meta.date ?? '',
		updated: meta.updated,
		description: meta.description || undefined,
		image: meta.image ? resolveImage(meta.image) : undefined,
		project: meta.project || undefined,
		tags: Array.isArray(meta.tags) ? meta.tags : [],
		component: mod.default,
		seo: meta.seo ?? {}
	};
}

const byDateDesc = (a: { date: string; title?: string }, b: { date: string; title?: string }) =>
	new Date(b.date).getTime() - new Date(a.date).getTime() ||
	(a.title ?? '').localeCompare(b.title ?? '');

const allWork: WorkItem[] = Object.entries(workModules)
	.filter(([path]) => {
		const s = slugOf(path);
		return s && !s.startsWith('.');
	})
	.map(([path, mod]) => toWorkItem(path, mod))
	.sort(byDateDesc);

const allPosts: Post[] = Object.entries(postModules)
	.filter(([path]) => {
		const s = slugOf(path);
		return s && !s.startsWith('.');
	})
	.map(([path, mod]) => toPost(path, mod))
	.sort(byDateDesc);

export function getAllWork(): WorkItem[] {
	return allWork;
}

export function getWork(slug: string): WorkItem | undefined {
	return allWork.find((w) => w.slug === slug);
}

export function getAllPosts(): Post[] {
	return allPosts;
}

export function getPosts(kind?: PostKind): Post[] {
	return kind ? allPosts.filter((p) => p.kind === kind) : allPosts;
}

export function getPost(slug: string): Post | undefined {
	return allPosts.find((p) => p.slug === slug);
}

/** Process-log entries for a work, oldest first (a diary reads forward). */
export function getLogsForProject(slug: string): Post[] {
	return allPosts
		.filter((p) => p.kind === 'log' && p.project === slug)
		.slice()
		.reverse();
}

export function getPostsForProject(slug: string): Post[] {
	return allPosts.filter((p) => p.project === slug);
}

export interface TagEntry {
	tag: string;
	count: number;
	items: WorkItem[];
}

export function getTagIndex(): TagEntry[] {
	const map = new Map<string, WorkItem[]>();
	for (const item of allWork) {
		for (const tag of item.tags) {
			const list = map.get(tag) ?? [];
			list.push(item);
			map.set(tag, list);
		}
	}
	return [...map.entries()]
		.map(([tag, items]) => ({ tag, count: items.length, items }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getTag(tag: string): TagEntry | undefined {
	return getTagIndex().find((t) => t.tag === tag);
}

export interface YearGroup {
	year: number;
	items: WorkItem[];
}

export function getYearGroups(items: WorkItem[]): YearGroup[] {
	const map = new Map<number, WorkItem[]>();
	for (const item of items) {
		const list = map.get(item.year) ?? [];
		list.push(item);
		map.set(item.year, list);
	}
	return [...map.entries()]
		.map(([year, list]) => ({ year, items: list }))
		.sort((a, b) => b.year - a.year);
}

/** Explicit `related` slugs first, then shared-tag matches, then recency. */
export function getRelated(item: WorkItem, n = 3): WorkItem[] {
	const picked: WorkItem[] = [];
	const seen = new Set<string>([item.slug]);
	const push = (w: WorkItem | undefined) => {
		if (w && !seen.has(w.slug) && picked.length < n) {
			picked.push(w);
			seen.add(w.slug);
		}
	};
	for (const slug of item.related) push(getWork(slug));
	if (picked.length < n) {
		const specific = new Set(item.tags.slice(1));
		for (const w of allWork) if (w.tags.some((t) => specific.has(t))) push(w);
	}
	for (const w of allWork) push(w);
	return picked;
}

export function getAdjacent(slug: string): { prev?: WorkItem; next?: WorkItem } {
	const i = allWork.findIndex((w) => w.slug === slug);
	if (i === -1) return {};
	return { prev: allWork[i - 1], next: allWork[i + 1] };
}

export function getPrevNextPost(slug: string): { prev?: Post; next?: Post } {
	const i = allPosts.findIndex((p) => p.slug === slug);
	if (i === -1) return {};
	return { prev: allPosts[i - 1], next: allPosts[i + 1] };
}

/**
 * The site's pulse: works and posts merged into one reverse-chronological
 * feed. An item appears once for its publish date and once more if it has a
 * later `updated` date.
 */
export function getRecently(limit?: number): RecentEntry[] {
	const entries: RecentEntry[] = [];
	for (const w of allWork) {
		const title = w.title;
		const href = `/work/${w.slug}/`;
		entries.push({ date: w.date, action: 'added', kind: w.type, title, href, thumb: w.cover });
		if (w.updated && new Date(w.updated) > new Date(w.date)) {
			entries.push({ date: w.updated, action: 'updated', kind: w.type, title, href, thumb: w.cover });
		}
	}
	for (const p of allPosts) {
		const project = p.project ? getWork(p.project) : undefined;
		const title = p.title ?? (project ? `${project.title}` : p.description ?? p.kind);
		const href = `/blog/${p.slug}/`;
		entries.push({ date: p.date, action: 'added', kind: p.kind, title, href, thumb: p.image });
		if (p.updated && new Date(p.updated) > new Date(p.date)) {
			entries.push({ date: p.updated, action: 'updated', kind: p.kind, title, href, thumb: p.image });
		}
	}
	entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	return limit ? entries.slice(0, limit) : entries;
}

export interface NowPage {
	updated: string;
	component: Component;
}

export function getNow(): NowPage | undefined {
	const mod = Object.values(nowModules)[0];
	if (!mod) return undefined;
	return { updated: mod.metadata?.updated ?? '', component: mod.default };
}

export interface HomePage {
	/** Work the CMS singled out (featured_book, featured_comic), in that order. */
	featured: WorkItem[];
	/** Authored landing scraps — the ribbon that runs under the masthead. */
	strip: string[];
}

/**
 * Map an authored image path back to the work it belongs to. The CMS names a
 * picture, not a slug, so match on the resolved URL first and fall back to the
 * path's own shape: a book keeps its spreads in a folder named for the work,
 * a single-image piece is named for its own.
 */
function workForImage(path: string): WorkItem | undefined {
	const url = resolveImage(path);
	if (!url) return undefined;
	const byImage = allWork.find(
		(w) => w.cover === url || w.hero === url || w.gallery.some((g) => g.src === url)
	);
	if (byImage) return byImage;
	const parts = path.split('/');
	const stem = parts.pop()?.replace(/\.[^.]+$/, '') ?? '';
	const folder = parts.pop() ?? '';
	return getWork(folder) ?? getWork(stem);
}

export function getHome(): HomePage {
	const meta = (Object.values(homeModules)[0] as any)?.metadata ?? {};
	const featured = [meta.featured_book, meta.featured_comic]
		.filter((p): p is string => typeof p === 'string' && !!p)
		.map(workForImage)
		.filter((w): w is WorkItem => !!w);
	const strip = (Array.isArray(meta.carousel) ? meta.carousel : [])
		.map((c: any) => resolveImage(typeof c === 'string' ? c : (c?.image ?? '')))
		.filter((src: string) => !!src);
	return { featured, strip };
}
