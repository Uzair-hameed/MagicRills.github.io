// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.querySelector('#themeSwitch i');
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
    }

    setupEventListeners() {
        document.getElementById('themeSwitch').addEventListener('click', () => {
            this.toggleTheme();
        });
    }
}

// Design Manager
class DesignManager {
    constructor() {
        this.currentLayout = 'modern';
        this.currentStyle = 'style1';
        this.currentClipart = '';
        this.customCliparts = [];
        this.init();
    }

    init() {
        this.setupDesignButtons();
        this.setupPosterStyles();
        this.setupClipartGallery();
        this.setupCustomClipartUpload();
    }

    setupDesignButtons() {
        const buttons = document.querySelectorAll('.design-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                buttons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentLayout = e.target.dataset.layout;
                this.applyLayout();
            });
        });
    }

    setupPosterStyles() {
        const previews = document.querySelectorAll('.poster-preview');
        previews.forEach(preview => {
            preview.addEventListener('click', (e) => {
                previews.forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                this.currentStyle = e.target.dataset.style;
                this.applyStyle();
            });
        });
    }

    setupClipartGallery() {
        const cliparts = document.querySelectorAll('.clipart-item');
        cliparts.forEach(clipart => {
            clipart.addEventListener('click', (e) => {
                cliparts.forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                this.currentClipart = e.target.dataset.clipart;
            });
        });
    }

    setupCustomClipartUpload() {
        const clipartInput = document.getElementById('clipartInput');
        clipartInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                this.handleCustomClipartUpload(e.target.files[0]);
            }
        });
    }

    handleCustomClipartUpload(file) {
        if (!file.type.match('image.*')) {
            this.showNotification('Please upload an image file', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('File size must be less than 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const clipartGallery = document.querySelector('.clipart-gallery');
            const newClipart = document.createElement('div');
            newClipart.className = 'clipart-item active';
            newClipart.innerHTML = `<img src="${e.target.result}" alt="Custom Clipart" style="width: 100%; height: 100%; object-fit: contain;">`;
            
            clipartGallery.appendChild(newClipart);
            
            newClipart.addEventListener('click', () => {
                document.querySelectorAll('.clipart-item').forEach(c => c.classList.remove('active'));
                newClipart.classList.add('active');
                this.currentClipart = e.target.result;
            });

            this.customCliparts.push(e.target.result);
            this.showNotification('Custom clipart uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }

    applyLayout() {
        const preview = document.getElementById('adPreview');
        preview.className = `ad-preview layout-${this.currentLayout}`;
    }

    applyStyle() {
        const preview = document.getElementById('adPreview');
        preview.style.background = this.getStyleBackground();
    }

    getStyleBackground() {
        const styles = {
            'style1': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'style2': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'style3': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'style4': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'style5': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'style6': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
        };
        return styles[this.currentStyle] || styles.style1;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Image and Logo Handler
class ImageHandler {
    constructor() {
        this.currentLogo = null;
        this.additionalImages = [];
        this.init();
    }

    init() {
        this.setupLogoUpload();
        this.setupAdditionalImages();
    }

    setupLogoUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('logoInput');
        const logoPreview = document.getElementById('logoPreview');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#3498db';
            uploadArea.style.background = 'rgba(52, 152, 219, 0.1)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                this.handleLogoUpload(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                this.handleLogoUpload(e.target.files[0]);
            }
        });
    }

    handleLogoUpload(file) {
        if (!file.type.match('image.*')) {
            this.showNotification('Please upload an image file (PNG, JPG, SVG)', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('File size must be less than 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentLogo = e.target.result;
            const logoPreview = document.getElementById('logoPreview');
            logoPreview.innerHTML = `
                <img src="${e.target.result}" alt="Uploaded Logo" style="max-width: 100px; max-height: 100px;">
                <button onclick="removeLogo()" class="remove-btn" style="position: absolute; top: -5px; right: -5px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">×</button>
            `;
            
            const uploadArea = document.getElementById('uploadArea');
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle" style="color: #27ae60;"></i>
                <p>Logo uploaded successfully</p>
                <p class="upload-hint">Click to change logo</p>
            `;
            
            // Reattach event listeners
            this.setupLogoUpload();
            
            this.showNotification('Logo uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }

    setupAdditionalImages() {
        const uploadArea = document.getElementById('additionalImagesArea');
        const fileInput = document.getElementById('additionalImages');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                Array.from(e.target.files).forEach(file => {
                    this.handleAdditionalImageUpload(file);
                });
            }
        });
    }

    handleAdditionalImageUpload(file) {
        if (!file.type.match('image.*')) {
            this.showNotification('Please upload image files only', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('File size must be less than 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.additionalImages.push(e.target.result);
            this.updateAdditionalPreview();
            this.showNotification('Image added successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }

    updateAdditionalPreview() {
        const preview = document.getElementById('additionalPreview');
        preview.innerHTML = this.additionalImages.map((img, index) => `
            <div style="position: relative; display: inline-block;">
                <img src="${img}" alt="Additional Image ${index + 1}" style="max-width: 100px; max-height: 100px;">
                <button onclick="removeAdditionalImage(${index})" class="remove-btn" style="position: absolute; top: -5px; right: -5px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">×</button>
            </div>
        `).join('');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Job Ad Generator
class JobAdGenerator {
    constructor() {
        this.imageMap = {
            'Principal': ['#ffe5e5', '🏫', '#ff6b6b', 'Education Leader'],
            'Head Teacher': ['#d4f1f9', '👨‍🏫', '#4ecdc4', 'Academic Head'],
            'Teacher': ['#eaffea', '📚', '#45b7d1', 'Educator'],
            'Coordinator': ['#f5e6ff', '🔗', '#96ceb4', 'Program Coordinator'],
            'Admin': ['#fffacc', '💼', '#feca57', 'Administrator'],
            'Assistant Teacher': ['#ffffcc', '👩‍🏫', '#ff9ff3', 'Teaching Assistant'],
            'IT Specialist': ['#e6f7ff', '💻', '#54a0ff', 'IT Professional'],
            'Librarian': ['#fff2cc', '📖', '#ff9f43', 'Library Manager'],
            'HR Manager': ['#ffe6f0', '🤝', '#ff6b81', 'HR Specialist'],
            'Receptionist': ['#e6ffff', '📞', '#48dbfb', 'Front Desk'],
            'Accountant': ['#f0fff0', '💰', '#1dd1a1', 'Finance Expert'],
            'Marketing Manager': ['#f0e6ff', '📈', '#9b59b6', 'Marketing Pro'],
            'Sales Executive': ['#fff0f5', '🎯', '#e74c3c', 'Sales Expert'],
            'Project Manager': ['#e6f7ff', '📊', '#3498db', 'Project Lead'],
            'Other': ['#f0f0f0', '🔍', '#576574', 'Professional']
        };
    }

    generateAd() {
        const orgName = document.getElementById('orgName').value;
        const post = document.getElementById('post').value;
        const qualification = document.getElementById('qualification').value;
        const experience = document.getElementById('experience').value;
        const salary = document.getElementById('salary').value;
        const location = document.getElementById('location').value;
        const jobDescription = document.getElementById('jobDescription').innerHTML;
        const computerExp = document.getElementById('computerExp').innerHTML;
        const contactEmail = document.getElementById('contactEmail').value;
        const contactPhone = document.getElementById('contactPhone').value;
        const contactPerson = document.getElementById('contactPerson').value;

        if (!orgName || !post) {
            this.showNotification('Please fill in all required fields (Organization Name and Job Position)', 'error');
            return;
        }

        const adData = {
            orgName,
            post,
            qualification,
            experience,
            salary,
            location,
            jobDescription: jobDescription || 'Not specified',
            computerExp: computerExp || 'Not specified',
            contactEmail,
            contactPhone,
            contactPerson,
            logo: window.imageHandler.currentLogo,
            additionalImages: window.imageHandler.additionalImages,
            clipart: window.designManager.currentClipart,
            ...this.imageMap[post] || this.imageMap['Other']
        };

        this.renderAd(adData);
    }

    renderAd(data) {
        const preview = document.getElementById('adPreview');
        
        preview.innerHTML = `
            <div class="job-ad" style="background: ${data[0]}; color: #333; border-radius: 15px; padding: 2rem; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
                <div class="ad-header">
                    <div class="logo-section">
                        ${data.logo ? `<img src="${data.logo}" class="ad-logo" alt="${data.orgName} Logo" style="max-width: 100px; max-height: 80px;">` : ''}
                        <h2 style="margin: 0; color: ${data[2]}; font-size: 2rem;">${data.orgName}</h2>
                    </div>
                    <div class="post-icon" style="font-size: 3rem; color: ${data[2]};">
                        ${data.clipart || data[1]}
                    </div>
                </div>
                
                <div class="ad-body">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <h3 style="color: ${data[2]}; font-size: 1.8rem; margin-bottom: 0.5rem;">We're Hiring: ${data.post}</h3>
                        <p style="color: #666; font-style: italic; font-size: 1.1rem;">${data[3]}</p>
                    </div>
                    
                    <div class="ad-details" style="background: rgba(255,255,255,0.8); padding: 1.5rem; border-radius: 10px;">
                        <div class="detail-item">
                            <i class="fas fa-graduation-cap" style="color: ${data[2]}"></i>
                            <div>
                                <strong>Qualification:</strong> ${data.qualification}
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-chart-line" style="color: ${data[2]}"></i>
                            <div>
                                <strong>Experience:</strong> ${data.experience}
                            </div>
                        </div>
                        
                        ${data.salary ? `
                        <div class="detail-item">
                            <i class="fas fa-money-bill-wave" style="color: ${data[2]}"></i>
                            <div>
                                <strong>Salary:</strong> ${data.salary}
                            </div>
                        </div>
                        ` : ''}
                        
                        ${data.location ? `
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt" style="color: ${data[2]}"></i>
                            <div>
                                <strong>Location:</strong> ${data.location}
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="detail-item">
                            <i class="fas fa-file-alt" style="color: ${data[2]}"></i>
                            <div>
                                <strong>Job Description:</strong>
                                <div class="job-description" style="margin-top: 0.5rem; padding-left: 1rem;">
                                    ${data.jobDescription}
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-laptop-code" style="color: ${data[2]}"></i>
                            <div>
                                <strong>Computer Skills:</strong>
                                <div class="computer-skills" style="margin-top: 0.5rem; padding-left: 1rem;">
                                    ${data.computerExp}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${data.additionalImages && data.additionalImages.length > 0 ? `
                    <div class="additional-images" style="margin: 2rem 0; text-align: center;">
                        <h4 style="color: ${data[2]}; margin-bottom: 1rem;">Work Environment</h4>
                        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                            ${data.additionalImages.map(img => `
                                <img src="${img}" alt="Work Environment" style="max-width: 150px; max-height: 100px; border-radius: 8px; border: 2px solid ${data[2]};">
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="ad-footer" style="background: rgba(255,255,255,0.9); padding: 1.5rem; border-radius: 10px; text-align: center; margin-top: 2rem;">
                        <h4 style="color: ${data[2]}; margin-bottom: 1rem;">How to Apply</h4>
                        ${data.contactEmail ? `<p>📧 <strong>Email:</strong> ${data.contactEmail}</p>` : ''}
                        ${data.contactPhone ? `<p>📞 <strong>Phone:</strong> ${data.contactPhone}</p>` : ''}
                        ${data.contactPerson ? `<p>👤 <strong>Contact:</strong> ${data.contactPerson}</p>` : ''}
                        <p style="margin-top: 1rem; font-weight: bold; color: ${data[2]};">Apply now with your updated resume!</p>
                    </div>
                </div>
            </div>
        `;
        
        this.showNotification('Job ad generated successfully!', 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// AI Integration
class AIIntegration {
    static async generateWithAI() {
        const loading = document.getElementById('loading');
        loading.classList.remove('hidden');

        try {
            // Simulate AI API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const post = document.getElementById('post').value || 'Teacher';
            
            // Mock AI response based on job position
            const mockAIResponse = {
                jobDescription: this.generateJobDescription(post),
                computerExp: this.generateComputerSkills(post)
            };

            document.getElementById('jobDescription').innerHTML = mockAIResponse.jobDescription;
            document.getElementById('computerExp').innerHTML = mockAIResponse.computerExp;
            
            loading.classList.add('hidden');
            
            this.showNotification('AI content generated successfully!', 'success');
            
        } catch (error) {
            loading.classList.add('hidden');
            this.showNotification('AI generation failed. Please try again.', 'error');
            console.error('AI Generation failed:', error);
        }
    }

    static generateJobDescription(post) {
        const descriptions = {
            'Teacher': `
                <ul>
                    <li>Develop and implement engaging lesson plans</li>
                    <li>Assess and evaluate student progress</li>
                    <li>Create a positive and inclusive learning environment</li>
                    <li>Collaborate with parents and staff</li>
                    <li>Participate in professional development activities</li>
                </ul>
            `,
            'IT Specialist': `
                <ul>
                    <li>Maintain and troubleshoot computer systems and networks</li>
                    <li>Implement security measures and data protection</li>
                    <li>Provide technical support to staff and students</li>
                    <li>Manage software installations and updates</li>
                    <li>Develop and maintain IT documentation</li>
                </ul>
            `,
            'Admin': `
                <ul>
                    <li>Manage office operations and administrative tasks</li>
                    <li>Coordinate meetings and maintain schedules</li>
                    <li>Handle correspondence and documentation</li>
                    <li>Maintain records and filing systems</li>
                    <li>Support staff with administrative needs</li>
                </ul>
            `,
            'default': `
                <ul>
                    <li>Perform duties as assigned by supervisor</li>
                    <li>Maintain professional standards and ethics</li>
                    <li>Collaborate effectively with team members</li>
                    <li>Meet performance targets and deadlines</li>
                    <li>Participate in ongoing training and development</li>
                </ul>
            `
        };

        return descriptions[post] || descriptions.default;
    }

    static generateComputerSkills(post) {
        const skills = {
            'Teacher': `
                <ul>
                    <li>Proficient in Microsoft Office Suite (Word, Excel, PowerPoint)</li>
                    <li>Experience with Learning Management Systems (LMS)</li>
                    <li>Familiar with educational software and online platforms</li>
                    <li>Basic troubleshooting and technical support skills</li>
                    <li>Video conferencing tools (Zoom, Google Meet)</li>
                </ul>
            `,
            'IT Specialist': `
                <ul>
                    <li>Expert in network administration and security</li>
                    <li>Proficient in programming languages (Python, JavaScript)</li>
                    <li>Experience with database management (SQL, MongoDB)</li>
                    <li>Knowledge of cloud platforms (AWS, Azure)</li>
                    <li>Hardware and software troubleshooting expertise</li>
                </ul>
            `,
            'default': `
                <ul>
                    <li>Microsoft Office Suite (Word, Excel, PowerPoint)</li>
                    <li>Email and calendar management</li>
                    <li>Basic computer troubleshooting</li>
                    <li>Internet and research skills</li>
                    <li>Data entry and management</li>
                </ul>
            `
        };

        return skills[post] || skills.default;
    }

    static async improveWithAI() {
        const loading = document.getElementById('loading');
        loading.classList.remove('hidden');

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simulate AI improvement
            const jobDescription = document.getElementById('jobDescription');
            const computerExp = document.getElementById('computerExp');
            
            if (jobDescription.innerHTML.trim()) {
                jobDescription.innerHTML = jobDescription.innerHTML.replace(/<li>/g, '<li>✅ ');
            }
            
            if (computerExp.innerHTML.trim()) {
                computerExp.innerHTML = computerExp.innerHTML.replace(/<li>/g, '<li>💻 ');
            }
            
            loading.classList.add('hidden');
            this.showNotification('AI improvements applied successfully!', 'success');
            
        } catch (error) {
            loading.classList.add('hidden');
            this.showNotification('AI improvement failed. Please try again.', 'error');
        }
    }

    static showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-robot"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Template Manager
class TemplateManager {
    static saveTemplate() {
        const adContent = document.getElementById('adPreview').innerHTML;
        if (adContent.includes('preview-placeholder')) {
            this.showNotification('Please generate an ad first before saving as template', 'warning');
            return;
        }

        const templates = JSON.parse(localStorage.getItem('jobAdTemplates') || '[]');
        const templateName = prompt('Enter a name for this template:');
        
        if (templateName) {
            templates.push({
                name: templateName,
                content: adContent,
                timestamp: new Date().toISOString()
            });
            
            localStorage.setItem('jobAdTemplates', JSON.stringify(templates));
            this.showNotification('Template saved successfully!', 'success');
        }
    }

    static loadTemplate(name) {
        const templates = JSON.parse(localStorage.getItem('jobAdTemplates') || '[]');
        const template = templates.find(t => t.name === name);
        
        if (template) {
            document.getElementById('adPreview').innerHTML = template.content;
            this.showNotification(`Template "${name}" loaded successfully!`, 'success');
        } else {
            this.showNotification('Template not found', 'error');
        }
    }

    static showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// PDF Exporter - UPDATED with jsPDF + html2canvas
class PDFExporter {
    static async downloadPDF() {
        const adContent = document.getElementById('adPreview');
        
        if (adContent.innerHTML.includes('preview-placeholder')) {
            this.showNotification('Please generate an ad first before downloading', 'warning');
            return;
        }

        const loading = document.getElementById('loading');
        loading.classList.remove('hidden');

        try {
            // Use html2canvas to capture the ad as an image
            const canvas = await html2canvas(adContent, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                scrollX: 0,
                scrollY: 0
            });

            // Convert canvas to image data
            const imgData = canvas.toDataURL('image/png');
            
            // Create PDF with jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Calculate dimensions to fit the image on A4
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;
            
            // Add image to PDF
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            
            // Get form data for filename
            const orgName = document.getElementById('orgName').value || 'Organization';
            const post = document.getElementById('post').value || 'Position';
            const fileName = `Job_Ad_${orgName.replace(/\s+/g, '_')}_${post.replace(/\s+/g, '_')}.pdf`;
            
            // Save the PDF
            pdf.save(fileName);
            
            loading.classList.add('hidden');
            this.showNotification('PDF downloaded successfully!', 'success');
            
        } catch (error) {
            loading.classList.add('hidden');
            console.error('PDF Export Error:', error);
            this.showNotification('PDF generation failed. Please try again.', 'error');
            this.fallbackExport();
        }
    }

    static fallbackExport() {
        // Simple text fallback
        const orgName = document.getElementById('orgName').value || 'Organization';
        const post = document.getElementById('post').value || 'Position';
        const content = `
Job Advertisement
=================

Organization: ${orgName}
Position: ${post}
Date: ${new Date().toLocaleDateString()}

Note: Please generate the ad and use browser's "Print to PDF" for best results.

Generated by MagicRills Job Ad Maker
        `;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.download = `Job_Ad_${orgName.replace(/\s+/g, '_')}_${post.replace(/\s+/g, '_')}.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
        
        this.showNotification('Text file downloaded as fallback', 'info');
    }

    static showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Word Exporter - UPDATED with better HTML export
class WordExporter {
    static downloadDOC() {
        const adContent = document.getElementById('adPreview');
        
        if (adContent.innerHTML.includes('preview-placeholder')) {
            this.showNotification('Please generate an ad first before downloading', 'warning');
            return;
        }

        try {
            // Get form data
            const orgName = document.getElementById('orgName').value || 'Organization';
            const post = document.getElementById('post').value || 'Position';
            
            // Create clean HTML for Word
            const cleanContent = adContent.innerHTML
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                .replace(/on\w+="[^"]*"/g, '');
            
            const wordHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Job Advertisement - ${orgName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 2rem;
            line-height: 1.6;
            color: #333;
        }
        .job-ad {
            border: 2px solid #3498db;
            border-radius: 10px;
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
        }
        .ad-header {
            text-align: center;
            border-bottom: 2px solid #3498db;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
        }
        .ad-details {
            margin: 1.5rem 0;
        }
        .detail-item {
            margin: 1rem 0;
            padding: 0.8rem;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #3498db;
        }
        .ad-footer {
            background: #e8f4f8;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
            margin-top: 2rem;
        }
        ul {
            margin: 0.5rem 0;
            padding-left: 2rem;
        }
        li {
            margin: 0.3rem 0;
        }
    </style>
</head>
<body>
    ${cleanContent}
    <div style="text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #ccc;">
        <p><small>Generated with MagicRills Job Ad Maker - ${new Date().toLocaleDateString()}</small></p>
    </div>
</body>
</html>`;

            const blob = new Blob([wordHTML], { type: 'application/msword' });
            const link = document.createElement('a');
            const fileName = `Job_Ad_${orgName.replace(/\s+/g, '_')}_${post.replace(/\s+/g, '_')}.doc`;
            
            link.download = fileName;
            link.href = URL.createObjectURL(blob);
            link.click();
            
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
            this.showNotification('Word document downloaded successfully!', 'success');
            
        } catch (error) {
            console.error('Word Export Error:', error);
            this.showNotification('Word export failed. Please try again.', 'error');
        }
    }

    static showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.designManager = new DesignManager();
    window.imageHandler = new ImageHandler();
    window.jobAdGenerator = new JobAdGenerator();

    // Global functions for HTML onclick attributes
    window.generateAd = () => window.jobAdGenerator.generateAd();
    window.formatText = (command) => document.execCommand(command, false, null);
    window.generateWithAI = () => AIIntegration.generateWithAI();
    window.improveWithAI = () => AIIntegration.improveWithAI();
    window.shareAd = () => {
        const adContent = document.getElementById('adPreview').innerHTML;
        if (adContent.includes('preview-placeholder')) {
            window.jobAdGenerator.showNotification('Please generate an ad first before sharing', 'warning');
            return;
        }
        
        if (navigator.share) {
            navigator.share({
                title: 'Job Advertisement',
                text: 'Check out this job ad created with MagicRills Job Ad Maker',
                url: window.location.href
            }).catch(() => {
                window.jobAdGenerator.showNotification('Share feature is available on supported browsers', 'info');
            });
        } else {
            window.jobAdGenerator.showNotification('Web Share API not supported in your browser', 'info');
        }
    };
    
    window.saveTemplate = () => TemplateManager.saveTemplate();
    window.resetForm = () => {
        document.getElementById('orgName').value = '';
        document.getElementById('post').selectedIndex = 0;
        document.getElementById('qualification').selectedIndex = 0;
        document.getElementById('experience').selectedIndex = 0;
        document.getElementById('salary').value = '';
        document.getElementById('location').value = '';
        document.getElementById('jobDescription').innerHTML = '';
        document.getElementById('computerExp').innerHTML = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactPhone').value = '';
        document.getElementById('contactPerson').value = '';
        
        window.imageHandler.currentLogo = null;
        window.imageHandler.additionalImages = [];
        document.getElementById('logoPreview').innerHTML = '';
        document.getElementById('additionalPreview').innerHTML = '';
        
        document.getElementById('adPreview').innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-ad"></i>
                <p>Your job ad will appear here</p>
                <small>Fill the form and click "Generate Ad"</small>
            </div>
        `;
        
        window.jobAdGenerator.showNotification('Form reset successfully!', 'success');
    };
    
    window.removeLogo = () => {
        window.imageHandler.currentLogo = null;
        document.getElementById('logoPreview').innerHTML = '';
        document.getElementById('uploadArea').innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Click or drag & drop to upload logo</p>
            <p class="upload-hint">PNG, JPG, SVG (Max 2MB)</p>
        `;
        window.imageHandler.setupLogoUpload();
        window.jobAdGenerator.showNotification('Logo removed successfully!', 'success');
    };
    
    window.removeAdditionalImage = (index) => {
        window.imageHandler.additionalImages.splice(index, 1);
        window.imageHandler.updateAdditionalPreview();
        window.jobAdGenerator.showNotification('Image removed successfully!', 'success');
    };
    
    window.uploadCustomClipart = () => {
        document.getElementById('clipartInput').click();
    };
    
    window.zoomPreview = (delta) => {
        const preview = document.getElementById('adPreview');
        const currentScale = parseFloat(preview.style.transform.replace('scale(', '').replace(')', '')) || 1;
        const newScale = Math.max(0.5, Math.min(2, currentScale + delta));
        preview.style.transform = `scale(${newScale})`;
    };
    
    window.resetZoom = () => {
        document.getElementById('adPreview').style.transform = 'scale(1)';
    };
    
    window.openTemplateModal = () => {
        document.getElementById('templateModal').classList.remove('hidden');
    };
    
    window.closeModal = () => {
        document.getElementById('templateModal').classList.add('hidden');
    };

    // Export functions
    window.downloadPDF = () => PDFExporter.downloadPDF();
    window.downloadDOC = () => WordExporter.downloadDOC();
});

// Add CSS for notifications and other dynamic styles
const dynamicStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    color: white;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    max-width: 400px;
}

.notification.success {
    background: #27ae60;
}

.notification.error {
    background: #e74c3c;
}

.notification.info {
    background: #3498db;
}

.notification.warning {
    background: #f39c12;
}

.notification.fade-out {
    animation: slideOut 0.3s ease forwards;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.job-ad {
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.ad-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    border-bottom: 2px solid rgba(0,0,0,0.1);
    padding-bottom: 1rem;
}

.ad-logo {
    max-width: 80px;
    max-height: 80px;
}

.post-icon {
    font-size: 3rem;
}

.ad-details {
    margin: 2rem 0;
}

.detail-item {
    margin: 1rem 0;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
}

.detail-item i {
    color: var(--primary-color);
    margin-top: 0.2rem;
}

.computer-skills {
    margin-top: 0.5rem;
    padding-left: 1.5rem;
}

.ad-footer {
    background: rgba(255,255,255,0.5);
    padding: 1rem;
    border-radius: 10px;
    text-align: center;
    margin-top: 2rem;
}

.remove-btn {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.remove-btn:hover {
    background: #c0392b;
    transform: scale(1.1);
}

/* Layout specific styles */
.layout-modern .job-ad {
    background: linear-gradient(135deg, #667eea, #764ba2) !important;
    color: white !important;
}

.layout-professional .job-ad {
    background: linear-gradient(135deg, #4facfe, #00f2fe) !important;
    color: #333 !important;
}

.layout-creative .job-ad {
    background: linear-gradient(135deg, #43e97b, #38f9d7) !important;
    color: #333 !important;
}

.layout-minimal .job-ad {
    background: white !important;
    color: #333 !important;
    border: 2px solid #3498db !important;
}

.layout-elegant .job-ad {
    background: linear-gradient(135deg, #fa709a, #fee140) !important;
    color: #333 !important;
}

.layout-corporate .job-ad {
    background: linear-gradient(135deg, #30cfd0, #330867) !important;
    color: white !important;
}

/* PDF specific styles */
@media print {
    .job-ad {
        margin: 0;
        padding: 1rem;
        box-shadow: none;
        border: 1px solid #ccc;
    }
    
    .no-print {
        display: none !important;
    }
}
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);