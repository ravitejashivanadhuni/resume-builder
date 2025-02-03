// Sample templates (these can be fetched from your backend in real implementation)
const templates = [
    { id: 1, name: "Modern Template", image: "template1.png" },
    { id: 2, name: "Classic Template", image: "template2.png" },
    { id: 3, name: "Creative Template", image: "template3.png" },
  ];
  
  // Render templates dynamically
  const templateList = document.getElementById('templateList');
  templates.forEach(template => {
    const card = document.createElement('div');
    card.classList.add('template-card');
    card.dataset.templateId = template.id;
  
    card.innerHTML = `
      <img src="${template.image}" alt="${template.name}">
      <h3>${template.name}</h3>
    `;
  
    card.addEventListener('click', () => {
      // Mark selected template
      document.querySelectorAll('.template-card').forEach(card => {
        card.style.border = '1px solid #ccc';
      });
      card.style.border = '2px solid #007bff';
  
      // Save selected template to localStorage
      localStorage.setItem('selectedTemplate', JSON.stringify(template));
    });
  
    templateList.appendChild(card);
  });
  
  // Handle Generate Resume button
  document.getElementById('generateButton').addEventListener('click', () => {
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    if (!selectedTemplate) {
      alert('Please select a template to proceed.');
      return;
    }
  
    window.location.href = 'generate-resume.html'; // Redirect to resume generation page
  });
  