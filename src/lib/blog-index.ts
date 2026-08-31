import { getAllPosts, getPosts, getWork, type PostKind } from '$lib/content';

/** Shared loader for the blog river and its per-kind pages. */
export function loadBlogIndex(kind?: PostKind) {
	const posts = kind ? getPosts(kind) : getAllPosts();
	return {
		items: posts.map((post) => ({
			post,
			projectTitle: post.project ? getWork(post.project)?.title : undefined
		}))
	};
}
