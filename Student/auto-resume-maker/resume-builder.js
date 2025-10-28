// Advanced Resume Builder with Multiple Templates
class ResumeBuilder {
    constructor(app) {
        this.app = app;
        this.templates = {
            modern: this.generateModernTemplate.bind(this),
            classic: this.generateClassicTemplate.bind(this),
            creative: this.generateCreativeTemplate.bind(this)
        };
    }

    generatePreview() {
        const template = this.app.resumeData.settings.template;
        const templateFunction = this.templates[template] || this.templates.modern;
        
        const previewHTML = templateFunction();
        document.getElementById('resume-preview').innerHTML = previewHTML;
    }

    generateModernTemplate() {
        const personal = this.app.resumeData.personal;
        const experience = this.app.resumeData.experience;
        const education = this.app.resumeData.education;
        const skills = this.app.resumeData.skills;

        return `
            <div class="resume-header">
                ${personal.image ? `
                    <div class="profile-image-container">
                        <img src="${personal.image}" alt="Profile" class="profile-image">
                    </div>
                ` : ''}
                <h1 class="resume-name">${personal.name || 'Your Name'}</h1>
                <div class="resume-title">${personal.title || 'Professional Title'}</div>
                <div class="resume-contact">
                    ${personal.email ? `<div>📧 ${personal.email}</div>` : ''}
                    ${personal.phone ? `<div>📱 ${personal.phone}</div>` : ''}
                    ${personal.location ? `<div>📍 ${personal.location}</div>` : ''}
                </div>
            </div>

            ${personal.summary ? `
                <div class="resume-section">
                    <h2 class="resume-section-title">Professional Summary</h2>
                    <p>${personal.summary}</p>
                </div>
            ` : ''}

            ${experience.length > 0 ? `
                <div class="resume-section">
                    <h2 class="resume-section-title">Work Experience</h2>
                    ${experience.map(exp => `
                        <div class="resume-item">
                            <div class="resume-item-header">
                                <div class="resume-item-title">${exp.position || 'Position'}</div>
                                <div class="resume-item-date">${exp.startDate || ''} ${exp.endDate ? ' - ' + exp.endDate : ''}</div>
                            </div>
                            <div class="resume-item-subtitle">${exp.company || 'Company'}</div>
                            ${exp.description ? `<p>${exp.description}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${education.length > 0 ? `
                <div class="resume-section">
                    <h2 class="resume-section-title">Education</h2>
                    ${education.map(edu => `
                        <div class="resume-item">
                            <div class="resume-item-header">
                                <div class="resume-item-title">${edu.degree || 'Degree'}</div>
                                <div class="resume-item-date">${edu.startDate || ''} ${edu.endDate ? ' - ' + edu.endDate : ''}</div>
                            </div>
                            <div class="resume-item-subtitle">
                                ${edu.institution || 'Institution'}${edu.field ? ` - ${edu.field}` : ''}
                            </div>
                            ${edu.description ? `<p>${edu.description}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${skills.length > 0 ? `
                <div class="resume-section">
                    <h2 class="resume-section-title">Skills</h2>
                    <div class="resume-skills">
                        ${skills.map(skill => `
                            <div class="skill-tag">
                                ${skill.name}${skill.level ? ` (${skill.level})` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }

    generateClassicTemplate() {
        const personal = this.app.resumeData.personal;
        const experience = this.app.resumeData.experience;
        const education = this.app.resumeData.education;
        const skills = this.app.resumeData.skills;

        return `
            <div class="resume-header">
                <div style="display: flex; align-items: center; gap: 30px;">
                    ${personal.image ? `
                        <div class="profile-image-container" style="width: 120px; height: 120px;">
                            <img src="${personal.image}" alt="Profile" class="profile-image">
                        </div>
                    ` : ''}
                    <div style="flex: 1;">
                        <h1 class="resume-name" style="text-align: left; margin-bottom: 10px;">${personal.name || 'Your Name'}</h1>
                        <div class="resume-title" style="text-align: left; margin-bottom: 15px;">${personal.title || 'Professional Title'}</div>
                        <div class="resume-contact" style="justify-content: flex-start; gap: 15px;">
                            ${personal.email ? `<div>📧 ${personal.email}</div>` : ''}
                            ${personal.phone ? `<div>📱 ${personal.phone}</div>` : ''}
                            ${personal.location ? `<div>📍 ${personal.location}</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px;">
                <!-- Left Column -->
                <div>
                    ${personal.summary ? `
                        <div class="resume-section">
                            <h2 class="resume-section-title">Summary</h2>
                            <p style="font-size: 0.9rem;">${personal.summary}</p>
                        </div>
                    ` : ''}

                    ${skills.length > 0 ? `
                        <div class="resume-section">
                            <h2 class="resume-section-title">Skills</h2>
                            <div class="resume-skills">
                                ${skills.map(skill => `
                                    <div class="skill-tag" style="margin-bottom: 8px;">
                                        ${skill.name}${skill.level ? ` (${skill.level})` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- Right Column -->
                <div>
                    ${experience.length > 0 ? `
                        <div class="resume-section">
                            <h2 class="resume-section-title">Experience</h2>
                            ${experience.map(exp => `
                                <div class="resume-item">
                                    <div class="resume-item-header">
                                        <div class="resume-item-title">${exp.position || 'Position'}</div>
                                        <div class="resume-item-date">${exp.startDate || ''} ${exp.endDate ? ' - ' + exp.endDate : ''}</div>
                                    </div>
                                    <div class="resume-item-subtitle">${exp.company || 'Company'}</div>
                                    ${exp.description ? `<p>${exp.description}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${education.length > 0 ? `
                        <div class="resume-section">
                            <h2 class="resume-section-title">Education</h2>
                            ${education.map(edu => `
                                <div class="resume-item">
                                    <div class="resume-item-header">
                                        <div class="resume-item-title">${edu.degree || 'Degree'}</div>
                                        <div class="resume-item-date">${edu.startDate || ''} ${edu.endDate ? ' - ' + edu.endDate : ''}</div>
                                    </div>
                                    <div class="resume-item-subtitle">
                                        ${edu.institution || 'Institution'}${edu.field ? ` - ${edu.field}` : ''}
                                    </div>
                                    ${edu.description ? `<p>${edu.description}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    generateCreativeTemplate() {
        const personal = this.app.resumeData.personal;
        const experience = this.app.resumeData.experience;
        const education = this.app.resumeData.education;
        const skills = this.app.resumeData.skills;

        return `
            <div class="resume-header">
                ${personal.image ? `
                    <div class="profile-image-container" style="margin: 0 auto 20px; width: 140px; height: 140px;">
                        <img src="${personal.image}" alt="Profile" class="profile-image">
                    </div>
                ` : ''}
                <h1 class="resume-name" style="font-size: 2.8rem; margin-bottom: 10px;">${personal.name || 'Your Name'}</h1>
                <div class="resume-title" style="font-size: 1.4rem; margin-bottom: 20px;">${personal.title || 'Professional Title'}</div>
                <div class="resume-contact" style="gap: 25px; font-size: 1.1rem;">
                    ${personal.email ? `<div>📧 ${personal.email}</div>` : ''}
                    ${personal.phone ? `<div>📱 ${personal.phone}</div>` : ''}
                    ${personal.location ? `<div>📍 ${personal.location}</div>` : ''}
                </div>
            </div>

            ${personal.summary ? `
                <div class="resume-section">
                    <h2 class="resume-section-title" style="border-bottom: none; text-align: center; font-size: 1.6rem;">
                        About Me
                    </h2>
                    <p style="text-align: center; font-size: 1.1rem; line-height: 1.8;">${personal.summary}</p>
                </div>
            ` : ''}

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <!-- Left Column -->
                <div>
                    ${experience.length > 0 ? `
                        <div class="resume-section">
                            <h2 class="resume-section-title">Professional Experience</h2>
                            ${experience.map(exp => `
                                <div class="resume-item" style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                                    <div class="resume-item-header">
                                        <div class="resume-item-title" style="color: var(--primary-color);">${exp.position || 'Position'}</div>
                                        <div class="resume-item-date">${exp.startDate || ''} ${exp.endDate ? ' - ' + exp.endDate : ''}</div>
                                    </div>
                                    <div class="resume-item-subtitle" style="font-weight: bold;">${exp.company || 'Company'}</div>
                                    ${exp.description ? `<p style="margin-top: 8px;">${exp.description}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>

                <!-- Right Column -->
                <div>
                    ${education.length > 0 ? `
                        <div class="resume-section">
                            <h2 class="resume-section-title">Education</h2>
                            ${education.map(edu => `
                                <div class="resume-item" style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                                    <div class="resume-item-header">
                                        <div class="resume-item-title" style="color: var(--primary-color);">${edu.degree || 'Degree'}</div>
                                        <div class="resume-item-date">${edu.startDate || ''} ${edu.endDate ? ' - ' + edu.endDate : ''}</div>
                                    </div>
                                    <div class="resume-item-subtitle" style="font-weight: bold;">
                                        ${edu.institution || 'Institution'}${edu.field ? ` - ${edu.field}` : ''}
                                    </div>
                                    ${edu.description ? `<p style="margin-top: 8px;">${edu.description}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${skills.length > 0 ? `
                        <div class="resume-section">
                            <h2 class="resume-section-title">Skills & Expertise</h2>
                            <div class="resume-skills" style="gap: 8px;">
                                ${skills.map(skill => `
                                    <div class="skill-tag" style="background: var(--primary-color); padding: 8px 16px; font-size: 0.9rem;">
                                        ${skill.name}${skill.level ? `<br><small>${skill.level}</small>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Helper method to format dates
    formatDate(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    }
}