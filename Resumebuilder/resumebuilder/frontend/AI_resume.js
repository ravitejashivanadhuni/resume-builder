document.getElementById('generateButton').addEventListener('click', async () => {
    // Get user details from form inputs
    const userDetails = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        experience: document.getElementById('experience').value.trim(),
        projects: document.getElementById('projects').value.trim(),
        skills: document.getElementById('skills').value.trim(),
    };

    const jobDescription = document.getElementById('jobDescription').value.trim();
    const resumeFile = document.getElementById('resumeFile').files[0];

    // Validate Job Description
    if (!jobDescription) {
        alert('Please fill out the Job Description field.');
        document.getElementById('jobDescription').focus();
        return;
    }

    // Validate required fields if no file is uploaded
    const missingFields = Object.entries(userDetails)
        .filter(([key, value]) => !value && key !== 'phone') // Allow phone to be optional
        .map(([key]) => key);

    if (missingFields.length > 0 && !resumeFile) {
        alert(`Please fill out the following fields: ${missingFields.join(', ')} or upload a resume file.`);
        return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('userDetails', JSON.stringify(userDetails));
    formData.append('jobDescription', jobDescription);

    if (resumeFile) {
        formData.append('resumeFile', resumeFile);
    }

    // Send data to backend for processing
    try {
        const response = await fetch('http://localhost:5000/generate-resume', {
            method: 'POST',
            body: formData,  // Corrected to use 'formData'
        });

        const result = await response.json();

        if (result.generatedText) {
            // If the AI response contains generated content, display it
            displayGeneratedContent(result.generatedText, userDetails);
        } else {
            alert('Error generating content. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while generating content.');
    }
});

function displayGeneratedContent(generatedText, userDetails) {
    // Create a container to display the generated resume content
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('generated-content');

    contentContainer.innerHTML = `
        <h2>Generated Resume Content</h2>
        <div>
            <h3>Experience</h3>
            <p>${generatedText.experience || 'No experience content generated.'}</p>
        </div>
        <div>
            <h3>Projects</h3>
            <p>${generatedText.projects || 'No projects content generated.'}</p>
        </div>
        <div>
            <h3>Skills</h3>
            <p>${generatedText.skills || 'No skills content generated.'}</p>
        </div>
        <div>
            <h3>Contact Info</h3>
            <p>Name: ${userDetails.name || 'N/A'}</p>
            <p>Email: ${userDetails.email || 'N/A'}</p>
            <p>Phone: ${userDetails.phone || 'N/A'}</p>
        </div>
    `;

    // Append the generated content to a specific section or container
    const resultSection = document.getElementById('generatedContentSection');
    if (resultSection) {
        resultSection.innerHTML = ''; // Clear any previous results
        resultSection.appendChild(contentContainer);
    } else {
        document.body.appendChild(contentContainer); // Fallback
    }

    // Add a button to copy content
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy to Clipboard';
    copyButton.classList.add('copy-button');

    copyButton.addEventListener('click', () => {
        const contentToCopy = `Experience: ${generatedText.experience || ''}
                               Projects: ${generatedText.projects || ''}
                               Skills: ${generatedText.skills || ''}
                               Contact Info: Name: ${userDetails.name}, Email: ${userDetails.email}, Phone: ${userDetails.phone}`;

        navigator.clipboard
            .writeText(contentToCopy)
            .then(() => {
                alert('Content copied to clipboard!');
            })
            .catch((error) => {
                console.error('Error copying content:', error);
                alert('Error copying content.');
            });
    });

    // Append copy button to the content container
    contentContainer.appendChild(copyButton);
}
