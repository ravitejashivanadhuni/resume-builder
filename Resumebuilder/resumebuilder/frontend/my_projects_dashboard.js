document.addEventListener('DOMContentLoaded', () => {
    const resumeList = document.querySelector('.resume-list');
    const emptyMessage = document.getElementById('empty-message');

    // Simulated list of resumes from localStorage or database
    const resumes = JSON.parse(localStorage.getItem('editedResumes')) || [];

    // Function to render resumes
    function renderResumes() {
        if (resumes.length === 0) {
            emptyMessage.classList.remove('hidden');
            resumeList.innerHTML = '';
        } else {
            emptyMessage.classList.add('hidden');
            resumeList.innerHTML = '';
            resumes.forEach((resume, index) => {
                const resumeCard = document.createElement('div');
                resumeCard.className = 'resume-card';

                resumeCard.innerHTML = `
                    <h2>${resume.name}</h2>
                    <p>Last Edited: ${resume.lastEdited}</p>
                    <button class="btn btn-view" data-index="${index}">View</button>
                    <button class="btn btn-edit" data-index="${index}">Edit</button>
                `;

                resumeList.appendChild(resumeCard);
            });

            // Add event listeners for buttons
            document.querySelectorAll('.btn-view').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    alert(`Viewing Resume: ${resumes[index].name}`);
                    // Add logic to open/view the resume
                });
            });

            document.querySelectorAll('.btn-edit').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    alert(`Editing Resume: ${resumes[index].name}`);
                    // Add logic to edit the resume
                });
            });
        }
    }

    // Simulate adding a resume (For demonstration, remove in production)
    if (resumes.length === 0) {
        resumes.push(
            { name: 'John Doe - Software Engineer', lastEdited: '2024-12-20' },
            { name: 'Jane Smith - Project Manager', lastEdited: '2024-12-19' }
        );
        localStorage.setItem('editedResumes', JSON.stringify(resumes));
    }

    renderResumes();
});
