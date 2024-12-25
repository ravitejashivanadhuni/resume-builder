document.addEventListener('DOMContentLoaded', () => {
    // Highlight the current active navigation link
    const currentPage = window.location.pathname.split('/').pop(); // Get current page
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
