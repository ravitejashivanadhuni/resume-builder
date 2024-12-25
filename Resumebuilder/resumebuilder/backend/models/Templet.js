const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true }, // HTML content of the template
  category: { type: String, required: true }, // e.g., "No Experience", "Entry Level"
  createdAt: { type: Date, default: Date.now },
});

const Template = mongoose.model('Template', templateSchema);
module.exports = Template;
