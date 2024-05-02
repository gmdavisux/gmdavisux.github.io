// Load the projects from the JSON file
fetch('js/projects.json')
    .then(response => response.json())
    .then(projects => {
        // Get the current page from the URL query parameter
        const params = new URLSearchParams(window.location.search);
        const currentPage = '?page=' + params.get('page');

        // Check if the page query parameter is in the JSON list
        let currentIndex = projects.findIndex(project => project.url === currentPage);

        // If the current page is not in the JSON list, set the index to 0
        if (currentIndex === -1) {
            currentIndex = 0;
        }

        // Create the footer
        const footer = document.createElement('footer');
        footer.className = 'footer fixed-bottom bg-light d-flex justify-content-between p-2';

        // Create the "back" button
        const backButton = document.createElement('a');
        backButton.className = 'btn btn-sm btn-outline-primary';
        backButton.innerHTML = '<i class="bi bi-chevron-left"></i>';
        backButton.href = projects[currentIndex > 0 ? currentIndex - 1 : projects.length - 1].url;
        backButton.title = currentIndex > 0 ? projects[currentIndex - 1].name : projects[projects.length - 1].name;
        backButton.setAttribute('data-bs-toggle', 'tooltip');
        backButton.setAttribute('data-bs-placement', 'right');

        // Create the "Projects" button
        const projectsButton = document.createElement('a');
        projectsButton.className = 'btn btn-sm btn-outline-primary';
        projectsButton.innerHTML = '<i class="bi bi-grid"></i> List';
        projectsButton.href = '#work';
        projectsButton.setAttribute('data-bs-toggle', 'tooltip');
        projectsButton.setAttribute('data-bs-placement', 'bottom');
        projectsButton.title = 'All Projects';

        // Create the "next" button
        const nextButton = document.createElement('a');
        nextButton.className = 'btn btn-sm btn-outline-primary';
        nextButton.innerHTML = '<i class="bi bi-chevron-right"></i>';
        nextButton.href = projects[currentIndex < projects.length - 1 ? currentIndex + 1 : 0].url;
        nextButton.title = currentIndex < projects.length - 1 ? projects[currentIndex + 1].name : projects[0].name;
        nextButton.setAttribute('data-bs-toggle', 'tooltip');
        nextButton.setAttribute('data-bs-placement', 'left');

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