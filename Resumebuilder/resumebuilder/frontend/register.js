document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const registerButton = document.getElementById('register-button');
    const otpSection = document.getElementById('otp-section');
    const otpInput = document.getElementById('otp');
    const verifyOtpButton = document.getElementById('verify-otp');
    const googleLoginButton = document.getElementById('google-login');
    const apiBaseUrl = 'http://localhost:5000/api/auth'; // Adjust this as per your backend URL.

    // Message display element
    const messageDisplay = document.getElementById('message-display');
    const emailInput = document.getElementById('email');
    const emailExistenceMessage = document.getElementById('email-existence-message');

    // Handle the show password toggle
    const showPasswordToggle = document.getElementById('show-password-toggle');
    showPasswordToggle.addEventListener('change', (event) => {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');

        if (event.target.checked) {
            passwordInput.type = 'text'; // Show the password
            confirmPasswordInput.type = 'text'; // Show confirm password
        } else {
            passwordInput.type = 'password'; // Hide the password
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
            // Show OTP input field
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

    // Handle OTP Verification
    verifyOtpButton.addEventListener('click', async () => {
        const enteredOtp = otpInput.value;
        const email = registerForm['email'].value;

        try {
            const response = await fetch(`${apiBaseUrl}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: enteredOtp }),
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
                // Redirect to login.html
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

    // Google Login (Simulated)
    googleLoginButton.addEventListener('click', () => {
        messageDisplay.textContent = 'Logging in with Google...';
        fakeGoogleLogin();
    });

    function fakeGoogleLogin() {
        messageDisplay.textContent = 'Google login successful!';
        messageDisplay.style.color = 'green';
    }

   // Password Strength Indicator Logic
const passwordInput = document.getElementById('password');
const passwordStrengthText = document.getElementById('password-strength');
const passwordSuggestion = document.getElementById('password-suggestion');

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const suggestions = [];
    const strength = evaluatePasswordStrength(password, suggestions);

    // Update the strength text and its class
    passwordStrengthText.textContent = `${strength.charAt(0).toUpperCase() + strength.slice(1)} Password`;
    passwordStrengthText.className = `password-strength ${strength}`;

    // Show suggestions if there are any
    if (suggestions.length > 0) {
        passwordSuggestion.style.display = 'block';
        passwordSuggestion.textContent = `Suggestions: ${suggestions.join(', ')}`;
    } else {
        passwordSuggestion.style.display = 'none';
    }
});

function evaluatePasswordStrength(password, suggestions) {
    if (password.length < 3) {
        // Avoid premature feedback
        passwordStrengthText.textContent = '';
        passwordSuggestion.style.display = 'none';
        return 'too short';
    }

    const lengthCriteria = password.length >= 8;
    const upperCase = /[A-Z]/.test(password);
    const lowerCase = /[a-z]/.test(password);
    const number = /\d/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Generate suggestions
    if (!upperCase) suggestions.push('Add at least one uppercase letter');
    if (!lowerCase) suggestions.push('Add at least one lowercase letter');
    if (!number) suggestions.push('Include at least one number');
    if (!specialChar) suggestions.push('Include at least one special character');
    if (password.length < 8) suggestions.push('Make the password at least 8 characters long');

    // Determine strength
    if (lengthCriteria && upperCase && lowerCase && number && specialChar) {
        return 'strong';
    }
    if (lengthCriteria && ((upperCase && lowerCase) || number || specialChar)) {
        return 'medium';
    }
    return 'weak';
}


    // Check if email already exists
    let debounceTimer; // To hold the debounce timer

    emailInput.addEventListener('input', () => {
        clearTimeout(debounceTimer); // Clear previous timer
        const email = emailInput.value.trim();
    
        // Debounce: Wait 500ms before making the API call
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
                        emailExistenceMessage.style.color = 'red'; // Optional styling
                    } else {
                        emailExistenceMessage.textContent = '';
                    }
                } catch (error) {
                    console.error('Error checking email existence:', error);
                    emailExistenceMessage.textContent = 'Error checking email. Please try again.';
                    emailExistenceMessage.style.color = 'red'; // Optional styling
                }
            } else {
                // Clear message if input is empty
                emailExistenceMessage.textContent = '';
            }
        }, 500); // Wait 500ms before making the API call
    });
    
    

    // Simple Email Validation
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    }
});
