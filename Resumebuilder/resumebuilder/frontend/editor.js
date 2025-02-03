// Sample Template Data (Could be fetched from the database)
const selectedTemplate = [
    {
        "id": 1,
        "title": "Simple Freshers Resume",
        "description": "A clean, simple resume template for freshers with no work experience.",
        "fields": ["BBA", "CSE"],
        "withPhoto": true,
        "imagePreview": "images/Template1.png",
        "editableFields": [
            {
                "name": "<input type='text' placeholder='First Last' id='name'>",
                "contact": {
                    "phone": "<input type='text' placeholder='+1-234-456-789' id='phone'>",
                    "email": "<input type='email' placeholder='professionalemail@resumeworded.com' id='email'>",
                    "linkedin": "<input type='text' placeholder='linkedin.com/in/username' id='linkedin'>"
                },
                "location": "<input type='text' placeholder='Richmond, Virginia' id='location'>",
                "summary": "<textarea placeholder='PL/SQL Developer' id='summary'></textarea>",
                "work_experience": [
                    {
                        "company": "<input type='text' placeholder='Resume Worded' id='company1'>",
                        "location": "<input type='text' placeholder='New York, NY' id='location1'>",
                        "title": "<input type='text' placeholder='PL/SQL Developer' id='title1'>",
                        "start_date": "<input type='text' placeholder='09/2015' id='start_date1'>",
                        "end_date": "<input type='text' placeholder='Present' id='end_date1'>",
                        "description": [
                            "<textarea placeholder='Developed 10+ tables...' id='description1'></textarea>",
                            "<textarea placeholder='Provided senior management...' id='description2'></textarea>",
                            "<textarea placeholder='Extracted data from 40+ sources...' id='description3'></textarea>"
                        ]
                    },
                    {
                        "company": "<input type='text' placeholder='Polyhire' id='company2'>",
                        "location": "<input type='text' placeholder='London, United Kingdom' id='location2'>",
                        "title": "<input type='text' placeholder='Oracle Functional Consultant' id='title2'>",
                        "start_date": "<input type='text' placeholder='10/2012' id='start_date2'>",
                        "end_date": "<input type='text' placeholder='08/2015' id='end_date2'>",
                        "description": [
                            "<textarea placeholder='Championed the installation...' id='description4'></textarea>",
                            "<textarea placeholder='Pioneered implementation of multi-tenant support...' id='description5'></textarea>"
                        ]
                    }
                ],
                "education": [
                    {
                        "institution": "<input type='text' placeholder='Resume Worded University' id='institution'>",
                        "location": "<input type='text' placeholder='New York, NY' id='edu_location'>",
                        "degree": "<input type='text' placeholder='Associate of Applied Science' id='degree'>",
                        "major": "<input type='text' placeholder='Computer Programming' id='major'>",
                        "graduation_date": "<input type='text' placeholder='06/2005' id='grad_date'>"
                    }
                ],
                "skills": {
                    "hard_skills": [
                        "<input type='text' placeholder='Database Design' id='hard_skill1'>",
                        "<input type='text' placeholder='Data Modeling' id='hard_skill2'>"
                    ],
                    "techniques": [
                        "<input type='text' placeholder='Autonomous Transactions' id='technique1'>",
                        "<input type='text' placeholder='Code Encryption' id='technique2'>"
                    ]
                }
            }
        ]
    }
];

// Function to render form fields dynamically based on the template
function renderFormFields(template) {
    let formFieldsHTML = '';

    template[0].editableFields.forEach(field => {
        // Render basic information fields
        formFieldsHTML += `
            <h3>${template[0].title}</h3>
            <label>Name:</label>
            ${field.name}
            <br>
            <label>Phone:</label>
            ${field.contact.phone}
            <br>
            <label>Email:</label>
            ${field.contact.email}
            <br>
            <label>LinkedIn:</label>
            ${field.contact.linkedin}
            <br>
            <label>Location:</label>
            ${field.location}
            <br>
            <label>Summary:</label>
            ${field.summary}
            <br>
        `;

        // Render work experience fields
        field.work_experience.forEach((exp, index) => {
            formFieldsHTML += `
                <h4>Work Experience ${index + 1}</h4>
                <label>Company:</label>
                ${exp.company}
                <br>
                <label>Location:</label>
                ${exp.location}
                <br>
                <label>Job Title:</label>
                ${exp.title}
                <br>
                <label>Start Date:</label>
                ${exp.start_date}
                <br>
                <label>End Date:</label>
                ${exp.end_date}
                <br>
                <label>Description:</label>
                ${exp.description.join('<br>')}
                <br>
            `;
        });

        // Render education fields
        field.education.forEach(edu => {
            formFieldsHTML += `
                <h4>Education</h4>
                <label>Institution:</label>
                ${edu.institution}
                <br>
                <label>Location:</label>
                ${edu.location}
                <br>
                <label>Degree:</label>
                ${edu.degree}
                <br>
                <label>Major:</label>
                ${edu.major}
                <br>
                <label>Graduation Date:</label>
                ${edu.graduation_date}
                <br>
            `;
        });

        // Render skills fields
        formFieldsHTML += `
            <h4>Skills</h4>
            <label>Hard Skills:</label>
            ${field.skills.hard_skills.join('<br>')}
            <br>
            <label>Techniques:</label>
            ${field.skills.techniques.join('<br>')}
            <br>
        `;
    });

    // Inject form fields into the HTML
    document.getElementById('form-fields').innerHTML = formFieldsHTML;

    // Add event listeners to inputs for real-time updates
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updateResumePreview);
    });
}

// Function to update the resume preview dynamically
function updateResumePreview() {
    const inputs = document.querySelectorAll('input, textarea');
    const previewData = {};

    inputs.forEach(input => {
        previewData[input.id] = input.value || input.placeholder;
    });

    const previewHTML = `
        <div class="header">
            <h1>${previewData.name}</h1>
            <p>${previewData.location}</p>
            <p>Phone: ${previewData.phone} | Email: ${previewData.email} | LinkedIn: ${previewData.linkedin}</p>
        </div>
        <div class="section-title">Summary</div>
        <div class="section-content">${previewData.summary}</div>
        <div class="section-title">Work Experience</div>
        <div class="section-content">
            <strong>${previewData.title1}</strong> at ${previewData.company1} (${previewData.start_date1} - ${previewData.end_date1})
            <br><em>${previewData.location1}</em>
            <p>${previewData.description1}</p>
        </div>
        <div class="section-title">Education</div>
        <div class="section-content">
            ${previewData.degree} at ${previewData.institution} (Graduated: ${previewData.grad_date})
        </div>
        <div class="section-title">Skills</div>
        <div class="section-content">
            Hard Skills: ${previewData.hard_skill1}, ${previewData.hard_skill2}
            <br>Techniques: ${previewData.technique1}, ${previewData.technique2}
        </div>
    `;

    document.getElementById('resume-preview').innerHTML = previewHTML;
}
// Export functions
function exportToPDF() {
    const preview = document.getElementById('resume-preview');
    const opt = {
        margin: 1,
        filename: 'resume.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(preview).set(opt).save();
}

// Export preview to DOCX
function exportToDocx() {
    fetch("template.docx") // Adjust path to your Word template
        .then(res => res.arrayBuffer())
        .then(data => {
            const zip = new PizZip(data);
            const doc = new window.docxtemplater().loadZip(zip);

            // Replace placeholders with dynamic values
            doc.setData({
                name: document.getElementById("name").value || "Your Name",
                phone: document.getElementById("phone").value || "Your Phone",
                email: document.getElementById("email").value || "Your Email",
                summary: document.getElementById("summary").value || "Your Summary",
            });

            doc.render();
            const out = doc.getZip().generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            saveAs(out, "resume.docx");
        })
        .catch(err => console.error("Error generating DOCX:", err));
}



// Event Listeners for export buttons
document.getElementById('export-pdf').addEventListener('click', exportToPDF);
document.getElementById('export-docx').addEventListener('click', exportToDocx);

// Initialize the form rendering
renderFormFields(selectedTemplate);
