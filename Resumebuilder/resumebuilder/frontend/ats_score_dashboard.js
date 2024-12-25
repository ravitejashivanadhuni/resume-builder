document.addEventListener('DOMContentLoaded', () => {
    const importResumeButton = document.getElementById('import-resume');
    const checkScoreButton = document.getElementById('check-score');
    const fileUploadSection = document.getElementById('file-upload-section');
    const uploadForm = document.getElementById('upload-form');
    const resumeFileInput = document.getElementById('resume-file');
    const scoreResultSection = document.getElementById('score-result-section');
    const atsScoreElement = document.getElementById('ats-score');
    const suggestionsList = document.getElementById('suggestions-list');

    let uploadedResumeContent = '';

    // Show file upload section
    importResumeButton.addEventListener('click', () => {
        fileUploadSection.classList.remove('hidden');
        scoreResultSection.classList.add('hidden');
    });

    // Handle file upload
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const file = resumeFileInput.files[0];
        if (!file) {
            alert('Please select a file to upload!');
            return;
        }

        const reader = new FileReader();
        reader.onload = function () {
            uploadedResumeContent = reader.result;
            alert(`File "${file.name}" uploaded successfully!`);
            checkScoreButton.disabled = false;
            fileUploadSection.classList.add('hidden');
        };
        reader.readAsText(file);
    });

    // Generate ATS Score and Suggestions
    checkScoreButton.addEventListener('click', () => {
        if (!uploadedResumeContent) {
            alert('No resume uploaded yet!');
            return;
        }

        // Mock ATS Score Calculation
        const atsScore = Math.floor(Math.random() * 61) + 40; // Random score between 40 and 100
        const suggestions = generateSuggestions(atsScore);

        // Display ATS Score
        atsScoreElement.textContent = atsScore;
        scoreResultSection.classList.remove('hidden');

        // Display Suggestions
        suggestionsList.innerHTML = '';
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            suggestionsList.appendChild(li);
        });
    });

    // Generate improvement suggestions based on ATS score
    function generateSuggestions(score) {
        const suggestions = [];

        if (score < 70) {
            suggestions.push('Include more relevant keywords from the job description.');
            suggestions.push('Use a simple layout with no complex formatting.');
            suggestions.push('Avoid using images or graphics in your resume.');
        }

        if (score < 85) {
            suggestions.push('Add a professional summary at the top of your resume.');
            suggestions.push('Ensure all sections are clearly labeled.');
        }

        if (score < 100) {
            suggestions.push('Double-check for any spelling or grammatical errors.');
            suggestions.push('Make sure your contact information is up-to-date.');
        }

        return suggestions;
    }
});
