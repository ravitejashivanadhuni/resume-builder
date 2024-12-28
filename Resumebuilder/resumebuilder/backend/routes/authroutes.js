const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Registration Route
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  console.log('Incoming registration request:', req.body);

  // Validate input
  if (!firstName || !lastName || !email || !password) {
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

    // Create and save user
    const user = new User({
      firstName,
      lastName,
      email,
      password, // Plain password here, the schema middleware will hash it
    });

    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Entered password:", password);
    console.log("Stored password hash:", user.password);
    console.log("Is password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});




// Get User Data Route
router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.error('Unauthorized access attempt');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // Exclude the password

    if (!user) {
      console.error('User not found for ID:', decoded.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User data fetched successfully for ID:', decoded.id);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
