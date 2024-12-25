const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // Missing bcrypt module was not included
const User = require('./models/User');
const authRoutes = require('./routes/authroutes');
const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Temporary in-memory OTP store (use Redis for production)
const otpStore = new Map(); // Maps email to OTP and timestamp

// Create a transport for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  const { email, firstName, lastName } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  const expirationTime = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes

  // Store OTP in memory (or Redis for production)
  otpStore.set(email, { otp, expirationTime });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Registration',
    text: `Hello ${firstName} ${lastName},\n\nYour OTP for registration is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'OTP sent to your email!' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Error sending OTP. Please try again later.' });
  }
});

// Route to verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore.has(email)) {
    return res.status(400).json({ success: false, message: 'No OTP found for this email.' });
  }

  const { otp: storedOtp, expirationTime } = otpStore.get(email);

  if (Date.now() > expirationTime) {
    otpStore.delete(email); // Remove expired OTP
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
  }

  if (parseInt(otp, 10) !== storedOtp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
  }

  otpStore.delete(email); // OTP verified, remove it
  res.status(200).json({ success: true, message: 'OTP verified successfully!' });
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid email or password!' });
    }

    res.status(200).json({ success: true, message: 'Login successful!' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
});

// Forgot Password Route
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'No account found with this email.' });
    }

    // Generate a reset token (you can use JWT or random strings)
    const resetToken = Math.random().toString(36).substr(2);
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Send reset email
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password.html?token=${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link to reset your password: ${resetLink}`,
    });

    res.status(200).json({ success: true, message: 'Password reset link sent to your email!' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
  }
});

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
