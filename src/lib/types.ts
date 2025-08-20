import type { ImageMetadata } from 'astro';

export interface Frontmatter {
	title?: string;
	description?: string;
	excerpt?: string;
	image?: ImageMetadata;
	date?: Date;
	updated_date?: Date;
	draft?: boolean;
	[key: string]: any;
}

export interface LayoutProps {
	title?: string;
	description?: string;
	frontmatter?: Frontmatter;
	bodyClass?: string;
	ogImage?: ImageMetadata;
}
