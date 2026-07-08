// ============================================
// PDF TO EXCEL/CSV CONVERTER - COMPLETE
// CLOUDFLARE WORKERS API INTEGRATION
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const TOOL_SLUG = 'pdf-to-excel-converter';
// NOTE: Update these URLs to match your actual Cloudflare Worker deployment
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

// ============================================
// GLOBAL VARIABLES
// ============================================
let selectedFiles = [];
let currentPreviewData = [];
let currentFile = null;
let isConverting = false;

// Initialize PDF.js with proper worker
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js';
}

// ============================================
// CLOUDFLARE WORKERS API FUNCTIONS
// ============================================

/**
 * Track tool usage - increments usage count
 */
async function trackToolUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ tool_slug: TOOL_SLUG })
        });
        
        if (response.ok) {
            const data = await response.json();
            updateUsageDisplay(data.usage_count || 0);
            return data;
        } else {
            console.warn('API returned status:', response.status);
            throw new Error('API response not OK');
        }
    } catch (error) {
        console.warn('API fallback: Using localStorage for usage');
        // Fallback to localStorage
        let localCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || 0);
        localCount += 1;
        localStorage.setItem(`${TOOL_SLUG}_usage`, localCount);
        updateUsageDisplay(localCount);
        return { usage_count: localCount };
    }
}

/**
 * Get tool statistics from API
 */
async function getToolStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateAllStats(data);
            return data;
        } else {
            console.warn('API returned status:', response.status);
            throw new Error('API response not OK');
        }
    } catch (error) {
        console.warn('API fallback: Loading stats from localStorage');
        loadLocalStats();
        return null;
    }
}

/**
 * Add a reaction
 */
async function addReaction(emojiType) {
    try {
        const response = await fetch(`${API_BASE}/api/reactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                emoji_type: emojiType
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            updateReactionCounts(data.reactions || {});
            showToast(`${getEmojiName(emojiType)} added! 👍`, 'success');
            return data;
        } else if (response.status === 409) {
            showToast('You already added this reaction! 😊', 'info');
            return null;
        } else {
            console.warn('API returned status:', response.status);
            throw new Error('API response not OK');
        }
    } catch (error) {
        console.warn('API fallback: Using localStorage for reactions');
        incrementLocalReaction(emojiType);
        return null;
    }
}

/**
 * Track a share
 */
async function trackShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/api/shares`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                share_type: platform
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            updateShareCount(data.share_count || 0);
            showToast(`Shared on ${platform}! 🎉`, 'success');
            return data;
        } else {
            console.warn('API returned status:', response.status);
            throw new Error('API response not OK');
        }
    } catch (error) {
        console.warn('API fallback: Using localStorage for shares');
        let shareCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || 0);
        shareCount += 1;
        localStorage.setItem(`${TOOL_SLUG}_shares`, shareCount);
        updateShareCount(shareCount);
        return { share_count: shareCount };
    }
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateUsageDisplay(count) {
    // Update all usage displays
    const heroUsage = document.getElementById('heroUsage');
    if (heroUsage) heroUsage.innerText = count || 0;
}

function updateShareCount(count) {
    const shareCount = document.getElementById('shareCount');
    if (shareCount) shareCount.innerText = count || 0;
    
    const heroShares = document.getElementById('heroShares');
    if (heroShares) heroShares.innerText = count || 0;
}

function updateReactionCounts(reactions) {
    const emojiMap = {
        'like': 'likeCount',
        'love': 'loveCount',
        'wow': 'wowCount',
        'sad': 'sadCount',
        'laugh': 'laughCount',
        'celebrate': 'celebrateCount'
    };
    
    let totalReactions = 0;
    for (const [key, elementId] of Object.entries(emojiMap)) {
        const count = reactions[key] || 0;
        const el = document.getElementById(elementId);
        if (el) el.innerText = count;
        totalReactions += count;
    }
    
    // Update hero reactions count
    const heroReactions = document.getElementById('heroReactions');
    if (heroReactions) heroReactions.innerText = totalReactions;
}

function updateAllStats(data) {
    if (data) {
        updateUsageDisplay(data.usage_count || 0);
        updateShareCount(data.share_count || 0);
        updateReactionCounts(data.reactions || {});
        
        // Followers (if available)
        const heroFollowers = document.getElementById('heroFollowers');
        if (heroFollowers) heroFollowers.innerText = data.followers || 0;
    }
}

function loadLocalStats() {
    // Usage
    const usage = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || 0);
    updateUsageDisplay(usage);
    
    // Shares
    const shares = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || 0);
    updateShareCount(shares);
    
    // Reactions
    const reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    updateReactionCounts(reactions);
    
    // Followers (not stored locally)
    const heroFollowers = document.getElementById('heroFollowers');
    if (heroFollowers) heroFollowers.innerText = '0';
}

function incrementLocalReaction(emojiType) {
    let reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    reactions[emojiType] = (reactions[emojiType] || 0) + 1;
    localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactions));
    updateReactionCounts(reactions);
    showToast(`${getEmojiName(emojiType)} added! 👍`, 'success');
}

function getEmojiName(emojiType) {
    const names = {
        'like': '👍 Like',
        'love': '❤️ Love',
        'wow': '😮 Wow',
        'sad': '😢 Sad',
        'laugh': '😂 Laugh',
        'celebrate': '🎉 Celebrate'
    };
    return names[emojiType] || emojiType;
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-100%)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

// ============================================
// TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    const phrases = [
        'Extract tables from PDFs instantly 📊',
        'Convert PDF to Excel with AI 🤖',
        'PDF to CSV in one click ⚡',
        'Smart table detection & extraction 🎯',
        'Free, fast & accurate conversion 🚀'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const target = document.getElementById('typewriterTarget');
    if (!target) return;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (!isDeleting) {
            // Typing
            target.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, 50);
        } else {
            // Deleting
            target.textContent = currentPhrase.substring(0, charIndex);
            charIndex--;
            
            if (charIndex < 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, 30);
        }
    }
    
    setTimeout(type, 500);
}

// ============================================
// CHECKLIST 3D - UPDATE STEPS
// ============================================
function updateChecklist(step) {
    const items = document.querySelectorAll('.checklist-item');
    items.forEach((item) => {
        const itemStep = parseInt(item.dataset.step);
        if (itemStep <= step) {
            item.classList.add('completed');
            const icon = item.querySelector('.check-icon');
            if (icon) icon.textContent = '✓';
        } else {
            item.classList.remove('completed');
            const icon = item.querySelector('.check-icon');
            if (icon) icon.textContent = itemStep;
        }
    });
}

// ============================================
// FILE HANDLING FUNCTIONS
// ============================================
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    addFiles(files);
    updateChecklist(1);
}

function addFiles(files) {
    files.forEach(file => {
        if (file.type === 'application/pdf') {
            if (!selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
                selectedFiles.push(file);
            }
        }
    });
    updateFileList();
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) convertBtn.disabled = selectedFiles.length === 0;
    showToast(`${files.length} PDF file(s) added`, 'success');
}

function updateFileList() {
    const container = document.getElementById('fileList');
    if (!container) return;
    
    if (selectedFiles.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = selectedFiles.map((file, index) => `
        <div class="file-item">
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
                <i class="fas fa-file-pdf" style="color: #ef4444; flex-shrink: 0;"></i>
                <div style="min-width: 0; flex: 1;">
                    <div class="file-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button class="delete-file" data-index="${index}" style="flex-shrink: 0;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    document.querySelectorAll('.delete-file').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            selectedFiles.splice(index, 1);
            updateFileList();
            const convertBtn = document.getElementById('convertBtn');
            if (convertBtn) convertBtn.disabled = selectedFiles.length === 0;
            if (selectedFiles.length === 0) updateChecklist(0);
            showToast('File removed', 'info');
        });
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ============================================
// PDF PROCESSING FUNCTIONS
// ============================================
function parsePageRange(rangeStr, totalPages) {
    if (!rangeStr || rangeStr.trim() === '') {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = new Set();
    const ranges = rangeStr.split(',');
    for (const range of ranges) {
        if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            const startPage = Math.max(1, start || 1);
            const endPage = Math.min(totalPages, end || totalPages);
            for (let i = startPage; i <= endPage; i++) pages.add(i);
        } else if (!isNaN(range)) {
            pages.add(Math.max(1, Math.min(totalPages, parseInt(range))));
        }
    }
    return Array.from(pages).sort((a, b) => a - b);
}

async function extractTextFromPDF(file, pageNumbers) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let allRows = [];
    
    for (const pageNum of pageNumbers) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(item => item.str).join(' ');
        
        // Extract table-like data
        const lines = text.split('\n').filter(l => l.trim());
        for (const line of lines) {
            const cells = line.split(/\s{2,}/);
            if (cells.length > 1) {
                allRows.push(cells.map(cell => cell.trim()));
            } else if (cells.length === 1 && cells[0].trim()) {
                allRows.push([cells[0].trim()]);
            }
        }
    }
    
    return allRows;
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

function filterData(rows, filterText) {
    if (!filterText) return rows;
    return rows.filter(row => row.some(cell => cell.toLowerCase().includes(filterText.toLowerCase())));
}

function findAndReplace(data, findText, replaceText) {
    if (!findText) return data;
    return data.map(row => row.map(cell => cell.replace(new RegExp(findText, 'gi'), replaceText)));
}

function removeEmptyRows(rows) {
    return rows.filter(row => row.some(cell => cell.trim() !== ''));
}

function addHeadersIfNeeded(rows, addHeaders) {
    if (!addHeaders || rows.length === 0) return rows;
    const headers = rows[0].map((_, i) => `Column ${i + 1}`);
    return [headers, ...rows];
}

function convertToOutput(data, format, delimiter = ',') {
    if (format === 'csv') {
        return data.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(delimiter)).join('\n');
    } else if (format === 'json') {
        if (data.length === 0) return '[]';
        const headers = data[0] || [];
        const jsonData = data.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, i) => obj[header] = row[i] || '');
            return obj;
        });
        return JSON.stringify(jsonData, null, 2);
    } else {
        // Excel format
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        const sheetName = document.getElementById('sheetName')?.value || 'Sheet1';
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    }
}

function updateProgress(percent) {
    const bar = document.getElementById('progressBar');
    if (bar) bar.style.width = Math.min(100, percent) + '%';
}

// ============================================
// MAIN CONVERSION FUNCTION
// ============================================
async function convertPDF() {
    if (selectedFiles.length === 0) {
        showToast('Please select a PDF file first', 'error');
        return;
    }
    
    if (isConverting) return;
    isConverting = true;
    
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) {
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
    }
    
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.style.display = 'block';
    
    const status = document.getElementById('status');
    if (status) status.innerHTML = 'Processing PDF...';
    
    updateProgress(5);
    updateChecklist(3);
    
    const outputFormat = document.getElementById('outputFormat')?.value || 'xlsx';
    const csvDelimiter = document.getElementById('csvDelimiter')?.value || ',';
    const actualDelimiter = csvDelimiter === 'tab' ? '\t' : csvDelimiter;
    const pageRange = document.getElementById('pageRange')?.value || '';
    const filterText = document.getElementById('filterText')?.value || '';
    const findText = document.getElementById('findText')?.value || '';
    const replaceText = document.getElementById('replaceText')?.value || '';
    const removeEmpty = document.getElementById('removeEmptyRows')?.checked || false;
    const addHeaders = document.getElementById('addHeaders')?.checked || false;
    
    const allResults = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        updateProgress(10 + (i / selectedFiles.length) * 70);
        if (status) status.innerHTML = `Processing ${file.name}...`;
        
        try {
            const arrayBuffer = await readFileAsArrayBuffer(file);
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const pageNumbers = parsePageRange(pageRange, pdf.numPages);
            const rows = await extractTextFromPDF(file, pageNumbers);
            
            let processedRows = [...rows];
            processedRows = filterData(processedRows, filterText);
            processedRows = findAndReplace(processedRows, findText, replaceText);
            if (removeEmpty) processedRows = removeEmptyRows(processedRows);
            processedRows = addHeadersIfNeeded(processedRows, addHeaders);
            
            const outputData = convertToOutput(processedRows, outputFormat, actualDelimiter);
            const fileExt = outputFormat === 'xlsx' ? 'xlsx' : outputFormat;
            const mimeType = outputFormat === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 
                            outputFormat === 'csv' ? 'text/csv' : 'application/json';
            
            allResults.push({
                name: file.name.replace('.pdf', `_converted.${fileExt}`),
                data: outputData,
                mimeType: mimeType
            });
            
            currentPreviewData = processedRows.slice(0, 15);
            
        } catch (error) {
            console.error('Error:', error);
            showToast(`Error processing ${file.name}: ${error.message}`, 'error');
        }
    }
    
    updateProgress(85);
    updateChecklist(4);
    
    // Show preview
    if (currentPreviewData && currentPreviewData.length > 0) {
        displayPreview(currentPreviewData);
        const previewCard = document.getElementById('previewCard');
        if (previewCard) previewCard.style.display = 'block';
        updateChecklist(5);
    }
    
    // Show download buttons
    const downloadContainer = document.getElementById('downloadButtons');
    if (downloadContainer) {
        downloadContainer.innerHTML = '';
        
        allResults.forEach((result) => {
            const blob = new Blob([result.data], { type: result.mimeType });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.className = 'download-btn';
            link.href = url;
            link.download = result.name;
            link.innerHTML = `<i class="fas fa-download"></i> ${result.name}`;
            downloadContainer.appendChild(link);
        });
    }
    
    // Save to history
    saveToHistory(selectedFiles.length, outputFormat);
    
    const downloadCard = document.getElementById('downloadCard');
    if (downloadCard) downloadCard.style.display = 'block';
    
    if (status) status.innerHTML = '✅ Conversion complete! Ready to download.';
    updateProgress(100);
    if (spinner) spinner.style.display = 'none';
    updateChecklist(6);
    
    if (convertBtn) {
        convertBtn.disabled = false;
        convertBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Convert PDF';
    }
    isConverting = false;
    
    // Track usage
    await trackToolUsage();
    showToast(`✅ Successfully converted ${selectedFiles.length} file(s)!`, 'success');
}

// ============================================
// PREVIEW FUNCTIONS
// ============================================
function displayPreview(data) {
    const container = document.getElementById('previewContainer');
    if (!container || !data || data.length === 0) {
        if (container) container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No data to preview</p>';
        return;
    }
    
    let html = '<table class="preview-table"><thead><tr>';
    const maxCols = Math.max(...data.map(row => row.length));
    for (let i = 0; i < maxCols; i++) html += `<th>Col ${i + 1}</th>`;
    html += '</tr></thead><tbody>';
    
    const rowsToShow = Math.min(data.length, 10);
    for (let r = 0; r < rowsToShow; r++) {
        html += '<tr>';
        for (let i = 0; i < maxCols; i++) {
            html += `<td>${escapeHtml(data[r][i] || '')}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    container.innerHTML = html;
    
    const statsEl = document.getElementById('previewStats');
    if (statsEl) {
        statsEl.innerHTML = `${rowsToShow} of ${data.length} rows, ${maxCols} columns`;
    }
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
    }[c] || c));
}

// ============================================
// HISTORY FUNCTIONS
// ============================================
function saveToHistory(fileCount, format) {
    const history = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        files: fileCount,
        format: format.toUpperCase()
    };
    
    let saved = JSON.parse(localStorage.getItem('pdfConverterHistory') || '[]');
    saved.unshift(history);
    if (saved.length > 5) saved = saved.slice(0, 5);
    localStorage.setItem('pdfConverterHistory', JSON.stringify(saved));
    displayFileHistory();
}

function displayFileHistory() {
    const saved = JSON.parse(localStorage.getItem('pdfConverterHistory') || '[]');
    const container = document.getElementById('fileHistory');
    if (!container) return;
    
    if (saved.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted); font-size: 13px;">No recent conversions</p>';
        return;
    }
    
    container.innerHTML = saved.map(item => `
        <div class="history-item">
            <span>${item.date}</span>
            <span>${item.files} file(s) → ${item.format}</span>
        </div>
    `).join('');
}

// ============================================
// SHARE FUNCTIONS
// ============================================
function shareOnFacebook() { 
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); 
    trackShare('facebook'); 
}

function shareOnTwitter() { 
    const text = encodeURIComponent('Convert PDF to Excel/CSV for free! 🚀');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank'); 
    trackShare('twitter'); 
}

function shareOnLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    trackShare('linkedin');
}

function shareOnWhatsApp() { 
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank'); 
    trackShare('whatsapp'); 
}

async function copyPageLink() { 
    try {
        await navigator.clipboard.writeText(window.location.href); 
        trackShare('copy');
        showToast('Link copied to clipboard! 📋', 'success');
    } catch {
        // Fallback
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        trackShare('copy');
        showToast('Link copied! 📋', 'success');
    }
}

// ============================================
// SCROLL BUTTONS
// ============================================
function setupScrollButtons() {
    const upBtn = document.getElementById('scrollUpBtn');
    const downBtn = document.getElementById('scrollDownBtn');
    
    if (!upBtn || !downBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            upBtn.style.display = 'flex';
        } else {
            upBtn.style.display = 'none';
        }
    });
    
    upBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    downBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
}

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    getToolStats();
    displayFileHistory();
    initTypewriter();
    setupScrollButtons();
    
    // ===== FILE UPLOAD =====
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    
    if (uploadBtn) uploadBtn.addEventListener('click', () => fileInput?.click());
    if (fileInput) fileInput.addEventListener('change', handleFileSelect);
    
    if (dropArea) {
        dropArea.addEventListener('dragover', (e) => { 
            e.preventDefault(); 
            dropArea.classList.add('drag-over'); 
        });
        
        dropArea.addEventListener('dragleave', () => { 
            dropArea.classList.remove('drag-over'); 
        });
        
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                addFiles(Array.from(e.dataTransfer.files));
            }
        });
    }
    
    // ===== CONVERT BUTTON =====
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) convertBtn.addEventListener('click', convertPDF);
    
    // ===== FIND & REPLACE =====
    const applyReplaceBtn = document.getElementById('applyReplaceBtn');
    if (applyReplaceBtn) {
        applyReplaceBtn.addEventListener('click', () => {
            const findText = document.getElementById('findText')?.value || '';
            const replaceText = document.getElementById('replaceText')?.value || '';
            if (findText && currentPreviewData && currentPreviewData.length > 0) {
                currentPreviewData = findAndReplace(currentPreviewData, findText, replaceText);
                displayPreview(currentPreviewData);
                showToast(`Replaced "${findText}" with "${replaceText}"`, 'success');
            } else if (!findText) {
                showToast('Please enter text to find', 'info');
            } else {
                showToast('No data to apply find/replace', 'info');
            }
        });
    }
    
    // ===== CLEAR HISTORY =====
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            localStorage.removeItem('pdfConverterHistory');
            displayFileHistory();
            showToast('History cleared', 'success');
        });
    }
    
    // ===== REACTIONS =====
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const emoji = this.dataset.emoji;
            if (emoji) {
                addReaction(emoji);
                // Visual feedback
                this.classList.add('active');
                setTimeout(() => this.classList.remove('active'), 300);
            }
        });
    });
    
    // ===== SHARE BUTTONS =====
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.dataset.platform;
            switch(platform) {
                case 'facebook': shareOnFacebook(); break;
                case 'twitter': shareOnTwitter(); break;
                case 'linkedin': shareOnLinkedIn(); break;
                case 'whatsapp': shareOnWhatsApp(); break;
                case 'copy': copyPageLink(); break;
                default: showToast('Share feature coming soon!', 'info');
            }
        });
    });
    
    // ===== TOOL USAGE ON LOAD =====
    trackToolUsage();
    
    // Welcome toast
    setTimeout(() => {
        showToast('🚀 Upload a PDF to get started!', 'info');
    }, 800);
});
