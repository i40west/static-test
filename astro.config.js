import { defineConfig } from 'astro/config';

// import compressor from 'astro-compressor';
import mdx from '@astrojs/mdx';
// import cloudflare from '@astrojs/cloudflare';
// uncomment to use React
// import react from '@astrojs/react';

import rehypeExtractExcerpt from './src/lib/rehype-extract-excerpt.ts';
import { remarkDefinitionList, defListHastHandlers } from 'remark-definition-list';
import { rehypeGithubAlerts } from 'rehype-github-alerts';
import sectionize from './src/lib/remark-sectionize.js';

let hostname = 'hello-astro.iwantcandy.io';

const branch = process.env.CF_PAGES_BRANCH || 'main';
if (branch !== 'main') {
	hostname = `${branch}.${hostname}`;
}
const siteUrl = `https://${hostname}`;

export default defineConfig({
	// output: 'server',
	site: siteUrl,
	publicDir: './static',
	compressHTML: false,
	build: {
		assets: 'assets',
	},
	integrations: [
		mdx(),
		// uncomment to use React
		// react(),
		// compressor({ gzip: false, brotli: true }),
	],
	markdown: {
		remarkPlugins: [
			remarkDefinitionList,
			sectionize,
		],
		rehypePlugins: [
			[rehypeExtractExcerpt, { maxLength: 600 }],
			rehypeGithubAlerts,
		],
		remarkRehype: { handlers: defListHastHandlers },
		shikiConfig: {
			theme: 'tokyo-night',
		},
	},
	vite: {
		build: {
			target: 'es2022',
		},
		// uncomment to use React
		// resolve: {
		// 	// Use react-dom/server.edge instead of react-dom/server.browser for React 19.
		// 	// Without this, MessageChannel from node:worker_threads needs to be polyfilled.
		// 	// https://github.com/withastro/astro/issues/12824
		// 	alias: import.meta.env.PROD && {
		// 		'react-dom/server': 'react-dom/server.edge',
		// 	},
		// },
	},
	// Enable this to use CF Image Resizing only on prerendered pages.
	// image: {
	// 	service: {
	// 		entrypoint: 'src/lib/service-chooser.js',
	// 	},
	// },

	// If we enable Cloudflare for partial SSR, and use the 'compile' image service,
	// we need to enable nodejs_compat even though Sharp isn't actually running on CF.
	// adapter: cloudflare({
	// 	platformProxy: {
	// 		enabled: true,
	// 	},
	// 	// imageService: 'cloudflare',
	// 	imageService: 'custom',
	// }),
});
