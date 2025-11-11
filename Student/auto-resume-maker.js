// Main application logic - Completely redeveloped
class ResumeMaker {
    constructor() {
        this.currentTemplate = 'professional';
        this.isDarkMode = false;
        this.previewZoom = 1;
        this.init();
    }

    init() {
        this.createDefaultItems();
        this.bindEvents();
        this.updatePreview();
        this.setupTheme();
    }

    createDefaultItems() {
        // Add one default item for each section
        this.addExperience(true);
        this.addEducation(true);
        this.addSkill(true);
    }

    bindEvents() {
        // Template selection
        document.querySelectorAll('.template').forEach(template => {
            template.addEventListener('click', (e) => {
                this.selectTemplate(e.currentTarget.dataset.template);
            });
        });

        // Add buttons
        document.getElementById('addExperience').addEventListener('click', () => this.addExperience());
        document.getElementById('addEducation').addEventListener('click', () => this.addEducation());
        document.getElementById('addSkill').addEventListener('click', () => this.addSkill());

        // Remove buttons (event delegation)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const item = e.target.closest('.experience-item, .education-item, .skill-item');
                if (item) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-100px)';
                    setTimeout(() => {
                        item.remove();
                        this.updatePreview();
                    }, 300);
                }
            }
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Image upload
        document.getElementById('profileImage').addEventListener('change', (e) => this.handleImageUpload(e));

        // Real-time preview updates
        document.addEventListener('input', (e) => {
            if (e.target.type !== 'file') {
                this.debouncedUpdatePreview();
            }
        });

        // Section toggle
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('section-toggle')) {
                this.toggleSection(e.target);
            }
        });

        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => this.zoomPreview(0.1));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoomPreview(-0.1));

        // Export buttons
        document.getElementById('exportPdf').addEventListener('click', () => this.exportPdf());
        document.getElementById('exportWord').addEventListener('click', () => this.exportWord());
        document.getElementById('exportPrint').addEventListener('click', () => this.exportPrint());

        // Initialize with default data for demo
        this.initializeDemoData();
    }

    debouncedUpdatePreview() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.updatePreview();
        }, 300);
    }

    selectTemplate(template) {
        this.currentTemplate = template;
        
        // Update UI
        document.querySelectorAll('.template').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-template="${template}"]`).classList.add('active');
        
        this.updatePreview();
        this.showMessage(`Template changed to ${template.charAt(0).toUpperCase() + template.slice(1)}`);
    }

    addExperience(isDefault = false) {
        const container = document.getElementById('experienceContainer');
        const newItem = document.createElement('div');
        newItem.className = 'experience-item';
        newItem.innerHTML = `
            <input type="text" class="exp-job-title" placeholder="Job Title" ${isDefault ? 'value="Senior Software Engineer"' : ''}>
            <input type="text" class="exp-company" placeholder="Company" ${isDefault ? 'value="Tech Solutions Inc."' : ''}>
            <input type="text" class="exp-duration" placeholder="Duration (e.g., 2020-2022)" ${isDefault ? 'value="2020 - Present"' : ''}>
            <textarea class="exp-description" placeholder="Job Description and achievements">${isDefault ? '• Led a team of 5 developers\n• Improved system performance by 40%\n• Implemented CI/CD pipelines' : ''}</textarea>
            <button class="remove-btn">Remove Experience</button>
        `;
        container.appendChild(newItem);
        
        if (!isDefault) {
            newItem.style.animation = 'slideIn 0.3s ease';
            this.showMessage('Experience added!');
        }
        
        this.updatePreview();
    }

    addEducation(isDefault = false) {
        const container = document.getElementById('educationContainer');
        const newItem = document.createElement('div');
        newItem.className = 'education-item';
        newItem.innerHTML = `
            <input type="text" class="edu-degree" placeholder="Degree" ${isDefault ? 'value="Bachelor of Computer Science"' : ''}>
            <input type="text" class="edu-institution" placeholder="Institution" ${isDefault ? 'value="University of Technology"' : ''}>
            <input type="text" class="edu-duration" placeholder="Duration (e.g., 2016-2020)" ${isDefault ? 'value="2016 - 2020"' : ''}>
            <textarea class="edu-description" placeholder="Achievements and coursework">${isDefault ? '• Graduated Summa Cum Laude\n• President of Computer Science Club\n• Relevant coursework: Algorithms, Data Structures, Web Development' : ''}</textarea>
            <button class="remove-btn">Remove Education</button>
        `;
        container.appendChild(newItem);
        
        if (!isDefault) {
            newItem.style.animation = 'slideIn 0.3s ease';
            this.showMessage('Education added!');
        }
        
        this.updatePreview();
    }

    addSkill(isDefault = false) {
        const container = document.getElementById('skillsContainer');
        const newItem = document.createElement('div');
        newItem.className = 'skill-item';
        newItem.innerHTML = `
            <input type="text" class="skill-name" placeholder="Skill Name" ${isDefault ? 'value="JavaScript"' : ''}>
            <select class="skill-level">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced" ${isDefault ? 'selected' : ''}>Advanced</option>
                <option value="expert">Expert</option>
            </select>
            <button class="remove-btn">Remove Skill</button>
        `;
        container.appendChild(newItem);
        
        if (!isDefault) {
            newItem.style.animation = 'slideIn 0.3s ease';
            this.showMessage('Skill added!');
        }
        
        this.updatePreview();
    }

    toggleSection(button) {
        const section = button.closest('.section');
        const content = section.querySelector('.form-group, #experienceContainer, #educationContainer, #skillsContainer');
        
        if (content.style.display === 'none') {
            content.style.display = 'flex';
            button.textContent = '−';
        } else {
            content.style.display = 'none';
            button.textContent = '+';
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        document.getElementById('themeToggle').textContent = this.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
        localStorage.setItem('resume-theme', this.isDarkMode ? 'dark' : 'light');
        this.showMessage(`${this.isDarkMode ? 'Dark' : 'Light'} mode activated`);
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('resume-theme');
        if (savedTheme === 'dark') {
            this.isDarkMode = true;
            document.body.setAttribute('data-theme', 'dark');
            document.getElementById('themeToggle').textContent = '☀️ Light Mode';
        }
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                this.showMessage('Image size should be less than 5MB', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.querySelector('.image-preview');
                preview.innerHTML = `<img src="${e.target.result}" alt="Profile Preview">`;
                this.updatePreview();
                this.showMessage('Profile image uploaded successfully!');
            };
            reader.onerror = () => {
                this.showMessage('Error uploading image', 'error');
            };
            reader.readAsDataURL(file);
        }
    }

    zoomPreview(change) {
        this.previewZoom = Math.max(0.5, Math.min(1.5, this.previewZoom + change));
        const preview = document.getElementById('resumePreview');
        preview.style.transform = `scale(${this.previewZoom})`;
        preview.style.transformOrigin = 'top center';
        document.getElementById('zoomLevel').textContent = `${Math.round(this.previewZoom * 100)}%`;
    }

    getFormData() {
        return {
            personal: {
                fullName: document.getElementById('fullName').value,
                jobTitle: document.getElementById('jobTitle').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                location: document.getElementById('location').value,
                summary: document.getElementById('summary').value,
                profileImage: document.querySelector('.image-preview img')?.src || null,
                languages: document.getElementById('languages').value,
                certifications: document.getElementById('certifications').value,
                projects: document.getElementById('projects').value,
                interests: document.getElementById('interests').value
            },
            experiences: Array.from(document.querySelectorAll('.experience-item')).map(item => ({
                jobTitle: item.querySelector('.exp-job-title').value,
                company: item.querySelector('.exp-company').value,
                duration: item.querySelector('.exp-duration').value,
                description: item.querySelector('.exp-description').value
            })),
            education: Array.from(document.querySelectorAll('.education-item')).map(item => ({
                degree: item.querySelector('.edu-degree').value,
                institution: item.querySelector('.edu-institution').value,
                duration: item.querySelector('.edu-duration').value,
                description: item.querySelector('.edu-description').value
            })),
            skills: Array.from(document.querySelectorAll('.skill-item')).map(item => ({
                name: item.querySelector('.skill-name').value,
                level: item.querySelector('.skill-level').value
            }))
        };
    }

    updatePreview() {
        const data = this.getFormData();
        const preview = document.getElementById('resumePreview');
        
        // Add updating animation
        preview.classList.add('updating');
        setTimeout(() => preview.classList.remove('updating'), 500);

        preview.innerHTML = this.generateResumeHTML(data);
    }

    generateResumeHTML(data) {
        const templates = {
            professional: this.generateProfessionalTemplate,
            modern: this.generateModernTemplate,
            creative: this.generateCreativeTemplate,
            executive: this.generateExecutiveTemplate
        };

        return templates[this.currentTemplate].call(this, data);
    }

    generateProfessionalTemplate(data) {
        return `
            <div class="resume-template professional">
                <div class="resume-header">
                    ${data.personal.profileImage ? 
                        `<img src="${data.personal.profileImage}" alt="Profile" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 15px;">` 
                        : ''}
                    <h2>${data.personal.fullName || 'Your Name'}</h2>
                    <div class="job-title">${data.personal.jobTitle || 'Professional Title'}</div>
                    <div class="contact-info">
                        ${data.personal.email ? `<span>📧 ${data.personal.email}</span>` : ''}
                        ${data.personal.phone ? `<span>📱 ${data.personal.phone}</span>` : ''}
                        ${data.personal.location ? `<span>📍 ${data.personal.location}</span>` : ''}
                    </div>
                </div>

                ${data.personal.summary ? `
                <div class="resume-section">
                    <h3>Professional Summary</h3>
                    <p style="line-height: 1.6;">${data.personal.summary.replace(/\n/g, '<br>')}</p>
                </div>
                ` : ''}

                ${data.experiences.filter(exp => exp.jobTitle || exp.company).length > 0 ? `
                <div class="resume-section">
                    <h3>Work Experience</h3>
                    ${data.experiences.filter(exp => exp.jobTitle || exp.company).map(exp => `
                        <div class="experience-item-preview">
                            <h4>${exp.jobTitle || ''}</h4>
                            <div class="company">${exp.company || ''}</div>
                            <div class="duration">${exp.duration || ''}</div>
                            <p>${exp.description ? exp.description.replace(/\n/g, '<br>') : ''}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${data.education.filter(edu => edu.degree || edu.institution).length > 0 ? `
                <div class="resume-section">
                    <h3>Education</h3>
                    ${data.education.filter(edu => edu.degree || edu.institution).map(edu => `
                        <div class="education-item-preview">
                            <h4>${edu.degree || ''}</h4>
                            <div class="institution">${edu.institution || ''}</div>
                            <div class="duration">${edu.duration || ''}</div>
                            <p>${edu.description ? edu.description.replace(/\n/g, '<br>') : ''}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${data.skills.filter(skill => skill.name).length > 0 ? `
                <div class="resume-section">
                    <h3>Skills</h3>
                    <div class="skills-list">
                        ${data.skills.filter(skill => skill.name).map(skill => `
                            <div class="skill-tag">${skill.name} ${skill.level ? `(${skill.level})` : ''}</div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${data.personal.languages || data.personal.certifications || data.personal.projects || data.personal.interests ? `
                <div class="resume-section">
                    <h3>Additional Information</h3>
                    ${data.personal.languages ? `<p><strong>Languages:</strong> ${data.personal.languages}</p>` : ''}
                    ${data.personal.certifications ? `<p><strong>Certifications:</strong> ${data.personal.certifications}</p>` : ''}
                    ${data.personal.projects ? `<p><strong>Projects:</strong> ${data.personal.projects.replace(/\n/g, '<br>')}</p>` : ''}
                    ${data.personal.interests ? `<p><strong>Interests:</strong> ${data.personal.interests.replace(/\n/g, '<br>')}</p>` : ''}
                </div>
                ` : ''}
            </div>
        `;
    }

    generateModernTemplate(data) {
        return `
            <div class="resume-template modern">
                <div class="resume-header">
                    ${data.personal.profileImage ? 
                        `<img src="${data.personal.profileImage}" alt="Profile" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 15px;">` 
                        : ''}
                    <h2>${data.personal.fullName || 'Your Name'}</h2>
                    <div class="job-title">${data.personal.jobTitle || 'Professional Title'}</div>
                    <div class="contact-info">
                        ${data.personal.email ? `<span>📧 ${data.personal.email}</span>` : ''}
                        ${data.personal.phone ? `<span>📱 ${data.personal.phone}</span>` : ''}
                        ${data.personal.location ? `<span>📍 ${data.personal.location}</span>` : ''}
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
                    <div>
                        ${data.personal.summary ? `
                        <div class="resume-section">
                            <h3>Professional Summary</h3>
                            <p style="line-height: 1.6;">${data.personal.summary.replace(/\n/g, '<br>')}</p>
                        </div>
                        ` : ''}

                        ${data.experiences.filter(exp => exp.jobTitle || exp.company).length > 0 ? `
                        <div class="resume-section">
                            <h3>Work Experience</h3>
                            ${data.experiences.filter(exp => exp.jobTitle || exp.company).map(exp => `
                                <div class="experience-item-preview">
                                    <h4>${exp.jobTitle || ''}</h4>
                                    <div class="company">${exp.company || ''}</div>
                                    <div class="duration">${exp.duration || ''}</div>
                                    <p>${exp.description ? exp.description.replace(/\n/g, '<br>') : ''}</p>
                                </div>
                            `).join('')}
                        </div>
                        ` : ''}

                        ${data.education.filter(edu => edu.degree || edu.institution).length > 0 ? `
                        <div class="resume-section">
                            <h3>Education</h3>
                            ${data.education.filter(edu => edu.degree || edu.institution).map(edu => `
                                <div class="education-item-preview">
                                    <h4>${edu.degree || ''}</h4>
                                    <div class="institution">${edu.institution || ''}</div>
                                    <div class="duration">${edu.duration || ''}</div>
                                    <p>${edu.description ? edu.description.replace(/\n/g, '<br>') : ''}</p>
                                </div>
                            `).join('')}
                        </div>
                        ` : ''}
                    </div>

                    <div>
                        ${data.skills.filter(skill => skill.name).length > 0 ? `
                        <div class="resume-section">
                            <h3>Skills</h3>
                            <div class="skills-list" style="flex-direction: column; gap: 8px;">
                                ${data.skills.filter(skill => skill.name).map(skill => `
                                    <div class="skill-tag" style="width: 100%; text-align: center; background: #4361ee; color: white;">${skill.name} ${skill.level ? `(${skill.level})` : ''}</div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        ${data.personal.languages || data.personal.certifications || data.personal.projects || data.personal.interests ? `
                        <div class="resume-section">
                            <h3>Additional</h3>
                            ${data.personal.languages ? `<p><strong>Languages:</strong><br>${data.personal.languages}</p>` : ''}
                            ${data.personal.certifications ? `<p><strong>Certifications:</strong><br>${data.personal.certifications}</p>` : ''}
                            ${data.personal.projects ? `<p><strong>Projects:</strong><br>${data.personal.projects.replace(/\n/g, '<br>')}</p>` : ''}
                            ${data.personal.interests ? `<p><strong>Interests:</strong><br>${data.personal.interests.replace(/\n/g, '<br>')}</p>` : ''}
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    generateCreativeTemplate(data) {
        return `
            <div class="resume-template creative">
                <div class="resume-header">
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 15px;">
                        ${data.personal.profileImage ? 
                            `<img src="${data.personal.profileImage}" alt="Profile" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover;">` 
                            : ''}
                        <div>
                            <h2>${data.personal.fullName || 'Your Name'}</h2>
                            <div class="job-title">${data.personal.jobTitle || 'Professional Title'}</div>
                        </div>
                    </div>
                    <div class="contact-info" style="margin-top: 15px;">
                        ${data.personal.email ? `<span>📧 ${data.personal.email}</span>` : ''}
                        ${data.personal.phone ? `<span>📱 ${data.personal.phone}</span>` : ''}
                        ${data.personal.location ? `<span>📍 ${data.personal.location}</span>` : ''}
                    </div>
                </div>

                ${data.personal.summary ? `
                <div class="resume-section">
                    <h3>Professional Summary</h3>
                    <p style="line-height: 1.6;">${data.personal.summary.replace(/\n/g, '<br>')}</p>
                </div>
                ` : ''}

                ${data.experiences.filter(exp => exp.jobTitle || exp.company).length > 0 ? `
                <div class="resume-section">
                    <h3>Work Experience</h3>
                    ${data.experiences.filter(exp => exp.jobTitle || exp.company).map(exp => `
                        <div class="experience-item-preview">
                            <h4>${exp.jobTitle || ''}</h4>
                            <div class="company">${exp.company || ''}</div>
                            <div class="duration">${exp.duration || ''}</div>
                            <p>${exp.description ? exp.description.replace(/\n/g, '<br>') : ''}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${data.education.filter(edu => edu.degree || edu.institution).length > 0 ? `
                <div class="resume-section">
                    <h3>Education</h3>
                    ${data.education.filter(edu => edu.degree || edu.institution).map(edu => `
                        <div class="education-item-preview">
                            <h4>${edu.degree || ''}</h4>
                            <div class="institution">${edu.institution || ''}</div>
                            <div class="duration">${edu.duration || ''}</div>
                            <p>${edu.description ? edu.description.replace(/\n/g, '<br>') : ''}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${data.skills.filter(skill => skill.name).length > 0 ? `
                <div class="resume-section">
                    <h3>Skills</h3>
                    <div class="skills-list">
                        ${data.skills.filter(skill => skill.name).map(skill => `
                            <div class="skill-tag" style="background: #f72585; color: white;">${skill.name} ${skill.level ? `(${skill.level})` : ''}</div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    generateExecutiveTemplate(data) {
        return `
            <div class="resume-template executive">
                <div class="resume-header">
                    <h2>${data.personal.fullName || 'Your Name'}</h2>
                    <div class="job-title">${data.personal.jobTitle || 'Executive Title'}</div>
                    <div class="contact-info">
                        ${data.personal.email ? `<span>${data.personal.email}</span>` : ''}
                        ${data.personal.phone ? `<span>${data.personal.phone}</span>` : ''}
                        ${data.personal.location ? `<span>${data.personal.location}</span>` : ''}
                    </div>
                </div>

                ${data.personal.summary ? `
                <div class="resume-section">
                    <h3>Executive Summary</h3>
                    <p style="line-height: 1.6;">${data.personal.summary.replace(/\n/g, '<br>')}</p>
                </div>
                ` : ''}

                ${data.experiences.filter(exp => exp.jobTitle || exp.company).length > 0 ? `
                <div class="resume-section">
                    <h3>Professional Experience</h3>
                    ${data.experiences.filter(exp => exp.jobTitle || exp.company).map(exp => `
                        <div class="experience-item-preview">
                            <h4>${exp.jobTitle || ''}</h4>
                            <div class="company">${exp.company || ''}</div>
                            <div class="duration">${exp.duration || ''}</div>
                            <p>${exp.description ? exp.description.replace(/\n/g, '<br>') : ''}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${data.education.filter(edu => edu.degree || edu.institution).length > 0 ? `
                <div class="resume-section">
                    <h3>Education</h3>
                    ${data.education.filter(edu => edu.degree || edu.institution).map(edu => `
                        <div class="education-item-preview">
                            <h4>${edu.degree || ''}</h4>
                            <div class="institution">${edu.institution || ''}</div>
                            <div class="duration">${edu.duration || ''}</div>
                            <p>${edu.description ? edu.description.replace(/\n/g, '<br>') : ''}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    ${data.skills.filter(skill => skill.name).length > 0 ? `
                    <div class="resume-section">
                        <h3>Core Competencies</h3>
                        <div class="skills-list" style="flex-direction: column; gap: 8px;">
                            ${data.skills.filter(skill => skill.name).map(skill => `
                                <div class="skill-tag" style="width: 100%; text-align: center; background: #2a9d8f; color: white;">${skill.name}</div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    ${data.personal.languages || data.personal.certifications ? `
                    <div class="resume-section">
                        <h3>Additional</h3>
                        ${data.personal.languages ? `<p><strong>Languages:</strong><br>${data.personal.languages}</p>` : ''}
                        ${data.personal.certifications ? `<p><strong>Certifications:</strong><br>${data.personal.certifications}</p>` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    initializeDemoData() {
        // Set some demo data to showcase the app
        setTimeout(() => {
            if (!document.getElementById('fullName').value) {
                document.getElementById('fullName').value = 'John Doe';
                document.getElementById('jobTitle').value = 'Senior Software Engineer';
                document.getElementById('email').value = 'john.doe@email.com';
                document.getElementById('phone').value = '+1 (555) 123-4567';
                document.getElementById('location').value = 'San Francisco, CA';
                document.getElementById('summary').value = 'Experienced software engineer with 8+ years in full-stack development. Specialized in JavaScript, React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading development teams.';
                document.getElementById('languages').value = 'English (Native), Spanish (Intermediate)';
                document.getElementById('certifications').value = 'AWS Certified Developer, Scrum Master Certified';
                document.getElementById('projects').value = 'E-commerce Platform - Led development of a scalable platform serving 10k+ users\nMobile App - Built cross-platform app with React Native\nAPI Integration - Integrated multiple third-party APIs with 99.9% uptime';
                document.getElementById('interests').value = 'Open Source Contributions, Machine Learning, Hiking, Photography';
                
                this.updatePreview();
            }
        }, 1000);
    }

    exportPdf() {
        if (typeof exportToPdf === 'function') {
            exportToPdf();
        } else {
            this.showMessage('PDF export is loading...', 'info');
            setTimeout(() => {
                if (typeof exportToPdf === 'function') {
                    exportToPdf();
                } else {
                    this.showMessage('PDF export failed to load. Please refresh the page.', 'error');
                }
            }, 1000);
        }
    }

    exportWord() {
        if (typeof exportToWord === 'function') {
            exportToWord();
        } else {
            this.showMessage('Word export is loading...', 'info');
            setTimeout(() => {
                if (typeof exportToWord === 'function') {
                    exportToWord();
                } else {
                    this.showMessage('Word export failed to load. Please refresh the page.', 'error');
                }
            }, 1000);
        }
    }

    exportPrint() {
        window.print();
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        document.querySelectorAll('.success-message').forEach(msg => msg.remove());
        
        const messageEl = document.createElement('div');
        messageEl.className = `success-message ${type}-message`;
        messageEl.textContent = message;
        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resumeMaker = new ResumeMaker();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .resume-preview.updating {
        animation: pulse 0.5s ease;
    }
    
    @keyframes pulse {
        0% { opacity: 0.8; }
        50% { opacity: 0.9; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);