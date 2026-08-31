import { loadBlogIndex } from '$lib/blog-index';
import type { PageLoad } from './$types';

export const load: PageLoad = () => loadBlogIndex();
