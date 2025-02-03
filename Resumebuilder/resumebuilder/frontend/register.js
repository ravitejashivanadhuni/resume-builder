document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const registerButton = document.getElementById('register-button');
    const otpSection = document.getElementById('otp-section');
    const otpInput = document.getElementById('otp');
    const verifyOtpButton = document.getElementById('verify-otp');
    const googleLoginButton = document.getElementById('google-login');
    const apiBaseUrl = 'http://localhost:5000/api/auth'; // Adjust this as per your backend URL.
    const messageDisplay = document.getElementById('message-display');
    const emailInput = document.getElementById('email');
    const emailExistenceMessage = document.getElementById('email-existence-message');
    const showPasswordToggle = document.getElementById('show-password-toggle');
    const passwordInput = document.getElementById('password');
    const passwordStrengthText = document.getElementById('password-strength');
    const passwordSuggestion = document.getElementById('password-suggestion');
    //const githubLoginButton = document.querySelector("github-login-button");

    // Handle the show password toggle
    showPasswordToggle.addEventListener('change', (event) => {
        const confirmPasswordInput = document.getElementById('confirm-password');
        if (event.target.checked) {
            passwordInput.type = 'text'; // Show password
            confirmPasswordInput.type = 'text'; // Show confirm password
        } else {
            passwordInput.type = 'password'; // Hide password
            confirmPasswordInput.type = 'password'; // Hide confirm password
        }
    });

    // Handle Register Button Click
    registerButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent the form from submitting normally

        // Get form values
        const firstName = registerForm['firstName'].value;
        const lastName = registerForm['lastName'].value;
        const email = registerForm['email'].value;
        const password = registerForm['password'].value;
        const confirmPassword = registerForm['confirmPassword'].value;

        // Simple password validation
        if (password !== confirmPassword) {
            messageDisplay.textContent = 'Passwords do not match!';
            messageDisplay.style.color = 'red';
            return;
        }

        // Check email validity
        if (!validateEmail(email)) {
            messageDisplay.textContent = 'Please enter a valid email address.';
            messageDisplay.style.color = 'red';
            return;
        }

        // Send OTP to Email
        try {
            await sendOtpToEmail(email, firstName, lastName);
            otpSection.style.display = 'block';
            messageDisplay.textContent = 'OTP sent to your email!';
            messageDisplay.style.color = 'green';
        } catch (error) {
            console.error('Error sending OTP:', error);
            messageDisplay.textContent = 'Error sending OTP. Please try again.';
            messageDisplay.style.color = 'red';
        }
    });

    // Send OTP to the email via API
    async function sendOtpToEmail(email, firstName, lastName) {
        const response = await fetch(`${apiBaseUrl}/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, firstName, lastName }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to send OTP');
        }
    }

    // Update OTP boxes input handling for 6 digits
document.querySelectorAll('.otp-box').forEach((otpBox, index) => {
    otpBox.addEventListener('input', (event) => {
      const nextOtpBox = document.querySelector(`#otp${index + 2}`);
      if (nextOtpBox && event.target.value) {
        nextOtpBox.focus(); // Focus on the next box after entering a digit
      }
    });
  });
  
  // Handle OTP verification with the 6-digit OTP
  verifyOtpButton.addEventListener('click', async () => {
    const otp = Array.from(document.querySelectorAll('.otp-box')).map(otpBox => otpBox.value).join('');
    const email = registerForm['email'].value;
  
    try {
      const response = await fetch(`${apiBaseUrl}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
  
      if (data.success) {
        messageDisplay.textContent = 'OTP verified successfully!';
        messageDisplay.style.color = 'green';
        createAccount(); // Proceed to account creation
      } else {
        messageDisplay.textContent = data.message || 'Invalid OTP. Please try again.';
        messageDisplay.style.color = 'red';
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      messageDisplay.textContent = 'Error verifying OTP. Please try again.';
      messageDisplay.style.color = 'red';
    }
  });
  
    // Simulate account creation (replace with actual backend account creation logic)
    async function createAccount() {
        const firstName = registerForm['firstName'].value;
        const lastName = registerForm['lastName'].value;
        const email = registerForm['email'].value;
        const password = registerForm['password'].value;

        try {
            const response = await fetch(`${apiBaseUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName, // Send first name separately
                    lastName,  // Send last name separately
                    email,
                    password
                })
            });

            const data = await response.json();
            if (response.ok) {
                messageDisplay.textContent = 'Account created successfully!';
                messageDisplay.style.color = 'green';
                registerForm.reset();
                otpSection.style.display = 'none'; // Hide OTP section after successful registration
                window.location.href = 'login.html';
            } else {
                messageDisplay.textContent = data.message || 'Error creating account';
                messageDisplay.style.color = 'red';
            }
        } catch (error) {
            console.error('Account creation failed:', error);
            messageDisplay.textContent = 'Error creating account. Please try again.';
            messageDisplay.style.color = 'red';
        }
    }


    // Password Strength Indicator Logic
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const suggestions = [];
        const strength = evaluatePasswordStrength(password, suggestions);

        passwordStrengthText.textContent = `${strength.charAt(0).toUpperCase() + strength.slice(1)} Password`;
        passwordStrengthText.className = `password-strength ${strength}`;

        if (suggestions.length > 0) {
            passwordSuggestion.style.display = 'block';
            passwordSuggestion.textContent = `Suggestions: ${suggestions.join(', ')}`;
        } else {
            passwordSuggestion.style.display = 'none';
        }
    });

    function evaluatePasswordStrength(password, suggestions) {
        if (password.length < 3) {
            passwordStrengthText.textContent = '';
            passwordSuggestion.style.display = 'none';
            return 'too short';
        }

        const lengthCriteria = password.length >= 8;
        const upperCase = /[A-Z]/.test(password);
        const lowerCase = /[a-z]/.test(password);
        const number = /\d/.test(password);
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!upperCase) suggestions.push('Add at least one uppercase letter');
        if (!lowerCase) suggestions.push('Add at least one lowercase letter');
        if (!number) suggestions.push('Include at least one number');
        if (!specialChar) suggestions.push('Include at least one special character');
        if (password.length < 8) suggestions.push('Make the password at least 8 characters long');

        if (lengthCriteria && upperCase && lowerCase && number && specialChar) {
            return 'strong';
        }
        if (lengthCriteria && ((upperCase && lowerCase) || number || specialChar)) {
            return 'medium';
        }
        return 'weak';
    }

    // Check if email already exists
    let debounceTimer;
    emailInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const email = emailInput.value.trim();

        debounceTimer = setTimeout(async () => {
            if (email) {
                try {
                    const response = await fetch('/api/auth/check-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                    });

                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status}`);
                    }

                    const data = await response.json();
                    if (data.exists) {
                        emailExistenceMessage.textContent = 'User with this email already exists.';
                        emailExistenceMessage.style.color = 'red';
                    } else {
                        emailExistenceMessage.textContent = '';
                    }
                } catch (error) {
                    console.error('Error checking email existence:', error);
                    emailExistenceMessage.textContent = 'Error checking email. Please try again.';
                    emailExistenceMessage.style.color = 'red';
                }
            } else {
                emailExistenceMessage.textContent = '';
            }
        }, 500);
    });

    // Handle Google Sign-In for Registration
window.onload = () => {
    google.accounts.id.initialize({
      client_id: "335892097508-qi6munbgs0n52h2gf4fbluf72r242lkt.apps.googleusercontent.com", // Google Client ID
      callback: handleGoogleSignUp,
    });
  
    // Render Google Sign-In button
    google.accounts.id.renderButton(
      document.querySelector('.g_id_signin'),
      { theme: "outline", size: "large" ,text: "signup_with" }
    );
  };
  
  function handleGoogleSignUp(response) {
    const idToken = response.credential; // the credential (idToken) is extracted from response
    console.log('Google ID Token:', idToken); // Log the token for debugging
  
    // Check if the idToken exists before sending it to the backend
    if (!idToken) {
      console.error("Google ID Token is missing");
      return;
    }
  
    // Send the token to the backend for registration or login
    fetch('/api/auth/google-signup', { // Use a specific endpoint for Google Sign-Up
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }) // Send idToken to backend
    })
      .then((res) => res.json())
      .then((result) => {
        const messageDisplay = document.getElementById('message-display');
        if (result.success) {
          // User is successfully logged in after Google Sign-Up
          messageDisplay.textContent = 'Registration and Login successful!';
          messageDisplay.style.color = 'green';
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          setTimeout(() => window.location.href = '/Dashboard.html', 2000); // Redirect to dashboard
        } else {
          // Handle errors from the backend
          messageDisplay.textContent = result.message || 'Google Sign-Up failed!';
          messageDisplay.style.color = 'red';
        }
      })
      .catch((error) => {
        console.error('Error during Google sign-up:', error);
        const messageDisplay = document.getElementById('message-display');
        if (messageDisplay) {
          messageDisplay.textContent = 'An error occurred. Please try again later.';
          messageDisplay.style.color = 'red';
        } else {
          console.error('Message display element not found!');
        }
      });
  }

 // Handle GitHub Login button click
 document.getElementById('github-signup-btn').addEventListener('click', () => {
    window.location.href ='http://localhost:5000/api/auth/github'; // Backend endpoint for GitHub authentication
  });
  


    // Simple Email Validation
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    }
});
