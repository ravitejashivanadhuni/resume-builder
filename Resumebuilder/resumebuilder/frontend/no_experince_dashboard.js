document.addEventListener("DOMContentLoaded", () => {
    // Example template data (this could come from your backend API)
    const templates = [
        {
            id: 1,
            name: "Minimalist Template",
            image: "https://via.placeholder.com/250x200.png?text=Minimalist+Template"
        },
        {
            id: 2,
            name: "Professional Template",
            image: "https://via.placeholder.com/250x200.png?text=Professional+Template"
        },
        {
            id: 3,
            name: "Creative Template",
            image: "https://via.placeholder.com/250x200.png?text=Creative+Template"
        },
        {
            id: 4,
            name: "Modern Template",
            image: "https://via.placeholder.com/250x200.png?text=Modern+Template"
        }
    ];

    // Get the template grid container
    const templateGrid = document.getElementById('template-grid');
    
    // Loop through templates and display each in the grid
    templates.forEach(template => {
        const templateCard = document.createElement('div');
        templateCard.className = 'template-card';
        
        // Populate template card with an image and name
        templateCard.innerHTML = `
            <img src="${template.image}" alt="${template.name}" />
            <p>${template.name}</p>
        `;
        
        // Add click event to redirect to the editor when the template is clicked
        templateCard.onclick = () => {
            window.location.href = `/editor/${template.id}`;
        };
        
        // Append the card to the grid
        templateGrid.appendChild(templateCard);
    });
});
