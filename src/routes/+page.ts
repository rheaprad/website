import { getAllWork, getHome, getNow, getPosts, getRecently, getWork } from '$lib/content';
import type { Post, StripImage, WorkItem } from '$lib/content';
import type { Picture } from '@sveltejs/enhanced-img';
import { formatMonth } from '$lib/format';
import type { PageLoad } from './$types';

/** How many pieces the selected-work shelf holds before "all work" takes over. */
const SHELF_SIZE = 9;
/** How far back the combined feed reaches on the homepage. */
const FEED_SIZE = 6;

interface Door {
	href: string;
	label: string;
	note: string;
	thumb: string;
	thumbPicture?: Picture;
}

/**
 * A door's picture, from whichever kind of thing is fronting it. Each source
 * carries both a URL and a responsive form, and they have to travel together —
 * a door that kept only the string would be back to serving a full-size cover
 * as a 216px tile.
 */
function thumbOf(source: WorkItem | Post | StripImage | undefined): {
	thumb?: string;
	thumbPicture?: Picture;
} {
	// Narrow on required keys — `image` is optional on Post, so `'image' in source`
	// would not exclude it from the remaining union.
	if (!source) return {};
	if ('path' in source) return { thumb: source.src, thumbPicture: source.picture };
	if ('cover' in source) return { thumb: source.cover, thumbPicture: source.coverPicture };
	return { thumb: source.image, thumbPicture: source.imagePicture };
}

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
		hero: home.hero,
		sections: home.sections,
		postcard: home.postcard,
		// Entry points into the rest of the site, each fronted by a real piece
		// rather than an icon, so the picture does the labelling and the line
		// underneath only says what kind of thing you're about to open.
		doors: [
			{ href: '/books/', ...home.doors.books, ...thumbOf(of('book')[0]) },
			{ href: '/tags/comic/', ...home.doors.comics, ...thumbOf(of('comic')[0]) },
			{
				href: '/tags/illustration/',
				...home.doors.illustrations,
				...thumbOf(of('illustration')[0])
			},
			{
				href: '/blog/',
				...home.doors.blog,
				...thumbOf(latestEssay ?? latestNote ?? posts.find((p) => p.image) ?? home.strip[0])
			},
			{ href: '/about/', ...home.doors.about, ...thumbOf(home.strip[1]) },
			{
				href: '/now/',
				label: home.doors.now.label,
				// The CMS note wins; blank falls back to the Now page's own date.
				note:
					home.doors.now.note ||
					(now?.updated ? `since ${formatMonth(now.updated)}` : "what I'm on"),
				...thumbOf(home.strip[2])
			}
		].filter((d): d is Door => !!d.thumb)
	};
};
