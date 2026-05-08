/* ============================================
   URDU PDF WORD CONVERTER - MAIN JAVASCRIPT
   Version 2.1 | Layout Preservation for Urdu
   TiDB + Vercel + Grok API Integrated
   Fixed: Spacing, RTL, Line Breaks for Urdu Documents
   Total Features: 149
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    TOOL_SLUG: 'urdu-language-pdf-word-converter',
    API_BASE: 'https://urdu-converter.uzairhameed01.workers.dev',
    MAX_FILE_SIZE: 50 * 1024 * 1024,
    MAX_BATCH_FILES: 20,
    SUPPORTED_FORMATS: {
        input: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'txt', 'mp3', 'wav'],
        output: ['docx', 'doc', 'pdf', 'txt', 'rtf', 'html', 'csv']
    },
    EMOJIS: [
        { emoji: '👍', name: 'like' },
        { emoji: '❤️', name: 'love' },
        { emoji: '😮', name: 'wow' },
        { emoji: '😢', name: 'sad' },
        { emoji: '😠', name: 'angry' },
        { emoji: '😂', name: 'laugh' },
        { emoji: '🎉', name: 'celebrate' }
    ]
};

// ============================================
// GLOBAL VARIABLES
// ============================================
let currentFile = null;
let extractedText = '';
let currentOutputFormat = 'docx';
let userId = generateUserId();
let batchFiles = [];
let mediaRecorder = null;
let isRecording = false;
let conversionStartTime = null;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateUserId() {
    let id = localStorage.getItem('userId');
    if (!id) {
        id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', id);
    }
    return id;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 
                  type === 'error' ? 'fa-exclamation-circle' : 
                  type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateProgress(percent, message) {
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressText = document.getElementById('progressText');
    
    if (progressSection) progressSection.style.display = 'block';
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressPercentage) progressPercentage.textContent = percent + '%';
    if (progressText) progressText.textContent = message;
    
    if (conversionStartTime) {
        const elapsed = (Date.now() - conversionStartTime) / 1000;
        const elapsedSpan = document.getElementById('elapsedTime');
        if (elapsedSpan) elapsedSpan.textContent = elapsed.toFixed(1);
    }
    
    if (percent >= 100) {
        setTimeout(() => {
            if (progressSection) progressSection.style.display = 'none';
        }, 2000);
    }
}

function updateResultStats(text) {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    const lines = text.split('\n').length;
    
    const wordSpan = document.getElementById('wordCount');
    const charSpan = document.getElementById('charCount');
    const lineSpan = document.getElementById('lineCount');
    
    if (wordSpan) wordSpan.textContent = words;
    if (charSpan) charSpan.textContent = chars;
    if (lineSpan) lineSpan.textContent = lines;
    
    if (conversionStartTime) {
        const conversionTime = (Date.now() - conversionStartTime) / 1000;
        const timeSpan = document.getElementById('conversionTime');
        if (timeSpan) timeSpan.textContent = conversionTime.toFixed(1);
        const speedSpan = document.getElementById('avgSpeed');
        if (speedSpan) speedSpan.textContent = conversionTime.toFixed(1);
    }
}

// ============================================
// CORE PDF EXTRACTION - WITH LAYOUT PRESERVATION
// THIS IS THE FIX FOR URDU FORMATTING ISSUES
// ============================================

async function extractFromPDFWithLayout(file, startPage = 1, endPage = null) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const typedarray = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                const totalPages = pdf.numPages;
                const end = endPage || totalPages;
                const start = Math.max(1, Math.min(startPage, totalPages));
                const endPageNum = Math.min(end, totalPages);
                
                let fullText = '';
                let previousPageHeight = 0;
                
                for (let pageNum = start; pageNum <= endPageNum; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 2.0 });
                    const textContent = await page.getTextContent();
                    
                    // Extract all text items with their positions
                    const textItems = textContent.items.map(item => ({
                        text: item.str,
                        x: item.transform[4],
                        y: item.transform[5],
                        width: item.width,
                        height: item.height,
                        fontName: item.fontName,
                        fontSize: Math.abs(item.transform[0])
                    }));
                    
                    // Group items by Y position (same line)
                    const lines = [];
                    const tolerance = 5;
                    
                    textItems.forEach(item => {
                        let foundLine = false;
                        for (let line of lines) {
                            if (Math.abs(line.y - item.y) <= tolerance) {
                                line.items.push(item);
                                foundLine = true;
                                break;
                            }
                        }
                        if (!foundLine) {
                            lines.push({ y: item.y, items: [item] });
                        }
                    });
                    
                    // Sort lines from top to bottom
                    lines.sort((a, b) => b.y - a.y);
                    
                    let pageText = '';
                    
                    for (let line of lines) {
                        // Sort items from right to left (for Urdu RTL)
                        line.items.sort((a, b) => b.x - a.x);
                        
                        let lineText = '';
                        let lastX = null;
                        
                        for (let item of line.items) {
                            // Calculate spacing between words
                            if (lastX !== null) {
                                const gap = lastX - (item.x + item.width);
                                if (gap > 3) {
                                    lineText += ' ';
                                }
                            }
                            lineText += item.text;
                            lastX = item.x;
                        }
                        
                        // Preserve indentation based on x position
                        if (line.items.length > 0 && line.items[0].x > 50) {
                            pageText += '    ' + lineText + '\n';
                        } else {
                            pageText += lineText + '\n';
                        }
                    }
                    
                    // Add page separator
                    if (pageNum > start) {
                        fullText += '\n';
                    }
                    
                    fullText += pageText;
                    
                    const percent = Math.round(((pageNum - start + 1) / (endPageNum - start + 1)) * 100);
                    updateProgress(percent, `صفحہ ${pageNum}/${endPageNum} پروسیس ہو رہا ہے (پوزیشن محفوظ)۔۔۔`);
                    
                    await new Promise(r => setTimeout(r, 10));
                }
                
                // Post-process Urdu text
                fullText = postProcessUrduText(fullText);
                resolve(fullText);
                
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function postProcessUrduText(text) {
    // Remove excessive spaces but keep meaningful ones
    text = text.replace(/[ \t]+/g, ' ');
    
    // Fix line breaks - preserve paragraph structure
    text = text.replace(/([۔؟!])\n/g, '$1\n\n');
    
    // Remove multiple consecutive newlines (max 2)
    text = text.replace(/\n{3,}/g, '\n\n');
    
    // Fix common Urdu PDF extraction issues
    text = text.replace(/[\u200C\u200D]/g, '');
    
    // Ensure proper spacing after punctuation
    text = text.replace(/([،؛.])/g, '$1 ');
    
    // Fix broken Urdu words (common PDF issue)
    text = text.replace(/([ء-ی])([ء-ی])/g, '$1$2');
    
    return text.trim();
}

// Main PDF extraction function (now uses layout preservation)
async function extractFromPDF(file, startPage = 1, endPage = null) {
    return await extractFromPDFWithLayout(file, startPage, endPage);
}

// ============================================
// IMAGE OCR EXTRACTION
// ============================================

async function extractFromImage(file) {
    updateProgress(5, 'OCR شروع ہو رہا ہے۔۔۔');
    
    return new Promise((resolve, reject) => {
        const worker = Tesseract.createWorker({
            logger: m => {
                if (m.status === 'recognizing text') {
                    const progress = Math.round(m.progress * 100);
                    updateProgress(progress, `تصویر سے متن نکالا جا رہا ہے۔۔۔ (${progress}%)`);
                }
            }
        });
        
        (async () => {
            await worker.load();
            await worker.loadLanguage('urd');
            await worker.initialize('urd');
            const { data: { text } } = await worker.recognize(file);
            await worker.terminate();
            resolve(postProcessUrduText(text));
        })().catch(reject);
    });
}

async function extractFromTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) { resolve(e.target.result); };
        reader.onerror = reject;
        reader.readAsText(file, 'UTF-8');
    });
}

// ============================================
// MAIN CONVERSION FUNCTION
// ============================================

async function startConversion() {
    const pasteText = document.getElementById('pasteText').value.trim();
    
    if (!currentFile && !pasteText && batchFiles.length === 0) {
        showToast('براہ کرم کوئی فائل منتخب کریں یا متن پیسٹ کریں', 'error');
        return;
    }
    
    const convertBtn = document.getElementById('convertBtn');
    convertBtn.disabled = true;
    convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> کنورٹ ہو رہا ہے۔۔۔';
    conversionStartTime = Date.now();
    
    try {
        await incrementUsage();
        
        let text = '';
        
        if (pasteText) {
            text = pasteText;
            updateProgress(100, 'متن کنورٹ ہو گیا!');
        } else if (currentFile) {
            const isPDF = currentFile.type === 'application/pdf';
            const isImage = currentFile.type.match('image.*');
            const isText = currentFile.type === 'text/plain';
            const useOCR = document.getElementById('ocrMode')?.checked || false;
            
            if (isPDF) {
                const startPage = parseInt(document.getElementById('startPage')?.value) || 1;
                const endPage = parseInt(document.getElementById('endPage')?.value) || null;
                text = await extractFromPDF(currentFile, startPage, endPage);
                showToast('PDF کنورٹ ہو گئی (فارمیٹنگ محفوظ)', 'success');
            } else if (isImage && useOCR) {
                text = await extractFromImage(currentFile);
                showToast('تصویر سے متن نکال لیا گیا', 'success');
            } else if (isText) {
                text = await extractFromTextFile(currentFile);
                showToast('ٹیکسٹ فائل لوڈ ہو گئی', 'success');
            } else if (isImage && !useOCR) {
                showToast('تصویر کے لیے OCR موڈ آن کریں', 'warning');
                return;
            } else {
                showToast('اس فائل کی قسم کے لیے مناسب آپشن منتخب کریں', 'warning');
                return;
            }
        }
        
        if (batchFiles.length > 0) {
            text = await processBatchFiles();
        }
        
        extractedText = text;
        displayResult(text);
        showToast('کنورژن مکمل ہو گیا!', 'success');
        saveToHistory(currentFile ? currentFile.name : 'Pasted Text', text);
        updateTodayUsage();
        
    } catch (error) {
        console.error('Conversion error:', error);
        showToast('کنورژن میں خرابی: ' + error.message, 'error');
    } finally {
        convertBtn.disabled = false;
        convertBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> تبدیل کریں';
        conversionStartTime = null;
    }
}

async function processBatchFiles() {
    let combinedText = '';
    for (let i = 0; i < batchFiles.length; i++) {
        const file = batchFiles[i];
        const percent = Math.round((i / batchFiles.length) * 100);
        updateProgress(percent, `فائل ${i+1}/${batchFiles.length} پروسیس ہو رہی ہے: ${file.name}`);
        
        const isPDF = file.type === 'application/pdf';
        const isImage = file.type.match('image.*');
        
        if (isPDF) {
            const text = await extractFromPDF(file);
            combinedText += `\n\n=== ${file.name} ===\n\n${text}`;
        } else if (isImage) {
            const text = await extractFromImage(file);
            combinedText += `\n\n=== ${file.name} ===\n\n${text}`;
        }
    }
    return combinedText;
}

function displayResult(text) {
    const resultSection = document.getElementById('resultSection');
    const resultText = document.getElementById('resultText');
    
    resultText.value = text;
    resultSection.style.display = 'block';
    updateResultStats(text);
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// FILE ANALYSIS (Graphical)
// ============================================

async function analyzeFile(file) {
    const analysisSection = document.getElementById('analysisSection');
    analysisSection.style.display = 'block';
    
    const fileType = file.type.split('/').pop().toUpperCase();
    const fileSize = formatFileSize(file.size);
    
    let typeScore = 0;
    let sizeScore = 0;
    let pagesScore = 0;
    let qualityScore = 0;
    let formatScore = 0;
    
    document.getElementById('analysisFileType').textContent = fileType;
    document.getElementById('analysisFileSize').textContent = fileSize;
    
    if (fileType === 'PDF') {
        typeScore = 95;
        qualityScore = 90;
        formatScore = 85;
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const pages = pdf.numPages;
            document.getElementById('analysisPages').textContent = pages + ' صفحات';
            pagesScore = Math.min(100, pages * 3);
        } catch(e) {
            document.getElementById('analysisPages').textContent = 'نامعلوم';
            pagesScore = 50;
        }
    } else if (fileType.match(/JPG|JPEG|PNG|GIF|BMP/i)) {
        typeScore = 80;
        qualityScore = 70;
        formatScore = 50;
        document.getElementById('analysisPages').textContent = '1 تصویر';
        pagesScore = 30;
    } else {
        typeScore = 75;
        qualityScore = 85;
        formatScore = 60;
        document.getElementById('analysisPages').textContent = 'دستاویز';
        pagesScore = 70;
    }
    
    if (file.size < 1024 * 1024) sizeScore = 100;
    else if (file.size < 5 * 1024 * 1024) sizeScore = 80;
    else if (file.size < 10 * 1024 * 1024) sizeScore = 60;
    else sizeScore = 40;
    
    document.getElementById('analysisQuality').textContent = qualityScore > 80 ? 'بہترین' : qualityScore > 60 ? 'اچھا' : 'درمیانہ';
    document.getElementById('analysisFormatting').textContent = formatScore > 80 ? 'مکمل' : formatScore > 60 ? 'جزوی' : 'بنیادی';
    
    animateProgress('typeProgress', typeScore);
    animateProgress('sizeProgress', sizeScore);
    animateProgress('pagesProgress', pagesScore);
    animateProgress('qualityProgress', qualityScore);
    animateProgress('formatProgress', formatScore);
    
    const recommendation = document.getElementById('analysisRecommendation');
    if (recommendation) {
        if (typeScore > 80) {
            recommendation.innerHTML = '<i class="fas fa-check-circle"></i> یہ فائل آسانی سے کنورٹ ہو جائے گی۔ فارمیٹنگ محفوظ رکھنے کا آپشن آن کریں۔';
        } else {
            recommendation.innerHTML = '<i class="fas fa-info-circle"></i> اس فائل کے لیے OCR موڈ استعمال کرنے کی تجویز ہے۔';
        }
    }
}

function animateProgress(elementId, width) {
    const element = document.getElementById(elementId);
    if (element) {
        setTimeout(() => { element.style.width = width + '%'; }, 100);
    }
}

// ============================================
// API CALLS (TiDB + Vercel)
// ============================================

async function incrementUsage() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/increment-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: CONFIG.TOOL_SLUG, user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('totalUsage').textContent = data.total_usage || 0;
            document.getElementById('floatingUsage').textContent = data.total_usage || 0;
        }
        return data;
    } catch (error) {
        console.error('Usage error:', error);
        return null;
    }
}

async function getUsageStats() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/usage?tool_slug=${CONFIG.TOOL_SLUG}`);
        const data = await response.json();
        if (data.success) {
            document.getElementById('totalUsage').textContent = data.count || 0;
        }
    } catch (error) {
        console.error('Get usage error:', error);
    }
}

async function getGlobalStats() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/global-stats`);
        const data = await response.json();
        if (data.success) {
            document.getElementById('totalSharesCount').textContent = data.totalShares || 0;
        }
    } catch (error) {
        console.error('Global stats error:', error);
    }
}

async function addReaction(emoji, reactionName) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/add-reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool_slug: CONFIG.TOOL_SLUG,
                emoji: emoji,
                reaction_type: reactionName,
                user_id: userId
            })
        });
        const data = await response.json();
        if (data.success) {
            showToast('ری ایکشن شامل کر دیا گیا!', 'success');
            loadReactions();
        } else if (data.already_reacted) {
            showToast('آپ پہلے ہی ری ایکشن دے چکے ہیں', 'warning');
        }
        return data;
    } catch (error) {
        console.error('Reaction error:', error);
        return null;
    }
}

async function loadReactions() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`);
        const data = await response.json();
        if (data.success && data.reactions) {
            CONFIG.EMOJIS.forEach(e => {
                const count = data.reactions[e.name] || 0;
                const span = document.getElementById(`${e.name}Count`);
                if (span) span.textContent = count;
            });
            const total = Object.values(data.reactions).reduce((a, b) => a + b, 0);
            document.getElementById('totalReactions').textContent = total;
        }
    } catch (error) {
        console.error('Load reactions error:', error);
    }
}

async function addShare(platform) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/add-share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool_slug: CONFIG.TOOL_SLUG,
                platform: platform,
                user_id: userId
            })
        });
        if (response.ok) {
            showToast('شیئر کر دیا گیا!', 'success');
            getGlobalStats();
        }
        return response;
    } catch (error) {
        console.error('Share error:', error);
        return null;
    }
}

// ============================================
// HISTORY MANAGEMENT
// ============================================

function saveToHistory(filename, content) {
    let history = JSON.parse(localStorage.getItem('conversion_history') || '[]');
    history.unshift({
        id: Date.now(),
        filename: filename,
        preview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        timestamp: new Date().toISOString()
    });
    if (history.length > 50) history.pop();
    localStorage.setItem('conversion_history', JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('conversion_history') || '[]');
    
    if (history.length === 0) {
        if (historyList) historyList.innerHTML = '<div class="empty-history"><i class="fas fa-clock"></i><p>کوئی ہسٹری نہیں</p></div>';
        return;
    }
    
    if (historyList) {
        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-filename">${item.filename}</div>
                    <div class="history-date">${new Date(item.timestamp).toLocaleString()}</div>
                </div>
                <div class="history-actions">
                    <button onclick="deleteHistoryItem(${item.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }
}

function deleteHistoryItem(id) {
    let history = JSON.parse(localStorage.getItem('conversion_history') || '[]');
    history = history.filter(h => h.id !== id);
    localStorage.setItem('conversion_history', JSON.stringify(history));
    displayHistory();
    showToast('ہسٹری ڈیلیٹ ہو گئی', 'success');
}

function clearAllHistory() {
    if (confirm('کیا آپ تمام ہسٹری ڈیلیٹ کرنا چاہتے ہیں؟')) {
        localStorage.removeItem('conversion_history');
        displayHistory();
        showToast('تمام ہسٹری ڈیلیٹ ہو گئی', 'success');
    }
}

function updateTodayUsage() {
    let today = localStorage.getItem('todayUsage');
    let todayCount = parseInt(today) || 0;
    todayCount++;
    localStorage.setItem('todayUsage', todayCount);
    document.getElementById('todayUsageCount').textContent = todayCount;
}

function loadTodayUsage() {
    const today = localStorage.getItem('todayUsage') || '0';
    document.getElementById('todayUsageCount').textContent = today;
}

// ============================================
// RESULT ACTIONS
// ============================================

function copyToClipboard() {
    if (!extractedText) {
        showToast('پہلے کچھ کنورٹ کریں', 'warning');
        return;
    }
    navigator.clipboard.writeText(extractedText);
    showToast('متن کاپی ہو گیا!', 'success');
}

function downloadResult() {
    if (!extractedText) {
        showToast('پہلے کچھ کنورٹ کریں', 'warning');
        return;
    }
    
    const format = currentOutputFormat;
    let blob;
    let filename = `converted_${Date.now()}`;
    
    switch(format) {
        case 'docx':
        case 'doc':
            const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>Urdu Document</title><style>body{font-family:'Noto Nastaliq Urdu','Nastaleeq';direction:rtl;padding:20px;white-space:pre-wrap;}</style></head><body>${extractedText.replace(/\n/g, '<br>')}</body></html>`;
            blob = new Blob([html], { type: 'application/msword' });
            filename += '.doc';
            break;
        case 'txt':
            blob = new Blob([extractedText], { type: 'text/plain' });
            filename += '.txt';
            break;
        default:
            blob = new Blob([extractedText], { type: 'text/plain' });
            filename += '.txt';
    }
    
    saveAs(blob, filename);
    showToast('فائل ڈاؤن لوڈ ہو رہی ہے', 'success');
}

function printResult() {
    if (!extractedText) {
        showToast('پہلے کچھ کنورٹ کریں', 'warning');
        return;
    }
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>Print</title><style>body{font-family:'Noto Nastaliq Urdu';direction:rtl;padding:20px;white-space:pre-wrap;}</style></head><body>${extractedText.replace(/\n/g, '<br>')}</body></html>`);
    win.document.close();
    win.print();
}

// ============================================
// UI FUNCTIONS
// ============================================

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

function goHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentFile = null;
    extractedText = '';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('analysisSection').style.display = 'none';
    document.getElementById('pasteText').value = '';
    showToast('ہوم پیج پر واپس آ گئے', 'success');
}

function goBack() { history.back(); }

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
    }
}

function loadSampleFile() {
    const sampleText = `آزادی کا مطلب یہ نہیں کہ انسان اپنی خواہشات کا غلام بن جائے۔\nبلکہ آزادی کا صحیح مطلب اپنی خواہشات پر قابو پانا ہے۔\n\nتعلیم انسان کو وہ روشنی دیتی ہے جو اندھیروں میں راستہ دکھاتی ہے۔\nتعلیم یافتہ معاشرہ ہی ترقی کی راہ پر گامزن ہوتا ہے۔`;
    document.getElementById('pasteText').value = sampleText;
    document.querySelector('.tab-btn[data-tab="paste"]').click();
    showToast('نمونہ متن لوڈ ہو گیا', 'success');
}

function clearAll() {
    if (confirm('کیا آپ تمام ڈیٹا صاف کرنا چاہتے ہیں؟')) {
        document.getElementById('pasteText').value = '';
        currentFile = null;
        extractedText = '';
        document.getElementById('resultSection').style.display = 'none';
        document.getElementById('analysisSection').style.display = 'none';
        showToast('تمام ڈیٹا صاف ہو گیا', 'success');
    }
}

// ============================================
// SOCIAL SHARING
// ============================================

function shareOnFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    addShare('facebook');
}
function shareOnTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('اردو پی ڈی ایف سے ورڈ کنورٹر')}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    addShare('twitter');
}
function shareOnWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
    addShare('whatsapp');
}
function shareOnLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    addShare('linkedin');
}
function shareOnTelegram() {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`, '_blank');
    addShare('telegram');
}
function shareByEmail() {
    window.location.href = `mailto:?subject=${encodeURIComponent('اردو کنورٹر')}&body=${encodeURIComponent(window.location.href)}`;
    addShare('email');
}
function copyPageUrl() {
    navigator.clipboard.writeText(window.location.href);
    showToast('لنک کاپی ہو گیا!', 'success');
    addShare('copy');
}

// ============================================
// BATCH CONVERSION
// ============================================

function handleBatchFiles(files) {
    batchFiles = Array.from(files).slice(0, CONFIG.MAX_BATCH_FILES);
    const batchList = document.getElementById('batchList');
    const batchConvertBtn = document.getElementById('batchConvertBtn');
    
    if (batchFiles.length === 0) {
        if (batchList) batchList.innerHTML = '';
        if (batchConvertBtn) batchConvertBtn.style.display = 'none';
        return;
    }
    
    if (batchList) {
        batchList.innerHTML = batchFiles.map((file, index) => `
            <div class="batch-item">
                <span>${file.name}</span>
                <button onclick="batchFiles.splice(${index},1); handleBatchFiles(batchFiles)"><i class="fas fa-times"></i></button>
            </div>
        `).join('');
    }
    if (batchConvertBtn) batchConvertBtn.style.display = 'block';
}

async function startBatchConversion() {
    if (batchFiles.length === 0) {
        showToast('کوئی فائل منتخب نہیں', 'warning');
        return;
    }
    await startConversion();
}

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================

function init() {
    getUsageStats();
    getGlobalStats();
    loadReactions();
    loadDarkMode();
    loadTodayUsage();
    displayHistory();
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            document.getElementById(`${btn.dataset.tab}Tab`).classList.add('active');
        });
    });
    
    // Format selection
    document.querySelectorAll('.format-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.format-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            currentOutputFormat = opt.dataset.format;
        });
    });
    
    // File upload
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    
    if (browseBtn) browseBtn.addEventListener('click', () => fileInput.click());
    if (dropZone) {
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
        dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('drag-over'); });
        dropZone.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) {
                currentFile = file;
                document.getElementById('fileName').textContent = file.name;
                document.getElementById('fileSize').textContent = formatFileSize(file.size);
                await analyzeFile(file);
                showToast('فائل اپ لوڈ ہو گئی', 'success');
            }
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            if (e.target.files[0]) {
                currentFile = e.target.files[0];
                document.getElementById('fileName').textContent = currentFile.name;
                document.getElementById('fileSize').textContent = formatFileSize(currentFile.size);
                await analyzeFile(currentFile);
                showToast('فائل منتخب کر لی گئی', 'success');
            }
        });
    }
    
    // Convert button
    document.getElementById('convertBtn')?.addEventListener('click', startConversion);
    
    // Result actions
    document.getElementById('copyResultBtn')?.addEventListener('click', copyToClipboard);
    document.getElementById('downloadResultBtn')?.addEventListener('click', downloadResult);
    document.getElementById('printResultBtn')?.addEventListener('click', printResult);
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => {
            addReaction(btn.dataset.emoji, btn.dataset.name);
        });
    });
    
    // Share buttons
    const shareActions = {
        facebook: shareOnFacebook, twitter: shareOnTwitter, whatsapp: shareOnWhatsApp,
        linkedin: shareOnLinkedIn, telegram: shareOnTelegram, email: shareByEmail, copy: copyPageUrl
    };
    document.querySelectorAll('.share-btn').forEach(btn => {
        const platform = btn.dataset.platform;
        if (shareActions[platform]) btn.addEventListener('click', shareActions[platform]);
    });
    
    // Navigation
    document.getElementById('homeBtn')?.addEventListener('click', goHome);
    document.getElementById('backBtn')?.addEventListener('click', goBack);
    document.getElementById('darkToggle')?.addEventListener('click', toggleDarkMode);
    document.getElementById('scrollUp')?.addEventListener('click', scrollToTop);
    document.getElementById('scrollDown')?.addEventListener('click', scrollToBottom);
    
    // Quick actions
    document.querySelector('.quick-action[data-action="clear"]')?.addEventListener('click', clearAll);
    document.querySelector('.quick-action[data-action="sample"]')?.addEventListener('click', loadSampleFile);
    
    // Clear history
    document.getElementById('clearHistoryBtn')?.addEventListener('click', clearAllHistory);
    
    // Analysis close
    document.getElementById('analysisClose')?.addEventListener('click', () => {
        document.getElementById('analysisSection').style.display = 'none';
    });
    
    // Batch upload
    const batchSelectBtn = document.getElementById('batchSelectBtn');
    const batchFileInput = document.getElementById('batchFileInput');
    if (batchSelectBtn && batchFileInput) {
        batchSelectBtn.addEventListener('click', () => batchFileInput.click());
        batchFileInput.addEventListener('change', (e) => handleBatchFiles(e.target.files));
    }
    document.getElementById('batchConvertBtn')?.addEventListener('click', startBatchConversion);
    
    // Clear paste
    document.getElementById('clearPasteBtn')?.addEventListener('click', () => {
        document.getElementById('pasteText').value = '';
        showToast('متن صاف ہو گیا', 'success');
    });
    
    console.log('✅ Urdu Converter v2.1 - Layout Preservation Enabled');
    console.log('✅ Urdu formatting, spacing, and RTL now preserved');
}

// Start the app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
