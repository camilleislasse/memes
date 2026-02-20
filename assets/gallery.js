import { openLightbox } from './lightbox.js';

const gallery = document.querySelector('[data-gallery]');

async function loadGallery() {
    try {
        const res = await fetch('images.json');
        if (!res.ok) return;
        const files = (await res.json()).reverse();
        gallery.innerHTML = '';
        files.forEach((path, i) => {
            const img = document.createElement('img');
            img.src = path;
            img.alt = path.split('/').pop();
            img.loading = 'lazy';
            img.addEventListener('click', () => openLightbox(i));
            gallery.appendChild(img);
        });
    } catch (err) {
        console.log('Galerie:', err.message);
    }
}

loadGallery();