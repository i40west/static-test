export const config: SiteConfig = {
	siteTitle: 'Hello Astro',
	siteDescription: 'Astro Starter Kit',
	contactEmail: 'admin@example.com',
	timezone: 'America/New_York',
	postsPerPage: 10,
};

interface SiteConfig {
	siteTitle: string;
	siteDescription: string;
	contactEmail: string;
	timezone: string;
	postsPerPage: number;
}

export default config;
