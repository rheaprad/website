import { error } from '@sveltejs/kit';
import { getTag, getTagIndex } from '$lib/content';
import type { PageLoad } from './$types';

export function entries() {
	return getTagIndex().map(({ tag }) => ({ tag }));
}

export const load: PageLoad = ({ params }) => {
	const entry = getTag(params.tag);
	if (!entry) {
		error(404, `Tag "${params.tag}" not found`);
	}
	return {
		tag: entry.tag,
		items: entry.items,
		allTags: getTagIndex().map(({ tag }) => tag)
	};
};
