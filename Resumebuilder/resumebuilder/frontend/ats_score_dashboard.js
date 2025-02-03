document.addEventListener('DOMContentLoaded', () => {
  const resumeFileInput = document.getElementById('resume-file');
  const optionsSection = document.getElementById('options-section');
  const directCheckButton = document.getElementById('direct-check-score');
  const compareCheckButton = document.getElementById('compare-check-score');
  const jobDescriptionInput = document.getElementById('job-description');
  const scoreResultSection = document.getElementById('score-result-section');
  const atsScoreElement = document.getElementById('ats-score');
  const suggestionsList = document.getElementById('suggestions-list');

  // Show options section after uploading resume
  resumeFileInput.addEventListener('change', () => {
    if (resumeFileInput.files.length > 0) {
      optionsSection.classList.remove('hidden');
    }
  });

  // Handle direct ATS score check (without job description)
  directCheckButton.addEventListener('click', async () => {
    const resumeFile = resumeFileInput.files[0];
  
    if (!resumeFile) {
      alert('Please upload a resume.');
      return;
    }
  
    const formData = new FormData();
    formData.append('resume', resumeFile);
  
    try {
      const response = await fetch('/api/ats/check-ats-score', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        displayATSResult(result);
      } else {
        alert(result.error || 'Failed to check ATS score.');
      }
    } catch (error) {
      console.error('Error checking ATS score:', error);
      alert('An error occurred while processing your request.');
    }
  });
  

  // Handle ATS score check with job description
  compareCheckButton.addEventListener('click', async () => {
    const resumeFile = resumeFileInput.files[0];
    const jobDescription = jobDescriptionInput.value.trim();

    if (!resumeFile) {
      alert('Please upload a resume first.');
      return;
    }

    if (!jobDescription) {
      alert('Please paste a job description.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('/api/ats/check-ats-score-with-job-description', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        displayATSResult(result);
      } else {
        alert(result.error || 'Failed to calculate ATS score.');
      }
    } catch (error) {
      alert('Error connecting to the server.');
    }
  });

  // Display results in the result section
  function displayATSResult(result) {
    atsScoreElement.textContent = result.atsScore;
    suggestionsList.innerHTML = '';
    result.suggestions.forEach((suggestion) => {
      const listItem = document.createElement('li');
      listItem.textContent = suggestion;
      suggestionsList.appendChild(listItem);
    });
    scoreResultSection.classList.remove('hidden');
  }
});
