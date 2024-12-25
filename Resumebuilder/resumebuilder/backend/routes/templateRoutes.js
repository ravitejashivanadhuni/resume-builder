const express = require('express');
const Template = require('../models/Template');
const router = express.Router();

// Route to get all templates
router.get('/templates', async (req, res) => {
  try {
    const templates = await Template.find(); // Fetch all templates
    res.json({ success: true, templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ success: false, message: 'Error fetching templates' });
  }
});

// Route to get templates by category (No Experience, Entry Level, etc.)
router.get('/templates/category/:category', async (req, res) => {
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
router.get('/template/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, template });
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    res.status(500).json({ success: false, message: 'Error fetching template' });
  }
});

// Route to update a template (after editing)
router.put('/template/:id', async (req, res) => {
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
