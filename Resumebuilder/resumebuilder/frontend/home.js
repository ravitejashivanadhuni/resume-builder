document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Navigation Highlight
    const navLinks = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname.split('/').pop();
  
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === currentPage) {
        link.style.backgroundColor = '#ffffff';
        link.style.color = '#2575fc';
        link.style.transform = 'scale(1.1)';
      }
    });
  });
  