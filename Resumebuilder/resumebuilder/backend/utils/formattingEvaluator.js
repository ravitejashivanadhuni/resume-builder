const evaluateFormatting = (resumeText) => {
    const sections = ['experience', 'skills', 'education', 'projects'];
    const presentSections = sections.filter((section) =>
      resumeText.toLowerCase().includes(section)
    );
  
    const missingSections = sections.filter((section) => !presentSections.includes(section));
    return {
      score: (presentSections.length / sections.length) * 100,
      missingSections,
    };
  };
  
  module.exports = evaluateFormatting;
  