// Enhanced School Circular Generator - Professional Edition
class CircularGenerator {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.loadInitialData();
        this.initParticles();
        this.initAOS();
    }

    init() {
        // Enhanced state management
        this.state = {
            circularsGenerated: 0,
            downloads: 0,
            timeSaved: 0,
            currentTheme: localStorage.getItem('themePreference') || 'light',
            autoSave: true,
            aiEnabled: true,
            currentTemplate: null,
            lastSave: null,
            aiThinking: false
        };

        // Enhanced DOM Elements
        this.elements = {
            // Stats
            circularCount: document.getElementById('circularCount'),
            downloadCount: document.getElementById('downloadCount'),
            timeSaved: document.getElementById('timeSaved'),
            
            // Theme
            themeToggle: document.getElementById('themeToggle'),
            
            // Form inputs
            schoolName: document.getElementById('schoolName'),
            schoolContact: document.getElementById('schoolContact'),
            circularTitle: document.getElementById('circularTitle'),
            circularNumber: document.getElementById('circularNumber'),
            
            // Media
            logoUpload: document.getElementById('logoUpload'),
            signatureUpload: document.getElementById('signatureUpload'),
            logoPreview: document.getElementById('logoPreview'),
            signaturePreview: document.getElementById('signaturePreview'),
            qrPreview: document.getElementById('qrPreview'),
            
            // Editor
            editor: document.getElementById('editor'),
            wordCount: document.getElementById('wordCount'),
            charCount: document.getElementById('charCount'),
            readabilityScore: document.getElementById('readabilityScore'),
            
            // Preview
            previewContainer: document.getElementById('previewContainer'),
            circularPaper: document.getElementById('circularPaper'),
            previewSchoolName: document.getElementById('previewSchoolName'),
            previewSchoolContact: document.getElementById('previewSchoolContact'),
            previewTitle: document.getElementById('previewTitle'),
            previewNumber: document.getElementById('previewNumber'),
            previewDate: document.getElementById('previewDate'),
            previewBody: document.getElementById('previewBody'),
            previewSignatory: document.getElementById('previewSignatory'),
            previewLogo: document.getElementById('previewLogo'),
            previewSignature: document.getElementById('previewSignature'),
            previewQR: document.getElementById('previewQR'),
            
            // Buttons
            generateBtn: document.getElementById('generateBtn'),
            previewBtn: document.getElementById('previewBtn'),
            saveTemplateBtn: document.getElementById('saveTemplateBtn'),
            resetBtn: document.getElementById('resetBtn'),
            fullscreenBtn: document.getElementById('fullscreenBtn'),
            printBtn: document.getElementById('printBtn'),
            saveDraftBtn: document.getElementById('saveDraftBtn'),
            loadDraftBtn: document.getElementById('loadDraftBtn'),
            exportPdf: document.getElementById('exportPdf'),
            exportWord: document.getElementById('exportWord'),
            exportImage: document.getElementById('exportImage'),
            shareBtn: document.getElementById('shareBtn'),
            directPrintBtn: document.getElementById('directPrintBtn'),
            cloudSaveBtn: document.getElementById('cloudSaveBtn'),
            aiGenerateBtn: document.getElementById('aiGenerateBtn'),
            
            // AI
            aiButtons: document.querySelectorAll('.ai-btn'),
            suggestionButtons: document.querySelectorAll('.suggestion-btn'),
            aiTyping: document.getElementById('aiTyping'),
            
            // Templates
            templateCards: document.querySelectorAll('.template-card'),
            
            // Loading
            loadingOverlay: document.getElementById('loadingOverlay'),
            
            // Toast
            toastContainer: document.getElementById('toastContainer'),
            
            // Modal
            aiModal: document.getElementById('aiModal'),
            aiModalBody: document.getElementById('aiModalBody'),
            aiModalClose: document.getElementById('aiModalClose'),
            aiModalCancel: document.getElementById('aiModalCancel'),
            aiModalApply: document.getElementById('aiModalApply')
        };

        // Enhanced media management
        this.media = {
            logo: '',
            signature: '',
            qrCode: ''
        };

        // Enhanced templates library with AI-powered content
        this.templates = {
            ptm: {
                name: "Parent Teacher Meeting",
                content: this.generateAIContent('ptm'),
                icon: 'users',
                color: 'primary'
            },
            holiday: {
                name: "Holiday Notice", 
                content: this.generateAIContent('holiday'),
                icon: 'umbrella-beach',
                color: 'warning'
            },
            exam: {
                name: "Exam Schedule",
                content: this.generateAIContent('exam'),
                icon: 'clipboard-list',
                color: 'info'
            },
            event: {
                name: "School Event",
                content: this.generateAIContent('event'),
                icon: 'calendar-star',
                color: 'secondary'
            },
            fee: {
                name: "Fee Reminder",
                content: this.generateAIContent('fee'),
                icon: 'money-bill-wave',
                color: 'success'
            },
            emergency: {
                name: "Emergency Notice",
                content: this.generateAIContent('emergency'),
                icon: 'exclamation-triangle',
                color: 'danger'
            },
            workshop: {
                name: "Workshop Announcement",
                content: this.generateAIContent('workshop'),
                icon: 'chalkboard-teacher',
                color: 'info'
            },
            result: {
                name: "Result Declaration",
                content: this.generateAIContent('result'),
                icon: 'award',
                color: 'success'
            }
        };

        // Initialize with default values
        this.setDefaultValues();
        this.applyTheme(this.state.currentTheme);
    }

    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 30, density: { enable: true, value_area: 800 } },
                    color: { value: '#4361ee' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.3, random: true },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#4361ee',
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: true,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    }
                }
            });
        }
    }

    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
    }

    setDefaultValues() {
        // Set current date and generate circular number
        const today = new Date();
        this.elements.circularNumber.value = this.generateCircularNumber();
        
        // Set initial stats from localStorage
        this.loadStats();
        
        // Update preview with default values
        this.updatePreview();
        
        // Initialize editor stats
        this.updateEditorStats();
    }

    setupEventListeners() {
        // Theme toggle with enhanced animation
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Form inputs with enhanced auto-save and real-time preview
        const formInputs = [
            this.elements.schoolName,
            this.elements.schoolContact,
            this.elements.circularTitle
        ];

        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updatePreview();
                if (this.state.autoSave) this.autoSave();
                this.animateInput(input);
            });

            input.addEventListener('focus', () => this.animateInputFocus(input));
            input.addEventListener('blur', () => this.animateInputBlur(input));
        });

        // Enhanced media uploads with drag & drop
        this.setupMediaUploads();

        // Enhanced editor with real-time statistics and AI features
        this.setupEditor();

        // Enhanced action buttons with ripple effects
        this.setupActionButtons();

        // Enhanced export buttons with progress tracking
        this.setupExportButtons();

        // Enhanced AI features
        this.setupAIFeatures();

        // Enhanced template system
        this.setupTemplates();

        // Auto-save interval with enhanced backup
        this.setupAutoSave();

        // Handle beforeunload for data protection
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        });

        // Responsive layout handling
        window.addEventListener('resize', () => this.handleResize());
    }

    setupMediaUploads() {
        // Logo upload with enhanced features
        this.elements.logoUpload.addEventListener('change', (e) => this.handleImageUpload(e, 'logo'));
        
        // Signature upload with enhanced features  
        this.elements.signatureUpload.addEventListener('change', (e) => this.handleImageUpload(e, 'signature'));

        // Drag and drop functionality
        const mediaCards = document.querySelectorAll('.media-upload-card');
        mediaCards.forEach(card => {
            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                card.classList.add('drag-over');
            });

            card.addEventListener('dragleave', () => {
                card.classList.remove('drag-over');
            });

            card.addEventListener('drop', (e) => {
                e.preventDefault();
                card.classList.remove('drag-over');
                this.handleFileDrop(e, card);
            });
        });
    }

    setupEditor() {
        // Enhanced editor with real-time statistics
        this.elements.editor.addEventListener('input', () => {
            this.updateEditorStats();
            this.updatePreview();
            if (this.state.autoSave) this.autoSave();
            this.analyzeReadability();
        });

        // Enhanced toolbar with more commands and tooltips
        document.querySelectorAll('.toolbar button').forEach(button => {
            button.addEventListener('click', () => {
                const command = button.getAttribute('data-command');
                const value = button.getAttribute('data-value');
                this.execCommand(command, value);
                this.animateButton(button);
            });
        });

        // Paste event handling for better formatting
        this.elements.editor.addEventListener('paste', (e) => this.handlePaste(e));
    }

    setupActionButtons() {
        // Enhanced action buttons with ripple effects
        const actionButtons = [
            this.elements.generateBtn,
            this.elements.previewBtn, 
            this.elements.saveTemplateBtn,
            this.elements.resetBtn,
            this.elements.fullscreenBtn,
            this.elements.printBtn,
            this.elements.saveDraftBtn,
            this.elements.loadDraftBtn,
            this.elements.aiGenerateBtn
        ];

        actionButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => this.createRipple(e));
                btn.addEventListener('click', () => this.animateButton(btn));
            }
        });

        // Specific button actions
        this.elements.generateBtn.addEventListener('click', () => this.generateCircular());
        this.elements.previewBtn.addEventListener('click', () => this.togglePreview());
        this.elements.saveTemplateBtn.addEventListener('click', () => this.saveTemplate());
        this.elements.resetBtn.addEventListener('click', () => this.resetForm());
        this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.elements.printBtn.addEventListener('click', () => this.printCircular());
        this.elements.saveDraftBtn.addEventListener('click', () => this.saveDraft());
        this.elements.loadDraftBtn.addEventListener('click', () => this.loadDraft());
        this.elements.aiGenerateBtn.addEventListener('click', () => this.aiGenerateContent());
    }

    setupExportButtons() {
        const exportButtons = [
            this.elements.exportPdf,
            this.elements.exportWord,
            this.elements.exportImage,
            this.elements.shareBtn,
            this.elements.directPrintBtn,
            this.elements.cloudSaveBtn
        ];

        exportButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => this.createRipple(e));
                btn.addEventListener('click', () => this.animateButton(btn));
            }
        });

        // Enhanced export functionality
        this.elements.exportPdf.addEventListener('click', () => this.exportPDF());
        this.elements.exportWord.addEventListener('click', () => this.exportWord());
        this.elements.exportImage.addEventListener('click', () => this.exportImage());
        this.elements.shareBtn.addEventListener('click', () => this.shareCircular());
        this.elements.directPrintBtn.addEventListener('click', () => this.directPrint());
        this.elements.cloudSaveBtn.addEventListener('click', () => this.cloudSave());
    }

    setupAIFeatures() {
        // Enhanced AI buttons with more actions
        this.elements.aiButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e);
                const action = button.getAttribute('data-action');
                this.handleAIAction(action);
            });
        });

        // Enhanced suggestion buttons
        this.elements.suggestionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e);
                const suggestion = button.getAttribute('data-suggestion');
                this.applyToneSuggestion(suggestion);
            });
        });

        // AI Modal handlers
        this.elements.aiModalClose.addEventListener('click', () => this.closeAIModal());
        this.elements.aiModalCancel.addEventListener('click', () => this.closeAIModal());
        this.elements.aiModalApply.addEventListener('click', () => this.applyAISuggestions());
    }

    setupTemplates() {
        // Enhanced template cards with preview and animations
        this.elements.templateCards.forEach(card => {
            card.addEventListener('click', (e) => {
                this.createRipple(e);
                const template = card.getAttribute('data-template');
                this.loadTemplate(template);
            });

            // Hover effects
            card.addEventListener('mouseenter', () => this.animateTemplateHover(card));
            card.addEventListener('mouseleave', () => this.animateTemplateLeave(card));
        });
    }

    setupAutoSave() {
        // Enhanced auto-save with backup and versioning
        setInterval(() => {
            if (this.state.autoSave && !this.state.aiThinking) {
                this.autoSave();
                this.showAutoSaveIndicator();
            }
        }, 30000); // Auto-save every 30 seconds

        // Backup on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && this.state.autoSave) {
                this.autoSave();
            }
        });
    }

    // Enhanced Theme Management
    applyTheme(theme) {
        this.state.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Save theme preference
        localStorage.setItem('themePreference', theme);
    }

    toggleTheme() {
        const newTheme = this.state.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.showToast(`Switched to ${newTheme} mode`, 'info');
    }

    // Enhanced Circular Generation with AI
    generateCircularNumber() {
        const now = new Date();
        const month = now.toLocaleString('default', { month: 'short' }).toUpperCase();
        const year = now.getFullYear();
        const randomNum = Math.floor(Math.random() * 900) + 100;
        return `CIR/${month}/${year}/${randomNum}`;
    }

    async generateCircular() {
        if (!this.validateForm()) return;

        this.showLoading();
        
        // Generate new circular number
        this.elements.circularNumber.value = this.generateCircularNumber();
        
        // Update preview with enhanced styling
        this.updatePreview();
        
        // Update stats with enhanced tracking
        this.state.circularsGenerated++;
        this.state.timeSaved += 45; // 45 minutes saved per circular
        this.saveStats();
        this.updateStatsDisplay();
        
        // Simulate processing with enhanced UX
        await this.delay(1500);
        
        this.hideLoading();
        this.showToast('Circular generated successfully!', 'success');
        
        // Auto-save the generated circular
        this.autoSave();

        // Trigger analytics
        this.trackEvent('circular_generated');
    }

    async aiGenerateContent() {
        if (!this.elements.circularTitle.value.trim()) {
            this.showToast('Please enter a circular title first', 'warning');
            this.elements.circularTitle.focus();
            return;
        }

        this.showLoading();
        this.state.aiThinking = true;
        this.showAITyping();

        try {
            // Simulate AI content generation
            const title = this.elements.circularTitle.value;
            const content = await this.simulateAIContentGeneration(title);
            
            this.elements.editor.innerHTML = content;
            this.updateEditorStats();
            this.updatePreview();
            
            this.showToast('AI content generated successfully!', 'success');
            this.trackEvent('ai_content_generated');
        } catch (error) {
            this.showToast('AI generation failed. Please try again.', 'error');
            console.error('AI Generation Error:', error);
        } finally {
            this.hideLoading();
            this.hideAITyping();
            this.state.aiThinking = false;
        }
    }

    // Enhanced Preview Management
    updatePreview() {
        // Update basic info with enhanced formatting
        this.elements.previewSchoolName.textContent = this.elements.schoolName.value || 'THE EDUCATORS ALI MUSA CAMPUS GOJRA';
        this.elements.previewSchoolContact.textContent = this.elements.schoolContact.value || 'Ph# 0546-599338 | Email: info@educators.edu.pk';
        this.elements.previewTitle.textContent = this.elements.circularTitle.value || 'CIRCULAR';
        this.elements.previewNumber.textContent = this.elements.circularNumber.value;
        
        // Update date with proper formatting
        const today = new Date();
        this.elements.previewDate.textContent = `Date: ${this.formatDate(today)}`;
        
        // Update content with enhanced styling
        const editorContent = this.elements.editor.innerHTML;
        this.elements.previewBody.innerHTML = editorContent || 
            '<p>Your circular content will appear here once you start typing in the editor.</p>';
        
        // Update media with enhanced handling
        this.updateMediaPreview();
        
        // Apply responsive styling based on device selection
        this.applyDeviceStyling();
    }

    updateMediaPreview() {
        // Update logo with enhanced error handling and animations
        if (this.media.logo) {
            this.elements.previewLogo.src = this.media.logo;
            this.elements.previewLogo.style.display = 'block';
            this.elements.logoPreview.src = this.media.logo;
            this.elements.logoPreview.style.display = 'block';
            this.animateMediaElement(this.elements.previewLogo);
        } else {
            this.elements.previewLogo.style.display = 'none';
            this.elements.logoPreview.style.display = 'none';
        }
        
        // Update signature with enhanced error handling and animations
        if (this.media.signature) {
            this.elements.previewSignature.src = this.media.signature;
            this.elements.previewSignature.style.display = 'block';
            this.elements.signaturePreview.src = this.media.signature;
            this.elements.signaturePreview.style.display = 'block';
            this.animateMediaElement(this.elements.previewSignature);
        } else {
            this.elements.previewSignature.style.display = 'none';
            this.elements.signaturePreview.style.display = 'none';
        }
        
        // Update QR code with enhanced error handling and animations
        if (this.media.qrCode) {
            this.elements.previewQR.src = this.media.qrCode;
            this.elements.previewQR.style.display = 'block';
            this.elements.qrPreview.src = this.media.qrCode;
            this.elements.qrPreview.style.display = 'block';
            this.animateMediaElement(this.elements.previewQR);
        } else {
            this.elements.previewQR.style.display = 'none';
            this.elements.qrPreview.style.display = 'none';
        }
    }

    applyDeviceStyling() {
        const device = document.getElementById('previewDevice').value;
        const paper = this.elements.circularPaper;
        
        // Reset all device styles
        paper.classList.remove('desktop-view', 'tablet-view', 'mobile-view');
        
        // Apply device-specific styling with animations
        switch (device) {
            case 'desktop':
                paper.classList.add('desktop-view');
                paper.style.maxWidth = '900px';
                paper.style.padding = '3rem';
                break;
            case 'tablet':
                paper.classList.add('tablet-view');
                paper.style.maxWidth = '700px';
                paper.style.padding = '2rem';
                break;
            case 'mobile':
                paper.classList.add('mobile-view');
                paper.style.maxWidth = '400px';
                paper.style.padding = '1.5rem';
                break;
        }

        this.animatePreviewTransition();
    }

    togglePreview() {
        const isExpanded = this.elements.previewContainer.classList.toggle('expanded-preview');
        const btn = this.elements.previewBtn;
        const icon = btn.querySelector('i');
        
        if (isExpanded) {
            icon.className = 'fas fa-compress';
            btn.innerHTML = '<i class="fas fa-compress"></i> Close Preview';
            this.animatePreviewExpansion();
        } else {
            icon.className = 'fas fa-eye';
            btn.innerHTML = '<i class="fas fa-eye"></i> Live Preview';
        }

        this.trackEvent('preview_toggled', { expanded: isExpanded });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.elements.previewContainer.requestFullscreen().catch(err => {
                this.showToast('Fullscreen mode not supported', 'error');
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Enhanced Media Handling
    handleImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type with enhanced feedback
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select a valid image file (PNG, JPG, JPEG)', 'error');
            return;
        }

        // Validate file size (5MB limit) with enhanced feedback
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Image size should be less than 5MB', 'error');
            return;
        }

        this.showLoading();

        const reader = new FileReader();
        reader.onload = (e) => {
            this.media[type] = e.target.result;
            this.updateMediaPreview();
            this.updatePreview();
            this.hideLoading();
            this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`, 'success');
            this.trackEvent('media_uploaded', { type: type });
        };
        
        reader.onerror = () => {
            this.hideLoading();
            this.showToast('Error uploading image. Please try again.', 'error');
        };
        
        reader.readAsDataURL(file);
    }

    handleFileDrop(event, card) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const type = card.querySelector('p').textContent.toLowerCase().includes('logo') ? 'logo' : 'signature';
            const input = type === 'logo' ? this.elements.logoUpload : this.elements.signatureUpload;
            
            // Create a new FileList (simulated)
            const dt = new DataTransfer();
            dt.items.add(file);
            input.files = dt.files;
            
            // Trigger change event
            input.dispatchEvent(new Event('change'));
        }
    }

    generateQRCode() {
        const text = encodeURIComponent(
            `Circular: ${this.elements.circularTitle.value || 'School Circular'}\n` +
            `School: ${this.elements.schoolName.value || 'School Name'}\n` +
            `Date: ${this.formatDate(new Date())}\n` +
            `Contact: ${this.elements.schoolContact.value || 'Contact Information'}\n` +
            `Circular No: ${this.elements.circularNumber.value}`
        );
        
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text}&format=png&margin=10&color=1a4f8e&bgcolor=ffffff`;
        this.media.qrCode = qrUrl;
        this.updateMediaPreview();
        this.updatePreview();
        this.showToast('QR code generated successfully', 'success');
        this.trackEvent('qr_generated');
    }

    // Enhanced Editor Functions
    execCommand(command, value = null) {
        try {
            document.execCommand('styleWithCSS', false, true);
            
            if (value) {
                document.execCommand(command, false, value);
            } else {
                document.execCommand(command, false, null);
            }
            
            this.elements.editor.focus();
            this.updatePreview();
            this.updateEditorStats();
        } catch (error) {
            console.error('Error executing command:', error);
            this.showToast('Error applying format', 'error');
        }
    }

    handlePaste(event) {
        event.preventDefault();
        
        // Get plain text from clipboard
        const text = (event.clipboardData || window.clipboardData).getData('text/plain');
        
        // Insert text at cursor position
        document.execCommand('insertText', false, text);
        
        this.updateEditorStats();
        this.updatePreview();
    }

    updateEditorStats() {
        const text = this.elements.editor.innerText || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        
        this.elements.wordCount.textContent = `${words} words`;
        this.elements.charCount.textContent = `${characters} characters`;
    }

    analyzeReadability() {
        const text = this.elements.editor.innerText || '';
        // Simple readability score simulation
        const score = Math.min(100, Math.max(60, 100 - (text.length / 100)));
        this.elements.readabilityScore.textContent = `${Math.round(score)}%`;
        
        // Update color based on score
        if (score >= 80) {
            this.elements.readabilityScore.style.color = 'var(--success-color)';
        } else if (score >= 60) {
            this.elements.readabilityScore.style.color = 'var(--warning-color)';
        } else {
            this.elements.readabilityScore.style.color = 'var(--danger-color)';
        }
    }

    // Enhanced AI Integration
    async handleAIAction(action) {
        if (!this.state.aiEnabled) {
            this.showToast('AI features are currently disabled', 'warning');
            return;
        }

        this.showLoading();
        this.state.aiThinking = true;
        this.showAITyping();

        try {
            switch (action) {
                case 'enhance':
                    await this.enhanceContent();
                    break;
                case 'suggest':
                    await this.getAISuggestions();
                    break;
                case 'translate':
                    await this.showTranslationOptions();
                    break;
                case 'grammar':
                    await this.checkGrammar();
                    break;
            }
            this.trackEvent('ai_action', { action: action });
        } catch (error) {
            this.showToast('AI action failed. Please try again.', 'error');
            console.error('AI Action Error:', error);
        } finally {
            this.hideLoading();
            this.hideAITyping();
            this.state.aiThinking = false;
        }
    }

    async enhanceContent() {
        const currentContent = this.elements.editor.innerHTML;
        
        // Simulate AI enhancement with more sophisticated improvements
        let enhancedContent = currentContent
            .replace(/<p>/g, '<p style="text-align: justify; line-height: 1.8; margin-bottom: 15px; text-indent: 2em;">')
            .replace(/<h1>/g, '<h1 style="color: #1a4f8e; border-bottom: 3px solid #4361ee; padding-bottom: 15px; margin-bottom: 25px; text-align: center;">')
            .replace(/<h2>/g, '<h2 style="color: #1a4f8e; border-left: 5px solid #4361ee; padding-left: 15px; margin: 20px 0; font-weight: 600;">')
            .replace(/<strong>/g, '<strong style="color: #1a4f8e; font-weight: 700;">')
            .replace(/<ul>/g, '<ul style="padding-left: 30px; margin: 15px 0;">')
            .replace(/<ol>/g, '<ol style="padding-left: 30px; margin: 15px 0;">');
        
        // Add professional formatting
        if (!enhancedContent.includes('class="circular-point"')) {
            enhancedContent = enhancedContent.replace(
                /<li>(.*?)<\/li>/g,
                '<div class="circular-point"><i class="fas fa-star"></i><div>$1</div></div>'
            );
        }
        
        this.elements.editor.innerHTML = enhancedContent;
        this.updatePreview();
        this.updateEditorStats();
        this.showToast('Content enhanced with AI-powered professional formatting', 'success');
    }

    async getAISuggestions() {
        const content = this.elements.editor.innerText;
        const title = this.elements.circularTitle.value;
        
        // Simulate AI analysis and suggestions
        const suggestions = this.generateAISuggestions(content, title);
        
        // Show suggestions in modal
        this.showAISuggestionsModal(suggestions);
    }

    async checkGrammar() {
        const content = this.elements.editor.innerText;
        
        // Simulate AI grammar check with more sophisticated improvements
        let improvedContent = content
            .replace(/\bi\b/g, 'I')
            .replace(/\barent\b/g, "aren't")
            .replace(/\bwont\b/g, "won't")
            .replace(/\bcant\b/g, "can't")
            .replace(/\bdont\b/g, "don't")
            .replace(/\bdoesnt\b/g, "doesn't")
            .replace(/\bdidnt\b/g, "didn't")
            .replace(/\bhavent\b/g, "haven't")
            .replace(/\bhasnt\b/g, "hasn't")
            .replace(/\bhadnt\b/g, "hadn't")
            .replace(/\bwouldnt\b/g, "wouldn't")
            .replace(/\bcouldnt\b/g, "couldn't")
            .replace(/\bshouldnt\b/g, "shouldn't");
        
        // Capitalize first letter of sentences
        improvedContent = improvedContent.replace(/(^\w|\.\s+\w)/g, match => match.toUpperCase());
        
        if (content !== improvedContent) {
            this.elements.editor.innerHTML = `<p>${improvedContent}</p>`;
            this.updatePreview();
            this.updateEditorStats();
            this.showToast('Grammar and spelling improvements applied', 'success');
        } else {
            this.showToast('No grammar issues found! Excellent writing!', 'success');
        }
    }

    applyToneSuggestion(tone) {
        const content = this.elements.editor.innerText;
        let modifiedContent = content;
        
        switch (tone) {
            case 'formal':
                modifiedContent = content
                    .replace(/can't/g, 'cannot')
                    .replace(/don't/g, 'do not')
                    .replace(/won't/g, 'will not')
                    .replace(/\bhi\b/g, 'Dear')
                    .replace(/\bthanks\b/g, 'Thank you')
                    .replace(/\bplease\b/g, 'Kindly')
                    .replace(/\bsorry\b/g, 'We apologize')
                    .replace(/\bI think\b/g, 'It is believed that');
                break;
            case 'friendly':
                modifiedContent = content
                    .replace(/cannot/g, "can't")
                    .replace(/do not/g, "don't")
                    .replace(/will not/g, "won't")
                    .replace(/\bDear\b/g, 'Hi')
                    .replace(/\bThank you\b/g, 'Thanks')
                    .replace(/\bKindly\b/g, 'Please')
                    .replace(/\bWe apologize\b/g, 'Sorry')
                    .replace(/\bIt is believed that\b/g, 'I think');
                break;
            case 'urgent':
                modifiedContent = content
                    .replace(/please/g, 'URGENT: Please')
                    .replace(/important/g, 'CRITICALLY IMPORTANT')
                    .replace(/request/g, 'REQUIRE')
                    .replace(/suggest/g, 'MANDATE')
                    .replace(/\bas soon as possible\b/g, 'IMMEDIATELY');
                break;
            case 'professional':
                modifiedContent = content
                    .replace(/\bget\b/g, 'obtain')
                    .replace(/\bhelp\b/g, 'assist')
                    .replace(/\btell\b/g, 'inform')
                    .replace(/\bstart\b/g, 'commence')
                    .replace(/\bend\b/g, 'conclude')
                    .replace(/\bmake sure\b/g, 'ensure');
                break;
        }
        
        this.elements.editor.innerHTML = `<p>${modifiedContent}</p>`;
        this.updatePreview();
        this.updateEditorStats();
        this.showToast(`Applied ${tone} tone to your content`, 'success');
        this.trackEvent('tone_applied', { tone: tone });
    }

    // Enhanced Template System
    loadTemplate(templateName) {
        if (this.templates[templateName]) {
            const template = this.templates[templateName];
            this.elements.editor.innerHTML = template.content;
            this.elements.circularTitle.value = template.name;
            this.state.currentTemplate = templateName;
            this.updatePreview();
            this.updateEditorStats();
            this.showToast(`"${template.name}" template loaded successfully`, 'success');
            this.trackEvent('template_loaded', { template: templateName });
        } else {
            this.showToast('Template not found', 'error');
        }
    }

    saveTemplate() {
        const name = this.elements.circularTitle.value || 'Custom Template';
        const content = this.elements.editor.innerHTML;
        
        if (!content.trim() || content === '<p><br></p>') {
            this.showToast('Please add some content before saving as template', 'error');
            return;
        }

        const template = {
            name: name,
            content: content,
            timestamp: new Date().toISOString(),
            school: this.elements.schoolName.value || 'Generic',
            type: 'custom'
        };

        const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
        savedTemplates.push(template);
        localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
        
        this.showToast('Template saved successfully! You can access it from the templates panel.', 'success');
        this.trackEvent('template_saved');
    }

    // Enhanced Export Functions
    async exportPDF() {
        if (!this.validateExport()) return;

        this.showLoading();
        
        try {
            // Use html2canvas with enhanced options for better quality
            const canvas = await html2canvas(this.elements.circularPaper, {
                scale: 3, // Higher scale for better quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: this.elements.circularPaper.offsetWidth,
                height: this.elements.circularPaper.offsetHeight
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            
            const fileName = `${this.elements.circularTitle.value || 'circular'}_${this.formatDate(new Date(), 'file')}.pdf`;
            pdf.save(fileName);
            
            this.hideLoading();
            this.showToast('High-quality PDF exported successfully!', 'success');
            
            // Update stats
            this.state.downloads++;
            this.saveStats();
            this.updateStatsDisplay();
            this.trackEvent('pdf_exported');
        } catch (error) {
            this.hideLoading();
            this.showToast('Error generating PDF: ' + error.message, 'error');
            console.error('PDF Export Error:', error);
        }
    }

    async exportWord() {
        if (!this.validateExport()) return;

        this.showLoading();

        try {
            const circularContent = this.elements.circularPaper.innerHTML;
            
            // Enhanced Word document with professional styling
            const content = this.generateWordDocument(circularContent);
            
            const blob = new Blob([content], { type: 'application/msword' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${this.elements.circularTitle.value || 'circular'}_${this.formatDate(new Date(), 'file')}.doc`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            
            this.hideLoading();
            this.showToast('Professional Word document exported successfully!', 'success');
            
            // Update stats
            this.state.downloads++;
            this.saveStats();
            this.updateStatsDisplay();
            this.trackEvent('word_exported');
        } catch (error) {
            this.hideLoading();
            this.showToast('Error generating Word document', 'error');
            console.error('Word Export Error:', error);
        }
    }

    async exportImage() {
        if (!this.validateExport()) return;

        this.showLoading();
        
        try {
            const canvas = await html2canvas(this.elements.circularPaper, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: this.elements.circularPaper.offsetWidth,
                height: this.elements.circularPaper.offsetHeight
            });

            const link = document.createElement('a');
            link.download = `${this.elements.circularTitle.value || 'circular'}_${this.formatDate(new Date(), 'file')}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
            
            this.hideLoading();
            this.showToast('High-quality image exported successfully!', 'success');
            
            // Update stats
            this.state.downloads++;
            this.saveStats();
            this.updateStatsDisplay();
            this.trackEvent('image_exported');
        } catch (error) {
            this.hideLoading();
            this.showToast('Error generating image', 'error');
            console.error('Image Export Error:', error);
        }
    }

    async shareCircular() {
        if (!this.validateExport()) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: this.elements.circularTitle.value || 'School Circular',
                    text: 'Check out this circular from our school',
                    url: window.location.href,
                });
                this.showToast('Circular shared successfully!', 'success');
                this.trackEvent('circular_shared');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    this.showToast('Sharing failed', 'error');
                }
            }
        } else {
            this.showToast('Web Share API not supported in your browser', 'warning');
            // Fallback: copy to clipboard
            this.fallbackShare();
        }
    }

    async directPrint() {
        if (!this.validateExport()) return;

        const printWindow = window.open('', '_blank');
        const printContent = this.generatePrintContent();
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for images to load
        printWindow.onload = () => {
            printWindow.print();
            printWindow.onafterprint = () => printWindow.close();
        };

        this.trackEvent('direct_print');
    }

    async cloudSave() {
        if (!this.validateExport()) return;

        this.showLoading();

        try {
            // Simulate cloud save
            await this.delay(2000);
            
            const circularData = {
                title: this.elements.circularTitle.value,
                content: this.elements.editor.innerHTML,
                school: this.elements.schoolName.value,
                timestamp: new Date().toISOString(),
                media: this.media
            };

            const cloudSaves = JSON.parse(localStorage.getItem('cloudSaves') || '[]');
            cloudSaves.push(circularData);
            localStorage.setItem('cloudSaves', JSON.stringify(cloudSaves));
            
            this.hideLoading();
            this.showToast('Circular saved to cloud successfully!', 'success');
            this.trackEvent('cloud_saved');
        } catch (error) {
            this.hideLoading();
            this.showToast('Cloud save failed. Please try again.', 'error');
        }
    }

    validateExport() {
        if (!this.elements.schoolName.value.trim()) {
            this.showToast('Please enter school name before exporting', 'error');
            this.elements.schoolName.focus();
            return false;
        }

        if (!this.elements.circularTitle.value.trim()) {
            this.showToast('Please enter circular title before exporting', 'error');
            this.elements.circularTitle.focus();
            return false;
        }

        const content = this.elements.editor.innerText.trim();
        if (!content || content === 'Start typing your circular content here...') {
            this.showToast('Please add some content to the circular before exporting', 'error');
            this.elements.editor.focus();
            return false;
        }

        return true;
    }

    // Enhanced Data Management
    autoSave() {
        const draft = {
            schoolName: this.elements.schoolName.value,
            schoolContact: this.elements.schoolContact.value,
            circularTitle: this.elements.circularTitle.value,
            circularNumber: this.elements.circularNumber.value,
            content: this.elements.editor.innerHTML,
            media: this.media,
            timestamp: new Date().toISOString(),
            template: this.state.currentTemplate,
            version: '2.0'
        };
        
        localStorage.setItem('circularDraft', JSON.stringify(draft));
        this.state.lastSave = new Date();
    }

    saveDraft() {
        this.autoSave();
        this.showToast('Draft saved successfully!', 'success');
        this.trackEvent('draft_saved');
    }

    loadDraft() {
        const draft = localStorage.getItem('circularDraft');
        if (!draft) {
            this.showToast('No saved draft found', 'warning');
            return;
        }

        try {
            const parsedDraft = JSON.parse(draft);
            this.loadDraftData(parsedDraft);
            this.showToast('Draft loaded successfully!', 'success');
            this.trackEvent('draft_loaded');
        } catch (e) {
            this.showToast('Error loading draft', 'error');
            console.error('Draft Load Error:', e);
        }
    }

    loadDraftData(draft) {
        this.elements.schoolName.value = draft.schoolName || '';
        this.elements.schoolContact.value = draft.schoolContact || '';
        this.elements.circularTitle.value = draft.circularTitle || '';
        this.elements.circularNumber.value = draft.circularNumber || this.generateCircularNumber();
        this.elements.editor.innerHTML = draft.content || '<p>Start typing your circular content here...</p>';
        
        if (draft.media) {
            this.media = { ...this.media, ...draft.media };
        }
        
        if (draft.template) {
            this.state.currentTemplate = draft.template;
        }
        
        this.updatePreview();
        this.updateEditorStats();
        this.updateStatsDisplay();
    }

    resetForm() {
        if (confirm('Are you sure you want to reset all fields? This action cannot be undone.')) {
            this.elements.schoolName.value = '';
            this.elements.schoolContact.value = '';
            this.elements.circularTitle.value = '';
            this.elements.circularNumber.value = this.generateCircularNumber();
            this.elements.editor.innerHTML = '<p>Start typing your circular content here...</p>';
            
            this.media = {
                logo: '',
                signature: '',
                qrCode: ''
            };
            
            this.state.currentTemplate = null;
            
            this.updatePreview();
            this.updateEditorStats();
            this.showToast('All fields reset successfully', 'info');
            this.trackEvent('form_reset');
        }
    }

    hasUnsavedChanges() {
        const draft = localStorage.getItem('circularDraft');
        if (!draft) return false;

        try {
            const parsedDraft = JSON.parse(draft);
            const currentState = {
                schoolName: this.elements.schoolName.value,
                schoolContact: this.elements.schoolContact.value,
                circularTitle: this.elements.circularTitle.value,
                content: this.elements.editor.innerHTML
            };

            return JSON.stringify(currentState) !== JSON.stringify({
                schoolName: parsedDraft.schoolName,
                schoolContact: parsedDraft.schoolContact,
                circularTitle: parsedDraft.circularTitle,
                content: parsedDraft.content
            });
        } catch (e) {
            return false;
        }
    }

    loadStats() {
        const stats = JSON.parse(localStorage.getItem('circularStats'));
        if (stats) {
            this.state.circularsGenerated = stats.circularsGenerated || 0;
            this.state.downloads = stats.downloads || 0;
            this.state.timeSaved = stats.timeSaved || 0;
        }
    }

    saveStats() {
        const stats = {
            circularsGenerated: this.state.circularsGenerated,
            downloads: this.state.downloads,
            timeSaved: this.state.timeSaved,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('circularStats', JSON.stringify(stats));
    }

    updateStatsDisplay() {
        this.elements.circularCount.textContent = this.state.circularsGenerated;
        this.elements.downloadCount.textContent = this.state.downloads;
        
        const hours = Math.floor(this.state.timeSaved / 60);
        const minutes = this.state.timeSaved % 60;
        this.elements.timeSaved.textContent = `${hours}h ${minutes}m`;
    }

    // Enhanced Utility Functions
    formatDate(date, format = 'display') {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        if (format === 'file') {
            return `${year}${month}${day}`;
        }
        
        return `${day}-${month}-${year}`;
    }

    showLoading() {
        this.elements.loadingOverlay.style.display = 'flex';
        
        // Animate progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.animation = 'progress 3s ease-in-out infinite';
        }
    }

    hideLoading() {
        this.elements.loadingOverlay.style.display = 'none';
        
        // Reset progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.animation = 'none';
        }
    }

    showAITyping() {
        this.elements.aiTyping.style.display = 'flex';
    }

    hideAITyping() {
        this.elements.aiTyping.style.display = 'none';
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas fa-${icons[type] || 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        this.elements.toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }

    // Animation Functions
    createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    animateInput(input) {
        input.style.transform = 'scale(1.02)';
        setTimeout(() => {
            input.style.transform = 'scale(1)';
        }, 150);
    }

    animateInputFocus(input) {
        input.parentElement.classList.add('focused');
    }

    animateInputBlur(input) {
        input.parentElement.classList.remove('focused');
    }

    animateMediaElement(element) {
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0.5';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, 300);
    }

    animatePreviewTransition() {
        this.elements.circularPaper.style.transform = 'scale(0.95)';
        this.elements.circularPaper.style.opacity = '0.7';
        setTimeout(() => {
            this.elements.circularPaper.style.transform = 'scale(1)';
            this.elements.circularPaper.style.opacity = '1';
        }, 300);
    }

    animatePreviewExpansion() {
        this.elements.previewContainer.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.elements.previewContainer.style.transform = 'scale(1)';
        }, 200);
    }

    animateTemplateHover(card) {
        card.style.transform = 'translateY(-5px) rotate(2deg)';
    }

    animateTemplateLeave(card) {
        card.style.transform = 'translateY(0) rotate(0)';
    }

    showAutoSaveIndicator() {
        const indicator = document.querySelector('.save-indicator');
        if (indicator) {
            indicator.style.animation = 'none';
            setTimeout(() => {
                indicator.style.animation = 'savePulse 2s infinite';
            }, 10);
        }
    }

    // AI Content Generation (Simulated)
    generateAIContent(type) {
        const templates = {
            ptm: `
                <h2>Parent Teacher Meeting Notice</h2>
                <p>Dear Parents and Guardians,</p>
                
                <div class="circular-point">
                    <i class="fas fa-star"></i>
                    <div>We are pleased to inform you that the <strong>Parent Teacher Meeting (PTM)</strong> will be held on <strong>[Date]</strong> from <strong>[Time]</strong> in the school premises.</div>
                </div>
                
                <div class="circular-point">
                    <i class="fas fa-star"></i>
                    <div>This meeting provides an excellent opportunity to discuss your child's academic progress, behavior, and overall development with their respective teachers.</div>
                </div>
                
                <div class="circular-point">
                    <i class="fas fa-star"></i>
                    <div>Both parents are earnestly requested to attend this important meeting to strengthen the home-school partnership.</div>
                </div>
                
                <div class="info-box">
                    <h4>Meeting Schedule:</h4>
                    <p><strong>Primary Section (Grade 1-5):</strong> 8:30 AM - 10:30 AM</p>
                    <p><strong>Middle Section (Grade 6-8):</strong> 10:30 AM - 12:30 PM</p>
                    <p><strong>Senior Section (Grade 9-12):</strong> 12:30 PM - 2:30 PM</p>
                </div>
                
                <p>We look forward to your valuable presence and cooperation in this endeavor to enhance your child's educational journey.</p>
                
                <p>Warm regards,</p>
            `,
            holiday: `
                <h2>Holiday Announcement</h2>
                <p>Dear Students, Parents, and Staff,</p>
                
                <div class="circular-point">
                    <i class="fas fa-star"></i>
                    <div>This is to inform you that the school will remain closed from <strong>[Start Date]</strong> to <strong>[End Date]</strong> on account of <strong>[Occasion/Festival]</strong>.</div>
                </div>
                
                <div class="circular-point">
                    <i class="fas fa-star"></i>
                    <div>All academic activities, including online classes and co-curricular programs, will remain suspended during this period.</div>
                </div>
                
                <div class="circular-point">
                    <i class="fas fa-star"></i>
                    <div>Regular classes will resume normally from <strong>[Resume Date]</strong>. Students are requested to join promptly.</div>
                </div>
                
                <div class="info-box">
                    <h4>Important Instructions:</h4>
                    <p>• Complete all pending assignments and holiday homework systematically</p>
                    <p>• Submit all projects and assignments on the first day after holidays</p>
                    <p>• Maintain discipline and follow safety guidelines during the break</p>
                    <p>• Engage in productive activities and reading during holidays</p>
                </div>
                
                <p>Wishing you and your family a joyful, safe, and memorable holiday!</p>
            `,
            exam: `
                <h2>Examination Schedule Announcement</h2>
                <p>Dear Students and Parents,</p>
                
                <div class="circular-point">
                    <i class="fas fa-star"></i>
                    <div>The <strong>[Exam Name/Type]</strong> examinations are scheduled to commence from <strong>[Start Date]</strong> and conclude on <strong>[End Date]</strong>.</div>
                </div>
                
                <div class="circular-point">
                    <i class="fas fa-star"></i>
                    <div>A detailed date sheet is provided below for systematic preparation and planning.</div>
                </div>
                
                <div class="circular-point">
                    <i class="fas fa-star"></i>
                    <div>All students must carry their school ID cards and admit cards to the examination hall. Without these, entry will not be permitted.</div>
                </div>
                
                <div class="info-box">
                    <h4>Examination Guidelines:</h4>
                    <p>• Reach the examination center 30 minutes before the scheduled time</p>
                    <p>• Carry all necessary stationery items (pens, pencils, ruler, etc.)</p>
                    <p>• Mobile phones and electronic devices are strictly prohibited</p>
                    <p>• Maintain complete silence and follow all examination rules</p>
                    <p>• Any form of malpractice will lead to strict disciplinary action</p>
                </div>
                
                <p>We wish all students the very best for their examinations. Prepare well and give your best!</p>
            `
        };

        return templates[type] || '<p>AI content generation in progress...</p>';
    }

    async simulateAIContentGeneration(title) {
        // Simulate API call delay
        await this.delay(2000);
        
        return `
            <h2>${title}</h2>
            <p>Dear Students, Parents, and Guardians,</p>
            
            <div class="circular-point">
                <i class="fas fa-star"></i>
                <div>This circular is being issued to inform you about important updates and announcements regarding school activities and schedules.</div>
            </div>
            
            <div class="circular-point">
                <i class="fas fa-star"></i>
                <div>We encourage all stakeholders to carefully read through the following points and take necessary actions as required.</div>
            </div>
            
            <div class="info-box">
                <h4>Key Highlights:</h4>
                <p>• Important dates and deadlines to remember</p>
                <p>• Special events and activities planned</p>
                <p>• Academic updates and requirements</p>
                <p>• General instructions and guidelines</p>
            </div>
            
            <p>For any queries or clarifications, please feel free to contact the school administration during working hours.</p>
            
            <p>Thank you for your cooperation and continued support.</p>
        `;
    }

    generateAISuggestions(content, title) {
        const suggestions = [];
        
        if (!content || content.length < 50) {
            suggestions.push({
                type: 'content',
                message: 'Consider adding more detailed information to make the circular comprehensive.',
                priority: 'high'
            });
        }
        
        if (!title || title.length < 5) {
            suggestions.push({
                type: 'title', 
                message: 'Make the title more specific and descriptive.',
                priority: 'high'
            });
        }
        
        if (content && content.length > 0) {
            suggestions.push({
                type: 'formatting',
                message: 'Use bullet points and headings to improve readability.',
                priority: 'medium'
            });
            
            suggestions.push({
                type: 'tone',
                message: 'Ensure the tone matches the purpose (formal for official notices).',
                priority: 'medium'
            });
        }
        
        return suggestions;
    }

    showAISuggestionsModal(suggestions) {
        if (suggestions.length === 0) {
            this.showToast('No suggestions available. Your content looks great!', 'success');
            return;
        }

        let html = '<div class="suggestions-list">';
        suggestions.forEach(suggestion => {
            html += `
                <div class="suggestion-item ${suggestion.priority}">
                    <div class="suggestion-icon">
                        <i class="fas fa-${this.getSuggestionIcon(suggestion.type)}"></i>
                    </div>
                    <div class="suggestion-content">
                        <p>${suggestion.message}</p>
                        <span class="suggestion-priority">${suggestion.priority} priority</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        this.elements.aiModalBody.innerHTML = html;
        this.elements.aiModal.style.display = 'flex';
    }

    closeAIModal() {
        this.elements.aiModal.style.display = 'none';
    }

    applyAISuggestions() {
        // Apply the first high-priority suggestion
        const highPrioritySuggestions = document.querySelectorAll('.suggestion-item.high');
        if (highPrioritySuggestions.length > 0) {
            const suggestion = highPrioritySuggestions[0].querySelector('p').textContent;
            this.showToast(`Applied: ${suggestion}`, 'success');
        }
        this.closeAIModal();
    }

    getSuggestionIcon(type) {
        const icons = {
            content: 'edit',
            title: 'heading',
            formatting: 'list',
            tone: 'comment-alt',
            grammar: 'spell-check'
        };
        return icons[type] || 'lightbulb';
    }

    generateWordDocument(htmlContent) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${this.elements.circularTitle.value || 'School Circular'}</title>
                <style>
                    body { 
                        font-family: 'Times New Roman', serif; 
                        line-height: 1.6; 
                        margin: 2cm;
                        color: #333;
                        font-size: 12pt;
                    }
                    .circular-header { 
                        text-align: center; 
                        margin-bottom: 1.5cm; 
                        border-bottom: 3px double #1a4f8e;
                        padding-bottom: 0.5cm;
                    }
                    .school-name { 
                        font-size: 18pt; 
                        font-weight: bold; 
                        color: #1a4f8e;
                        text-transform: uppercase;
                        margin-bottom: 0.3cm;
                    }
                    .circular-title { 
                        font-size: 16pt; 
                        font-weight: bold; 
                        text-transform: uppercase;
                        color: #1a4f8e;
                        margin: 0.5cm 0;
                    }
                    .circular-point {
                        margin-bottom: 0.3cm;
                        display: flex;
                        align-items: flex-start;
                    }
                    .info-box {
                        background: #f8f9fa;
                        border-left: 4px solid #4361ee;
                        padding: 0.3cm 0.5cm;
                        margin: 0.5cm 0;
                    }
                    .circular-footer {
                        margin-top: 1.5cm;
                        padding-top: 0.5cm;
                        border-top: 2px solid #1a4f8e;
                    }
                    .signature-line {
                        width: 6cm;
                        border-top: 1px solid #333;
                        margin: 0.5cm 0 0.2cm;
                    }
                    @media print {
                        body { margin: 1.5cm; }
                    }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;
    }

    generatePrintContent() {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${this.elements.circularTitle.value}</title>
                <style>
                    body { 
                        font-family: 'Times New Roman', serif; 
                        margin: 0;
                        padding: 2cm;
                        color: #000;
                    }
                    @media print {
                        body { padding: 1.5cm; }
                    }
                </style>
            </head>
            <body>
                ${this.elements.circularPaper.innerHTML}
            </body>
            </html>
        `;
    }

    fallbackShare() {
        // Copy to clipboard as fallback
        const text = `${this.elements.circularTitle.value}\n\n${this.elements.editor.innerText}\n\nSchool: ${this.elements.schoolName.value}`;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Circular content copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('Could not copy to clipboard', 'error');
        });
    }

    handleResize() {
        // Adjust layout for mobile devices
        if (window.innerWidth < 768) {
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    }

    printCircular() {
        window.print();
    }

    trackEvent(action, data = {}) {
        // Simulate analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, data);
        }
        
        console.log('Event tracked:', action, data);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    loadInitialData() {
        // Load saved draft if exists
        const draft = localStorage.getItem('circularDraft');
        if (draft) {
            try {
                this.loadDraftData(JSON.parse(draft));
                this.showToast('Previous draft loaded automatically', 'info');
            } catch (e) {
                console.error('Error loading draft:', e);
            }
        }

        // Load stats and update display
        this.loadStats();
        this.updateStatsDisplay();

        // Initialize editor stats
        this.updateEditorStats();

        // Apply saved theme
        this.applyTheme(this.state.currentTheme);
    }

    validateForm() {
        if (!this.elements.schoolName.value.trim()) {
            this.showToast('Please enter school name', 'error');
            this.elements.schoolName.focus();
            return false;
        }

        if (!this.elements.circularTitle.value.trim()) {
            this.showToast('Please enter circular title', 'error');
            this.elements.circularTitle.focus();
            return false;
        }

        return true;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CircularGenerator();
});

// Service Worker Registration for PWA (Enhanced)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
                // Track service worker registration
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'service_worker_registered');
                }
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for global access if needed
window.CircularGenerator = CircularGenerator;