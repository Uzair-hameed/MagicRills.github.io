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
            authorImage: null
        };
        
        this.savedDesigns = JSON.parse(localStorage.getItem('savedDesigns')) || [];
        this.favoriteQuotes = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
        this.theme = localStorage.getItem('theme') || 'light';
        this.exportSettings = {
            quality: 1,
            size: 'original'
        };
        
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

        // Tab Switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target));
        });

        // Background Tabs
        document.querySelectorAll('.bg-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchBackgroundTab(e.target));
        });

        // Quote Selection
        document.getElementById('quote-category').addEventListener('change', (e) => this.loadQuotes(e.target.value));
        document.getElementById('quote-select').addEventListener('change', (e) => this.selectQuote(e.target.value));
        document.getElementById('add-to-favorites').addEventListener('click', () => this.addToFavorites());

        // Custom Quote
        document.getElementById('custom-quote').addEventListener('input', (e) => this.updateCustomQuote(e.target.value));
        document.getElementById('custom-author').addEventListener('input', (e) => this.updateCustomAuthor(e.target.value));
        
        // Author Image Upload
        document.getElementById('author-image').addEventListener('change', (e) => this.handleAuthorImageUpload(e));

        // Templates
        document.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', (e) => this.selectTemplate(e.currentTarget));
        });

        // Layout Options
        document.querySelectorAll('.layout-option').forEach(item => {
            item.addEventListener('click', (e) => this.selectLayout(e.currentTarget));
        });

        // Text Customization
        document.getElementById('font-family').addEventListener('change', (e) => this.updateFontFamily(e.target.value));
        document.getElementById('quote-font-size').addEventListener('input', (e) => this.updateQuoteFontSize(e.target.value));
        document.getElementById('author-font-size').addEventListener('input', (e) => this.updateAuthorFontSize(e.target.value));
        document.getElementById('line-height').addEventListener('input', (e) => this.updateLineHeight(e.target.value));

        // Color Customization
        document.getElementById('text-color').addEventListener('input', (e) => this.updateTextColor(e.target.value));
        document.getElementById('author-color').addEventListener('input', (e) => this.updateAuthorColor(e.target.value));
        document.getElementById('shadow-color').addEventListener('input', (e) => this.updateShadowColor(e.target.value));
        document.getElementById('gradient-start').addEventListener('input', (e) => this.updateGradientStart(e.target.value));
        document.getElementById('gradient-end').addEventListener('input', (e) => this.updateGradientEnd(e.target.value));

        // Background Options
        document.getElementById('bg-color').addEventListener('input', (e) => this.updateBackgroundColor(e.target.value));
        document.getElementById('gradient-color-1').addEventListener('input', (e) => this.updateGradientColor1(e.target.value));
        document.getElementById('gradient-color-2').addEventListener('input', (e) => this.updateGradientColor2(e.target.value));
        document.getElementById('gradient-direction').addEventListener('change', (e) => this.updateGradientDirection(e.target.value));
        document.getElementById('bg-image').addEventListener('change', (e) => this.handleBackgroundImageUpload(e));
        document.getElementById('bg-size').addEventListener('change', (e) => this.updateBackgroundSize(e.target.value));
        document.getElementById('bg-position').addEventListener('change', (e) => this.updateBackgroundPosition(e.target.value));
        
        // Pattern Selection
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

        // Export Settings
        document.getElementById('export-quality').addEventListener('change', (e) => this.updateExportQuality(e.target.value));
        document.getElementById('export-size').addEventListener('change', (e) => this.updateExportSize(e.target.value));

        // Download Buttons
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.downloadPoster(e.currentTarget.dataset.format));
        });

        // Save Design
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

    setupAdvancedControls() {
        // Update slider value displays
        document.getElementById('quote-font-size').addEventListener('input', (e) => {
            document.getElementById('quote-size-value').textContent = e.target.value + 'px';
        });
        
        document.getElementById('author-font-size').addEventListener('input', (e) => {
            document.getElementById('author-size-value').textContent = e.target.value + 'px';
        });
        
        document.getElementById('line-height').addEventListener('input', (e) => {
            document.getElementById('line-height-value').textContent = e.target.value;
        });
        
        document.getElementById('border-width').addEventListener('input', (e) => {
            document.getElementById('border-width-value').textContent = e.target.value + 'px';
        });

        // Show/hide advanced options based on toggles
        document.getElementById('show-header').addEventListener('change', (e) => {
            document.querySelector('.header-options').style.display = e.target.checked ? 'grid' : 'none';
        });

        document.getElementById('show-border').addEventListener('change', (e) => {
            document.querySelector('.border-options').style.display = e.target.checked ? 'grid' : 'none';
        });
    }

    populateCategories() {
        const categorySelect = document.getElementById('quote-category');
        const categoriesGrid = document.querySelector('.categories-grid');
        
        // Clear existing options
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        categoriesGrid.innerHTML = '';
        
        // Add all 30 categories
        this.categories.forEach(category => {
            // Add to dropdown
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
            
            // Add to grid
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.textContent = category.name;
            categoryItem.dataset.category = category.id;
            categoriesGrid.appendChild(categoryItem);
        });
    }

    populateTemplates() {
        const templateGrid = document.querySelector('.template-grid');
        templateGrid.innerHTML = '';
        
        this.templates.forEach(template => {
            const templateItem = document.createElement('div');
            templateItem.className = 'template-item';
            templateItem.dataset.template = template.id;
            
            templateItem.innerHTML = `
                <div class="template-preview" style="background: ${template.previewStyle}"></div>
                <span>${template.name}</span>
            `;
            
            templateGrid.appendChild(templateItem);
        });
        
        // Activate first template
        const firstTemplate = templateGrid.querySelector('.template-item');
        if (firstTemplate) {
            firstTemplate.classList.add('active');
            this.applyTemplate(firstTemplate.dataset.template);
        }
    }

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

    switchTab(clickedTab) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab
        clickedTab.classList.add('active');
        const tabId = clickedTab.dataset.tab + '-tab';
        document.getElementById(tabId).classList.add('active');
    }

    switchBackgroundTab(clickedTab) {
        // Remove active class from all tabs
        document.querySelectorAll('.bg-tab-btn').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.bg-tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab
        clickedTab.classList.add('active');
        const tabId = clickedTab.dataset.bg + '-tab';
        document.getElementById(tabId).classList.add('active');
        
        // Update background type
        this.currentDesign.backgroundType = clickedTab.dataset.bg;
        this.updatePreview();
    }

    loadQuotes(categoryId) {
        const quoteSelect = document.getElementById('quote-select');
        quoteSelect.innerHTML = '<option value="">Select Quote</option>';
        
        if (categoryId) {
            const category = this.categories.find(cat => cat.id === categoryId);
            if (category && this.quotes[categoryId]) {
                this.quotes[categoryId].forEach((quote, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = quote.text.length > 60 ? 
                        quote.text.substring(0, 60) + '...' : quote.text;
                    quoteSelect.appendChild(option);
                });
            }
        }
    }

    selectQuote(index) {
        const category = document.getElementById('quote-category').value;
        if (category && this.quotes[category] && this.quotes[category][index]) {
            const quote = this.quotes[category][index];
            this.updatePreviewQuote(quote.text, quote.author);
        }
    }

    selectCategory(categoryItem) {
        const categoryId = categoryItem.dataset.category;
        document.getElementById('quote-category').value = categoryId;
        this.loadQuotes(categoryId);
        this.switchTab(document.querySelector('[data-tab="library"]'));
    }

    addToFavorites() {
        const quoteText = document.getElementById('preview-quote').textContent.replace(/"/g, '');
        const authorText = document.getElementById('preview-author').textContent.replace('- ', '');
        
        if (quoteText && quoteText !== 'Your inspirational quote will appear here') {
            const quote = {
                text: quoteText,
                author: authorText,
                timestamp: new Date().toISOString()
            };
            
            // Check if already in favorites
            const exists = this.favoriteQuotes.some(fav => 
                fav.text === quote.text && fav.author === quote.author
            );
            
            if (!exists) {
                this.favoriteQuotes.push(quote);
                localStorage.setItem('favoriteQuotes', JSON.stringify(this.favoriteQuotes));
                this.loadFavoriteQuotes();
                this.showToast('Quote added to favorites!', 'success');
            } else {
                this.showToast('Quote already in favorites!', 'warning');
            }
        } else {
            this.showToast('Please select a quote first!', 'warning');
        }
    }

    updateCustomQuote(text) {
        if (text) {
            const author = document.getElementById('custom-author').value;
            this.updatePreviewQuote(text, author);
        }
    }

    updateCustomAuthor(author) {
        if (author) {
            const quoteText = document.getElementById('custom-quote').value;
            this.updatePreviewQuote(quoteText, author);
        }
    }

    handleAuthorImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentDesign.authorImage = e.target.result;
                const preview = document.getElementById('preview-author-image');
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                this.updatePreview();
            };
            reader.readAsDataURL(file);
        }
    }

    updatePreviewQuote(text, author) {
        const quoteElement = document.getElementById('preview-quote');
        const authorElement = document.getElementById('preview-author');
        
        quoteElement.textContent = `"${text}"`;
        authorElement.textContent = author ? `- ${author}` : '';
        
        this.updatePreview();
    }

    selectTemplate(templateItem) {
        // Remove active class from all templates
        document.querySelectorAll('.template-item').forEach(item => item.classList.remove('active'));
        // Add active class to selected template
        templateItem.classList.add('active');
        
        const template = templateItem.dataset.template;
        this.applyTemplate(template);
    }

    applyTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (template) {
            // Apply template settings
            Object.keys(template.settings).forEach(key => {
                this.currentDesign[key] = template.settings[key];
            });
            
            // Update form controls
            document.getElementById('text-color').value = template.settings.textColor;
            document.getElementById('author-color').value = template.settings.authorColor;
            document.getElementById('bg-color').value = template.settings.bgColor;
            document.getElementById('font-family').value = template.settings.fontFamily;
            document.getElementById('text-shadow').checked = template.settings.textShadow;
            document.getElementById('gradient-text').checked = template.settings.gradientText;
            
            this.updatePreview();
        }
    }

    selectLayout(layoutItem) {
        // Remove active class from all layouts
        document.querySelectorAll('.layout-option').forEach(item => item.classList.remove('active'));
        // Add active class to selected layout
        layoutItem.classList.add('active');
        
        const layout = layoutItem.dataset.layout;
        this.currentDesign.layout = layout;
        this.updatePreview();
    }

    selectPattern(patternItem) {
        const pattern = patternItem.dataset.pattern;
        this.currentDesign.backgroundPattern = pattern;
        this.updatePreview();
    }

    updateFontFamily(font) {
        this.currentDesign.fontFamily = font;
        this.updatePreview();
    }

    updateQuoteFontSize(size) {
        this.currentDesign.quoteFontSize = size + 'px';
        this.updatePreview();
    }

    updateAuthorFontSize(size) {
        this.currentDesign.authorFontSize = size + 'px';
        this.updatePreview();
    }

    updateLineHeight(height) {
        this.currentDesign.lineHeight = parseFloat(height);
        this.updatePreview();
    }

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

    handleBackgroundImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentDesign.backgroundImage = e.target.result;
                this.updatePreview();
            };
            reader.readAsDataURL(file);
        }
    }

    updateBackgroundSize(size) {
        this.currentDesign.bgSize = size;
        this.updatePreview();
    }

    updateBackgroundPosition(position) {
        this.currentDesign.bgPosition = position;
        this.updatePreview();
    }

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
        this.currentDesign.borderWidth = width + 'px';
        this.updatePreview();
    }

    toggleTextShadow(enabled) {
        this.currentDesign.textShadow = enabled;
        this.updatePreview();
    }

    toggleTextGlow(enabled) {
        this.currentDesign.textGlow = enabled;
        this.updatePreview();
    }

    toggleGradientText(enabled) {
        this.currentDesign.gradientText = enabled;
        this.updatePreview();
    }

    toggleTextOutline(enabled) {
        this.currentDesign.textOutline = enabled;
        this.updatePreview();
    }

    toggleLetterSpacing(enabled) {
        this.currentDesign.letterSpacing = enabled;
        this.updatePreview();
    }

    toggleTextRotation(enabled) {
        this.currentDesign.textRotation = enabled;
        this.updatePreview();
    }

    updateExportQuality(quality) {
        this.exportSettings.quality = parseFloat(quality);
    }

    updateExportSize(size) {
        this.exportSettings.size = size;
    }

    updatePreview() {
        const poster = document.getElementById('poster-preview');
        const quote = document.getElementById('preview-quote');
        const author = document.getElementById('preview-author');
        const header = document.getElementById('poster-header');
        const border = document.getElementById('poster-border');
        const authorSection = document.getElementById('author-section');

        // Apply layout
        this.applyLayout(poster, quote, author, authorSection);

        // Apply background
        this.applyBackground(poster);

        // Apply text styles
        this.applyTextStyles(quote, author);

        // Apply header
        this.applyHeader(header);

        // Apply border
        this.applyBorder(border);

        // Apply effects
        this.applyEffects(quote, author);
    }

    applyLayout(poster, quote, author, authorSection) {
        const layout = this.currentDesign.layout;
        
        // Reset all layout styles
        poster.style.alignItems = 'center';
        poster.style.justifyContent = 'center';
        quote.style.textAlign = 'center';
        author.style.textAlign = 'center';
        authorSection.style.justifyContent = 'center';
        
        switch (layout) {
            case 'centered':
                // Default centered layout
                break;
            case 'left-aligned':
                poster.style.alignItems = 'flex-start';
                poster.style.justifyContent = 'center';
                quote.style.textAlign = 'left';
                author.style.textAlign = 'left';
                authorSection.style.justifyContent = 'flex-start';
                break;
            case 'right-aligned':
                poster.style.alignItems = 'flex-end';
                poster.style.justifyContent = 'center';
                quote.style.textAlign = 'right';
                author.style.textAlign = 'right';
                authorSection.style.justifyContent = 'flex-end';
                break;
            case 'split':
                poster.style.alignItems = 'flex-start';
                poster.style.justifyContent = 'space-between';
                quote.style.textAlign = 'left';
                author.style.textAlign = 'right';
                authorSection.style.justifyContent = 'flex-end';
                break;
        }
    }

    applyBackground(poster) {
        const bgType = this.currentDesign.backgroundType;
        
        // Reset background
        poster.style.background = '';
        poster.style.backgroundColor = '';
        poster.style.backgroundImage = '';
        
        switch (bgType) {
            case 'color':
                poster.style.backgroundColor = this.currentDesign.bgColor;
                break;
            case 'gradient':
                const gradient = `linear-gradient(${this.currentDesign.gradientDirection}, ${this.currentDesign.gradientStart}, ${this.currentDesign.gradientEnd})`;
                poster.style.background = gradient;
                break;
            case 'image':
                if (this.currentDesign.backgroundImage) {
                    poster.style.backgroundImage = `url(${this.currentDesign.backgroundImage})`;
                    poster.style.backgroundSize = this.currentDesign.bgSize;
                    poster.style.backgroundPosition = this.currentDesign.bgPosition;
                    poster.style.backgroundRepeat = 'no-repeat';
                }
                break;
            case 'pattern':
                this.applyPattern(poster);
                break;
        }
    }

    applyPattern(poster) {
        const pattern = this.currentDesign.backgroundPattern;
        if (!pattern) return;
        
        switch (pattern) {
            case 'dots':
                poster.style.backgroundImage = 'radial-gradient(circle, var(--primary-color) 2px, transparent 2px)';
                poster.style.backgroundSize = '20px 20px';
                break;
            case 'lines':
                poster.style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 5px, var(--primary-color) 5px, var(--primary-color) 10px)';
                break;
            case 'squares':
                poster.style.backgroundImage = `
                    linear-gradient(45deg, var(--primary-color) 25%, transparent 25%), 
                    linear-gradient(-45deg, var(--primary-color) 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, var(--primary-color) 75%), 
                    linear-gradient(-45deg, transparent 75%, var(--primary-color) 75%)
                `;
                poster.style.backgroundSize = '10px 10px';
                break;
            case 'zigzag':
                poster.style.backgroundImage = `
                    linear-gradient(135deg, var(--primary-color) 25%, transparent 25%) -10px 0,
                    linear-gradient(225deg, var(--primary-color) 25%, transparent 25%) -10px 0,
                    linear-gradient(315deg, var(--primary-color) 25%, transparent 25%),
                    linear-gradient(45deg, var(--primary-color) 25%, transparent 25%)
                `;
                poster.style.backgroundSize = '10px 10px';
                break;
        }
    }

    applyTextStyles(quote, author) {
        // Apply font family
        quote.style.fontFamily = this.currentDesign.fontFamily;
        author.style.fontFamily = this.currentDesign.fontFamily;

        // Apply font sizes
        quote.style.fontSize = this.currentDesign.quoteFontSize;
        author.style.fontSize = this.currentDesign.authorFontSize;

        // Apply line height
        quote.style.lineHeight = this.currentDesign.lineHeight.toString();

        // Apply colors
        quote.style.color = this.currentDesign.textColor;
        author.style.color = this.currentDesign.authorColor;

        // Apply letter spacing if enabled
        if (this.currentDesign.letterSpacing) {
            quote.style.letterSpacing = '2px';
            author.style.letterSpacing = '1px';
        } else {
            quote.style.letterSpacing = 'normal';
            author.style.letterSpacing = 'normal';
        }

        // Apply text rotation if enabled
        if (this.currentDesign.textRotation) {
            quote.style.transform = 'rotate(-2deg)';
            author.style.transform = 'rotate(2deg)';
        } else {
            quote.style.transform = 'none';
            author.style.transform = 'none';
        }
    }

    applyHeader(header) {
        if (this.currentDesign.showHeader && this.currentDesign.headerText) {
            header.textContent = this.currentDesign.headerText;
            header.style.backgroundColor = this.currentDesign.headerColor;
            header.style.display = 'block';
        } else {
            header.style.display = 'none';
        }
    }

    applyBorder(border) {
        if (this.currentDesign.showBorder) {
            border.style.border = `${this.currentDesign.borderWidth} ${this.currentDesign.borderStyle} ${this.currentDesign.borderColor}`;
            border.style.display = 'block';
        } else {
            border.style.display = 'none';
        }
    }

    applyEffects(quote, author) {
        // Reset all effects first
        quote.style.textShadow = 'none';
        author.style.textShadow = 'none';
        quote.style.background = '';
        quote.style.webkitBackgroundClip = '';
        quote.style.webkitTextFillColor = '';
        author.style.background = '';
        author.style.webkitBackgroundClip = '';
        author.style.webkitTextFillColor = '';
        quote.style.textStroke = 'none';
        author.style.textStroke = 'none';

        // Apply text shadow
        if (this.currentDesign.textShadow) {
            const shadow = `2px 2px 4px ${this.currentDesign.shadowColor}`;
            quote.style.textShadow = shadow;
            author.style.textShadow = shadow;
        }

        // Apply text glow
        if (this.currentDesign.textGlow) {
            const glow = `0 0 10px ${this.currentDesign.shadowColor}`;
            quote.style.textShadow = glow;
            author.style.textShadow = glow;
        }

        // Apply gradient text
        if (this.currentDesign.gradientText) {
            const gradient = `linear-gradient(135deg, ${this.currentDesign.gradientStart}, ${this.currentDesign.gradientEnd})`;
            quote.style.background = gradient;
            quote.style.webkitBackgroundClip = 'text';
            quote.style.webkitTextFillColor = 'transparent';
            author.style.background = gradient;
            author.style.webkitBackgroundClip = 'text';
            author.style.webkitTextFillColor = 'transparent';
        }

        // Apply text outline
        if (this.currentDesign.textOutline) {
            quote.style.textStroke = `1px ${this.currentDesign.shadowColor}`;
            author.style.textStroke = `1px ${this.currentDesign.shadowColor}`;
        }
    }

    zoomPreview(delta) {
        const poster = document.getElementById('poster-preview');
        const currentScale = parseFloat(poster.style.transform.replace('scale(', '').replace(')', '')) || 1;
        const newScale = Math.max(0.5, Math.min(2, currentScale + delta));
        poster.style.transform = `scale(${newScale})`;
    }

    rotatePreview() {
        const poster = document.getElementById('poster-preview');
        const currentRotate = parseInt(poster.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
        const newRotate = (currentRotate + 90) % 360;
        poster.style.transform = `rotate(${newRotate}deg)`;
    }

    resetPreview() {
        const poster = document.getElementById('poster-preview');
        poster.style.transform = 'scale(1) rotate(0deg)';
    }

    async downloadPoster(format) {
        const poster = document.getElementById('poster-preview');
        
        try {
            this.showToast('Generating your poster...', 'info');
            
            // Apply export size settings
            const originalSize = {
                width: poster.offsetWidth,
                height: poster.offsetHeight
            };
            
            this.applyExportSize(poster);
            
            const canvas = await html2canvas(poster, {
                scale: this.exportSettings.quality * 2,
                backgroundColor: this.currentDesign.bgColor || '#ffffff',
                useCORS: true,
                allowTaint: true
            });

            // Restore original size
            poster.style.width = originalSize.width + 'px';
            poster.style.height = originalSize.height + 'px';

            switch (format) {
                case 'png':
                    this.downloadImage(canvas, 'png', 'quote-poster.png');
                    break;
                case 'jpg':
                    this.downloadImage(canvas, 'jpeg', 'quote-poster.jpg');
                    break;
                case 'pdf':
                    this.downloadPDF(canvas);
                    break;
                case 'svg':
                    this.downloadSVG();
                    break;
                case 'share':
                    this.sharePoster(canvas);
                    break;
                case 'print':
                    this.printPoster(canvas);
                    break;
            }
            
            this.showToast('Poster downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error generating poster:', error);
            this.showToast('Error generating poster. Please try again.', 'error');
        }
    }

    applyExportSize(poster) {
        const size = this.exportSettings.size;
        
        if (size !== 'original') {
            const [width, height] = size.split('x').map(Number);
            poster.style.width = width + 'px';
            poster.style.height = height + 'px';
        }
    }

    downloadImage(canvas, format, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
    }

    downloadPDF(canvas) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('quote-poster.pdf');
    }

    downloadSVG() {
        // Create a simple SVG representation
        const quote = document.getElementById('preview-quote').textContent;
        const author = document.getElementById('preview-author').textContent;
        
        const svgContent = `
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="${this.currentDesign.bgColor}"/>
                <text x="50%" y="50%" text-anchor="middle" fill="${this.currentDesign.textColor}" font-family="${this.currentDesign.fontFamily}" font-size="32">
                    ${quote}
                </text>
                <text x="50%" y="70%" text-anchor="middle" fill="${this.currentDesign.authorColor}" font-family="${this.currentDesign.fontFamily}" font-size="18">
                    ${author}
                </text>
            </svg>
        `;
        
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = 'quote-poster.svg';
        link.href = URL.createObjectURL(blob);
        link.click();
    }

    sharePoster(canvas) {
        if (navigator.share) {
            canvas.toBlob((blob) => {
                const file = new File([blob], 'quote-poster.png', { type: 'image/png' });
                navigator.share({
                    files: [file],
                    title: 'My Quote Poster',
                    text: 'Check out this inspirational quote poster I created!'
                });
            });
        } else {
            this.showToast('Web Share API not supported in your browser', 'warning');
        }
    }

    printPoster(canvas) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Poster</title>
                    <style>
                        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                        img { max-width: 100%; height: auto; }
                    </style>
                </head>
                <body>
                    <img src="${canvas.toDataURL('image/png')}" alt="Quote Poster">
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    saveDesign() {
        const design = {
            id: Date.now(),
            quote: document.getElementById('preview-quote').textContent,
            author: document.getElementById('preview-author').textContent,
            ...this.currentDesign,
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
        
        if (this.savedDesigns.length === 0) {
            grid.innerHTML = '<p class="no-designs">No saved designs yet. Create and save your first design!</p>';
        } else {
            this.savedDesigns.forEach(design => {
                const designCard = this.createDesignCard(design);
                grid.appendChild(designCard);
            });
        }
        
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

        card.querySelector('.load-design').addEventListener('click', () => this.loadDesign(design.id));
        card.querySelector('.delete-design').addEventListener('click', () => this.deleteDesign(design.id));

        return card;
    }

    loadDesign(id) {
        const design = this.savedDesigns.find(d => d.id === id);
        if (design) {
            document.getElementById('preview-quote').textContent = design.quote;
            document.getElementById('preview-author').textContent = design.author;
            this.currentDesign = { ...design };
            
            // Update all form controls to match loaded design
            this.updateFormControls();
            this.updatePreview();
            
            this.hideModal();
            this.showToast('Design loaded successfully!', 'success');
        }
    }

    updateFormControls() {
        // Update all form controls based on currentDesign
        document.getElementById('text-color').value = this.currentDesign.textColor;
        document.getElementById('author-color').value = this.currentDesign.authorColor;
        document.getElementById('bg-color').value = this.currentDesign.bgColor;
        document.getElementById('font-family').value = this.currentDesign.fontFamily;
        document.getElementById('quote-font-size').value = parseInt(this.currentDesign.quoteFontSize);
        document.getElementById('author-font-size').value = parseInt(this.currentDesign.authorFontSize);
        document.getElementById('line-height').value = this.currentDesign.lineHeight;
        
        // Update checkboxes
        document.getElementById('text-shadow').checked = this.currentDesign.textShadow;
        document.getElementById('text-glow').checked = this.currentDesign.textGlow;
        document.getElementById('gradient-text').checked = this.currentDesign.gradientText;
        document.getElementById('text-outline').checked = this.currentDesign.textOutline;
        document.getElementById('letter-spacing').checked = this.currentDesign.letterSpacing;
        document.getElementById('text-rotation').checked = this.currentDesign.textRotation;
        
        // Update header and border
        document.getElementById('show-header').checked = this.currentDesign.showHeader;
        document.getElementById('header-text').value = this.currentDesign.headerText;
        document.getElementById('header-color').value = this.currentDesign.headerColor;
        document.getElementById('show-border').checked = this.currentDesign.showBorder;
        document.getElementById('border-color').value = this.currentDesign.borderColor;
        document.getElementById('border-style').value = this.currentDesign.borderStyle;
        document.getElementById('border-width').value = parseInt(this.currentDesign.borderWidth);
        
        // Update slider value displays
        document.getElementById('quote-size-value').textContent = this.currentDesign.quoteFontSize;
        document.getElementById('author-size-value').textContent = this.currentDesign.authorFontSize;
        document.getElementById('line-height-value').textContent = this.currentDesign.lineHeight;
        document.getElementById('border-width-value').textContent = this.currentDesign.borderWidth;
        
        // Show/hide advanced options
        document.querySelector('.header-options').style.display = this.currentDesign.showHeader ? 'grid' : 'none';
        document.querySelector('.border-options').style.display = this.currentDesign.showBorder ? 'grid' : 'none';
    }

    deleteDesign(id) {
        this.savedDesigns = this.savedDesigns.filter(d => d.id !== id);
        localStorage.setItem('savedDesigns', JSON.stringify(this.savedDesigns));
        this.showSavedDesigns();
        this.showToast('Design deleted', 'info');
    }

    exportPreset() {
        const preset = {
            design: this.currentDesign,
            timestamp: new Date().toISOString(),
            version: '2.0'
        };
        
        const dataStr = JSON.stringify(preset, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.download = `poster-preset-${Date.now()}.json`;
        link.href = URL.createObjectURL(dataBlob);
        link.click();
        
        this.showToast('Design preset exported!', 'success');
    }

    hideModal() {
        document.getElementById('saved-modal').style.display = 'none';
    }

    loadFavoriteQuotes() {
        const favoritesList = document.getElementById('favorites-list');
        favoritesList.innerHTML = '';
        
        if (this.favoriteQuotes.length === 0) {
            favoritesList.innerHTML = '<p class="no-favorites">No favorite quotes yet.</p>';
        } else {
            this.favoriteQuotes.forEach((quote, index) => {
                const quoteItem = document.createElement('div');
                quoteItem.className = 'favorite-quote';
                quoteItem.innerHTML = `
                    <div class="quote-text">${quote.text}</div>
                    <div class="quote-author">- ${quote.author}</div>
                    <button class="use-quote" data-index="${index}">Use</button>
                `;
                
                quoteItem.querySelector('.use-quote').addEventListener('click', (e) => {
                    const quoteIndex = e.target.dataset.index;
                    const selectedQuote = this.favoriteQuotes[quoteIndex];
                    this.updatePreviewQuote(selectedQuote.text, selectedQuote.author);
                    this.showToast('Quote applied!', 'success');
                });
                
                favoritesList.appendChild(quoteItem);
            });
        }
    }

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

    // 30 Quote Categories
    categories = [
        { id: 'motivation', name: 'Motivational' },
        { id: 'education', name: 'Education' },
        { id: 'love', name: 'Love' },
        { id: 'wisdom', name: 'Wisdom' },
        { id: 'success', name: 'Success' },
        { id: 'life', name: 'Life' },
        { id: 'friendship', name: 'Friendship' },
        { id: 'inspiration', name: 'Inspiration' },
        { id: 'leadership', name: 'Leadership' },
        { id: 'creativity', name: 'Creativity' },
        { id: 'courage', name: 'Courage' },
        { id: 'perseverance', name: 'Perseverance' },
        { id: 'hope', name: 'Hope' },
        { id: 'dreams', name: 'Dreams' },
        { id: 'happiness', name: 'Happiness' },
        { id: 'peace', name: 'Peace' },
        { id: 'kindness', name: 'Kindness' },
        { id: 'gratitude', name: 'Gratitude' },
        { id: 'faith', name: 'Faith' },
        { id: 'science', name: 'Science' },
        { id: 'art', name: 'Art' },
        { id: 'music', name: 'Music' },
        { id: 'nature', name: 'Nature' },
        { id: 'time', name: 'Time' },
        { id: 'change', name: 'Change' },
        { id: 'growth', name: 'Growth' },
        { id: 'knowledge', name: 'Knowledge' },
        { id: 'truth', name: 'Truth' },
        { id: 'freedom', name: 'Freedom' },
        { id: 'humor', name: 'Humor' }
    ];

    // Templates with advanced styling
    templates = [
        {
            id: 'modern',
            name: 'Modern',
            previewStyle: 'linear-gradient(135deg, #667eea, #764ba2)',
            settings: {
                textColor: '#2c3e50',
                authorColor: '#666666',
                bgColor: '#ffffff',
                fontFamily: 'Arial',
                textShadow: true,
                gradientText: false
            }
        },
        {
            id: 'elegant',
            name: 'Elegant',
            previewStyle: 'linear-gradient(135deg, #f093fb, #f5576c)',
            settings: {
                textColor: '#ffffff',
                authorColor: '#f8f9fa',
                bgColor: '#2c3e50',
                fontFamily: 'Georgia',
                textShadow: false,
                gradientText: false
            }
        },
        {
            id: 'minimal',
            name: 'Minimal',
            previewStyle: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            settings: {
                textColor: '#333333',
                authorColor: '#666666',
                bgColor: '#f8f9fa',
                fontFamily: 'Arial',
                textShadow: false,
                gradientText: false
            }
        },
        {
            id: 'vintage',
            name: 'Vintage',
            previewStyle: 'linear-gradient(135deg, #43e97b, #38f9d7)',
            settings: {
                textColor: '#8b4513',
                authorColor: '#654321',
                bgColor: '#f5f5dc',
                fontFamily: 'Times New Roman',
                textShadow: true,
                gradientText: false
            }
        },
        {
            id: 'dark',
            name: 'Dark',
            previewStyle: 'linear-gradient(135deg, #434343, #000000)',
            settings: {
                textColor: '#ffffff',
                authorColor: '#cccccc',
                bgColor: '#1a1a1a',
                fontFamily: 'Courier New',
                textShadow: true,
                gradientText: false
            }
        },
        {
            id: 'gradient',
            name: 'Gradient',
            previewStyle: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
            settings: {
                textColor: '#ffffff',
                authorColor: '#f8f9fa',
                bgColor: 'linear-gradient(135deg, #667eea, #764ba2)',
                fontFamily: 'Verdana',
                textShadow: true,
                gradientText: true
            }
        }
    ];

    // Quote database with 30 categories
    quotes = {
        motivation: [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" }
        ],
        education: [
            { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
            { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
            { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" }
        ],
        love: [
            { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
            { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
            { text: "Where there is love there is life.", author: "Mahatma Gandhi" }
        ],
        wisdom: [
            { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
            { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
            { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" }
        ],
        success: [
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
            { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" }
        ],
        // Add more categories and quotes as needed...
        life: [
            { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
            { text: "Get busy living or get busy dying.", author: "Stephen King" },
            { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" }
        ],
        friendship: [
            { text: "A real friend is one who walks in when the rest of the world walks out.", author: "Walter Winchell" },
            { text: "Friendship is born at that moment when one person says to another: 'What! You too? I thought I was the only one.'", author: "C.S. Lewis" }
        ]
        // Continue with remaining categories...
    };
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    window.posterGenerator = new PosterGenerator();
});