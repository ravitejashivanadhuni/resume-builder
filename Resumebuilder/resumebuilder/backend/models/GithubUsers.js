const mongoose = require('mongoose');

const githubUserSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const GithubUser = mongoose.model('GithubUser', githubUserSchema);

module.exports = GithubUser;
