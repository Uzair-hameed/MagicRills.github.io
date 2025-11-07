// Auto ID Card Generator Tool - Main JavaScript File

class AutoIDCardGenerator {
    constructor() {
        this.currentTheme = 'light';
        this.currentTemplate = 'corporate';
        this.currentOrientation = 'horizontal';
        this.uploadedImages = {
            photo: null,
            logo: null,
            signature: null
        };
        this.cardData = {
            name: 'John Smith',
            idNumber: 'EMP-12345',
            position: 'Software Developer',
            department: 'Information Technology',
            organization: 'Tech Innovations Inc.',
            email: 'john@company.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main Street, City, State 12345',
            validUntil: '2025-12-31'
        };
        this.rules = [
            'This ID card is property of the organization and must be returned upon termination.',
            'Must be worn visibly at all times within organization premises.',
            'Report lost or stolen cards immediately to security department.'
        ];
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeDefaults();
        this.hideLoadingScreen();
        this.showToast('Auto ID Card Generator Ready!', 'success');
    }

    bindEvents() {
        // Theme Toggle
        document.getElementById('theme-btn').addEventListener('click', () => this.toggleTheme());

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e));
        });

        // Template Selection
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectTemplate(e));
        });

        // Form Inputs
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', (e) => this.handleInputChange(e));
        });

        // Media Uploads
        this.setupMediaUploads();

        // Customization Options
        this.setupCustomization();

        // Export Functions
        this.setupExportFunctions();

        // AI Features
        this.setupAIFeatures();

        // Batch Generation
        this.setupBatchGeneration();

        // Preview Actions
        this.setupPreviewActions();
    }

    initializeDefaults() {
        // Set default date
        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() + 2);
        document.getElementById('valid-until').valueAsDate = defaultDate;

        // Initialize card data
        this.updateCardPreview();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
            }, 500);
        }, 1500);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.toggle('dark-theme');
        
        const themeBtn = document.getElementById('theme-btn');
        const icon = themeBtn.querySelector('i');
        icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        
        this.showToast(`${this.currentTheme === 'light' ? 'Light' : 'Dark'} theme activated`, 'success');
    }

    switchSection(event) {
        const targetSection = event.currentTarget.getAttribute('data-section');
        
        // Update active nav button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // Show target section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(targetSection).classList.add('active');
    }

    selectTemplate(event) {
        const template = event.currentTarget.getAttribute('data-template');
        this.currentTemplate = template;
        
        // Update active template
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // Apply template styles
        this.applyTemplateStyles(template);
        this.showToast(`${template.charAt(0).toUpperCase() + template.slice(1)} template selected`, 'success');
    }

    applyTemplateStyles(template) {
        const cardFront = document.getElementById('id-card-front');
        const cardBack = document.getElementById('id-card-back');
        
        // Remove existing template classes
        cardFront.className = 'id-card front active';
        cardBack.className = 'id-card back';
        
        // Add template-specific classes
        cardFront.classList.add(`template-${template}`);
        cardBack.classList.add(`template-${template}`);
        
        // Update preview stats
        document.getElementById('current-template').textContent = 
            template.charAt(0).toUpperCase() + template.slice(1);
    }

    handleInputChange(event) {
        const field = event.target.id;
        const value = event.target.value;
        
        // Update card data
        this.cardData[field] = value;
        
        // Update preview
        this.updateCardPreview();
    }

    setupMediaUploads() {
        // Photo Upload
        const photoUpload = document.getElementById('photo-upload');
        const photoUploadArea = document.getElementById('photo-upload-area');
        
        photoUploadArea.addEventListener('click', () => photoUpload.click());
        photoUpload.addEventListener('change', (e) => this.handleImageUpload(e, 'photo'));

        // Logo Upload
        const logoUpload = document.getElementById('logo-upload');
        const logoUploadArea = document.getElementById('logo-upload-area');
        
        logoUploadArea.addEventListener('click', () => logoUpload.click());
        logoUpload.addEventListener('change', (e) => this.handleImageUpload(e, 'logo'));

        // Signature Upload
        const signatureUpload = document.getElementById('signature-upload');
        const signatureUploadArea = document.getElementById('signature-upload-area');
        
        signatureUploadArea.addEventListener('click', () => signatureUpload.click());
        signatureUpload.addEventListener('change', (e) => this.handleImageUpload(e, 'signature'));

        // AI Photo Enhance
        document.getElementById('ai-photo-enhance').addEventListener('click', () => {
            this.showAIModal('photo');
        });

        // Remove Photo
        document.getElementById('remove-photo').addEventListener('click', () => {
            this.uploadedImages.photo = null;
            this.updateCardPreview();
            this.showToast('Photo removed', 'success');
        });

        // Draw Signature
        document.getElementById('draw-signature').addEventListener('click', () => {
            this.showSignatureModal();
        });
    }

    handleImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showToast('Please upload an image file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.uploadedImages[type] = e.target.result;
            this.updateCardPreview();
            this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`, 'success');
        };
        reader.readAsDataURL(file);
    }

    setupCustomization() {
        // Orientation
        document.querySelectorAll('[data-orientation]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentOrientation = e.currentTarget.getAttribute('data-orientation');
                
                document.querySelectorAll('[data-orientation]').forEach(b => {
                    b.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
                
                this.updateCardOrientation();
            });
        });

        // Font Options
        document.querySelectorAll('.font-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const font = e.currentTarget.getAttribute('data-font');
                
                document.querySelectorAll('.font-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
                
                this.applyFontStyle(font);
            });
        });

        // Color Options
        document.querySelectorAll('.color-option:not(.custom-color)').forEach(option => {
            option.addEventListener('click', (e) => {
                const color = e.currentTarget.getAttribute('data-color');
                const isBgColor = e.currentTarget.classList.contains('bg-option');
                
                document.querySelectorAll('.color-option').forEach(opt => {
                    if (opt.classList.contains('bg-option') === isBgColor) {
                        opt.classList.remove('active');
                    }
                });
                e.currentTarget.classList.add('active');
                
                if (isBgColor) {
                    this.applyBackgroundColor(color);
                } else {
                    this.applyPrimaryColor(color);
                }
            });
        });

        // Custom Color Pickers
        document.getElementById('custom-primary').addEventListener('change', (e) => {
            this.applyPrimaryColor(e.target.value);
        });

        document.getElementById('custom-bg').addEventListener('change', (e) => {
            this.applyBackgroundColor(e.target.value);
        });

        // Gradient Options
        document.querySelectorAll('.gradient-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const gradient = e.currentTarget.getAttribute('data-gradient');
                
                document.querySelectorAll('.gradient-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
                
                this.applyGradient(gradient);
            });
        });

        // Security Features
        document.querySelectorAll('.checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleSecurityFeature(e.target.id, e.target.checked);
            });
        });
    }

    updateCardOrientation() {
        const cardWrapper = document.getElementById('card-wrapper');
        const orientationText = this.currentOrientation.charAt(0).toUpperCase() + this.currentOrientation.slice(1);
        
        if (this.currentOrientation === 'vertical') {
            cardWrapper.style.height = '500px';
        } else {
            cardWrapper.style.height = '400px';
        }
        
        document.getElementById('current-orientation').textContent = orientationText;
        this.showToast(`Orientation changed to ${orientationText.toLowerCase()}`, 'success');
    }

    applyFontStyle(font) {
        const cardFront = document.getElementById('id-card-front');
        const cardBack = document.getElementById('id-card-back');
        
        let fontFamily = 'Segoe UI, sans-serif';
        switch(font) {
            case 'serif': fontFamily = 'Times New Roman, serif'; break;
            case 'monospace': fontFamily = 'Courier New, monospace'; break;
            case 'cursive': fontFamily = 'Brush Script MT, cursive'; break;
        }
        
        cardFront.style.fontFamily = fontFamily;
        cardBack.style.fontFamily = fontFamily;
    }

    applyPrimaryColor(color) {
        document.documentElement.style.setProperty('--primary-color', color);
        
        // Calculate darker shade for secondary color
        const darkerColor = this.shadeColor(color, -20);
        document.documentElement.style.setProperty('--secondary-color', darkerColor);
        
        // Update header gradient
        document.documentElement.style.setProperty('--header-bg', 
            `linear-gradient(135deg, ${color}, ${darkerColor})`);
    }

    applyBackgroundColor(color) {
        document.documentElement.style.setProperty('--card-bg', color);
    }

    applyGradient(gradient) {
        const cardFront = document.getElementById('id-card-front');
        const cardBack = document.getElementById('id-card-back');
        
        let gradientStyle = '';
        switch(gradient) {
            case 'linear-135':
                gradientStyle = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
                break;
            case 'linear-45':
                gradientStyle = 'linear-gradient(45deg, #e74c3c, #c0392b)';
                break;
            case 'linear-90':
                gradientStyle = 'linear-gradient(90deg, #2ecc71, #27ae60)';
                break;
            case 'radial':
                gradientStyle = 'radial-gradient(circle, #9b59b6, #8e44ad)';
                break;
        }
        
        cardFront.querySelector('.card-header').style.background = gradientStyle;
        cardBack.querySelector('.card-header').style.background = gradientStyle;
    }

    toggleSecurityFeature(feature, enabled) {
        const previewElement = document.getElementById(`${feature}-preview`);
        if (previewElement) {
            previewElement.style.display = enabled ? 'block' : 'none';
        }
    }

    setupExportFunctions() {
        // PDF Export
        document.getElementById('export-pdf').addEventListener('click', () => {
            this.exportAsPDF();
        });

        // PNG Export
        document.getElementById('export-png').addEventListener('click', () => {
            this.exportAsPNG();
        });

        // JPG Export
        document.getElementById('export-jpg').addEventListener('click', () => {
            this.exportAsJPG();
        });

        // Print
        document.getElementById('export-print').addEventListener('click', () => {
            this.printCards();
        });

        // Canva Integration
        document.getElementById('export-canva').addEventListener('click', () => {
            this.exportToCanva();
        });

        // Batch Export
        document.getElementById('export-batch').addEventListener('click', () => {
            this.batchExport();
        });
    }

    async exportAsPDF() {
        this.showToast('Generating PDF...', 'success');
        
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Capture card as image
            const cardElement = document.getElementById('id-card-front');
            const canvas = await html2canvas(cardElement, {
                scale: 3,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 85; // mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add card to PDF
            pdf.addImage(imgData, 'PNG', (210 - imgWidth) / 2, 20, imgWidth, imgHeight);
            
            // Add back side if needed
            if (document.querySelector('.card-wrapper').classList.contains('flipped')) {
                pdf.addPage();
                const backCanvas = await html2canvas(document.getElementById('id-card-back'), {
                    scale: 3,
                    backgroundColor: '#ffffff'
                });
                const backImgData = backCanvas.toDataURL('image/png');
                pdf.addImage(backImgData, 'PNG', (210 - imgWidth) / 2, 20, imgWidth, imgHeight);
            }

            pdf.save('id-card.pdf');
            this.showToast('PDF downloaded successfully!', 'success');
        } catch (error) {
            console.error('PDF export error:', error);
            this.showToast('Error generating PDF', 'error');
        }
    }

    async exportAsPNG() {
        this.showToast('Generating PNG...', 'success');
        
        try {
            const cardElement = document.getElementById('id-card-front');
            const canvas = await html2canvas(cardElement, {
                scale: 3,
                backgroundColor: '#ffffff'
            });

            const link = document.createElement('a');
            link.download = 'id-card.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            this.showToast('PNG downloaded successfully!', 'success');
        } catch (error) {
            console.error('PNG export error:', error);
            this.showToast('Error generating PNG', 'error');
        }
    }

    async exportAsJPG() {
        this.showToast('Generating JPG...', 'success');
        
        try {
            const cardElement = document.getElementById('id-card-front');
            const canvas = await html2canvas(cardElement, {
                scale: 3,
                backgroundColor: '#ffffff'
            });

            const link = document.createElement('a');
            link.download = 'id-card.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
            
            this.showToast('JPG downloaded successfully!', 'success');
        } catch (error) {
            console.error('JPG export error:', error);
            this.showToast('Error generating JPG', 'error');
        }
    }

    printCards() {
        this.showToast('Preparing for print...', 'success');
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    exportToCanva() {
        // This would integrate with Canva API in a real implementation
        this.showToast('Opening in Canva...', 'success');
        // In a real implementation, this would use Canva's Design API
        // For demo purposes, we'll open Canva website
        window.open('https://www.canva.com/', '_blank');
    }

    batchExport() {
        this.showToast('Batch export feature coming soon!', 'warning');
        // Implementation for batch exporting multiple cards
    }

    setupAIFeatures() {
        // AI Enhance Button
        document.getElementById('ai-enhance').addEventListener('click', () => {
            this.showAIModal('design');
        });

        // AI Suggest Rules
        document.getElementById('ai-suggest-rules').addEventListener('click', () => {
            this.suggestRulesWithAI();
        });

        // AI Modal Controls
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            });
        });

        document.getElementById('cancel-ai').addEventListener('click', () => {
            document.getElementById('ai-modal').classList.remove('active');
        });

        document.getElementById('apply-ai').addEventListener('click', () => {
            this.applyAIEnhancement();
        });
    }

    showAIModal(type) {
        const modal = document.getElementById('ai-modal');
        modal.classList.add('active');
        
        // Select appropriate AI option based on type
        const optionId = `ai-${type}`;
        document.getElementById(optionId).checked = true;
        
        // Show preview of current vs AI enhanced
        this.generateAIPreview();
    }

    generateAIPreview() {
        // In a real implementation, this would use AI to generate enhanced preview
        // For demo, we'll simulate AI enhancement
        const beforeElement = document.getElementById('ai-before');
        const afterElement = document.getElementById('ai-after');
        
        beforeElement.innerHTML = '<span>Current Design</span>';
        afterElement.innerHTML = '<span>AI Enhanced</span>';
        
        // Simulate AI processing
        setTimeout(() => {
            afterElement.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            afterElement.innerHTML = '<span>Enhanced by AI</span>';
        }, 1000);
    }

    applyAIEnhancement() {
        const selectedOption = document.querySelector('input[name="ai-option"]:checked').id;
        
        switch(selectedOption) {
            case 'ai-design':
                this.enhanceDesignWithAI();
                break;
            case 'ai-content':
                this.enhanceContentWithAI();
                break;
            case 'ai-photo':
                this.enhancePhotoWithAI();
                break;
        }
        
        document.getElementById('ai-modal').classList.remove('active');
        this.showToast('AI enhancement applied successfully!', 'success');
    }

    enhanceDesignWithAI() {
        // Simulate AI design enhancement
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        this.applyPrimaryColor(randomColor);
        
        // Random template
        const templates = ['corporate', 'modern', 'creative', 'minimal', 'security'];
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        this.selectTemplate({ currentTarget: document.querySelector(`[data-template="${randomTemplate}"]`) });
    }

    enhanceContentWithAI() {
        // Simulate AI content optimization
        this.cardData.position = "Senior " + this.cardData.position;
        document.getElementById('position').value = this.cardData.position;
        this.updateCardPreview();
    }

    enhancePhotoWithAI() {
        // Simulate AI photo enhancement
        this.showToast('Photo enhanced with AI', 'success');
    }

    suggestRulesWithAI() {
        // Simulate AI rule suggestions
        const aiSuggestedRules = [
            'Do not alter or deface this ID card in any way.',
            'This card must be presented upon request by security personnel.',
            'Unauthorized duplication is strictly prohibited.',
            'Card must be renewed annually before expiration date.'
        ];
        
        // Add AI suggested rules
        aiSuggestedRules.forEach(rule => {
            this.addRule(rule);
        });
        
        this.showToast('AI suggested rules added!', 'success');
    }

    addRule(text = '') {
        const rulesList = document.getElementById('rules-list');
        const ruleItem = document.createElement('div');
        ruleItem.className = 'rule-item';
        ruleItem.innerHTML = `
            <textarea placeholder="Enter rule text...">${text}</textarea>
            <button class="btn-remove-rule">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        rulesList.appendChild(ruleItem);
        
        // Add event listener to remove button
        ruleItem.querySelector('.btn-remove-rule').addEventListener('click', () => {
            ruleItem.remove();
            this.updateRulesPreview();
        });
        
        // Add input listener
        ruleItem.querySelector('textarea').addEventListener('input', () => {
            this.updateRulesPreview();
        });
        
        this.updateRulesPreview();
    }

    updateRulesPreview() {
        const rulesPreview = document.getElementById('rules-preview');
        rulesPreview.innerHTML = '';
        
        document.querySelectorAll('.rule-item textarea').forEach(textarea => {
            if (textarea.value.trim()) {
                const ruleElement = document.createElement('div');
                ruleElement.className = 'rule-preview';
                ruleElement.innerHTML = `
                    <i class="fas fa-circle"></i>
                    <span>${textarea.value}</span>
                `;
                rulesPreview.appendChild(ruleElement);
            }
        });
    }

    setupBatchGeneration() {
        // CSV Upload
        document.getElementById('upload-csv-btn').addEventListener('click', () => {
            document.getElementById('batch-csv-upload').click();
        });

        document.getElementById('batch-csv-upload').addEventListener('change', (e) => {
            this.handleCSVUpload(e);
        });

        // Batch Actions
        document.getElementById('generate-batch').addEventListener('click', () => {
            this.generateBatchCards();
        });

        document.getElementById('download-batch').addEventListener('click', () => {
            this.downloadBatchCards();
        });
    }

    handleCSVUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target.result;
            this.parseCSVData(csvData);
        };
        reader.readAsText(file);
    }

    parseCSVData(csvData) {
        // Simple CSV parsing (in real implementation, use a proper CSV parser)
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const previewTable = document.getElementById('preview-table');
        previewTable.innerHTML = '<table></table>';
        const table = previewTable.querySelector('table');
        
        // Create header row
        let headerRow = '<tr>';
        headers.forEach(header => {
            headerRow += `<th>${header}</th>`;
        });
        headerRow += '</tr>';
        table.innerHTML = headerRow;
        
        // Add data rows (first 5 rows for preview)
        for (let i = 1; i < Math.min(6, lines.length); i++) {
            if (lines[i].trim()) {
                const cells = lines[i].split(',').map(c => c.trim());
                let row = '<tr>';
                cells.forEach(cell => {
                    row += `<td>${cell}</td>`;
                });
                row += '</tr>';
                table.innerHTML += row;
            }
        }
        
        this.showToast('CSV data loaded successfully', 'success');
    }

    generateBatchCards() {
        this.showToast('Batch card generation started...', 'success');
        // Implementation for generating multiple cards from CSV data
    }

    downloadBatchCards() {
        this.showToast('Preparing batch download...', 'success');
        // Implementation for downloading multiple cards as ZIP
    }

    setupPreviewActions() {
        // Flip Card
        document.getElementById('flip-card').addEventListener('click', () => {
            document.getElementById('card-wrapper').classList.toggle('flipped');
        });

        // Zoom In/Out
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.adzoomPreview(1.1);
        });

        document.getElementById('zoom-out').addEventListener('click', () => {
            this.adzoomPreview(0.9);
        });
    }

    adzoomPreview(factor) {
        const previewContainer = document.querySelector('.preview-container');
        const currentScale = parseFloat(previewContainer.style.transform?.replace('scale(', '') || 1);
        const newScale = Math.max(0.5, Math.min(2, currentScale * factor));
        
        previewContainer.style.transform = `scale(${newScale})`;
    }

    updateCardPreview() {
        // Update front side
        document.getElementById('name-preview').textContent = this.cardData.name || 'Full Name';
        document.getElementById('id-number-preview').textContent = this.cardData.idNumber || 'ID Number';
        document.getElementById('position-preview').textContent = this.cardData.position || 'Position';
        document.getElementById('department-preview').textContent = this.cardData.department || 'Department';
        document.getElementById('org-name-preview').textContent = this.cardData.organization || 'Organization';
        
        // Update contact info on back side
        document.getElementById('contact-email-preview').textContent = this.cardData.email || 'email@company.com';
        document.getElementById('contact-phone-preview').textContent = this.cardData.phone || '+1 (555) 123-4567';
        document.getElementById('contact-address-preview').textContent = this.cardData.address || 'Address';
        
        // Update valid until date
        if (this.cardData.validUntil) {
            const date = new Date(this.cardData.validUntil);
            document.getElementById('valid-until-preview').textContent = 
                `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
        }
        
        // Update images
        this.updateCardImages();
        
        // Update rules
        this.updateRulesPreview();
    }

    updateCardImages() {
        // Update photo
        const photoPreview = document.getElementById('photo-preview');
        if (this.uploadedImages.photo) {
            photoPreview.innerHTML = `<img src="${this.uploadedImages.photo}" alt="Profile Photo">`;
        } else {
            photoPreview.innerHTML = '<i class="fas fa-user"></i>';
        }
        
        // Update logo
        const logoPreview = document.getElementById('org-logo-preview');
        if (this.uploadedImages.logo) {
            logoPreview.innerHTML = `<img src="${this.uploadedImages.logo}" alt="Organization Logo">`;
        } else {
            logoPreview.innerHTML = '<i class="fas fa-building"></i>';
        }
        
        // Update signature
        const signaturePreview = document.getElementById('signature-preview');
        if (this.uploadedImages.signature) {
            signaturePreview.innerHTML = `<img src="${this.uploadedImages.signature}" alt="Signature" style="max-height: 40px;">`;
        } else {
            signaturePreview.innerHTML = `
                <div class="signature-line"></div>
                <span>Authorized Signature</span>
            `;
        }
    }

    showSignatureModal() {
        const modal = document.getElementById('signature-modal');
        modal.classList.add('active');
        
        this.setupSignatureCanvas();
    }

    setupSignatureCanvas() {
        const canvas = document.getElementById('signature-canvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let paths = [];
        let currentPath = [];

        // Set canvas background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Drawing functions
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch events for mobile
        canvas.addEventListener('touchstart', handleTouch);
        canvas.addEventListener('touchmove', handleTouch);
        canvas.addEventListener('touchend', stopDrawing);

        function handleTouch(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }

        function startDrawing(e) {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
            currentPath = [];
            currentPath.push({x: lastX, y: lastY});
        }

        function draw(e) {
            if (!isDrawing) return;
            
            const color = document.getElementById('signature-color').value;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            
            [lastX, lastY] = [e.offsetX, e.offsetY];
            currentPath.push({x: e.offsetX, y: e.offsetY});
        }

        function stopDrawing() {
            if (isDrawing) {
                paths.push([...currentPath]);
                currentPath = [];
            }
            isDrawing = false;
        }

        // Clear signature
        document.getElementById('clear-signature').addEventListener('click', () => {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            paths = [];
        });

        // Undo last stroke
        document.getElementById('undo-signature').addEventListener('click', () => {
            if (paths.length > 0) {
                paths.pop();
                redrawSignature();
            }
        });

        function redrawSignature() {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            paths.forEach(path => {
                if (path.length > 0) {
                    ctx.beginPath();
                    ctx.moveTo(path[0].x, path[0].y);
                    
                    for (let i = 1; i < path.length; i++) {
                        ctx.lineTo(path[i].x, path[i].y);
                    }
                    
                    ctx.stroke();
                }
            });
        }

        // Save signature
        document.getElementById('save-signature').addEventListener('click', () => {
            this.uploadedImages.signature = canvas.toDataURL('image/png');
            this.updateCardPreview();
            modal.classList.remove('active');
            this.showToast('Signature saved successfully!', 'success');
        });

        // Cancel signature
        document.getElementById('cancel-signature').addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'fas fa-check-circle';
        if (type === 'error') icon = 'fas fa-exclamation-circle';
        if (type === 'warning') icon = 'fas fa-exclamation-triangle';
        
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'toastSlideIn 0.3s ease reverse';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Utility function to shade colors
    shadeColor(color, percent) {
        let R = parseInt(color.substring(1,3),16);
        let G = parseInt(color.substring(3,5),16);
        let B = parseInt(color.substring(5,7),16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;
        G = (G<255)?G:255;
        B = (B<255)?B:255;

        const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

        return "#"+RR+GG+BB;
    }
}

// Add Canva icon if not available
const style = document.createElement('style');
style.textContent = `
    .fab.fa-canva:before {
        content: "C";
        font-weight: bold;
        font-family: Arial, sans-serif;
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.idCardGenerator = new AutoIDCardGenerator();
});