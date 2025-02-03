const express = require('express');
const multer = require('multer');
const { checkATSScore } = require('../controllers/atsController');
const router = express.Router();

// Set up Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage for easier file processing
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only .pdf and .docx files are allowed.')); // Reject invalid files
    }
  },
});

// POST route for ATS score check with file uploads
router.post('/api/ats/check-ats-score', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    console.log('Uploaded file:', req.file.originalname); // Log the uploaded file details
    console.log('Mimetype:', req.file.mimetype);

    // Call the controller function to process the file
    const atsScore = await checkATSScore(req.file);

    // Send the ATS score back to the client
    res.status(200).json({ atsScore });
  } catch (err) {
    console.error('Error processing ATS score:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
