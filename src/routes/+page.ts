import { getAllWork, getHome, getNow, getPosts, getRecently, getWork } from '$lib/content';
import type { WorkItem } from '$lib/content';
import { formatMonth } from '$lib/format';
import type { PageLoad } from './$types';

/** How many pieces the selected-work shelf holds before "all work" takes over. */
const SHELF_SIZE = 9;
/** How far back the combined feed reaches on the homepage. */
const FEED_SIZE = 6;

export const load: PageLoad = () => {
	const home = getHome();
	const work = getAllWork();
	const posts = getPosts();
	const latestNote = getPosts('note')[0];
	const latestEssay = getPosts('essay')[0];

	// The CMS's two picks lead the shelf; the rest of it is simply the newest
	// work, minus whatever the picks already used up.
	const picked = new Set(home.featured.map((w) => w.slug));
	const shelf = [...home.featured, ...work.filter((w) => !picked.has(w.slug))].slice(0, SHELF_SIZE);

	// One feed, not two columns: a new drawing and a new essay are both just the
	// next thing she made, and standing them in separate boxes made the page
	// argue with itself about which mattered more.
	const feed = getRecently(FEED_SIZE);

	const of = (type: WorkItem['type']) => work.filter((w) => w.type === type);
	const now = getNow();

	return {
		strip: home.strip,
		shelf,
		feed,
		// Entry points into the rest of the site, each fronted by a real piece
		// rather than an icon, so the picture does the labelling and the line
		// underneath only says what kind of thing you're about to open.
		doors: [
			{ href: '/books/', label: 'books', note: 'bound & folded', thumb: of('book')[0]?.cover },
			{
				href: '/tags/comic/',
				label: 'comics',
				note: 'panels & pages',
				thumb: of('comic')[0]?.cover
			},
			{
				href: '/tags/illustration/',
				label: 'illustrations',
				note: 'single images',
				thumb: of('illustration')[0]?.cover
			},
			{
				href: '/blog/',
				label: 'the blog',
				note: 'notes & essays',
				thumb:
					(latestEssay ?? latestNote)?.image ?? posts.find((p) => p.image)?.image ?? home.strip[0]
			},
			{ href: '/about/', label: 'about', note: 'who I am', thumb: home.strip[1] },
			{
				href: '/now/',
				label: 'now',
				note: now?.updated ? `since ${formatMonth(now.updated)}` : "what I'm on",
				thumb: home.strip[2]
			}
		].filter((d): d is { href: string; label: string; note: string; thumb: string } => !!d.thumb)
	};
};
