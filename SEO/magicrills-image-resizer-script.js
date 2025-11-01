// Magicrills Image Resizer - Advanced JavaScript
class MagicrillsImageResizer {
    constructor() {
        this.files = [];
        this.processedFiles = [];
        this.currentTheme = localStorage.getItem('magicrills-theme') || 'light';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme(this.currentTheme);
        this.loadFromLocalStorage();
    }

    setupEventListeners() {
        // Theme Toggle
        document.getElementById('magicrills-theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // File Upload
        const dragArea = document.getElementById('magicrills-drag-area');
        const fileInput = document.getElementById('magicrills-file-input');
        const browseBtn = document.getElementById('magicrills-browse-btn');

        browseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Drag and Drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dragArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dragArea.addEventListener(eventName, () => this.highlightArea(), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dragArea.addEventListener(eventName, () => this.unhighlightArea(), false);
        });

        dragArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            this.handleFiles(files);
        });

        // Resize Mode Changes
        document.querySelectorAll('input[name="resize-mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.handleResizeModeChange(e.target.value));
        });

        // Range Inputs
        document.getElementById('magicrills-percentage').addEventListener('input', (e) => {
            document.getElementById('magicrills-percentage-value').textContent = `${e.target.value}%`;
        });

        document.getElementById('magicrills-quality').addEventListener('input', (e) => {
            document.getElementById('magicrills-quality-value').textContent = `${e.target.value}%`;
        });

        document.getElementById('magicrills-watermark-opacity').addEventListener('input', (e) => {
            document.getElementById('magicrills-opacity-value').textContent = `${e.target.value}%`;
        });

        // Advanced Options Toggle
        document.getElementById('magicrills-toggle-advanced').addEventListener('click', () => {
            this.toggleAdvancedOptions();
        });

        // Watermark Toggle
        document.getElementById('magicrills-add-watermark').addEventListener('change', (e) => {
            this.toggleWatermarkOptions(e.target.checked);
        });

        // Process Button
        document.getElementById('magicrills-process-btn').addEventListener('click', () => {
            this.processImages();
        });

        // Batch Actions
        document.getElementById('magicrills-download-all').addEventListener('click', () => {
            this.downloadAllImages();
        });

        document.getElementById('magicrills-clear-results').addEventListener('click', () => {
            this.clearResults();
        });

        // Reset Button
        document.getElementById('magicrills-reset-btn').addEventListener('click', () => {
            this.resetOptions();
        });
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlightArea() {
        document.getElementById('magicrills-drag-area').classList.add('active');
    }

    unhighlightArea() {
        document.getElementById('magicrills-drag-area').classList.remove('active');
    }

    async handleFiles(fileList) {
        const validFiles = Array.from(fileList).filter(file => file.type.startsWith('image/'));
        
        if (validFiles.length === 0) {
            this.showNotification('Please select valid image files!', 'error');
            return;
        }

        for (const file of validFiles) {
            await this.addFile(file);
        }

        this.updateFileCounter();
        this.saveToLocalStorage();
    }

    async addFile(file) {
        const fileId = this.generateId();
        const fileData = {
            id: fileId,
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
            originalSize: file.size
        };

        this.files.push(fileData);
        this.renderFileItem(fileData);
    }

    renderFileItem(fileData) {
        const fileList = document.getElementById('magicrills-file-list');
        const fileSize = this.formatFileSize(fileData.size);

        const fileItem = document.createElement('div');
        fileItem.className = 'file-item fade-in';
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">🖼️</div>
                <div class="file-details">
                    <h4>${fileData.name}</h4>
                    <span>${fileSize}</span>
                </div>
            </div>
            <button class="file-remove" data-id="${fileData.id}">×</button>
        `;

        fileList.appendChild(fileItem);

        // Add remove event listener
        fileItem.querySelector('.file-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFile(fileData.id);
        });
    }

    removeFile(fileId) {
        this.files = this.files.filter(file => file.id !== fileId);
        this.updateFileCounter();
        this.saveToLocalStorage();
        
        // Remove from DOM
        const fileElement = document.querySelector(`[data-id="${fileId}"]`).closest('.file-item');
        fileElement.style.animation = 'slideUp 0.3s ease-out reverse';
        setTimeout(() => fileElement.remove(), 300);
    }

    updateFileCounter() {
        const counter = document.getElementById('magicrills-file-counter');
        counter.textContent = `${this.files.length} file${this.files.length !== 1 ? 's' : ''}`;
        counter.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => counter.style.animation = '', 500);
    }

    handleResizeModeChange(mode) {
        // Hide all groups
        document.getElementById('magicrills-percentage-group').style.display = 'none';
        document.getElementById('magicrills-dimensions-group').style.display = 'none';
        document.getElementById('magicrills-width-group').style.display = 'none';
        document.getElementById('magicrills-height-group').style.display = 'none';

        // Show selected group
        switch (mode) {
            case 'percentage':
                document.getElementById('magicrills-percentage-group').style.display = 'block';
                break;
            case 'dimensions':
                document.getElementById('magicrills-dimensions-group').style.display = 'block';
                break;
            case 'width':
                document.getElementById('magicrills-width-group').style.display = 'block';
                break;
            case 'height':
                document.getElementById('magicrills-height-group').style.display = 'block';
                break;
        }
    }

    toggleAdvancedOptions() {
        const advancedOptions = document.getElementById('magicrills-advanced-options');
        const toggleArrow = document.querySelector('.toggle-arrow');
        const isVisible = advancedOptions.style.display !== 'none';

        if (isVisible) {
            advancedOptions.style.display = 'none';
            toggleArrow.style.transform = 'rotate(0deg)';
        } else {
            advancedOptions.style.display = 'block';
            toggleArrow.style.transform = 'rotate(180deg)';
            advancedOptions.classList.add('slide-up');
        }
    }

    toggleWatermarkOptions(show) {
        const watermarkOptions = document.getElementById('magicrills-watermark-options');
        if (show) {
            watermarkOptions.style.display = 'block';
            watermarkOptions.classList.add('slide-up');
        } else {
            watermarkOptions.style.display = 'none';
        }
    }

    async processImages() {
        if (this.files.length === 0) {
            this.showNotification('Please upload some images first!', 'error');
            return;
        }

        this.showLoading(true);
        this.showResultsSection();

        this.processedFiles = [];
        const totalFiles = this.files.length;
        let processedCount = 0;

        for (const fileData of this.files) {
            try {
                const processedImage = await this.processSingleImage(fileData);
                this.processedFiles.push(processedImage);
                processedCount++;
                
                // Update progress
                this.updateProgress((processedCount / totalFiles) * 100, `Processing ${processedCount}/${totalFiles}`);
                
                // Render preview
                this.renderPreview(processedImage);
                
            } catch (error) {
                console.error('Error processing image:', error);
                this.showNotification(`Error processing ${fileData.name}`, 'error');
            }
        }

        this.showLoading(false);
        this.updateProgress(100, 'Processing complete!');
        this.showNotification(`Successfully processed ${this.processedFiles.length} images!`, 'success');
        this.saveToLocalStorage();
    }

    async processSingleImage(fileData) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Get resize parameters
                const resizeMode = document.querySelector('input[name="resize-mode"]:checked').value;
                const maintainAspect = document.getElementById('magicrills-maintain-aspect').checked;
                
                let newWidth, newHeight;

                switch (resizeMode) {
                    case 'percentage':
                        const percentage = parseInt(document.getElementById('magicrills-percentage').value) / 100;
                        newWidth = img.width * percentage;
                        newHeight = img.height * percentage;
                        break;
                    
                    case 'dimensions':
                        const targetWidth = document.getElementById('magicrills-width').value;
                        const targetHeight = document.getElementById('magicrills-height').value;
                        
                        if (maintainAspect) {
                            if (targetWidth && !targetHeight) {
                                newWidth = parseInt(targetWidth);
                                newHeight = (img.height * newWidth) / img.width;
                            } else if (targetHeight && !targetWidth) {
                                newHeight = parseInt(targetHeight);
                                newWidth = (img.width * newHeight) / img.height;
                            } else if (targetWidth && targetHeight) {
                                newWidth = parseInt(targetWidth);
                                newHeight = parseInt(targetHeight);
                            } else {
                                newWidth = img.width;
                                newHeight = img.height;
                            }
                        } else {
                            newWidth = targetWidth ? parseInt(targetWidth) : img.width;
                            newHeight = targetHeight ? parseInt(targetHeight) : img.height;
                        }
                        break;
                    
                    case 'width':
                        newWidth = parseInt(document.getElementById('magicrills-target-width').value);
                        newHeight = maintainAspect ? (img.height * newWidth) / img.width : img.height;
                        break;
                    
                    case 'height':
                        newHeight = parseInt(document.getElementById('magicrills-target-height').value);
                        newWidth = maintainAspect ? (img.width * newHeight) / img.height : img.width;
                        break;
                    
                    default:
                        newWidth = img.width;
                        newHeight = img.height;
                }

                // Ensure integer dimensions
                newWidth = Math.round(newWidth);
                newHeight = Math.round(newHeight);

                // Set canvas dimensions
                canvas.width = newWidth;
                canvas.height = newHeight;

                // Draw image with high quality scaling
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                // Apply watermark if enabled
                if (document.getElementById('magicrills-add-watermark').checked) {
                    this.applyWatermark(canvas, ctx);
                }

                // Get output format
                const outputFormat = document.querySelector('input[name="output-format"]:checked').value;
                const mimeType = outputFormat === 'original' ? fileData.type : 
                                outputFormat === 'jpeg' ? 'image/jpeg' :
                                outputFormat === 'png' ? 'image/png' : 'image/webp';

                // Get quality
                const quality = document.getElementById('magicrills-quality').value / 100;

                // Convert to blob
                canvas.toBlob((blob) => {
                    const processedUrl = URL.createObjectURL(blob);
                    
                    resolve({
                        ...fileData,
                        processedBlob: blob,
                        processedUrl: processedUrl,
                        processedSize: blob.size,
                        originalDimensions: { width: img.width, height: img.height },
                        processedDimensions: { width: newWidth, height: newHeight },
                        compressionRatio: ((fileData.size - blob.size) / fileData.size * 100).toFixed(1)
                    });
                }, mimeType, quality);

            };
            img.onerror = reject;
            img.src = fileData.url;
        });
    }

    applyWatermark(canvas, ctx) {
        const text = document.getElementById('magicrills-watermark-text').value || 'Magicrills';
        const opacity = parseInt(document.getElementById('magicrills-watermark-opacity').value) / 100;
        const position = document.querySelector('input[name="watermark-position"]:checked').value;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const textWidth = ctx.measureText(text).width;
        const padding = 20;

        let x, y;

        switch (position) {
            case 'top-left':
                x = padding + textWidth / 2;
                y = padding;
                break;
            case 'top-right':
                x = canvas.width - padding - textWidth / 2;
                y = padding;
                break;
            case 'center':
                x = canvas.width / 2;
                y = canvas.height / 2;
                break;
            case 'bottom-left':
                x = padding + textWidth / 2;
                y = canvas.height - padding;
                break;
            case 'bottom-right':
                x = canvas.width - padding - textWidth / 2;
                y = canvas.height - padding;
                break;
        }

        // Text shadow effect
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    renderPreview(processedImage) {
        const previewGrid = document.getElementById('magicrills-preview-grid');
        
        const previewCard = document.createElement('div');
        previewCard.className = 'preview-card fade-in';
        previewCard.innerHTML = `
            <div class="preview-image">
                <img src="${processedImage.processedUrl}" alt="${processedImage.name}" loading="lazy">
            </div>
            <div class="preview-info">
                <div class="preview-stats">
                    <div class="stat">
                        <span class="stat-value">${processedImage.processedDimensions.width}×${processedImage.processedDimensions.height}</span>
                        <span class="stat-label">Dimensions</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${this.formatFileSize(processedImage.processedSize)}</span>
                        <span class="stat-label">Size</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${processedImage.compressionRatio}%</span>
                        <span class="stat-label">Saved</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${Math.round((processedImage.processedSize / processedImage.originalSize) * 100)}%</span>
                        <span class="stat-label">Original</span>
                    </div>
                </div>
                <div class="preview-actions">
                    <button class="magicrills-btn magicrills-btn-primary download-single" data-id="${processedImage.id}">
                        💾 Download
                    </button>
                    <button class="magicrills-btn magicrills-btn-outline preview-original" data-id="${processedImage.id}">
                        👁️ Preview
                    </button>
                </div>
            </div>
        `;

        previewGrid.appendChild(previewCard);

        // Add event listeners
        previewCard.querySelector('.download-single').addEventListener('click', () => {
            this.downloadSingleImage(processedImage);
        });

        previewCard.querySelector('.preview-original').addEventListener('click', () => {
            this.previewComparison(processedImage);
        });
    }

    downloadSingleImage(processedImage) {
        const link = document.createElement('a');
        link.href = processedImage.processedUrl;
        link.download = this.getOutputFilename(processedImage.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('Image downloaded successfully!', 'success');
    }

    downloadAllImages() {
        if (this.processedFiles.length === 0) {
            this.showNotification('No processed images available!', 'error');
            return;
        }

        this.processedFiles.forEach((file, index) => {
            setTimeout(() => {
                this.downloadSingleImage(file);
            }, index * 100);
        });

        this.showNotification(`Downloading ${this.processedFiles.length} images...`, 'success');
    }

    previewComparison(processedImage) {
        // Create a modal for image comparison
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;

        modal.innerHTML = `
            <div style="background: var(--bg-card); padding: 30px; border-radius: 15px; max-width: 90vw; max-height: 90vh; overflow: auto;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <h3 style="text-align: center; margin-bottom: 10px;">Original</h3>
                        <img src="${processedImage.url}" style="max-width: 100%; max-height: 400px; border-radius: 10px;">
                        <div style="text-align: center; margin-top: 10px; color: var(--text-secondary);">
                            ${processedImage.originalDimensions.width}×${processedImage.originalDimensions.height} • ${this.formatFileSize(processedImage.originalSize)}
                        </div>
                    </div>
                    <div>
                        <h3 style="text-align: center; margin-bottom: 10px;">Processed</h3>
                        <img src="${processedImage.processedUrl}" style="max-width: 100%; max-height: 400px; border-radius: 10px;">
                        <div style="text-align: center; margin-top: 10px; color: var(--text-secondary);">
                            ${processedImage.processedDimensions.width}×${processedImage.processedDimensions.height} • ${this.formatFileSize(processedImage.processedSize)}
                        </div>
                    </div>
                </div>
                <button onclick="this.closest('div[style]').remove()" 
                        style="background: var(--error-color); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; display: block; margin: 0 auto;">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    clearResults() {
        this.processedFiles = [];
        document.getElementById('magicrills-preview-grid').innerHTML = '';
        document.getElementById('magicrills-results-section').style.display = 'none';
        this.showNotification('Results cleared!', 'success');
    }

    resetOptions() {
        // Reset all form elements to default
        document.getElementById('magicrills-percentage').value = 100;
        document.getElementById('magicrills-percentage-value').textContent = '100%';
        document.getElementById('magicrills-width').value = '';
        document.getElementById('magicrills-height').value = '';
        document.getElementById('magicrills-target-width').value = '';
        document.getElementById('magicrills-target-height').value = '';
        document.getElementById('magicrills-quality').value = 80;
        document.getElementById('magicrills-quality-value').textContent = '80%';
        document.getElementById('magicrills-maintain-aspect').checked = true;
        document.getElementById('magicrills-add-watermark').checked = false;
        document.getElementById('magicrills-watermark-text').value = '';
        document.getElementById('magicrills-watermark-opacity').value = 50;
        document.getElementById('magicrills-opacity-value').textContent = '50%';
        
        // Reset radio buttons
        document.querySelector('input[name="resize-mode"][value="percentage"]').checked = true;
        document.querySelector('input[name="output-format"][value="original"]').checked = true;
        document.querySelector('input[name="watermark-position"][value="top-left"]').checked = true;
        
        // Update UI
        this.handleResizeModeChange('percentage');
        this.toggleWatermarkOptions(false);
        
        this.showNotification('Options reset to default!', 'success');
    }

    showResultsSection() {
        const resultsSection = document.getElementById('magicrills-results-section');
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');
        
        // Update processed count
        document.getElementById('magicrills-processed-count').textContent = this.files.length;
    }

    updateProgress(percentage, text) {
        const progressFill = document.getElementById('magicrills-progress-fill');
        const progressText = document.getElementById('magicrills-progress-text');
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = text;
    }

    showLoading(show) {
        const spinner = document.getElementById('magicrills-spinner');
        if (show) {
            spinner.classList.add('active');
        } else {
            spinner.classList.remove('active');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.magicrills-notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `magicrills-notification magicrills-notification-${type} fade-in`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--primary-color)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: var(--shadow-lg);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('magicrills-theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeBtn = document.getElementById('magicrills-theme-toggle');
        themeBtn.textContent = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
    }

    getOutputFilename(originalName) {
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
        const extension = document.querySelector('input[name="output-format"]:checked').value;
        
        let ext = '';
        switch (extension) {
            case 'jpeg': ext = '.jpg'; break;
            case 'png': ext = '.png'; break;
            case 'webp': ext = '.webp'; break;
            default: ext = originalName.substring(originalName.lastIndexOf('.'));
        }
        
        const resizeMode = document.querySelector('input[name="resize-mode"]:checked').value;
        let suffix = '';
        
        switch (resizeMode) {
            case 'percentage':
                const percentage = document.getElementById('magicrills-percentage').value;
                suffix = `_${percentage}pct`;
                break;
            case 'dimensions':
                const width = document.getElementById('magicrills-width').value || 'auto';
                const height = document.getElementById('magicrills-height').value || 'auto';
                suffix = `_${width}x${height}`;
                break;
            case 'width':
                const targetWidth = document.getElementById('magicrills-target-width').value;
                suffix = `_w${targetWidth}`;
                break;
            case 'height':
                const targetHeight = document.getElementById('magicrills-target-height').value;
                suffix = `_h${targetHeight}`;
                break;
        }
        
        return `${nameWithoutExt}${suffix}_resized${ext}`;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveToLocalStorage() {
        const data = {
            files: this.files.map(f => ({
                id: f.id,
                name: f.name,
                size: f.size,
                type: f.type
            })),
            settings: {
                theme: this.currentTheme,
                resizeMode: document.querySelector('input[name="resize-mode"]:checked').value,
                percentage: document.getElementById('magicrills-percentage').value,
                width: document.getElementById('magicrills-width').value,
                height: document.getElementById('magicrills-height').value,
                maintainAspect: document.getElementById('magicrills-maintain-aspect').checked
            }
        };
        localStorage.setItem('magicrills-image-resizer', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('magicrills-image-resizer');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                // You can implement file restoration here if needed
            } catch (e) {
                console.warn('Failed to load saved data:', e);
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MagicrillsImageResizer();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);