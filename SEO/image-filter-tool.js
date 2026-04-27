// ==================== TiDB API Configuration ====================
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';  // Vercel will handle this automatically

const TOOL_ID = 'image_filter_tool';

// ==================== Global Variables ====================
let userId = getUserId();
let originalImage = null;
let currentImage = null;
let history = [];
let historyIndex = -1;
let isComparing = false;
let originalFilters = null;
let currentRotation = 0;
let currentFlipH = false;
let currentFlipV = false;

// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const imageCanvas = document.getElementById('imageCanvas');
const ctx = imageCanvas.getContext('2d');

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

function updateSliderValue(element, valueElement, suffix = '') {
    valueElement.textContent = element.value + suffix;
    applyFilters();
    saveToHistory();
}

// ==================== TiDB API Calls with LocalStorage Fallback ====================
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.warn('API Error, using localStorage fallback:', error);
        return handleLocalStorageFallback(endpoint, method, data);
    }
}

// LocalStorage Fallback Handler
function handleLocalStorageFallback(endpoint, method, data) {
    const storageKey = `tool_${TOOL_ID}`;
    let storage = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    // Usage Counter
    if (endpoint.includes('/usage')) {
        if (method === 'GET') {
            return { count: storage.usageCount || 0 };
        } else if (method === 'POST') {
            storage.usageCount = (storage.usageCount || 0) + 1;
            localStorage.setItem(storageKey, JSON.stringify(storage));
            return { count: storage.usageCount, success: true };
        }
    }
    
    // Reactions
    if (endpoint.includes('/reactions') && method === 'GET') {
        return { reactions: storage.reactions || { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 } };
    }
    
    if (endpoint.includes('/reaction') && method === 'POST') {
        const emoji = data.emoji;
        if (!storage.reactions) storage.reactions = {};
        if (!storage.userReactions) storage.userReactions = {};
        
        if (storage.userReactions[userId] && storage.userReactions[userId][emoji]) {
            return { success: false, already_reacted: true };
        }
        
        storage.reactions[emoji] = (storage.reactions[emoji] || 0) + 1;
        if (!storage.userReactions[userId]) storage.userReactions[userId] = {};
        storage.userReactions[userId][emoji] = true;
        
        localStorage.setItem(storageKey, JSON.stringify(storage));
        return { success: true };
    }
    
    // Social Shares
    if (endpoint.includes('/shares') && method === 'GET') {
        return { shares: storage.shares || { facebook: 0, twitter: 0, linkedin: 0, whatsapp: 0, email: 0 } };
    }
    
    if (endpoint.includes('/share') && method === 'POST') {
        const platform = data.platform;
        if (!storage.shares) storage.shares = {};
        storage.shares[platform] = (storage.shares[platform] || 0) + 1;
        localStorage.setItem(storageKey, JSON.stringify(storage));
        return { success: true };
    }
    
    // Page Share
    if (endpoint.includes('/page-share') && method === 'POST') {
        storage.pageShares = (storage.pageShares || 0) + 1;
        localStorage.setItem(storageKey, JSON.stringify(storage));
        return { success: true };
    }
    
    return { success: true };
}

// ==================== Usage Counter (TiDB Connected) ====================
async function incrementUsageCount() {
    const result = await apiCall(`/tool/${TOOL_ID}/usage`, 'POST', { user_id: userId });
    if (result && result.count !== undefined) {
        document.getElementById('usageCount').textContent = result.count;
        showToast('✅ Usage recorded!');
    }
}

async function loadUsageCount() {
    const result = await apiCall(`/tool/${TOOL_ID}/usage`);
    if (result && result.count !== undefined) {
        document.getElementById('usageCount').textContent = result.count;
    }
}

// ==================== Reactions (7 Emojis) - TiDB Connected ====================
async function loadReactions() {
    const result = await apiCall(`/tool/${TOOL_ID}/reactions`);
    if (result && result.reactions) {
        for (const [emoji, count] of Object.entries(result.reactions)) {
            const reactionDiv = document.querySelector(`.reaction[data-emoji="${emoji}"] .reaction-count`);
            if (reactionDiv) reactionDiv.textContent = count;
        }
    }
}

async function addReaction(emoji) {
    showLoading(true);
    const result = await apiCall(`/tool/${TOOL_ID}/reaction`, 'POST', { 
        user_id: userId, 
        emoji: emoji 
    });
    showLoading(false);
    
    if (result && result.success) {
        await loadReactions();
        showToast(`✨ ${getEmojiName(emoji)} reaction added!`);
    } else if (result && result.already_reacted) {
        showToast(`⚠️ You already reacted with ${getEmojiName(emoji)}!`, 'error');
    }
}

function getEmojiName(emoji) {
    const names = {
        like: '👍 Like', love: '❤️ Love', wow: '😮 Wow',
        sad: '😢 Sad', angry: '😠 Angry', laugh: '😂 Laugh', celebrate: '🎉 Celebrate'
    };
    return names[emoji] || emoji;
}

// ==================== Social Share (TiDB Connected) ====================
async function loadShareCounts() {
    const result = await apiCall(`/tool/${TOOL_ID}/shares`);
    if (result && result.shares) {
        for (const [platform, count] of Object.entries(result.shares)) {
            const shareSpan = document.querySelector(`.social-icon[data-social="${platform}"] .share-count`);
            if (shareSpan) shareSpan.textContent = count;
        }
    }
}

async function recordShare(platform) {
    const result = await apiCall(`/tool/${TOOL_ID}/share`, 'POST', {
        user_id: userId,
        platform: platform
    });
    
    if (result && result.success) {
        await loadShareCounts();
    }
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
        showToast(`📤 Shared on ${platform}!`);
    }
}

// ==================== Page Share (TiDB Connected) ====================
async function copyPageUrl() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Link copied to clipboard!');
        await apiCall(`/tool/${TOOL_ID}/page-share`, 'POST', { user_id: userId });
    } catch (err) {
        showToast('Failed to copy link', 'error');
    }
}

// ==================== Image Processing Functions ====================
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
            showToast('📸 Image uploaded successfully!');
            incrementUsageCount();
            saveToHistory();
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function drawImage() {
    if (!currentImage) return;
    
    let width = currentImage.width;
    let height = currentImage.height;
    
    imageCanvas.width = width;
    imageCanvas.height = height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    
    let filterString = getFilterString();
    ctx.filter = filterString;
    
    ctx.translate(width/2, height/2);
    
    if (currentFlipH) ctx.scale(-1, 1);
    if (currentFlipV) ctx.scale(1, -1);
    
    ctx.rotate(currentRotation * Math.PI / 180);
    ctx.drawImage(currentImage, -width/2, -height/2, width, height);
    ctx.restore();
}

function getFilterString() {
    const brightnessVal = `brightness(${brightness.value}%)`;
    const contrastVal = `contrast(${contrast.value}%)`;
    const saturationVal = `saturate(${saturation.value}%)`;
    const grayscaleVal = grayscale.value > 0 ? `grayscale(${grayscale.value}%)` : '';
    const sepiaVal = sepia.value > 0 ? `sepia(${sepia.value}%)` : '';
    const hueVal = hue.value > 0 ? `hue-rotate(${hue.value}deg)` : '';
    const invertVal = invert.value > 0 ? `invert(${invert.value}%)` : '';
    const blurVal = blur.value > 0 ? `blur(${blur.value}px)` : '';
    
    let filter = `${brightnessVal} ${contrastVal} ${saturationVal}`;
    if (grayscaleVal) filter += ` ${grayscaleVal}`;
    if (sepiaVal) filter += ` ${sepiaVal}`;
    if (hueVal) filter += ` ${hueVal}`;
    if (invertVal) filter += ` ${invertVal}`;
    if (blurVal) filter += ` ${blurVal}`;
    
    const tempVal = parseInt(temperature.value);
    if (tempVal !== 0) {
        const temp = Math.abs(tempVal) / 100;
        if (tempVal > 0) filter += ` sepia(${temp}) hue-rotate(-30deg) saturate(1.5)`;
        else filter += ` sepia(${temp}) hue-rotate(30deg)`;
    }
    
    return filter;
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
    
    document.getElementById('brightnessValue').textContent = '100%';
    document.getElementById('contrastValue').textContent = '100%';
    document.getElementById('saturationValue').textContent = '100%';
    document.getElementById('temperatureValue').textContent = '0';
    document.getElementById('grayscaleValue').textContent = '0%';
    document.getElementById('sepiaValue').textContent = '0%';
    document.getElementById('hueValue').textContent = '0°';
    document.getElementById('invertValue').textContent = '0%';
    document.getElementById('blurValue').textContent = '0px';
    
    applyFilters();
    showToast('🔄 All filters reset!');
    saveToHistory();
}

// History (Undo/Redo)
function saveToHistory() {
    if (!currentImage) return;
    
    const state = {
        brightness: brightness.value,
        contrast: contrast.value,
        saturation: saturation.value,
        temperature: temperature.value,
        grayscale: grayscale.value,
        sepia: sepia.value,
        hue: hue.value,
        invert: invert.value,
        blur: blur.value,
        rotation: currentRotation,
        flipH: currentFlipH,
        flipV: currentFlipV
    };
    
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    
    history.push(state);
    historyIndex = history.length - 1;
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        loadHistoryState(history[historyIndex]);
        showToast('↩️ Undo successful!');
    } else {
        showToast('Nothing to undo!', 'error');
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        loadHistoryState(history[historyIndex]);
        showToast('↪️ Redo successful!');
    } else {
        showToast('Nothing to redo!', 'error');
    }
}

function loadHistoryState(state) {
    brightness.value = state.brightness;
    contrast.value = state.contrast;
    saturation.value = state.saturation;
    temperature.value = state.temperature;
    grayscale.value = state.grayscale;
    sepia.value = state.sepia;
    hue.value = state.hue;
    invert.value = state.invert;
    blur.value = state.blur;
    currentRotation = state.rotation;
    currentFlipH = state.flipH;
    currentFlipV = state.flipV;
    
    document.getElementById('brightnessValue').textContent = state.brightness + '%';
    document.getElementById('contrastValue').textContent = state.contrast + '%';
    document.getElementById('saturationValue').textContent = state.saturation + '%';
    document.getElementById('temperatureValue').textContent = state.temperature;
    document.getElementById('grayscaleValue').textContent = state.grayscale + '%';
    document.getElementById('sepiaValue').textContent = state.sepia + '%';
    document.getElementById('hueValue').textContent = state.hue + '°';
    document.getElementById('invertValue').textContent = state.invert + '%';
    document.getElementById('blurValue').textContent = state.blur + 'px';
    
    applyFilters();
}

// Compare Original
function toggleCompare() {
    if (!originalImage) {
        showToast('Please upload an image first!', 'error');
        return;
    }
    
    if (!isComparing) {
        originalFilters = {
            brightness: brightness.value,
            contrast: contrast.value,
            saturation: saturation.value,
            temperature: temperature.value,
            grayscale: grayscale.value,
            sepia: sepia.value,
            hue: hue.value,
            invert: invert.value,
            blur: blur.value
        };
        
        brightness.value = 100;
        contrast.value = 100;
        saturation.value = 100;
        temperature.value = 0;
        grayscale.value = 0;
        sepia.value = 0;
        hue.value = 0;
        invert.value = 0;
        blur.value = 0;
        
        applyFilters();
        isComparing = true;
        document.getElementById('compareBtn').innerHTML = '<i class="fas fa-eye"></i> Show Filtered';
        showToast('👁️ Showing original image');
    } else {
        if (originalFilters) {
            brightness.value = originalFilters.brightness;
            contrast.value = originalFilters.contrast;
            saturation.value = originalFilters.saturation;
            temperature.value = originalFilters.temperature;
            grayscale.value = originalFilters.grayscale;
            sepia.value = originalFilters.sepia;
            hue.value = originalFilters.hue;
            invert.value = originalFilters.invert;
            blur.value = originalFilters.blur;
            
            applyFilters();
        }
        isComparing = false;
        document.getElementById('compareBtn').innerHTML = '<i class="fas fa-eye-slash"></i> Compare Original';
        showToast('🎨 Showing filtered image');
    }
}

// Preset Filters
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
    
    document.getElementById('brightnessValue').textContent = brightness.value + '%';
    document.getElementById('contrastValue').textContent = contrast.value + '%';
    document.getElementById('saturationValue').textContent = saturation.value + '%';
    document.getElementById('temperatureValue').textContent = temperature.value;
    document.getElementById('grayscaleValue').textContent = grayscale.value + '%';
    document.getElementById('sepiaValue').textContent = sepia.value + '%';
    document.getElementById('hueValue').textContent = hue.value + '°';
    document.getElementById('invertValue').textContent = invert.value + '%';
    
    applyFilters();
    showToast(`✨ ${preset} filter applied!`);
    saveToHistory();
}

// Transform Functions
function rotateLeft() { currentRotation -= 90; drawImage(); saveToHistory(); showToast('🔄 Rotated Left'); }
function rotateRight() { currentRotation += 90; drawImage(); saveToHistory(); showToast('🔄 Rotated Right'); }
function flipHorizontal() { currentFlipH = !currentFlipH; drawImage(); saveToHistory(); showToast('🪞 Flipped Horizontal'); }
function flipVertical() { currentFlipV = !currentFlipV; drawImage(); saveToHistory(); showToast('🪞 Flipped Vertical'); }

// Download Image
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
    
    showToast(`📥 Image downloaded as ${format.toUpperCase()}!`);
}

// Theme Switcher
function initThemeSwitcher() {
    const savedTheme = localStorage.getItem('theme') || 'default';
    document.body.className = `theme-${savedTheme}`;
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.body.className = `theme-${theme}`;
            localStorage.setItem('theme', theme);
            showToast(`🎨 Theme changed to ${theme}!`);
        });
    });
}

// Scroll Functions
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

// ==================== Event Listeners ====================
document.getElementById('uploadBtn').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('active'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('active'));
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('active');
    handleFiles(e.dataTransfer.files);
});

// Sliders
brightness.addEventListener('input', () => updateSliderValue(brightness, document.getElementById('brightnessValue'), '%'));
contrast.addEventListener('input', () => updateSliderValue(contrast, document.getElementById('contrastValue'), '%'));
saturation.addEventListener('input', () => updateSliderValue(saturation, document.getElementById('saturationValue'), '%'));
temperature.addEventListener('input', () => updateSliderValue(temperature, document.getElementById('temperatureValue')));
grayscale.addEventListener('input', () => updateSliderValue(grayscale, document.getElementById('grayscaleValue'), '%'));
sepia.addEventListener('input', () => updateSliderValue(sepia, document.getElementById('sepiaValue'), '%'));
hue.addEventListener('input', () => updateSliderValue(hue, document.getElementById('hueValue'), '°'));
invert.addEventListener('input', () => updateSliderValue(invert, document.getElementById('invertValue'), '%'));
blur.addEventListener('input', () => updateSliderValue(blur, document.getElementById('blurValue'), 'px'));

// Buttons
document.getElementById('resetBtn').addEventListener('click', resetFilters);
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('redoBtn').addEventListener('click', redo);
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

document.getElementById('cropBtn').addEventListener('click', () => showToast('Crop feature coming soon!', 'info'));

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
