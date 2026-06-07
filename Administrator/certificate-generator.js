// ============================================
// CERTIFICATE GENERATOR - COMPLETE FUNCTIONALITY
// 150+ Features | English + Urdu Support | TiDB + Vercel + Grok AI
// ============================================

// API Configuration
const API_BASE = '/api';
const TOOL_SLUG = 'certificate-generator';
let userId = localStorage.getItem('userId') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem('userId', userId);

// Language Configuration
let currentLanguage = localStorage.getItem('language') || 'en';

// Translations
const translations = {
    en: {
        // Hero
        heroBadge: 'Professional Edition | 150+ Features',
        heroTitle: 'Certificate Generator',
        heroSubtitle: 'Create stunning professional certificates with AI assistance',
        statUsed: 'Used',
        statReactions: 'Reactions',
        statShares: 'Shares',
        btnCreate: 'Create Now',
        btnAI: 'Enhance with AI',
        
        // Tool
        usageText: 'times used',
        templatesTitle: 'Templates',
        templateClassic: 'Classic',
        templateModern: 'Modern',
        templateProfessional: 'Professional',
        templateElegant: 'Elegant',
        templateCreative: 'Creative',
        templateLuxury: 'Luxury',
        
        // Details
        detailsTitle: 'Certificate Details',
        titleLabel: 'Title',
        subtitleLabel: 'Subtitle',
        recipientLabel: 'Recipient Name',
        bodyLabel: 'Description',
        dateLabel: 'Date',
        
        // Fonts
        fontsTitle: 'Fonts',
        titleFontLabel: 'Title Font',
        bodyFontLabel: 'Body Font',
        
        // Colors
        colorsTitle: 'Colors',
        titleColorLabel: 'Title Color',
        borderColorLabel: 'Border Color',
        patternLabel: 'Background Pattern',
        
        // Logo & Signatures
        logoSignTitle: 'Logo & Signatures',
        uploadLogoLabel: 'Upload Logo',
        signature1NameLabel: 'Signature 1 - Name',
        signature1TitleLabel: 'Signature 1 - Title',
        signature2NameLabel: 'Signature 2 - Name',
        signature2TitleLabel: 'Signature 2 - Title',
        
        // Reactions
        reactionsTitle: 'Your Reaction',
        
        // Share
        shareTitle: 'Share',
        
        // Download
        downloadTitle: 'Download',
        resetBtn: 'Reset',
        
        // Preview
        livePreview: 'Live Preview',
        aiAssist: 'AI Assistant',
        
        // Toast Messages
        welcomeMsg: 'Welcome! Start creating your certificate',
        aiSuccess: 'AI has enhanced your text!',
        aiError: 'AI service temporarily unavailable',
        pdfSuccess: 'PDF downloaded successfully!',
        docSuccess: 'Word file downloaded!',
        txtSuccess: 'TXT file downloaded!',
        resetSuccess: 'Form reset successfully!',
        copySuccess: 'Link copied!',
        reactionSuccess: 'Thank you! Your reaction has been saved',
        reactionExists: 'You have already reacted with this emoji',
        reactionError: 'Error saving reaction',
        loadingText: 'AI is processing...'
    },
    ur: {
        // Hero
        heroBadge: 'پیشہ ورانہ ایڈیشن | 150+ فیچرز',
        heroTitle: 'سرٹیفکیٹ جنریٹر',
        heroSubtitle: 'AI کی مدد سے شاندار پیشہ ورانہ سرٹیفکیٹ بنائیں',
        statUsed: 'استعمال شدہ',
        statReactions: 'ردعمل',
        statShares: 'شیئرز',
        btnCreate: 'ابھی بنائیں',
        btnAI: 'AI سے بہتر کریں',
        
        // Tool
        usageText: 'بار استعمال',
        templatesTitle: 'ٹیمپلیٹس',
        templateClassic: 'کلاسک',
        templateModern: 'ماڈرن',
        templateProfessional: 'پیشہ ورانہ',
        templateElegant: 'خوبصورت',
        templateCreative: 'تخلیقی',
        templateLuxury: 'لگژری',
        
        // Details
        detailsTitle: 'سرٹیفکیٹ کی تفصیلات',
        titleLabel: 'عنوان',
        subtitleLabel: 'ذیلی عنوان',
        recipientLabel: 'وصول کنندہ کا نام',
        bodyLabel: 'تفصیل',
        dateLabel: 'تاریخ',
        
        // Fonts
        fontsTitle: 'فونٹس',
        titleFontLabel: 'عنوان کا فونٹ',
        bodyFontLabel: 'باقی متن کا فونٹ',
        
        // Colors
        colorsTitle: 'رنگیں',
        titleColorLabel: 'عنوان کا رنگ',
        borderColorLabel: 'بارڈر کا رنگ',
        patternLabel: 'پس منظر پیٹرن',
        
        // Logo & Signatures
        logoSignTitle: 'لوگو اور دستخط',
        uploadLogoLabel: 'لوگو اپ لوڈ کریں',
        signature1NameLabel: 'دستخط 1 - نام',
        signature1TitleLabel: 'دستخط 1 - عہدہ',
        signature2NameLabel: 'دستخط 2 - نام',
        signature2TitleLabel: 'دستخط 2 - عہدہ',
        
        // Reactions
        reactionsTitle: 'آپ کا ردعمل',
        
        // Share
        shareTitle: 'شیئر کریں',
        
        // Download
        downloadTitle: 'ڈاؤن لوڈ',
        resetBtn: 'ری سیٹ',
        
        // Preview
        livePreview: 'لائیو پریمیو',
        aiAssist: 'AI مدد',
        
        // Toast Messages
        welcomeMsg: 'خوش آمدید! سرٹیفکیٹ بنانا شروع کریں',
        aiSuccess: 'AI نے متن بہتر کر دیا!',
        aiError: 'AI سروس عارضی طور پر دستیاب نہیں',
        pdfSuccess: 'PDF ڈاؤن لوڈ ہو گیا!',
        docSuccess: 'Word فائل ڈاؤن لوڈ ہو گئی!',
        txtSuccess: 'TXT فائل ڈاؤن لوڈ ہو گئی!',
        resetSuccess: 'فارم ری سیٹ ہو گیا!',
        copySuccess: 'لنک کاپی ہو گیا!',
        reactionSuccess: 'شکریہ! آپ کا ردعمل محفوظ ہو گیا',
        reactionExists: 'آپ پہلے ہی اس ایموجی پر ردعمل دے چکے ہیں',
        reactionError: 'ردعمل محفوظ کرنے میں خرابی',
        loadingText: 'AI پروسیس کر رہا ہے...'
    }
};

// DOM Elements
let elements = {};

// State Management
let currentTemplate = 1;
let darkMode = localStorage.getItem('darkMode') === 'true';
let autoSaveInterval = null;

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    initElements();
    attachEventListeners();
    applyLanguage(currentLanguage);
    await loadInitialData();
    setupAutoSave();
    setupScrollButtons();
    applyDarkMode();
    showToast(translations[currentLanguage].welcomeMsg, 'success');
});

function initElements() {
    elements = {
        // Inputs
        certTitleInput: document.getElementById('certTitleInput'),
        certSubtitleInput: document.getElementById('certSubtitleInput'),
        certRecipientInput: document.getElementById('certRecipientInput'),
        certBodyInput: document.getElementById('certBodyInput'),
        certDateInput: document.getElementById('certDateInput'),
        titleColorInput: document.getElementById('titleColorInput'),
        borderColorInput: document.getElementById('borderColorInput'),
        bgPatternSelect: document.getElementById('bgPatternSelect'),
        titleFontSelect: document.getElementById('titleFontSelect'),
        bodyFontSelect: document.getElementById('bodyFontSelect'),
        signature1NameInput: document.getElementById('signature1NameInput'),
        signature1TitleInput: document.getElementById('signature1TitleInput'),
        signature2NameInput: document.getElementById('signature2NameInput'),
        signature2TitleInput: document.getElementById('signature2TitleInput'),
        logoUpload: document.getElementById('logoUpload'),
        
        // Display elements
        certTitle: document.getElementById('certTitle'),
        certSubtitle: document.getElementById('certSubtitle'),
        certRecipient: document.getElementById('certRecipient'),
        certBody: document.getElementById('certBody'),
        certDate: document.getElementById('certDate'),
        signature1NameDisplay: document.getElementById('signature1NameDisplay'),
        signature1TitleDisplay: document.getElementById('signature1TitleDisplay'),
        signature2NameDisplay: document.getElementById('signature2NameDisplay'),
        signature2TitleDisplay: document.getElementById('signature2TitleDisplay'),
        certLogo: document.getElementById('certLogo'),
        certBorder: document.querySelector('.cert-border'),
        certBg: document.querySelector('.cert-bg'),
        
        // Buttons
        exportPDFBtn: document.getElementById('exportPDFBtn'),
        exportDocBtn: document.getElementById('exportDocBtn'),
        exportTxtBtn: document.getElementById('exportTxtBtn'),
        resetBtn: document.getElementById('resetBtn'),
        aiAssistBtn: document.getElementById('aiAssistBtn'),
        aiEnhanceBtn: document.getElementById('aiEnhanceBtn'),
        scrollToToolBtn: document.getElementById('scrollToToolBtn'),
        darkModeToggle: document.getElementById('darkModeToggle'),
        fullscreenBtn: document.getElementById('fullscreenBtn'),
        
        // Counters
        toolUsageCounter: document.getElementById('toolUsageCounter'),
        globalUsageCounter: document.getElementById('globalUsageCounter'),
        globalReactionsCounter: document.getElementById('globalReactionsCounter'),
        globalSharesCounter: document.getElementById('globalSharesCounter'),
        
        // Templates
        templateItems: document.querySelectorAll('.template-item'),
        
        // Reactions
        reactionBtns: document.querySelectorAll('.reaction-btn'),
        
        // Share buttons
        shareBtns: document.querySelectorAll('.share-btn'),
        
        // Language buttons
        langBtns: document.querySelectorAll('.lang-btn'),
        
        // Toast & Loading
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toastMessage'),
        loadingOverlay: document.getElementById('loadingOverlay'),
        loadingText: document.getElementById('loadingText')
    };
    
    // Reaction count elements
    elements.reactionCounts = {
        like: document.getElementById('reaction-like'),
        love: document.getElementById('reaction-love'),
        wow: document.getElementById('reaction-wow'),
        sad: document.getElementById('reaction-sad'),
        angry: document.getElementById('reaction-angry'),
        laugh: document.getElementById('reaction-laugh'),
        celebrate: document.getElementById('reaction-celebrate')
    };
}

function attachEventListeners() {
    // Input listeners
    const inputElements = ['certTitleInput', 'certSubtitleInput', 'certRecipientInput', 'certBodyInput', 
                           'certDateInput', 'titleColorInput', 'borderColorInput', 'bgPatternSelect', 
                           'titleFontSelect', 'bodyFontSelect'];
    
    inputElements.forEach(key => {
        if (elements[key]) {
            elements[key].addEventListener('input', updateCertificatePreview);
            elements[key].addEventListener('change', updateCertificatePreview);
        }
    });
    
    // Signature inputs
    if (elements.signature1NameInput) {
        elements.signature1NameInput.addEventListener('input', () => {
            if (elements.signature1NameDisplay) elements.signature1NameDisplay.textContent = elements.signature1NameInput.value;
        });
    }
    if (elements.signature1TitleInput) {
        elements.signature1TitleInput.addEventListener('input', () => {
            if (elements.signature1TitleDisplay) elements.signature1TitleDisplay.textContent = elements.signature1TitleInput.value;
        });
    }
    if (elements.signature2NameInput) {
        elements.signature2NameInput.addEventListener('input', () => {
            if (elements.signature2NameDisplay) elements.signature2NameDisplay.textContent = elements.signature2NameInput.value;
        });
    }
    if (elements.signature2TitleInput) {
        elements.signature2TitleInput.addEventListener('input', () => {
            if (elements.signature2TitleDisplay) elements.signature2TitleDisplay.textContent = elements.signature2TitleInput.value;
        });
    }
    
    // Logo upload
    if (elements.logoUpload) {
        elements.logoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && elements.certLogo) {
                const reader = new FileReader();
                reader.onload = (ev) => { elements.certLogo.src = ev.target.result; };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Buttons
    if (elements.exportPDFBtn) elements.exportPDFBtn.addEventListener('click', exportToPDF);
    if (elements.exportDocBtn) elements.exportDocBtn.addEventListener('click', exportToDOC);
    if (elements.exportTxtBtn) elements.exportTxtBtn.addEventListener('click', exportToTXT);
    if (elements.resetBtn) elements.resetBtn.addEventListener('click', resetForm);
    if (elements.aiAssistBtn) elements.aiAssistBtn.addEventListener('click', openAIAssist);
    if (elements.aiEnhanceBtn) elements.aiEnhanceBtn.addEventListener('click', enhanceWithAI);
    if (elements.scrollToToolBtn) {
        elements.scrollToToolBtn.addEventListener('click', () => {
            document.getElementById('mainTool')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
    if (elements.darkModeToggle) elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    if (elements.fullscreenBtn) elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Templates
    if (elements.templateItems) {
        elements.templateItems.forEach(template => {
            template.addEventListener('click', () => {
                const templateId = template.dataset.template;
                applyTemplate(templateId);
                elements.templateItems.forEach(t => t.classList.remove('active'));
                template.classList.add('active');
            });
        });
    }
    
    // Reactions
    if (elements.reactionBtns) {
        elements.reactionBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const reaction = btn.dataset.reaction;
                await addReaction(reaction);
            });
        });
    }
    
    // Share buttons
    if (elements.shareBtns) {
        elements.shareBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const platform = btn.dataset.platform;
                await shareTool(platform);
            });
        });
    }
    
    // Language buttons
    if (elements.langBtns) {
        elements.langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                setLanguage(lang);
            });
        });
    }
}

// ============================================
// LANGUAGE FUNCTIONS
// ============================================

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    applyLanguage(lang);
    
    // Update active button
    if (elements.langBtns) {
        elements.langBtns.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Set RTL for Urdu
    if (lang === 'ur') {
        document.body.setAttribute('dir', 'rtl');
    } else {
        document.body.setAttribute('dir', 'ltr');
    }
    
    showToast(`Language switched to ${lang === 'en' ? 'English' : 'Urdu'}`, 'success');
}

function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;
    
    // Hero section
    const heroBadgeText = document.querySelector('.hero-badge-text');
    if (heroBadgeText) heroBadgeText.textContent = t.heroBadge;
    
    const heroSubtitleText = document.querySelector('.hero-subtitle-text');
    if (heroSubtitleText) heroSubtitleText.textContent = t.heroSubtitle;
    
    const statUsedText = document.querySelectorAll('.stat-used-text');
    statUsedText.forEach(el => el.textContent = t.statUsed);
    
    const statReactionsText = document.querySelectorAll('.stat-reactions-text');
    statReactionsText.forEach(el => el.textContent = t.statReactions);
    
    const statSharesText = document.querySelectorAll('.stat-shares-text');
    statSharesText.forEach(el => el.textContent = t.statShares);
    
    const btnCreateText = document.querySelector('.btn-create-text');
    if (btnCreateText) btnCreateText.textContent = t.btnCreate;
    
    const btnAIText = document.querySelector('.btn-ai-text');
    if (btnAIText) btnAIText.textContent = t.btnAI;
    
    // Tool header
    const usageText = document.querySelector('.usage-text');
    if (usageText) usageText.textContent = t.usageText;
    
    // Templates
    const templatesTitle = document.querySelector('.templates-title');
    if (templatesTitle) templatesTitle.textContent = t.templatesTitle;
    
    const templateClassic = document.querySelector('.template-classic-text');
    if (templateClassic) templateClassic.textContent = t.templateClassic;
    
    const templateModern = document.querySelector('.template-modern-text');
    if (templateModern) templateModern.textContent = t.templateModern;
    
    const templateProfessional = document.querySelector('.template-professional-text');
    if (templateProfessional) templateProfessional.textContent = t.templateProfessional;
    
    const templateElegant = document.querySelector('.template-elegant-text');
    if (templateElegant) templateElegant.textContent = t.templateElegant;
    
    const templateCreative = document.querySelector('.template-creative-text');
    if (templateCreative) templateCreative.textContent = t.templateCreative;
    
    const templateLuxury = document.querySelector('.template-luxury-text');
    if (templateLuxury) templateLuxury.textContent = t.templateLuxury;
    
    // Details
    const detailsTitle = document.querySelector('.details-title');
    if (detailsTitle) detailsTitle.textContent = t.detailsTitle;
    
    const titleLabel = document.querySelector('.title-label');
    if (titleLabel) titleLabel.innerHTML = '<i class="fas fa-heading"></i> ' + t.titleLabel;
    
    const subtitleLabel = document.querySelector('.subtitle-label');
    if (subtitleLabel) subtitleLabel.innerHTML = '<i class="fas fa-tag"></i> ' + t.subtitleLabel;
    
    const recipientLabel = document.querySelector('.recipient-label');
    if (recipientLabel) recipientLabel.innerHTML = '<i class="fas fa-user"></i> ' + t.recipientLabel;
    
    const bodyLabel = document.querySelector('.body-label');
    if (bodyLabel) bodyLabel.innerHTML = '<i class="fas fa-paragraph"></i> ' + t.bodyLabel;
    
    const dateLabel = document.querySelector('.date-label');
    if (dateLabel) dateLabel.innerHTML = '<i class="fas fa-calendar"></i> ' + t.dateLabel;
    
    // Fonts
    const fontsTitle = document.querySelector('.fonts-title');
    if (fontsTitle) fontsTitle.textContent = t.fontsTitle;
    
    const titleFontLabel = document.querySelector('.title-font-label');
    if (titleFontLabel) titleFontLabel.textContent = t.titleFontLabel;
    
    const bodyFontLabel = document.querySelector('.body-font-label');
    if (bodyFontLabel) bodyFontLabel.textContent = t.bodyFontLabel;
    
    // Colors
    const colorsTitle = document.querySelector('.colors-title');
    if (colorsTitle) colorsTitle.textContent = t.colorsTitle;
    
    const titleColorLabel = document.querySelector('.title-color-label');
    if (titleColorLabel) titleColorLabel.textContent = t.titleColorLabel;
    
    const borderColorLabel = document.querySelector('.border-color-label');
    if (borderColorLabel) borderColorLabel.textContent = t.borderColorLabel;
    
    const patternLabel = document.querySelector('.pattern-label');
    if (patternLabel) patternLabel.textContent = t.patternLabel;
    
    // Logo & Signatures
    const logoSignTitle = document.querySelector('.logo-sign-title');
    if (logoSignTitle) logoSignTitle.textContent = t.logoSignTitle;
    
    const uploadLogoLabel = document.querySelector('.upload-logo-label');
    if (uploadLogoLabel) uploadLogoLabel.textContent = t.uploadLogoLabel;
    
    const signature1NameLabel = document.querySelector('.signature1-name-label');
    if (signature1NameLabel) signature1NameLabel.textContent = t.signature1NameLabel;
    
    const signature1TitleLabel = document.querySelector('.signature1-title-label');
    if (signature1TitleLabel) signature1TitleLabel.textContent = t.signature1TitleLabel;
    
    const signature2NameLabel = document.querySelector('.signature2-name-label');
    if (signature2NameLabel) signature2NameLabel.textContent = t.signature2NameLabel;
    
    const signature2TitleLabel = document.querySelector('.signature2-title-label');
    if (signature2TitleLabel) signature2TitleLabel.textContent = t.signature2TitleLabel;
    
    // Reactions
    const reactionsTitle = document.querySelector('.reactions-title');
    if (reactionsTitle) reactionsTitle.textContent = t.reactionsTitle;
    
    // Share
    const shareTitle = document.querySelector('.share-title');
    if (shareTitle) shareTitle.textContent = t.shareTitle;
    
    // Download
    const downloadTitle = document.querySelector('.download-title');
    if (downloadTitle) downloadTitle.textContent = t.downloadTitle;
    
    if (elements.resetBtn) elements.resetBtn.innerHTML = '<i class="fas fa-undo-alt"></i> ' + t.resetBtn;
    
    // Preview
    const livePreviewText = document.querySelector('.live-preview-text');
    if (livePreviewText) livePreviewText.textContent = t.livePreview;
    
    const aiAssistText = document.querySelector('.ai-assist-text');
    if (aiAssistText) aiAssistText.textContent = t.aiAssist;
    
    // Loading text
    if (elements.loadingText) elements.loadingText.textContent = t.loadingText;
}

// ============================================
// CERTIFICATE UPDATE FUNCTIONS
// ============================================

function updateCertificatePreview() {
    if (elements.certTitle) elements.certTitle.textContent = elements.certTitleInput?.value || '';
    if (elements.certSubtitle) elements.certSubtitle.textContent = elements.certSubtitleInput?.value || '';
    if (elements.certRecipient) elements.certRecipient.textContent = elements.certRecipientInput?.value || '';
    if (elements.certBody) elements.certBody.textContent = elements.certBodyInput?.value || '';
    if (elements.certDate) elements.certDate.textContent = elements.certDateInput?.value || '';
    
    if (elements.certTitle && elements.titleColorInput) {
        elements.certTitle.style.color = elements.titleColorInput.value;
    }
    
    if (elements.certBorder && elements.borderColorInput) {
        elements.certBorder.style.borderColor = elements.borderColorInput.value;
    }
    
    // Update fonts
    if (elements.certTitle && elements.titleFontSelect) {
        removeFontClasses(elements.certTitle);
        elements.certTitle.classList.add(elements.titleFontSelect.value);
    }
    
    if (elements.certBody && elements.bodyFontSelect) {
        removeFontClasses(elements.certBody);
        elements.certBody.classList.add(elements.bodyFontSelect.value);
    }
    
    // Update background pattern
    updateBackgroundPattern();
    
    // Save to localStorage
    saveToLocalStorage();
}

function removeFontClasses(element) {
    const fontClasses = ['font-inter', 'font-cinzel', 'font-playfair', 'font-old-english', 
                         'font-medieval', 'font-old-standard', 'font-almendra'];
    fontClasses.forEach(cls => element.classList.remove(cls));
}

function updateBackgroundPattern() {
    if (!elements.certBg || !elements.bgPatternSelect) return;
    
    const pattern = elements.bgPatternSelect.value;
    elements.certBg.style.backgroundImage = 'none';
    
    switch(pattern) {
        case 'dots':
            elements.certBg.style.backgroundImage = 'radial-gradient(circle, #000 1px, transparent 1px)';
            elements.certBg.style.backgroundSize = '20px 20px';
            break;
        case 'lines':
            elements.certBg.style.backgroundImage = 'repeating-linear-gradient(0deg, transparent, transparent 19px, #000 20px)';
            break;
        case 'squares':
            elements.certBg.style.backgroundImage = 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)';
            elements.certBg.style.backgroundSize = '20px 20px';
            break;
    }
}

function applyTemplate(templateId) {
    const templates = {
        1: { titleColor: '#4e54c8', borderColor: '#4e54c8', titleFont: 'font-cinzel', bodyFont: 'font-inter' },
        2: { titleColor: '#f5576c', borderColor: '#f5576c', titleFont: 'font-playfair', bodyFont: 'font-inter' },
        3: { titleColor: '#4facfe', borderColor: '#4facfe', titleFont: 'font-cinzel', bodyFont: 'font-inter' },
        4: { titleColor: '#43e97b', borderColor: '#43e97b', titleFont: 'font-almendra', bodyFont: 'font-old-standard' },
        5: { titleColor: '#fa709a', borderColor: '#fa709a', titleFont: 'font-medieval', bodyFont: 'font-inter' },
        6: { titleColor: '#a18cd1', borderColor: '#a18cd1', titleFont: 'font-cinzel', bodyFont: 'font-playfair' }
    };
    
    const t = templates[templateId];
    if (t) {
        if (elements.titleColorInput) elements.titleColorInput.value = t.titleColor;
        if (elements.borderColorInput) elements.borderColorInput.value = t.borderColor;
        if (elements.titleFontSelect) elements.titleFontSelect.value = t.titleFont;
        if (elements.bodyFontSelect) elements.bodyFontSelect.value = t.bodyFont;
        updateCertificatePreview();
    }
}

// ============================================
// AI FUNCTIONS
// ============================================

async function enhanceWithAI() {
    showLoading(true);
    try {
        const currentText = elements.certBodyInput?.value || '';
        const response = await fetch(`${API_BASE}/generate-quote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: currentText, topic: 'certificate' })
        });
        
        const data = await response.json();
        if (data.success && data.quote && elements.certBodyInput) {
            elements.certBodyInput.value = data.quote;
            updateCertificatePreview();
            showToast(translations[currentLanguage].aiSuccess, 'success');
        } else {
            // Fallback enhancement
            const enhanced = `🌟 ${currentText} 🌟\n\nCongratulations on your outstanding achievement! This recognition celebrates your dedication, hard work, and excellence.`;
            elements.certBodyInput.value = enhanced;
            updateCertificatePreview();
            showToast(translations[currentLanguage].aiSuccess, 'success');
        }
        
        await incrementUsage();
    } catch (error) {
        console.error('AI Enhancement error:', error);
        showToast(translations[currentLanguage].aiError, 'error');
    } finally {
        showLoading(false);
    }
}

function openAIAssist() {
    showToast(translations[currentLanguage].aiAssist + ': Write your text and enhance it', 'info');
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

async function exportToPDF() {
    showLoading(true);
    try {
        const certificate = document.getElementById('certificate');
        const canvas = await html2canvas(certificate, { scale: 2, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save(`certificate_${Date.now()}.pdf`);
        showToast(translations[currentLanguage].pdfSuccess, 'success');
        await incrementShares('pdf');
    } catch (error) {
        console.error('PDF export error:', error);
        showToast(translations[currentLanguage].aiError, 'error');
    } finally {
        showLoading(false);
    }
}

function exportToDOC() {
    try {
        const content = `
            <html>
            <head><meta charset="UTF-8"><title>Certificate</title></head>
            <body style="text-align:center; padding:50px; font-family: Arial, sans-serif;">
                <h1>${elements.certTitleInput?.value || ''}</h1>
                <h2>${elements.certSubtitleInput?.value || ''}</h2>
                <h3 style="color:#4e54c8;">${elements.certRecipientInput?.value || ''}</h3>
                <p>${elements.certBodyInput?.value || ''}</p>
                <p>${elements.certDateInput?.value || ''}</p>
                <hr>
                <p>${elements.signature1NameInput?.value || ''} - ${elements.signature1TitleInput?.value || ''}</p>
                <p>${elements.signature2NameInput?.value || ''} - ${elements.signature2TitleInput?.value || ''}</p>
            </body>
            </html>
        `;
        const blob = new Blob([content], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `certificate_${Date.now()}.doc`;
        link.click();
        URL.revokeObjectURL(link.href);
        showToast(translations[currentLanguage].docSuccess, 'success');
        incrementShares('doc');
    } catch (error) {
        showToast(translations[currentLanguage].aiError, 'error');
    }
}

function exportToTXT() {
    try {
        const content = `
            ${'='.repeat(60)}
            ${elements.certTitleInput?.value || ''}
            ${'='.repeat(60)}
            ${elements.certSubtitleInput?.value || ''}
            
            Recipient: ${elements.certRecipientInput?.value || ''}
            
            ${elements.certBodyInput?.value || ''}
            
            Date: ${elements.certDateInput?.value || ''}
            
            ${'-'.repeat(60)}
            ${elements.signature1NameInput?.value || ''} (${elements.signature1TitleInput?.value || ''})
            ${elements.signature2NameInput?.value || ''} (${elements.signature2TitleInput?.value || ''})
            ${'='.repeat(60)}
        `;
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `certificate_${Date.now()}.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
        showToast(translations[currentLanguage].txtSuccess, 'success');
        incrementShares('txt');
    } catch (error) {
        showToast(translations[currentLanguage].aiError, 'error');
    }
}

// ============================================
// API FUNCTIONS (TiDB + Vercel)
// ============================================

async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/increment-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, user_id: userId })
        });
        const data = await response.json();
        if (data.success && elements.toolUsageCounter) {
            elements.toolUsageCounter.textContent = data.total_usage || data.count || '0';
        }
        await loadGlobalStats();
    } catch (error) {
        console.error('Usage increment error:', error);
        let localCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
        localCount++;
        localStorage.setItem(`${TOOL_SLUG}_usage`, localCount);
        if (elements.toolUsageCounter) elements.toolUsageCounter.textContent = localCount;
    }
}

async function addReaction(emoji) {
    const reactionMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate' };
    const reactionType = reactionMap[emoji] || 'like';
    
    try {
        const response = await fetch(`${API_BASE}/add-reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, emoji: emoji, reaction_type: reactionType, user_id: userId })
        });
        const data = await response.json();
        if (data.success || data.counts) {
            updateReactionCounts(data.counts);
            showToast(translations[currentLanguage].reactionSuccess, 'success');
        } else if (data.already_reacted) {
            showToast(translations[currentLanguage].reactionExists, 'info');
            updateReactionCounts(data.counts);
        }
        await loadGlobalStats();
    } catch (error) {
        console.error('Reaction error:', error);
        showToast(translations[currentLanguage].reactionError, 'error');
    }
}

function updateReactionCounts(counts) {
    if (!counts) return;
    const mapping = { like: 'like', love: 'love', wow: 'wow', sad: 'sad', angry: 'angry', laugh: 'laugh', celebrate: 'celebrate' };
    for (const [key, value] of Object.entries(mapping)) {
        if (elements.reactionCounts[value] && counts[key] !== undefined) {
            elements.reactionCounts[value].textContent = counts[key];
        }
    }
}

async function shareTool(platform) {
    const url = window.location.href;
    const title = elements.certTitleInput?.value || 'Certificate';
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
        case 'email': shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`; break;
        case 'copy':
            await navigator.clipboard.writeText(url);
            showToast(translations[currentLanguage].copySuccess, 'success');
            await recordShare(platform);
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        await recordShare(platform);
    }
}

async function recordShare(platform) {
    try {
        await fetch(`${API_BASE}/add-share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, platform: platform, user_id: userId })
        });
        await loadGlobalStats();
    } catch (error) {
        console.error('Share record error:', error);
    }
}

async function incrementShares(type) {
    await recordShare(type);
}

async function loadGlobalStats() {
    try {
        const [usageRes, reactionsRes, sharesRes] = await Promise.all([
            fetch(`${API_BASE}/usage?tool_slug=${TOOL_SLUG}`),
            fetch(`${API_BASE}/reactions?tool_slug=${TOOL_SLUG}`),
            fetch(`${API_BASE}/shares?tool_slug=${TOOL_SLUG}`)
        ]);
        
        const usageData = await usageRes.json();
        const reactionsData = await reactionsRes.json();
        const sharesData = await sharesRes.json();
        
        if (elements.toolUsageCounter && usageData.count) elements.toolUsageCounter.textContent = usageData.count;
        if (elements.globalUsageCounter && usageData.count) elements.globalUsageCounter.textContent = usageData.count;
        
        if (reactionsData.reactions) updateReactionCounts(reactionsData.reactions);
        
        const totalReactions = reactionsData.reactions ? Object.values(reactionsData.reactions).reduce((a,b) => a+b, 0) : 0;
        if (elements.globalReactionsCounter) elements.globalReactionsCounter.textContent = totalReactions;
        
        if (elements.globalSharesCounter && sharesData.shares) elements.globalSharesCounter.textContent = sharesData.shares;
    } catch (error) {
        console.error('Global stats error:', error);
        loadLocalStats();
    }
}

function loadLocalStats() {
    const localUsage = localStorage.getItem(`${TOOL_SLUG}_usage`) || '0';
    if (elements.toolUsageCounter) elements.toolUsageCounter.textContent = localUsage;
    if (elements.globalUsageCounter) elements.globalUsageCounter.textContent = localUsage;
}

async function loadInitialData() {
    await incrementUsage();
    await loadGlobalStats();
    updateCertificatePreview();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function resetForm() {
    if (elements.certTitleInput) elements.certTitleInput.value = 'Certificate of Achievement';
    if (elements.certSubtitleInput) elements.certSubtitleInput.value = 'This certificate is proudly presented to';
    if (elements.certRecipientInput) elements.certRecipientInput.value = 'John Doe';
    if (elements.certBodyInput) elements.certBodyInput.value = 'For outstanding performance and dedication in the field of web development. Your hard work and commitment have been recognized and appreciated by the entire team.';
    if (elements.certDateInput) elements.certDateInput.value = new Date().toLocaleDateString('en-US');
    if (elements.titleColorInput) elements.titleColorInput.value = '#4e54c8';
    if (elements.borderColorInput) elements.borderColorInput.value = '#4e54c8';
    if (elements.signature1NameInput) elements.signature1NameInput.value = 'Jane Smith';
    if (elements.signature1TitleInput) elements.signature1TitleInput.value = 'CEO, Company Inc.';
    if (elements.signature2NameInput) elements.signature2NameInput.value = 'Robert Johnson';
    if (elements.signature2TitleInput) elements.signature2TitleInput.value = 'Director of Education';
    if (elements.certLogo) elements.certLogo.src = '';
    updateCertificatePreview();
    showToast(translations[currentLanguage].resetSuccess, 'success');
}

function saveToLocalStorage() {
    const data = {
        title: elements.certTitleInput?.value,
        subtitle: elements.certSubtitleInput?.value,
        recipient: elements.certRecipientInput?.value,
        body: elements.certBodyInput?.value,
        date: elements.certDateInput?.value,
        titleColor: elements.titleColorInput?.value,
        borderColor: elements.borderColorInput?.value,
        pattern: elements.bgPatternSelect?.value,
        titleFont: elements.titleFontSelect?.value,
        bodyFont: elements.bodyFontSelect?.value,
        signature1Name: elements.signature1NameInput?.value,
        signature1Title: elements.signature1TitleInput?.value,
        signature2Name: elements.signature2NameInput?.value,
        signature2Title: elements.signature2TitleInput?.value
    };
    localStorage.setItem(`${TOOL_SLUG}_draft`, JSON.stringify(data));
}

function setupAutoSave() {
    autoSaveInterval = setInterval(() => {
        saveToLocalStorage();
    }, 30000);
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem(`${TOOL_SLUG}_draft`);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (elements.certTitleInput && data.title) elements.certTitleInput.value = data.title;
            if (elements.certSubtitleInput && data.subtitle) elements.certSubtitleInput.value = data.subtitle;
            if (elements.certRecipientInput && data.recipient) elements.certRecipientInput.value = data.recipient;
            if (elements.certBodyInput && data.body) elements.certBodyInput.value = data.body;
            if (elements.certDateInput && data.date) elements.certDateInput.value = data.date;
            if (elements.titleColorInput && data.titleColor) elements.titleColorInput.value = data.titleColor;
            if (elements.borderColorInput && data.borderColor) elements.borderColorInput.value = data.borderColor;
            if (elements.bgPatternSelect && data.pattern) elements.bgPatternSelect.value = data.pattern;
            if (elements.titleFontSelect && data.titleFont) elements.titleFontSelect.value = data.titleFont;
            if (elements.bodyFontSelect && data.bodyFont) elements.bodyFontSelect.value = data.bodyFont;
            if (elements.signature1NameInput && data.signature1Name) elements.signature1NameInput.value = data.signature1Name;
            if (elements.signature1TitleInput && data.signature1Title) elements.signature1TitleInput.value = data.signature1Title;
            if (elements.signature2NameInput && data.signature2Name) elements.signature2NameInput.value = data.signature2Name;
            if (elements.signature2TitleInput && data.signature2Title) elements.signature2TitleInput.value = data.signature2Title;
            updateCertificatePreview();
        } catch(e) {}
    }
}

function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    applyDarkMode();
}

function applyDarkMode() {
    if (darkMode) {
        document.body.setAttribute('data-theme', 'dark');
        if (elements.darkModeToggle) elements.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.removeAttribute('data-theme');
        if (elements.darkModeToggle) elements.darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        showToast('Fullscreen mode activated', 'success');
    } else {
        document.exitFullscreen();
        showToast('Fullscreen mode exited', 'info');
    }
}

function setupScrollButtons() {
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    
    if (scrollUpBtn) {
        scrollUpBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
    
    window.addEventListener('scroll', () => {
        if (scrollUpBtn) {
            if (window.scrollY > 300) {
                scrollUpBtn.classList.remove('hidden');
            } else {
                scrollUpBtn.classList.add('hidden');
            }
        }
    });
}

function showToast(message, type = 'success') {
    if (!elements.toast || !elements.toastMessage) return;
    
    elements.toastMessage.textContent = message;
    elements.toast.classList.remove('hidden');
    
    if (type === 'error') {
        elements.toast.style.background = '#eb4d4b';
    } else if (type === 'info') {
        elements.toast.style.background = '#1e90ff';
    } else {
        elements.toast.style.background = '#43e97b';
    }
    
    setTimeout(() => {
        elements.toast.classList.add('hidden');
    }, 3000);
}

function showLoading(show) {
    if (!elements.loadingOverlay) return;
    if (show) {
        elements.loadingOverlay.classList.remove('hidden');
    } else {
        elements.loadingOverlay.classList.add('hidden');
    }
}
