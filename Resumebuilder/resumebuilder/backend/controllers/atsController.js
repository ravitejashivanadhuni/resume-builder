const { calculateATSScore, calculateATSScoreBasedOnStandards } = require('../utils/atsScoreCalculator');
const { extractTextFromFile } = require('../utils/extractText');

exports.checkATSScore = async (req, res) => {
  const resume = req.file;
  const jobDescription = req.body.jobDescription;

  // Ensure a resume file is uploaded
  if (!resume) {
    return res.status(400).json({ error: 'Please upload a resume.' });
  }

  try {
    // Extract text from the resume file
    const resumeText = await extractTextFromFile(resume);
    console.log('Extracted Resume Text:', resumeText);  // Debug log

    if (jobDescription && jobDescription.trim()) {
      // Calculate ATS score with job description
      const { atsScore, suggestions } = await calculateATSScore(resumeText, jobDescription);
      console.log('ATS Score with Job Description:', atsScore);  // Debug log
      return res.status(200).json({ atsScore, suggestions });
    }

    // If no job description, calculate ATS score based on industry standards
    const { atsScore, suggestions } = await calculateATSScoreBasedOnStandards(resumeText);
    console.log('ATS Score without Job Description (Based on Standards):', atsScore);  // Debug log
    return res.status(200).json({ atsScore, suggestions });

  } catch (error) {
    console.error('Error in ATS score calculation:', error.message); // Debug log
    res.status(500).json({ error: 'Failed to process ATS score.' });
  }
};
