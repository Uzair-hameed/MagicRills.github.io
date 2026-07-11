/* ============================================================
   Image to Text Converter - Complete JavaScript
   Using: Cloudflare Worker + OCR.space API
   اردو + عربی + 20+ زبانیں سپورٹ
   ============================================================ */

// ===== Configuration =====
const CONFIG = {
    WORKER_URL: 'https://image-to-text-converter.uzairhameed01.workers.dev',
    TOOL_ID: 'image-to-text-converter',
    TOOL_NAME: 'Image to Text Converter',
    TOOL_SLUG: 'image-to-text-converter',
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev'
};

// ===== Global Variables =====
let currentImage = null;
let currentFile = null;
let batchFiles = [];
let rotationAngle = 0;
let isProcessing = false;
let currentText = '';
let ttsUtterance = null;

// Stats
let usageCount = 0;
let viewsCount = 0;
let sharesCount = 0;
let followersCount = 0;
let reactionData = {
    like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0
};

// ===== DOM Elements =====
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const pasteBtn = document.getElementById('pasteBtn');
const dropZone = document.getElementById('dropZone');
const imageCanvas = document.getElementById('imageCanvas');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const extractBtn = document.getElementById('extractBtn');
const textOutput = document.getElementById('textOutput');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const languageSelect = document.getElementById('languageSelect');
const brightnessSlider = document.getElementById('brightnessSlider');
const contrastSlider = document.getElementById('contrastSlider');
const brightnessValue = document.getElementById('brightnessValue');
const contrastValue = document.getElementById('contrastValue');
const resizeFactor = document.getElementById('resizeFactor');
const resizeFactorValue = document.getElementById('resizeFactorValue');
const clearImageBtn = document.getElementById('clearImageBtn');
const clearTextBtn = document.getElementById('clearTextBtn');
const copyBtn = document.getElementById('copyBtn');
const rotateBtn = document.getElementById('rotateBtn');
const enhanceBtn = document.getElementById('enhanceBtn');
const grayscaleBtn = document.getElementById('grayscaleBtn');
const thresholdBtn = document.getElementById('thresholdBtn');
const noiseReduceBtn = document.getElementById('noiseReduceBtn');
const sharpenBtn = document.getElementById('sharpenBtn');
const ttsBtn = document.getElementById('ttsBtn');
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const underlineBtn = document.getElementById('underlineBtn');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const findReplaceBtn = document.getElementById('findReplaceBtn');
const findReplacePanel = document.getElementById('findReplacePanel');
const findText = document.getElementById('findText');
const replaceText = document.getElementById('replaceText');
const replaceBtn = document.getElementById('replaceBtn');
const replaceAllBtn = document.getElementById('replaceAllBtn');
const wordCountBtn = document.getElementById('wordCountBtn');
const statsPanel = document.getElementById('statsPanel');
const charCount = document.getElementById('charCount');
const wordCountSpan = document.getElementById('wordCount');
const lineCount = document.getElementById('lineCount');
const spellCheckBtn = document.getElementById('spellCheckBtn');
const confidenceDisplay = document.getElementById('confidenceDisplay');
const confidenceValue = document.getElementById('confidenceValue');
const qrResult = document.getElementById('qrResult');
const qrData = document.getElementById('qrData');
const batchContainer = document.getElementById('batchContainer');
const batchList = document.getElementById('batchList');
const batchCount = document.getElementById('batchCount');
const processAllBtn = document.getElementById('processAllBtn');
const processAllCount = document.getElementById('processAllCount');
const usageCountSpan = document.getElementById('usageCount');
const viewsCountSpan = document.getElementById('viewsCount');
const sharesCountSpan = document.getElementById('sharesCount');
const followersCountSpan = document.getElementById('followersCount');
const pageShareBtn = document.getElementById('pageShareBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');

// Export buttons
const exportTxtBtn = document.getElementById('exportTxtBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const exportDocxBtn = document.getElementById('exportDocxBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportHtmlBtn = document.getElementById('exportHtmlBtn');
const exportMdBtn = document.getElementById('exportMdBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const exportSearchablePdfBtn = document.getElementById('exportSearchablePdfBtn');

// ===== Typewriter Animation =====
const typewriterTexts = [
    'اردو', 'العربية', 'English', 'हिन्दी', 
    'Español', 'Français', 'Deutsch', '中文',
    'Türkçe', 'فارسی', 'Русский', '日本語'
];
let typewriterIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typewriterEffect() {
    const element = document.getElementById('typewriterText');
    if (!element) return;
    
    const currentText = typewriterTexts[typewriterIndex];
    
    if (!isDeleting) {
        element.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typewriterEffect, 2000);
            return;
        }
        setTimeout(typewriterEffect, 100);
    } else {
        element.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            typewriterIndex = (typewriterIndex + 1) % typewriterTexts.length;
            setTimeout(typewriterEffect, 500);
            return;
        }
        setTimeout(typewriterEffect, 50);
    }
}

// ===== Helper Functions =====
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-info-circle',
        info: 'fa-info-circle'
    };
    toast.innerHTML = `<i class="fas ${icons[type] || 'fa-check-circle'}"></i> ${message}`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showLoading(show) {
    if (show) {
        extractBtn.disabled = true;
        extractBtn.innerHTML = '<span class="spinner"></span> Processing...';
    } else {
        extractBtn.disabled = false;
        extractBtn.innerHTML = '<i class="fas fa-microphone-alt"></i> Extract Text';
    }
}

function updateStats() {
    const text = textOutput.value;
    charCount.textContent = text.length;
    wordCountSpan.textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
    lineCount.textContent = text.split(/\r\n|\r|\n/).length;
}

// ===== LocalStorage Helpers =====
function getLocalData(key, defaultValue) {
    try {
        const data = localStorage.getItem(`${CONFIG.TOOL_ID}_${key}`);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

function setLocalData(key, value) {
    try {
        localStorage.setItem(`${CONFIG.TOOL_ID}_${key}`, JSON.stringify(value));
    } catch (e) {
        console.error('LocalStorage error:', e);
    }
}

// ===== Cloudflare API Calls =====
async function apiCall(endpoint, method = 'GET', body = null) {
    const url = `${CONFIG.API_BASE}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': CONFIG.API_KEY
        }
    };
    if (body) options.body = JSON.stringify(body);
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        return null;
    }
}

// ===== Stats Functions =====
async function getToolStats() {
    try {
        const data = await apiCall(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`);
        if (data && data.success) {
            usageCount = data.usage || 0;
            viewsCount = data.views || 0;
            sharesCount = data.shares || 0;
            followersCount = data.followers || 0;
            updateStatsUI();
            return data;
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
    
    usageCount = getLocalData('usage', 0);
    viewsCount = getLocalData('views', 0);
    sharesCount = getLocalData('shares', 0);
    followersCount = getLocalData('followers', 0);
    updateStatsUI();
    return null;
}

function updateStatsUI() {
    if (usageCountSpan) usageCountSpan.textContent = usageCount;
    if (viewsCountSpan) viewsCountSpan.textContent = viewsCount;
    if (sharesCountSpan) sharesCountSpan.textContent = sharesCount;
    if (followersCountSpan) followersCountSpan.textContent = followersCount;
    if (document.getElementById('heroUsageCount')) {
        document.getElementById('heroUsageCount').textContent = usageCount;
        document.getElementById('heroViewsCount').textContent = viewsCount;
        document.getElementById('heroSharesCount').textContent = sharesCount;
        document.getElementById('heroFollowersCount').textContent = followersCount;
    }
}

async function incrementUsage() {
    try {
        const data = await apiCall('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            tool_name: CONFIG.TOOL_NAME
        });
        if (data && data.success) {
            usageCount = data.count || usageCount + 1;
        } else {
            usageCount++;
        }
    } catch (error) {
        usageCount++;
    }
    setLocalData('usage', usageCount);
    updateStatsUI();
}

async function incrementViews() {
    try {
        const data = await apiCall('/api/views', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG
        });
        if (data && data.success) {
            viewsCount = data.count || viewsCount + 1;
        } else {
            viewsCount++;
        }
    } catch (error) {
        viewsCount++;
    }
    setLocalData('views', viewsCount);
    updateStatsUI();
}

// ===== Reactions =====
async function getReactions() {
    try {
        const data = await apiCall(`/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`);
        if (data && data.success && data.reactions) {
            reactionData = data.reactions;
            updateReactionUI();
            setLocalData('reactions', reactionData);
            return;
        }
    } catch (error) {
        console.error('Error fetching reactions:', error);
    }
    
    reactionData = getLocalData('reactions', {
        like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0
    });
    updateReactionUI();
}

async function addReaction(reactionType) {
    try {
        const data = await apiCall('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            reaction: reactionType
        });
        if (data && data.success && data.reactions) {
            reactionData = data.reactions;
        } else {
            reactionData[reactionType] = (reactionData[reactionType] || 0) + 1;
        }
    } catch (error) {
        reactionData[reactionType] = (reactionData[reactionType] || 0) + 1;
    }
    setLocalData('reactions', reactionData);
    updateReactionUI();
    showToast(`${getReactionIcon(reactionType)} Reaction added!`, 'success');
}

function getReactionIcon(reaction) {
    const icons = {
        like: '👍', love: '❤️', wow: '😮', sad: '😢', 
        angry: '😠', laugh: '😂', celebrate: '🎉'
    };
    return icons[reaction] || '👍';
}

function updateReactionUI() {
    for (const [reaction, count] of Object.entries(reactionData)) {
        const btn = document.querySelector(`.reaction[data-reaction="${reaction}"]`);
        if (btn) {
            const countSpan = btn.querySelector('.reaction-count');
            if (countSpan) countSpan.textContent = count;
        }
    }
}

// ===== Share Functions =====
async function recordShare(platform) {
    try {
        await apiCall('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform
        });
        sharesCount++;
        setLocalData('shares', sharesCount);
        updateStatsUI();
    } catch (error) {
        sharesCount++;
        setLocalData('shares', sharesCount);
        updateStatsUI();
    }
}

// ===== Image Processing =====
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    if (files.length === 1) {
        loadImage(files[0]);
    } else {
        batchFiles = files;
        updateBatchUI();
    }
}

function loadImage(file) {
    currentFile = file;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            currentImage = img;
            drawImageToCanvas(img);
            imagePreviewContainer.style.display = 'block';
            detectQRCode(e.target.result);
            incrementUsage();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function drawImageToCanvas(img, applyFilters = false) {
    const canvas = imageCanvas;
    const ctx = canvas.getContext('2d');
    
    let width = img.width;
    let height = img.height;
    
    const factor = parseFloat(resizeFactor.value);
    if (factor > 1) {
        width = Math.min(width * factor, 2000);
        height = Math.min(height * factor, 2000);
    }
    
    canvas.width = width;
    canvas.height = height;
    
    if (rotationAngle === 90) {
        canvas.width = height;
        canvas.height = width;
        ctx.translate(canvas.width, 0);
        ctx.rotate(Math.PI / 2);
    } else if (rotationAngle === 180) {
        ctx.translate(canvas.width, canvas.height);
        ctx.rotate(Math.PI);
    } else if (rotationAngle === 270) {
        canvas.width = height;
        canvas.height = width;
        ctx.translate(0, canvas.height);
        ctx.rotate(Math.PI * 1.5);
    }
    
    ctx.drawImage(img, 0, 0, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    if (applyFilters) {
        applyBrightnessContrast();
    }
}

function applyBrightnessContrast() {
    const canvas = imageCanvas;
    const ctx = canvas.getContext('2d');
    const brightness = parseInt(brightnessSlider.value);
    const contrast = parseInt(contrastSlider.value) / 100;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128 + brightness));
        data[i+1] = Math.min(255, Math.max(0, factor * (data[i+1] - 128) + 128 + brightness));
        data[i+2] = Math.min(255, Math.max(0, factor * (data[i+2] - 128) + 128 + brightness));
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function applyGrayscale() {
    const canvas = imageCanvas;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114;
        data[i] = data[i+1] = data[i+2] = gray;
    }
    
    ctx.putImageData(imageData, 0, 0);
    showToast('Grayscale applied', 'success');
}

function applyThreshold() {
    const canvas = imageCanvas;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
        const value = brightness > 128 ? 255 : 0;
        data[i] = data[i+1] = data[i+2] = value;
    }
    
    ctx.putImageData(imageData, 0, 0);
    showToast('Threshold applied', 'success');
}

function applyNoiseReduction() {
    const canvas = imageCanvas;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    const output = new Uint8ClampedArray(data.length);
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            let sumR = 0, sumG = 0, sumB = 0;
            
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const nIdx = ((y + ky) * width + (x + kx)) * 4;
                    sumR += data[nIdx];
                    sumG += data[nIdx + 1];
                    sumB += data[nIdx + 2];
                }
            }
            
            output[idx] = sumR / 9;
            output[idx + 1] = sumG / 9;
            output[idx + 2] = sumB / 9;
            output[idx + 3] = data[idx + 3];
        }
    }
    
    for (let i = 0; i < data.length; i++) {
        data[i] = output[i];
    }
    
    ctx.putImageData(imageData, 0, 0);
    showToast('Noise reduction applied', 'success');
}

function applySharpen() {
    const canvas = imageCanvas;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    const output = new Uint8ClampedArray(data.length);
    
    const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            let r = 0, g = 0, b = 0;
            
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const nIdx = ((y + ky) * width + (x + kx)) * 4;
                    const k = kernel[(ky + 1) * 3 + (kx + 1)];
                    r += data[nIdx] * k;
                    g += data[nIdx + 1] * k;
                    b += data[nIdx + 2] * k;
                }
            }
            
            output[idx] = Math.min(255, Math.max(0, r));
            output[idx + 1] = Math.min(255, Math.max(0, g));
            output[idx + 2] = Math.min(255, Math.max(0, b));
            output[idx + 3] = data[idx + 3];
        }
    }
    
    for (let i = 0; i < data.length; i++) {
        data[i] = output[i];
    }
    
    ctx.putImageData(imageData, 0, 0);
    showToast('Sharpened', 'success');
}

function autoEnhance() {
    brightnessSlider.value = 20;
    contrastSlider.value = 120;
    brightnessValue.textContent = '20';
    contrastValue.textContent = '120';
    applyBrightnessContrast();
    applySharpen();
    showToast('Auto-enhance completed', 'success');
}

function rotateImage() {
    rotationAngle = (rotationAngle + 90) % 360;
    if (currentImage) {
        drawImageToCanvas(currentImage);
    }
}

async function detectQRCode(imageDataUrl) {
    try {
        if (typeof jsQR === 'undefined') return;
        
        const img = new Image();
        img.src = imageDataUrl;
        await new Promise(resolve => { img.onload = resolve; });
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        
        if (code) {
            qrData.textContent = code.data;
            qrResult.style.display = 'flex';
            showToast('QR Code detected!', 'success');
        }
    } catch (error) {
        console.error('QR detection error:', error);
    }
}

// ============================================================
// ===== MAIN OCR FUNCTION - Using Cloudflare Worker =====
// ============================================================
async function extractTextWithWorker(imageDataUrl, language = 'urd') {
    try {
        let imageData = imageDataUrl;
        if (imageData.startsWith('data:image')) {
            imageData = imageData.split(',')[1];
        }
        
        const response = await fetch(`${CONFIG.WORKER_URL}/api/ocr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: imageData,
                language: language,
                isOverlayRequired: false,
                isSearchablePdf: false,
                isTable: false,
                scale: true
            })
        });
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('OCR Error:', error);
        return {
            success: false,
            error: error.message || 'Network error'
        };
    }
}

// ===== Main Extract Function =====
async function extractText() {
    if (!currentImage || isProcessing) return;
    
    isProcessing = true;
    progressContainer.style.display = 'block';
    progressFill.style.width = '0%';
    showLoading(true);
    
    const canvas = imageCanvas;
    const imageDataUrl = canvas.toDataURL('image/png');
    const language = languageSelect.value;
    
    progressText.textContent = 'Sending to OCR API...';
    progressFill.style.width = '30%';
    
    try {
        const result = await extractTextWithWorker(imageDataUrl, language);
        
        progressFill.style.width = '80%';
        progressText.textContent = 'Processing result...';
        
        if (result.success) {
            let finalText = result.text || '';
            
            // Post-process for Urdu/Arabic
            if (language === 'urd') {
                finalText = postProcessUrdu(finalText);
            } else if (language === 'ara') {
                finalText = postProcessArabic(finalText);
            }
            
            currentText = finalText;
            textOutput.value = finalText;
            confidenceValue.textContent = result.confidence || 0;
            confidenceDisplay.style.display = 'block';
            updateStats();
            
            progressFill.style.width = '100%';
            progressText.textContent = 'Complete!';
            showToast(`Text extracted successfully! (${result.confidence || 0}% confidence)`, 'success');
        } else {
            showToast(`OCR failed: ${result.error || 'Unknown error'}`, 'error');
        }
        
    } catch (error) {
        console.error('OCR Error:', error);
        showToast('OCR failed. Please try again.', 'error');
    } finally {
        isProcessing = false;
        setTimeout(() => {
            progressContainer.style.display = 'none';
        }, 500);
        showLoading(false);
    }
}

// ===== Urdu Post-Processing =====
function postProcessUrdu(text) {
    let processed = text;
    
    const urduFixes = {
        'ي': 'ی', 'ة': 'ہ', 'ك': 'ک', 'ؤ': 'و',
        'ى': 'ی', 'ئ': 'ی', 'أ': 'ا', 'إ': 'ا', 'آ': 'ا'
    };
    
    for (const [from, to] of Object.entries(urduFixes)) {
        processed = processed.replace(new RegExp(from, 'g'), to);
    }
    
    const wordFixes = {
        'اللہ': 'الله',
        'محمد': 'محمد',
        'اسلام': 'اسلام'
    };
    
    for (const [from, to] of Object.entries(wordFixes)) {
        processed = processed.replace(new RegExp(from, 'g'), to);
    }
    
    processed = processed.replace(/\s+/g, ' ');
    return processed.trim();
}

// ===== Arabic Post-Processing =====
function postProcessArabic(text) {
    let processed = text;
    
    const arabicFixes = {
        'ي': 'ي', 'ة': 'ة', 'ك': 'ك',
        'ؤ': 'ؤ', 'ى': 'ى', 'ئ': 'ئ'
    };
    
    for (const [from, to] of Object.entries(arabicFixes)) {
        processed = processed.replace(new RegExp(from, 'g'), to);
    }
    
    processed = processed.replace(/\s+/g, ' ');
    return processed.trim();
}

// ===== Export Functions =====
function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportAsTXT() {
    if (!textOutput.value) { showToast('No text to export', 'warning'); return; }
    downloadFile(textOutput.value, 'extracted-text.txt', 'text/plain');
    showToast('Exported as TXT', 'success');
}

function exportAsPDF() {
    if (!textOutput.value) { showToast('No text to export', 'warning'); return; }
    if (typeof jspdf === 'undefined') { showToast('PDF library not loaded', 'error'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(textOutput.value, 180);
    doc.text(lines, 15, 20);
    doc.save('extracted-text.pdf');
    showToast('Exported as PDF', 'success');
}

function exportAsDOCX() {
    if (!textOutput.value) { showToast('No text to export', 'warning'); return; }
    if (typeof docx === 'undefined') { showToast('DOCX library not loaded', 'error'); return; }
    const { Document, Paragraph, TextRun, Packer } = docx;
    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({
                    children: [new TextRun(textOutput.value)]
                })
            ]
        }]
    });
    Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted-text.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Exported as DOCX', 'success');
    });
}

function exportAsCSV() {
    if (!textOutput.value) { showToast('No text to export', 'warning'); return; }
    const lines = textOutput.value.split(/\r?\n/);
    const csv = lines.map(line => `"${line.replace(/"/g, '""')}"`).join('\n');
    downloadFile(csv, 'extracted-text.csv', 'text/csv');
    showToast('Exported as CSV', 'success');
}

function exportAsHTML() {
    if (!textOutput.value) { showToast('No text to export', 'warning'); return; }
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Extracted Text</title></head><body><pre>${textOutput.value}</pre></body></html>`;
    downloadFile(html, 'extracted-text.html', 'text/html');
    showToast('Exported as HTML', 'success');
}

function exportAsMarkdown() {
    if (!textOutput.value) { showToast('No text to export', 'warning'); return; }
    downloadFile(textOutput.value, 'extracted-text.md', 'text/markdown');
    showToast('Exported as Markdown', 'success');
}

function exportAsJSON() {
    if (!textOutput.value) { showToast('No text to export', 'warning'); return; }
    const json = JSON.stringify({
        text: textOutput.value,
        timestamp: new Date().toISOString(),
        confidence: confidenceValue.textContent
    }, null, 2);
    downloadFile(json, 'extracted-text.json', 'application/json');
    showToast('Exported as JSON', 'success');
}

function exportAsSearchablePDF() {
    if (!textOutput.value) { showToast('No text to export', 'warning'); return; }
    if (typeof jspdf === 'undefined') { showToast('PDF library not loaded', 'error'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(textOutput.value, 180);
    doc.text(lines, 15, 20);
    doc.save('searchable-text.pdf');
    showToast('Exported as Searchable PDF', 'success');
}

// ===== Text Formatting =====
function formatText(command) {
    const textarea = textOutput;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    if (!selectedText) return;
    
    let formatted = selectedText;
    switch(command) {
        case 'bold': formatted = `**${selectedText}**`; break;
        case 'italic': formatted = `*${selectedText}*`; break;
        case 'underline': formatted = `__${selectedText}__`; break;
    }
    
    textarea.value = textarea.value.substring(0, start) + formatted + textarea.value.substring(end);
    updateStats();
}

function findAndReplace(replaceAll = false) {
    const find = findText.value;
    const replace = replaceText.value;
    if (!find) { showToast('Enter text to find', 'warning'); return; }
    
    if (replaceAll) {
        textOutput.value = textOutput.value.split(find).join(replace);
        showToast(`Replaced all "${find}" with "${replace}"`, 'success');
    } else {
        const start = textOutput.value.indexOf(find);
        if (start !== -1) {
            textOutput.focus();
            textOutput.setSelectionRange(start, start + find.length);
            showToast(`Found "${find}"`, 'success');
        } else {
            showToast(`"${find}" not found`, 'warning');
        }
    }
    updateStats();
}

function spellCheck() {
    const text = textOutput.value;
    const commonMisspellings = {
        'teh': 'the', 'recieve': 'receive', 'seperate': 'separate',
        'definately': 'definitely', 'occured': 'occurred', 'untill': 'until',
        'wich': 'which', 'thier': 'their', 'sucess': 'success', 'wether': 'whether'
    };
    
    let corrected = text;
    let corrections = 0;
    for (const [wrong, correct] of Object.entries(commonMisspellings)) {
        const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
        if (regex.test(corrected)) {
            corrected = corrected.replace(regex, correct);
            corrections++;
        }
    }
    
    if (corrections > 0) {
        textOutput.value = corrected;
        showToast(`${corrections} spelling corrections made`, 'success');
        updateStats();
    } else {
        showToast('No common spelling errors found', 'info');
    }
}

function textToSpeech() {
    const text = textOutput.value;
    if (!text) { showToast('No text to read', 'warning'); return; }
    
    if (window.speechSynthesis) {
        if (ttsUtterance) window.speechSynthesis.cancel();
        ttsUtterance = new SpeechSynthesisUtterance(text);
        const langMap = {
            'eng': 'en-US', 'urd': 'ur-PK', 'ara': 'ar-SA',
            'fra': 'fr-FR', 'deu': 'de-DE', 'hin': 'hi-IN',
            'spa': 'es-ES', 'chi_sim': 'zh-CN'
        };
        ttsUtterance.lang = langMap[languageSelect.value] || 'en-US';
        window.speechSynthesis.speak(ttsUtterance);
        showToast('Reading aloud...', 'success');
    } else {
        showToast('Text-to-speech not supported', 'error');
    }
}

// ===== Social Sharing =====
async function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Image to Text Converter - Magic Rills');
    const text = encodeURIComponent('Extract text from images instantly!');
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${text}%20${url}`; break;
        case 'email': shareUrl = `mailto:?subject=${title}&body=${text}%0A%0A${url}`; break;
        case 'copy': 
            await navigator.clipboard.writeText(window.location.href);
            await recordShare('copy_link');
            showToast('Link copied!', 'success');
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        await recordShare(platform);
        showToast(`Shared on ${platform}`, 'success');
    }
}

// ===== Batch Processing =====
function updateBatchUI() {
    if (batchFiles.length > 1) {
        batchContainer.style.display = 'block';
        batchCount.textContent = batchFiles.length;
        processAllCount.textContent = batchFiles.length;
        batchList.innerHTML = '';
        batchFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'batch-item';
            item.innerHTML = `
                <span><i class="fas fa-file-image"></i> ${file.name}</span>
                <button class="tool-icon" onclick="removeFromBatch(${index})"><i class="fas fa-trash"></i></button>
            `;
            batchList.appendChild(item);
        });
    } else {
        batchContainer.style.display = 'none';
    }
}

function removeFromBatch(index) {
    batchFiles.splice(index, 1);
    if (batchFiles.length === 0) {
        batchContainer.style.display = 'none';
        if (currentFile) loadImage(currentFile);
    } else if (batchFiles.length === 1) {
        loadImage(batchFiles[0]);
        batchFiles = [];
        batchContainer.style.display = 'none';
    } else {
        updateBatchUI();
    }
}

async function processAll() {
    if (batchFiles.length === 0) return;
    showLoading(true);
    let combinedText = '';
    
    for (let i = 0; i < batchFiles.length; i++) {
        progressText.textContent = `Processing ${i+1}/${batchFiles.length}: ${batchFiles[i].name}`;
        progressFill.style.width = `${((i+1)/batchFiles.length) * 100}%`;
        const text = await processSingleFile(batchFiles[i]);
        combinedText += `\n\n--- ${batchFiles[i].name} ---\n\n${text}`;
    }
    
    textOutput.value = combinedText;
    updateStats();
    showLoading(false);
    showToast(`Processed ${batchFiles.length} files`, 'success');
}

async function processSingleFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const img = new Image();
            img.onload = async function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const imageData = canvas.toDataURL('image/png');
                const language = languageSelect.value;
                
                const result = await extractTextWithWorker(imageData, language);
                resolve(result.text || '');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// ===== Event Listeners =====
function initEventListeners() {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary)';
    });
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border)';
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border)';
        const files = Array.from(e.dataTransfer.files);
        if (files.length) loadImage(files[0]);
    });
    
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text.match(/\.(jpeg|jpg|png|gif)$/i)) {
                const response = await fetch(text);
                const blob = await response.blob();
                loadImage(blob);
            }
        } catch (e) {
            showToast('Could not paste from clipboard', 'error');
        }
    });
    
    extractBtn.addEventListener('click', extractText);
    clearImageBtn.addEventListener('click', () => {
        currentImage = null;
        imagePreviewContainer.style.display = 'none';
        fileInput.value = '';
        showToast('Image cleared', 'success');
    });
    clearTextBtn.addEventListener('click', () => {
        textOutput.value = '';
        updateStats();
        showToast('Text cleared', 'success');
    });
    copyBtn.addEventListener('click', () => {
        textOutput.select();
        document.execCommand('copy');
        showToast('Text copied!', 'success');
    });
    
    rotateBtn.addEventListener('click', rotateImage);
    enhanceBtn.addEventListener('click', autoEnhance);
    grayscaleBtn.addEventListener('click', applyGrayscale);
    thresholdBtn.addEventListener('click', applyThreshold);
    noiseReduceBtn.addEventListener('click', applyNoiseReduction);
    sharpenBtn.addEventListener('click', applySharpen);
    ttsBtn.addEventListener('click', textToSpeech);
    
    brightnessSlider.addEventListener('input', () => {
        brightnessValue.textContent = brightnessSlider.value;
        if (currentImage) applyBrightnessContrast();
    });
    contrastSlider.addEventListener('input', () => {
        contrastValue.textContent = contrastSlider.value;
        if (currentImage) applyBrightnessContrast();
    });
    resizeFactor.addEventListener('input', () => {
        resizeFactorValue.textContent = `${resizeFactor.value}x`;
        if (currentImage) drawImageToCanvas(currentImage);
    });
    
    boldBtn.addEventListener('click', () => formatText('bold'));
    italicBtn.addEventListener('click', () => formatText('italic'));
    underlineBtn.addEventListener('click', () => formatText('underline'));
    fontFamilySelect.addEventListener('change', (e) => {
        textOutput.style.fontFamily = e.target.value;
    });
    fontSizeSelect.addEventListener('change', (e) => {
        textOutput.style.fontSize = e.target.value;
    });
    
    findReplaceBtn.addEventListener('click', () => {
        findReplacePanel.style.display = findReplacePanel.style.display === 'none' ? 'flex' : 'none';
    });
    replaceBtn.addEventListener('click', () => findAndReplace(false));
    replaceAllBtn.addEventListener('click', () => findAndReplace(true));
    
    wordCountBtn.addEventListener('click', () => {
        statsPanel.style.display = statsPanel.style.display === 'none' ? 'flex' : 'none';
        updateStats();
    });
    spellCheckBtn.addEventListener('click', spellCheck);
    
    exportTxtBtn.addEventListener('click', exportAsTXT);
    exportPdfBtn.addEventListener('click', exportAsPDF);
    exportDocxBtn.addEventListener('click', exportAsDOCX);
    exportCsvBtn.addEventListener('click', exportAsCSV);
    exportHtmlBtn.addEventListener('click', exportAsHTML);
    exportMdBtn.addEventListener('click', exportAsMarkdown);
    exportJsonBtn.addEventListener('click', exportAsJSON);
    exportSearchablePdfBtn.addEventListener('click', exportAsSearchablePDF);
    
    processAllBtn.addEventListener('click', processAll);
    pageShareBtn.addEventListener('click', () => shareOnPlatform('copy'));
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => shareOnPlatform(btn.dataset.platform));
    });
    
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.reaction));
    });
    
    window.addEventListener('scroll', () => {
        scrollUpBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
    });
    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    scrollDownBtn.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'v') { e.preventDefault(); pasteBtn.click(); }
        else if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); extractBtn.click(); }
        else if (e.ctrlKey && e.key === 's') { e.preventDefault(); exportAsTXT(); }
    });
}

// ===== Initialize =====
async function init() {
    setTimeout(typewriterEffect, 500);
    initEventListeners();
    await getToolStats();
    await getReactions();
    await incrementViews();
    showToast('Tool ready! Upload an image to begin', 'success');
}

document.addEventListener('DOMContentLoaded', init);
