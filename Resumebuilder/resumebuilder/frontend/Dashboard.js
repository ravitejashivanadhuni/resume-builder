// script.js

// Add functionality for Logout Button
document.getElementById('logout-button').addEventListener('click', function() {
    // Confirm if the user wants to log out
    const confirmation = confirm("Are you sure you want to log out?");
    
    if (confirmation) {
        // Redirect to login page (or any URL you want for logout)
        window.location.href = 'login.html';  // Redirect to login page after logout
    }
});

// Optional: Add hover animations or effects on the cards
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';  // Slight zoom in effect
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';  // Return to original size
    });
});

// Optional: Handle navigation of cards (if needed for interactive actions)
document.getElementById('create-resume').addEventListener('click', function() {
    alert('You clicked Create Resume!');
    // You can add redirection or additional logic for each card
});
document.getElementById('upgrade-resume').addEventListener('click', function() {
    alert('You clicked Upgrade Resume!');
    // More interactions here
});
document.getElementById('ats-score').addEventListener('click', function() {
    alert('You clicked ATS Score!');
});
document.getElementById('my-projects').addEventListener('click', function() {
    alert('You clicked My Projects!');
});
