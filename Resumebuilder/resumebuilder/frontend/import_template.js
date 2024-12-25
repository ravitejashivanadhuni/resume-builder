document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const fileInput = document.getElementById('file-upload');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file to upload!');
            return;
        }

        // Display success message (or perform actual upload logic)
        alert(`File "${file.name}" uploaded successfully!`);
    });
});
