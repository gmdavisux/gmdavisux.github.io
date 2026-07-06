export function generateGridItemHtml(item, indexLink) {
    return `
    <a href="?${indexLink}" class="project-tile">
        <div class="project-tile__media">
            <img src="${item.src}"
                 alt="${item.alt || ''}"
                 loading="lazy">
        </div>
        <div class="project-tile__body">
            <p class="project-tile__name">${item.name}</p>
            <p class="project-tile__desc">${item.description}</p>
        </div>
    </a>
    `;
}

export function generateColumnItemHtml(item, indexLink) {
    return `
    <a href="?${indexLink}" class="workmenu-tile">
        <img src="${item.src}" alt="${item.alt || ''}" class="workmenu-tile__img" loading="lazy">
        <div class="workmenu-tile__body">
            <p class="workmenu-tile__name">${item.name}</p>
            <p class="workmenu-tile__desc">${item.description}</p>
            <span class="workmenu-tile__link">Learn more</span>
        </div>
    </a>
    `;
}