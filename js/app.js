import { getRouteParams, addReferrerDomainToURL } from './modules/router.js';
import { loadCollection } from './modules/collections.js';
import { initOverlay } from './modules/overlay.js';
import { loadContent, initHeroScrollCollapse, initPrintPadding } from './modules/content-loader.js';
import { updateNavLinks, updateLocalLinks, initializeTooltips } from './modules/navigation.js';
import { updateContactInfo } from './modules/contact.js';

const { page, set } = getRouteParams();
const showImage = initOverlay();

function initializeApp() {
    initializeTooltips();
    updateNavLinks();
    updateContactInfo();
    updateLocalLinks();
    loadContent(showImage);
}

loadCollection(set, page);
addReferrerDomainToURL();
initHeroScrollCollapse();
initPrintPadding();

window.addEventListener('load', initializeApp);