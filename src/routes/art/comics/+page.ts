import { redirect } from '@sveltejs/kit';

// Old route — the comics index now lives at /tags/comic/.
export const load = () => {
	redirect(301, '/tags/comic/');
};
