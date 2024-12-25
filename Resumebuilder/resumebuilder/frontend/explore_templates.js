// JavaScript to handle the click events on experience cards and redirect based on the selected experience
document.querySelectorAll('.experience-card').forEach(card => {
    card.addEventListener('click', () => {
        const experienceLevel = card.getAttribute('data-experience');
        
        // Redirect based on experience level
        if (experienceLevel === "No Experience") {
            window.location.href = 'no_experience_dashboard.html';
        } else if (experienceLevel === "Entry-Level") {
            window.location.href = 'entry_level_dashboard.html';
        } else if (experienceLevel === "Mid-Level") {
            window.location.href = 'mid_level_dashboard.html';
        } else if (experienceLevel === "Senior") {
            window.location.href = 'senior_dashboard.html';
        }
    });
});
