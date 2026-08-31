import { error } from '@sveltejs/kit';
import {
	getAdjacent,
	getAllWork,
	getPostsForProject,
	getRelated,
	getWork
} from '$lib/content';
import type { PageLoad } from './$types';

export function entries() {
	return getAllWork().map((w) => ({ slug: w.slug }));
}

export const load: PageLoad = ({ params }) => {
	const item = getWork(params.slug);
	if (!item) {
		error(404, `Work "${params.slug}" not found`);
	}
	return {
		item,
		related: getRelated(item, 3),
		adjacent: getAdjacent(item.slug),
		posts: getPostsForProject(item.slug),
		// Books open with a full-bleed hero, so the header overlays it.
		nav: item.type === 'book' ? { transparent: true, text: item.navText } : undefined
	};
};
