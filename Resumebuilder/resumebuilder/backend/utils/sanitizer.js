// utils/sanitizer.js

// Function to clean the generated data
const cleanGeneratedData = (data) => {
    if (!data) {
        console.error('[Error] No data provided for cleaning');
        return {};
    }

    // Ensure each field is properly sanitized
    const cleanedData = {
        experience: extractExperience(data.experience),
        education: extractEducation(data.education),
        projects: extractProjects(data.projects),
        skills: data.skills ? extractSkills(data.skills) : [],
        contactInfo: data.contactInfo ? sanitizeContactInfo(data.contactInfo) : {},
    };

    return cleanedData;
};

// Extract and sanitize experience data (you can expand this logic further)
const extractExperience = (experienceData) => {
    if (!experienceData || typeof experienceData !== 'string') {
        console.error('[Error] Invalid experience data');
        return [];
    }
    // Add more parsing or sanitization if needed
    return experienceData.trim();
};

// Extract and sanitize education data
const extractEducation = (educationData) => {
    if (!educationData || typeof educationData !== 'string') {
        console.error('[Error] Invalid education data');
        return [];
    }
    // Add more parsing or sanitization if needed
    return educationData.trim();
};

// Extract and sanitize projects data
const extractProjects = (projectsData) => {
    if (!projectsData || typeof projectsData !== 'string') {
        console.error('[Error] Invalid projects data');
        return [];
    }
    // Add more parsing or sanitization if needed
    return projectsData.trim();
};

// Split skills by comma and trim them
const extractSkills = (skills) => {
    if (!skills || typeof skills !== 'string') {
        console.error('[Error] Invalid skills data');
        return [];
    }
    return skills.split(',').map(skill => skill.trim());
};

// Sanitize contact info if needed (e.g., remove special characters, format numbers)
const sanitizeContactInfo = (contactInfo) => {
    if (!contactInfo || typeof contactInfo !== 'object') {
        console.error('[Error] Invalid contact info data');
        return {};
    }
    // Add further sanitization if necessary (e.g., phone number formatting)
    return contactInfo;
};

module.exports = { cleanGeneratedData };
