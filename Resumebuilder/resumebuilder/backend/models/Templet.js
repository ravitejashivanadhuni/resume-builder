const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  title: String,
  description: String,
  fields: [String],
  withPhoto: Boolean,
  imagePreview: String,
  templatePath: String,
  editableFields: Object
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
