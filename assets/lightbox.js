const lightbox = document.querySelector('[data-lightbox]');
const lightboxImg = lightbox.querySelector('img');
let currentIndex = 0;
let images = [];

export function openLightbox(index) {
    images = Array.from(document.querySelector('[data-gallery]').querySelectorAll('img'));
    currentIndex = index;
    lightboxImg.src = images[currentIndex].src;
    lightbox.classList.add('active');
}

function close() { lightbox.classList.remove('active'); }

function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
}

lightbox.querySelector('[data-close]').addEventListener('click', close);
lightbox.querySelector('[data-prev]').addEventListener('click', () => navigate(-1));
lightbox.querySelector('[data-next]').addEventListener('click', () => navigate(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
});