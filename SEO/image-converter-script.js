// ==================== API Configuration ====================
const TOOL_ID = 'image_converter_tool';

// ==================== Global Variables ====================
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let originalImage = null;
let currentImage = null;
let currentRotation = 0;
let currentFlipH = false;
let currentFlipV = false;
let currentFilter = 'none';
let userId = getUserId();

// ==================== Helper Functions ====================
function getUserId() {
    let id = localStorage.getItem('user_id');
    if (!id) {
        id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('user_id', id);
    }
    return id;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    toast.style.background = type === 'error' ? '#dc3545' : '#28a745';
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// ==================== LocalStorage Data Management ====================
function getStorageData() {
    const key = `tool_${TOOL_ID}`;
    return JSON.parse(localStorage.getItem(key) || '{}');
}

function setStorageData(data) {
    const key = `tool_${TOOL_ID}`;
    localStorage.setItem(key, JSON.stringify(data));
}

// ==================== Usage Counter ====================
async function incrementUsageCount() {
    const storage = getStorageData();
    storage.usageCount = (storage.usageCount || 0) + 1;
    setStorageData(storage);
    document.getElementById('usageCount').textContent = storage.usageCount;
    showToast('✅ Tool usage recorded!');
}

async function loadUsageCount() {
    const storage = getStorageData();
    document.getElementById('usageCount').textContent = storage.usageCount || 0;
}

// ==================== Reactions (7 Emojis) ====================
async function loadReactions() {
    const storage = getStorageData();
    const reactions = storage.reactions || {
        like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0
    };
    
    for (const [emoji, count] of Object.entries(reactions)) {
        const reactionDiv = document.querySelector(`.reaction[data-emoji="${emoji}"] .reaction-count`);
        if (reactionDiv) reactionDiv.textContent = count;
    }
}

async function addReaction(emoji) {
    const storage = getStorageData();
    
    if (!storage.reactions) storage.reactions = {};
    if (!storage.userReactions) storage.userReactions = {};
    
    if (storage.userReactions[userId] && storage.userReactions[userId][emoji]) {
        showToast(`⚠️ You already reacted with ${getEmojiName(emoji)}!`, 'error');
        return;
    }
    
    storage.reactions[emoji] = (storage.reactions[emoji] || 0) + 1;
    
    if (!storage.userReactions[userId]) storage.userReactions[userId] = {};
    storage.userReactions[userId][emoji] = true;
    
    setStorageData(storage);
    await loadReactions();
    showToast(`✨ ${getEmojiName(emoji)} reaction added!`);
}

function getEmojiName(emoji) {
    const names = {
        like: '👍 Like',
        love: '❤️ Love',
        wow: '😮 Wow',
        sad: '😢 Sad',
        angry: '😠 Angry',
        laugh: '😂 Laugh',
        celebrate: '🎉 Celebrate'
    };
    return names[emoji] || emoji;
}

// ==================== Social Share ====================
async function loadShareCounts() {
    const storage = getStorageData();
    const shares = storage.shares || {
        facebook: 0, twitter: 0, linkedin: 0, whatsapp: 0, email: 0
    };
    
    for (const [platform, count] of Object.entries(shares)) {
        const shareSpan = document.querySelector(`.social-icon[data-social="${platform}"] .share-count`);
        if (shareSpan) shareSpan.textContent = count;
    }
}

async function recordShare(platform) {
    const storage = getStorageData();
    if (!storage.shares) storage.shares = {};
    storage.shares[platform] = (storage.shares[platform] || 0) + 1;
    setStorageData(storage);
    await loadShareCounts();
}

function shareOnSocial(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Image Converter Pro - Free Image Editing Tool with 6 Formats');
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        recordShare(platform);
        showToast(`📤 Shared on ${platform}!`);
    }
}

// ==================== Page Share ====================
async function copyPageUrl() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Link copied to clipboard!');
        
        const storage = getStorageData();
        storage.pageShares = (storage.pageShares || 0) + 1;
        setStorageData(storage);
    } catch (err) {
        showToast('Failed to copy link', 'error');
    }
}

// ==================== Image Processing Functions ====================
function drawImage() {
    if (!currentImage) return;
    
    let width = currentImage.width;
    let height = currentImage.height;
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    
    let filterValue = 'none';
    switch(currentFilter) {
        case 'grayscale': filterValue = 'grayscale(100%)'; break;
        case 'sepia': filterValue = 'sepia(100%)'; break;
        case 'blur': filterValue = 'blur(3px)'; break;
        case 'brightness': filterValue = 'brightness(1.3)'; break;
        case 'contrast': filterValue = 'contrast(1.3)'; break;
        default: filterValue = 'none';
    }
    ctx.filter = filterValue;
    
    ctx.translate(canvas.width/2, canvas.height/2);
    
    if (currentFlipH) ctx.scale(-1, 1);
    if (currentFlipV) ctx.scale(1, -1);
    
    ctx.rotate(currentRotation * Math.PI / 180);
    ctx.drawImage(currentImage, -width/2, -height/2, width, height);
    ctx.restore();
}

function resizeAndConvert() {
    if (!currentImage) {
        showToast('Please upload an image first!', 'error');
        return;
    }
    
    let format = document.getElementById('formatSelect').value;
    let quality = document.getElementById('qualitySlider').value / 100;
    const w = parseInt(document.getElementById('resizeWidth').value);
    const h = parseInt(document.getElementById('resizeHeight').value);
    
    let width = w || currentImage.width;
    let height = h || currentImage.height;
    
    canvas.width = width;
    canvas.height = height;
    ctx.filter = 'none';
    ctx.drawImage(currentImage, 0, 0, width, height);
    
    // Handle JPG same as JPEG
    if (format === 'jpg') format = 'jpeg';
    
    // For BMP and GIF, quality doesn't apply
    let mimeType = `image/${format}`;
    let downloadFormat = format === 'jpeg' ? 'jpg' : format;
    
    const link = document.createElement('a');
    link.download = `converted_image.${downloadFormat}`;
    link.href = canvas.toDataURL(mimeType, quality);
    link.click();
    
    let formatDisplay = format.toUpperCase();
    if (format === 'jpeg') formatDisplay = 'JPEG';
    showToast(`✅ Image converted to ${formatDisplay}!`);
    incrementUsageCount();
}

function cropImage() {
    if (!currentImage) {
        showToast('Please upload an image first!', 'error');
        return;
    }
    
    const side = Math.min(currentImage.width, currentImage.height);
    const sx = (currentImage.width - side) / 2;
    const sy = (currentImage.height - side) / 2;
    
    canvas.width = side;
    canvas.height = side;
    ctx.drawImage(currentImage, sx, sy, side, side, 0, 0, side, side);
    
    const img = new Image();
    img.onload = function() {
        currentImage = img;
        currentRotation = 0;
        currentFlipH = false;
        currentFlipV = false;
        currentFilter = 'none';
        drawImage();
    };
    img.src = canvas.toDataURL();
    
    showToast('✂️ Image cropped to center square!');
}

function removeBackground() {
    if (!currentImage) {
        showToast('Please upload an image first!', 'error');
        return;
    }
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        if (r > 200 && g > 200 && b > 200) {
            data[i + 3] = 0;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    showToast('🧹 White background removed!');
}

function resetImage() {
    if (originalImage) {
        currentImage = originalImage;
        currentRotation = 0;
        currentFlipH = false;
        currentFlipV = false;
        currentFilter = 'none';
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'none') btn.classList.add('active');
        });
        
        drawImage();
        showToast('🔄 Image reset to original!');
    }
}

function rotateLeft() {
    currentRotation -= 90;
    drawImage();
}

function rotateRight() {
    currentRotation += 90;
    drawImage();
}

function flipHorizontal() {
    currentFlipH = !currentFlipH;
    drawImage();
}

function flipVertical() {
    currentFlipV = !currentFlipV;
    drawImage();
}

// ==================== Scroll Functions ====================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ==================== Event Listeners ====================
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            currentImage = img;
            currentRotation = 0;
            currentFlipH = false;
            currentFlipV = false;
            currentFilter = 'none';
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            showToast('📸 Image uploaded successfully!');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('uploadArea').addEventListener('click', () => {
    document.getElementById('imageInput').click();
});

const uploadArea = document.getElementById('uploadArea');
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#667eea';
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ccc';
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ccc';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                originalImage = img;
                currentImage = img;
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                showToast('📸 Image uploaded via drag & drop!');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Buttons
document.getElementById('convertBtn').addEventListener('click', resizeAndConvert);
document.getElementById('cropBtn').addEventListener('click', cropImage);
document.getElementById('removeBgBtn').addEventListener('click', removeBackground);
document.getElementById('resetBtn').addEventListener('click', resetImage);
document.getElementById('rotateLeftBtn').addEventListener('click', rotateLeft);
document.getElementById('rotateRightBtn').addEventListener('click', rotateRight);
document.getElementById('flipHorizontalBtn').addEventListener('click', flipHorizontal);
document.getElementById('flipVerticalBtn').addEventListener('click', flipVertical);
document.getElementById('pageShareBtn').addEventListener('click', copyPageUrl);
document.getElementById('backHomeBtn').addEventListener('click', () => {
    window.location.href = '/';
});

document.getElementById('qualitySlider').addEventListener('input', (e) => {
    document.getElementById('qualityValue').textContent = e.target.value;
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        drawImage();
        showToast(`🎨 ${btn.textContent} filter applied!`);
    });
});

document.querySelectorAll('.reaction').forEach(reaction => {
    reaction.addEventListener('click', () => {
        const emoji = reaction.dataset.emoji;
        addReaction(emoji);
    });
});

document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = icon.dataset.social;
        shareOnSocial(platform);
    });
});

document.getElementById('scrollUpBtn').addEventListener('click', scrollToTop);
document.getElementById('scrollDownBtn').addEventListener('click', scrollToBottom);

window.addEventListener('scroll', () => {
    const upBtn = document.getElementById('scrollUpBtn');
    if (window.scrollY > 200) {
        upBtn.style.display = 'flex';
    } else {
        upBtn.style.display = 'none';
    }
});

// ==================== Initialize ====================
async function init() {
    showLoading();
    await loadUsageCount();
    await loadReactions();
    await loadShareCounts();
    hideLoading();
    showToast('✨ Tool ready! 6 formats available - PNG, JPEG, WEBP, BMP, JPG, GIF');
}

init();
