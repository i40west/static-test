import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import config from '~/config';

export type ValidCollections = 'blog';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
	schema: ({ image }) => z.object({
		title: z.string(),
		date: z.coerce.date(),
		updated_date: z.coerce.date().optional(),
		description: z.string().default(config.siteDescription),
		image: image().optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog };
