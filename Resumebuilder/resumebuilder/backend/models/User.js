const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
});

// Pre-save middleware to hash passwords
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
