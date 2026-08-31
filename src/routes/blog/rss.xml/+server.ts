import { blogFeedItems, renderFeed } from '$lib/feed';
import { site } from '$lib/seo/config';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	return renderFeed({
		title: `${site.name} · Blog`,
		description: 'Sketchbook notes, process logs and essays by Rhea Pradeep.',
		selfPath: '/blog/rss.xml',
		items: blogFeedItems()
	});
};
