let hasavif = false;
let haswebp = false;
let escape = false;

export default function prepzoom() {
	const links = document.querySelectorAll('a.zoomable');
	for (const el of links) {
		const href = el.getAttribute('href');
		const rel = el.getAttribute('rel');
		const url = new URL(href, window.location.href);

		if (href) {
			if (url.pathname.match(/(.*)\.(jpg|png|webp|avif)$/i) && rel != 'nozoom') {
				el.addEventListener('click', zoomclick);
				el.addEventListener('mouseover', preloadImage, { once: true });
			}
		}
	}

	const avif = new Image();
	avif.src = 'data:image/avif;base64,AAAAHGZ0eXBtaWYxAAAAAG1pZjFhdmlmbWlhZgAAAPFtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAHmlsb2MAAAAABEAAAQABAAAAAAEVAAEAAAAeAAAAKGlpbmYAAAAAAAEAAAAaaW5mZQIAAAAAAQAAYXYwMUltYWdlAAAAAHBpcHJwAAAAUWlwY28AAAAUaXNwZQAAAAAAAAABAAAAAQAAABBwYXNwAAAAAQAAAAEAAAAVYXYxQ4EgAAAKBzgABpAQ0AIAAAAQcGl4aQAAAAADCAgIAAAAF2lwbWEAAAAAAAAAAQABBAECg4QAAAAmbWRhdAoHOAAGkBDQAjITFkAAAEgAAAB5TNw9UxdXU6F6oA == ';
	avif.onload = function() { hasavif = true };

	const webp = new Image();
	webp.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
	webp.onload = function() { haswebp = true };
}

function preloadImage(event) {
	const target = event.currentTarget;
	const [href, type] = (hasavif && target.dataset.srcavif) ? [target.dataset.srcavif, 'avif'] :
		(haswebp && target.dataset.srcwebp) ? [target.dataset.srcwebp, 'webp'] :
			[target.dataset.srcjpg, 'jpeg'];
	const srcset = (hasavif && target.dataset.srcsetavif) ? target.dataset.srcsetavif :
		(haswebp && target.dataset.srcsetwebp) ? target.dataset.srcsetwebp :
			target.dataset.srcsetjpg;
	const sizes = target.dataset.sizes;

	const preloadLink = document.createElement('link');
	preloadLink.setAttribute('rel', 'preload');
	preloadLink.setAttribute('as', 'image');
	preloadLink.setAttribute('href', href);
	preloadLink.setAttribute('type', 'image/' + type);

	if (srcset) {
		preloadLink.setAttribute('imagesrcset', srcset);
	}
	if (sizes) {
		preloadLink.setAttribute('sizes', sizes);
	}

	document.head.appendChild(preloadLink);
}

function zoomclick(event) {
	const target = event.currentTarget;

	const s = window.getComputedStyle(document.documentElement);
	const border = s.getPropertyValue('--zoomed-image-border') || '2px solid #222222';
	const bgcolor = s.getPropertyValue('--zoomed-image-bg-color') || 'rgba(0,0,0,0.7)';

	const bgdiv = document.createElement('div');
	bgdiv.id = 'lightbox';

	Object.assign(bgdiv.style, {
		position: 'fixed',
		zIndex: '9999',
		width: '100vw',
		height: '100vh',
		top: '0',
		left: '0',
		backgroundColor: bgcolor,
		overflow: 'hidden',
		opacity: 0,
	});

	const img = document.createElement('img');
	img.alt = target.querySelector('img')?.alt || 'Zoomed image';

	const imgurl = (hasavif && target.dataset.srcavif) ? target.dataset.srcavif :
		(haswebp && target.dataset.srcwebp) ? target.dataset.srcwebp :
			target.dataset.srcjpg;
	const imgsrcset = (hasavif && target.dataset.srcsetavif) ? target.dataset.srcsetavif :
		(haswebp && target.dataset.srcsetwebp) ? target.dataset.srcsetwebp :
			target.dataset.srcsetjpg;
	const imgsizes = target.dataset.sizes;
	if (imgsrcset) {
		img.setAttribute('srcset', imgsrcset);
	}
	if (imgsizes) {
		img.setAttribute('sizes', imgsizes);
	}

	img.src = imgurl;
	Object.assign(img.style, {
		maxWidth: '95vw',
		maxHeight: '95vh',
		border: border,
		borderRadius: '5px',
		position: 'absolute',
		top: '0',
		left: '0',
		right: '0',
		bottom: '0',
		margin: 'auto',
		cursor: 'pointer',
	});

	bgdiv.appendChild(img);
	bgdiv.addEventListener('click', unzoom);

	escape = function(e) {
		if (e.key === 'Escape') {
			e.preventDefault();
			unzoom(e);
		}
	};
	document.addEventListener('keydown', escape, { once: true });

	document.body.appendChild(bgdiv);
	bgdiv.style.animation = '0.3s ease fadeIn';
	bgdiv.style.opacity = 1.0;
	event.preventDefault();
}

function unzoom(event) {
	const bgdiv = document.querySelector('#lightbox');
	bgdiv.style.animation = '0.2s ease fadeOut';
	bgdiv.style.opacity = 0;
	if (escape) {
		document.removeEventListener('keydown', escape);
		escape = null;
	}
	bgdiv.addEventListener('animationend', function(e) {
		document.body.removeChild(bgdiv);
	});
}
