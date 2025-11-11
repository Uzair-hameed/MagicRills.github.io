// Word Export functionality - Simple and reliable HTML to DOC
function exportToWord() {
    const resumeMaker = window.resumeMaker;
    
    try {
        resumeMaker.showMessage('Generating Word document...', 'info');
        
        const previewElement = document.getElementById('resumePreview');
        const content = previewElement.innerHTML;
        
        // Create a simple Word document using HTML
        const header = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" 
                  xmlns:w="urn:schemas-microsoft-com:office:word" 
                  xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <title>Resume</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 40px; 
                        line-height: 1.4;
                        color: #333;
                    }
                    h2 { 
                        color: #2c3e50; 
                        border-bottom: 2px solid #3498db;
                        padding-bottom: 5px;
                    }
                    h3 { 
                        color: #34495e; 
                        border-bottom: 1px solid #bdc3c7;
                        padding-bottom: 3px;
                        margin-top: 20px;
                    }
                    .resume-header { 
                        text-align: center; 
                        margin-bottom: 30px;
                    }
                    .contact-info { 
                        margin: 10px 0; 
                        color: #7f8c8d;
                    }
                    .experience-item, .education-item { 
                        margin-bottom: 15px; 
                    }
                    .skills-list { 
                        margin: 10px 0; 
                    }
                    .skill-tag { 
                        display: inline-block; 
                        background: #ecf0f1; 
                        padding: 5px 10px; 
                        margin: 2px; 
                        border-radius: 3px;
                    }
                    @page {
                        size: A4;
                        margin: 2cm;
                    }
                </style>
            </head>
            <body>
        `;
        
        const footer = `
            </body>
            </html>
        `;
        
        const source = header + content + footer;
        
        // Create Blob and download
        const sourceBlob = new Blob([source], {type: 'application/msword;charset=utf-8'});
        const fileName = `${resumeMaker.getFormData().personal.fullName || 'resume'}.doc`;
        
        // Use FileSaver.js to download the file
        saveAs(sourceBlob, fileName);
        
        resumeMaker.showMessage('Word document downloaded successfully!');
        
    } catch (error) {
        console.error('Word export error:', error);
        resumeMaker.showMessage('Error generating Word document. Generating text file instead...', 'error');
        
        // Fallback to text file
        setTimeout(() => generateTextFile(resumeMaker.getFormData()), 500);
    }
}

// Fallback text file generator
function generateTextFile(data) {
    try {
        let content = `${data.personal.fullName || "RESUME"}\n`;
        content += "=".repeat(50) + "\n\n";
        
        // Contact info
        if (data.personal.jobTitle) content += `${data.personal.jobTitle}\n`;
        if (data.personal.email || data.personal.phone || data.personal.location) {
            const contact = [];
            if (data.personal.email) contact.push(data.personal.email);
            if (data.personal.phone) contact.push(data.personal.phone);
            if (data.personal.location) contact.push(data.personal.location);
            content += `${contact.join(" | ")}\n`;
        }
        content += "\n";
        
        // Professional Summary
        if (data.personal.summary) {
            content += "PROFESSIONAL SUMMARY\n";
            content += "-".repeat(20) + "\n";
            content += `${data.personal.summary}\n\n`;
        }
        
        // Work Experience
        if (data.experiences.filter(exp => exp.jobTitle || exp.company).length > 0) {
            content += "WORK EXPERIENCE\n";
            content += "-".repeat(20) + "\n";
            data.experiences.filter(exp => exp.jobTitle || exp.company).forEach(exp => {
                if (exp.jobTitle || exp.company) {
                    content += `${exp.jobTitle || ''}${exp.company ? ' at ' + exp.company : ''}\n`;
                    if (exp.duration) content += `${exp.duration}\n`;
                    if (exp.description) content += `${exp.description}\n`;
                    content += "\n";
                }
            });
        }
        
        // Education
        if (data.education.filter(edu => edu.degree || edu.institution).length > 0) {
            content += "EDUCATION\n";
            content += "-".repeat(20) + "\n";
            data.education.filter(edu => edu.degree || edu.institution).forEach(edu => {
                if (edu.degree || edu.institution) {
                    content += `${edu.degree || ''}${edu.institution ? ' from ' + edu.institution : ''}\n`;
                    if (edu.duration) content += `${edu.duration}\n`;
                    if (edu.description) content += `${edu.description}\n`;
                    content += "\n";
                }
            });
        }
        
        // Skills
        if (data.skills.filter(skill => skill.name).length > 0) {
            content += "SKILLS\n";
            content += "-".repeat(20) + "\n";
            const skills = data.skills
                .filter(skill => skill.name)
                .map(skill => skill.level ? `${skill.name} (${skill.level})` : skill.name)
                .join(", ");
            content += `${skills}\n\n`;
        }
        
        // Additional Information
        if (data.personal.languages || data.personal.certifications || data.personal.projects || data.personal.interests) {
            content += "ADDITIONAL INFORMATION\n";
            content += "-".repeat(25) + "\n";
            if (data.personal.languages) content += `Languages: ${data.personal.languages}\n`;
            if (data.personal.certifications) content += `Certifications: ${data.personal.certifications}\n`;
            if (data.personal.projects) content += `Projects: ${data.personal.projects}\n`;
            if (data.personal.interests) content += `Interests: ${data.personal.interests}\n`;
        }
        
        // Create and download text file
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `${data.personal.fullName || 'resume'}.txt`);
        
        window.resumeMaker.showMessage('Text document downloaded as fallback!');
        
    } catch (error) {
        window.resumeMaker.showMessage('Export completely failed. Please try printing the page instead.', 'error');
    }
}