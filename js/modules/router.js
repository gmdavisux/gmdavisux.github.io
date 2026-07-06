export function getRouteParams(search = window.location.search) {
    const params = new URLSearchParams(search);
    return {
        page: params.get('page') || '',
        set: params.get('set') || 'projects',
        contentFile: params.get('page') || 'default',
    };
}

export function normalizeUrlValue(urlString) {
    if (!urlString) {
        return urlString;
    }
    const parts = urlString.split('=');
    return parts.length > 1 ? parts[1].toLowerCase() : urlString.toLowerCase();
}

export function createPageUrl(itemUrl, setParam) {
    const urlSearchParams = new URLSearchParams();

    if (itemUrl && itemUrl !== './') {
        urlSearchParams.set('page', itemUrl);
    }

    if (setParam) {
        urlSearchParams.set('set', setParam);
    }

    return urlSearchParams.toString();
}

export function collectionUrl(setParam) {
    return `js/${setParam}.json`;
}

export function addReferrerDomainToURL() {
    const referrer = document.referrer;
    if (!referrer) {
        return;
    }

    try {
        const referrerURL = new URL(referrer);
        const currentHost = window.location.hostname;

        if (referrerURL.hostname !== currentHost) {
            const currentURL = new URL(window.location.href);

            if (!currentURL.searchParams.has('ref_domain')) {
                currentURL.searchParams.set('ref_domain', referrerURL.hostname);
                window.history.replaceState({}, '', currentURL.toString());
            }
        }
    } catch (error) {
        console.error('Error parsing referrer URL:', error);
    }
}