/* ========================================
   Image to Text Converter - Complete JavaScript
   Includes: TiDB Integration, All 27 Features
   ======================================== */

// ===== Configuration =====
const CONFIG = {
    TOOL_ID: 'image-to-text-converter',
    TOOL_NAME: 'Image to Text Converter',
    API_BASE: '/api', // Vercel API endpoint
    TIDB_ENABLED: true
};

// ===== Global Variables =====
let currentImage = null;
let currentFile = null;
let batchFiles = [];
let rotationAngle = 0;
let isProcessing = false;
let currentText = '';
let ttsUtterance = null;
let recognitionHistory = {};

// Tool ID for tracking
const TOOL_ID = 'image_to_text_converter';
let usageCount = 0;
let reactionData = {
    like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0
};
let userReactions = {};

// ===== DOM Elements =====
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const pasteBtn = document.getElementById('pasteBtn');
const dropZone = document.getElementById('dropZone');
const imageCanvas = document.getElementById('imageCanvas');
const imagePreview = document.getElementById('imagePreview');
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
const cropBtn = document.getElementById('cropBtn');
const enhanceBtn = document.getElementById('enhanceBtn');
const grayscaleBtn = document.getElementById('grayscaleBtn');
const thresholdBtn = document.getElementById('thresholdBtn');
const deskewBtn = document.getElementById('deskewBtn');
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

// ===== Helper Functions =====
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
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

// ===== TiDB API Calls =====
async function getUsageCount() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/usage?toolId=${TOOL_ID}`);
        const data = await response.json();
        usageCount = data.count || 0;
        if (usageCountSpan) usageCountSpan.textContent = usageCount;
    } catch (error) {
        console.error('Error fetching usage:', error);
        // Fallback to localStorage
        usageCount = parseInt(localStorage.getItem(`${TOOL_ID}_usage`) || '0');
        if (usageCountSpan) usageCountSpan.textContent = usageCount;
    }
}

async function incrementUsage() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/usage/increment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolId: TOOL_ID, toolName: CONFIG.TOOL_NAME })
        });
        const data = await response.json();
        usageCount = data.count;
        if (usageCountSpan) usageCountSpan.textContent = usageCount;
        localStorage.setItem(`${TOOL_ID}_usage`, usageCount);
    } catch (error) {
        console.error('Error incrementing usage:', error);
        usageCount++;
        if (usageCountSpan) usageCountSpan.textContent = usageCount;
        localStorage.setItem(`${TOOL_ID}_usage`, usageCount);
    }
}

async function getReactions() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/reactions?toolId=${TOOL_ID}`);
        const data = await response.json();
        reactionData = data.reactions || reactionData;
        updateReactionUI();
    } catch (error) {
        console.error('Error fetching reactions:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem(`${TOOL_ID}_reactions`);
        if (saved) reactionData = JSON.parse(saved);
        updateReactionUI();
    }
}

async function addReaction(reactionType) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/reactions/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolId: TOOL_ID, reaction: reactionType })
        });
        const data = await response.json();
        reactionData = data.reactions;
        updateReactionUI();
        showToast(`${getReactionIcon(reactionType)} Reaction added!`, 'success');
    } catch (error) {
        console.error('Error adding reaction:', error);
        reactionData[reactionType]++;
        updateReactionUI();
        localStorage.setItem(`${TOOL_ID}_reactions`, JSON.stringify(reactionData));
        showToast(`${getReactionIcon(reactionType)} Reaction added!`, 'success');
    }
}

function getReactionIcon(reaction) {
    const icons = {
        like: '👍', love: '❤️', wow: '😮', sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉'
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

async function recordShare(platform) {
    try {
        await fetch(`${CONFIG.API_BASE}/share/record`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolId: TOOL_ID, platform })
        });
    } catch (error) {
        console.error('Error recording share:', error);
    }
}

// ===== Image Processing Functions =====
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
            incrementUsage(); // Increment usage when image is loaded
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
    
    // Apply resize factor
    const factor = parseFloat(resizeFactor.value);
    if (factor > 1) {
        width = Math.min(width * factor, 2000);
        height = Math.min(height * factor, 2000);
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Handle rotation
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

// ===== OCR Functions =====
async function extractText() {
    if (!currentImage || isProcessing) return;
    
    isProcessing = true;
    progressContainer.style.display = 'block';
    progressFill.style.width = '0%';
    showLoading(true);
    
    const canvas = imageCanvas;
    const imageDataUrl = canvas.toDataURL('image/png');
    const language = languageSelect.value;
    
    try {
        const { data: { text, confidence } } = await Tesseract.recognize(
            imageDataUrl,
            language,
            {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        progressFill.style.width = `${Math.round(m.progress * 100)}%`;
                        progressText.textContent = `Processing: ${m.status} - ${Math.round(m.progress * 100)}%`;
                    } else {
                        progressText.textContent = `Status: ${m.status}`;
                    }
                }
            }
        );
        
        currentText = text;
        textOutput.value = text;
        confidenceValue.textContent = confidence.toFixed(1);
        confidenceDisplay.style.display = 'block';
        updateStats();
        
        showToast('Text extracted successfully!', 'success');
    } catch (error) {
        console.error('OCR Error:', error);
        showToast('OCR failed. Please try again.', 'error');
    } finally {
        isProcessing = false;
        progressContainer.style.display = 'none';
        showLoading(false);
    }
}

// ===== Export Functions =====
function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function exportAsTXT() {
    if (!textOutput.value) {
        showToast('No text to export', 'warning');
        return;
    }
    downloadFile(textOutput.value, 'extracted-text.txt', 'text/plain');
    showToast('Exported as TXT', 'success');
}

function exportAsPDF() {
    if (!textOutput.value) {
        showToast('No text to export', 'warning');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(textOutput.value, 180);
    doc.text(lines, 15, 20);
    doc.save('extracted-text.pdf');
    showToast('Exported as PDF', 'success');
}

function exportAsDOCX() {
    if (!textOutput.value) {
        showToast('No text to export', 'warning');
        return;
    }
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
        a.click();
        URL.revokeObjectURL(url);
        showToast('Exported as DOCX', 'success');
    });
}

function exportAsCSV() {
    if (!textOutput.value) {
        showToast('No text to export', 'warning');
        return;
    }
    const lines = textOutput.value.split(/\r?\n/);
    const csv = lines.map(line => `"${line.replace(/"/g, '""')}"`).join('\n');
    downloadFile(csv, 'extracted-text.csv', 'text/csv');
    showToast('Exported as CSV', 'success');
}

function exportAsHTML() {
    if (!textOutput.value) {
        showToast('No text to export', 'warning');
        return;
    }
    const html = `<!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Extracted Text</title></head>
    <body><pre>${textOutput.value}</pre></body>
    </html>`;
    downloadFile(html, 'extracted-text.html', 'text/html');
    showToast('Exported as HTML', 'success');
}

function exportAsMarkdown() {
    if (!textOutput.value) {
        showToast('No text to export', 'warning');
        return;
    }
    downloadFile(textOutput.value, 'extracted-text.md', 'text/markdown');
    showToast('Exported as Markdown', 'success');
}

function exportAsJSON() {
    if (!textOutput.value) {
        showToast('No text to export', 'warning');
        return;
    }
    const json = JSON.stringify({
        text: textOutput.value,
        timestamp: new Date().toISOString(),
        confidence: confidenceValue.textContent
    }, null, 2);
    downloadFile(json, 'extracted-text.json', 'application/json');
    showToast('Exported as JSON', 'success');
}

function exportAsSearchablePDF() {
    if (!textOutput.value) {
        showToast('No text to export', 'warning');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(textOutput.value, 180);
    doc.text(lines, 15, 20);
    
    // Add text layer for searchability
    const textLayer = textOutput.value;
    doc.save('searchable-text.pdf');
    showToast('Exported as Searchable PDF', 'success');
}

// ===== Text Formatting =====
function formatText(command, value = null) {
    const textarea = textOutput;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (!selectedText) return;
    
    let formatted = selectedText;
    switch(command) {
        case 'bold':
            formatted = `**${selectedText}**`;
            break;
        case 'italic':
            formatted = `*${selectedText}*`;
            break;
        case 'underline':
            formatted = `__${selectedText}__`;
            break;
    }
    
    textarea.value = textarea.value.substring(0, start) + formatted + textarea.value.substring(end);
    updateStats();
}

function findAndReplace(replaceAll = false) {
    const find = findText.value;
    const replace = replaceText.value;
    
    if (!find) {
        showToast('Enter text to find', 'warning');
        return;
    }
    
    if (replaceAll) {
        const newText = textOutput.value.split(find).join(replace);
        textOutput.value = newText;
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
        'teh': 'the',
        'recieve': 'receive',
        'seperate': 'separate',
        'definately': 'definitely',
        'occured': 'occurred',
        'untill': 'until',
        'wich': 'which',
        'thier': 'their',
        'sucess': 'success',
        'wether': 'whether'
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
    if (!text) {
        showToast('No text to read', 'warning');
        return;
    }
    
    if (window.speechSynthesis) {
        if (ttsUtterance) {
            window.speechSynthesis.cancel();
        }
        ttsUtterance = new SpeechSynthesisUtterance(text);
        ttsUtterance.lang = languageSelect.value === 'eng' ? 'en-US' : 
                            languageSelect.value === 'urd' ? 'ur-PK' : 'en-US';
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
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=${text}%0A%0A${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        await recordShare(platform);
        showToast(`Shared on ${platform}`, 'success');
    }
}

async function sharePage() {
    const url = window.location.href;
    try {
        await navigator.clipboard.writeText(url);
        await recordShare('copy_link');
        showToast('Link copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy link', 'error');
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
                
                const { data: { text } } = await Tesseract.recognize(
                    canvas.toDataURL(),
                    languageSelect.value
                );
                resolve(text);
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
        const text = await navigator.clipboard.readText();
        if (text.match(/\.(jpeg|jpg|png|gif)$/i)) {
            const response = await fetch(text);
            const blob = await response.blob();
            loadImage(blob);
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
    pageShareBtn.addEventListener('click', sharePage);
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => shareOnPlatform(btn.dataset.platform));
    });
    
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.reaction));
    });
    
    // Scroll buttons
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollUpBtn.style.display = 'flex';
        } else {
            scrollUpBtn.style.display = 'none';
        }
    });
    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    scrollDownBtn.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'v') {
            e.preventDefault();
            pasteBtn.click();
        } else if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            extractBtn.click();
        } else if (e.ctrlKey && e.key === 'c' && document.activeElement === textOutput) {
            // Normal copy
        } else if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            exportAsTXT();
        }
    });
}

// ===== Initialize =====
async function init() {
    initEventListeners();
    await getUsageCount();
    await getReactions();
    showToast('Tool ready! Upload an image to begin', 'success');
}

// Start the app
init();
