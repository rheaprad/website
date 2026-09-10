import { blogFeedItems, renderFeed } from '$lib/feed';
import { site } from '$lib/seo/config';
import type { RequestHandler } from './$types';
import { pages } from '$lib/page-copy';

export const prerender = true;

export const GET: RequestHandler = () => {
	return renderFeed({
		title: `${site.name} · Blog`,
		description: pages.blog.description,
		selfPath: '/blog/rss.xml',
		items: blogFeedItems()
	});
};
