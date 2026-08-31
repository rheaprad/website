import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import fancyImages from './src/lib/mdsvex-plugins/fancy-images.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'], remarkPlugins: [fancyImages] })],
	compilerOptions: { compatibility: { componentApi: 4 } },
	kit: {
		adapter: adapter(),
		// Empty in prod (custom domain at root). Set BASE_PATH=/site-redesign for
		// the redesign project site published under github.io/<repo>/.
		paths: { base: process.env.BASE_PATH || '' },
		prerender: {
			// Never fail the whole build on a broken/missing link during active
			// development — log it and keep going. (WIP nav pages, CMS-uploaded
			// assets not yet present, stale links, etc.)
			handleHttpError: ({ path, referrer, message }) => {
				console.warn(`⚠️  prerender: ${message}${referrer ? ` (from ${referrer})` : ''} — skipped`);
			},
			// Likewise, don't fail on links to #hash ids that can't be resolved.
			handleMissingId: 'warn'
		}
	}
};

export default config;
