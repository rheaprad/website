import { getAllWork } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = () => ({
	items: getAllWork().filter((w) => w.type === 'book')
});
