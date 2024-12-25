document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#forgot-password-form');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      try {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
  
        if (result.success) {
          alert('A password reset link has been sent to your email!');
        } else {
          alert(result.message || 'Unable to process the request. Please try again.');
        }
      } catch (error) {
        console.error('Error during forgot password:', error);
        alert('An error occurred. Please try again later.');
      }
    });
  });
  