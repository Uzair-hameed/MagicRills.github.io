// blog-post-to-ad-converter.js

class BlogToAdConverter {
    constructor() {
        this.currentTheme = 'light';
        this.currentTab = 'converter';
        this.canvas = null;
        this.ctx = null;
        this.isGenerating = false;
        this.init();
    }

    init() {
        this.initializeTheme();
        this.initializeCanvas();
        this.setupEventListeners();
        this.hideLoadingScreen();
        this.showWelcomeMessage();
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('blog-ad-converter-theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.className = `${theme}-theme`;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('blog-ad-converter-theme', theme);
        
        // Update theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            const text = themeToggle.querySelector('span');
            
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                text.textContent = 'Light Mode';
            } else {
                icon.className = 'fas fa-moon';
                text.textContent = 'Dark Mode';
            }
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.showToast(`Switched to ${newTheme} mode`, 'success');
    }

    initializeCanvas() {
        this.canvas = document.getElementById('outputCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = 800;
            this.canvas.height = 600;
            this.drawWelcomeScreen();
        }
    }

    drawWelcomeScreen() {
        if (!this.ctx) return;

        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#4361ee');
        gradient.addColorStop(1, '#3a0ca3');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 40px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Blog to Ad Converter', this.canvas.width / 2, this.canvas.height / 2 - 50);

        this.ctx.font = '20px Inter';
        this.ctx.fillText('Enter your content and click Generate', this.canvas.width / 2, this.canvas.height / 2 + 20);

        this.ctx.font = '16px Inter';
        this.ctx.fillText('Powered by AI Magic', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchMainTab(e.target.dataset.tab));
        });

        // Output tabs
        document.querySelectorAll('.output-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchOutputTab(e.target.dataset.tab));
        });

        // Format buttons
        document.querySelectorAll('.format-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.formatText(e.target.dataset.format));
        });

        // AI cards
        document.querySelectorAll('.ai-card').forEach(card => {
            card.addEventListener('click', (e) => this.enhanceContent(e.currentTarget.dataset.action));
        });

        // Generate button
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateAd());
        }

        // Download buttons
        document.querySelectorAll('.btn-download').forEach(btn => {
            btn.addEventListener('click', (e) => this.downloadOutput(e.currentTarget.dataset.format));
        });

        // Word count
        const contentTextarea = document.getElementById('blogContent');
        if (contentTextarea) {
            contentTextarea.addEventListener('input', () => this.updateWordCount());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    switchMainTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.nav-tab[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        this.showToast(`Switched to ${tabName} tab`, 'info');
    }

    switchOutputTab(tabName) {
        // Update tab navigation
        document.querySelectorAll('.output-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.output-tab[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabName}Pane`).classList.add('active');
    }

    formatText(type) {
        const textarea = document.getElementById('blogContent');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        let formattedText = '';

        switch(type) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                break;
            case 'underline':
                formattedText = `__${selectedText}__`;
                break;
            case 'heading1':
                formattedText = `# ${selectedText}`;
                break;
            case 'heading2':
                formattedText = `## ${selectedText}`;
                break;
            case 'quote':
                formattedText = `> ${selectedText}`;
                break;
            default:
                formattedText = selectedText;
        }

        textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        textarea.focus();
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);

        this.showToast(`Applied ${type} formatting`, 'success');
    }

    enhanceContent(action) {
        const content = document.getElementById('blogContent').value;
        if (!content.trim()) {
            this.showToast('Please enter some content first', 'warning');
            return;
        }

        this.showToast(`Applying AI ${action}...`, 'info');

        // Simulate AI processing
        setTimeout(() => {
            let enhancedContent = '';
            
            switch(action) {
                case 'summarize':
                    enhancedContent = this.aiSummarize(content);
                    break;
                case 'hashtags':
                    enhancedContent = this.aiGenerateHashtags(content);
                    break;
                case 'cta':
                    enhancedContent = this.aiAddCTA(content);
                    break;
                case 'optimize':
                    enhancedContent = this.aiOptimizeSEO(content);
                    break;
            }

            document.getElementById('blogContent').value = enhancedContent;
            this.updateWordCount();
            this.showToast(`AI ${action} applied successfully!`, 'success');
        }, 2000);
    }

    aiSummarize(content) {
        const sentences = content.split('. ').filter(s => s.length > 10);
        return sentences.slice(0, 3).join('. ') + '.';
    }

    aiGenerateHashtags(content) {
        const words = content.toLowerCase().split(/\W+/).filter(word => word.length > 5);
        const uniqueWords = [...new Set(words)].slice(0, 5);
        const hashtags = uniqueWords.map(word => `#${word}`).join(' ');
        return content + '\n\n' + hashtags;
    }

    aiAddCTA(content) {
        const ctas = [
            '👉 Like and share if you found this helpful!',
            '🚀 Ready to transform your content? Try now!',
            '💡 Want more tips? Follow for daily insights!',
            '📈 Boost your engagement with our tools!'
        ];
        const randomCta = ctas[Math.floor(Math.random() * ctas.length)];
        return content + '\n\n' + randomCta;
    }

    aiOptimizeSEO(content) {
        // Simple SEO optimization simulation
        return content
            .replace(/\b(amazing|great|awesome)\b/gi, '🔥 $1')
            .replace(/\b(important|essential|crucial)\b/gi, '💎 $1')
            .replace(/\btips?\b/gi, '💡 Tips');
    }

    generateAd() {
        const title = document.getElementById('blogTitle').value;
        const content = document.getElementById('blogContent').value;

        if (!title.trim() && !content.trim()) {
            this.showToast('Please enter title and content to generate ad', 'warning');
            return;
        }

        if (this.isGenerating) return;
        this.isGenerating = true;

        const generateBtn = document.getElementById('generateBtn');
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;

        // Simulate generation process
        this.simulateGeneration(title, content)
            .then(() => {
                this.renderAd(title, content);
                this.isGenerating = false;
                generateBtn.innerHTML = originalText;
                generateBtn.disabled = false;
                this.showToast('Ad generated successfully!', 'success');
            })
            .catch(error => {
                this.isGenerating = false;
                generateBtn.innerHTML = originalText;
                generateBtn.disabled = false;
                this.showToast('Error generating ad', 'error');
                console.error('Generation error:', error);
            });
    }

    simulateGeneration(title, content) {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    renderAd(title, content) {
        if (!this.ctx) return;

        const canvas = this.canvas;
        const ctx = this.ctx;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#4361ee');
        gradient.addColorStop(1, '#3a0ca3');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(title || 'Amazing Blog Post', canvas.width / 2, 80);

        // Content box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.roundRect(50, 120, canvas.width - 100, canvas.height - 200, 20);
        ctx.fill();

        // Content
        ctx.fillStyle = 'white';
        ctx.font = '18px Inter';
        ctx.textAlign = 'left';
        
        const lines = this.wrapText(ctx, content, canvas.width - 140, 18);
        let y = 160;
        
        for (let i = 0; i < Math.min(lines.length, 8); i++) {
            ctx.fillText(lines[i], 70, y);
            y += 30;
        }

        // Footer
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Generated with MagicRills Blog to Ad Converter', canvas.width / 2, canvas.height - 40);
    }

    wrapText(ctx, text, maxWidth, fontSize) {
        ctx.font = `${fontSize}px Inter`;
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        
        lines.push(currentLine);
        return lines;
    }

    downloadOutput(format) {
        if (!this.canvas) {
            this.showToast('Please generate an ad first', 'warning');
            return;
        }

        const link = document.createElement('a');
        let filename = `blog-ad-${Date.now()}`;

        switch(format) {
            case 'png':
                link.href = this.canvas.toDataURL('image/png');
                filename += '.png';
                break;
            case 'jpg':
                link.href = this.canvas.toDataURL('image/jpeg', 0.9);
                filename += '.jpg';
                break;
            case 'pdf':
                this.generatePDF();
                return;
            case 'copy':
                this.copyToClipboard();
                return;
        }

        link.download = filename;
        link.click();
        this.showToast(`Downloaded as ${format.toUpperCase()}`, 'success');
    }

    generatePDF() {
        // In a real implementation, you would use a PDF library like jsPDF
        this.showToast('PDF generation would be implemented with jsPDF library', 'info');
    }

    async copyToClipboard() {
        try {
            if (!this.canvas) {
                this.showToast('Please generate an ad first', 'warning');
                return;
            }

            this.canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    this.showToast('Image copied to clipboard!', 'success');
                } catch (err) {
                    this.showToast('Failed to copy image', 'error');
                }
            });
        } catch (err) {
            this.showToast('Clipboard API not supported', 'error');
        }
    }

    updateWordCount() {
        const textarea = document.getElementById('blogContent');
        const wordCount = document.getElementById('wordCount');
        
        if (textarea && wordCount) {
            const text = textarea.value.trim();
            const words = text ? text.split(/\s+/).length : 0;
            wordCount.textContent = words;
        }
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'b':
                    e.preventDefault();
                    this.formatText('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    this.formatText('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    this.formatText('underline');
                    break;
                case 'Enter':
                    if (e.shiftKey) {
                        e.preventDefault();
                        this.generateAd();
                    }
                    break;
            }
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.showToast('Welcome to Advanced Blog to Ad Converter Pro! 🚀', 'success');
        }, 1500);
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Remove toast after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Canvas rounded rectangle polyfill
if (CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
    };
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogAdConverter = new BlogToAdConverter();
});