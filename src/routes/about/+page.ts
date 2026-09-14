import { resolveFile, resolveImage, resolvePicture } from '$lib/content';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async () => {
	const modules = import.meta.glob('/src/lib/content/about-page/**/*.md', { eager: true });
	const aboutModule = Object.values(modules).find((m: any) => m.metadata) as any;
	const metadata = aboutModule?.metadata ?? {};
	const seo = metadata.seo ?? {};

	// Images resolve through `$lib/content`, not a glob of our own. Two
	// `?enhanced` globs over the same files generate two full sets of variants,
	// and the map used to be serialised into this route's __data.json besides.
	return {
		component: aboutModule?.default,
		metadata,
		photoPicture: resolvePicture(metadata.photo ?? ''),
		// The résumé is authored as a source path; only the glob knows the URL
		// the file is actually emitted at.
		resume: resolveFile(metadata.resume ?? ''),
		photoSrc: resolveImage(metadata.photo ?? ''),
		shareImage: resolveImage(seo.image || metadata.photo || '')
	};
};
