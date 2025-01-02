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
  fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      const messageDisplay = document.getElementById('messageDisplay');
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
      const messageDisplay = document.getElementById('messageDisplay');
      if (messageDisplay) {
        messageDisplay.textContent = 'An error occurred. Please try again later.';
        messageDisplay.style.color = 'red';
      } else {
        console.error('Message display element not found!');
      }
    })
}

// Handle Google Sign-In
window.onload = () => {
  google.accounts.id.initialize({
      client_id: "335892097508-qi6munbgs0n52h2gf4fbluf72r242lkt.apps.googleusercontent.com", // Replace with your Google Client ID
      callback: handleGoogleLogin,
  });

  // Render Google Sign-In button
  google.accounts.id.renderButton(
      document.querySelector('.g_id_signin'),
      { theme: "outline", size: "large" }
  );
};

function handleGoogleLogin(response) {
  const idToken = response.credential; // Ensure the credential (idToken) is extracted from response
  console.log('Google ID Token:', idToken); // Log the token for debugging

  if (!idToken) {
      console.error("Google ID Token is missing");
      return;
  }

  // Send the token to the backend for login
  fetch('/api/auth/google-login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
  })
      .then((res) => res.json())
      .then((result) => {
          const messageDisplay = document.getElementById('messageDisplay');
          if (result.success) {
              messageDisplay.textContent = 'Login successful!';
              messageDisplay.style.color = 'green';
              localStorage.setItem('user', JSON.stringify(result.user));
              setTimeout(() => window.location.href = '/Dashboard.html', 2000); // Redirect to dashboard
          } else {
              messageDisplay.textContent = result.message || 'Login failed!';
              messageDisplay.style.color = 'red';
          }
      })
      .catch((error) => {
          console.error('Error during Google login:', error);
          const messageDisplay = document.getElementById('messageDisplay');
          messageDisplay.textContent = 'An error occurred. Please try again later.';
          messageDisplay.style.color = 'red';
      });
}


// JWT Token Generation (Helper Function)
function generateToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    'your_secret_key', // Use a strong secret key for JWT generation
    { expiresIn: '1h' }
  );
}

module.exports = {
  googleLogin,
};


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
