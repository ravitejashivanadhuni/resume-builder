const calculateCosineSimilarity = (resumeTokens, jobTokens) => {
    const resumeFreq = getWordFrequency(resumeTokens);
    const jobFreq = getWordFrequency(jobTokens);
  
    let dotProduct = 0;
    let resumeMagnitude = 0;
    let jobMagnitude = 0;
  
    for (const word in resumeFreq) {
      if (jobFreq[word]) {
        dotProduct += resumeFreq[word] * jobFreq[word];
      }
    }
  
    for (const word in resumeFreq) {
      resumeMagnitude += resumeFreq[word] * resumeFreq[word];
    }
  
    for (const word in jobFreq) {
      jobMagnitude += jobFreq[word] * jobFreq[word];
    }
  
    const similarity = dotProduct / (Math.sqrt(resumeMagnitude) * Math.sqrt(jobMagnitude));
    return similarity;
  };
  
  // Helper function to calculate word frequencies
  const getWordFrequency = (tokens) => {
    const frequency = {};
    tokens.forEach((token) => {
      frequency[token] = (frequency[token] || 0) + 1;
    });
    return frequency;
  };
  
  module.exports = { calculateCosineSimilarity };
  