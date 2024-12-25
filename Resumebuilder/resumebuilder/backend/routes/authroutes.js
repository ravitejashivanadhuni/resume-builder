const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  console.log('Incoming registration request:', req.body);

  // Validate input
  if (!name || !email || !password) {
    console.error('Validation error: Missing fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create and save user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser);

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});



// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Match password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get User Data Route
router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // Exclude the password
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;