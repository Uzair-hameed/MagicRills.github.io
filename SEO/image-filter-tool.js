// ==================== Global Variables ====================
const TOOL_ID = 'image_filter_tool';
let userId = getUserId();
let originalImage = null;
let currentImage = null;
let currentRotation = 0;
let currentFlipH = false;
let currentFlipV = false;
let isComparing = false;
let originalFilterValues = null;

// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const imageCanvas = document.getElementById('imageCanvas');
let ctx = null;

// Filter elements
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const temperature = document.getElementById('temperature');
const grayscale = document.getElementById('grayscale');
const sepia = document.getElementById('sepia');
const hue = document.getElementById('hue');
const invert = document.getElementById('invert');
const blur = document.getElementById('blur');

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

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'flex' : 'none';
}

function updateSliderDisplay() {
    document.getElementById('brightnessValue').textContent = brightness.value + '%';
    document.getElementById('contrastValue').textContent = contrast.value + '%';
    document.getElementById('saturationValue').textContent = saturation.value + '%';
    document.getElementById('temperatureValue').textContent = temperature.value;
    document.getElementById('grayscaleValue').textContent = grayscale.value + '%';
    document.getElementById('sepiaValue').textContent = sepia.value + '%';
    document.getElementById('hueValue').textContent = hue.value + '°';
    document.getElementById('invertValue').textContent = invert.value + '%';
    document.getElementById('blurValue').textContent = blur.value + 'px';
}

// ==================== Data Storage (LocalStorage with TiDB Ready) ====================
function getStorageData() {
    const key = `tool_${TOOL_ID}`;
    return JSON.parse(localStorage.getItem(key) || '{}');
}

function setStorageData(data) {
    const key = `tool_${TOOL_ID}`;
    localStorage.setItem(key, JSON.stringify(data));
}

async function incrementUsageCount() {
    const storage = getStorageData();
    storage.usageCount = (storage.usageCount || 0) + 1;
    setStorageData(storage);
    document.getElementById('usageCount').textContent = storage.usageCount;
}

async function loadUsageCount() {
    const storage = getStorageData();
    document.getElementById('usageCount').textContent = storage.usageCount || 0;
}

async function loadReactions() {
    const storage = getStorageData();
    const reactions = storage.reactions || { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
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
        showToast(`You already reacted with ${getEmojiName(emoji)}!`, 'error');
        return;
    }
    
    storage.reactions[emoji] = (storage.reactions[emoji] || 0) + 1;
    if (!storage.userReactions[userId]) storage.userReactions[userId] = {};
    storage.userReactions[userId][emoji] = true;
    setStorageData(storage);
    await loadReactions();
    showToast(`${getEmojiName(emoji)} reaction added!`);
}

function getEmojiName(emoji) {
    const names = { like: '👍 Like', love: '❤️ Love', wow: '😮 Wow', sad: '😢 Sad', angry: '😠 Angry', laugh: '😂 Laugh', celebrate: '🎉 Celebrate' };
    return names[emoji] || emoji;
}

async function loadShareCounts() {
    const storage = getStorageData();
    const shares = storage.shares || { facebook: 0, twitter: 0, linkedin: 0, whatsapp: 0, email: 0 };
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
    const title = encodeURIComponent('Image Filter Pro - Advanced Photo Filter Tool');
    let shareUrl = '';
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${title}%20${url}`; break;
        case 'email': shareUrl = `mailto:?subject=${title}&body=${url}`; break;
    }
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        recordShare(platform);
        showToast(`Shared on ${platform}!`);
    }
}

async function copyPageUrl() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
        const storage = getStorageData();
        storage.pageShares = (storage.pageShares || 0) + 1;
        setStorageData(storage);
    } catch (err) {
        showToast('Failed to copy link', 'error');
    }
}

// ==================== Image Processing ====================
function initCanvas() {
    if (imageCanvas) {
        ctx = imageCanvas.getContext('2d');
    }
}

function handleFiles(files) {
    if (!files.length) return;
    const file = files[0];
    if (!file.type.match('image.*')) {
        showToast('Please select an image file!', 'error');
        return;
    }
    
    showLoading(true);
    const reader = new FileReader();
    reader.onload = function(e) {
        originalImage = new Image();
        originalImage.onload = function() {
            currentImage = originalImage;
            currentRotation = 0;
            currentFlipH = false;
            currentFlipV = false;
            imageCanvas.width = originalImage.width;
            imageCanvas.height = originalImage.height;
            drawImage();
            showLoading(false);
            showToast('Image uploaded successfully!');
            incrementUsageCount();
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function getFilterString() {
    const brightnessVal = `brightness(${brightness.value}%)`;
    const contrastVal = `contrast(${contrast.value}%)`;
    const saturationVal = `saturate(${saturation.value}%)`;
    let filter = `${brightnessVal} ${contrastVal} ${saturationVal}`;
    
    if (grayscale.value > 0) filter += ` grayscale(${grayscale.value}%)`;
    if (sepia.value > 0) filter += ` sepia(${sepia.value}%)`;
    if (hue.value > 0) filter += ` hue-rotate(${hue.value}deg)`;
    if (invert.value > 0) filter += ` invert(${invert.value}%)`;
    if (blur.value > 0) filter += ` blur(${blur.value}px)`;
    
    const tempVal = parseInt(temperature.value);
    if (tempVal !== 0) {
        const temp = Math.abs(tempVal) / 100;
        if (tempVal > 0) filter += ` sepia(${temp}) hue-rotate(-30deg) saturate(1.5)`;
        else filter += ` sepia(${temp}) hue-rotate(30deg)`;
    }
    
    return filter;
}

function drawImage() {
    if (!currentImage || !ctx) return;
    
    imageCanvas.width = currentImage.width;
    imageCanvas.height = currentImage.height;
    
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    ctx.save();
    
    ctx.filter = getFilterString();
    
    ctx.translate(imageCanvas.width/2, imageCanvas.height/2);
    if (currentFlipH) ctx.scale(-1, 1);
    if (currentFlipV) ctx.scale(1, -1);
    ctx.rotate(currentRotation * Math.PI / 180);
    ctx.drawImage(currentImage, -currentImage.width/2, -currentImage.height/2);
    ctx.restore();
}

function applyFilters() {
    if (!currentImage) return;
    drawImage();
}

function resetFilters() {
    brightness.value = 100;
    contrast.value = 100;
    saturation.value = 100;
    temperature.value = 0;
    grayscale.value = 0;
    sepia.value = 0;
    hue.value = 0;
    invert.value = 0;
    blur.value = 0;
    currentRotation = 0;
    currentFlipH = false;
    currentFlipV = false;
    
    updateSliderDisplay();
    applyFilters();
    showToast('All filters reset!');
}

function toggleCompare() {
    if (!currentImage) {
        showToast('Please upload an image first!', 'error');
        return;
    }
    
    if (!isComparing) {
        originalFilterValues = {
            brightness: brightness.value, contrast: contrast.value, saturation: saturation.value,
            temperature: temperature.value, grayscale: grayscale.value, sepia: sepia.value,
            hue: hue.value, invert: invert.value, blur: blur.value
        };
        
        brightness.value = 100; contrast.value = 100; saturation.value = 100;
        temperature.value = 0; grayscale.value = 0; sepia.value = 0;
        hue.value = 0; invert.value = 0; blur.value = 0;
        
        updateSliderDisplay();
        applyFilters();
        isComparing = true;
        document.getElementById('compareBtn').innerHTML = '<i class="fas fa-eye"></i> Show Filtered';
        showToast('Showing original image');
    } else {
        if (originalFilterValues) {
            brightness.value = originalFilterValues.brightness;
            contrast.value = originalFilterValues.contrast;
            saturation.value = originalFilterValues.saturation;
            temperature.value = originalFilterValues.temperature;
            grayscale.value = originalFilterValues.grayscale;
            sepia.value = originalFilterValues.sepia;
            hue.value = originalFilterValues.hue;
            invert.value = originalFilterValues.invert;
            blur.value = originalFilterValues.blur;
            updateSliderDisplay();
            applyFilters();
        }
        isComparing = false;
        document.getElementById('compareBtn').innerHTML = '<i class="fas fa-eye-slash"></i> Compare Original';
        showToast('Showing filtered image');
    }
}

function applyPreset(preset) {
    switch(preset) {
        case 'vintage':
            brightness.value = 110; contrast.value = 90; saturation.value = 85;
            temperature.value = 20; sepia.value = 60; break;
        case 'blackWhite':
            brightness.value = 100; contrast.value = 120; saturation.value = 0;
            grayscale.value = 100; break;
        case 'cool':
            brightness.value = 100; contrast.value = 100; saturation.value = 120;
            temperature.value = -50; hue.value = 200; break;
        case 'warm':
            brightness.value = 110; contrast.value = 110; saturation.value = 120;
            temperature.value = 50; sepia.value = 20; hue.value = 30; break;
        case 'dramatic':
            brightness.value = 90; contrast.value = 130; saturation.value = 90;
            grayscale.value = 30; invert.value = 10; break;
    }
    updateSliderDisplay();
    applyFilters();
    showToast(`${preset} filter applied!`);
}

function rotateLeft() { currentRotation -= 90; drawImage(); showToast('Rotated Left'); }
function rotateRight() { currentRotation += 90; drawImage(); showToast('Rotated Right'); }
function flipHorizontal() { currentFlipH = !currentFlipH; drawImage(); showToast('Flipped Horizontal'); }
function flipVertical() { currentFlipV = !currentFlipV; drawImage(); showToast('Flipped Vertical'); }

function downloadImage() {
    if (!currentImage) {
        showToast('Please upload an image first!', 'error');
        return;
    }
    const format = document.querySelector('input[name="format"]:checked').value;
    let mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;
    let ext = format === 'jpg' ? 'jpg' : format;
    const link = document.createElement('a');
    link.download = `filtered-image.${ext}`;
    link.href = imageCanvas.toDataURL(mimeType, 0.9);
    link.click();
    showToast(`Image downloaded as ${format.toUpperCase()}!`);
}

function initThemeSwitcher() {
    const savedTheme = localStorage.getItem('theme') || 'default';
    document.body.className = `theme-${savedTheme}`;
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.body.className = `theme-${theme}`;
            localStorage.setItem('theme', theme);
            showToast(`Theme changed to ${theme}!`);
        });
    });
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

// ==================== Event Listeners ====================
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    
    // Upload events
    document.getElementById('uploadBtn').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('active'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('active'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        handleFiles(e.dataTransfer.files);
    });
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Sliders
    brightness.addEventListener('input', () => { updateSliderDisplay(); applyFilters(); });
    contrast.addEventListener('input', () => { updateSliderDisplay(); applyFilters(); });
    saturation.addEventListener('input', () => { updateSliderDisplay(); applyFilters(); });
    temperature.addEventListener('input', () => { updateSliderDisplay(); applyFilters(); });
    grayscale.addEventListener('input', () => { updateSliderDisplay(); applyFilters(); });
    sepia.addEventListener('input', () => { updateSliderDisplay(); applyFilters(); });
    hue.addEventListener('input', () => { updateSliderDisplay(); applyFilters(); });
    invert.addEventListener('input', () => { updateSliderDisplay(); applyFilters(); });
    blur.addEventListener('input', () => { updateSliderDisplay(); applyFilters(); });
    
    // Buttons
    document.getElementById('resetBtn').addEventListener('click', resetFilters);
    document.getElementById('compareBtn').addEventListener('click', toggleCompare);
    document.getElementById('rotateLeftBtn').addEventListener('click', rotateLeft);
    document.getElementById('rotateRightBtn').addEventListener('click', rotateRight);
    document.getElementById('flipHorizontalBtn').addEventListener('click', flipHorizontal);
    document.getElementById('flipVerticalBtn').addEventListener('click', flipVertical);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    document.getElementById('pageShareBtn').addEventListener('click', copyPageUrl);
    document.getElementById('backHomeBtn').addEventListener('click', () => window.location.href = '/');
    document.getElementById('shareToolBtn').addEventListener('click', copyPageUrl);
    
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
    });
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(reaction => {
        reaction.addEventListener('click', () => addReaction(reaction.dataset.emoji));
    });
    
    // Social share
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            shareOnSocial(icon.dataset.social);
        });
    });
    
    // Scroll buttons
    document.getElementById('scrollUpBtn').addEventListener('click', scrollToTop);
    document.getElementById('scrollDownBtn').addEventListener('click', scrollToBottom);
    
    window.addEventListener('scroll', () => {
        const upBtn = document.getElementById('scrollUpBtn');
        upBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
    });
});

// ==================== Initialize ====================
async function init() {
    showLoading(true);
    initThemeSwitcher();
    await loadUsageCount();
    await loadReactions();
    await loadShareCounts();
    showLoading(false);
    showToast('✨ Image Filter Pro is ready! Upload an image to start.');
}

init();
