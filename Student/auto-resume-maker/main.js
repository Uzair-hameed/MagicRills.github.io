// Main Application Controller - Advanced
class ResumeApp {
    constructor() {
        this.resumeData = this.loadInitialData();
        this.init();
    }

    loadInitialData() {
        return {
            personal: {
                name: "",
                title: "",
                email: "",
                phone: "",
                location: "",
                summary: "",
                image: ""
            },
            experience: [],
            education: [],
            skills: [],
            settings: {
                theme: "blue",
                template: "modern"
            }
        };
    }

    init() {
        this.builder = new ResumeBuilder(this);
        this.exporter = new ResumeExporter(this);
        this.initializeEventListeners();
        this.loadFromLocalStorage();
        this.generatePreview();
        
        // Auto-save every 5 seconds
        setInterval(() => this.saveToLocalStorage(), 5000);
    }

    initializeEventListeners() {
        // Tab functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Personal Info
        document.getElementById('full-name').addEventListener('input', (e) => {
            this.resumeData.personal.name = e.target.value;
            this.updateSaveStatus('Unsaved changes', '#e74c3c');
        });

        document.getElementById('job-title').addEventListener('input', (e) => {
            this.resumeData.personal.title = e.target.value;
            this.updateSaveStatus('Unsaved changes', '#e74c3c');
        });

        document.getElementById('email').addEventListener('input', (e) => {
            this.resumeData.personal.email = e.target.value;
            this.updateSaveStatus('Unsaved changes', '#e74c3c');
        });

        document.getElementById('phone').addEventListener('input', (e) => {
            this.resumeData.personal.phone = e.target.value;
            this.updateSaveStatus('Unsaved changes', '#e74c3c');
        });

        document.getElementById('location').addEventListener('input', (e) => {
            this.resumeData.personal.location = e.target.value;
            this.updateSaveStatus('Unsaved changes', '#e74c3c');
        });

        document.getElementById('summary').addEventListener('input', (e) => {
            this.resumeData.personal.summary = e.target.value;
            this.updateSaveStatus('Unsaved changes', '#e74c3c');
        });

        // Profile Image Upload
        document.getElementById('upload-area').addEventListener('click', () => {
            document.getElementById('profile-image').click();
        });

        document.getElementById('profile-image').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        document.getElementById('remove-image').addEventListener('click', () => {
            this.removeProfileImage();
        });

        // Add Item Buttons
        document.getElementById('add-experience').addEventListener('click', () => {
            this.addExperienceItem();
        });

        document.getElementById('add-education').addEventListener('click', () => {
            this.addEducationItem();
        });

        document.getElementById('add-skill').addEventListener('click', () => {
            this.addSkillItem();
        });

        // Template Selection
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const template = e.currentTarget.getAttribute('data-template');
                this.selectTemplate(template);
            });
        });

        // Theme Selection
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.currentTarget.getAttribute('data-theme');
                this.selectTheme(theme);
            });
        });

        // Action Buttons
        document.getElementById('preview-btn').addEventListener('click', () => this.generatePreview());
        document.getElementById('refresh-preview').addEventListener('click', () => this.generatePreview());
        document.getElementById('download-pdf').addEventListener('click', () => this.downloadPDF());
        document.getElementById('download-doc').addEventListener('click', () => this.downloadDOC());
        document.getElementById('print-btn').addEventListener('click', () => this.printResume());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetForm());
    }

    switchTab(tabId) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size should be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.resumeData.personal.image = e.target.result;
                document.getElementById('profile-image-preview').src = e.target.result;
                document.getElementById('image-preview-container').style.display = 'block';
                document.getElementById('upload-area').style.display = 'none';
                this.generatePreview();
                this.updateSaveStatus('Unsaved changes', '#e74c3c');
            };
            reader.readAsDataURL(file);
        }
    }

    removeProfileImage() {
        this.resumeData.personal.image = '';
        document.getElementById('image-preview-container').style.display = 'none';
        document.getElementById('upload-area').style.display = 'block';
        document.getElementById('profile-image').value = '';
        this.generatePreview();
        this.updateSaveStatus('Unsaved changes', '#e74c3c');
    }

    addExperienceItem() {
        const id = Date.now();
        this.resumeData.experience.push({
            id: id,
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: '',
            current: false
        });
        this.renderExperienceItems();
        this.updateSaveStatus('Unsaved changes', '#e74c3c');
    }

    addEducationItem() {
        const id = Date.now();
        this.resumeData.education.push({
            id: id,
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            description: ''
        });
        this.renderEducationItems();
        this.updateSaveStatus('Unsaved changes', '#e74c3c');
    }

    addSkillItem() {
        const id = Date.now();
        this.resumeData.skills.push({
            id: id,
            name: '',
            level: 'Intermediate'
        });
        this.renderSkillItems();
        this.updateSaveStatus('Unsaved changes', '#e74c3c');
    }

    renderExperienceItems() {
        const container = document.getElementById('experience-items');
        container.innerHTML = '';

        this.resumeData.experience.forEach(exp => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" class="exp-company" value="${exp.company}" data-id="${exp.id}" placeholder="Company Name">
                </div>
                <div class="form-group">
                    <label>Position</label>
                    <input type="text" class="exp-position" value="${exp.position}" data-id="${exp.id}" placeholder="Job Title">
                </div>
                <div style="display: flex; gap: 10px;">
                    <div class="form-group" style="flex: 1;">
                        <label>Start Date</label>
                        <input type="text" class="exp-start" value="${exp.startDate}" data-id="${exp.id}" placeholder="MM/YYYY">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>End Date</label>
                        <input type="text" class="exp-end" value="${exp.endDate}" data-id="${exp.id}" placeholder="MM/YYYY or Present">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="exp-desc" data-id="${exp.id}" placeholder="Describe your responsibilities and achievements">${exp.description}</textarea>
                </div>
                <button class="remove-item" data-id="${exp.id}">×</button>
            `;
            container.appendChild(item);

            // Add event listeners
            item.querySelector('.exp-company').addEventListener('input', (e) => {
                this.updateExperienceItem(exp.id, 'company', e.target.value);
            });
            item.querySelector('.exp-position').addEventListener('input', (e) => {
                this.updateExperienceItem(exp.id, 'position', e.target.value);
            });
            item.querySelector('.exp-start').addEventListener('input', (e) => {
                this.updateExperienceItem(exp.id, 'startDate', e.target.value);
            });
            item.querySelector('.exp-end').addEventListener('input', (e) => {
                this.updateExperienceItem(exp.id, 'endDate', e.target.value);
            });
            item.querySelector('.exp-desc').addEventListener('input', (e) => {
                this.updateExperienceItem(exp.id, 'description', e.target.value);
            });
            item.querySelector('.remove-item').addEventListener('click', () => {
                this.removeExperienceItem(exp.id);
            });
        });
    }

    updateExperienceItem(id, field, value) {
        const item = this.resumeData.experience.find(exp => exp.id === id);
        if (item) {
            item[field] = value;
            this.updateSaveStatus('Unsaved changes', '#e74c3c');
        }
    }

    removeExperienceItem(id) {
        this.resumeData.experience = this.resumeData.experience.filter(exp => exp.id !== id);
        this.renderExperienceItems();
        this.generatePreview();
        this.updateSaveStatus('Unsaved changes', '#e74c3c');
    }

    renderEducationItems() {
        const container = document.getElementById('education-items');
        container.innerHTML = '';

        this.resumeData.education.forEach(edu => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <div class="form-group">
                    <label>Institution</label>
                    <input type="text" class="edu-institution" value="${edu.institution}" data-id="${edu.id}" placeholder="University Name">
                </div>
                <div class="form-group">
                    <label>Degree</label>
                    <input type="text" class="edu-degree" value="${edu.degree}" data-id="${edu.id}" placeholder="Bachelor of Science">
                </div>
                <div class="form-group">
                    <label>Field of Study</label>
                    <input type="text" class="edu-field" value="${edu.field}" data-id="${edu.id}" placeholder="Computer Science">
                </div>
                <div style="display: flex; gap: 10px;">
                    <div class="form-group" style="flex: 1;">
                        <label>Start Date</label>
                        <input type="text" class="edu-start" value="${edu.startDate}" data-id="${edu.id}" placeholder="MM/YYYY">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>End Date</label>
                        <input type="text" class="edu-end" value="${edu.endDate}" data-id="${edu.id}" placeholder="MM/YYYY">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="edu-desc" data-id="${edu.id}" placeholder="Academic achievements">${edu.description}</textarea>
                </div>
                <button class="remove-item" data-id="${edu.id}">×</button>
            `;
            container.appendChild(item);

            // Add event listeners
            item.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', (e) => {
                    const field = e.target.className.replace('edu-', '');
                    this.updateEducationItem(edu.id, field, e.target.value);
                });
            });
            item.querySelector('.remove-item').addEventListener('click', () => {
                this.removeEducationItem(edu.id);
            });
        });
    }

    updateEducationItem(id, field, value) {
        const item = this.resumeData.education.find(edu => edu.id === id);
        if (item) {
            item[field] = value;
            this.updateSaveStatus('Unsaved changes', '#e74c3c');
        }
    }

    removeEducationItem(id) {
        this.resumeData.education = this.resumeData.education.filter(edu => edu.id !== id);
        this.renderEducationItems();
        this.generatePreview();
        this.updateSaveStatus('Unsaved changes', '#e74c3c');
    }

    renderSkillItems() {
        const container = document.getElementById('skill-items');
        container.innerHTML = '';

        this.resumeData.skills.forEach(skill => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <div class="form-group">
                    <label>Skill Name</label>
                    <input type="text" class="skill-name" value="${skill.name}" data-id="${skill.id}" placeholder="JavaScript, Project Management">
                </div>
                <div class="form-group">
                    <label>Proficiency Level</label>
                    <select class="skill-level" data-id="${skill.id}">
                        <option value="Beginner" ${skill.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
                        <option value="Intermediate" ${skill.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                        <option value="Advanced" ${skill.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
                        <option value="Expert" ${skill.level === 'Expert' ? 'selected' : ''}>Expert</option>
                    </select>
                </div>
                <button class="remove-item" data-id="${skill.id}">×</button>
            `;
            container.appendChild(item);

            item.querySelector('.skill-name').addEventListener('input', (e) => {
                this.updateSkillItem(skill.id, 'name', e.target.value);
            });
            item.querySelector('.skill-level').addEventListener('change', (e) => {
                this.updateSkillItem(skill.id, 'level', e.target.value);
            });
            item.querySelector('.remove-item').addEventListener('click', () => {
                this.removeSkillItem(skill.id);
            });
        });
    }

    updateSkillItem(id, field, value) {
        const item = this.resumeData.skills.find(skill => skill.id === id);
        if (item) {
            item[field] = value;
            this.updateSaveStatus('Unsaved changes', '#e74c3c');
        }
    }

    removeSkillItem(id) {
        this.resumeData.skills = this.resumeData.skills.filter(skill => skill.id !== id);
        this.renderSkillItems();
        this.generatePreview();
        this.updateSaveStatus('Unsaved changes', '#e74c3c');
    }

    selectTemplate(template) {
        this.resumeData.settings.template = template;
        document.querySelectorAll('.template-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelector(`[data-template="${template}"]`).classList.add('selected');
        
        const preview = document.getElementById('resume-preview');
        preview.className = 'resume-preview';
        preview.classList.add(`template-${template}`);
        
        this.generatePreview();
        this.updateSaveStatus('Unsaved changes', '#e74c3c');
    }

    selectTheme(theme) {
        this.resumeData.settings.theme = theme;
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelector(`[data-theme="${theme}"]`).classList.add('selected');
        
        // Update CSS variables based on theme
        this.applyTheme(theme);
        this.generatePreview();
        this.updateSaveStatus('Unsaved changes', '#e74c3c');
    }

    applyTheme(theme) {
        const root = document.documentElement;
        const themes = {
            blue: { primary: '#3498db', secondary: '#2980b9', header: '#2c3e50' },
            green: { primary: '#27ae60', secondary: '#219652', header: '#1e8449' },
            purple: { primary: '#9b59b6', secondary: '#8e44ad', header: '#7d3c98' },
            dark: { primary: '#2c3e50', secondary: '#1a252f', header: '#34495e' }
        };

        const colors = themes[theme] || themes.blue;
        root.style.setProperty('--primary-color', colors.primary);
        root.style.setProperty('--secondary-color', colors.secondary);
        root.style.setProperty('--header-color', colors.header);
    }

    generatePreview() {
        if (this.builder) {
            this.builder.generatePreview();
        }
    }

    downloadPDF() {
        if (this.exporter) {
            this.exporter.downloadPDF();
        }
    }

    downloadDOC() {
        if (this.exporter) {
            this.exporter.downloadDOC();
        }
    }

    printResume() {
        window.print();
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('resumeData', JSON.stringify(this.resumeData));
            this.updateSaveStatus('Auto-saved', '#27ae60');
        } catch (error) {
            console.error('Save error:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('resumeData');
            if (saved) {
                const data = JSON.parse(saved);
                this.resumeData = { ...this.resumeData, ...data };
                this.updateFormFields();
                this.applyTheme(this.resumeData.settings.theme);
                
                // Update UI selections
                document.querySelector(`[data-template="${this.resumeData.settings.template}"]`)?.classList.add('selected');
                document.querySelector(`[data-theme="${this.resumeData.settings.theme}"]`)?.classList.add('selected');
                
                // Render dynamic items
                this.renderExperienceItems();
                this.renderEducationItems();
                this.renderSkillItems();
                
                // Handle image
                if (this.resumeData.personal.image) {
                    document.getElementById('profile-image-preview').src = this.resumeData.personal.image;
                    document.getElementById('image-preview-container').style.display = 'block';
                    document.getElementById('upload-area').style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Load error:', error);
        }
    }

    updateFormFields() {
        const p = this.resumeData.personal;
        document.getElementById('full-name').value = p.name || '';
        document.getElementById('job-title').value = p.title || '';
        document.getElementById('email').value = p.email || '';
        document.getElementById('phone').value = p.phone || '';
        document.getElementById('location').value = p.location || '';
        document.getElementById('summary').value = p.summary || '';
    }

    resetForm() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            this.resumeData = this.loadInitialData();
            localStorage.removeItem('resumeData');
            this.updateFormFields();
            this.renderExperienceItems();
            this.renderEducationItems();
            this.renderSkillItems();
            this.applyTheme('blue');
            this.removeProfileImage();
            this.generatePreview();
            this.updateSaveStatus('Form reset', '#27ae60');
        }
    }

    updateSaveStatus(message, color) {
        const status = document.getElementById('auto-save-status');
        status.textContent = message;
        status.style.color = color;
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.resumeApp = new ResumeApp();
});