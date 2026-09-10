import { getAllWork, getTagIndex } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		items: getAllWork(),
		tags: getTagIndex().map(({ tag, count }) => ({ tag, count }))
	};
};
