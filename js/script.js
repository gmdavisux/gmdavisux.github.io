//  built on, projects from the JSON file
    // Retrieve the current query
    const params = new URLSearchParams(window.location.search);
    // get the specific values of the query to reuse them
    const pageParam = params.get('page') || '';  // Set pageParam to empty string if 'page' is missing
    let setParam = params.get('set') || 'projects';  // Use 'projects' if setParam is empty or undefined

    // Construct the fetch URL with a fallback mechanism
    const url = 'js/' + setParam + '.json';

    // Normalize the URL value becasue old files may include the full query string
    function normalizeUrlValue(urlString) {
        // Check if urlString is empty or null
        if (!urlString) {
            return urlString;  // Return empty string if no URL provided
        }
        // Assuming format is "?page=value" or just "value"
        const parts = urlString.split('=');
        return parts.length > 1 ? parts[1].toLowerCase() : urlString.toLowerCase();
    }

    // function to generate the page URL using the current set param and the page param
    function createPageUrl(itemUrl, pageParam, setParam) {
        const urlSearchParams = new URLSearchParams();

        // Always add the page parameter if itemUrl is provided
        if (itemUrl) {
            // Handle the special case for home
            if (itemUrl === "./") {
                // Don't add a page parameter for home
            } else {
                urlSearchParams.set('page', itemUrl);
            }
        }

        // Always add the set parameter
        if (setParam) {
            urlSearchParams.set('set', setParam);
        }

        return urlSearchParams.toString();
    }

// Navigation Functions
function updateNavigationButtons(currentIndex, projects, pageParam, setParam) {
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    const nextIndex = (currentIndex + 1) % projects.length;

    updateButton('prev-btn', projects[prevIndex], pageParam, setParam);
    updateButton('next-btn', projects[nextIndex], pageParam, setParam);
}

function updateButton(buttonId, item, pageParam, setParam) {
    const button = document.getElementById(buttonId);
    const pageValue = normalizeUrlValue(item.url);
    button.setAttribute('href', '?' + createPageUrl(pageValue, pageParam, setParam));
    button.setAttribute('data-bs-original-title', item.name);
}

// HTML Generation Functions
function generateGridItemHtml(item, indexLink) {
    return `
    <div class="col-md-6 col-lg-4 py-2 d-flex align-items-center justify-content-center">
        <a href="?${indexLink}" class="image-container">
            <img src="${item.src}" class="img-fluid border">
            <div class="image-overlay d-flex align-items-center justify-content-center">
                <div class="overlay-content">
                    <h2>${item.name}</h2>
                    <p>${item.description}</p>
                </div>
            </div>
        </a>
    </div>
    `;
}

function generateColumnItemHtml(item, indexLink) {
    return `
    <div class="row row-cols-1">
        <div class="col pb-3">
            <div class="card h-100" data-bs-theme="light">
                <a href="?${indexLink}">
                    <img src="${item.src}" class="card-img-top" alt="${item.description}">
                </a>
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.description}</p>
                    <a href="?${indexLink}" class="card-link">Learn more</a>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Main Function
function processProjects(projects, pageParam, setParam) {
    let gridHtml = '<div class="container py-4"><div class="row">';
    let columnHtml = '';

    projects.forEach((item, index) => {
        const pageValue = normalizeUrlValue(item.url);
        const indexLink = createPageUrl(pageValue, pageParam, setParam);

        if (pageValue === pageParam) {
            updateNavigationButtons(index, projects, pageParam, setParam);
        }

        if (item.src !== undefined && item.src !== null) {
            gridHtml += generateGridItemHtml(item, indexLink);
            columnHtml += generateColumnItemHtml(item, indexLink);
        }
    });

    gridHtml += '</div></div>';

    document.getElementById('features').innerHTML = gridHtml;
    document.getElementById('workmenu').innerHTML = columnHtml;
}

// Main Execution
fetch(url)
    .then(response => {
        if (!response.ok && setParam !== 'projects') {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('set', 'projects');
            if (pageParam) {
                newUrl.searchParams.set('page', pageParam);
            }
            window.location.href = newUrl.toString();
        }
        return response.json();
    })
    .then(projects => processProjects(projects, pageParam, setParam));
    

// Wrap everything in an IIFE to avoid polluting the global scope
(function () {
    // Function to load dynamic content
    async function loadContent() {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const contentFile = urlParams.get('page') || 'default';

        // Get elements
        const contentContainer = document.getElementById('contentContainer');
        const defaultContent = document.getElementById('defaultContent');
        const specialContent = document.getElementById('specialContent');
        const heroContent = document.getElementById('hero');
        const header = document.querySelector('.header');
        const headerHeight = header.offsetHeight;

        // Clear the content container
        contentContainer.innerHTML = '';

        if (contentFile === 'default') {
            // Show the default content
            defaultContent.style.display = 'block';
            specialContent.style.display = 'none';
            heroContent.style.display = 'block';
            contentContainer.appendChild(defaultContent);
            document.body.style.paddingTop = `${headerHeight}px`;
        } else {
            // Load the special content
            try {
                const response = await fetch(`pages/${contentFile}.html`);
                if (!response.ok) {
                    // Redirect to 404.html if the fetch failed (e.g., file not found)
                    window.location.href = '/404.html';
                } else {
                    const data = await response.text();
                    specialContent.innerHTML = data;
                }
                // After the content has been loaded, replace the images and add a link to themselves
                // Check if the current page's query string does not include ?page=about or ?page=reco
                if (!window.location.search.includes('?page=about') && !window.location.search.includes('?page=reco')) {
                    // If the current page is neither about nor reco, select images from div.specialContent
                    const images = specialContent.querySelectorAll('img');
                    // Proceed with your code to handle the images as needed
                    const regex = /^https:\/\/usersimple\.files\.wordpress\.com\/\d+\/\d+/;
                    let currentIndex = 0;

                    for (let i = 0; i < images.length; i++) {
                        const image = images[i];
                        const currentSrc = image.src;

                        // If the image src matches the regex, replace the src
                        if (regex.test(currentSrc)) {
                            const newSrc = currentSrc.replace(regex, 'images');
                            image.src = newSrc;
                        }

                        // Add a click event to open the overlay
                        image.addEventListener('click', function () {
                            currentIndex = i;
                            document.getElementById('overlay-img').src = image.src;
                            document.getElementById('overlay').style.display = 'flex';
                        });
                    }
                    // make the back and next buttons work
                    document.getElementById('prev').addEventListener('click', function () {
                        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
                        document.getElementById('overlay-img').src = images[currentIndex].src;
                    });

                    document.getElementById('next').addEventListener('click', function () {
                        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
                        document.getElementById('overlay-img').src = images[currentIndex].src;
                    });

                    document.getElementById('close').addEventListener('click', function () {
                        document.getElementById('overlay').style.display = 'none';
                    });

                    // Close the overlay when clicking outside the image
                    document.getElementById('overlay').addEventListener('click', function (e) {
                        if (e.target.id === 'overlay') {
                            this.style.display = 'none';
                        }
                    });
                }
                defaultContent.style.display = 'none';
                specialContent.style.display = 'block';
                heroContent.style.display = 'none';
                contentContainer.appendChild(specialContent);
                document.body.style.paddingTop = `62px`;
            } catch (error) {
                // Handle errors
                console.error('Error fetching content:', error);
                defaultContent.style.display = 'block';
                specialContent.style.display = 'none';
                contentContainer.appendChild(defaultContent);
            }
        }
    }

    // Listen for hashchange and load events to load content
    window.addEventListener('hashchange', loadContent);
    window.addEventListener('load', loadContent);

    // Function to load the HTML snippet (legacy code)
    async function loadmywork() {
        const myworkContainer = document.getElementById('work');

        try {
            const response = await fetch('pages/offcanvas.html?' + new Date().getTime());
            const data = await response.text();
            myworkContainer.innerHTML = data;
        } catch (error) {
            // Handle errors
            console.error('Error fetching mywork:', error);
        }
    }


    // Call the loadmywork function when the page loads
    // window.addEventListener('load', loadmywork); // don't do this anymore
})();

// function to adjust padding for printing
function adjustPaddingForPrint() {
    const headerHeight = document.querySelector('header').offsetHeight;
    // Set a custom property with the desired padding-top for printing
    document.documentElement.style.setProperty('--print-padding-top', `${headerHeight}px`);
}

window.addEventListener('beforeprint', adjustPaddingForPrint);

// add the phone number and email to the contact dropdown
function updateContactInfo() {
    var liElements = document.querySelectorAll('.dropdown-menu .dropdown-item');
    var email = ['&#103;&#97;&#114;&#121;&#46;&#100;&#97;&#118;&#105;&#115;', '&#64;', '&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;'];
    var phone = ['&#53;&#56;&#53;', '&#45;', '&#51;&#48;&#49;', '&#45;', '&#48;&#52;&#54;&#55;'];

    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    // Keep the obfuscated version in the HTML
    liElements[0].innerHTML = phone.join('');
    liElements[1].innerHTML = email.join('');

    // Set up click event listeners to use the decoded version
    liElements[0].addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'tel:' + decodeHtml(phone.join(''));
    });

    liElements[1].addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'mailto:' + decodeHtml(email.join(''));
    });
}

//   hide the hero portion of the navbar when scrolling
window.addEventListener('scroll', function () {
    var hero = document.getElementById('hero');
    if (window.scrollY > 50) {
        hero.style.maxHeight = '0';
        hero.style.opacity = '0';
    } else {
        hero.style.maxHeight = '1000px'; /* adjust this to the maximum possible height of your #hero div */
        hero.style.opacity = '1';
    }
});

// add active to the current nav-item for color change
function updateNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentUrl = window.location.href;
    const defaultLink = document.getElementById('project');

    let isActiveClassAdded = false;

    navLinks.forEach(link => {
        if (link.href === currentUrl) {
            link.classList.add('active');
            isActiveClassAdded = true;
        }
    });

    if (!isActiveClassAdded) {
        defaultLink.classList.add('active');
    }
}

// add initialization for tooltips
function initializeTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

function updateLocalLinks() {
    // Get the current 'set' parameter value from the URL
    const currentUrl = new URL(window.location.href);
    const currentSet = currentUrl.searchParams.get('set');

    // Find all 'a' elements on the page
    const links = document.getElementsByTagName('a');

    // Iterate through each link
    for (let link of links) {
        const href = link.getAttribute('href');

        // Skip if href is null or empty
        if (!href) continue;

        // Skip if the link is not local or is a bookmark
        if (href.startsWith('http') || href.includes('#')) continue;

        // Parse the href as a URL
        let linkUrl;
        try {
            linkUrl = new URL(href, window.location.origin);
        } catch (e) {
            // If parsing fails, skip this link
            continue;
        }

        // If 'set' parameter exists in the current URL, update or add it to the link
        if (currentSet) {
            linkUrl.searchParams.set('set', currentSet);
        }

        // Update the href attribute, preserving the pathname and search params
        link.setAttribute('href', linkUrl.pathname + linkUrl.search);
    }
}


// Main initialization function
function initializeApp() {
    initializeTooltips();
    updateNavLinks();
    updateContactInfo();
    updateLocalLinks();
    // Add calls to other initialization functions here
}


// Set up event listeners
window.addEventListener('load', initializeApp);


// Listen for changes to the DOM
const observer = new MutationObserver((mutationsList, observer) => {
    // Check if the Bootstrap component exists in the DOM
    const bootstrapComponent = document.querySelector('.bootstrap-component-selector');
    if (bootstrapComponent) {
        // Initialize the Bootstrap component
        new bootstrap.Carousel(bootstrapComponent);

        // Stop observing once we've found the Bootstrap component
        observer.disconnect();
    }
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });

// start of logic to load different content based on URL
// document.addEventListener('DOMContentLoaded', (event) => {
//     // Assuming window.location.pathname is something like "/aaa/bbb"
//     const path = window.location.pathname;
//     const segments = path.split('/').filter(Boolean); // Removes any empty strings from the array

//     // Ensure there's at least one segment to work with
//     const firstDirectory = segments.length > 0 ? segments[0] : 'projects';
//     const jsonFile = firstDirectory + '.json';

//     console.log(path); // This should log something like "Requested: aaa.json"
//     console.log('Requested:', jsonFile); // This should log something like "Requested: aaa.json"
// });

// images loading-time script (helped me to decide to not use CDN for images)
/*
var img1 = new Image();
var img2 = new Image();

var start1 = performance.now();
img1.onload = function() {
  var end1 = performance.now();
  console.log('Time taken to load image from host server: ', end1 - start1, 'ms');
};
img1.src = 'images/pg15.png' + '?v=' + Date.now();

var start2 = performance.now();
img2.onload = function() {
  var end2 = performance.now();
  console.log('Time taken to load image from CDN: ', end2 - start2, 'ms');
};
img2.src = 'https://usersimple.files.wordpress.com/2021/08/pg15.png' + '?v=' + Date.now();
*/
