// mind-map-generator.js
// ============================================
// FULLY WORKING VERSION - All Features Included
// Multi-Language | 3 Views | API Integration | Reactions | Usage Counter
// PDF | DOCX | TXT | CSV File Support
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const API_BASE = '/api';
const TOOL_SLUG = 'mind-map-generator';

// State Variables
let currentMindMap = null;
let currentView = 'mindmap';
let currentZoom = 1;
let userReactions = JSON.parse(localStorage.getItem('mm_user_reactions') || '{}');

// User Identity
let userId = localStorage.getItem('mm_user_id');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    localStorage.setItem('mm_user_id', userId);
}

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// Emoji Mapping
const EMOJI_MAP = {
    '👍': 'like', '❤️': 'love', '😮': 'wow',
    '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate'
};

// Language Detection Patterns
const LANGUAGE_PATTERNS = {
    'Urdu': { regex: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/, flag: 'fa-flag-pakistan', color: '#2E7D32' },
    'Arabic': { regex: /[\u0600-\u06FF\u0750-\u077F]/, flag: 'fa-flag-saudi-arabia', color: '#C2185B' },
    'Hindi': { regex: /[\u0900-\u097F]/, flag: 'fa-flag-india', color: '#FF6F00' },
    'Chinese': { regex: /[\u4e00-\u9fff]/, flag: 'fa-flag-china', color: '#D32F2F' },
    'Spanish': { regex: /el|la|los|las|un|una|y|es|en|por|para|con/i, flag: 'fa-flag-spain', color: '#FFB300' },
    'French': { regex: /le|la|les|un|une|de|du|des|et|est|sont|pour/i, flag: 'fa-flag-france', color: '#1976D2' },
    'English': { regex: /the|and|of|to|in|for|on|with|by|this|that/i, flag: 'fa-flag-usa', color: '#0288D1' }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function toggleLoading(show, message = 'Processing...', showProgress = false) {
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="spinner"></div><p id="loadingText">Processing...</p><div class="loading-progress"><div class="progress-bar"><div class="progress-fill"></div></div></div>';
        document.body.appendChild(overlay);
    }
    const loadingText = document.getElementById('loadingText');
    const progressDiv = overlay.querySelector('.loading-progress');
    if (loadingText) loadingText.textContent = message;
    if (progressDiv) progressDiv.style.display = showProgress ? 'block' : 'none';
    overlay.style.display = show ? 'flex' : 'none';
}

function updateProgress(percent) {
    const fill = document.querySelector('.loading-progress .progress-fill');
    if (fill) fill.style.width = percent + '%';
}

function detectLanguage(text) {
    if (!text || text.trim().length === 0) return 'English';
    
    const textSample = text.substring(0, 500);
    
    for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
        if (pattern.regex.test(textSample)) return lang;
    }
    return 'English';
}

function updateLanguageDisplay(text) {
    const lang = detectLanguage(text);
    const langInfo = LANGUAGE_PATTERNS[lang] || LANGUAGE_PATTERNS['English'];
    document.getElementById('detectedLang').innerText = lang;
    const langIcon = document.getElementById('langIcon');
    if (langIcon) {
        langIcon.innerHTML = `<i class="fab ${langInfo.flag}"></i>`;
        langIcon.style.color = langInfo.color;
    }
    return lang;
}

// ============================================
// FILE PARSERS (PDF, DOCX, TXT, CSV)
// ============================================

async function parsePDF(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const typedarray = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    updateProgress(Math.floor((i / pdf.numPages) * 100));
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
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

async function parseDOCX(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const arrayBuffer = e.target.result;
                const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
                resolve(result.value);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

async function parseTXT(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = reject;
        reader.readAsText(file, 'UTF-8');
    });
}

async function parseCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                let text = '';
                jsonData.forEach(row => {
                    text += Object.values(row).join(' ') + '\n';
                });
                resolve(text);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

async function parseFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    toggleLoading(true, `Reading ${file.name}...`, true);
    
    try {
        let text = '';
        switch (ext) {
            case 'pdf':
                text = await parsePDF(file);
                break;
            case 'docx':
                text = await parseDOCX(file);
                break;
            case 'txt':
                text = await parseTXT(file);
                break;
            case 'csv':
                text = await parseCSV(file);
                break;
            default:
                throw new Error('Unsupported file format');
        }
        toggleLoading(false);
        return text;
    } catch (error) {
        toggleLoading(false);
        console.error('Parse error:', error);
        throw new Error(`Failed to parse ${ext.toUpperCase()} file`);
    }
}

// ============================================
// API CALLS
// ============================================

async function fetchStats() {
    try {
        const usageRes = await fetch(`${API_BASE}/${TOOL_SLUG}/usage`);
        if (usageRes.ok) {
            const usageData = await usageRes.json();
            document.getElementById('usageCount').innerText = usageData.count || 0;
        }
        
        const reactionsRes = await fetch(`${API_BASE}/${TOOL_SLUG}/reactions`);
        if (reactionsRes.ok) {
            const reactionsData = await reactionsRes.json();
            if (reactionsData.reactions) {
                document.getElementById('react-like').innerText = reactionsData.reactions.like || 0;
                document.getElementById('react-love').innerText = reactionsData.reactions.love || 0;
                document.getElementById('react-wow').innerText = reactionsData.reactions.wow || 0;
                document.getElementById('react-sad').innerText = reactionsData.reactions.sad || 0;
                document.getElementById('react-angry').innerText = reactionsData.reactions.angry || 0;
                document.getElementById('react-laugh').innerText = reactionsData.reactions.laugh || 0;
                document.getElementById('react-celebrate').innerText = reactionsData.reactions.celebrate || 0;
            }
        }
        
        const sharesRes = await fetch(`${API_BASE}/${TOOL_SLUG}/shares`);
        if (sharesRes.ok) {
            const sharesData = await sharesRes.json();
            document.getElementById('totalShares').innerText = sharesData.shares || 0;
        }
    } catch (error) {
        console.error('Stats fetch error:', error);
    }
}

async function incrementUsage() {
    try {
        await fetch(`${API_BASE}/${TOOL_SLUG}/usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        fetchStats();
    } catch (error) {
        console.error('Usage increment error:', error);
    }
}

async function addReaction(emoji) {
    const reactionType = EMOJI_MAP[emoji];
    
    if (userReactions[reactionType]) {
        showToast(`You already reacted with ${emoji}`, 'warning');
        return false;
    }
    
    toggleLoading(true, 'Saving your feedback...');
    
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/reactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emoji, user_id: userId })
        });
        
        const result = await response.json();
        
        if (result.success || result.already_reacted === false) {
            userReactions[reactionType] = true;
            localStorage.setItem('mm_user_reactions', JSON.stringify(userReactions));
            showToast(`Thank you for your feedback! ${emoji}`, 'success');
            fetchStats();
            return true;
        } else if (result.already_reacted) {
            showToast(`You already reacted with ${emoji}`, 'warning');
            return false;
        }
    } catch (error) {
        console.error('Reaction error:', error);
        showToast('Failed to save reaction', 'error');
        return false;
    } finally {
        toggleLoading(false);
    }
}

async function recordShare(platform) {
    try {
        await fetch(`${API_BASE}/${TOOL_SLUG}/shares`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ platform, user_id: userId })
        });
        fetchStats();
        showToast(`Shared on ${platform}!`, 'success');
    } catch (error) {
        console.error('Share error:', error);
    }
}

// ============================================
// MIND MAP GENERATOR (Fallback + API)
// ============================================

function generateFallbackMindMap(text) {
    console.log('Using fallback mind map generator');
    
    let central = text.split('\n')[0].substring(0, 60);
    if (central.length > 50) central = central.substring(0, 47) + '...';
    if (!central) central = 'Main Topic';
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const words = text.split(/\s+/);
    const wordFreq = {};
    
    words.forEach(w => {
        if (w.length > 4) {
            wordFreq[w.toLowerCase()] = (wordFreq[w.toLowerCase()] || 0) + 1;
        }
    });
    
    const topWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);
    
    const branches = [];
    
    for (let i = 0; i < Math.min(topWords.length, 5); i++) {
        const branchName = topWords[i].charAt(0).toUpperCase() + topWords[i].slice(1);
        const subBranches = [];
        
        const relatedSentences = sentences.filter(s => 
            s.toLowerCase().includes(topWords[i])
        );
        
        for (let j = 0; j < Math.min(relatedSentences.length, 4); j++) {
            let subText = relatedSentences[j].trim();
            if (subText.length > 40) subText = subText.substring(0, 37) + '...';
            if (subText) subBranches.push(subText);
        }
        
        if (subBranches.length === 0) {
            subBranches.push(`Key aspect of ${branchName}`);
            subBranches.push(`Important details about ${branchName}`);
        }
        
        branches.push({ name: branchName, subBranches: subBranches });
    }
    
    if (branches.length === 0) {
        branches.push({ name: 'Main Concepts', subBranches: ['Key idea 1', 'Key idea 2', 'Key idea 3'] });
        branches.push({ name: 'Important Details', subBranches: ['Detail A', 'Detail B', 'Detail C'] });
    }
    
    return { central, branches };
}

async function generateMindMap(text) {
    if (!text || text.trim().length === 0) {
        showToast('Please enter some content or upload a file', 'error');
        return null;
    }
    
    toggleLoading(true, 'AI is analyzing your content...');
    
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/generate-mindmap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                topic: text.substring(0, 1500),
                subject: 'General Knowledge'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.mindmap && data.mindmap.central && data.mindmap.branches) {
                currentMindMap = data.mindmap;
                renderCurrentView();
                incrementUsage();
                showToast('Mind Map generated successfully!', 'success');
                return currentMindMap;
            }
        }
        
        currentMindMap = generateFallbackMindMap(text);
        renderCurrentView();
        incrementUsage();
        showToast('Mind Map generated successfully!', 'success');
        return currentMindMap;
        
    } catch (error) {
        console.error('Generate error:', error);
        currentMindMap = generateFallbackMindMap(text);
        renderCurrentView();
        incrementUsage();
        showToast('Mind Map generated successfully!', 'success');
        return currentMindMap;
    } finally {
        toggleLoading(false);
    }
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderMindMap() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-project-diagram"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="mindmap-container">
        <div class="central-topic"><i class="fas fa-dot-circle"></i> ${escapeHtml(currentMindMap.central)}</div>
        <div class="branches-grid">`;
    
    currentMindMap.branches.forEach(branch => {
        html += `
            <div class="branch-card">
                <div class="branch-title"><i class="fas fa-code-branch"></i> ${escapeHtml(branch.name)}</div>
                <div class="sub-items">
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            branch.subBranches.forEach(sub => {
                html += `<div class="sub-item"><i class="fas fa-circle" style="font-size: 6px; vertical-align: middle;"></i> ${escapeHtml(sub)}</div>`;
            });
        } else {
            html += `<div class="sub-item"><i class="fas fa-info-circle"></i> No sub-topics available</div>`;
        }
        html += `</div></div>`;
    });
    
    html += `</div></div>`;
    return html;
}

function renderInfographic() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-chart-pie"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    const totalSubs = currentMindMap.branches.reduce((sum, b) => sum + (b.subBranches?.length || 0), 0);
    const avgPerBranch = currentMindMap.branches.length > 0 ? (totalSubs / currentMindMap.branches.length).toFixed(1) : 0;
    
    let html = `<div class="infographic-container">
        <div class="info-header">
            <h2><i class="fas fa-chart-line"></i> ${escapeHtml(currentMindMap.central)}</h2>
            <div class="stats-row">
                <div class="stat-circle"><div class="stat-number">${currentMindMap.branches.length}</div><div>Main Topics</div></div>
                <div class="stat-circle"><div class="stat-number">${totalSubs}</div><div>Sub Topics</div></div>
                <div class="stat-circle"><div class="stat-number">${avgPerBranch}</div><div>Avg per Topic</div></div>
            </div>
        </div>
        <div class="branches-grid">`;
    
    currentMindMap.branches.forEach((branch, idx) => {
        const subCount = branch.subBranches?.length || 0;
        const percentage = totalSubs > 0 ? (subCount / totalSubs) * 100 : 0;
        html += `
            <div class="info-branch">
                <h3><i class="fas fa-chart-simple"></i> ${escapeHtml(branch.name)}</h3>
                <div class="progress-bar"><div class="progress-fill" style="width: ${percentage}%"></div></div>
                <div style="font-size: 0.8rem; margin-bottom: 12px;">${subCount} key points</div>
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            branch.subBranches.forEach(sub => {
                html += `<div style="padding: 4px 0;"><i class="fas fa-check-circle" style="color: var(--primary-blue); font-size: 12px;"></i> ${escapeHtml(sub)}</div>`;
            });
        }
        html += `</div>`;
    });
    
    html += `</div></div>`;
    return html;
}

function renderBulletPoints() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-list-ul"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="bullet-container">
        <div class="bullet-central"><i class="fas fa-bullseye"></i> ${escapeHtml(currentMindMap.central)}</div>
        <div class="bullet-branches">`;
    
    currentMindMap.branches.forEach(branch => {
        html += `
            <div class="bullet-branch">
                <div class="bullet-branch-title"><i class="fas fa-folder-open"></i> ${escapeHtml(branch.name)}</div>
                <ul class="bullet-sub-items">
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            branch.subBranches.forEach(sub => {
                html += `<li>${escapeHtml(sub)}</li>`;
            });
        } else {
            html += `<li>No sub-points available</li>`;
        }
        html += `</ul></div>`;
    });
    
    html += `</div></div>`;
    return html;
}

function renderCurrentView() {
    const canvas = document.getElementById('displayCanvas');
    if (!canvas) return;
    
    let html = '';
    switch (currentView) {
        case 'mindmap':
            html = renderMindMap();
            document.getElementById('viewTitle').innerHTML = '<i class="fas fa-project-diagram"></i> Mind Map View';
            break;
        case 'infographic':
            html = renderInfographic();
            document.getElementById('viewTitle').innerHTML = '<i class="fas fa-chart-pie"></i> Infographic View';
            break;
        case 'bullet':
            html = renderBulletPoints();
            document.getElementById('viewTitle').innerHTML = '<i class="fas fa-list-ul"></i> Bullet Points View';
            break;
        default:
            html = renderMindMap();
    }
    
    canvas.innerHTML = html;
    canvas.style.transform = `scale(${currentZoom})`;
    canvas.style.transformOrigin = 'top center';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function exportAsTXT() {
    if (!currentMindMap) {
        showToast('Please generate a mind map first', 'error');
        return;
    }
    
    let content = `========================================\n`;
    content += `AI MIND MAP GENERATOR\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `========================================\n\n`;
    content += `📌 CENTRAL TOPIC: ${currentMindMap.central}\n\n`;
    content += `========================================\n`;
    content += `MAIN BRANCHES & SUB-TOPICS\n`;
    content += `========================================\n\n`;
    
    currentMindMap.branches.forEach((branch, idx) => {
        content += `${idx + 1}. ${branch.name}\n`;
        if (branch.subBranches && branch.subBranches.length > 0) {
            branch.subBranches.forEach((sub, subIdx) => {
                content += `   ${String.fromCharCode(97 + subIdx)}. ${sub}\n`;
            });
        }
        content += `\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmap_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('TXT file downloaded!', 'success');
}

function exportAsDOC() {
    if (!currentMindMap) {
        showToast('Please generate a mind map first', 'error');
        return;
    }
    
    let htmlContent = `<!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Mind Map - ${currentMindMap.central}</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #0288D1; border-bottom: 3px solid #81D4FA; padding-bottom: 10px; }
        .central { background: linear-gradient(135deg, #0288D1, #81D4FA); color: white; padding: 20px; border-radius: 60px; text-align: center; margin: 30px 0; }
        .branch { margin: 20px 0; padding: 15px; border-left: 4px solid #0288D1; background: #f5f5f5; border-radius: 8px; }
        .branch h3 { color: #0288D1; margin: 0 0 10px 0; }
        .sub { margin-left: 20px; padding: 5px 0; }
        .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
    </style>
    </head>
    <body>
        <h1>🧠 AI Generated Mind Map</h1>
        <div class="central"><h2>${escapeHtml(currentMindMap.central)}</h2></div>`;
    
    currentMindMap.branches.forEach(branch => {
        htmlContent += `<div class="branch"><h3>📌 ${escapeHtml(branch.name)}</h3>`;
        if (branch.subBranches && branch.subBranches.length > 0) {
            branch.subBranches.forEach(sub => {
                htmlContent += `<div class="sub">• ${escapeHtml(sub)}</div>`;
            });
        }
        htmlContent += `</div>`;
    });
    
    htmlContent += `<div class="footer"><p>Generated by AI Mind Map Generator | ${new Date().toLocaleString()}</p></div>
    </body></html>`;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmap_${Date.now()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('DOC file downloaded!', 'success');
}

function exportAsPDF() {
    if (!currentMindMap) {
        showToast('Please generate a mind map first', 'error');
        return;
    }
    showToast('Opening print dialog... Select "Save as PDF"', 'info');
    window.print();
}

// ============================================
// FILE UPLOAD HANDLER
// ============================================

async function handleFileUpload(file) {
    const validExtensions = ['pdf', 'docx', 'txt', 'csv'];
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(ext)) {
        showToast('Please upload PDF, DOCX, TXT, or CSV file', 'error');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        showToast('File too large (max 10MB)', 'error');
        return;
    }
    
    try {
        const content = await parseFile(file);
        document.getElementById('textInput').value = content;
        updateLanguageDisplay(content);
        showToast(`Successfully loaded: ${file.name}`, 'success');
        document.getElementById('fileName').style.display = 'block';
        document.getElementById('fileName').innerHTML = `<i class="fas fa-file-alt"></i> ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        document.querySelector('.tab-btn[data-tab="text"]').click();
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    }
}

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================

function initEventListeners() {
    document.getElementById('generateBtn').addEventListener('click', async () => {
        const text = document.getElementById('textInput').value.trim();
        if (!text) {
            showToast('Please enter content or upload a file', 'error');
            return;
        }
        updateLanguageDisplay(text);
        await generateMindMap(text);
    });
    
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.getAttribute('data-style');
            renderCurrentView();
        });
    });
    
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('mm_theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        const target = current === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', target);
        localStorage.setItem('mm_theme', target);
        themeToggle.innerHTML = target === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
    
    document.getElementById('scrollTop').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('scrollBottom').onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    
    document.getElementById('zoomIn').addEventListener('click', () => {
        currentZoom = Math.min(currentZoom + 0.1, 2);
        const canvas = document.getElementById('displayCanvas');
        if (canvas) canvas.style.transform = `scale(${currentZoom})`;
    });
    document.getElementById('zoomOut').addEventListener('click', () => {
        currentZoom = Math.max(currentZoom - 0.1, 0.5);
        const canvas = document.getElementById('displayCanvas');
        if (canvas) canvas.style.transform = `scale(${currentZoom})`;
    });
    document.getElementById('resetZoom').addEventListener('click', () => {
        currentZoom = 1;
        const canvas = document.getElementById('displayCanvas');
        if (canvas) canvas.style.transform = 'scale(1)';
    });
    
    document.getElementById('exportTxt').addEventListener('click', exportAsTXT);
    document.getElementById('exportDoc').addEventListener('click', exportAsDOC);
    document.getElementById('exportPdf').addEventListener('click', exportAsPDF);
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const emoji = btn.getAttribute('data-emoji');
            await addReaction(emoji);
        });
    });
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const platform = btn.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Check out this AI Mind Map Generator!');
            
            if (platform === 'copy') {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied!', 'success');
            } else {
                let shareUrl = '';
                if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${text}%20${url}`;
                if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
            await recordShare(platform);
        });
    });
    
    const textInput = document.getElementById('textInput');
    const savedDraft = localStorage.getItem('mm_draft');
    if (savedDraft) {
        textInput.value = savedDraft;
        updateLanguageDisplay(savedDraft);
    }
    
    textInput.addEventListener('input', (e) => {
        const text = e.target.value;
        localStorage.setItem('mm_draft', text);
        updateLanguageDisplay(text);
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-blue)';
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--sky-blue)';
    });
    dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--sky-blue)';
        const file = e.dataTransfer.files[0];
        if (file) await handleFileUpload(file);
    });
    
    fileInput.addEventListener('change', async (e) => {
        if (e.target.files[0]) await handleFileUpload(e.target.files[0]);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    fetchStats();
});
