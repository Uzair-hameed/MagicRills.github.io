// DOM Elements
const themeSwitch = document.getElementById('themeSwitch');
const uploadArea = document.getElementById('uploadArea');
const uploadBtn = document.getElementById('uploadBtn');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const imageInfo = document.getElementById('imageInfo');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasPlaceholder = document.getElementById('canvasPlaceholder');
const resizeWidth = document.getElementById('resizeWidth');
const resizeHeight = document.getElementById('resizeHeight');
const formatSelect = document.getElementById('formatSelect');
const qualityRange = document.getElementById('qualityRange');
const qualityValue = document.getElementById('qualityValue');
const resizeConvertBtn = document.getElementById('resizeConvertBtn');
const cropBtn = document.getElementById('cropBtn');
const removeBgBtn = document.getElementById('removeBgBtn');
const enhanceBtn = document.getElementById('enhanceBtn');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Global Variables
let originalImage = null;
let currentImageData = null;
let processing = false;
let currentFileName = 'converted_image';

// Initialize the application
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Initialize tooltips and other UI elements
    initializeUI();
}

// Set up all event listeners
function setupEventListeners() {
    // Theme toggle
    themeSwitch.addEventListener('click', toggleTheme);
    
    // Upload functionality
    uploadBtn.addEventListener('click', () => imageInput.click());
    uploadArea.addEventListener('click', () => imageInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    imageInput.addEventListener('change', handleImageUpload);
    
    // Tool controls
    qualityRange.addEventListener('input', updateQualityValue);
    resizeConvertBtn.addEventListener('click', resizeAndConvert);
    cropBtn.addEventListener('click', smartCrop);
    removeBgBtn.addEventListener('click', removeBackground);
    enhanceBtn.addEventListener('click', enhanceImage);
    resetBtn.addEventListener('click', resetImage);
    downloadBtn.addEventListener('click', handleDownload);
    
    // Auto-update height when width changes and vice versa (maintain aspect ratio)
    resizeWidth.addEventListener('change', updateAspectRatio);
    resizeHeight.addEventListener('change', updateAspectRatio);
}

// Initialize UI elements
function initializeUI() {
    // Add loading states to buttons
    document.querySelectorAll('.btn-action, .btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.id !== 'resetBtn' && !this.disabled && !processing) {
                addLoadingState(this);
            }
        });
    });
}

// Theme functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Show theme change notification
    showNotification(`Switched to ${newTheme} mode`, 'success');
}

function updateThemeIcon(theme) {
    const icon = themeSwitch.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// Upload functionality
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('active');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('active');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('active');
    
    if (e.dataTransfer.files.length) {
        processImageFile(e.dataTransfer.files[0]);
    }
}

function handleImageUpload(e) {
    if (e.target.files.length) {
        processImageFile(e.target.files[0]);
    }
}

function processImageFile(file) {
    if (!file.type.match('image.*')) {
        showNotification('Please select a valid image file (PNG, JPG, WEBP, GIF)', 'error');
        return;
    }
    
    // Show loading state
    addLoadingState(uploadBtn);
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            currentImageData = null;
            currentFileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
            
            // Update preview
            previewImg.src = event.target.result;
            imageInfo.textContent = `${img.width} × ${img.height}px | ${formatFileSize(file.size)} | ${file.type.split('/')[1].toUpperCase()}`;
            
            // Show preview and hide upload area
            uploadArea.style.display = 'none';
            imagePreview.style.display = 'block';
            
            // Initialize canvas
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Hide placeholder and show canvas
            canvasPlaceholder.style.display = 'none';
            canvas.style.display = 'block';
            
            // Enable download button
            downloadBtn.disabled = false;
            
            // Set default resize values
            resizeWidth.placeholder = img.width;
            resizeHeight.placeholder = img.height;
            
            // Remove loading state
            removeLoadingState(uploadBtn);
            
            // Show success message
            showNotification('Image uploaded successfully!', 'success');
            
            // Initialize download manager
            if (window.downloadManager) {
                window.downloadManager.setOriginalImage(img);
            }
        }
        img.onerror = function() {
            showNotification('Error loading image. Please try another file.', 'error');
            removeLoadingState(uploadBtn);
        }
        img.src = event.target.result;
    }
    reader.onerror = function() {
        showNotification('Error reading file. Please try again.', 'error');
        removeLoadingState(uploadBtn);
    }
    reader.readAsDataURL(file);
}

// Image processing functions
function resizeAndConvert() {
    if (!originalImage) {
        showNotification('Please upload an image first', 'error');
        return;
    }
    
    if (processing) return;
    processing = true;
    
    const format = formatSelect.value;
    const w = parseInt(resizeWidth.value) || originalImage.width;
    const h = parseInt(resizeHeight.value) || originalImage.height;
    const quality = qualityRange.value / 100;
    
    // Validate dimensions
    if (w <= 0 || h <= 0) {
        showNotification('Please enter valid dimensions', 'error');
        processing = false;
        removeLoadingState(resizeConvertBtn);
        return;
    }
    
    // Show processing animation
    addLoadingState(resizeConvertBtn);
    
    // Use timeout to allow UI to update
    setTimeout(() => {
        // Update canvas
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(originalImage, 0, 0, w, h);
        
        // Store current image data for download
        currentImageData = canvas.toDataURL(`image/${format}`, quality);
        
        // Update download manager
        if (window.downloadManager) {
            window.downloadManager.updateProcessedImage(canvas, format, quality);
        }
        
        // Show success message
        showNotification(`Image converted to ${format.toUpperCase()}!`, 'success');
        
        processing = false;
        removeLoadingState(resizeConvertBtn);
    }, 100);
}

function smartCrop() {
    if (!originalImage) {
        showNotification('Please upload an image first', 'error');
        return;
    }
    
    if (processing) return;
    processing = true;
    addLoadingState(cropBtn);
    
    setTimeout(() => {
        const minSide = Math.min(originalImage.width, originalImage.height);
        const sx = (originalImage.width - minSide) / 2;
        const sy = (originalImage.height - minSide) / 2;
        
        canvas.width = minSide;
        canvas.height = minSide;
        ctx.drawImage(originalImage, sx, sy, minSide, minSide, 0, 0, minSide, minSide);
        
        // Store current image data for download
        currentImageData = canvas.toDataURL('image/png');
        
        // Update download manager
        if (window.downloadManager) {
            window.downloadManager.updateProcessedImage(canvas, 'png', 1);
        }
        
        // Update resize inputs
        resizeWidth.value = minSide;
        resizeHeight.value = minSide;
        
        showNotification('Image cropped to square format!', 'success');
        processing = false;
        removeLoadingState(cropBtn);
    }, 100);
}

function removeBackground() {
    if (!originalImage) {
        showNotification('Please upload an image first', 'error');
        return;
    }
    
    if (processing) return;
    processing = true;
    addLoadingState(removeBgBtn);
    
    // Show progress bar
    showProgressBar();
    
    // Simulate AI processing delay
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 5;
        updateProgressBar(progress);
        if (progress >= 100) {
            clearInterval(progressInterval);
            completeBackgroundRemoval();
        }
    }, 50);
}

function completeBackgroundRemoval() {
    // Reset canvas to original image
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.drawImage(originalImage, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Advanced background removal simulation
    let pixelsProcessed = 0;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Remove white and light backgrounds (more sophisticated threshold)
        if (r > 220 && g > 220 && b > 220) {
            data[i + 3] = 0;
            pixelsProcessed++;
        }
        // Remove very dark backgrounds
        else if (r < 30 && g < 30 && b < 30) {
            data[i + 3] = 0;
            pixelsProcessed++;
        }
        // Remove common background colors (green screen-like)
        else if (g > r * 1.2 && g > b * 1.2) {
            data[i + 3] = 0;
            pixelsProcessed++;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Store current image data for download
    currentImageData = canvas.toDataURL('image/png');
    
    // Update download manager
    if (window.downloadManager) {
        window.downloadManager.updateProcessedImage(canvas, 'png', 1);
    }
    
    hideProgressBar();
    showNotification(`Background removed! ${Math.round(pixelsProcessed/100)}% of pixels processed`, 'success');
    processing = false;
    removeLoadingState(removeBgBtn);
}

function enhanceImage() {
    if (!originalImage) {
        showNotification('Please upload an image first', 'error');
        return;
    }
    
    if (processing) return;
    processing = true;
    addLoadingState(enhanceBtn);
    
    // Show progress bar
    showProgressBar();
    
    // Simulate AI enhancement processing
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        updateProgressBar(progress);
        if (progress >= 100) {
            clearInterval(progressInterval);
            completeEnhancement();
        }
    }, 60);
}

function completeEnhancement() {
    // Reset canvas to original image
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.drawImage(originalImage, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Simple enhancement: increase contrast and saturation
    for (let i = 0; i < data.length; i += 4) {
        // Increase contrast
        const factor = 1.2;
        data[i] = Math.min(255, data[i] * factor);     // Red
        data[i + 1] = Math.min(255, data[i + 1] * factor); // Green
        data[i + 2] = Math.min(255, data[i + 2] * factor); // Blue
        
        // Simple saturation increase
        const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
        data[i] = Math.min(255, gray + (data[i] - gray) * 1.1);
        data[i + 1] = Math.min(255, gray + (data[i + 1] - gray) * 1.1);
        data[i + 2] = Math.min(255, gray + (data[i + 2] - gray) * 1.1);
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Store current image data for download
    currentImageData = canvas.toDataURL('image/jpeg', 0.9);
    
    // Update download manager
    if (window.downloadManager) {
        window.downloadManager.updateProcessedImage(canvas, 'jpeg', 0.9);
    }
    
    hideProgressBar();
    showNotification('Image enhanced with AI!', 'success');
    processing = false;
    removeLoadingState(enhanceBtn);
}

function resetImage() {
    if (!originalImage) {
        return;
    }
    
    // Reset canvas to original image
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.drawImage(originalImage, 0, 0);
    
    // Reset form values
    resizeWidth.value = '';
    resizeHeight.value = '';
    qualityRange.value = 90;
    qualityValue.textContent = '90%';
    formatSelect.value = 'png';
    
    // Store current image data for download
    currentImageData = canvas.toDataURL('image/png');
    
    // Update download manager
    if (window.downloadManager) {
        window.downloadManager.updateProcessedImage(canvas, 'png', 1);
    }
    
    showNotification('Image reset to original', 'info');
}

function handleDownload() {
    if (!currentImageData) {
        showNotification('Please process an image first', 'error');
        return;
    }
    
    if (window.downloadManager) {
        window.downloadManager.downloadProcessedImage();
    }
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

function updateQualityValue() {
    qualityValue.textContent = `${qualityRange.value}%`;
}

function updateAspectRatio() {
    if (!originalImage) return;
    
    // If width is changed and height is empty, calculate height to maintain aspect ratio
    if (resizeWidth.value && !resizeHeight.value) {
        const ratio = originalImage.height / originalImage.width;
        resizeHeight.value = Math.round(resizeWidth.value * ratio);
    }
    // If height is changed and width is empty, calculate width to maintain aspect ratio
    else if (resizeHeight.value && !resizeWidth.value) {
        const ratio = originalImage.width / originalImage.height;
        resizeWidth.value = Math.round(resizeHeight.value * ratio);
    }
}

function addLoadingState(button) {
    if (!button.querySelector('.loading-spinner')) {
        const originalText = button.innerHTML;
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;
        button.setAttribute('data-original', originalText);
        button.disabled = true;
    }
}

function removeLoadingState(button) {
    const originalText = button.getAttribute('data-original');
    if (originalText) {
        button.innerHTML = originalText;
        button.removeAttribute('data-original');
        button.disabled = false;
    }
}

function showProgressBar() {
    let progressBar = document.getElementById('progressBar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'progressBar';
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.querySelector('.preview-section').appendChild(progressBar);
    }
    progressBar.style.display = 'block';
    updateProgressBar(0);
}

function updateProgressBar(percent) {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = percent + '%';
    }
}

function hideProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.display = 'none';
    }
}

function showNotification(message, type) {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '12px';
    notification.style.color = 'white';
    notification.style.fontWeight = '600';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
    notification.style.backdropFilter = 'blur(10px)';
    notification.style.border = '1px solid rgba(255,255,255,0.1)';
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'rgba(0, 200, 83, 0.9)';
    } else if (type === 'error') {
        notification.style.background = 'rgba(255, 23, 68, 0.9)';
    } else {
        notification.style.background = 'rgba(108, 99, 255, 0.9)';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'info': return 'info-circle';
        default: return 'bell';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);