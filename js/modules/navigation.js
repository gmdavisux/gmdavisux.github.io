export function updateNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentUrl = new URL(window.location.href);
    const currentPage = currentUrl.searchParams.get('page');
    const defaultLink = document.getElementById('project');
    let isActiveClassAdded = false;

    navLinks.forEach(link => {
        link.classList.remove('active');

        const href = link.getAttribute('href');

        if (href === '/' && currentUrl.pathname === '/' && !currentPage) {
            link.classList.add('active');
            isActiveClassAdded = true;
        } else if (href.startsWith('?page=')) {
            const linkPage = new URLSearchParams(href.slice(1)).get('page');
            if (linkPage === currentPage) {
                link.classList.add('active');
                isActiveClassAdded = true;
            }
        }
    });

    if (!isActiveClassAdded && defaultLink) {
        defaultLink.classList.add('active');
    }
}

export function updateLocalLinks() {
    const currentUrl = new URL(window.location.href);
    const currentSet = currentUrl.searchParams.get('set');

    document.body.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.includes('#')) return;

        let linkUrl;
        try {
            linkUrl = new URL(href, window.location.origin);
        } catch (e) {
            return;
        }

        if (!linkUrl.searchParams.has('set') && currentSet) {
            linkUrl.searchParams.set('set', currentSet);
        }

        link.setAttribute('href', linkUrl.pathname + linkUrl.search);
    });
}

export function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}