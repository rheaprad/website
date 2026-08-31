import { redirect } from '@sveltejs/kit';

// Old route — the books index now lives at /tags/book/.
export const load = () => {
	redirect(301, '/tags/book/');
};
