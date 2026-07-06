export function validateCollection(items, setName) {
    if (!Array.isArray(items)) {
        console.error(`[collections:${setName}] Expected an array, got ${typeof items}`);
        return false;
    }

    let valid = true;

    items.forEach((item, index) => {
        const label = `[collections:${setName}] item ${index}`;

        if (!item || typeof item !== 'object') {
            console.error(`${label}: must be an object`);
            valid = false;
            return;
        }

        if (!item.name || typeof item.name !== 'string') {
            console.warn(`${label}: missing or invalid "name"`);
            valid = false;
        }

        if (item.url === undefined || item.url === null) {
            console.warn(`${label} (${item.name || 'unnamed'}): missing "url"`);
            valid = false;
        }

        if (item.src && !item.alt) {
            console.warn(`${label} (${item.name || 'unnamed'}): has "src" but missing "alt"`);
        }
    });

    return valid;
}