// ============================================
// PDF TO EXCEL/CSV CONVERTER - COMPLETE VERSION
// TiDB INTEGRATED | REAL DATA
// ============================================

const TOOL_SLUG = 'pdf-to-excel-converter';
const API_BASE_URL = window.location.origin;

// Global variables
let selectedFiles = [];
let currentPreviewData = [];
let currentFile = null;

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js';

// ============================================
// TiDB API FUNCTIONS (REAL DATA)
// ============================================

async function trackToolUsage() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tool/usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolSlug: TOOL_SLUG })
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('usedCount').innerText = data.totalCount || 0;
        }
    } catch (error) {
        // Fallback to local storage if API fails
        let localCount = localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
        localCount = parseInt(localCount) + 1;
        localStorage.setItem(`${TOOL_SLUG}_usage`, localCount);
        document.getElementById('usedCount').innerText = localCount;
    }
}

async function getToolStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tool/stats?slug=${TOOL_SLUG}`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('usedCount').innerText = data.usageCount || 0;
            document.getElementById('shareCount').innerText = data.shareCount || 0;
            if (data.reactions) updateReactionCounts(data.reactions);
        }
    } catch (error) {
        loadLocalStats();
    }
}

async function addReaction(emojiType) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tool/reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolSlug: TOOL_SLUG, emojiType })
        });
        if (response.ok) {
            const data = await response.json();
            updateReactionCounts(data.reactions);
            showToast(getEmojiName(emojiType) + ' added!', 'success');
        } else if (response.status === 409) {
            showToast('You already added this reaction!', 'info');
        }
    } catch (error) {
        incrementLocalReaction(emojiType);
    }
}

async function trackShare(platform) {
    try {
        await fetch(`${API_BASE_URL}/api/tool/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolSlug: TOOL_SLUG, shareType: platform })
        });
        let shareCount = parseInt(document.getElementById('shareCount').innerText) || 0;
        document.getElementById('shareCount').innerText = shareCount + 1;
    } catch (error) {
        let shareCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || 0);
        localStorage.setItem(`${TOOL_SLUG}_shares`, shareCount + 1);
        document.getElementById('shareCount').innerText = shareCount + 1;
    }
}

function updateReactionCounts(reactions) {
    if (reactions.like) document.getElementById('likeCount').innerText = reactions.like;
    if (reactions.love) document.getElementById('loveCount').innerText = reactions.love;
    if (reactions.wow) document.getElementById('wowCount').innerText = reactions.wow;
    if (reactions.sad) document.getElementById('sadCount').innerText = reactions.sad;
    if (reactions.angry) document.getElementById('angryCount').innerText = reactions.angry;
    if (reactions.laugh) document.getElementById('laughCount').innerText = reactions.laugh;
    if (reactions.celebrate) document.getElementById('celebrateCount').innerText = reactions.celebrate;
}

function getEmojiName(emojiType) {
    const names = { like: '👍 Like', love: '❤️ Love', wow: '😮 Wow', sad: '😢 Sad', angry: '😠 Angry', laugh: '😂 Laugh', celebrate: '🎉 Celebrate' };
    return names[emojiType] || emojiType;
}

function incrementLocalReaction(emojiType) {
    let reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    reactions[emojiType] = (reactions[emojiType] || 0) + 1;
    localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactions));
    updateReactionCounts(reactions);
}

function loadLocalStats() {
    document.getElementById('usedCount').innerText = localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
    document.getElementById('shareCount').innerText = localStorage.getItem(`${TOOL_SLUG}_shares`) || 0;
    const reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    updateReactionCounts(reactions);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// FILE HANDLING FUNCTIONS
// ============================================

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    addFiles(files);
}

function addFiles(files) {
    files.forEach(file => {
        if (file.type === 'application/pdf') {
            if (!selectedFiles.find(f => f.name === file.name)) {
                selectedFiles.push(file);
            }
        }
    });
    updateFileList();
    document.getElementById('convertBtn').disabled = selectedFiles.length === 0;
    showToast(`${files.length} PDF file(s) added`, 'success');
}

function updateFileList() {
    const container = document.getElementById('fileList');
    if (selectedFiles.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = selectedFiles.map((file, index) => `
        <div class="file-item">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-file-pdf" style="color: var(--danger);"></i>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button class="delete-file" data-index="${index}"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');
    
    document.querySelectorAll('.delete-file').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.dataset.index);
            selectedFiles.splice(index, 1);
            updateFileList();
            document.getElementById('convertBtn').disabled = selectedFiles.length === 0;
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
        XLSX.utils.book_append_sheet(wb, ws, document.getElementById('sheetName').value || 'Sheet1');
        return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    }
}

function updateProgress(percent) {
    const bar = document.getElementById('progressBar');
    bar.style.width = percent + '%';
}

// ============================================
// MAIN CONVERSION FUNCTION
// ============================================

async function convertPDF() {
    if (selectedFiles.length === 0) {
        showToast('Please select a PDF file first', 'error');
        return;
    }
    
    const convertBtn = document.getElementById('convertBtn');
    convertBtn.disabled = true;
    convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
    
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('status').innerHTML = 'Processing PDF...';
    updateProgress(10);
    
    const outputFormat = document.getElementById('outputFormat').value;
    const csvDelimiter = document.getElementById('csvDelimiter').value;
    const actualDelimiter = csvDelimiter === 'tab' ? '\t' : csvDelimiter;
    const pageRange = document.getElementById('pageRange').value;
    const filterText = document.getElementById('filterText').value;
    const findText = document.getElementById('findText').value;
    const replaceText = document.getElementById('replaceText').value;
    const removeEmpty = document.getElementById('removeEmptyRows').checked;
    const addHeaders = document.getElementById('addHeaders').checked;
    
    const allResults = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        updateProgress(20 + (i / selectedFiles.length) * 60);
        document.getElementById('status').innerHTML = `Processing ${file.name}...`;
        
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
            showToast(`Error processing ${file.name}`, 'error');
        }
    }
    
    updateProgress(90);
    
    // Show preview
    if (currentPreviewData.length > 0) {
        displayPreview(currentPreviewData);
        document.getElementById('previewCard').style.display = 'block';
    }
    
    // Show download buttons
    const downloadContainer = document.getElementById('downloadButtons');
    downloadContainer.innerHTML = '';
    
    allResults.forEach((result, idx) => {
        const blob = new Blob([result.data], { type: result.mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.className = 'download-btn';
        link.href = url;
        link.download = result.name;
        link.innerHTML = `<i class="fas fa-download"></i> ${result.name}`;
        downloadContainer.appendChild(link);
    });
    
    // Save to history
    saveToHistory(selectedFiles.length, outputFormat);
    
    document.getElementById('downloadCard').style.display = 'block';
    document.getElementById('status').innerHTML = 'Conversion complete! Ready to download.';
    updateProgress(100);
    document.getElementById('spinner').style.display = 'none';
    
    convertBtn.disabled = false;
    convertBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Convert PDF';
    
    // Track usage
    trackToolUsage();
    showToast(`Successfully converted ${selectedFiles.length} file(s)!`, 'success');
}

function displayPreview(data) {
    const container = document.getElementById('previewContainer');
    if (!data || data.length === 0) {
        container.innerHTML = '<p>No data to preview</p>';
        return;
    }
    
    let html = '<table class="preview-table"><thead><tr>';
    const maxCols = Math.max(...data.map(row => row.length));
    for (let i = 0; i < maxCols; i++) html += `<th>Col ${i + 1}</th>`;
    html += '</tr></thead><tbody>';
    
    data.slice(0, 10).forEach(row => {
        html += '<tr>';
        for (let i = 0; i < maxCols; i++) {
            html += `<td>${escapeHtml(row[i] || '')}</td>`;
        }
        html += '</tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
    
    document.getElementById('previewStats').innerHTML = `Showing ${Math.min(data.length, 10)} of ${data.length} rows, ${maxCols} columns`;
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

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
    
    if (saved.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray);">No recent conversions</p>';
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
    showToast('Shared on Facebook!', 'success'); 
}

function shareOnTwitter() { 
    window.open(`https://twitter.com/intent/tweet?text=PDF%20to%20Excel%20Converter&url=${encodeURIComponent(window.location.href)}`, '_blank'); 
    trackShare('twitter'); 
    showToast('Shared on Twitter!', 'success'); 
}

function shareOnWhatsApp() { 
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank'); 
    trackShare('whatsapp'); 
    showToast('Shared on WhatsApp!', 'success'); 
}

async function copyPageLink() { 
    await navigator.clipboard.writeText(window.location.href); 
    trackShare('copy'); 
    showToast('Link copied!', 'success'); 
}

function setupScrollButtons() {
    const upBtn = document.getElementById('scrollUpBtn');
    const downBtn = document.getElementById('scrollDownBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
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
    getToolStats();
    displayFileHistory();
    
    // File upload
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
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
    
    // Convert button
    document.getElementById('convertBtn').addEventListener('click', convertPDF);
    
    // Find & Replace
    document.getElementById('applyReplaceBtn').addEventListener('click', () => {
        const findText = document.getElementById('findText').value;
        const replaceText = document.getElementById('replaceText').value;
        if (findText && currentPreviewData) {
            currentPreviewData = findAndReplace(currentPreviewData, findText, replaceText);
            displayPreview(currentPreviewData);
            showToast(`Replaced "${findText}" with "${replaceText}"`, 'success');
        }
    });
    
    // Clear history
    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
        localStorage.removeItem('pdfConverterHistory');
        displayFileHistory();
        showToast('History cleared', 'success');
    });
    
    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.emoji));
    });
    
    // Share buttons
    document.querySelector('.share-btn.facebook')?.addEventListener('click', shareOnFacebook);
    document.querySelector('.share-btn.twitter')?.addEventListener('click', shareOnTwitter);
    document.querySelector('.share-btn.whatsapp')?.addEventListener('click', shareOnWhatsApp);
    document.querySelector('.share-btn.copy-link')?.addEventListener('click', copyPageLink);
    
    // Scroll buttons
    setupScrollButtons();
    
    showToast('Welcome! Upload PDF to convert to Excel/CSV', 'success');
});
