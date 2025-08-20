import { getCollection, getEntry, render } from 'astro:content';
import { DateTime } from 'luxon';
import config from '~/config';
import type { CollectionEntry } from 'astro:content';
import type { ValidCollections} from '~/content.config';
import type { Frontmatter } from '@lib/types.ts';


export type BlogPost<T extends ValidCollections> = CollectionEntry<T> & {
	frontmatter: Frontmatter;
	url: string;
	content: any;
	fmtDate: string;
	isoDate: string;
	luxonDate: DateTime;
};

// Returns a list of BlogPosts sorted by date
export async function getPosts<T extends ValidCollections>({ collection = 'blog' as T }: {
		collection?: T
	} = {}): Promise<BlogPost<T>[]> {

	const entries = await getCollection(collection, ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const items: BlogPost<T>[] = await Promise.all(entries.map(async (entry) => {
		return await toBlogPost(entry, { collection });
	}));

	items.sort((a, b) => {
		return b.luxonDate.toMillis() - a.luxonDate.toMillis();
	});
	return items;
}

// Returns a single post by ID
export async function getPost<T extends ValidCollections>(id: string, { collection = 'blog' as T } = {}): Promise<BlogPost<T> | undefined> {
	const entry = await getEntry(collection, id);
	if (!entry) return undefined;
	return toBlogPost(entry as CollectionEntry<T>, { collection });
}

// Take a collection entry and return a BlogPost
async function toBlogPost<T extends ValidCollections>(entry: CollectionEntry<T>, { collection = 'blog' as T }: { collection?: T } = {}): Promise<BlogPost<T>> {
	const { Content, remarkPluginFrontmatter } = await render(entry);
	const pubDate = DateTime.fromISO(remarkPluginFrontmatter.date, { zone: config.timezone || 'America/New_York' });

	if (!pubDate.isValid) {
		throw new Error(`Invalid date for entry: ${entry.id}`);
	}

	const newEntry: BlogPost<T> = {
		...entry,
		frontmatter: remarkPluginFrontmatter,
		url: `/${collection}/${entry.id}/`,
		content: Content,
		fmtDate: pubDate.toFormat('dd MMMM yyyy'),
		isoDate: pubDate.toFormat('yyyy-MM-dd'),
		luxonDate: pubDate,
	};

	if (newEntry.frontmatter.blurb) {
		newEntry.frontmatter.excerpt = newEntry.frontmatter.blurb;
	}
	return newEntry;
}
