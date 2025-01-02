const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const GoogleUser = require('../models/GoogleUser');  // Import the Google User model
const User = require('../models/User'); // Ensure this path is correct
const { OAuth2Client } = require('google-auth-library');
//const GOOGLE_CLIENT_ID = '335892097508-qi6munbgs0n52h2gf4fbluf72r242lkt.apps.googleusercontent.com';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Ensure this matches the client ID in your Google console
const router = express.Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const GithubUser = require('../models/GithubUsers'); // The model for GitHub users
require('dotenv').config(); 

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login'); // Redirect to login if not authenticated
}

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




// POST route to verify Google login
router.post('/google-login', async (req, res) => {
  const { idToken } = req.body;

  console.log('Received idToken:', idToken); // Debugging step

  if (!idToken) {
      return res.status(400).send({ success: false, message: 'Token is required' });
  }

  try {
      // Verifying the token with Google's API
      const ticket = await client.verifyIdToken({
          idToken: idToken, // Token received from frontend
          audience: process.env.GOOGLE_CLIENT_ID, // Ensure the audience matches your client ID
      });

      const payload = ticket.getPayload(); // Contains user information
      console.log('Verified Google Token Payload:', payload); // Debugging step

      // Check if the user already exists in the GoogleUser collection
      const user = await GoogleUser.findOne({ googleId: payload.sub });

      if (user) {
          // If user exists, log them in
          res.status(200).send({
              success: true,
              user: {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  picture: user.picture,
              },
              message: 'Login successful!',
          });
      } else {
          // If user does not exist, return an error
          res.status(404).send({ success: false, message: 'User not registered. Please sign up first.' });
      }
  } catch (error) {
      console.error('Error verifying Google token:', error);
      res.status(400).send({ success: false, message: 'Invalid token', error: error.message });
  }
});


// POST route to verify Google token
router.post('/api/auth/google-signup', async (req, res) => {
  console.log('Request body:', req.body); // Log incoming request body
  const { token } = req.body;  // Make sure you extract 'token' from the request body

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required' });
  }

  try {
    // Verify the ID token using Google's OAuth2 client
    const ticket = await client.verifyIdToken({
      idToken: token,  // Use 'token' here, as sent from frontend
      audience: process.env.GOOGLE_CLIENT_ID,  // Ensure correct client ID
    });

    const payload = ticket.getPayload();

    // Check if the user already exists in the GoogleUser collection
    let user = await GoogleUser.findOne({ googleId: payload.sub });

    if (!user) {
      // If the user does not exist, create a new one
      user = new GoogleUser({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });
      await user.save();
    }

    // Respond with success and user information
    res.status(200).json({ success: true, user: payload, token: 'generated-jwt-token' }); // Make sure to generate and send a token
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// GitHub authentication route
router.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route
router.get(
  '/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      // Check if user is authenticated and `req.user` is populated
      if (!req.user) {
        console.error('Authentication failed: req.user is not set');
        return res.status(400).send('User not found');
      }

      console.log('Authenticated GitHub User:', req.user);

      // Check if user exists in DB
      let user = await GithubUser.findOne({ githubId: req.user.githubId });
      if (!user) {
        user = await GithubUser.create({
          githubId: req.user.githubId,
          username: req.user.username,
          profilePic: req.user.profilePic,
        });
        console.log('New user created:', user);
      }

      // Save user to session and redirect
      req.session.user = user;
      console.log('User saved to session:', req.session.user);
      res.redirect('/Dashboard.html');
    } catch (err) {
      console.error('Error handling GitHub callback:', err);
      res.status(500).send('Internal server error');
    }
  }
);

// Check session route (optional for testing)
router.get('/api/auth/check-session', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send({ success: true, user: req.user });
  } else {
    res.status(401).send({ success: false, message: 'User not logged in' });
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
