import { error } from '@sveltejs/kit';
import { getNow } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	const now = getNow();
	if (!now) {
		error(404, 'Now page not found');
	}
	return { now };
};
