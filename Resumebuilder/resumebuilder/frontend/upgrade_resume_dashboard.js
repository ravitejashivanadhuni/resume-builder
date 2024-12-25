document.addEventListener('DOMContentLoaded', () => {
    const importResumeButton = document.getElementById('import-resume');
    const editResumeButton = document.getElementById('edit-resume');
    const fileUploadSection = document.getElementById('file-upload-section');
    const editResumeSection = document.getElementById('edit-resume-section');
    const resumeFileInput = document.getElementById('resume-file');
    const uploadForm = document.getElementById('upload-form');
    const resumeEditor = document.getElementById('resume-editor');
    const saveResumeButton = document.getElementById('save-resume');

    let uploadedResumeContent = '';

    // Show file upload section
    importResumeButton.addEventListener('click', () => {
        fileUploadSection.classList.remove('hidden');
        editResumeSection.classList.add('hidden');
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
            editResumeButton.disabled = false;
            fileUploadSection.classList.add('hidden');
        };
        reader.readAsText(file);
    });

    // Show resume editing section
    editResumeButton.addEventListener('click', () => {
        if (!uploadedResumeContent) {
            alert('No resume uploaded yet!');
            return;
        }
        fileUploadSection.classList.add('hidden');
        editResumeSection.classList.remove('hidden');
        resumeEditor.value = uploadedResumeContent; // Load uploaded resume content into editor
    });

    // Save resume changes
    saveResumeButton.addEventListener('click', () => {
        const updatedContent = resumeEditor.value;
        alert('Resume saved successfully!');
        console.log('Updated Resume:', updatedContent); // You can replace this with your save logic
    });
});
