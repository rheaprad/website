import { getAllWork, getPosts, getRecently, getWork } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	const latestNote = getPosts('note')[0];
	const latestEssay = getPosts('essay')[0];

	return {
		gallery: getAllWork().slice(0, 8),
		recently: getRecently(6),
		latestNote: latestNote && {
			post: latestNote,
			projectTitle: latestNote.project ? getWork(latestNote.project)?.title : undefined
		},
		latestEssay
	};
};
