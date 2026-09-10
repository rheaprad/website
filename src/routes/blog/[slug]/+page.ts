import { error } from '@sveltejs/kit';
import {
	getAllPosts,
	getLogPosition,
	getLogsForProject,
	getPost,
	getPrevNextPost,
	getWork
} from '$lib/content';
import type { PageLoad } from './$types';

export function entries() {
	return getAllPosts().map((p) => ({ slug: p.slug }));
}

export const load: PageLoad = ({ params }) => {
	const post = getPost(params.slug);
	if (!post) {
		error(404, `Post "${params.slug}" not found`);
	}

	const project = post.project ? getWork(post.project) : undefined;

	// A log is one instalment of a project's diary, so it gets the whole diary
	// rather than a prev/next pair: a reader standing in the middle of a
	// sequence wants to see the sequence. Oldest first — the order it was
	// written in, which is the order it reads in.
	const diary =
		post.kind === 'log' && post.project
			? getLogsForProject(post.project).map((l) => ({
					slug: l.slug,
					date: l.date,
					title: l.title
				}))
			: [];

	return {
		post,
		projectTitle: project?.title,
		projectSlug: project?.slug,
		position: getLogPosition(post),
		diary,
		prevNext: getPrevNextPost(post.slug)
	};
};
