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
const images = import.meta.glob('/src/lib/content/**/*.{jpg,jpeg,png,webp}', {
	query: '?url',
	import: 'default',
	eager: true
}) as Record<string, string>;

export function resolveImage(path: string): string {
	if (!path) return '';
	return images[path] ?? path;
}

const slugOf = (path: string) => path.split('/').pop()?.replace('.md', '') ?? '';

function toWorkItem(path: string, mod: any): WorkItem {
	const meta = mod.metadata ?? {};
	const type: WorkType = meta.type ?? 'illustration';
	const fmTags: string[] = Array.isArray(meta.tags) ? meta.tags : [];
	const cover = resolveImage(meta.cover_image ?? '');
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
