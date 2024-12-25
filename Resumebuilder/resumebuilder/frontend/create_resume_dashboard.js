document.addEventListener('DOMContentLoaded', () => {
    const importButton = document.getElementById('import-template');
    const exploreButton = document.getElementById('explore-templates');

    // Redirect to Import Template Page
    importButton.addEventListener('click', () => {
        window.location.href = 'import_template.html';
    });

    // Redirect to Explore Templates Page
    exploreButton.addEventListener('click', () => {
        window.location.href = 'explore_templates.html';
    });
});
