// Instead, projects from the JSON file
fetch('js/projects.json')
    .then(response => response.json())
    .then(projects => {
        // Get the current page from the URL query parameter
        const params = new URLSearchParams(window.location.search);
        const currentPage = '?page=' + params.get('page');

        // -- -- --  create the gallery of images -- -- -- //
        // Get the 'features' div
        const featuresDiv = document.getElementById('features');

        // Create the 'container' div
        const containerDiv = document.createElement('div');
        containerDiv.className = 'container py-4';

        // Create the 'row' div for the heading
        const headingRowDiv = document.createElement('div');
        headingRowDiv.className = 'row';

        // Create the 'col' div for the heading
        const headingColDiv = document.createElement('div');
        headingColDiv.className = 'col-12';

        // Create the 'h3' element
        const h3 = document.createElement('h3');
        h3.textContent = 'All Projects';
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
                colDiv.className = 'col-md-6 col-lg-4 py-2';

                // Create the 'a' element
                const a = document.createElement('a');
                a.href = item.url;
                a.setAttribute('data-bs-toggle', 'tooltip');
                a.setAttribute('data-bs-placement', 'top');
                a.setAttribute('data-bs-original-title', item.name);

                // Create the 'img' element
                const img = document.createElement('img');
                img.src = item.src;
                img.className = 'img-fluid rounded border';

                // Append the 'img' element to the 'a' element
                a.appendChild(img);

                // Append the 'a' element to the 'col' div
                colDiv.appendChild(a);

                // Append the 'col' div to the 'row' div
                rowDiv.appendChild(colDiv);
            }
        });

        // Append the 'row' div to the 'container' div
        containerDiv.appendChild(rowDiv);

        // Append the 'container' div to the 'features' div
        featuresDiv.appendChild(containerDiv);

        // Initialize tooltips
        new bootstrap.Tooltip(document.querySelector('[data-bs-toggle="tooltip"]'));

        // -- -- -- create the footer back-next nav bar -- -- -- //
        // Check if the page query parameter is in the JSON list
        let currentIndex = projects.findIndex(project => project.url === currentPage);

        // If the current page is not in the JSON list, set the index to 0
        if (currentIndex === -1) {
            currentIndex = 0;
        }

        // Create the footer
        const footer = document.createElement('footer');
        footer.className = 'footer fixed-bottom bg-light d-flex justify-content-between p-2';

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
        backButton.className = 'btn btn-sm btn-outline-primary';
        backButton.innerHTML = '<i class="bi bi-chevron-left"></i><span class="d-none d-md-inline">Back</span>';
        backButton.href = projects[currentIndex > 0 ? currentIndex - 1 : projects.length - 1].url;
        backButton.title = currentIndex > 0 ? projects[currentIndex - 1].name : projects[projects.length - 1].name;
        if (!isTouchDevice) {
            backButton.setAttribute('data-bs-toggle', 'tooltip');
            backButton.setAttribute('data-bs-placement', 'right');
        }

        // Create the "Projects" button
        // Create the button
        const projectsButton = document.createElement('button');
        // Set the class
        projectsButton.className = 'btn btn-sm btn-outline-primary';
        // Set the type
        projectsButton.type = 'button';
        // Set the data-bs-toggle attribute
        projectsButton.setAttribute('data-bs-toggle', 'offcanvas');
        // Set the data-bs-target attribute
        projectsButton.setAttribute('data-bs-target', '#mywork');
        // Set the aria-controls attribute
        projectsButton.setAttribute('aria-controls', 'mywork');
        // Set the text
        projectsButton.textContent = 'All Projects';


        // if (!isTouchDevice) {
        //     projectsButton.setAttribute('data-bs-toggle', 'tooltip');
        //     projectsButton.setAttribute('data-bs-placement', 'right');
        // }


        // Create the "next" button
        const nextButton = document.createElement('a');
        nextButton.className = 'btn btn-sm btn-outline-primary';
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
                const data = await response.text();
                specialContent.innerHTML = data;

                // After the content has been loaded, replace the images and add a link to themselves
                const images = specialContent.querySelectorAll('img');
                const regex = /^https:\/\/usersimple\.files\.wordpress\.com\/\d+\/\d+/;
                for (let i = 0; i < images.length; i++) {
                    const image = images[i];
                    const currentSrc = image.src;

                    // If the image src matches the regex, replace the src
                    // if (regex.test(currentSrc)) {
                    //     const newSrc = currentSrc.replace(regex, 'images');
                    //     image.src = newSrc;
                    // }

                    // Create a new link element
                    const link = document.createElement('a');
                    link.href = image.src; // Use the potentially updated image src
                    link.target = '_blank'; // This makes the link open in a new tab

                    // Replace the image with the link, and add the image inside the link
                    image.parentNode.replaceChild(link, image);
                    link.appendChild(image);
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
    async function loadCarousel() {
        const carouselContainer = document.getElementById('work');

        try {
            const response = await fetch('pages/offcanvas.html?' + new Date().getTime());
            const data = await response.text();
            carouselContainer.innerHTML = data;
        } catch (error) {
            // Handle errors
            console.error('Error fetching carousel:', error);
        }
    }


    // Call the loadCarousel function when the page loads
    window.addEventListener('load', loadCarousel); // don't do this anymore
})();

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
// images loading time script
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
img2.src = 'https://usersimple.files.wordpress.com/2021/08/pg15.png?w=1024' + '&v=' + Date.now();