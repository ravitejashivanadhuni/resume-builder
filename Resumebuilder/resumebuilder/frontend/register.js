document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const registerButton = document.getElementById('register-button');
    const otpSection = document.getElementById('otp-section');
    const otpInput = document.getElementById('otp');
    const verifyOtpButton = document.getElementById('verify-otp');
    const googleLoginButton = document.getElementById('google-login');
    const appleLoginButton = document.getElementById('apple-login');
    const apiBaseUrl = 'http://localhost:5000/api/auth'; // Adjust this as per your backend URL.

    // Handle the show password toggle
    const showPasswordToggles = document.querySelectorAll('.show-password-toggle');
    showPasswordToggles.forEach(toggle => {
        toggle.addEventListener('change', (event) => {
            const targetId = event.target.dataset.target;
            const targetInput = document.getElementById(targetId);
            if (event.target.checked) {
                targetInput.type = 'text'; // Show the password
            } else {
                targetInput.type = 'password'; // Hide the password
            }
        });
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
            alert('Passwords do not match!');
            return;
        }

        // Send OTP to Email
        try {
            await sendOtpToEmail(email, firstName, lastName);
            // Show OTP input field
            otpSection.style.display = 'block';
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Error sending OTP. Please try again.');
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
        alert('OTP sent to your email!');
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
                alert('OTP verified successfully!');
                createAccount(); // Proceed to account creation
            } else {
                alert(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('OTP verification failed:', error);
            alert('Error verifying OTP. Please try again.');
        }
    });

    // Simulate account creation (replace with actual backend account creation logic)
    function createAccount() {
        alert('Account created successfully!');
        registerForm.reset();
        otpSection.style.display = 'none'; // Hide OTP section after successful registration
    }

    // Google Login (Simulated)
    googleLoginButton.addEventListener('click', () => {
        alert('Logging in with Google...');
        fakeGoogleLogin();
    });

    function fakeGoogleLogin() {
        alert('Google login successful!');
    }

    // Apple Login (Simulated)
    appleLoginButton.addEventListener('click', () => {
        alert('Logging in with Apple...');
        fakeAppleLogin();
    });

    function fakeAppleLogin() {
        alert('Apple login successful!');
    }
});
