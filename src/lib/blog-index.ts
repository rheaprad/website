import {
	getAllPosts,
	getLogPosition,
	getPosts,
	getWork,
	type Post,
	type PostKind
} from '$lib/content';

/** One entry as the index renders it: the post plus the two facts about it
 *  that live outside the file — which work it belongs to, and where it falls
 *  in that work's diary. */
export interface RiverEntry {
	post: Post;
	projectTitle?: string;
	position?: { index: number; total: number };
}

/** Shared loader for the blog river and its per-kind pages. */
export function loadBlogIndex(kind?: PostKind): {
	items: RiverEntry[];
	counts: Record<'all' | PostKind, number>;
} {
	const posts = kind ? getPosts(kind) : getAllPosts();
	const all = getAllPosts();
	return {
		items: posts.map((post) => ({
			post,
			projectTitle: post.project ? getWork(post.project)?.title : undefined,
			// Logs carry their place in the project's diary onto the index, so a
			// reader can see a sequence without opening one of its entries.
			position: getLogPosition(post)
		})),
		// how many of each kind exist, for the index line in the masthead
		counts: {
			all: all.length,
			note: all.filter((p) => p.kind === 'note').length,
			log: all.filter((p) => p.kind === 'log').length,
			essay: all.filter((p) => p.kind === 'essay').length
		}
	};
}
