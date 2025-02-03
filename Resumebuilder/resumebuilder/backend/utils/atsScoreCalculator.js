// utils/atsScoreCalculator.js

const axios = require('axios');
const natural = require('natural');
const fs = require('fs');
const pdf = require('pdf-parse'); // Import pdf-parse
const docx = require('docx-parser');

// Hugging Face API key for embedding extraction
const apiKey = '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';  // Replace with your Hugging Face API key
const modelUrl = 'https://api-inference.huggingface.co/models/bert-base-uncased';  // BERT model URL

// Function to get embeddings using Hugging Face API
async function getEmbeddings(text) {
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  const data = {
    inputs: text
  };

  try {
    // Send POST request to Hugging Face API
    const response = await axios.post(modelUrl, data, { headers });
    // Response contains embeddings
    return response.data[0].embedding;  // Adjust based on the actual response format
  } catch (error) {
    console.error('Error fetching embeddings:', error);
    throw new Error('Failed to get embeddings from Hugging Face API');
  }
}

// Function to extract text from resume
async function extractTextFromFile(resume) {
  const fileType = resume.mimetype.split('/')[1].toLowerCase();
  let text = '';

  if (fileType === 'pdf') {
    text = await extractTextFromPDF(resume.path);
  } else if (fileType === 'msword' || fileType === 'docx') {
    text = await extractTextFromDocx(resume.path);
  }

  return text;
}

// Extract text from PDF using pdf-parse
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  return pdfData.text;
}

// Extract text from DOCX
async function extractTextFromDocx(filePath) {
  const text = await docx.parse(filePath);
  return text;
}

// Function to preprocess and clean text (tokenize, remove stopwords)
function preprocessText(text) {
  const tokenizer = new natural.WordTokenizer();
  let words = tokenizer.tokenize(text.toLowerCase());

  // Remove stopwords
  const stopwords = natural.stopwords;
  words = words.filter((word) => !stopwords.includes(word));
  
  return words.join(' ');
}

// Function to calculate cosine similarity
function calculateCosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, curr, idx) => acc + curr * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, curr) => acc + curr * curr, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, curr) => acc + curr * curr, 0));
  
  return dotProduct / (magnitudeA * magnitudeB);
}

// Main function to calculate ATS score
async function calculateATSScore(resumeText, jobDescriptionText) {
  // Preprocess resume and job description
  const cleanedResumeText = preprocessText(resumeText);
  const cleanedJobDescriptionText = preprocessText(jobDescriptionText);

  // Get embeddings for both resume and job description
  const resumeEmbedding = await getEmbeddings(cleanedResumeText);
  const jobDescriptionEmbedding = await getEmbeddings(cleanedJobDescriptionText);

  // Calculate similarity between resume and job description
  const similarityScore = calculateCosineSimilarity(resumeEmbedding, jobDescriptionEmbedding);

  // Adjust ATS score based on semantic similarity
  const atsScore = Math.round(similarityScore * 100);

  // Example: Suggest improvements if the score is low
  const suggestions = atsScore < 50 ? ['Consider improving the match by adding relevant skills and experience.'] : [];

  return { atsScore, suggestions };
}

// Placeholder logic to calculate ATS score based on standards when no job description is provided
async function calculateATSScoreBasedOnStandards(resumeText) {
  let atsScore = 85;  // Default score based on industry standards
  const suggestions = [
    'Improve keyword usage',
    'Add more experience details',
    'Highlight your skills and achievements more clearly'
  ];

  return { atsScore, suggestions };
}

module.exports = { calculateATSScore, calculateATSScoreBasedOnStandards, extractTextFromFile };
