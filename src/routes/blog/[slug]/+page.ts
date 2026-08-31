import { error } from '@sveltejs/kit';
import { getAllPosts, getLogsForProject, getPost, getPrevNextPost, getWork } from '$lib/content';
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

	// Logs also get prev/next within their own project's diary.
	let projectLogs: { prev?: { slug: string; date: string }; next?: { slug: string; date: string } } =
		{};
	if (post.kind === 'log' && post.project) {
		const logs = getLogsForProject(post.project);
		const i = logs.findIndex((l) => l.slug === post.slug);
		projectLogs = {
			prev: logs[i - 1] && { slug: logs[i - 1].slug, date: logs[i - 1].date },
			next: logs[i + 1] && { slug: logs[i + 1].slug, date: logs[i + 1].date }
		};
	}

	return {
		post,
		projectTitle: project?.title,
		projectSlug: project?.slug,
		prevNext: getPrevNextPost(post.slug),
		projectLogs
	};
};
