const generateFeedback = ({ atsScore, formattingScore, suggestions }) => {
    const feedback = [`Your ATS Score: ${atsScore}%`, `Formatting Score: ${formattingScore}%`];
  
    if (atsScore < 80) feedback.push('Consider adding more relevant keywords.');
    if (formattingScore < 80) feedback.push('Improve the structure and formatting of your resume.');
  
    return [...feedback, ...suggestions];
  };
  
  module.exports = generateFeedback;
  