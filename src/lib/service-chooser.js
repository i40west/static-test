import astroService from 'astro/assets/services/sharp';
import cfService from '@astrojs/cloudflare/image-service';

let service;
// Merciful Venus, this is a hack
const isNode = process?.execPath?.includes('node');

if (isNode) {
	service = astroService;
} else {
	service = cfService;
}

export default service;
