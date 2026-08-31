import { getTagIndex } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		tags: getTagIndex().map(({ tag, count, items }) => {
			const years = items.map((i) => i.year);
			const min = Math.min(...years);
			const max = Math.max(...years);
			return { tag, count, yearRange: min === max ? String(min) : `${min}–${max}` };
		})
	};
};
