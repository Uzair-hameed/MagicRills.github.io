// ==================== Cloudflare Workers API Configuration ====================
const API_BASE_URL = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

const TOOL_SLUG = 'image-converter-pro';
const TOOL_NAME = 'Image Converter Pro';

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
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    toast.style.background = type === 'error' ? '#dc3545' : '#28a745';
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'flex';
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'none';
}

// ==================== Cloudflare API Calls ====================
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`🌐 API Call: ${method} ${url}`);
        
        const response = await fetch(url, options);
        const responseData = await response.json();
        
        console.log(`📦 API Response:`, responseData);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${responseData.message || 'Unknown error'}`);
        }
        
        return responseData;
    } catch (error) {
        console.warn('⚠️ API Error, using localStorage fallback:', error.message);
        return handleLocalStorageFallback(endpoint, method, data);
    }
}

// ==================== LocalStorage Fallback ====================
function handleLocalStorageFallback(endpoint, method, data) {
    const storageKey = `tool_${TOOL_SLUG}`;
    let storage = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    // Initialize default stats if not exists
    if (!storage.stats) {
        storage.stats = {
            usage: 0,
            views: 0,
            shares: 0,
            followers: 0
        };
    }
    if (!storage.reactions) {
        storage.reactions = {
            like: 0,
            love: 0,
            wow: 0,
            sad: 0,
            angry: 0,
            laugh: 0,
            celebrate: 0
        };
    }
    if (!storage.shares) {
        storage.shares = {
            facebook: 0,
            twitter: 0,
            linkedin: 0,
            whatsapp: 0,
            email: 0,
            copy: 0
        };
    }
    if (!storage.userReactions) storage.userReactions = {};

    // Handle different endpoints
    if (endpoint === '/api/usage') {
        if (method === 'POST') {
            storage.stats.usage = (storage.stats.usage || 0) + 1;
            localStorage.setItem(storageKey, JSON.stringify(storage));
            return { 
                success: true, 
                count: storage.stats.usage,
                stats: storage.stats
            };
        }
    }

    if (endpoint === '/api/reactions') {
        if (method === 'GET') {
            return { 
                success: true, 
                reactions: storage.reactions 
            };
        }
        if (method === 'POST') {
            const emoji = data.emoji;
            if (!storage.userReactions[userId]) storage.userReactions[userId] = {};
            
            if (storage.userReactions[userId][emoji]) {
                return { 
                    success: false, 
                    already_reacted: true,
                    message: 'You already reacted with this emoji!'
                };
            }
            
            storage.reactions[emoji] = (storage.reactions[emoji] || 0) + 1;
            storage.userReactions[userId][emoji] = true;
            localStorage.setItem(storageKey, JSON.stringify(storage));
            return { 
                success: true, 
                reactions: storage.reactions 
            };
        }
    }

    if (endpoint === '/api/shares') {
        if (method === 'GET') {
            return { 
                success: true, 
                shares: storage.shares,
                stats: storage.stats
            };
        }
        if (method === 'POST') {
            const platform = data.platform;
            storage.shares[platform] = (storage.shares[platform] || 0) + 1;
            storage.stats.shares = (storage.stats.shares || 0) + 1;
            localStorage.setItem(storageKey, JSON.stringify(storage));
            return { 
                success: true, 
                shares: storage.shares,
                stats: storage.stats
            };
        }
    }

    if (endpoint === '/api/stats') {
        return { 
            success: true, 
            stats: storage.stats,
            reactions: storage.reactions,
            shares: storage.shares
        };
    }

    return { success: true };
}

// ==================== Stats Functions ====================
async function loadStats() {
    try {
        showLoading();
        const result = await apiCall(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        hideLoading();
        
        if (result && result.success) {
            updateStatsUI(result.stats || result);
            updateReactionsUI(result.reactions || {});
            updateSharesUI(result.shares || {});
            return result;
        }
        return null;
    } catch (error) {
        hideLoading();
        console.error('Error loading stats:', error);
        return null;
    }
}

async function incrementUsage() {
    try {
        const result = await apiCall('/api/usage', 'POST', {
            tool_slug: TOOL_SLUG,
            tool_name: TOOL_NAME,
            user_id: userId
        });
        
        if (result && result.success) {
            updateStatsUI(result.stats || { usage: result.count });
            console.log('📊 Usage incremented:', result.count);
        }
        return result;
    } catch (error) {
        console.error('Error incrementing usage:', error);
        return null;
    }
}

function updateStatsUI(stats) {
    const usageEl = document.getElementById('usageCount');
    const viewsEl = document.getElementById('viewsCount');
    const sharesEl = document.getElementById('sharesCount');
    const followersEl = document.getElementById('followersCount');
    
    if (usageEl) usageEl.textContent = stats.usage || 0;
    if (viewsEl) viewsEl.textContent = stats.views || 0;
    if (sharesEl) sharesEl.textContent = stats.shares || 0;
    if (followersEl) followersEl.textContent = stats.followers || 0;
}

function updateReactionsUI(reactions) {
    if (!reactions) return;
    for (const [emoji, count] of Object.entries(reactions)) {
        const reactionDiv = document.querySelector(`.reaction[data-emoji="${emoji}"] .reaction-count`);
        if (reactionDiv) reactionDiv.textContent = count;
    }
}

function updateSharesUI(shares) {
    if (!shares) return;
    for (const [platform, count] of Object.entries(shares)) {
        const shareSpan = document.querySelector(`.social-icon[data-social="${platform}"] .share-count`);
        if (shareSpan) shareSpan.textContent = count;
    }
}

// ==================== Reactions (7 Emojis) ====================
async function loadReactions() {
    const result = await apiCall('/api/reactions', 'GET');
    if (result && result.success && result.reactions) {
        updateReactionsUI(result.reactions);
    }
}

async function addReaction(emoji) {
    showLoading();
    const result = await apiCall('/api/reactions', 'POST', {
        tool_slug: TOOL_SLUG,
        user_id: userId,
        emoji: emoji
    });
    hideLoading();
    
    if (result && result.success) {
        updateReactionsUI(result.reactions);
        showToast(`✨ ${getEmojiName(emoji)} reaction added!`);
    } else if (result && result.already_reacted) {
        showToast(`⚠️ You already reacted with ${getEmojiName(emoji)}!`, 'error');
    }
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
    const result = await apiCall('/api/shares', 'GET');
    if (result && result.success && result.shares) {
        updateSharesUI(result.shares);
        updateStatsUI(result.stats || {});
    }
}

async function recordShare(platform) {
    const result = await apiCall('/api/shares', 'POST', {
        tool_slug: TOOL_SLUG,
        user_id: userId,
        platform: platform
    });
    
    if (result && result.success) {
        updateSharesUI(result.shares);
        updateStatsUI(result.stats || {});
        return true;
    }
    return false;
}

function shareOnSocial(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Image Converter Pro - Convert, Resize, Edit Images with 6 Formats');
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
        case 'copy':
            copyPageUrl();
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        recordShare(platform);
        showToast(`📤 Shared on ${platform}!`);
    }
}

// ==================== Page Share (Copy Link) ====================
async function copyPageUrl() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Link copied to clipboard!');
        await recordShare('copy');
    } catch (err) {
        // Fallback
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('🔗 Link copied to clipboard!');
        await recordShare('copy');
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
    
    if (format === 'jpg') format = 'jpeg';
    
    let mimeType = `image/${format}`;
    let downloadFormat = format === 'jpeg' ? 'jpg' : format;
    
    const link = document.createElement('a');
    link.download = `converted_image.${downloadFormat}`;
    link.href = canvas.toDataURL(mimeType, quality);
    link.click();
    
    let formatDisplay = format.toUpperCase();
    if (format === 'jpeg') formatDisplay = 'JPEG';
    showToast(`✅ Image converted to ${formatDisplay}!`);
    incrementUsage();
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

// ==================== AI Integration ====================
async function processWithAI() {
    if (!currentImage) {
        showToast('Please upload an image first!', 'error');
        return;
    }
    
    showLoading();
    showToast('🤖 AI is processing your image...', 'success');
    
    // Simulate AI processing delay
    setTimeout(() => {
        hideLoading();
        showToast('✨ AI enhanced your image! (Demo)');
        // Apply some AI-like enhancement
        applyAIEnhancement();
    }, 2000);
}

function applyAIEnhancement() {
    // Simple enhancement simulation
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        // Enhance contrast and brightness
        data[i] = Math.min(255, data[i] * 1.1 + 10);
        data[i + 1] = Math.min(255, data[i + 1] * 1.1 + 10);
        data[i + 2] = Math.min(255, data[i + 2] * 1.1 + 10);
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// ==================== Scroll Functions ====================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ==================== Theme Switcher ====================
function initThemeSwitcher() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
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

// ==================== Typewriter Effect ====================
function initTypewriter() {
    const element = document.getElementById('typewriter-text');
    if (!element) return;
    
    const words = [
        'Convert Images Instantly 🚀',
        '6 Formats Supported 📸',
        'AI Powered Enhancement 🤖',
        'Resize & Crop ✂️',
        'Remove Background 🧹',
        'Apply Filters 🎨'
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        const isComplete = charIndex === currentWord.length;
        
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let speed = isDeleting ? 50 : 100;
        
        if (!isDeleting && isComplete) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        }
        
        setTimeout(type, speed);
    }
    
    type();
}

// ==================== Event Listeners ====================
document.addEventListener('DOMContentLoaded', function() {
    // Image upload
    const imageInput = document.getElementById('imageInput');
    const uploadArea = document.getElementById('uploadArea');
    
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
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
    }
    
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            if (imageInput) imageInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#00d4ff';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'rgba(255,255,255,0.2)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(255,255,255,0.2)';
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
    }
    
    // Buttons
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) convertBtn.addEventListener('click', resizeAndConvert);
    
    const cropBtn = document.getElementById('cropBtn');
    if (cropBtn) cropBtn.addEventListener('click', cropImage);
    
    const removeBgBtn = document.getElementById('removeBgBtn');
    if (removeBgBtn) removeBgBtn.addEventListener('click', removeBackground);
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetImage);
    
    const rotateLeftBtn = document.getElementById('rotateLeftBtn');
    if (rotateLeftBtn) rotateLeftBtn.addEventListener('click', rotateLeft);
    
    const rotateRightBtn = document.getElementById('rotateRightBtn');
    if (rotateRightBtn) rotateRightBtn.addEventListener('click', rotateRight);
    
    const flipHBtn = document.getElementById('flipHorizontalBtn');
    if (flipHBtn) flipHBtn.addEventListener('click', flipHorizontal);
    
    const flipVBtn = document.getElementById('flipVerticalBtn');
    if (flipVBtn) flipVBtn.addEventListener('click', flipVertical);
    
    const pageShareBtn = document.getElementById('pageShareBtn');
    if (pageShareBtn) pageShareBtn.addEventListener('click', copyPageUrl);
    
    const backHomeBtn = document.getElementById('backHomeBtn');
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', () => {
            window.location.href = 'https://magicrills.com';
        });
    }
    
    const backCategoryBtn = document.getElementById('backCategoryBtn');
    if (backCategoryBtn) {
        backCategoryBtn.addEventListener('click', () => {
            window.location.href = 'https://magicrills.com/category-pages/mixed-tools.html';
        });
    }
    
    const aiBtn = document.getElementById('aiEnhanceBtn');
    if (aiBtn) aiBtn.addEventListener('click', processWithAI);
    
    // Quality slider
    const qualitySlider = document.getElementById('qualitySlider');
    if (qualitySlider) {
        qualitySlider.addEventListener('input', (e) => {
            const qualityValue = document.getElementById('qualityValue');
            if (qualityValue) qualityValue.textContent = e.target.value;
        });
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            drawImage();
            showToast(`🎨 ${btn.textContent} filter applied!`);
        });
    });
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(reaction => {
        reaction.addEventListener('click', () => {
            const emoji = reaction.dataset.emoji;
            addReaction(emoji);
        });
    });
    
    // Social icons
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = icon.dataset.social;
            shareOnSocial(platform);
        });
    });
    
    // Scroll buttons
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    
    if (scrollUpBtn) scrollUpBtn.addEventListener('click', scrollToTop);
    if (scrollDownBtn) scrollDownBtn.addEventListener('click', scrollToBottom);
    
    window.addEventListener('scroll', () => {
        if (scrollUpBtn) {
            if (window.scrollY > 200) {
                scrollUpBtn.style.display = 'flex';
            } else {
                scrollUpBtn.style.display = 'none';
            }
        }
    });
});

// ==================== Initialize ====================
async function init() {
    showLoading();
    
    // Theme
    initThemeSwitcher();
    
    // Typewriter
    initTypewriter();
    
    // Load stats
    await loadStats();
    
    // Load reactions
    await loadReactions();
    
    // Load shares
    await loadShareCounts();
    
    // Increment usage on load
    await incrementUsage();
    
    hideLoading();
    showToast('✨ Image Converter Pro ready!');
    console.log('🚀 Tool initialized:', TOOL_NAME);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
