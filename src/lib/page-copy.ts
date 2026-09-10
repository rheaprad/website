/**
 * Titles, subtitles and meta descriptions for the index pages, merged from
 * `settings/pages.json` (CMS-owned) over the defaults below. Imported straight
 * into each `+page.svelte` rather than routed through a load function: it's a
 * build-time constant, and putting it in `data` would inflate every prerendered
 * `__data.json` for nothing.
 */
import raw from '$lib/content/settings/pages.json';

export type PageKey =
	| 'work'
	| 'books'
	| 'blog'
	| 'notes'
	| 'logs'
	| 'essays'
	| 'tags'
	| 'log'
	| 'now'
	| 'about';

export interface PageCopy {
	title: string;
	sub: string;
	description: string;
}

const DEFAULTS: Record<PageKey, PageCopy> = {
	work: {
		title: 'Work',
		sub: '',
		description: "The complete catalog of Rhea Pradeep's books, comics and illustrations."
	},
	books: {
		title: 'Books',
		sub: '',
		description: 'Picture books, graphic novels and artist books by Rhea Pradeep.'
	},
	blog: {
		title: 'Blog',
		sub: '',
		description: 'Notes, process logs and essays by Rhea Pradeep.'
	},
	notes: {
		title: 'Notes',
		sub: '',
		description: 'Short sketchbook notes by Rhea Pradeep.'
	},
	logs: {
		title: 'Process logs',
		sub: '',
		description: "Work-in-progress diaries for Rhea Pradeep's projects."
	},
	essays: {
		title: 'Essays',
		sub: '',
		description: 'Long-form writing by Rhea Pradeep.'
	},
	tags: {
		title: 'Tags',
		sub: '',
		description: "Rhea Pradeep's work, indexed by tag."
	},
	log: {
		title: 'Site log',
		sub: 'Everything added or updated, newest first',
		description: 'Everything added to or updated on rheapradeep.com, in order.'
	},
	now: {
		title: 'Now',
		sub: '',
		description: 'What Rhea Pradeep is working on right now.'
	},
	about: {
		title: 'About',
		sub: '',
		description:
			'About Rhea Pradeep, an Indian illustrator and visual artist working across comics, ' +
			'picture books and bookmaking.'
	}
};

const str = (v: unknown, fallback: string): string =>
	typeof v === 'string' && v.trim() ? v.trim() : fallback;

const authored = raw as Record<string, Partial<Record<keyof PageCopy, unknown>> | undefined>;

export const pages = Object.fromEntries(
	(Object.keys(DEFAULTS) as PageKey[]).map((key) => {
		const d = DEFAULTS[key];
		const a = authored[key] ?? {};
		return [
			key,
			{
				title: str(a.title, d.title),
				sub: str(a.sub, d.sub),
				description: str(a.description, d.description)
			}
		];
	})
) as Record<PageKey, PageCopy>;
