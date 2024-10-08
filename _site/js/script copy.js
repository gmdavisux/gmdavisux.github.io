// Features built on, projects from the JSON file
fetch('js/projects.json')
    .then(response => response.json())
    .then(projects => {
        const params = new URLSearchParams(window.location.search);
        // Get the current page from the URL query parameter
        const pageParam = params.get('page');
        const currentPage = pageParam ? '?page=' + pageParam : './';
        // -- -- --  create the gallery of images -- -- -- //
        // Get the 'features' div
        const featuresDiv = document.getElementById('features');

        // Create the 'container' div
        const containerDiv = document.createElement('div');
        containerDiv.className = 'container py-4';

        // Create the 'row' div for the heading
        const headingRowDiv = document.createElement('div');
        headingRowDiv.className = 'row d-none';

        // Create the 'col' div for the heading
        const headingColDiv = document.createElement('div');
        headingColDiv.className = 'col-12';

        // Create the 'h3' element
        const h3 = document.createElement('h3');
        h3.textContent = 'My Work';
        h3.id = 'projects';

        // Append the 'h3' element to the 'col' div
        headingColDiv.appendChild(h3);

        // Append the 'col' div to the 'row' div
        headingRowDiv.appendChild(headingColDiv);

        // Prepend the 'row' div to the 'container' div
        containerDiv.prepend(headingRowDiv);

        // Create the 'row' div
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        // Loop through the projects data
        projects.forEach(item => {
            // Check if the item has a 'src' property
            if (item.src) {
                // Create the 'col' div
                const colDiv = document.createElement('div');
                colDiv.className = 'col-md-6 col-lg-4 py-2 d-flex align-items-center justify-content-center';

                // Create the 'a' element
                const a = document.createElement('a');
                a.href = item.url;
                a.className = 'image-container';

                // Create the 'img' element
                const img = document.createElement('img');
                img.src = item.src;
                img.className = 'img-fluid border';

                // Create the 'div' for the overlay
                const overlayDiv = document.createElement('div');
                overlayDiv.className = 'image-overlay d-flex align-items-center justify-content-center';

                // Add your content to the overlay
                const overlayContent = document.createElement('div');
                overlayContent.className = 'overlay-content';
                overlayContent.innerHTML = `
            <h2>${item.name}</h2>
            <p>${item.description}</p>
        `;

                // Append the overlay content to the overlay div
                overlayDiv.appendChild(overlayContent);

                // Append the 'img' element and the overlay div to the 'a' element
                a.appendChild(img);
                a.appendChild(overlayDiv);

                // Append the 'a' element to the 'col' div
                colDiv.appendChild(a);

                // Append the 'col' div to the 'row' div
                rowDiv.appendChild(colDiv);
            }
        });

        // Append the 'row' div to the 'container' div
        containerDiv.appendChild(rowDiv);

        // Append the 'container' div to the 'features' div
        featuresDiv.append(containerDiv);

        // * * * * -- -- -- create offcanvas "My Work" menu -- -- -- //
        // Get the div with id 'work'
        const workDiv = document.getElementById('work');

        // Create the outer div
        const outerDiv = document.createElement('div');
        outerDiv.setAttribute('data-bs-theme', 'dark');
        outerDiv.setAttribute('data-bs-scroll', 'true');
        outerDiv.className = 'offcanvas offcanvas-start';
        outerDiv.tabIndex = '-1';
        outerDiv.id = 'mywork';
        outerDiv.setAttribute('aria-labelledby', 'offcanvasBottomLabel');

        // Create the header div
        const headerDiv = document.createElement('div');
        headerDiv.className = 'offcanvas-header';

        // Create the h3 element
        const outerh3 = document.createElement('h3');
        outerh3.className = 'offcanvas-title';
        outerh3.id = 'offcanvasBottomLabel';
        outerh3.textContent = 'My work';

        // Create the button
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn-close';
        button.setAttribute('data-bs-dismiss', 'offcanvas');
        button.setAttribute('aria-label', 'Close');

        // Append h3 and button to headerDiv
        headerDiv.appendChild(outerh3);
        headerDiv.appendChild(button);

        // Create the body div
        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'offcanvas-body';

        // Append headerDiv and bodyDiv to outerDiv
        outerDiv.appendChild(headerDiv);
        outerDiv.appendChild(bodyDiv);

        // Add the row to the div with id 'work'
        workDiv.appendChild(outerDiv);
        function normalizeUrlValue(urlString) {
            // Check if urlString is empty or null
            if (!urlString) {
                return urlString;  // Return empty string if no URL provided
            }
            // Assuming format is "?page=value" or just "value"
            const parts = urlString.split('=');
            return parts.length > 1 ? parts[1].toLowerCase() : urlString.toLowerCase();
        }

        // Iterate over the data
        projects.forEach(project => {
            if (project.src) {
                // Create a new row for each project
                const row = document.createElement('div');
                row.className = 'row row-cols-1';

                // Create a new column for each project
                const col = document.createElement('div');
                col.className = 'col pb-3';

                // Create a new card for each project
                const card = document.createElement('div');
                card.className = 'card h-100';
                card.dataset.bsTheme = 'light';

                // Set or update the 'page' query parameter
                params.set('page', normalizeUrlValue(project.url));

                // Generate the new query string
                const newQuery = params.toString();
console.log(newQuery);
                // Create the card content
                const cardContent = `
        <a href="?${newQuery}">
          <img src="${project.src}" class="card-img-top" alt="${project.description}">
        </a>
        <div class="card-body">
          <h5 class="card-title">${project.name}</h5>
          <p class="card-text">${project.description}</p>
          <a href="?${newQuery}" class="card-link">Learn more</a>
        </div>
      `;

                // Add the card content to the card
                card.innerHTML = cardContent;

                // Add the card to the column
                col.appendChild(card);

                // Add the column to the row
                row.appendChild(col);

                // Add the row to the bodyDiv
                bodyDiv.appendChild(row);
            }
        });

        // -- -- -- END offcanvas "My Work" menu -- -- -- //

        // Initialize tooltips after the DOM is fully loaded
        document.addEventListener('DOMContentLoaded', (event) => {
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            })
        });

        // -- -- -- create the footer back-next nav bar -- -- -- //
        // Check if the page query parameter is in the JSON list
        let currentIndex = projects.findIndex(project => project.url === currentPage);

        // If the current page is not in the JSON list, set the index to 0
        if (currentIndex === -1) {
            currentIndex = 0;
        }

        // Create the footer
        const footer = document.createElement('footer');
        footer.className = 'footer fixed-bottom bg-primary d-flex justify-content-between p-2 print-hide';

        // removes the hover effect on touch devices
        const isTouchDevice = window.matchMedia('(hover: none)').matches;

        // Get all elements with the classes 'btn' and 'dropdown-item'
        const buttons = document.querySelectorAll('a.btn, a.dropdown-item');

        // Add a touchstart event listener to each button
        buttons.forEach(button => {
            button.addEventListener('touchstart', function (event) {
                // Check if the button has a dropdown menu
                const hasDropdown = button.nextElementSibling && button.nextElementSibling.classList.contains('dropdown-menu');

                // Only prevent the default action if the button doesn't have a dropdown menu
                if (!hasDropdown) {
                    event.preventDefault();
                    window.location.href = button.href;
                }
            }, false);
        });
        // Create the "back" button
        const backButton = document.createElement('a');
        backButton.className = 'btn btn-sm btn-outline-light';
        backButton.innerHTML = '<i class="bi bi-chevron-left"></i><span class="d-none d-md-inline">Back</span>';
        backButton.href = projects[currentIndex > 0 ? currentIndex - 1 : projects.length - 1].url;
        backButton.title = currentIndex > 0 ? projects[currentIndex - 1].name : projects[projects.length - 1].name;
        if (!isTouchDevice) {
            backButton.setAttribute('data-bs-toggle', 'tooltip');
            backButton.setAttribute('data-bs-placement', 'right');
        }

        // Append the name to the title of the page
        const titleElement = document.getElementsByTagName('title')[0]; // Get the first <title> element
        titleElement.textContent += " – " + projects[currentIndex].name; // Change the title

        // Create the "Projects" button
        // Create the button
        const projectsButton = document.createElement('button');
        // Set the class
        projectsButton.className = 'btn btn-sm btn-outline-light';
        // Set the type
        projectsButton.type = 'button';
        // Set the data-bs-toggle attribute
        projectsButton.setAttribute('data-bs-toggle', 'offcanvas');
        // Set the data-bs-target attribute
        projectsButton.setAttribute('data-bs-target', '#mywork');
        // Set the aria-controls attribute
        projectsButton.setAttribute('aria-controls', 'mywork');
        // Set the text
        projectsButton.textContent = 'My Work';


        // if (!isTouchDevice) {
        //     projectsButton.setAttribute('data-bs-toggle', 'tooltip');
        //     projectsButton.setAttribute('data-bs-placement', 'right');
        // }


        // Create the "next" button
        const nextButton = document.createElement('a');
        nextButton.className = 'btn btn-sm btn-outline-light';
        nextButton.innerHTML = '<span class="d-none d-md-inline">Next</span><i class="bi bi-chevron-right"></i>';
        nextButton.href = projects[currentIndex < projects.length - 1 ? currentIndex + 1 : 0].url;
        nextButton.title = currentIndex < projects.length - 1 ? projects[currentIndex + 1].name : projects[0].name;
        if (!isTouchDevice) {
            nextButton.setAttribute('data-bs-toggle', 'tooltip');
            nextButton.setAttribute('data-bs-placement', 'right');
        }

        // Append the buttons to the footer
        footer.appendChild(backButton);
        footer.appendChild(projectsButton);
        footer.appendChild(nextButton);

        // Append the footer to the body
        document.body.appendChild(footer);

        // Initialize Bootstrap tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    });
// END Instead, I think what I need is the projects from the JSON file

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
window.onload = function () {
    var liElements = document.querySelectorAll('.dropdown-menu .dropdown-item');
    var email = ['&#103;&#97;&#114;&#121;&#46;&#100;&#97;&#118;&#105;&#115;', '&#64;', '&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;'];
    var phone = ['&#53;&#56;&#53;', '&#45;', '&#51;&#48;&#49;', '&#45;', '&#48;&#52;&#54;&#55;'];

    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    liElements[0].href = 'tel:' + decodeHtml(phone.join(''));
    liElements[0].innerHTML = phone.join('');

    liElements[1].href = 'mailto:' + decodeHtml(email.join(''));
    liElements[1].innerHTML = email.join('');
};

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
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentUrl = window.location.href;
    const defaultLink = document.getElementById('project'); // select the default link

    let isActiveClassAdded = false;

    navLinks.forEach(link => {
        if (link.href === currentUrl) {
            link.classList.add('active');
            isActiveClassAdded = true;
        }
    });

    // If the 'active' class was not added to any link, add it to the default link
    if (!isActiveClassAdded) {
        defaultLink.classList.add('active');
    }
});

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
document.addEventListener('DOMContentLoaded', (event) => {
    // Assuming window.location.pathname is something like "/aaa/bbb"
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean); // Removes any empty strings from the array

    // Ensure there's at least one segment to work with
    const firstDirectory = segments.length > 0 ? segments[0] : 'projects';
    const jsonFile = firstDirectory + '.json';

    console.log(path); // This should log something like "Requested: aaa.json"
    console.log('Requested:', jsonFile); // This should log something like "Requested: aaa.json"
});

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
