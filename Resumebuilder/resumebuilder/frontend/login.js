document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');

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

  // Add show password toggle functionality
  const passwordToggles = document.querySelectorAll('.show-password-toggle');
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener('change', (e) => {
      const passwordField = document.querySelector(`#${toggle.dataset.target}`);
      passwordField.type = toggle.checked ? 'text' : 'password';
    });
  });

  // Add "Forgot Password" functionality
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      const email = prompt('Enter your registered email to reset password:');
      if (email) {
        sendForgotPasswordRequest(email);
      }
    });
  }

  highlightActiveNav(); // Highlight the active navigation item
});

// Handle Register Form
function handleRegister(data) {
  if (data.password !== data.confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  localStorage.setItem('user', JSON.stringify(data));
  alert('Registration successful!');
  window.location.href = 'login.html';
}

// Handle Login Form
function handleLogin(data) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.email === data.email && user.password === data.password) {
    alert('Login successful!');
    window.location.href = 'dashboard.html'; // Redirect to the dashboard after successful login
  } else {
    alert('Invalid email or password!');
  }
}

// Handle Forgot Password Request
function sendForgotPasswordRequest(email) {
  fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert('Password reset instructions sent to your email!');
      } else {
        alert(`Error: ${data.message}`);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    });
}

// Handle Contact Form
function handleContact(data) {
  alert('Thank you for reaching out! We will get back to you soon.');
}

// Dynamic Navigation Highlight
function highlightActiveNav() {
  const navLinks = document.querySelectorAll('nav a');
  const currentPage = window.location.pathname.split('/').pop();

  navLinks.forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.style.backgroundColor = '#4CAF50';
    } else {
      link.style.backgroundColor = '';
    }
  });
}
