// ============================================
// URDU PDF WORD CONVERTER - COMPLETE VERSION
// TiDB + Grok API + Vercel Integrated
// Version 3.0 | 4 Conversion Methods | Full Database Sync
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    TOOL_SLUG: 'urdu-pdf-converter',
    API_BASE: '/api',
    VERSION: '3.0',
    MAX_FILE_SIZE: 50 * 1024 * 1024
};

// User Session
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// Global Variables
let currentFile = null;
let extractedText = '';
let currentFormat = 'txt';
let currentMethod = 'standard';
let conversionHistory = [];
let conversionStartTime = 0;

// Statistics
let stats = {
    totalUsage: 0,
    totalReactions: { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 },
    totalShares: 0
};

// PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Urdu Converter v3.0 - TiDB + Grok API Integrated');
    
    // Load all data from database
    await loadAllData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load history from localStorage (fallback)
    loadLocalHistory();
    
    // Show welcome message
    showToast('خوش آمدید! اردو کنورٹر v3.0 تیار ہے - TiDB + Grok AI انٹیگریٹڈ', 'success');
});

// ============================================
// DATABASE API CALLS (TiDB via Backend)
// ============================================

// Load all data from database
async function loadAllData() {
    try {
        // Load usage stats
        const usageResponse = await fetch(`${CONFIG.API_BASE}/usage?tool_slug=${CONFIG.TOOL_SLUG}`);
        const usageData = await usageResponse.json();
        if (usageData.success) {
            stats.totalUsage = usageData.count || 0;
            updateUsageDisplay();
        }
        
        // Load reactions
        const reactionsResponse = await fetch(`${CONFIG.API_BASE}/reactions?tool_slug=${CONFIG.TOOL_SLUG}`);
        const reactionsData = await reactionsResponse.json();
        if (reactionsData.success && reactionsData.reactions) {
            stats.totalReactions = reactionsData.reactions;
            updateReactionsDisplay();
        }
        
        // Load shares
        const sharesResponse = await fetch(`${CONFIG.API_BASE}/shares?tool_slug=${CONFIG.TOOL_SLUG}`);
        const sharesData = await sharesResponse.json();
        if (sharesData.success) {
            stats.totalShares = sharesData.count || 0;
            updateSharesDisplay();
        }
    } catch (error) {
        console.error('Error loading data from database:', error);
        // Use localStorage as fallback
        loadLocalStats();
    }
}

// Increment usage in database
async function incrementUsageInDB() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/increment-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool_slug: CONFIG.TOOL_SLUG,
                user_id: userId
            })
        });
        const data = await response.json();
        if (data.success) {
            stats.totalUsage = data.total_usage || stats.totalUsage + 1;
            updateUsageDisplay();
        }
    } catch (error) {
        console.error('Error incrementing usage:', error);
        // Local fallback
        stats.totalUsage++;
        updateUsageDisplay();
        saveLocalStats();
    }
}

// Add reaction to database
async function addReactionToDB(emoji, reactionType) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/add-reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool_slug: CONFIG.TOOL_SLUG,
                emoji: emoji,
                reaction_type: reactionType,
                user_id: userId
            })
        });
        const data = await response.json();
        
        if (data.success) {
            showToast(`شکریہ! آپ کا ردعمل ${emoji} محفوظ ہو گیا`, 'success');
            // Reload reactions to get updated counts
            await loadAllData();
        } else if (data.already_reacted) {
            showToast('آپ پہلے ہی اس ایموجی پر ردعمل دے چکے ہیں', 'warning');
        }
        return data.success;
    } catch (error) {
        console.error('Error adding reaction:', error);
        // Local fallback
        if (stats.totalReactions[reactionType] !== undefined) {
            stats.totalReactions[reactionType]++;
            updateReactionsDisplay();
            saveLocalStats();
        }
        showToast(`شکریہ! آپ کا ردعمل ${emoji} (مقامی طور پر محفوظ)`, 'success');
        return true;
    }
}

// Add share to database
async function addShareToDB(platform) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/add-share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool_slug: CONFIG.TOOL_SLUG,
                platform: platform,
                user_id: userId
            })
        });
        const data = await response.json();
        if (data.success) {
            stats.totalShares++;
            updateSharesDisplay();
        }
    } catch (error) {
        console.error('Error adding share:', error);
        stats.totalShares++;
        updateSharesDisplay();
        saveLocalStats();
    }
}

// AI Text Repair using Grok API
async function repairTextWithGrokAPI(corruptedText) {
    if (!corruptedText || corruptedText.length < 50) {
        return corruptedText;
    }
    
    try {
        const response = await fetch(`${CONFIG.API_BASE}/repair-urdu-text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: corruptedText.substring(0, 8000),
                tool_slug: CONFIG.TOOL_SLUG
            })
        });
        
        const data = await response.json();
        if (data.success && data.repaired_text) {
            showToast('AI نے متن کو بہتر کر دیا ہے', 'success');
            return data.repaired_text;
        }
        return corruptedText;
    } catch (error) {
        console.error('Grok API error:', error);
        showToast('AI سروس دستیاب نہیں، معیاری طریقہ استعمال ہو رہا ہے', 'warning');
        return corruptedText;
    }
}

// ============================================
// LOCAL STORAGE FALLBACK
// ============================================
function saveLocalStats() {
    localStorage.setItem('converter_stats', JSON.stringify({
        totalUsage: stats.totalUsage,
        totalReactions: stats.totalReactions,
        totalShares: stats.totalShares
    }));
}

function loadLocalStats() {
    const saved = localStorage.getItem('converter_stats');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            stats.totalUsage = data.totalUsage || 0;
            stats.totalReactions = data.totalReactions || { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
            stats.totalShares = data.totalShares || 0;
            updateUsageDisplay();
            updateReactionsDisplay();
            updateSharesDisplay();
        } catch(e) {}
    }
}

function saveLocalHistory() {
    localStorage.setItem('converter_history', JSON.stringify(conversionHistory));
}

function loadLocalHistory() {
    const saved = localStorage.getItem('converter_history');
    if (saved) {
        try {
            conversionHistory = JSON.parse(saved);
            displayHistory();
        } catch(e) {}
    }
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================
function updateUsageDisplay() {
    const elements = ['totalUsage', 'heroTotalConversions'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = stats.totalUsage;
    });
    
    // Today's usage (estimate - last 24 hours from localStorage)
    const todayUsage = localStorage.getItem('todayUsage') || Math.floor(stats.totalUsage * 0.05);
    const todayEl = document.getElementById('todayUsage');
    if (todayEl) todayEl.innerText = todayUsage;
}

function updateReactionsDisplay() {
    const mapping = {
        likeCount: 'like',
        loveCount: 'love',
        wowCount: 'wow',
        sadCount: 'sad',
        angryCount: 'angry',
        laughCount: 'laugh',
        celebrateCount: 'celebrate'
    };
    
    for (const [elementId, reactionKey] of Object.entries(mapping)) {
        const el = document.getElementById(elementId);
        if (el && stats.totalReactions[reactionKey] !== undefined) {
            el.innerText = stats.totalReactions[reactionKey];
        }
    }
    
    const totalReactions = Object.values(stats.totalReactions).reduce((a, b) => a + b, 0);
    const totalReactionsEl = document.getElementById('totalReactions');
    if (totalReactionsEl) totalReactionsEl.innerText = totalReactions;
    
    const heroTotalReactions = document.getElementById('heroTotalReactions');
    if (heroTotalReactions) heroTotalReactions.innerText = totalReactions;
}

function updateSharesDisplay() {
    const elements = ['totalSharesCount', 'heroTotalShares'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = stats.totalShares;
    });
}

// ============================================
// PDF TEXT EXTRACTION METHODS
// ============================================

// Method 1: Standard Extraction
async function extractStandard(file, progressCallback) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(e.target.result) }).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    let pageText = '';
                    for (let item of content.items) {
                        pageText += item.str + ' ';
                    }
                    fullText += pageText + '\n\n';
                    if (progressCallback) progressCallback(i, pdf.numPages);
                }
                resolve(fullText);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Method 2: Smart Position-Based Extraction
async function extractSmart(file, progressCallback) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(e.target.result) }).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    let lastX = null, lastY = null;
                    let currentLine = [];
                    
                    for (let item of textContent.items) {
                        const x = item.transform[4];
                        const y = item.transform[5];
                        
                        if (lastY !== null && Math.abs(y - lastY) > 5) {
                            currentLine.sort((a, b) => a.x - b.x);
                            fullText += currentLine.map(i => i.str).join(' ') + '\n';
                            currentLine = [];
                        }
                        
                        if (lastX !== null && (x - lastX) > (item.width || 10) * 0.5) {
                            currentLine.push({ x: lastX + 999, str: ' ' });
                        }
                        
                        currentLine.push({ x: x, str: item.str });
                        lastX = x;
                        lastY = y;
                    }
                    
                    if (currentLine.length) {
                        currentLine.sort((a, b) => a.x - b.x);
                        fullText += currentLine.map(i => i.str).join(' ');
                    }
                    fullText += '\n\n';
                    if (progressCallback) progressCallback(i, pdf.numPages);
                }
                resolve(fullText);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Method 3: Enhanced Rule-Based Urdu Fix
function enhanceUrduText(text) {
    if (!text) return '';
    
    let fixed = text;
    
    // Rule 1: Add space after sentence terminators
    fixed = fixed.replace(/([۔؟!])([^\s])/g, '$1 $2');
    
    // Rule 2: Fix common Urdu patterns
    fixed = fixed.replace(/([کگھدذرزژسشصضطظعغفقلمنویہھی])([آابپتٹثجچحخ])/g, '$1 $2');
    
    // Rule 3: Add space after numbers
    fixed = fixed.replace(/([۰-۹0-9])([آابپتٹثجچحخ])/g, '$1 $2');
    
    // Rule 4: Fix missing spaces after common short words
    const shortWords = ['کہ', 'سے', 'پر', 'میں', 'نے', 'تو', 'یا', 'تا', 'کیا', 'ہی', 'بھی', 'اور', 'پھر', 'اگر', 'لیکن'];
    shortWords.forEach(word => {
        const regex = new RegExp(`(${word})([آابپتٹثجچحخدرڑزژسشصضطظعغفقلمنویھ])`, 'g');
        fixed = fixed.replace(regex, `$1 $2`);
    });
    
    // Rule 5: Fix multiple spaces
    fixed = fixed.replace(/\s+/g, ' ');
    
    // Rule 6: Add new line after sentence
    fixed = fixed.replace(/([۔؟!])\s+/g, '$1\n');
    
    return fixed;
}

// ============================================
// MAIN CONVERSION FUNCTION
// ============================================
async function startConversion() {
    // Check for input
    if (!currentFile && !document.getElementById('pasteText')?.value.trim()) {
        showToast('براہ کرم PDF فائل اپ لوڈ کریں یا متن پیسٹ کریں', 'error');
        return;
    }
    
    conversionStartTime = Date.now();
    
    // Show progress
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressText = document.getElementById('progressText');
    
    if (progressSection) progressSection.style.display = 'block';
    if (progressText) progressText.innerText = 'کنورژن شروع ہو رہا ہے...';
    if (progressFill) progressFill.style.width = '0%';
    if (progressPercent) progressPercent.innerText = '0%';
    
    let finalText = '';
    let usedMethod = '';
    
    try {
        if (currentFile && currentFile.type === 'application/pdf') {
            // PDF Conversion
            if (currentMethod === 'standard') {
                if (progressText) progressText.innerText = 'معیاری طریقہ استعمال ہو رہا ہے...';
                finalText = await extractStandard(currentFile, (current, total) => {
                    const percent = (current / total) * 80;
                    if (progressFill) progressFill.style.width = percent + '%';
                    if (progressPercent) progressPercent.innerText = Math.floor(percent) + '%';
                    if (progressText) progressText.innerText = `معیاری: صفحہ ${current}/${total}`;
                });
                usedMethod = 'standard';
                
            } else if (currentMethod === 'smart') {
                if (progressText) progressText.innerText = 'سمارٹ طریقہ استعمال ہو رہا ہے...';
                finalText = await extractSmart(currentFile, (current, total) => {
                    const percent = (current / total) * 80;
                    if (progressFill) progressFill.style.width = percent + '%';
                    if (progressPercent) progressPercent.innerText = Math.floor(percent) + '%';
                    if (progressText) progressText.innerText = `سمارٹ: صفحہ ${current}/${total}`;
                });
                usedMethod = 'smart';
                
            } else if (currentMethod === 'enhanced') {
                if (progressText) progressText.innerText = 'اعلیٰ طریقہ استعمال ہو رہا ہے...';
                finalText = await extractStandard(currentFile, (current, total) => {
                    const percent = (current / total) * 60;
                    if (progressFill) progressFill.style.width = percent + '%';
                    if (progressPercent) progressPercent.innerText = Math.floor(percent) + '%';
                });
                if (progressText) progressText.innerText = 'اعلیٰ: اردو قواعد لگائے جا رہے ہیں...';
                finalText = enhanceUrduText(finalText);
                usedMethod = 'enhanced';
                
            } else if (currentMethod === 'ai') {
                if (progressText) progressText.innerText = 'AI طریقہ (Grok) استعمال ہو رہا ہے...';
                let rawText = await extractStandard(currentFile, (current, total) => {
                    const percent = (current / total) * 50;
                    if (progressFill) progressFill.style.width = percent + '%';
                    if (progressPercent) progressPercent.innerText = Math.floor(percent) + '%';
                });
                if (progressText) progressText.innerText = 'AI: متن کو بہتر کیا جا رہا ہے...';
                if (progressFill) progressFill.style.width = '70%';
                finalText = await repairTextWithGrokAPI(rawText);
                usedMethod = 'ai';
            }
            
        } else {
            // Pasted text
            const pasteText = document.getElementById('pasteText').value;
            finalText = pasteText;
            
            if (currentMethod === 'enhanced') {
                if (progressText) progressText.innerText = 'اعلیٰ: متن کو بہتر کیا جا رہا ہے...';
                finalText = enhanceUrduText(finalText);
                usedMethod = 'enhanced';
            } else if (currentMethod === 'ai') {
                if (progressText) progressText.innerText = 'AI: متن کو بہتر کیا جا رہا ہے...';
                finalText = await repairTextWithGrokAPI(finalText);
                usedMethod = 'ai';
            } else {
                usedMethod = currentMethod;
            }
        }
        
        if (!finalText) {
            throw new Error('کوئی متن نہیں ملا');
        }
        
        extractedText = finalText;
        
        // Update result display
        const resultTextarea = document.getElementById('resultText');
        const resultSection = document.getElementById('resultSection');
        const usedMethodBadge = document.getElementById('usedMethodBadge');
        
        if (resultTextarea) resultTextarea.value = finalText;
        if (resultSection) resultSection.style.display = 'block';
        if (usedMethodBadge) {
            const methodNames = { standard: 'معیاری', smart: 'سمارٹ', enhanced: 'اعلیٰ', ai: 'AI (Grok)' };
            usedMethodBadge.innerText = methodNames[usedMethod] || usedMethod;
        }
        
        // Update stats
        const words = finalText.trim().split(/\s+/).length;
        const chars = finalText.length;
        const elapsed = ((Date.now() - conversionStartTime) / 1000).toFixed(1);
        
        const wordCountEl = document.getElementById('wordCount');
        const charCountEl = document.getElementById('charCount');
        const conversionTimeEl = document.getElementById('conversionTime');
        
        if (wordCountEl) wordCountEl.innerText = words;
        if (charCountEl) charCountEl.innerText = chars;
        if (conversionTimeEl) conversionTimeEl.innerText = elapsed;
        
        // Complete progress
        if (progressFill) progressFill.style.width = '100%';
        if (progressPercent) progressPercent.innerText = '100%';
        if (progressText) progressText.innerText = 'کنورژن مکمل!';
        
        setTimeout(() => {
            if (progressSection) progressSection.style.display = 'none';
        }, 1500);
        
        // Increment usage in database
        await incrementUsageInDB();
        
        // Auto-save to history
        saveToHistory();
        
        showToast(`کنورژن کامیاب! ${getMethodName(usedMethod)} طریقہ استعمال ہوا`, 'success');
        
    } catch (error) {
        console.error('Conversion error:', error);
        showToast('کنورژن ناکام: ' + error.message, 'error');
        if (progressSection) progressSection.style.display = 'none';
    }
}

function getMethodName(method) {
    const names = { standard: 'معیاری', smart: 'سمارٹ', enhanced: 'اعلیٰ', ai: 'AI' };
    return names[method] || method;
}

// ============================================
// HISTORY FUNCTIONS
// ============================================
function saveToHistory() {
    if (!extractedText) return;
    
    const historyItem = {
        id: Date.now(),
        text: extractedText.substring(0, 200),
        fullText: extractedText,
        method: currentMethod,
        timestamp: new Date().toISOString(),
        wordCount: extractedText.split(/\s+/).length
    };
    
    conversionHistory.unshift(historyItem);
    if (conversionHistory.length > 20) conversionHistory.pop();
    
    saveLocalHistory();
    displayHistory();
    showToast('ہسٹری میں محفوظ کر لیا گیا', 'success');
}

function displayHistory() {
    const historyList = document.getElementById('historyList');
    const historySection = document.getElementById('historySection');
    
    if (!historyList) return;
    
    if (conversionHistory.length === 0) {
        historyList.innerHTML = '<div class="empty-history"><i class="fas fa-clock"></i><p>کوئی ہسٹری نہیں</p></div>';
        return;
    }
    
    historyList.innerHTML = conversionHistory.map(item => `
        <div class="history-item">
            <div class="history-info">
                <span class="history-filename">${getMethodName(item.method)} طریقہ - ${item.wordCount} الفاظ</span>
                <small class="history-date">${new Date(item.timestamp).toLocaleString()}</small>
                <small>${item.text.substring(0, 80)}...</small>
            </div>
            <div class="history-actions">
                <button onclick="loadHistoryItem(${item.id})" title="لوڈ کریں"><i class="fas fa-folder-open"></i></button>
                <button onclick="deleteHistoryItem(${item.id})" title="ڈیلیٹ کریں"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    `).join('');
}

window.loadHistoryItem = function(id) {
    const item = conversionHistory.find(i => i.id === id);
    if (item) {
        extractedText = item.fullText;
        const resultText = document.getElementById('resultText');
        const resultSection = document.getElementById('resultSection');
        if (resultText) resultText.value = extractedText;
        if (resultSection) resultSection.style.display = 'block';
        
        const words = extractedText.trim().split(/\s+/).length;
        const chars = extractedText.length;
        if (document.getElementById('wordCount')) document.getElementById('wordCount').innerText = words;
        if (document.getElementById('charCount')) document.getElementById('charCount').innerText = chars;
        
        showToast('ہسٹری سے لوڈ کر لیا گیا', 'success');
    }
};

window.deleteHistoryItem = function(id) {
    conversionHistory = conversionHistory.filter(i => i.id !== id);
    saveLocalHistory();
    displayHistory();
    showToast('ہٹا دیا گیا', 'success');
};

function clearAllHistory() {
    if (confirm('کیا آپ تمام ہسٹری ڈیلیٹ کرنا چاہتے ہیں؟')) {
        conversionHistory = [];
        saveLocalHistory();
        displayHistory();
        showToast('تمام ہسٹری ڈیلیٹ کر دی گئی', 'success');
    }
}

// ============================================
// RESULT ACTIONS
// ============================================
function copyResult() {
    if (!extractedText) {
        showToast('پہلے کچھ کنورٹ کریں', 'warning');
        return;
    }
    navigator.clipboard.writeText(extractedText);
    showToast('متن کاپی کر لیا گیا', 'success');
}

function downloadResult() {
    if (!extractedText) {
        showToast('پہلے کچھ کنورٹ کریں', 'warning');
        return;
    }
    
    let blob, filename;
    const format = currentFormat;
    
    if (format === 'txt') {
        blob = new Blob([extractedText], { type: 'text/plain' });
        filename = `converted_${Date.now()}.txt`;
    } else if (format === 'docx') {
        const htmlContent = `<!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Converted Document</title></head>
        <body dir="rtl" style="font-family: 'Noto Nastaliq Urdu', serif; font-size: 14pt;">
        <pre style="white-space: pre-wrap;">${extractedText}</pre>
        </body>
        </html>`;
        blob = new Blob([htmlContent], { type: 'application/msword' });
        filename = `converted_${Date.now()}.doc`;
    } else {
        blob = new Blob([extractedText], { type: 'text/plain' });
        filename = `converted_${Date.now()}.txt`;
    }
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`${format.toUpperCase()} فائل ڈاؤن لوڈ ہو رہی ہے`, 'success');
}

function printResult() {
    if (!extractedText) {
        showToast('پہلے کچھ کنورٹ کریں', 'warning');
        return;
    }
    
    const win = window.open('', '_blank');
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head><title>Converted Document</title>
        <style>body{font-family:'Noto Nastaliq Urdu',serif;direction:rtl;padding:20px}pre{white-space:pre-wrap}</style>
        </head>
        <body><pre>${extractedText}</pre></body>
        </html>
    `);
    win.document.close();
    win.print();
}

// ============================================
// AI FEATURES
// ============================================
async function callAIFeature(feature) {
    const text = extractedText || document.getElementById('resultText')?.value;
    
    if (!text) {
        showToast('پہلے کچھ متن کنورٹ کریں', 'warning');
        return;
    }
    
    const aiSection = document.getElementById('aiResultSection');
    const aiContent = document.getElementById('aiResultContent');
    
    if (aiSection) aiSection.style.display = 'block';
    if (aiContent) {
        aiContent.innerHTML = '<div class="ai-loading"><i class="fas fa-spinner fa-spin"></i> AI تجزیہ کر رہا ہے...</div>';
    }
    
    try {
        const response = await fetch(`${CONFIG.API_BASE}/ai-feature`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                feature: feature,
                text: text.substring(0, 4000),
                tool_slug: CONFIG.TOOL_SLUG
            })
        });
        
        const data = await response.json();
        
        if (data.success && data.result) {
            if (aiContent) {
                aiContent.innerHTML = `<div style="white-space: pre-wrap; line-height: 1.6;">${data.result.replace(/\n/g, '<br>')}</div>`;
            }
            showToast(`AI ${getAIFeatureName(feature)} مکمل`, 'success');
        } else {
            // Local fallback
            let fallbackResult = getLocalAIFallback(feature, text);
            if (aiContent) {
                aiContent.innerHTML = `<div style="white-space: pre-wrap;">${fallbackResult}</div><div style="margin-top:10px;font-size:11px;color:#f59e0b;">⚠️ API دستیاب نہیں، مقامی پروسیسنگ</div>`;
            }
        }
    } catch (error) {
        console.error('AI feature error:', error);
        const fallbackResult = getLocalAIFallback(feature, text);
        if (aiContent) {
            aiContent.innerHTML = `<div style="white-space: pre-wrap;">${fallbackResult}</div><div style="margin-top:10px;font-size:11px;color:#ef4444;">⚠️ انٹرنیٹ کنکشن کی خرابی</div>`;
        }
    }
}

function getAIFeatureName(feature) {
    const names = { summarize: 'خلاصہ', translate: 'ترجمہ', grammar: 'گرامر چیک', tts: 'آواز', enhance: 'بہتر بنانا' };
    return names[feature] || feature;
}

function getLocalAIFallback(feature, text) {
    switch(feature) {
        case 'summarize':
            const sentences = text.split(/[۔!?]/);
            return sentences.slice(0, Math.ceil(sentences.length / 3)).join('۔') + '۔';
        case 'enhance':
            return enhanceUrduText(text);
        case 'tts':
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'ur-PK';
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utterance);
                return 'آواز چل رہی ہے...';
            }
            return 'آواز کی سہولت دستیاب نہیں';
        default:
            return 'یہ فیچر API کے ذریعے دستیاب ہے۔ براہ کرم انٹرنیٹ کنکشن چیک کریں۔';
    }
}

function applyAIResult() {
    const aiContent = document.getElementById('aiResultContent');
    const resultText = document.getElementById('resultText');
    
    if (aiContent && resultText) {
        const content = aiContent.innerText;
        if (content && !content.includes('AI تجزیہ کر رہا ہے')) {
            resultText.value = content;
            extractedText = content;
            updateResultStats(content);
            showToast('AI نتیجہ متن پر لگا دیا گیا', 'success');
            document.getElementById('aiResultSection').style.display = 'none';
        }
    }
}

function updateResultStats(text) {
    const words = text.trim().split(/\s+/).length;
    const chars = text.length;
    if (document.getElementById('wordCount')) document.getElementById('wordCount').innerText = words;
    if (document.getElementById('charCount')) document.getElementById('charCount').innerText = chars;
}

// ============================================
// SHARING
// ============================================
function shareContent(platform) {
    const url = window.location.href;
    let shareLink = '';
    
    switch(platform) {
        case 'facebook':
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareLink = `https://twitter.com/intent/tweet?text=اردو%20کنورٹر%20-%20مکمل%20مفت%20اردو%20پی%20ڈی%20ایف%20کنورٹر&url=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareLink = `https://wa.me/?text=${encodeURIComponent('اردو کنورٹر - ' + url)}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(url);
            showToast('لنک کاپی کر لیا گیا', 'success');
            addShareToDB(platform);
            return;
        default:
            return;
    }
    
    if (shareLink) {
        window.open(shareLink, '_blank', 'width=600,height=400');
        addShareToDB(platform);
        showToast('شیئر کیا جا رہا ہے', 'success');
    }
}

// ============================================
// FILE HANDLING
// ============================================
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        currentFile = file;
        const fileDetails = document.getElementById('fileDetails');
        if (fileDetails) {
            fileDetails.innerHTML = `<i class="fas fa-file-pdf"></i> ${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
            fileDetails.style.color = '#10b981';
        }
        showToast(`فائل منتخب: ${file.name}`, 'success');
    } else if (file) {
        showToast('براہ کرم PDF فائل منتخب کریں', 'error');
    }
}

function handleDrop(event) {
    event.preventDefault();
    const dropZone = document.getElementById('dropZone');
    if (dropZone) dropZone.classList.remove('drag-over');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
        currentFile = file;
        const fileDetails = document.getElementById('fileDetails');
        if (fileDetails) {
            fileDetails.innerHTML = `<i class="fas fa-file-pdf"></i> ${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
            fileDetails.style.color = '#10b981';
        }
        showToast(`فائل ڈراپ: ${file.name}`, 'success');
    } else {
        showToast('براہ کرم PDF فائل ڈراپ کریں', 'warning');
    }
}

// ============================================
// UI FUNCTIONS
// ============================================
function selectMethod(method) {
    currentMethod = method;
    
    const methods = ['standard', 'smart', 'enhanced', 'ai'];
    methods.forEach(m => {
        const card = document.getElementById(`method${m.charAt(0).toUpperCase() + m.slice(1)}`);
        if (card) {
            card.classList.remove('selected');
            card.style.border = '2px solid transparent';
        }
    });
    
    const selectedCard = document.getElementById(`method${method.charAt(0).toUpperCase() + method.slice(1)}`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedCard.style.border = '2px solid #6366f1';
        selectedCard.style.boxShadow = '0 0 20px rgba(99,102,241,0.3)';
    }
    
    const methodNames = { standard: 'معیاری', smart: 'سمارٹ', enhanced: 'اعلیٰ', ai: 'AI' };
    showToast(`${methodNames[method]} طریقہ منتخب کر لیا گیا`, 'success');
}

function selectFormat(format) {
    currentFormat = format;
    showToast(`${format.toUpperCase()} فارمیٹ منتخب`, 'success');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    const darkToggle = document.getElementById('darkToggle');
    if (darkToggle) {
        darkToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
        const darkToggle = document.getElementById('darkToggle');
        if (darkToggle) darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function showDemo() {
    const demoText = `آزادی کا مطلب یہ نہیں کہ انسان اپنی خواہشات کا غلام بن جائے۔

بلکہ آزادی کا صحیح مطلب اپنی خواہشات پر قابو پانا ہے۔

تعلیم وہ ہتھیار ہے جو دنیا کو بدل سکتا ہے۔

علم ہی وہ نور ہے جو اندھیروں کو روشن کرتا ہے۔`;
    
    const pasteText = document.getElementById('pasteText');
    if (pasteText) {
        pasteText.value = demoText;
        updatePasteStats();
        showToast('نمونہ متن لوڈ کر دیا گیا', 'success');
        
        // Switch to paste tab
        const pasteTab = document.querySelector('.tab-btn[data-tab="paste"]');
        if (pasteTab) pasteTab.click();
    }
}

function clearAll() {
    extractedText = '';
    currentFile = null;
    
    const resultText = document.getElementById('resultText');
    const resultSection = document.getElementById('resultSection');
    const pasteText = document.getElementById('pasteText');
    const fileDetails = document.getElementById('fileDetails');
    
    if (resultText) resultText.value = '';
    if (resultSection) resultSection.style.display = 'none';
    if (pasteText) pasteText.value = '';
    if (fileDetails) {
        fileDetails.innerHTML = 'کوئی فائل منتخب نہیں';
        fileDetails.style.color = '#64748b';
    }
    
    updatePasteStats();
    showToast('سب کچھ صاف کر دیا گیا', 'success');
}

function updatePasteStats() {
    const pasteText = document.getElementById('pasteText');
    if (pasteText) {
        const text = pasteText.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        
        const wordSpan = document.getElementById('pasteWordCount');
        const charSpan = document.getElementById('pasteCharCount');
        if (wordSpan) wordSpan.innerText = words;
        if (charSpan) charSpan.innerText = chars;
    }
}

function toggleHistory() {
    const historySection = document.getElementById('historySection');
    const dashboardBtn = document.getElementById('dashboardBtn');
    
    if (historySection) {
        if (historySection.style.display === 'none') {
            displayHistory();
            historySection.style.display = 'block';
            if (dashboardBtn) dashboardBtn.innerHTML = '<i class="fas fa-times"></i> بند کریں';
        } else {
            historySection.style.display = 'none';
            if (dashboardBtn) dashboardBtn.innerHTML = '<i class="fas fa-chart-simple"></i> ڈیش بورڈ';
        }
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    if (type === 'success') icon = '✓ ';
    else if (type === 'error') icon = '✗ ';
    else if (type === 'warning') icon = '⚠ ';
    else icon = 'ℹ ';
    
    toast.innerHTML = icon + message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ============================================
// BATCH CONVERSION
// ============================================
let batchFiles = [];

function handleBatchFiles(e) {
    batchFiles = Array.from(e.target.files);
    displayBatchList();
}

function displayBatchList() {
    const container = document.getElementById('batchList');
    if (!container) return;
    
    if (batchFiles.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = batchFiles.map((file, i) => `
        <div class="batch-item">
            <span><i class="fas fa-file-pdf"></i> ${file.name}</span>
            <button class="batch-item-remove" onclick="removeBatchFile(${i})"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');
    
    const batchConvertBtn = document.getElementById('batchConvertBtn');
    if (batchConvertBtn) batchConvertBtn.style.display = 'block';
}

window.removeBatchFile = function(index) {
    batchFiles.splice(index, 1);
    displayBatchList();
    if (batchFiles.length === 0) {
        const batchConvertBtn = document.getElementById('batchConvertBtn');
        if (batchConvertBtn) batchConvertBtn.style.display = 'none';
    }
};

async function startBatchConversion() {
    if (batchFiles.length === 0) return;
    
    showToast(`${batchFiles.length} فائلیں کنورٹ ہو رہی ہیں...`, 'info');
    
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressText = document.getElementById('progressText');
    
    if (progressSection) progressSection.style.display = 'block';
    
    let allText = '';
    
    for (let i = 0; i < batchFiles.length; i++) {
        const percent = (i / batchFiles.length) * 100;
        if (progressFill) progressFill.style.width = percent + '%';
        if (progressPercent) progressPercent.innerText = Math.floor(percent) + '%';
        if (progressText) progressText.innerText = `فائل ${i+1}/${batchFiles.length}: ${batchFiles[i].name}`;
        
        try {
            const text = await extractStandard(batchFiles[i]);
            allText += `=== ${batchFiles[i].name} ===\n${enhanceUrduText(text)}\n\n`;
        } catch(e) {
            allText += `=== ${batchFiles[i].name} ===\n[کنورژن ناکام]\n\n`;
        }
    }
    
    extractedText = allText;
    
    const resultTextarea = document.getElementById('resultText');
    const resultSection = document.getElementById('resultSection');
    
    if (resultTextarea) resultTextarea.value = extractedText;
    if (resultSection) resultSection.style.display = 'block';
    
    if (progressFill) progressFill.style.width = '100%';
    if (progressPercent) progressPercent.innerText = '100%';
    if (progressText) progressText.innerText = 'بیچ کنورژن مکمل!';
    
    setTimeout(() => {
        if (progressSection) progressSection.style.display = 'none';
    }, 1500);
    
    await incrementUsageInDB();
    showToast(`${batchFiles.length} فائلیں کنورٹ ہو گئیں`, 'success');
}

// ============================================
// URL FETCH
// ============================================
async function fetchUrlContent() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput ? urlInput.value : '';
    
    if (!url) {
        showToast('براہ کرم URL درج کریں', 'warning');
        return;
    }
    
    showToast('URL سے فائل لائی جا رہی ہے...', 'info');
    
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = url.split('/').pop() || 'file.pdf';
        currentFile = new File([blob], fileName, { type: blob.type });
        
        const fileDetails = document.getElementById('fileDetails');
        if (fileDetails) {
            fileDetails.innerHTML = `<i class="fas fa-file-pdf"></i> ${fileName} (${(blob.size / 1024).toFixed(0)} KB)`;
            fileDetails.style.color = '#10b981';
        }
        
        showToast('فائل ڈاؤن لوڈ ہو گئی', 'success');
    } catch(e) {
        console.error('Fetch error:', e);
        showToast('URL سے فائل نہیں لا سکے', 'error');
    }
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================
function setupEventListeners() {
    // Navigation
    document.getElementById('scrollToConverter')?.addEventListener('click', () => {
        document.querySelector('.converter-card')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('demoBtn')?.addEventListener('click', showDemo);
    document.getElementById('compareBtn')?.addEventListener('click', () => showToast('طریقوں کا موازنہ: معیاری (تیز)، سمارٹ (درست)، اعلیٰ (قواعد)، AI (ذہین)', 'info'));
    document.getElementById('homeBtn')?.addEventListener('click', scrollToTop);
    document.getElementById('backBtn')?.addEventListener('click', () => window.history.back());
    document.getElementById('dashboardBtn')?.addEventListener('click', toggleHistory);
    document.getElementById('darkToggle')?.addEventListener('click', toggleDarkMode);
    
    // File upload
    document.getElementById('browseBtn')?.addEventListener('click', () => document.getElementById('fileInput')?.click());
    document.getElementById('fileInput')?.addEventListener('change', handleFileSelect);
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        dropZone.addEventListener('drop', handleDrop);
    }
    
    // Paste
    document.getElementById('clearPasteBtn')?.addEventListener('click', () => {
        const pasteText = document.getElementById('pasteText');
        if (pasteText) pasteText.value = '';
        updatePasteStats();
        showToast('متن صاف', 'info');
    });
    document.getElementById('pasteText')?.addEventListener('input', updatePasteStats);
    
    // URL
    document.getElementById('fetchBtn')?.addEventListener('click', fetchUrlContent);
    
    // Batch
    document.getElementById('batchSelectBtn')?.addEventListener('click', () => document.getElementById('batchFileInput')?.click());
    document.getElementById('batchFileInput')?.addEventListener('change', handleBatchFiles);
    document.getElementById('batchConvertBtn')?.addEventListener('click', startBatchConversion);
    
    // Methods
    document.getElementById('methodStandard')?.addEventListener('click', () => selectMethod('standard'));
    document.getElementById('methodSmart')?.addEventListener('click', () => selectMethod('smart'));
    document.getElementById('methodEnhanced')?.addEventListener('click', () => selectMethod('enhanced'));
    document.getElementById('methodAI')?.addEventListener('click', () => selectMethod('ai'));
    
    // Format
    document.querySelectorAll('.format-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.format-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectFormat(btn.dataset.format);
        });
    });
    
    // Convert
    document.getElementById('convertBtn')?.addEventListener('click', startConversion);
    
    // Result actions
    document.getElementById('copyResultBtn')?.addEventListener('click', copyResult);
    document.getElementById('downloadResultBtn')?.addEventListener('click', downloadResult);
    document.getElementById('printResultBtn')?.addEventListener('click', printResult);
    document.getElementById('saveHistoryBtn')?.addEventListener('click', saveToHistory);
    
    // AI features
    document.getElementById('aiSummarizeBtn')?.addEventListener('click', () => callAIFeature('summarize'));
    document.getElementById('aiTranslateBtn')?.addEventListener('click', () => callAIFeature('translate'));
    document.getElementById('aiGrammarBtn')?.addEventListener('click', () => callAIFeature('grammar'));
    document.getElementById('aiTtsBtn')?.addEventListener('click', () => callAIFeature('tts'));
    document.getElementById('aiEnhanceBtn')?.addEventListener('click', () => callAIFeature('enhance'));
    
    document.getElementById('closeAiResult')?.addEventListener('click', () => {
        document.getElementById('aiResultSection').style.display = 'none';
    });
    document.getElementById('aiCopyBtn')?.addEventListener('click', () => {
        const content = document.getElementById('aiResultContent')?.innerText;
        if (content) navigator.clipboard.writeText(content);
        showToast('کاپی ہو گیا', 'success');
    });
    document.getElementById('aiApplyBtn')?.addEventListener('click', applyAIResult);
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => {
            addReactionToDB(btn.dataset.emoji, btn.dataset.type);
        });
    });
    
    // Sharing
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => shareContent(btn.dataset.platform));
    });
    
    // History
    document.getElementById('clearHistoryBtn')?.addEventListener('click', clearAllHistory);
    
    // Quick actions
    document.querySelectorAll('.quick-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'clear') clearAll();
            if (action === 'sample') showDemo();
            if (action === 'history') toggleHistory();
            if (action === 'export') downloadResult();
        });
    });
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            document.getElementById(btn.dataset.tab + 'Tab')?.classList.add('active');
        });
    });
    
    // Scroll
    document.getElementById('scrollUp')?.addEventListener('click', scrollToTop);
    document.getElementById('scrollDown')?.addEventListener('click', scrollToBottom);
    
    // Initial UI setup
    loadDarkMode();
    updatePasteStats();
    
    console.log('All event listeners registered');
}

// ============================================
// EXPORTS FOR GLOBAL ACCESS
// ============================================
window.startConversion = startConversion;
window.loadHistoryItem = loadHistoryItem;
window.deleteHistoryItem = deleteHistoryItem;
window.removeBatchFile = removeBatchFile;
