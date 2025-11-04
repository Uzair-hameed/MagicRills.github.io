// Main JavaScript for Advanced Quotation Poster Generator

class PosterGenerator {
    constructor() {
        this.currentDesign = {
            textColor: '#2c3e50',
            authorColor: '#666666',
            bgColor: '#ffffff',
            fontFamily: 'Arial',
            quoteFontSize: '32px',
            authorFontSize: '18px',
            lineHeight: 1.4,
            textShadow: false,
            textGlow: false,
            gradientText: false,
            textOutline: false,
            letterSpacing: false,
            textRotation: false,
            shadowColor: '#000000',
            gradientStart: '#667eea',
            gradientEnd: '#764ba2',
            layout: 'centered',
            showHeader: false,
            headerText: '',
            headerColor: '#3498db',
            showBorder: false,
            borderColor: '#3498db',
            borderStyle: 'solid',
            borderWidth: '2px',
            backgroundType: 'color',
            gradientDirection: 'to right',
            bgSize: 'cover',
            bgPosition: 'center',
            authorImage: null,
            quote: '"Your inspirational quote will appear here"',
            author: '- Author Name'
        };
        
        this.savedDesigns = JSON.parse(localStorage.getItem('savedDesigns')) || [];
        this.favoriteQuotes = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
        this.theme = localStorage.getItem('theme') || 'light';
        this.exportSettings = { quality: 1, size: 'original' };
        this.zoomLevel = 1;
        this.rotation = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.populateCategories();
        this.populateTemplates();
        this.updatePreview();
        this.loadFavoriteQuotes();
        this.setupAdvancedControls();
    }

    setupEventListeners() {
        // Theme Toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Platform Integration
        document.querySelectorAll('.platform-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePlatformIntegration(e.currentTarget.dataset.platform));
        });

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target));
        });

        // Background Tabs
        document.querySelectorAll('.bg-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchBackgroundTab(e.target));
        });

        // Quote Controls
        document.getElementById('quote-category').addEventListener('change', (e) => this.loadQuotes(e.target.value));
        document.getElementById('quote-select').addEventListener('change', (e) => this.selectQuote(e.target.value));
        document.getElementById('add-to-favorites').addEventListener('click', () => this.addToFavorites());

        // Custom Quote
        document.getElementById('custom-quote').addEventListener('input', (e) => this.updateCustomQuote(e.target.value));
        document.getElementById('custom-author').addEventListener('input', (e) => this.updateCustomAuthor(e.target.value));
        document.getElementById('author-image').addEventListener('change', (e) => this.handleAuthorImageUpload(e));

        // Layout
        document.querySelectorAll('.layout-option').forEach(item => {
            item.addEventListener('click', (e) => this.selectLayout(e.currentTarget));
        });

        // Text Controls
        document.getElementById('font-family').addEventListener('change', (e) => this.updateFontFamily(e.target.value));
        document.getElementById('quote-font-size').addEventListener('input', (e) => this.updateQuoteFontSize(e.target.value));
        document.getElementById('author-font-size').addEventListener('input', (e) => this.updateAuthorFontSize(e.target.value));
        document.getElementById('line-height').addEventListener('input', (e) => this.updateLineHeight(e.target.value));

        // Colors
        document.getElementById('text-color').addEventListener('input', (e) => this.updateTextColor(e.target.value));
        document.getElementById('author-color').addEventListener('input', (e) => this.updateAuthorColor(e.target.value));
        document.getElementById('shadow-color').addEventListener('input', (e) => this.updateShadowColor(e.target.value));
        document.getElementById('gradient-start').addEventListener('input', (e) => this.updateGradientStart(e.target.value));
        document.getElementById('gradient-end').addEventListener('input', (e) => this.updateGradientEnd(e.target.value));

        // Background
        document.getElementById('bg-color').addEventListener('input', (e) => this.updateBackgroundColor(e.target.value));
        document.getElementById('gradient-color-1').addEventListener('input', (e) => this.updateGradientColor1(e.target.value));
        document.getElementById('gradient-color-2').addEventListener('input', (e) => this.updateGradientColor2(e.target.value));
        document.getElementById('gradient-direction').addEventListener('change', (e) => this.updateGradientDirection(e.target.value));
        document.getElementById('bg-image').addEventListener('change', (e) => this.handleBackgroundImageUpload(e));
        document.getElementById('bg-size').addEventListener('change', (e) => this.updateBackgroundSize(e.target.value));
        document.getElementById('bg-position').addEventListener('change', (e) => this.updateBackgroundPosition(e.target.value));

        // Patterns
        document.querySelectorAll('.pattern-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectPattern(e.currentTarget));
        });

        // Header & Border
        document.getElementById('show-header').addEventListener('change', (e) => this.toggleHeader(e.target.checked));
        document.getElementById('header-text').addEventListener('input', (e) => this.updateHeaderText(e.target.value));
        document.getElementById('header-color').addEventListener('input', (e) => this.updateHeaderColor(e.target.value));
        document.getElementById('show-border').addEventListener('change', (e) => this.toggleBorder(e.target.checked));
        document.getElementById('border-color').addEventListener('input', (e) => this.updateBorderColor(e.target.value));
        document.getElementById('border-style').addEventListener('change', (e) => this.updateBorderStyle(e.target.value));
        document.getElementById('border-width').addEventListener('input', (e) => this.updateBorderWidth(e.target.value));

        // Effects
        document.getElementById('text-shadow').addEventListener('change', (e) => this.toggleTextShadow(e.target.checked));
        document.getElementById('text-glow').addEventListener('change', (e) => this.toggleTextGlow(e.target.checked));
        document.getElementById('gradient-text').addEventListener('change', (e) => this.toggleGradientText(e.target.checked));
        document.getElementById('text-outline').addEventListener('change', (e) => this.toggleTextOutline(e.target.checked));
        document.getElementById('letter-spacing').addEventListener('change', (e) => this.toggleLetterSpacing(e.target.checked));
        document.getElementById('text-rotation').addEventListener('change', (e) => this.toggleTextRotation(e.target.checked));

        // Preview Actions
        document.getElementById('zoom-in').addEventListener('click', () => this.zoomPreview(0.1));
        document.getElementById('zoom-out').addEventListener('click', () => this.zoomPreview(-0.1));
        document.getElementById('rotate-preview').addEventListener('click', () => this.rotatePreview());
        document.getElementById('reset-preview').addEventListener('click', () => this.resetPreview());

        // Export
        document.getElementById('export-quality').addEventListener('change', (e) => this.updateExportQuality(e.target.value));
        document.getElementById('export-size').addEventListener('change', (e) => this.updateExportSize(e.target.value));
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.downloadPoster(e.currentTarget.dataset.format));
        });

        // Save & View
        document.getElementById('save-design').addEventListener('click', () => this.saveDesign());
        document.getElementById('view-saved').addEventListener('click', () => this.showSavedDesigns());
        document.getElementById('export-preset').addEventListener('click', () => this.exportPreset());

        // Modal
        document.querySelector('.close-modal').addEventListener('click', () => this.hideModal());
        document.getElementById('saved-modal').addEventListener('click', (e) => {
            if (e.target.id === 'saved-modal') this.hideModal();
        });

        // Categories
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => this.selectCategory(e.currentTarget));
        });
    }

    // Platform Integration
    handlePlatformIntegration(platform) {
        switch(platform) {
            case 'canva':
                this.openInCanva();
                break;
            case 'figma':
                this.exportToFigma();
                break;
            case 'adobe':
                this.openInAdobe();
                break;
            case 'google':
                this.saveToDrive();
                break;
        }
    }

    openInCanva() {
        // Simulate Canva integration
        this.showToast('Opening in Canva...', 'info');
        setTimeout(() => {
            // In a real implementation, this would open Canva with the design
            const designData = this.prepareDesignForExport();
            console.log('Opening Canva with design:', designData);
            this.showToast('Redirecting to Canva Design Editor', 'success');
            
            // Simulate Canva API call
            // window.open(`https://canva.com/create?designData=${encodeURIComponent(JSON.stringify(designData))}`, '_blank');
        }, 1000);
    }

    exportToFigma() {
        this.showToast('Preparing Figma export...', 'info');
        // Figma export logic would go here
        setTimeout(() => {
            this.showToast('Design exported to Figma format', 'success');
        }, 1500);
    }

    openInAdobe() {
        this.showToast('Opening in Adobe Express...', 'info');
        // Adobe Express integration
        setTimeout(() => {
            this.showToast('Adobe Express editor opened', 'success');
        }, 1500);
    }

    saveToDrive() {
        this.showToast('Saving to Google Drive...', 'info');
        // Google Drive integration
        setTimeout(() => {
            this.showToast('Design saved to Google Drive', 'success');
        }, 1500);
    }

    prepareDesignForExport() {
        return {
            quote: this.currentDesign.quote,
            author: this.currentDesign.author,
            styles: {
                textColor: this.currentDesign.textColor,
                authorColor: this.currentDesign.authorColor,
                backgroundColor: this.currentDesign.bgColor,
                fontFamily: this.currentDesign.fontFamily,
                fontSize: this.currentDesign.quoteFontSize,
                layout: this.currentDesign.layout
            },
            timestamp: new Date().toISOString()
        };
    }

    // Tab Management
    switchTab(clickedTab) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab
        clickedTab.classList.add('active');
        
        // Show corresponding content
        const tabId = clickedTab.dataset.tab + '-tab';
        document.getElementById(tabId).classList.add('active');
    }

    switchBackgroundTab(clickedTab) {
        document.querySelectorAll('.bg-tab-btn').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.bg-tab-content').forEach(content => content.classList.remove('active'));
        
        clickedTab.classList.add('active');
        const tabId = clickedTab.dataset.bg + '-tab';
        document.getElementById(tabId).classList.add('active');
        
        this.currentDesign.backgroundType = clickedTab.dataset.bg;
        this.updatePreview();
    }

    // Theme Management
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        const themeBtn = document.getElementById('theme-toggle');
        const icon = themeBtn.querySelector('i');
        const text = themeBtn.querySelector('span');
        
        if (this.theme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark Mode';
        }
    }

    loadTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeBtn = document.getElementById('theme-toggle');
        const icon = themeBtn.querySelector('i');
        const text = themeBtn.querySelector('span');
        
        if (this.theme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light Mode';
        }
    }

    // Quote Management
    populateCategories() {
        const categories = [
            'Motivation', 'Love', 'Education', 'Success', 'Life', 
            'Wisdom', 'Friendship', 'Inspiration', 'Business', 'Creativity'
        ];
        
        const categorySelect = document.getElementById('quote-category');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.toLowerCase();
            option.textContent = category;
            categorySelect.appendChild(option);
        });
        
        // Also populate categories grid
        const categoriesGrid = document.querySelector('.categories-grid');
        categories.forEach(category => {
            const item = document.createElement('div');
            item.className = 'category-item';
            item.textContent = category;
            item.dataset.category = category.toLowerCase();
            categoriesGrid.appendChild(item);
        });
    }

    loadQuotes(category) {
        const quotes = {
            motivation: [
                { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
            ],
            love: [
                { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
                { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" }
            ],
            education: [
                { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
                { text: "The function of education is to teach one to think intensively and critically.", author: "Martin Luther King Jr." }
            ]
        };
        
        const quoteSelect = document.getElementById('quote-select');
        quoteSelect.innerHTML = '<option value="">Select Quote</option>';
        
        if (quotes[category]) {
            quotes[category].forEach((quote, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${quote.text} - ${quote.author}`;
                option.dataset.quote = quote.text;
                option.dataset.author = quote.author;
                quoteSelect.appendChild(option);
            });
        }
    }

    selectQuote(quoteIndex) {
        const quoteSelect = document.getElementById('quote-select');
        const selectedOption = quoteSelect.options[quoteSelect.selectedIndex];
        
        if (selectedOption.dataset.quote) {
            this.currentDesign.quote = `"${selectedOption.dataset.quote}"`;
            this.currentDesign.author = `- ${selectedOption.dataset.author}`;
            this.updatePreview();
        }
    }

    updateCustomQuote(quote) {
        this.currentDesign.quote = `"${quote}"`;
        this.updatePreview();
    }

    updateCustomAuthor(author) {
        this.currentDesign.author = `- ${author}`;
        this.updatePreview();
    }

    // Design Customization
    selectLayout(layoutOption) {
        document.querySelectorAll('.layout-option').forEach(option => option.classList.remove('active'));
        layoutOption.classList.add('active');
        this.currentDesign.layout = layoutOption.dataset.layout;
        this.updatePreview();
    }

    updateFontFamily(font) {
        this.currentDesign.fontFamily = font;
        this.updatePreview();
    }

    updateQuoteFontSize(size) {
        this.currentDesign.quoteFontSize = `${size}px`;
        document.getElementById('quote-size-value').textContent = `${size}px`;
        this.updatePreview();
    }

    updateAuthorFontSize(size) {
        this.currentDesign.authorFontSize = `${size}px`;
        document.getElementById('author-size-value').textContent = `${size}px`;
        this.updatePreview();
    }

    updateLineHeight(height) {
        this.currentDesign.lineHeight = height;
        document.getElementById('line-height-value').textContent = height;
        this.updatePreview();
    }

    // Color Management
    updateTextColor(color) {
        this.currentDesign.textColor = color;
        this.updatePreview();
    }

    updateAuthorColor(color) {
        this.currentDesign.authorColor = color;
        this.updatePreview();
    }

    updateShadowColor(color) {
        this.currentDesign.shadowColor = color;
        this.updatePreview();
    }

    updateGradientStart(color) {
        this.currentDesign.gradientStart = color;
        this.updatePreview();
    }

    updateGradientEnd(color) {
        this.currentDesign.gradientEnd = color;
        this.updatePreview();
    }

    // Background Management
    updateBackgroundColor(color) {
        this.currentDesign.bgColor = color;
        this.updatePreview();
    }

    updateGradientColor1(color) {
        this.currentDesign.gradientStart = color;
        this.updatePreview();
    }

    updateGradientColor2(color) {
        this.currentDesign.gradientEnd = color;
        this.updatePreview();
    }

    updateGradientDirection(direction) {
        this.currentDesign.gradientDirection = direction;
        this.updatePreview();
    }

    updateBackgroundSize(size) {
        this.currentDesign.bgSize = size;
        this.updatePreview();
    }

    updateBackgroundPosition(position) {
        this.currentDesign.bgPosition = position;
        this.updatePreview();
    }

    selectPattern(patternOption) {
        const pattern = patternOption.dataset.pattern;
        this.currentDesign.backgroundType = 'pattern';
        this.currentDesign.pattern = pattern;
        this.updatePreview();
    }

    // Header & Border
    toggleHeader(show) {
        this.currentDesign.showHeader = show;
        this.updatePreview();
    }

    updateHeaderText(text) {
        this.currentDesign.headerText = text;
        this.updatePreview();
    }

    updateHeaderColor(color) {
        this.currentDesign.headerColor = color;
        this.updatePreview();
    }

    toggleBorder(show) {
        this.currentDesign.showBorder = show;
        this.updatePreview();
    }

    updateBorderColor(color) {
        this.currentDesign.borderColor = color;
        this.updatePreview();
    }

    updateBorderStyle(style) {
        this.currentDesign.borderStyle = style;
        this.updatePreview();
    }

    updateBorderWidth(width) {
        this.currentDesign.borderWidth = `${width}px`;
        document.getElementById('border-width-value').textContent = `${width}px`;
        this.updatePreview();
    }

    // Effects
    toggleTextShadow(enable) {
        this.currentDesign.textShadow = enable;
        this.updatePreview();
    }

    toggleTextGlow(enable) {
        this.currentDesign.textGlow = enable;
        this.updatePreview();
    }

    toggleGradientText(enable) {
        this.currentDesign.gradientText = enable;
        this.updatePreview();
    }

    toggleTextOutline(enable) {
        this.currentDesign.textOutline = enable;
        this.updatePreview();
    }

    toggleLetterSpacing(enable) {
        this.currentDesign.letterSpacing = enable;
        this.updatePreview();
    }

    toggleTextRotation(enable) {
        this.currentDesign.textRotation = enable;
        this.updatePreview();
    }

    // Preview Management
    updatePreview() {
        const preview = document.getElementById('poster-preview');
        const quote = document.getElementById('preview-quote');
        const author = document.getElementById('preview-author');
        const header = document.getElementById('poster-header');
        const border = document.getElementById('poster-border');
        const authorImg = document.getElementById('preview-author-image');

        // Apply text styles
        quote.textContent = this.currentDesign.quote;
        quote.style.fontFamily = this.currentDesign.fontFamily;
        quote.style.fontSize = this.currentDesign.quoteFontSize;
        quote.style.color = this.currentDesign.textColor;
        quote.style.lineHeight = this.currentDesign.lineHeight;

        author.textContent = this.currentDesign.author;
        author.style.fontSize = this.currentDesign.authorFontSize;
        author.style.color = this.currentDesign.authorColor;

        // Apply background
        if (this.currentDesign.backgroundType === 'color') {
            preview.style.background = this.currentDesign.bgColor;
            preview.style.backgroundImage = 'none';
        } else if (this.currentDesign.backgroundType === 'gradient') {
            preview.style.background = `linear-gradient(${this.currentDesign.gradientDirection}, ${this.currentDesign.gradientStart}, ${this.currentDesign.gradientEnd})`;
        } else if (this.currentDesign.backgroundType === 'pattern') {
            // Apply pattern background
            preview.style.background = this.getPatternBackground(this.currentDesign.pattern);
        }

        // Apply header
        header.style.display = this.currentDesign.showHeader ? 'block' : 'none';
        header.textContent = this.currentDesign.headerText;
        header.style.backgroundColor = this.currentDesign.headerColor;

        // Apply border
        border.style.display = this.currentDesign.showBorder ? 'block' : 'none';
        border.style.border = `${this.currentDesign.borderWidth} ${this.currentDesign.borderStyle} ${this.currentDesign.borderColor}`;

        // Apply effects
        this.applyTextEffects(quote);
    }

    getPatternBackground(pattern) {
        const patterns = {
            dots: 'radial-gradient(#000 20%, transparent 20%)',
            lines: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #000 5px, #000 10px)',
            squares: `linear-gradient(45deg, #000 25%, transparent 25%), 
                     linear-gradient(-45deg, #000 25%, transparent 25%), 
                     linear-gradient(45deg, transparent 75%, #000 75%), 
                     linear-gradient(-45deg, transparent 75%, #000 75%)`,
            zigzag: `linear-gradient(135deg, #000 25%, transparent 25%) -10px 0,
                    linear-gradient(225deg, #000 25%, transparent 25%) -10px 0,
                    linear-gradient(315deg, #000 25%, transparent 25%),
                    linear-gradient(45deg, #000 25%, transparent 25%)`
        };
        return patterns[pattern] || patterns.dots;
    }

    applyTextEffects(element) {
        // Reset all effects first
        element.style.textShadow = 'none';
        element.style.filter = 'none';
        element.style.backgroundImage = 'none';
        element.style.webkitBackgroundClip = 'none';
        element.style.webkitTextFillColor = '';
        element.style.letterSpacing = 'normal';
        element.style.transform = 'none';

        // Apply selected effects
        if (this.currentDesign.textShadow) {
            element.style.textShadow = `2px 2px 4px ${this.currentDesign.shadowColor}`;
        }
        
        if (this.currentDesign.textGlow) {
            element.style.textShadow = `0 0 10px ${this.currentDesign.shadowColor}, 0 0 20px ${this.currentDesign.shadowColor}`;
        }
        
        if (this.currentDesign.gradientText) {
            element.style.backgroundImage = `linear-gradient(135deg, ${this.currentDesign.gradientStart}, ${this.currentDesign.gradientEnd})`;
            element.style.webkitBackgroundClip = 'text';
            element.style.webkitTextFillColor = 'transparent';
        }
        
        if (this.currentDesign.letterSpacing) {
            element.style.letterSpacing = '2px';
        }
        
        if (this.currentDesign.textRotation) {
            element.style.transform = 'rotate(-2deg)';
        }
    }

    // File Handling
    handleAuthorImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const authorImg = document.getElementById('preview-author-image');
                authorImg.src = e.target.result;
                authorImg.classList.remove('hidden');
                this.currentDesign.authorImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    handleBackgroundImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('poster-preview');
                preview.style.backgroundImage = `url(${e.target.result})`;
                preview.style.backgroundSize = this.currentDesign.bgSize;
                preview.style.backgroundPosition = this.currentDesign.bgPosition;
                this.currentDesign.backgroundType = 'image';
                this.currentDesign.backgroundImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Preview Controls
    zoomPreview(delta) {
        this.zoomLevel = Math.max(0.5, Math.min(2, this.zoomLevel + delta));
        const preview = document.getElementById('poster-preview');
        preview.style.transform = `scale(${this.zoomLevel}) rotate(${this.rotation}deg)`;
    }

    rotatePreview() {
        this.rotation = (this.rotation + 90) % 360;
        const preview = document.getElementById('poster-preview');
        preview.style.transform = `scale(${this.zoomLevel}) rotate(${this.rotation}deg)`;
    }

    resetPreview() {
        this.zoomLevel = 1;
        this.rotation = 0;
        const preview = document.getElementById('poster-preview');
        preview.style.transform = 'scale(1) rotate(0deg)';
    }

    // Export Management
    updateExportQuality(quality) {
        this.exportSettings.quality = parseFloat(quality);
    }

    updateExportSize(size) {
        this.exportSettings.size = size;
    }

    async downloadPoster(format) {
        this.showToast(`Exporting as ${format.toUpperCase()}...`, 'info');
        
        try {
            const preview = document.getElementById('poster-preview');
            
            switch(format) {
                case 'png':
                case 'jpg':
                    await this.exportAsImage(format);
                    break;
                case 'pdf':
                    await this.exportAsPDF();
                    break;
                case 'svg':
                    this.exportAsSVG();
                    break;
                case 'share':
                    this.shareDesign();
                    break;
                case 'print':
                    this.printDesign();
                    break;
            }
        } catch (error) {
            this.showToast('Export failed: ' + error.message, 'error');
        }
    }

    async exportAsImage(format) {
        const preview = document.getElementById('poster-preview');
        
        const canvas = await html2canvas(preview, {
            scale: this.exportSettings.quality,
            backgroundColor: this.currentDesign.bgColor
        });
        
        const link = document.createElement('a');
        link.download = `quote-poster-${Date.now()}.${format}`;
        link.href = canvas.toDataURL(`image/${format}`, this.exportSettings.quality);
        link.click();
        
        this.showToast(`${format.toUpperCase()} exported successfully!`, 'success');
    }

    async exportAsPDF() {
        const { jsPDF } = window.jspdf;
        const preview = document.getElementById('poster-preview');
        
        const canvas = await html2canvas(preview, {
            scale: this.exportSettings.quality
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`quote-poster-${Date.now()}.pdf`);
        
        this.showToast('PDF exported successfully!', 'success');
    }

    exportAsSVG() {
        // Simplified SVG export - in a real implementation, this would be more complex
        this.showToast('SVG export feature coming soon!', 'info');
    }

    shareDesign() {
        if (navigator.share) {
            navigator.share({
                title: 'My Quote Poster',
                text: this.currentDesign.quote,
                url: window.location.href
            });
        } else {
            this.showToast('Web Share API not supported', 'warning');
        }
    }

    printDesign() {
        window.print();
    }

    // Save & Load
    saveDesign() {
        const design = {
            ...this.currentDesign,
            id: Date.now(),
            timestamp: new Date().toLocaleString()
        };
        
        this.savedDesigns.unshift(design);
        localStorage.setItem('savedDesigns', JSON.stringify(this.savedDesigns));
        this.showToast('Design saved successfully!', 'success');
    }

    showSavedDesigns() {
        const modal = document.getElementById('saved-modal');
        const grid = document.getElementById('saved-designs-grid');
        
        grid.innerHTML = '';
        
        this.savedDesigns.forEach(design => {
            const card = this.createDesignCard(design);
            grid.appendChild(card);
        });
        
        modal.style.display = 'block';
    }

    createDesignCard(design) {
        const card = document.createElement('div');
        card.className = 'design-card';
        
        card.innerHTML = `
            <div class="design-preview" style="background: ${design.bgColor}; color: ${design.textColor}; font-family: ${design.fontFamily}">
                <div class="design-quote">${design.quote.substring(0, 50)}...</div>
                <div class="design-author">${design.author}</div>
            </div>
            <div class="design-info">
                <div class="design-date">${design.timestamp}</div>
                <div class="design-actions">
                    <button class="load-design" data-id="${design.id}">Load</button>
                    <button class="delete-design" data-id="${design.id}">Delete</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        card.querySelector('.load-design').addEventListener('click', () => this.loadDesign(design.id));
        card.querySelector('.delete-design').addEventListener('click', () => this.deleteDesign(design.id));
        
        return card;
    }

    loadDesign(id) {
        const design = this.savedDesigns.find(d => d.id === id);
        if (design) {
            this.currentDesign = { ...design };
            this.updatePreview();
            this.hideModal();
            this.showToast('Design loaded successfully!', 'success');
        }
    }

    deleteDesign(id) {
        this.savedDesigns = this.savedDesigns.filter(d => d.id !== id);
        localStorage.setItem('savedDesigns', JSON.stringify(this.savedDesigns));
        this.showSavedDesigns();
        this.showToast('Design deleted!', 'success');
    }

    hideModal() {
        document.getElementById('saved-modal').style.display = 'none';
    }

    // Favorites
    addToFavorites() {
        const favorite = {
            quote: this.currentDesign.quote,
            author: this.currentDesign.author,
            timestamp: new Date().toLocaleString()
        };
        
        this.favoriteQuotes.unshift(favorite);
        localStorage.setItem('favoriteQuotes', JSON.stringify(this.favoriteQuotes));
        this.showToast('Added to favorites!', 'success');
        this.loadFavoriteQuotes();
    }

    loadFavoriteQuotes() {
        const favoritesList = document.getElementById('favorites-list');
        favoritesList.innerHTML = '';
        
        this.favoriteQuotes.forEach((fav, index) => {
            const favElement = document.createElement('div');
            favElement.className = 'favorite-quote';
            favElement.innerHTML = `
                <div class="quote-text">${fav.quote}</div>
                <div class="quote-author">${fav.author}</div>
                <button class="use-quote" data-index="${index}">Use This Quote</button>
            `;
            
            favElement.querySelector('.use-quote').addEventListener('click', () => {
                this.currentDesign.quote = fav.quote;
                this.currentDesign.author = fav.author;
                this.updatePreview();
                this.showToast('Quote applied!', 'success');
            });
            
            favoritesList.appendChild(favElement);
        });
    }

    // Preset Export
    exportPreset() {
        const preset = {
            design: this.currentDesign,
            exportSettings: this.exportSettings,
            version: '2.0'
        };
        
        const dataStr = JSON.stringify(preset, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', `quote-preset-${Date.now()}.json`);
        link.click();
        
        this.showToast('Preset exported successfully!', 'success');
    }

    // Template Management
    populateTemplates() {
        const templates = [
            { name: 'Modern', bg: '#667eea', text: '#ffffff' },
            { name: 'Classic', bg: '#2c3e50', text: '#ecf0f1' },
            { name: 'Elegant', bg: '#34495e', text: '#bdc3c7' },
            { name: 'Bright', bg: '#f39c12', text: '#2c3e50' },
            { name: 'Minimal', bg: '#ecf0f1', text: '#2c3e50' },
            { name: 'Dark', bg: '#2c3e50', text: '#ecf0f1' }
        ];
        
        const templateGrid = document.querySelector('.template-grid');
        templates.forEach(template => {
            const item = document.createElement('div');
            item.className = 'template-item';
            item.innerHTML = `
                <div class="template-preview" style="background: ${template.bg}; color: ${template.text}">Aa</div>
                <span>${template.name}</span>
            `;
            
            item.addEventListener('click', () => this.applyTemplate(template));
            templateGrid.appendChild(item);
        });
    }

    applyTemplate(template) {
        this.currentDesign.bgColor = template.bg;
        this.currentDesign.textColor = template.text;
        this.currentDesign.authorColor = template.text;
        this.updatePreview();
        this.showToast(`${template.name} template applied!`, 'success');
    }

    // Advanced Controls Setup
    setupAdvancedControls() {
        // Initialize slider values
        document.getElementById('quote-size-value').textContent = '32px';
        document.getElementById('author-size-value').textContent = '18px';
        document.getElementById('line-height-value').textContent = '1.4';
        document.getElementById('border-width-value').textContent = '2px';
    }

    // Utility Methods
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        toast.className = `toast ${type}`;
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    selectCategory(categoryItem) {
        const category = categoryItem.dataset.category;
        document.getElementById('quote-category').value = category;
        this.loadQuotes(category);
        this.switchTab(document.querySelector('[data-tab="library"]'));
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.posterGenerator = new PosterGenerator();
});