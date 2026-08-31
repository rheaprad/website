import { redirect } from '@sveltejs/kit';
import { getAllWork } from '$lib/content';
import type { PageLoad } from './$types';

// Old route — book pages now live at /work/[slug]/.
export function entries() {
	return getAllWork()
		.filter((w) => w.type === 'book')
		.map((w) => ({ slug: w.slug }));
}

export const load: PageLoad = ({ params }) => {
	redirect(301, `/work/${params.slug}/`);
};
