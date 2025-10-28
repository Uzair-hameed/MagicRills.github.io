// Resume Builder functionality
class ResumeBuilder {
    constructor(app) {
        this.app = app;
    }

    generatePreview() {
        const personal = this.app.resumeData.personal;
        const experience = this.app.resumeData.experience;
        const education = this.app.resumeData.education;
        const skills = this.app.resumeData.skills;
        
        let previewHTML = this.generateHeader(personal);
        
        if (personal.summary) {
            previewHTML += this.generateSummary(personal.summary);
        }
        
        if (experience.length > 0) {
            previewHTML += this.generateExperience(experience);
        }
        
        if (education.length > 0) {
            previewHTML += this.generateEducation(education);
        }
        
        if (skills.length > 0) {
            previewHTML += this.generateSkills(skills);
        }
        
        document.getElementById('resume-preview').innerHTML = previewHTML;
    }

    generateHeader(personal) {
        return `
            <div class="resume-header">
                ${personal.image ? `<div class="profile-image-container"><img src="${personal.image}" alt="Profile" class="profile-image" /></div>` : ''}
                <h1 class="resume-name">${personal.name || 'Your Name'}</h1>
                <div class="resume-title">${personal.title || 'Professional Title'}</div>
                <div class="resume-contact">
                    ${personal.email ? `<div>${personal.email}</div>` : ''}
                    ${personal.phone ? `<div>${personal.phone}</div>` : ''}
                    ${personal.address ? `<div>${personal.address}</div>` : ''}
                </div>
                ${this.generateSocialLinks(personal.social)}
            </div>
        `;
    }

    generateSocialLinks(socialLinks) {
        const validLinks = socialLinks.filter(s => s.platform && s.url);
        if (validLinks.length === 0) return '';
        
        return `
            <div class="resume-social">
                ${validLinks.map(s => 
                    `<a href="${s.url}" target="_blank">${s.platform}</a>`
                ).join(' | ')}
            </div>
        `;
    }

    generateSummary(summary) {
        return `
            <div class="resume-section">
                <h2 class="resume-section-title">Professional Summary</h2>
                <p>${summary}</p>
            </div>
        `;
    }

    generateExperience(experience) {
        const validExperience = experience.filter(e => e.company || e.position);
        if (validExperience.length === 0) return '';
        
        return `
            <div class="resume-section">
                <h2 class="resume-section-title">Work Experience</h2>
                ${validExperience.map(exp => this.generateExperienceItem(exp)).join('')}
            </div>
        `;
    }

    generateExperienceItem(exp) {
        return `
            <div class="resume-item">
                <div class="resume-item-header">
                    <div class="resume-item-title">${exp.position || 'Position'}</div>
                    <div class="resume-item-date">${exp.startDate || ''} ${exp.endDate ? ' - ' + exp.endDate : ''}</div>
                </div>
                <div class="resume-item-subtitle">${exp.company || 'Company'}</div>
                ${exp.description ? `<p>${exp.description}</p>` : ''}
            </div>
        `;
    }

    generateEducation(education) {
        // Similar to generateExperience
        return ''; // Implementation details...
    }

    generateSkills(skills) {
        // Similar to generateExperience
        return ''; // Implementation details...
    }
}