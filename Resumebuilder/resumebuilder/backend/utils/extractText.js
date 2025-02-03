const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractTextFromPDF(filePath) {
  if (!filePath) {
    throw new Error('File path is missing.');
  }

  const fileBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(fileBuffer);
  return pdfData.text;
}


// utils/extractText.js

async function extractTextFromResume(resumeFile) {
  // Log the received file information, including the path
  console.log('Received file:', resumeFile);  // Check if resumeFile and its path are present
  
  const fileType = resumeFile.mimetype.split('/')[1].toLowerCase();
  let resumeText = '';

  if (fileType === 'pdf') {
    // Log the path of the file before passing it to extractTextFromPDF
    console.log('Extracting text from PDF, file path:', resumeFile.path);
    resumeText = await extractTextFromPDF(resumeFile.path); // Ensure path is correct
  } else {
    // Handle other formats like DOCX
    resumeText = 'Text extraction from other formats not implemented.';
  }

  return resumeText;
}


// Export the function for use in other files
module.exports = { extractTextFromResume };
