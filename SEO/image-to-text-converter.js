class ImageToTextConverter {
    constructor() {
        this.currentImage = null;
        this.isProcessing = false;
        this.processedCount = 0;
        this.rotationAngle = 0;
        this.worker = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStats();
        this.setupTheme();
    }

    bindEvents() {
        // File Input
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e));
        document.getElementById('browseBtn').addEventListener('click', () => this.triggerFileInput());
        
        // Drag and Drop
        this.setupDragAndDrop();

        // Image Tools
        document.getElementById('rotateBtn').addEventListener('click', () => this.rotateImage());
        document.getElementById('enhanceBtn').addEventListener('click', () => this.enhanceImage());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearImage());

        // Processing
        document.getElementById('extractBtn').addEventListener('click', () => this.extractText());
        
        // Output Tools
        document.getElementById('copyBtn').addEventListener('click', () => this.copyText());
        document.getElementById('downloadTxtBtn').addEventListener('click', () => this.downloadText('txt'));
        document.getElementById('downloadPdfBtn').addEventListener('click', () => this.downloadText('pdf'));
        document.getElementById('clearTextBtn').addEventListener('click', () => this.clearText());

        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Adjustment Sliders
        document.getElementById('brightnessSlider').addEventListener('input', (e) => this.adjustImage(e));
        document.getElementById('contrastSlider').addEventListener('input', (e) => this.adjustImage(e));
    }

    setupDragAndDrop() {
        const dropZone = document.getElementById('dropZone');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => this.highlightDropZone(), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => this.unhighlightDropZone(), false);
        });

        dropZone.addEventListener('drop', (e) => this.handleDrop(e), false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlightDropZone() {
        document.getElementById('dropZone').classList.add('active');
    }

    unhighlightDropZone() {
        document.getElementById('dropZone').classList.remove('active');
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.processFiles(files);
    }

    triggerFileInput() {
        document.getElementById('fileInput').click();
    }

    handleFileSelect(e) {
        const files = e.target.files;
        this.processFiles(files);
    }

    processFiles(files) {
        if (files.length === 0) return;

        const file = files[0];
        if (!file.type.match('image.*')) {
            this.showNotification('Please select an image file (PNG, JPG, JPEG)', 'error');
            return;
        }

        this.currentImage = file;
        this.displayImagePreview(file);
    }

    displayImagePreview(file) {
        const reader = new FileReader();
        const previewContainer = document.getElementById('previewContainer');
        const previewImg = document.getElementById('imagePreview');
        const imageName = document.getElementById('imageName');
        const imageSize = document.getElementById('imageSize');

        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewContainer.style.display = 'block';
            
            // Reset adjustments
            this.rotationAngle = 0;
            document.getElementById('brightnessSlider').value = 0;
            document.getElementById('contrastSlider').value = 100;
            document.getElementById('brightnessValue').textContent = '0';
            document.getElementById('contrastValue').textContent = '100';
            previewImg.style.filter = 'none';
            previewImg.style.transform = 'none';
        };

        reader.readAsDataURL(file);
        
        // Update file info
        imageName.textContent = file.name;
        imageSize.textContent = this.formatFileSize(file.size);
        
        this.showNotification('Image loaded successfully! Click "Extract Text" to continue.', 'success');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    rotateImage() {
        if (!this.currentImage) {
            this.showNotification('Please upload an image first', 'warning');
            return;
        }

        this.rotationAngle = (this.rotationAngle + 90) % 360;
        const previewImg = document.getElementById('imagePreview');
        previewImg.style.transform = `rotate(${this.rotationAngle}deg)`;
    }

    enhanceImage() {
        if (!this.currentImage) {
            this.showNotification('Please upload an image first', 'warning');
            return;
        }

        // Auto-enhance settings
        document.getElementById('brightnessSlider').value = 20;
        document.getElementById('contrastSlider').value = 120;
        document.getElementById('brightnessValue').textContent = '20';
        document.getElementById('contrastValue').textContent = '120';
        this.adjustImage();
        
        this.showNotification('Image enhanced for better text recognition', 'success');
    }

    adjustImage() {
        if (!this.currentImage) return;

        const previewImg = document.getElementById('imagePreview');
        const brightness = document.getElementById('brightnessSlider').value;
        const contrast = document.getElementById('contrastSlider').value;

        // Update display values
        document.getElementById('brightnessValue').textContent = brightness;
        document.getElementById('contrastValue').textContent = contrast;

        // Apply filters
        previewImg.style.filter = `brightness(${100 + parseInt(brightness)}%) contrast(${contrast}%)`;
    }

    async extractText() {
        if (!this.currentImage) {
            this.showNotification('Please upload an image first', 'error');
            return;
        }

        if (this.isProcessing) {
            this.showNotification('Processing already in progress', 'warning');
            return;
        }

        this.isProcessing = true;
        this.showProgress(true);
        this.updateProgress(0, 'Initializing OCR engine...');

        try {
            const language = document.getElementById('languageSelect').value;

            // Initialize Tesseract worker
            this.updateProgress(10, 'Loading Tesseract engine...');
            
            if (!this.worker) {
                this.worker = await Tesseract.createWorker();
            }
            
            await this.worker.loadLanguage(language);
            await this.worker.initialize(language);

            this.updateProgress(30, 'Processing image...');
            
            // Get image data from preview
            const previewImg = document.getElementById('imagePreview');
            
            this.updateProgress(60, 'Extracting text...');
            
            // Perform OCR
            const { data: { text, confidence } } = await this.worker.recognize(previewImg);
            
            this.updateProgress(90, 'Finalizing results...');
            
            // Display results
            this.displayExtractedText(text, confidence);
            
            this.updateProgress(100, 'Complete!');
            
            // Update stats
            this.updateStats(confidence);
            
            this.showNotification('Text extracted successfully!', 'success');
            
        } catch (error) {
            console.error('OCR Error:', error);
            this.showNotification('Failed to extract text: ' + error.message, 'error');
        } finally {
            this.isProcessing = false;
            setTimeout(() => this.showProgress(false), 2000);
        }
    }

    displayExtractedText(text, confidence) {
        const textOutput = document.getElementById('textOutput');
        const textOverlay = document.getElementById('textOverlay');
        const confidenceValue = document.getElementById('confidenceValue');
        
        textOutput.value = text;
        textOverlay.style.display = 'none';
        confidenceValue.textContent = `${confidence ? Math.round(confidence) : 'N/A'}%`;
        
        // Color code confidence
        const confidenceBadge = document.getElementById('confidenceBadge');
        if (confidence >= 80) {
            confidenceBadge.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else if (confidence >= 60) {
            confidenceBadge.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        } else {
            confidenceBadge.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        }
    }

    updateStats(confidence) {
        this.processedCount++;
        document.getElementById('processedCount').textContent = this.processedCount;
        localStorage.setItem('processedCount', this.processedCount);
    }

    loadStats() {
        const savedCount = localStorage.getItem('processedCount');
        if (savedCount) {
            this.processedCount = parseInt(savedCount);
            document.getElementById('processedCount').textContent = this.processedCount;
        }
    }

    copyText() {
        const textOutput = document.getElementById('textOutput');
        
        if (!textOutput.value.trim()) {
            this.showNotification('No text to copy', 'warning');
            return;
        }

        textOutput.select();
        document.execCommand('copy');
        
        // Visual feedback
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span>✅</span> Copied!';
        copyBtn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
        
        this.showNotification('Text copied to clipboard', 'success');
    }

    downloadText(format) {
        const text = document.getElementById('textOutput').value;
        
        if (!text.trim()) {
            this.showNotification('No text to download', 'warning');
            return;
        }

        const filename = this.currentImage ? 
            this.currentImage.name.replace(/\.[^/.]+$/, '') : 
            'extracted-text';

        switch(format) {
            case 'txt':
                this.downloadTXT(text, filename);
                break;
            case 'pdf':
                this.downloadPDF(text, filename);
                break;
        }
    }

    downloadTXT(text, filename) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Text downloaded as TXT', 'success');
    }

    downloadPDF(text, filename) {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Split text into lines that fit the page
            const lines = doc.splitTextToSize(text, 180);
            
            doc.setFontSize(12);
            doc.text(lines, 15, 15);
            doc.save(`${filename}.pdf`);
            
            this.showNotification('Text downloaded as PDF', 'success');
        } catch (error) {
            this.showNotification('PDF generation failed', 'error');
            // Fallback to TXT
            this.downloadTXT(text, filename);
        }
    }

    clearText() {
        const textOutput = document.getElementById('textOutput');
        const textOverlay = document.getElementById('textOverlay');
        const confidenceValue = document.getElementById('confidenceValue');
        
        textOutput.value = '';
        textOverlay.style.display = 'flex';
        confidenceValue.textContent = '-';
        
        // Reset confidence badge
        document.getElementById('confidenceBadge').style.background = 'var(--gradient-secondary)';
    }

    clearImage() {
        this.currentImage = null;
        document.getElementById('previewContainer').style.display = 'none';
        document.getElementById('fileInput').value = '';
        this.clearText();
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.getElementById('themeIcon');
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    showProgress(show) {
        const progressContainer = document.getElementById('progressContainer');
        const extractBtn = document.getElementById('extractBtn');
        const extractLoading = document.getElementById('extractLoading');
        
        if (show) {
            progressContainer.style.display = 'block';
            extractBtn.disabled = true;
            extractLoading.style.display = 'block';
        } else {
            progressContainer.style.display = 'none';
            extractBtn.disabled = false;
            extractLoading.style.display = 'none';
        }
    }

    updateProgress(percent, text) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressFill.style.width = `${percent}%`;
        progressText.textContent = text;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#6366f1'
        };
        
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageToTextConverter();
});

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);