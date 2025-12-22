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
    
    // Update the current page HTML title
    const currentProject = projects[currentIndex];
    if (currentProject && currentProject.name) {
        document.title = currentProject.name;
    }
}

function updateButton(buttonId, item, pageParam, setParam) {
    const button = document.getElementById(buttonId);
    const pageValue = normalizeUrlValue(item.url);
    button.setAttribute('href', '?' + createPageUrl(pageValue, pageParam, setParam));
    button.setAttribute('data-bs-original-title', item.name);
}

// HTML Generation Functions
function generateGridItemHtml0(item, indexLink) {
    return `
    <div class="col-12 col-md-6 col-lg-4 col-xl-4 pb-4">
        <div class="d-flex flex-column shadow-sm rounded py-3 bg-light-subtle border border-light-subtle" style="padding: 1rem; margin: 0.5rem; height: 100%;">
            <div class="mb-3 ps-0" style="padding-left: 0;">
                <a href="?${indexLink}">
                    <img src="${item.src}" class="img-fluid border">
                </a>
            </div>
            <div class="flex-grow-1">
                <p>${item.name}</p>
                <p class="fs-4">${item.description}</p>
                <a href="?${indexLink}" class="btn btn-outline-primary btn-sm card-link">Learn more</a>
            </div>
        </div>
    </div>
    `;
}
function generateGridItemHtml(item, indexLink) {
    return `
    <div class="col-12 col-md-6 col-lg-4 col-xl-4 p-1">
        <div class="card border-light h-100" data-bs-theme="light" style="background-color:rgba(240, 239, 234, 1);">
            <a href="?${indexLink}">
                <div class="ratio ratio-1x1">
                    <img src="${item.src}" 
                         alt="${item.alt || ''}" 
                         class="object-fit-contain img-fluid">
                </div>
            </a>
            <div class="card-body">
                <p class="card-title fs-6">${item.name}</p>
                <p class="card-text fs-3">${item.description}</p>
                <a href="?${indexLink}" class="btn btn-outline-primary btn-sm card-link">Learn more</a>
            </div>
        </div>
    </div>
    `;
}
function generateColumnItemHtml(item, indexLink) {
    return `
    <div class="col-12 pb-3">
        <div class="card shadow-sm rounded bg-light-subtle border border-light-subtle h-100">
            <a href="?${indexLink}">
                <img src="${item.src}" alt="${item.alt || ''}" class="card-img-top">
            </a>
            <div class="card-body">
                <p class="card-title fs-6">${item.name}</p>
                <p class="card-text fs-4">${item.description}</p>
                <a href="?${indexLink}" class="btn btn-outline-primary btn-sm card-link">Learn more</a>
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
            if (!pageParam) { // This checks if pageParam is undefined, null, or an empty string
                gridHtml += generateGridItemHtml(item, indexLink);
            }
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
        if (!response.ok) {
            console.warn(`Failed to load ${url}. Falling back to projects.json.`);
            // Use projects.json as the fallback without modifying the URL
            return fetch('js/projects.json');
        }
        return response;
    })
    .then(response => response.json())
    .then(projects => processProjects(projects, pageParam, setParam))
    .catch(error => {
        console.error('Error fetching JSON file:', error);
    });
    

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
                // ----------- After the content has been loaded, replace the images and add a link to themselves
                // Check if the current page's query string does not include ?page=about or ?page=reco
                if (!window.location.search.includes('?page=about') && !window.location.search.includes('?page=reco')) {
                    // If the current page is neither about nor reco, select images from div.specialContent
                    const images = specialContent.querySelectorAll('img');
                    const header = document.querySelector('.header');
                    const footer = document.querySelector('.footer');
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
                            header.classList.add('hide-header');
                            footer.classList.add('hide-footer');                
                        });
                    }
                    // make the back and next buttons work
                    document.getElementById('prev').addEventListener('click', function () {
                        if (currentIndex > 0) {
                            currentIndex--;
                            document.getElementById('overlay-img').src = images[currentIndex].src;
                        } else {
                            closeOverlay();
                        }
                    });
                    
                    document.getElementById('next').addEventListener('click', function () {
                        if (currentIndex < images.length - 1) {
                            currentIndex++;
                            document.getElementById('overlay-img').src = images[currentIndex].src;
                        } else {
                            closeOverlay();
                        }
                    });

                    document.getElementById('close').addEventListener('click', function () {
                        closeOverlay();
                    });

                    // Close the overlay when clicking outside the image
                    document.getElementById('overlay').addEventListener('click', function (e) {
                        if (e.target.id === 'overlay') {
                            closeOverlay();
                        }
                    });
                    function closeOverlay() {
                        document.getElementById('overlay').style.display = 'none';
                        header.classList.remove('hide-header');
                        footer.classList.remove('hide-footer');
                    }                
                }

                // -------------------- //
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
    
    // Instead of setting href directly (which would be visible on hover),
    // just set the click handlers
    liElements[0].addEventListener('click', function(e) {
      e.preventDefault();
      // Create and click a temporary link
      var tempLink = document.createElement('a');
      tempLink.href = 'tel:' + decodeHtml(phone.join(''));
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    });
    
    liElements[1].addEventListener('click', function(e) {
      e.preventDefault();
      // Create and click a temporary link
      var tempLink = document.createElement('a');
      tempLink.href = 'mailto:' + decodeHtml(email.join(''));
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
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
    const currentUrl = new URL(window.location.href);
    const currentPage = currentUrl.searchParams.get('page');
    const defaultLink = document.getElementById('project');
    let isActiveClassAdded = false;

    navLinks.forEach(link => {
        // Remove any existing 'active' class
        link.classList.remove('active');

        const href = link.getAttribute('href');

        // Handle different types of links
        if (href === '/' && currentUrl.pathname === '/' && !currentPage) {
            // Home page
            link.classList.add('active');
            isActiveClassAdded = true;
        } else if (href.startsWith('?page=')) {
            // Links with page parameter
            const linkPage = new URLSearchParams(href.slice(1)).get('page');
            if (linkPage === currentPage) {
                link.classList.add('active');
                isActiveClassAdded = true;
            }
        } else if (href === '#mywork' && link.id === 'project') {
            // Special case for "My Work" link
            // This will be handled after the loop
        }
    });

    // Handle the default "My Work" link
    if (!isActiveClassAdded && defaultLink) {
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

    // Add a click event listener to the document body to dynamically handle links
    document.body.addEventListener('click', (event) => {
        const link = event.target.closest('a'); // Find the closest anchor tag
        if (!link) return; // Exit if no anchor tag is found

        const href = link.getAttribute('href');

        // Skip if href is null, empty, starts with http, or includes a bookmark (#)
        if (!href || href.startsWith('http') || href.includes('#')) return;

        // Parse the href as a URL
        let linkUrl;
        try {
            linkUrl = new URL(href, window.location.origin);
        } catch (e) {
            // If parsing fails, skip this link
            return;
        }

        // If the link already has a 'set' parameter, do not override it
        if (!linkUrl.searchParams.has('set') && currentSet) {
            linkUrl.searchParams.set('set', currentSet);
        }

        // Update the href attribute dynamically
        link.setAttribute('href', linkUrl.pathname + linkUrl.search);
    });
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

