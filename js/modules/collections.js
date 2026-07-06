import { collectionUrl, createPageUrl, normalizeUrlValue } from './router.js';
import { generateColumnItemHtml, generateGridItemHtml } from './templates.js';
import { validateCollection } from './validate.js';

function updateButton(buttonId, item, setParam) {
    const button = document.getElementById(buttonId);
    const pageValue = normalizeUrlValue(item.url);
    button.setAttribute('href', '?' + createPageUrl(pageValue, setParam));
    button.setAttribute('data-bs-original-title', item.name);
}

function updateNavigationButtons(currentIndex, projects, setParam) {
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    const nextIndex = (currentIndex + 1) % projects.length;

    updateButton('prev-btn', projects[prevIndex], setParam);
    updateButton('next-btn', projects[nextIndex], setParam);

    const currentProject = projects[currentIndex];
    if (currentProject && currentProject.name) {
        document.title = currentProject.name;
    }
}

export function processProjects(projects, pageParam, setParam) {
    let gridHtml = '<div class="container"><div class="project-grid">';
    let columnHtml = '';

    projects.forEach((item, index) => {
        const pageValue = normalizeUrlValue(item.url);
        const indexLink = createPageUrl(pageValue, setParam);

        if (pageValue === pageParam) {
            updateNavigationButtons(index, projects, setParam);
        }

        if (item.src !== undefined && item.src !== null) {
            if (!pageParam) {
                gridHtml += generateGridItemHtml(item, indexLink);
            }
            columnHtml += generateColumnItemHtml(item, indexLink);
        }
    });

    gridHtml += '</div></div>';

    document.getElementById('features').innerHTML = gridHtml;
    document.getElementById('workmenu').innerHTML = columnHtml;
}

export async function loadCollection(setParam, pageParam) {
    const url = collectionUrl(setParam);

    try {
        let response = await fetch(url);

        if (!response.ok) {
            console.warn(`Failed to load ${url}. Falling back to projects.json.`);
            response = await fetch(collectionUrl('projects'));
        }

        if (!response.ok) {
            throw new Error(`Failed to load collection: ${url}`);
        }

        const projects = await response.json();
        validateCollection(projects, setParam);
        processProjects(projects, pageParam, setParam);
    } catch (error) {
        console.error('Error fetching collection:', error);
    }
}