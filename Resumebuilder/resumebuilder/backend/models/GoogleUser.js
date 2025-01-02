const mongoose = require('mongoose');

// Define the schema for the GoogleUser
const googleUserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
}, { timestamps: true });

// Create the GoogleUser model based on the schema
const GoogleUser = mongoose.model('GoogleUser', googleUserSchema);

module.exports = GoogleUser;
