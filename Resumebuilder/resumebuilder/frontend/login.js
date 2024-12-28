document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  const messageDisplay = document.getElementById('message-display'); // Message display element

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      if (form.id === 'register-form') {
        handleRegister(data);
      } else if (form.id === 'login-form') {
        handleLogin(data);
      } else if (form.id === 'contact-form') {
        handleContact(data);
      }
    });
  });

  const passwordToggles = document.querySelectorAll('.show-password-toggle');
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener('change', () => {
      const passwordField = document.querySelector(`#${toggle.dataset.target}`);
      if (passwordField) {
        passwordField.type = toggle.checked ? 'text' : 'password';
      }
    });
  });

  highlightActiveNav();
});

function handleRegister(data) {
  const messageDisplay = document.getElementById('message-display');
  if (data.password !== data.confirmPassword) {
    messageDisplay.textContent = 'Passwords do not match!';
    messageDisplay.style.color = 'red';
    return;
  }

  fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        messageDisplay.textContent = 'Registration successful! Please log in.';
        messageDisplay.style.color = 'green';
        setTimeout(() => window.location.href = 'login.html', 2000); // Redirect after 2 seconds
      } else {
        messageDisplay.textContent = result.message || 'Registration failed! Please try again.';
        messageDisplay.style.color = 'red';
      }
    })
    .catch((error) => {
      console.error('Error during registration:', error);
      messageDisplay.textContent = 'An error occurred. Please try again later.';
      messageDisplay.style.color = 'red';
    });
}

function handleLogin(data) {
  const messageDisplay = document.getElementById('message-display');
  fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        messageDisplay.textContent = 'Login successful!';
        messageDisplay.style.color = 'green';
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setTimeout(() => window.location.href = '/Dashboard.html', 2000); // Redirect after 2 seconds
      } else {
        messageDisplay.textContent = result.message || 'Invalid email or password!';
        messageDisplay.style.color = 'red';
      }
    })
    .catch((error) => {
      console.error('Error during login:', error);
      messageDisplay.textContent = 'An error occurred. Please try again later.';
      messageDisplay.style.color = 'red';
    });
}

function handleContact(data) {
  alert('Thank you for reaching out! We will get back to you soon.');
}

function highlightActiveNav() {
  const navLinks = document.querySelectorAll('nav a');
  const currentPage = window.location.pathname.split('/').pop();

  navLinks.forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
