import { render } from 'svelte/server';
import type { Component } from 'svelte';
import { site } from '$lib/seo/config';
import { formatDate } from '$lib/format';
import { getAllPosts, getAllWork, getWork, type Post, type WorkItem } from '$lib/content';

export interface FeedItem {
	title: string;
	html: string;
	url: string;
	date: string;
	categories: string[];
	image?: string;
}

function absolute(url: string): string {
	if (!url) return '';
	return /^https?:\/\//.test(url) ? url : `${site.url}${url.startsWith('/') ? '' : '/'}${url}`;
}

function renderBody(component: Component | undefined): string {
	if (!component) return '';
	try {
		const { body } = render(component as any);
		return body
			.replace(/href="\//g, `href="${site.url}/`)
			.replace(/src="\//g, `src="${site.url}/`);
	} catch {
		return '';
	}
}

export function workFeedItem(w: WorkItem): FeedItem {
	return {
		title: w.title,
		html: renderBody(w.component),
		url: `${site.url}/work/${w.slug}/`,
		date: w.date,
		categories: w.tags,
		image: absolute(w.cover)
	};
}

export function postFeedItem(p: Post): FeedItem {
	const project = p.project ? getWork(p.project) : undefined;
	return {
		title: p.title ?? [p.kind, project?.title ?? formatDate(p.date)].join(' · '),
		html: renderBody(p.component),
		url: `${site.url}/blog/${p.slug}/`,
		date: p.date,
		categories: [p.kind, ...p.tags],
		image: p.image ? absolute(p.image) : undefined
	};
}

export function allFeedItems(): FeedItem[] {
	return [...getAllWork().map(workFeedItem), ...getAllPosts().map(postFeedItem)].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);
}

export function blogFeedItems(): FeedItem[] {
	return getAllPosts().map(postFeedItem);
}

const escapeXml = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function renderFeed(opts: {
	title: string;
	description: string;
	selfPath: string;
	items: FeedItem[];
}): Response {
	const items = opts.items
		.map((item) => {
			const img = item.image
				? `<img src="${item.image}" alt="${escapeXml(item.title)}" /><br/>`
				: '';
			const categories = item.categories
				.map((c) => `<category>${escapeXml(c)}</category>`)
				.join('');
			return (
				'<item>' +
				`<title><![CDATA[${item.title}]]></title>` +
				`<description><![CDATA[${img}${item.html}]]></description>` +
				`<link>${item.url}</link>` +
				`<guid isPermaLink="true">${item.url}</guid>` +
				categories +
				`<pubDate>${new Date(item.date).toUTCString()}</pubDate>` +
				'</item>'
			);
		})
		.join('\n\t\t\t');

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escapeXml(opts.title)}</title>
		<description>${escapeXml(opts.description)}</description>
		<link>${site.url}</link>
		<atom:link href="${site.url}${opts.selfPath}" rel="self" type="application/rss+xml"/>
		${items}
	</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml'
		}
	});
}
