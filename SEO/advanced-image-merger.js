// Advanced Image Merger - Enhanced JavaScript
class AdvancedImageMerger {
    constructor() {
        this.images = [null, null];
        this.canvas = document.getElementById('aimCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.theme = 'light';
        this.exportFormat = 'png';
        this.exportQuality = 'original';
        this.isPreviewMode = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupDragAndDrop();
        this.updateAdvancedValues();
    }

    setupEventListeners() {
        // File input events
        document.getElementById('aimFile1').addEventListener('change', (e) => this.loadImage(e, 0));
        document.getElementById('aimFile2').addEventListener('change', (e) => this.loadImage(e, 1));
        
        // Theme toggle
        document.getElementById('themeBtn').addEventListener('click', () => this.toggleTheme());
        
        // Control events
        document.getElementById('aimSpacing').addEventListener('input', (e) => {
            document.getElementById('aimSpacingValue').textContent = e.target.value + 'px';
        });

        document.getElementById('aimBorder').addEventListener('input', (e) => {
            document.getElementById('aimBorderValue').textContent = e.target.value + 'px';
        });

        document.getElementById('aimBorderRadius').addEventListener('input', (e) => {
            document.getElementById('aimBorderRadiusValue').textContent = e.target.value + 'px';
        });

        // Advanced settings events
        document.getElementById('aimBrightness').addEventListener('input', (e) => {
            document.getElementById('aimBrightnessValue').textContent = e.target.value + '%';
        });

        document.getElementById('aimContrast').addEventListener('input', (e) => {
            document.getElementById('aimContrastValue').textContent = e.target.value + '%';
        });

        document.getElementById('aimSaturation').addEventListener('input', (e) => {
            document.getElementById('aimSaturationValue').textContent = e.target.value + '%';
        });

        document.getElementById('aimBlur').addEventListener('input', (e) => {
            document.getElementById('aimBlurValue').textContent = e.target.value + 'px';
        });

        document.getElementById('aimOpacity').addEventListener('input', (e) => {
            document.getElementById('aimOpacityValue').textContent = e.target.value + '%';
        });

        // AI apply button
        document.querySelector('.ai-apply-btn').addEventListener('click', () => this.applyAISuggestion());
    }

    updateAdvancedValues() {
        // Initialize advanced setting values
        const advancedControls = ['brightness', 'contrast', 'saturation', 'blur', 'opacity'];
        advancedControls.forEach(control => {
            const element = document.getElementById(`aim${control.charAt(0).toUpperCase() + control.slice(1)}`);
            const valueElement = document.getElementById(`aim${control.charAt(0).toUpperCase() + control.slice(1)}Value`);
            if (element && valueElement) {
                valueElement.textContent = element.value + (control === 'blur' ? 'px' : '%');
            }
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('aim-theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(this.theme);
    }

    setTheme(theme) {
        this.theme = theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('aim-theme', theme);
        
        const themeBtn = document.getElementById('themeBtn');
        themeBtn.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    setupDragAndDrop() {
        const uploadAreas = ['aimUploadArea1', 'aimUploadArea2'];
        
        uploadAreas.forEach((areaId, index) => {
            const area = document.getElementById(areaId);
            
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.style.borderColor = '#4361ee';
                area.style.background = 'rgba(67, 97, 238, 0.1)';
                area.style.transform = 'scale(1.02)';
            });

            area.addEventListener('dragleave', () => {
                area.style.borderColor = '';
                area.style.background = '';
                area.style.transform = '';
            });

            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.style.borderColor = '';
                area.style.background = '';
                area.style.transform = '';
                
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type.startsWith('image/')) {
                    this.handleFileSelect(files[0], index);
                }
            });
        });
    }

    loadImage(event, index) {
        const file = event.target.files[0];
        if (file) {
            this.handleFileSelect(file, index);
        }
    }

    handleFileSelect(file, index) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.images[index] = img;
                this.displayPreview(img, index);
                this.showNotification('Image loaded successfully!', 'success');
                
                // Auto preview if both images are loaded
                if (this.images[0] && this.images[1]) {
                    setTimeout(() => this.previewMerge(), 500);
                }
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }

    displayPreview(img, index) {
        const preview = document.getElementById(`aimPreview${index + 1}`);
        preview.innerHTML = '';
        
        const previewImg = document.createElement('img');
        previewImg.src = img.src;
        previewImg.style.maxWidth = '100%';
        previewImg.style.maxHeight = '200px';
        previewImg.style.borderRadius = '8px';
        preview.appendChild(previewImg);
    }

    applyAISuggestion() {
        // Apply AI suggested settings
        document.getElementById('aimLayout').value = 'collage';
        document.getElementById('aimFilter').value = 'vintage';
        document.getElementById('aimBgColor').value = '#f0f8ff';
        document.getElementById('aimBorderRadius').value = '15';
        document.getElementById('aimBorderRadiusValue').textContent = '15px';
        
        this.showNotification('AI settings applied!', 'success');
        
        // Trigger merge if both images are loaded
        if (this.images[0] && this.images[1]) {
            setTimeout(() => this.mergeImages(), 1000);
        }
    }

    mergeImages() {
        if (!this.images[0] || !this.images[1]) {
            this.showNotification('Please upload both images first!', 'error');
            return;
        }

        this.isPreviewMode = false;
        this.processMerge();
    }

    previewMerge() {
        if (!this.images[0] || !this.images[1]) {
            this.showNotification('Please upload both images first!', 'error');
            return;
        }

        this.isPreviewMode = true;
        this.processMerge();
        this.showNotification('Preview generated!', 'info');
    }

    processMerge() {
        const layout = document.getElementById('aimLayout').value;
        const spacing = parseInt(document.getElementById('aimSpacing').value);
        const bgColor = document.getElementById('aimBgColor').value;
        const border = parseInt(document.getElementById('aimBorder').value);
        const borderRadius = parseInt(document.getElementById('aimBorderRadius').value);
        
        // Advanced settings
        const brightness = parseInt(document.getElementById('aimBrightness').value) / 100;
        const contrast = parseInt(document.getElementById('aimContrast').value) / 100;
        const saturation = parseInt(document.getElementById('aimSaturation').value) / 100;
        const blur = parseInt(document.getElementById('aimBlur').value);
        const opacity = parseInt(document.getElementById('aimOpacity').value) / 100;

        // Calculate canvas size based on layout
        const canvasSize = this.calculateCanvasSize(layout, spacing);
        this.canvas.width = canvasSize.width;
        this.canvas.height = canvasSize.height;

        // Clear canvas with background
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply layout-specific merging
        this.applyLayout(layout, spacing, border, borderRadius, brightness, contrast, saturation, blur, opacity);

        // Add captions if provided
        this.addCaptions();

        // Apply filter
        this.applyFilter();

        // Enable download button
        document.getElementById('aimDownloadBtn').disabled = false;

        if (!this.isPreviewMode) {
            this.showNotification('Images merged successfully!', 'success');
        }
    }

    calculateCanvasSize(layout, spacing) {
        const img1 = this.images[0];
        const img2 = this.images[1];
        
        switch(layout) {
            case 'horizontal':
                return {
                    width: img1.width + img2.width + spacing * 3,
                    height: Math.max(img1.height, img2.height) + spacing * 2
                };
            case 'vertical':
                return {
                    width: Math.max(img1.width, img2.width) + spacing * 2,
                    height: img1.height + img2.height + spacing * 3
                };
            case 'diagonal':
                return {
                    width: Math.max(img1.width, img2.width) * 1.5 + spacing * 2,
                    height: Math.max(img1.height, img2.height) * 1.5 + spacing * 2
                };
            case 'collage':
                return {
                    width: Math.max(img1.width, img2.width) * 1.2 + spacing * 2,
                    height: Math.max(img1.height, img2.height) * 1.2 + spacing * 2
                };
            case 'circle':
                const maxSize = Math.max(img1.width, img1.height, img2.width, img2.height);
                return {
                    width: maxSize * 1.5 + spacing * 2,
                    height: maxSize * 1.5 + spacing * 2
                };
            case 'overlay':
                return {
                    width: Math.max(img1.width, img2.width) + spacing * 2,
                    height: Math.max(img1.height, img2.height) + spacing * 2
                };
            default:
                return {
                    width: img1.width + img2.width + spacing * 3,
                    height: Math.max(img1.height, img2.height) + spacing * 2
                };
        }
    }

    applyLayout(layout, spacing, border, borderRadius, brightness, contrast, saturation, blur, opacity) {
        const img1 = this.images[0];
        const img2 = this.images[1];

        // Save current context state
        this.ctx.save();

        // Apply advanced effects
        this.applyAdvancedEffects(brightness, contrast, saturation, blur, opacity);

        switch(layout) {
            case 'horizontal':
                this.drawHorizontalLayout(img1, img2, spacing, border, borderRadius);
                break;
            case 'vertical':
                this.drawVerticalLayout(img1, img2, spacing, border, borderRadius);
                break;
            case 'diagonal':
                this.drawDiagonalLayout(img1, img2, spacing, border, borderRadius);
                break;
            case 'collage':
                this.drawCollageLayout(img1, img2, spacing, border, borderRadius);
                break;
            case 'circle':
                this.drawCircleLayout(img1, img2, spacing, border);
                break;
            case 'polaroid':
                this.drawPolaroidLayout(img1, img2, spacing, border);
                break;
            case 'overlay':
                this.drawOverlayLayout(img1, img2, spacing, border, borderRadius, opacity);
                break;
            case 'mirror':
                this.drawMirrorLayout(img1, img2, spacing, border, borderRadius);
                break;
            case 'split':
                this.drawSplitLayout(img1, img2, spacing, border);
                break;
            case 'mosaic':
                this.drawMosaicLayout(img1, img2, spacing, border);
                break;
        }

        // Restore context state
        this.ctx.restore();
    }

    drawHorizontalLayout(img1, img2, spacing, border, borderRadius) {
        const x1 = spacing;
        const y1 = (this.canvas.height - img1.height) / 2;
        const x2 = x1 + img1.width + spacing;
        const y2 = (this.canvas.height - img2.height) / 2;

        this.drawImageWithStyle(img1, x1, y1, border, borderRadius);
        this.drawImageWithStyle(img2, x2, y2, border, borderRadius);
    }

    drawVerticalLayout(img1, img2, spacing, border, borderRadius) {
        const x1 = (this.canvas.width - img1.width) / 2;
        const y1 = spacing;
        const x2 = (this.canvas.width - img2.width) / 2;
        const y2 = y1 + img1.height + spacing;

        this.drawImageWithStyle(img1, x1, y1, border, borderRadius);
        this.drawImageWithStyle(img2, x2, y2, border, borderRadius);
    }

    drawDiagonalLayout(img1, img2, spacing, border, borderRadius) {
        const x1 = spacing;
        const y1 = spacing;
        const x2 = this.canvas.width - img2.width - spacing;
        const y2 = this.canvas.height - img2.height - spacing;

        this.drawImageWithStyle(img1, x1, y1, border, borderRadius);
        this.drawImageWithStyle(img2, x2, y2, border, borderRadius);
    }

    drawCollageLayout(img1, img2, spacing, border, borderRadius) {
        const angle1 = -5 * Math.PI / 180;
        const angle2 = 5 * Math.PI / 180;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Draw first image rotated
        this.ctx.save();
        this.ctx.translate(centerX - img1.width / 3, centerY - img1.height / 3);
        this.ctx.rotate(angle1);
        this.drawImageWithStyle(img1, -img1.width / 2, -img1.height / 2, border, borderRadius);
        this.ctx.restore();

        // Draw second image rotated
        this.ctx.save();
        this.ctx.translate(centerX + img2.width / 3, centerY + img2.height / 3);
        this.ctx.rotate(angle2);
        this.drawImageWithStyle(img2, -img2.width / 2, -img2.height / 2, border, borderRadius);
        this.ctx.restore();
    }

    drawCircleLayout(img1, img2, spacing, border) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) / 3;

        // Draw circular mask for first image
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(centerX - radius / 2, centerY, radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.clip();
        this.ctx.drawImage(img1, centerX - radius - radius / 2, centerY - radius, radius * 2, radius * 2);
        this.ctx.restore();

        // Draw circular mask for second image
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(centerX + radius / 2, centerY, radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.clip();
        this.ctx.drawImage(img2, centerX - radius + radius / 2, centerY - radius, radius * 2, radius * 2);
        this.ctx.restore();

        // Draw borders
        if (border > 0) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = border;
            this.ctx.beginPath();
            this.ctx.arc(centerX - radius / 2, centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(centerX + radius / 2, centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    drawOverlayLayout(img1, img2, spacing, border, borderRadius, opacity) {
        const x = spacing;
        const y = spacing;
        const width = this.canvas.width - spacing * 2;
        const height = this.canvas.height - spacing * 2;

        // Draw base image
        this.drawImageWithStyle(img1, x, y, border, borderRadius);

        // Draw overlay image with reduced opacity
        this.ctx.globalAlpha = opacity;
        this.drawImageWithStyle(img2, x + width * 0.1, y + height * 0.1, border, borderRadius, width * 0.8, height * 0.8);
        this.ctx.globalAlpha = 1.0;
    }

    drawImageWithStyle(img, x, y, border, borderRadius, customWidth, customHeight) {
        const width = customWidth || img.width;
        const height = customHeight || img.height;

        if (borderRadius > 0) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(x + borderRadius, y);
            this.ctx.arcTo(x + width, y, x + width, y + height, borderRadius);
            this.ctx.arcTo(x + width, y + height, x, y + height, borderRadius);
            this.ctx.arcTo(x, y + height, x, y, borderRadius);
            this.ctx.arcTo(x, y, x + width, y, borderRadius);
            this.ctx.closePath();
            this.ctx.clip();
        }

        this.ctx.drawImage(img, x, y, width, height);

        if (borderRadius > 0) {
            this.ctx.restore();
        }

        if (border > 0) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = border;
            this.ctx.strokeRect(x, y, width, height);
        }
    }

    applyAdvancedEffects(brightness, contrast, saturation, blur, opacity) {
        // Apply CSS filters to canvas
        let filter = '';
        
        if (brightness !== 1) filter += `brightness(${brightness}) `;
        if (contrast !== 1) filter += `contrast(${contrast}) `;
        if (saturation !== 1) filter += `saturate(${saturation}) `;
        if (blur > 0) filter += `blur(${blur}px) `;
        
        if (filter) {
            this.canvas.style.filter = filter;
        }
    }

    applyFilter() {
        const filter = document.getElementById('aimFilter').value;
        let filterValue = '';

        switch(filter) {
            case 'vintage':
                filterValue = 'sepia(0.5) contrast(1.2) brightness(0.9)';
                break;
            case 'modern':
                filterValue = 'contrast(1.3) saturate(1.2)';
                break;
            case 'artistic':
                filterValue = 'hue-rotate(90deg) saturate(1.5)';
                break;
            case 'grayscale':
                filterValue = 'grayscale(1)';
                break;
            case 'sepia':
                filterValue = 'sepia(1)';
                break;
            case 'warm':
                filterValue = 'sepia(0.3) saturate(1.4) brightness(1.1)';
                break;
            case 'cool':
                filterValue = 'hue-rotate(180deg) saturate(0.8) brightness(1.1)';
                break;
            case 'dramatic':
                filterValue = 'contrast(1.8) brightness(0.8)';
                break;
            case 'pastel':
                filterValue = 'saturate(0.6) brightness(1.2)';
                break;
        }

        if (filterValue) {
            this.canvas.style.filter += ' ' + filterValue;
        }
    }

    addCaptions() {
        const caption1 = document.getElementById('aimCaption1').value.trim();
        const caption2 = document.getElementById('aimCaption2').value.trim();

        if (caption1) {
            this.addTextToCanvas(caption1, 50, this.canvas.height - 30, 'left');
        }

        if (caption2) {
            this.addTextToCanvas(caption2, this.canvas.width - 50, this.canvas.height - 30, 'right');
        }
    }

    addTextToCanvas(text, x, y, align) {
        this.ctx.save();
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'bottom';

        // Text shadow
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }

    downloadImage() {
        if (!this.images[0] || !this.images[1]) {
            this.showNotification('No merged image to download!', 'error');
            return;
        }

        const link = document.createElement('a');
        let mimeType = 'image/png';
        let quality = 1.0;

        switch(this.exportFormat) {
            case 'jpg':
                mimeType = 'image/jpeg';
                quality = this.exportQuality === 'high' ? 1.0 : 0.7;
                break;
            case 'webp':
                mimeType = 'image/webp';
                quality = this.exportQuality === 'high' ? 1.0 : 0.8;
                break;
        }

        link.download = `merged-image-${new Date().getTime()}.${this.exportFormat}`;
        link.href = this.canvas.toDataURL(mimeType, quality);
        link.click();
        
        this.showNotification(`Image downloaded as ${this.exportFormat.toUpperCase()}!`, 'success');
    }

    clearAll() {
        this.images = [null, null];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Clear previews
        document.getElementById('aimPreview1').innerHTML = '';
        document.getElementById('aimPreview2').innerHTML = '';
        
        // Clear file inputs
        document.getElementById('aimFile1').value = '';
        document.getElementById('aimFile2').value = '';
        
        // Clear captions
        document.getElementById('aimCaption1').value = '';
        document.getElementById('aimCaption2').value = '';
        
        // Reset controls
        document.getElementById('aimDownloadBtn').disabled = true;
        
        this.showNotification('All cleared! Ready for new images.', 'info');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.aim-notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `aim-notification ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Global functions for HTML onclick events
let aimInstance;

function aimMergeImages() {
    if (!aimInstance) aimInstance = new AdvancedImageMerger();
    aimInstance.mergeImages();
}

function aimPreviewMerge() {
    if (!aimInstance) aimInstance = new AdvancedImageMerger();
    aimInstance.previewMerge();
}

function aimDownloadImage() {
    if (!aimInstance) aimInstance = new AdvancedImageMerger();
    aimInstance.downloadImage();
}

function aimClearAll() {
    if (!aimInstance) aimInstance = new AdvancedImageMerger();
    aimInstance.clearAll();
}

function setExportFormat(format) {
    if (!aimInstance) aimInstance = new AdvancedImageMerger();
    aimInstance.exportFormat = format;
    
    // Update active button
    document.querySelectorAll('.aim-export-btn[data-format]').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.format === format) {
            btn.classList.add('active');
        }
    });
}

function setExportQuality(quality) {
    if (!aimInstance) aimInstance = new AdvancedImageMerger();
    aimInstance.exportQuality = quality;
    
    // Update active button
    document.querySelectorAll('.aim-export-btn[data-format]').forEach(btn => {
        if (['high', 'medium', 'original'].includes(btn.dataset.format)) {
            btn.classList.remove('active');
            if (btn.dataset.format === quality) {
                btn.classList.add('active');
            }
        }
    });
}

function toggleAdvancedSettings() {
    const content = document.getElementById('advancedSettings');
    const icon = document.getElementById('advancedIcon');
    
    if (content.style.display === 'none') {
        content.style.display = 'grid';
        icon.className = 'fas fa-chevron-up';
    } else {
        content.style.display = 'none';
        icon.className = 'fas fa-chevron-down';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    aimInstance = new AdvancedImageMerger();
});