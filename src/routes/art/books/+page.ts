import { redirect } from '@sveltejs/kit';

// Old route — the books index now lives at /books/.
export const load = () => {
	redirect(301, '/books/');
};
