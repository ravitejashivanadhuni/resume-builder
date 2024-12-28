document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#reset-password-form');
    const messageDisplay = document.createElement('p');
    messageDisplay.id = 'message-display';
    messageDisplay.style.textAlign = 'center';
    form.insertAdjacentElement('beforebegin', messageDisplay);

    // Extract the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        messageDisplay.textContent = 'Reset token missing. Please request a password reset again.';
        messageDisplay.style.color = 'red';
        setTimeout(() => (window.location.href = 'forgot-password.html'), 3000);
        return;
    }

    document.querySelector('#token').value = token;

    // Toggle password visibility
    const showPasswordToggle = document.querySelector('#show-password-toggle');
    const passwordField = document.querySelector('#password');
    const confirmPasswordField = document.querySelector('#confirm-password');

    showPasswordToggle.addEventListener('change', () => {
        const type = showPasswordToggle.checked ? 'text' : 'password';
        passwordField.type = type;
        confirmPasswordField.type = type;
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!data.password || !data.confirmPassword) {
            messageDisplay.textContent = 'Both password fields are required.';
            messageDisplay.style.color = 'red';
            return;
        }

        if (data.password !== data.confirmPassword) {
            messageDisplay.textContent = 'Passwords do not match!';
            messageDisplay.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: data.password }),
            });

            const result = await response.json();

            if (result.success) {
                messageDisplay.textContent = 'Your password has been successfully reset!';
                messageDisplay.style.color = 'green';
                setTimeout(() => (window.location.href = 'login.html'), 3000);
            } else {
                messageDisplay.textContent = result.message || 'Unable to reset the password. Please try again.';
                messageDisplay.style.color = 'red';
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            messageDisplay.textContent = 'An error occurred. Please try again later.';
            messageDisplay.style.color = 'red';
        }
    });
});
