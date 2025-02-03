document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-upload');
    const previewContainer = document.getElementById('preview-container');
    const templatePreview = document.getElementById('template-preview');
    const startEditingButton = document.getElementById('start-editing');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file to upload!');
            return;
        }

        const fileType = file.type;
        if (fileType === 'application/pdf') {
            alert('PDF upload successful! Preview is not supported yet.');
        } else if (fileType.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                previewContainer.style.display = 'block';
                templatePreview.innerHTML = `<img src="${reader.result}" alt="Template Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Unsupported file format. Please upload a PDF, JPG, or PNG.');
        }
    });

    startEditingButton.addEventListener('click', () => {
        alert('Starting the editing process...');
        // Redirect or initialize the editing process here
        // For example, load a canvas for editing
    });
});
