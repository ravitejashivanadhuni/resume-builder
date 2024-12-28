document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#forgot-password-form');
  const messageDisplay = document.querySelector('#message-display');

  // Handle form submission
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
        messageDisplay.textContent = 'A password reset link has been sent to your email!';
        messageDisplay.style.color = 'green';
      } else {
        messageDisplay.textContent = result.message || 'Unable to process the request. Please try again.';
        messageDisplay.style.color = 'red';
      }
    } catch (error) {
      console.error('Error during forgot password:', error);
      messageDisplay.textContent = 'An error occurred. Please try again later.';
      messageDisplay.style.color = 'red';
    }

    // Smooth scroll to the message display
    messageDisplay.scrollIntoView({ behavior: 'smooth' });
  });
});
