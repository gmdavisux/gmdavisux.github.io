import { getRouteParams } from './router.js';
import { wirePageImages } from './overlay.js';
import { renderTestimonials } from './testimonials.js';

export async function loadContent(showImage) {
    const { contentFile, page } = getRouteParams();

    const contentContainer = document.getElementById('contentContainer');
    const defaultContent = document.getElementById('defaultContent');
    const specialContent = document.getElementById('specialContent');
    const heroContent = document.getElementById('hero');
    const header = document.querySelector('.header');

    contentContainer.innerHTML = '';

    if (contentFile === 'default') {
        defaultContent.style.display = 'block';
        specialContent.style.display = 'none';
        heroContent.style.display = 'block';
        contentContainer.appendChild(defaultContent);
    } else {
        try {
            const response = await fetch(`pages/${contentFile}.html`);
            if (!response.ok) {
                window.location.href = '/404.html';
                return;
            }

            specialContent.innerHTML = await response.text();

            if (page === 'reco') {
                await renderTestimonials(specialContent.querySelector('#recco'));
            }

            wirePageImages(specialContent, showImage, page);

            defaultContent.style.display = 'none';
            specialContent.style.display = 'block';
            heroContent.style.display = 'none';
            contentContainer.appendChild(specialContent);
        } catch (error) {
            console.error('Error fetching content:', error);
            defaultContent.style.display = 'block';
            specialContent.style.display = 'none';
            heroContent.style.display = 'block';
            contentContainer.appendChild(defaultContent);
        }
    }

    document.body.style.paddingTop = `${header.offsetHeight}px`;
}

export function initHeroScrollCollapse() {
    window.addEventListener('scroll', function () {
        const hero = document.getElementById('hero');
        if (!hero || hero.style.display === 'none') {
            return;
        }

        if (window.scrollY > 50) {
            hero.style.maxHeight = '0';
            hero.style.opacity = '0';
        } else {
            hero.style.maxHeight = '1000px';
            hero.style.opacity = '1';
        }
    });
}

export function initPrintPadding() {
    function adjustPaddingForPrint() {
        const headerHeight = document.querySelector('header').offsetHeight;
        document.documentElement.style.setProperty('--print-padding-top', `${headerHeight}px`);
    }

    window.addEventListener('beforeprint', adjustPaddingForPrint);
}