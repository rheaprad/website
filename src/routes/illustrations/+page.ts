import { redirect } from '@sveltejs/kit';

// Old route — the illustrations index now lives at /tags/illustration/.
export const load = () => {
	redirect(301, '/tags/illustration/');
};
