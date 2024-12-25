document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const successMessage = document.createElement('p');
    successMessage.textContent = 'Your message has been sent successfully!';
    successMessage.style.color = 'green';
    successMessage.style.fontWeight = 'bold';
    successMessage.style.display = 'none';
    form.parentElement.appendChild(successMessage);
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
      
      // Basic validation (you can add more as needed)
      if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
        alert('Please fill in all fields.');
        return;
      }
  
      // Send the form data to Formspree
      fetch(form.action, {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (response.ok) {
            successMessage.style.display = 'block';
            form.reset();
          } else {
            alert('There was an error sending your message. Please try again.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('There was an error sending your message. Please try again.');
        });
    });
  });
  