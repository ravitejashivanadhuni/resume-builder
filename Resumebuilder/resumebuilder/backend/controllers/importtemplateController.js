const fs = require('fs');
const path = require('path');
const { extractTextFromPDF, extractTextFromImage, extractTextFromDocx } = require('../utils/fileUtils');

exports.processFile = async (req, res) => {
    try {
        const filePath = req.file.path;
        const mimeType = req.file.mimetype;

        let extractedText = [];
        if (mimeType === 'application/pdf') {
            extractedText = await extractTextFromPDF(filePath);
        } else if (mimeType.startsWith('image/')) {
            extractedText = await extractTextFromImage(filePath);
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            extractedText = await extractTextFromDocx(filePath);
        } else {
            return res.status(400).json({ success: false, message: 'Unsupported file format.' });
        }

        fs.unlinkSync(filePath); // Delete the uploaded file after processing
        res.json({ success: true, data: extractedText });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while processing the file.' });
    }
};

exports.downloadFile = (req, res) => {
    const { updatedFields } = req.body;

    // Generate a new PDF or DOCX with the updated fields (Example uses a placeholder)
    const generatedFilePath = path.join(__dirname, '../output/updated-template.pdf');
    fs.writeFileSync(generatedFilePath, JSON.stringify(updatedFields)); // Replace with actual file generation logic

    res.download(generatedFilePath, 'updated-template.pdf', () => {
        fs.unlinkSync(generatedFilePath); // Cleanup after download
    });
};
