import { getAllPosts, getAllWork, getNow, getTagIndex } from '$lib/content';
import { site } from '$lib/seo/config';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const urls: { path: string; lastmod?: string }[] = [
		{ path: '/' },
		{ path: '/work/' },
		{ path: '/books/' },
		{ path: '/tags/' },
		{ path: '/blog/' },
		{ path: '/blog/notes/' },
		{ path: '/blog/logs/' },
		{ path: '/blog/essays/' },
		{ path: '/now/', lastmod: getNow()?.updated },
		{ path: '/log/' },
		{ path: '/about/' }
	];

	for (const w of getAllWork()) {
		urls.push({ path: `/work/${w.slug}/`, lastmod: w.updated ?? w.date });
	}
	for (const t of getTagIndex()) {
		urls.push({ path: `/tags/${t.tag}/` });
	}
	for (const p of getAllPosts()) {
		urls.push({ path: `/blog/${p.slug}/`, lastmod: p.updated ?? p.date });
	}

	const body = urls
		.map(({ path, lastmod }) => {
			const mod = lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : '';
			return `\t<url><loc>${site.url}${path}</loc>${mod}</url>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml'
		}
	});
};
