import { allFeedItems, renderFeed } from '$lib/feed';
import { site } from '$lib/seo/config';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	return renderFeed({
		title: site.name,
		description: site.description,
		selfPath: '/rss.xml',
		items: allFeedItems()
	});
};
