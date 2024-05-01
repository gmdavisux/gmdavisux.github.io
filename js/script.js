// Load the projects from the JSON file
fetch('js/projects.json')
    .then(response => response.json())
    .then(projects => {
        // Get the current page from the URL query parameter
        const params = new URLSearchParams(window.location.search);
        const currentPage = '?page=' + params.get('page');

        // Check if the page query parameter is in the JSON list
        const currentIndex = projects.findIndex(project => project.url === currentPage);
        if (currentIndex !== -1) {
            // Create the "prev" button
            const prevButton = document.createElement('a');
            prevButton.className = 'btn btn-secondary position-fixed start-0 translate-middle-y bi bi-arrow-left opacity-50';
            prevButton.style.top = '50%';
            prevButton.style.margin = '1em';
            prevButton.href = currentIndex > 0 ? projects[currentIndex - 1].url : projects[projects.length - 1].url;
            prevButton.title = currentIndex > 0 ? projects[currentIndex - 1].name : projects[projects.length - 1].name;
            prevButton.setAttribute('data-bs-toggle', 'tooltip');
            prevButton.setAttribute('data-bs-placement', 'right');
            document.body.appendChild(prevButton);

            // Create the "next" button
            const nextButton = document.createElement('a');
            nextButton.className = 'btn btn-secondary position-fixed end-0 translate-middle-y bi bi-arrow-right opacity-50';
            nextButton.style.top = '50%';
            nextButton.style.margin = '1em';
            nextButton.href = currentIndex < projects.length - 1 ? projects[currentIndex + 1].url : projects[0].url;
            nextButton.title = currentIndex < projects.length - 1 ? projects[currentIndex + 1].name : projects[0].name;
            nextButton.setAttribute('data-bs-toggle', 'tooltip');
            nextButton.setAttribute('data-bs-placement', 'left');
            document.body.appendChild(nextButton);
        }

        // Initialize Bootstrap tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    });