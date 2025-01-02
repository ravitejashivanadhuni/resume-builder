const { calculateATSScore, generateSuggestions } = require('./atsScore');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('335892097508-qi6munbgs0n52h2gf4fbluf72r242lkt.apps.googleusercontent.com'); // Use your Google client ID
const GitHubStrategy = require('passport-github').Strategy;
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const atsScoreRoutes = require('./atsScore');
const User = require('./models/User');
const GoogleUser = require('./models/GoogleUser'); // Adjust the path if necessary
const Template = require('./models/Template'); // Ensure you have this path correct
const templateRoutes = require('./routes/templateRoutes');
const authRoutes = require('./routes/authroutes');
const googleAuthRoutes = require('./routes/authroutes');
const cors = require('cors');
const GithubUser = require('./models/GithubUsers'); // The model for GitHub users
const MongoStore = require('connect-mongo');

dotenv.config();
const app = express();


// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'nzw29YH6hpFE53JZ7XUdN8RDSmBAKket', // Replace with a secure key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Optional: Store sessions in MongoDB
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Initialize Passport and session management
app.use(passport.initialize());
app.use(passport.session());

let userLogged = false; // Flag to check if user has been logged

app.use((req, res, next) => {
  // Log only once when the user is available and hasn't been logged before
  if (req.user && !userLogged) {
    console.log("Authenticated User:", req.user);
    userLogged = true; // Set the flag to true to prevent further logging
  }
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // To handle CORS

// Use auth routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes); // For template-related routes
app.use('/api/auth', googleAuthRoutes);
// Use ATS Score routes
app.use('/api/ats', atsScoreRoutes);




// Temporary in-memory OTP store (use Redis for production)
const otpStore = new Map(); // Maps email to OTP and timestamp

// Email transporter
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

// Registration route
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore.has(email)) {
    return res.status(400).json({ success: false, message: 'No OTP found for this email.' });
  }

  const { otp: storedOtp, expirationTime } = otpStore.get(email);

  if (Date.now() > expirationTime) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
  }

  if (parseInt(otp, 10) !== storedOtp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
  }

  otpStore.delete(email);
  res.status(200).json({ success: true, message: 'OTP verified successfully!' });
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Log the entered and stored password for debugging
    console.log('Entered password:', password);
    console.log('Stored password hash:', user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Is password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

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
    console.error('Error in login route:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Forgot password route
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Generate a JWT reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Generate the reset link
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password.html?token=${resetToken}`;

    // Send email with the reset link
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    });

    res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
  }
});

// Serve reset-password.html
app.get('/reset-password.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/reset-password.html'));
});

// Reset Password Route
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Token and new password are required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Directly assign the new password, which will trigger the hashing in the `pre('save')` middleware
    user.password = password;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ success: false, message: 'Token has expired. Please request a new password reset.' });
    }

    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

//check whether the user with an entered email exist or not
app.post('/api/auth/check-user', async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (user) {
          return res.status(200).json({ exists: true, message: 'User with this email already exists.' });
      }
      res.status(200).json({ exists: false });
  } catch (error) {
      console.error('Error checking user:', error);
      res.status(500).json({ message: 'Error checking email. Please try again later.' });
  }
});

// Seed route (This will seed the templates without removing existing ones)
app.post('/seed-templates', async (req, res) => {
  try {
      // Assuming your seed data is in a file called `templatesData.js`
      const templatesData = require('./seedData/templatesData'); // Adjust the path accordingly
      
      // Loop through each template and insert it if it doesn't exist already
      for (const template of templatesData) {
          // Check if the template already exists based on the title
          const existingTemplate = await Template.findOne({ title: template.title });

          if (!existingTemplate) {
              // Insert template if it doesn't already exist
              await Template.create(template);
              console.log(`Template "${template.title}" seeded`);
          } else {
              console.log(`Template "${template.title}" already exists`);
          }
      }

      res.status(200).send('Templates seeded successfully');
  } catch (error) {
      console.error('Error seeding database:', error);
      res.status(500).send('Error seeding templates');
  }
});

// Get all templates route
app.get('/templates', async (req, res) => {
  try {
      const templates = await Template.find();
      res.status(200).json(templates);
  } catch (err) {
      res.status(500).json({ message: 'Error retrieving templates' });
  }
});

// Route to handle ATS score calculation
app.post('/api/ats/check-score', (req, res) => {
  const { field, resumeContent } = req.body;

  if (!field || !resumeContent) {
      return res.status(400).json({ message: 'Field and resume content are required.' });
  }

  try {
      const atsScore = calculateATSScore(field, resumeContent);
      const suggestions = generateSuggestions(field, atsScore);

      res.status(200).json({ atsScore, suggestions });
  } catch (error) {
      console.error('Error calculating ATS score:', error);
      res.status(500).json({ message: 'Error calculating ATS score.' });
  }
});

// This is your backend route for verifying the token


app.post('/api/auth/google-signup', async (req, res) => {
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
 // Send back user data and a success response
 res.status(200).send({
  success: true,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
  },
  token: idToken, // Or issue a JWT token for your application session
});
} catch (error) {
console.error('Error verifying Google token:', error);
res.status(400).send({ success: false, message: 'Invalid token', error: error.message });
}
});


passport.serializeUser((user, done) => {
  //console.log('Serializing user:', user); // Log user object
  done(null, user._id); // Store unique identifier
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await GithubUser.findById(id); // Ensure this matches your user model
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});





// Configure GitHub strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('GitHub Profile Received:', profile);
        let user = await GithubUser.findOne({ githubId: profile.id });
        if (!user) {
          user = await GithubUser.create({
            githubId: profile.id,
            username: profile.username,
            profilePic: profile.photos?.[0]?.value || 'https://path/to/default/avatar.png',
          });
        }
        return done(null, user); // Pass user to next step
      } catch (err) {
        return done(err);
      }
    }
  )
);


// GitHub authentication route
app.get('/api/auth/github', passport.authenticate('github'));

// GitHub callback route
app.get(
  '/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      // Log authenticated user
      console.log('Authenticated User (req.user):', req.user);

      // Check if req.user exists
      if (!req.user) {
        return res.status(400).send('User not found in session');
      }

      // Extract profile data from req.user
      const { githubId, username, photos } = req.user;
      const profilePic = (photos && Array.isArray(photos) && photos.length > 0)
        ? photos[0].value
        : 'https://path/to/default/avatar.png'; // Default profile picture

      // Check if user exists in the database
      let user = await GithubUser.findOne({ githubId });
      if (!user) {
        // Create a new user if not found
        user = await GithubUser.create({ githubId, username, profilePic });
        console.log('New user created:', user);
      }

      // Save user in session
      req.session.user = user;
      console.log('User saved to session:', req.session.user);

      // Redirect to dashboard
      res.redirect('/Dashboard.html');
    } catch (err) {
      console.error('Error in GitHub callback route:', err);
      res.status(500).send('Internal server error');
    }
  }
);


app.get('/api/auth/check-session', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send({ success: true, user: req.user });
  } else {
    res.status(401).send({ success: false, message: 'User not logged in' });
  }
});

// Serve Dashboard.html explicitly
app.get('/Dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Dashboard.html'), (err) => {
    if (err) {
      res.status(500).send('Error loading Dashboard page.');
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });

