// DOM Elements
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const imagePreview = document.getElementById('image-preview');
const captionEditor = document.getElementById('caption-editor');
const outputSection = document.getElementById('output-section');
const outputContent = document.getElementById('output-content');
const downloadBtn = document.getElementById('download-btn');
const captionStyle = document.getElementById('caption-style');
const themeSwitch = document.getElementById('theme-switch');
const generateAICaption = document.getElementById('generate-ai-caption');
const aiLoading = document.getElementById('ai-loading');

// Global Variables
let uploadedImage = null;
let isDarkTheme = false;

// Initialize the tool
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', e => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
        uploadArea.style.transform = 'scale(1.02)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
        uploadArea.style.transform = 'scale(1)';
    });
    
    uploadArea.addEventListener('drop', e => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        uploadArea.style.transform = 'scale(1)';
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileUpload();
        }
    });
    
    // Theme toggle
    themeSwitch.addEventListener('click', toggleTheme);
    
    // AI caption generation
    generateAICaption.addEventListener('click', generateAICaptionHandler);
    
    // Initialize with placeholder text
    captionEditor.addEventListener('focus', function() {
        if (this.innerHTML === 'Start typing your caption here...') {
            this.innerHTML = '';
        }
    });
    
    captionEditor.addEventListener('blur', function() {
        if (this.innerHTML === '') {
            this.innerHTML = 'Start typing your caption here...';
        }
    });
});

// Handle file upload
function handleFileUpload() {
    const file = fileInput.files[0];
    if (file && file.type.match('image.*')) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit. Please choose a smaller image.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage = e.target.result;
            imagePreview.src = uploadedImage;
            imagePreview.classList.remove('hidden');
            uploadArea.style.display = 'none';
            
            // Add animation to image preview
            imagePreview.style.opacity = '0';
            imagePreview.style.transform = 'scale(0.8)';
            setTimeout(() => {
                imagePreview.style.opacity = '1';
                imagePreview.style.transform = 'scale(1)';
            }, 100);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a valid image file (JPG, PNG, GIF).');
    }
}

// Text formatting function
function formatText(cmd, value = null) {
    document.getElementById('caption-editor').focus();
    
    // Remove placeholder if it exists
    if (captionEditor.innerHTML === 'Start typing your caption here...') {
        captionEditor.innerHTML = '';
    }
    
    if (cmd === 'insertHTML') {
        document.execCommand('insertHTML', false, value);
    } else {
        document.execCommand(cmd, false, value);
    }
}

// Apply caption styles
function applyCaptionStyle(style, text) {
    let styledText = text;
    
    switch (style) {
        case 'modern':
            styledText = `<div style="font-family:'Montserrat',sans-serif;font-weight:600;color:var(--text-color);text-align:center;padding:15px;background:rgba(255,255,255,0.9);border-left:4px solid var(--primary-color);border-radius:4px;margin:10px 0">${text}</div>`;
            break;
        case 'vintage':
            styledText = `<div style="font-family:'Playfair Display',serif;font-style:italic;color:#5c4d3a;text-align:center;padding:15px;background:rgba(242,236,222,0.9);border:1px dashed #8b7d65;border-radius:4px;margin:10px 0">${text}</div>`;
            break;
        case 'elegant':
            styledText = `<div style="font-family:'Garamond',serif;color:#444;text-align:center;padding:15px;letter-spacing:1px;background:rgba(255,255,255,0.8);border-bottom:2px solid #d4af37;border-radius:4px;margin:10px 0">${text}</div>`;
            break;
        case 'bold':
            styledText = `<div style="font-family:'Impact',sans-serif;color:white;text-align:center;padding:15px;background:rgba(0,0,0,0.7);text-shadow:2px 2px 4px #000;border-radius:4px;margin:10px 0">${text}</div>`;
            break;
        case 'minimal':
            styledText = `<div style="font-family:'Helvetica Neue',sans-serif;color:var(--text-light);text-align:center;padding:10px;font-weight:300;letter-spacing:2px;margin:10px 0">${text}</div>`;
            break;
        case 'fun':
            styledText = `<div style="font-family:'Comic Sans MS',cursive;color:#e91e63;text-align:center;padding:15px;background:rgba(255,255,255,0.9);border-radius:10px;border:2px dotted #ff9800;margin:10px 0">${text}</div>`;
            break;
        default:
            styledText = `<div style="padding:10px;margin:10px 0">${text}</div>`;
    }
    
    return styledText;
}

// Generate output
function generateOutput() {
    if (!uploadedImage) {
        showNotification('Please upload an image first', 'warning');
        return;
    }
    
    const captionHtml = captionEditor.innerHTML;
    if (!captionHtml.replace(/<[^>]*>/g, '').trim() || 
        captionHtml === 'Start typing your caption here...') {
        showNotification('Please enter a caption', 'warning');
        return;
    }
    
    const selectedStyle = captionStyle.value;
    const styledCaption = applyCaptionStyle(selectedStyle, captionHtml);
    
    outputContent.innerHTML = `
        <div style="text-align:center;position:relative">
            <img src="${uploadedImage}" style="max-width:100%;border-radius:8px;box-shadow:var(--shadow)">
            <div style="margin-top:15px">${styledCaption}</div>
        </div>
    `;
    
    outputSection.classList.remove('hidden');
    downloadBtn.disabled = false;
    
    // Add animation to output
    outputSection.style.opacity = '0';
    outputSection.style.transform = 'translateY(20px)';
    setTimeout(() => {
        outputSection.style.opacity = '1';
        outputSection.style.transform = 'translateY(0)';
    }, 100);
    
    showNotification('Caption generated successfully!', 'success');
}

// Clear all function
function clearAll() {
    fileInput.value = '';
    uploadedImage = null;
    imagePreview.src = '';
    imagePreview.classList.add('hidden');
    uploadArea.style.display = 'flex';
    captionEditor.innerHTML = 'Start typing your caption here...';
    outputContent.innerHTML = '';
    outputSection.classList.add('hidden');
    downloadBtn.disabled = true;
    captionStyle.value = 'none';
    
    showNotification('All fields cleared', 'info');
}

// Download image function
async function downloadImage() {
    if (!outputContent.innerHTML) return;
    
    try {
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        downloadBtn.disabled = true;
        
        const canvas = await html2canvas(outputContent);
        const link = document.createElement('a');
        link.download = 'captioned-image.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
        downloadBtn.disabled = false;
        
        showNotification('Image downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error generating image:', error);
        showNotification('Error generating image. Please try again.', 'error');
        
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
        downloadBtn.disabled = false;
    }
}

// Theme toggle function
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme');
    
    if (isDarkTheme) {
        themeSwitch.innerHTML = '<i class="fas fa-sun"></i>';
        themeSwitch.title = 'Switch to Light Mode';
    } else {
        themeSwitch.innerHTML = '<i class="fas fa-moon"></i>';
        themeSwitch.title = 'Switch to Dark Mode';
    }
    
    // Save theme preference to localStorage
    localStorage.setItem('imageCaptionToolTheme', isDarkTheme ? 'dark' : 'light');
}

// AI Caption Generation (Simulated)
function generateAICaptionHandler() {
    if (!uploadedImage) {
        showNotification('Please upload an image first', 'warning');
        return;
    }
    
    generateAICaption.disabled = true;
    aiLoading.classList.remove('hidden');
    
    // Simulate AI processing time
    setTimeout(() => {
        // Sample AI-generated captions based on "image content"
        const sampleCaptions = [
            "A beautiful moment captured in time",
            "Memories that will last forever",
            "The beauty of nature in one frame",
            "A story told through a single image",
            "Capturing life's precious moments",
            "Where dreams and reality meet",
            "A glimpse into a perfect world"
        ];
        
        const randomCaption = sampleCaptions[Math.floor(Math.random() * sampleCaptions.length)];
        
        // Apply the caption
        captionEditor.innerHTML = randomCaption;
        
        generateAICaption.disabled = false;
        aiLoading.classList.add('hidden');
        
        showNotification('AI caption generated!', 'success');
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'error': return 'times-circle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#4CAF50';
        case 'warning': return '#FF9800';
        case 'error': return '#F44336';
        default: return '#2196F3';
    }
}

// Add CSS for notification animations
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
`;
document.head.appendChild(style);

// Load saved theme preference
window.addEventListener('load', function() {
    const savedTheme = localStorage.getItem('imageCaptionToolTheme');
    if (savedTheme === 'dark') {
        isDarkTheme = true;
        document.body.classList.add('dark-theme');
        themeSwitch.innerHTML = '<i class="fas fa-sun"></i>';
    }
});