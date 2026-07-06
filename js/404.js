function normalizeUrlValue(urlString) {
    if (!urlString) {
        return '';
    }
    const parts = urlString.split('=');
    return parts.length > 1 ? parts[1].toLowerCase() : urlString.toLowerCase();
}

function buildPageHref(item) {
    const pageValue = normalizeUrlValue(item.url);

    if (!pageValue || pageValue === './') {
        return '/?set=more';
    }

    const params = new URLSearchParams();
    params.set('page', pageValue);
    params.set('set', 'more');
    return '/?' + params.toString();
}

fetch('js/more.json')
    .then(response => response.json())
    .then(data => {
        const container = document.createElement('div');
        container.className = 'container';

        const row = document.createElement('div');
        row.className = 'row pb-5';

        data.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-md-3 py-2';

            const a = document.createElement('a');
            a.setAttribute('data-bs-theme', 'dark');
            a.href = buildPageHref(item);
            a.textContent = item.name;

            col.appendChild(a);
            row.appendChild(col);
        });

        container.appendChild(row);
        document.body.appendChild(container);
    });