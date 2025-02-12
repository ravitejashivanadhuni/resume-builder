const express = require('express');
const Template = require('../models/Template');
const router = express.Router();

// Route to get all templates
router.get('/api/templates', async (req, res) => {
  try {
    const templates = await Template.find(); // Fetch all templates
    res.json({ success: true, templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ success: false, message: 'Error fetching templates' });
  }
});

// Route to get templates by category (No Experience, Entry Level, etc.)
router.get('/api/templates/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const templates = await Template.find({ category }); // Fetch templates by category
    res.json({ success: true, templates });
  } catch (error) {
    console.error('Error fetching templates by category:', error);
    res.status(500).json({ success: false, message: 'Error fetching templates by category' });
  }
});

// Route to get a single template by ID (for editing)
router.get('/api/templates/:id', async (req, res) => {
  try {
      const template = await Template.findById(req.params.id); // Use ObjectId or string based on your database setup
      if (!template) {
          return res.status(404).json({ success: false, message: 'Template not found' });
      }
      res.json(template); // Sending template data back to the frontend
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});                                

// Route to update a template (after editing)
router.put('/api/templates/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body; // Updated content

  try {
    const updatedTemplate = await Template.findByIdAndUpdate(id, { content }, { new: true });
    if (!updatedTemplate) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, message: 'Template updated', updatedTemplate });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ success: false, message: 'Error updating template' });
  }
});

module.exports = router;
