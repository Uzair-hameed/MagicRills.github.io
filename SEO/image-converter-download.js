// Download Manager for AI Image Converter Pro
class DownloadManager {
    constructor() {
        this.originalImage = null;
        this.processedCanvas = null;
        this.currentFormat = 'png';
        this.currentQuality = 0.9;
        this.fileName = 'converted_image';
        this.init();
    }

    init() {
        this.createDownloadSection();
        this.setupEventListeners();
    }

    createDownloadSection() {
        // Create download options section
        const downloadSection = document.createElement('div');
        downloadSection.className = 'download-options';
        downloadSection.innerHTML = `
            <h3><i class="fas fa-download"></i> Quick Download Options</h3>
            <div class="quick-download-buttons">
                <button class="quick-download-btn" data-format="png" data-quality="1">
                    <i class="fas fa-file-image"></i>
                    <span>PNG</span>
                </button>
                <button class="quick-download-btn" data-format="jpeg" data-quality="0.9">
                    <i class="fas fa-file-image"></i>
                    <span>JPEG HQ</span>
                </button>
                <button class="quick-download-btn" data-format="jpeg" data-quality="0.7">
                    <i class="fas fa-file-image"></i>
                    <span>JPEG MQ</span>
                </button>
                <button class="quick-download-btn" data-format="webp" data-quality="0.8">
                    <i class="fas fa-file-image"></i>
                    <span>WEBP</span>
                </button>
                <button class="quick-download-btn" data-format="bmp" data-quality="1">
                    <i class="fas fa-file-image"></i>
                    <span>BMP</span>
                </button>
            </div>
        `;

        // Insert after preview actions
        const previewSection = document.querySelector('.preview-section');
        const previewActions = document.querySelector('.preview-actions');
        previewSection.insertBefore(downloadSection, previewActions.nextSibling);
    }

    setupEventListeners() {
        // Quick download buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-download-btn')) {
                const button = e.target.closest('.quick-download-btn');
                const format = button.getAttribute('data-format');
                const quality = parseFloat(button.getAttribute('data-quality'));
                this.quickDownload(format, quality);
            }
        });

        // Main download button
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadProcessedImage();
            });
        }
    }

    setOriginalImage(img) {
        this.originalImage = img;
        this.fileName = this.generateFileName();
    }

    updateProcessedImage(canvas, format = 'png', quality = 0.9) {
        this.processedCanvas = canvas;
        this.currentFormat = format;
        this.currentQuality = quality;
        
        // Show download options
        this.showDownloadOptions();
    }

    showDownloadOptions() {
        const downloadOptions = document.querySelector('.download-options');
        if (downloadOptions) {
            downloadOptions.classList.add('active');
        }
    }

    hideDownloadOptions() {
        const downloadOptions = document.querySelector('.download-options');
        if (downloadOptions) {
            downloadOptions.classList.remove('active');
        }
    }

    quickDownload(format, quality) {
        if (!this.processedCanvas) {
            this.showNotification('No processed image available', 'error');
            return;
        }

        this.currentFormat = format;
        this.currentQuality = quality;
        this.downloadImage();
    }

    downloadProcessedImage() {
        if (!this.processedCanvas) {
            this.showNotification('Please process an image first', 'error');
            return;
        }

        this.downloadImage();
    }

    downloadImage() {
        try {
            // Get canvas data
            const dataURL = this.processedCanvas.toDataURL(`image/${this.currentFormat}`, this.currentQuality);
            
            // Create download link
            const link = document.createElement('a');
            link.download = `${this.fileName}.${this.currentFormat}`;
            link.href = dataURL;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success notification
            this.showNotification(`Image downloaded as ${this.currentFormat.toUpperCase()}!`, 'success');

            // Log download event
            this.logDownloadEvent();

        } catch (error) {
            console.error('Download error:', error);
            this.showNotification('Download failed. Please try again.', 'error');
        }
    }

    downloadMultipleFormats() {
        const formats = [
            { format: 'png', quality: 1 },
            { format: 'jpeg', quality: 0.9 },
            { format: 'webp', quality: 0.8 }
        ];

        formats.forEach(({ format, quality }) => {
            setTimeout(() => {
                this.currentFormat = format;
                this.currentQuality = quality;
                this.downloadImage();
            }, formats.indexOf({ format, quality }) * 1000);
        });
    }

    generateFileName() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        return `ai_converted_${timestamp}`;
    }

    getImageInfo() {
        if (!this.processedCanvas) return null;

        return {
            width: this.processedCanvas.width,
            height: this.processedCanvas.height,
            format: this.currentFormat,
            quality: this.currentQuality,
            size: this.estimateFileSize(),
            timestamp: new Date().toISOString()
        };
    }

    estimateFileSize() {
        if (!this.processedCanvas) return 0;

        const dataURL = this.processedCanvas.toDataURL(`image/${this.currentFormat}`, this.currentQuality);
        const base64 = dataURL.split(',')[1];
        const binary = atob(base64);
        return binary.length;
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }

    logDownloadEvent() {
        const info = this.getImageInfo();
        if (info) {
            console.log('Download completed:', {
                ...info,
                sizeFormatted: this.formatFileSize(info.size)
            });
        }
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            background: type === 'success' ? 'rgba(0, 200, 83, 0.9)' : 
                       type === 'error' ? 'rgba(255, 23, 68, 0.9)' : 
                       'rgba(108, 99, 255, 0.9)'
        });

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }

    getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'info': return 'info-circle';
            default: return 'bell';
        }
    }

    // Advanced download features
    async downloadWithCompression(quality = 0.7) {
        if (!this.processedCanvas) return;

        // Create a temporary canvas for compression
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = this.processedCanvas.width;
        tempCanvas.height = this.processedCanvas.height;
        tempCtx.drawImage(this.processedCanvas, 0, 0);

        // Download compressed version
        this.currentQuality = quality;
        this.downloadImage();
    }

    // Batch download multiple sizes
    downloadMultipleSizes(sizes = []) {
        if (!this.processedCanvas) return;

        sizes.forEach((size, index) => {
            setTimeout(() => {
                this.downloadResizedVersion(size.width, size.height);
            }, index * 1000);
        });
    }

    downloadResizedVersion(width, height) {
        if (!this.processedCanvas) return;

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.drawImage(this.processedCanvas, 0, 0, width, height);

        const originalCanvas = this.processedCanvas;
        this.processedCanvas = tempCanvas;
        this.downloadImage();
        this.processedCanvas = originalCanvas;
    }
}

// Initialize Download Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.downloadManager = new DownloadManager();
});