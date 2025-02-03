const pdfjsLib = require('pdfjs-dist');
const tesseract = require('tesseract.js');
const mammoth = require('mammoth');

exports.extractTextFromPDF = async (filePath) => {
    const pdfDocument = await pdfjsLib.getDocument(filePath).promise;
    const page = await pdfDocument.getPage(1);
    const textContent = await page.getTextContent();

    return textContent.items.map((item) => item.str);
};

exports.extractTextFromImage = async (filePath) => {
    const result = await tesseract.recognize(filePath, 'eng');
    return result.data.text.split('\n');
};

exports.extractTextFromDocx = async (filePath) => {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.split('\n');
};
