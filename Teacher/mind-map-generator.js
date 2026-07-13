// mind-map-generator.js
// ============================================
// COMPLETE: 21 Display Styles + AI Features
// Cloudflare Workers API Integration
// Multi-Language | 21 Views | Reactions
// PDF | DOCX | TXT | CSV File Support
// ============================================

// ============================================
// CONFIGURATION - Cloudflare Workers API
// ============================================
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';
const TOOL_SLUG = 'mind-map-generator';
const TOOL_NAME = 'AI Mind Map Generator';
const CATEGORY = 'Mixed-Tools';

// State Variables
let currentMindMap = null;
let currentView = 'mindmap';
let currentZoom = 1;
let userReactions = JSON.parse(localStorage.getItem('mm_user_reactions') || '{}');
let statsData = {
    usage: 0,
    views: 0,
    shares: 0,
    reactions: 0
};
let isFullScreen = false;
let typewriterInterval = null;

// User Identity
let userId = localStorage.getItem('mm_user_id');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    localStorage.setItem('mm_user_id', userId);
}

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// Emoji Mapping for Reactions
const EMOJI_MAP = {
    '👍': 'like', '❤️': 'love', '😮': 'wow',
    '😢': 'sad', '😂': 'laugh', '🎉': 'celebrate',
    '🤔': 'think'
};

// Reaction Colors (Colorful Theme)
const REACTION_COLORS = {
    '👍': '#4CAF50',
    '❤️': '#E91E63',
    '😮': '#FF9800',
    '😢': '#2196F3',
    '😂': '#FFC107',
    '🎉': '#9C27B0',
    '🤔': '#607D8B'
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
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-info-circle',
        info: 'fa-info-circle'
    };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
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
        overlay.innerHTML = `
            <div class="spinner"></div>
            <p id="loadingText">Processing...</p>
            <div class="loading-progress">
                <div class="progress-bar"><div class="progress-fill"></div></div>
            </div>
        `;
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
// TYPEWRITER ANIMATION - Multiple Phrases
// ============================================

function initTypewriter() {
    const elements = document.querySelectorAll('.typewriter');
    elements.forEach(el => {
        const phrases = JSON.parse(el.getAttribute('data-text') || '["AI Mind Map Generator"]');
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentText = '';

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (!isDeleting) {
                // Typing
                currentText = currentPhrase.substring(0, charIndex + 1);
                el.textContent = currentText;
                charIndex++;
                
                if (charIndex === currentPhrase.length) {
                    isDeleting = true;
                    setTimeout(type, 2000);
                    return;
                }
                setTimeout(type, 80);
            } else {
                // Deleting
                currentText = currentPhrase.substring(0, charIndex - 1);
                el.textContent = currentText;
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(type, 500);
                    return;
                }
                setTimeout(type, 40);
            }
        }

        // Start typing after a delay
        setTimeout(type, 1000);
    });
}

// ============================================
// CLOUDFLARE WORKERS API CALLS
// ============================================

// 1. GET /api/stats?tool_slug=:slug - Get Tool Stats
async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            statsData = data;
            
            // Update UI with real stats
            document.getElementById('usageCount').innerText = data.usage || 0;
            document.getElementById('totalViews').innerText = data.views || 0;
            document.getElementById('totalShares').innerText = data.shares || 0;
            
            // Calculate total reactions
            let totalReactions = 0;
            if (data.reactions) {
                totalReactions = Object.values(data.reactions).reduce((a, b) => a + b, 0);
                document.getElementById('react-like').innerText = data.reactions.like || 0;
                document.getElementById('react-love').innerText = data.reactions.love || 0;
                document.getElementById('react-wow').innerText = data.reactions.wow || 0;
                document.getElementById('react-sad').innerText = data.reactions.sad || 0;
                document.getElementById('react-laugh').innerText = data.reactions.laugh || 0;
                document.getElementById('react-celebrate').innerText = data.reactions.celebrate || 0;
                document.getElementById('react-think').innerText = data.reactions.think || 0;
            }
            document.getElementById('totalReactions').innerText = totalReactions;
        } else {
            // Fallback: Use localStorage
            loadStatsFromLocalStorage();
        }
    } catch (error) {
        console.warn('Stats fetch error, using localStorage fallback:', error);
        loadStatsFromLocalStorage();
    }
}

// 2. POST /api/usage - Usage Counter Increment
async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG,
                user_id: userId,
                tool_name: TOOL_NAME,
                category: CATEGORY
            })
        });
        
        if (response.ok) {
            await fetchStats();
        } else {
            // Fallback: localStorage
            incrementLocalUsage();
        }
    } catch (error) {
        console.warn('Usage increment error, using localStorage fallback:', error);
        incrementLocalUsage();
    }
}

// 3. POST /api/reactions - Add Reaction
async function addReaction(emoji) {
    const reactionType = EMOJI_MAP[emoji];
    
    if (userReactions[reactionType]) {
        showToast(`You already reacted with ${emoji}`, 'warning');
        return false;
    }
    
    toggleLoading(true, 'Saving your feedback...');
    
    try {
        const response = await fetch(`${API_BASE}/api/reactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG,
                emoji: emoji,
                reaction_type: reactionType,
                user_id: userId
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            userReactions[reactionType] = true;
            localStorage.setItem('mm_user_reactions', JSON.stringify(userReactions));
            showToast(`Thank you for your feedback! ${emoji}`, 'success');
            await fetchStats();
            return true;
        } else if (result.already_reacted) {
            showToast(`You already reacted with ${emoji}`, 'warning');
            return false;
        } else {
            // Fallback: localStorage
            return addLocalReaction(reactionType, emoji);
        }
    } catch (error) {
        console.warn('Reaction error, using localStorage fallback:', error);
        return addLocalReaction(reactionType, emoji);
    } finally {
        toggleLoading(false);
    }
}

// 4. POST /api/shares - Record Shares
async function recordShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/api/shares`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG,
                platform: platform,
                user_id: userId
            })
        });
        
        if (response.ok) {
            await fetchStats();
            showToast(`Shared on ${platform}!`, 'success');
        } else {
            // Fallback: localStorage
            recordLocalShare(platform);
        }
    } catch (error) {
        console.warn('Share error, using localStorage fallback:', error);
        recordLocalShare(platform);
    }
}

// ============================================
// LOCALSTORAGE FALLBACK FUNCTIONS
// ============================================

function loadStatsFromLocalStorage() {
    const localStats = JSON.parse(localStorage.getItem('mm_stats') || '{}');
    statsData = {
        usage: localStats.usage || 0,
        views: localStats.views || 0,
        shares: localStats.shares || 0,
        reactions: localStats.reactions || 0
    };
    updateStatsUI();
    
    // Load local reactions
    const localReactions = JSON.parse(localStorage.getItem('mm_reactions') || '{}');
    document.getElementById('react-like').innerText = localReactions.like || 0;
    document.getElementById('react-love').innerText = localReactions.love || 0;
    document.getElementById('react-wow').innerText = localReactions.wow || 0;
    document.getElementById('react-sad').innerText = localReactions.sad || 0;
    document.getElementById('react-laugh').innerText = localReactions.laugh || 0;
    document.getElementById('react-celebrate').innerText = localReactions.celebrate || 0;
    document.getElementById('react-think').innerText = localReactions.think || 0;
}

function updateStatsUI() {
    document.getElementById('usageCount').innerText = statsData.usage || 0;
    document.getElementById('totalViews').innerText = statsData.views || 0;
    document.getElementById('totalShares').innerText = statsData.shares || 0;
    
    // Calculate total reactions
    const localReactions = JSON.parse(localStorage.getItem('mm_reactions') || '{}');
    const total = Object.values(localReactions).reduce((a, b) => a + b, 0);
    document.getElementById('totalReactions').innerText = total || statsData.reactions || 0;
}

function incrementLocalUsage() {
    const localStats = JSON.parse(localStorage.getItem('mm_stats') || '{}');
    localStats.usage = (localStats.usage || 0) + 1;
    localStorage.setItem('mm_stats', JSON.stringify(localStats));
    loadStatsFromLocalStorage();
}

function addLocalReaction(reactionType, emoji) {
    if (userReactions[reactionType]) {
        showToast(`You already reacted with ${emoji}`, 'warning');
        return false;
    }
    
    const localReactions = JSON.parse(localStorage.getItem('mm_reactions') || '{}');
    localReactions[reactionType] = (localReactions[reactionType] || 0) + 1;
    localStorage.setItem('mm_reactions', JSON.stringify(localReactions));
    
    userReactions[reactionType] = true;
    localStorage.setItem('mm_user_reactions', JSON.stringify(userReactions));
    
    showToast(`Thank you for your feedback! ${emoji}`, 'success');
    loadStatsFromLocalStorage();
    return true;
}

function recordLocalShare(platform) {
    const localStats = JSON.parse(localStorage.getItem('mm_stats') || '{}');
    localStats.shares = (localStats.shares || 0) + 1;
    localStorage.setItem('mm_stats', JSON.stringify(localStats));
    showToast(`Shared on ${platform}! (Offline)`, 'success');
    loadStatsFromLocalStorage();
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
        throw new Error(`Failed to parse ${ext.toUpperCase()} file: ${error.message}`);
    }
}

// ============================================
// MIND MAP GENERATOR (Fallback Only)
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
        // Try AI API first
        const response = await fetch(`${API_BASE}/api/generate-mindmap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG,
                content: text.substring(0, 1500),
                subject: 'General Knowledge',
                language: detectLanguage(text)
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.mindmap && data.mindmap.central && data.mindmap.branches) {
                currentMindMap = data.mindmap;
                renderCurrentView();
                await incrementUsage();
                showToast('Mind Map generated successfully!', 'success');
                return currentMindMap;
            }
        }
        
        // Fallback to local generation
        currentMindMap = generateFallbackMindMap(text);
        renderCurrentView();
        await incrementUsage();
        showToast('Mind Map generated successfully!', 'success');
        return currentMindMap;
        
    } catch (error) {
        console.error('Generate error:', error);
        currentMindMap = generateFallbackMindMap(text);
        renderCurrentView();
        await incrementUsage();
        showToast('Mind Map generated successfully!', 'success');
        return currentMindMap;
    } finally {
        toggleLoading(false);
    }
}

// ============================================
// 21 RENDER FUNCTIONS
// ============================================

// 1. Mind Map
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

// 2. Infographic
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

// 3. Bullet Points
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

// 4. Timeline View
function renderTimeline() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-clock"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="timeline-container">`;
    currentMindMap.branches.forEach((branch, idx) => {
        const date = new Date();
        date.setDate(date.getDate() + idx * 7);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        html += `
            <div class="timeline-item">
                <div class="timeline-content">
                    <div class="timeline-title"><i class="fas fa-timeline"></i> ${escapeHtml(branch.name)}</div>
                    <div class="timeline-date"><i class="far fa-calendar-alt"></i> ${dateStr}</div>
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            branch.subBranches.forEach(sub => {
                html += `<div style="padding: 4px 0;"><i class="fas fa-circle" style="font-size: 8px; color: var(--primary-blue);"></i> ${escapeHtml(sub)}</div>`;
            });
        }
        html += `</div></div>`;
    });
    html += `</div>`;
    return html;
}

// 5. Flowchart View
function renderFlowchart() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-sitemap"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="flowchart-container">
        <div class="flowchart-step" style="background: linear-gradient(135deg, var(--primary-blue), var(--sky-blue)); color: white; border-color: var(--primary-blue);">
            <div class="step-number" style="background: white; color: var(--primary-blue);">Start</div>
            <div class="step-title" style="color: white;">${escapeHtml(currentMindMap.central)}</div>
        </div>`;
    
    currentMindMap.branches.forEach((branch, idx) => {
        html += `<div class="flowchart-arrow"><i class="fas fa-arrow-down"></i></div>`;
        html += `
            <div class="flowchart-step">
                <div class="step-number">${idx + 1}</div>
                <div class="step-title">${escapeHtml(branch.name)}</div>
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            html += `<div class="step-desc">${escapeHtml(branch.subBranches[0])}</div>`;
        }
        html += `</div>`;
    });
    
    html += `<div class="flowchart-arrow"><i class="fas fa-arrow-down"></i></div>
        <div class="flowchart-step" style="background: linear-gradient(135deg, var(--success), var(--primary-yellow)); color: white; border-color: var(--success);">
            <div class="step-number" style="background: white; color: var(--success);">End</div>
            <div class="step-title" style="color: white;">Complete</div>
        </div>
    </div>`;
    return html;
}

// 6. Cards View
function renderCards() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-id-card"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="cards-container">`;
    const icons = ['fa-brain', 'fa-lightbulb', 'fa-rocket', 'fa-star', 'fa-gem', 'fa-crown'];
    currentMindMap.branches.forEach((branch, idx) => {
        const icon = icons[idx % icons.length];
        html += `
            <div class="card-item">
                <div class="card-icon"><i class="fas ${icon}"></i></div>
                <div class="card-title">${escapeHtml(branch.name)}</div>
                <div class="card-desc">
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            html += escapeHtml(branch.subBranches.slice(0, 2).join(' • '));
        }
        html += `</div></div>`;
    });
    html += `</div>`;
    return html;
}

// 7. Accordion View
function renderAccordion() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-chevron-down"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="accordion-container">`;
    currentMindMap.branches.forEach((branch, idx) => {
        const isFirst = idx === 0;
        html += `
            <div class="accordion-item">
                <div class="accordion-header ${isFirst ? 'active' : ''}" data-index="${idx}">
                    <span><i class="fas fa-folder"></i> ${escapeHtml(branch.name)}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="accordion-body ${isFirst ? 'open' : ''}" data-index="${idx}">
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            branch.subBranches.forEach(sub => {
                html += `<div style="padding: 4px 0;"><i class="fas fa-check-circle" style="color: var(--primary-blue);"></i> ${escapeHtml(sub)}</div>`;
            });
        }
        html += `</div></div>`;
    });
    html += `</div>`;
    
    // Add accordion event listeners after render
    setTimeout(() => {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                const body = document.querySelector(`.accordion-body[data-index="${index}"]`);
                const isOpen = body.classList.contains('open');
                
                // Close all
                document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
                document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
                
                if (!isOpen) {
                    body.classList.add('open');
                    this.classList.add('active');
                }
            });
        });
    }, 100);
    
    return html;
}

// 8. Tree View
function renderTree() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-tree"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="tree-container">
        <div class="tree-root"><i class="fas fa-tree"></i> ${escapeHtml(currentMindMap.central)}</div>
        <div class="tree-branches">`;
    
    currentMindMap.branches.forEach(branch => {
        html += `
            <div class="tree-branch">
                <div class="branch-label"><i class="fas fa-code-branch"></i> ${escapeHtml(branch.name)}</div>
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            branch.subBranches.forEach(sub => {
                html += `<div class="tree-sub">${escapeHtml(sub)}</div>`;
            });
        }
        html += `</div>`;
    });
    
    html += `</div></div>`;
    return html;
}

// 9. Gallery View
function renderGallery() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-images"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="gallery-container">`;
    const icons = ['fa-image', 'fa-photo', 'fa-picture', 'fa-camera', 'fa-palette', 'fa-art'];
    currentMindMap.branches.forEach((branch, idx) => {
        const icon = icons[idx % icons.length];
        html += `
            <div class="gallery-item">
                <div class="gallery-icon"><i class="fas ${icon}"></i></div>
                <div class="gallery-title">${escapeHtml(branch.name)}</div>
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            html += `<div style="font-size: 0.8rem; color: var(--text-light);">${branch.subBranches.length} items</div>`;
        }
        html += `</div>`;
    });
    html += `</div>`;
    return html;
}

// 10. Concept Map
function renderConcept() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-connectdevelop"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="concept-container">
        <div class="concept-node" style="background: linear-gradient(135deg, var(--primary-blue), var(--sky-blue)); color: white; border-color: var(--primary-blue);">
            <div class="concept-title" style="color: white;">${escapeHtml(currentMindMap.central)}</div>
            <div class="concept-desc" style="color: rgba(255,255,255,0.8);">Main Concept</div>
        </div>`;
    
    currentMindMap.branches.forEach(branch => {
        html += `
            <div class="concept-node">
                <div class="concept-title">${escapeHtml(branch.name)}</div>
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            html += `<div class="concept-desc">${escapeHtml(branch.subBranches[0])}</div>`;
        }
        html += `</div>`;
    });
    html += `</div>`;
    return html;
}

// 11. Fishbone Diagram
function renderFishbone() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-fish"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="fishbone-container">
        <div class="fishbone-spine">
            <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, var(--primary-blue), var(--sky-blue)); color: white; border-radius: 12px; display: inline-block; font-weight: 700; margin-bottom: 20px;">
                <i class="fas fa-fish"></i> ${escapeHtml(currentMindMap.central)}
            </div>
            <div class="fishbone-bones">`;
    
    currentMindMap.branches.forEach(branch => {
        html += `
            <div class="fishbone-bone">
                <div class="bone-label"><i class="fas fa-bone"></i> ${escapeHtml(branch.name)}</div>
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            branch.subBranches.forEach(sub => {
                html += `<div style="font-size: 0.85rem; padding: 2px 0;">• ${escapeHtml(sub)}</div>`;
            });
        }
        html += `</div>`;
    });
    html += `</div></div></div>`;
    return html;
}

// 12. Venn Diagram
function renderVenn() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-circle-intersection"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="venn-container">`;
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#E91E63'];
    currentMindMap.branches.forEach((branch, idx) => {
        const color = colors[idx % colors.length];
        html += `
            <div class="venn-circle" style="border-color: ${color};">
                <div class="venn-label" style="color: ${color};">
                    <div>${escapeHtml(branch.name)}</div>
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            html += `<div style="font-size: 0.7rem; font-weight: 400;">${branch.subBranches.length} items</div>`;
        }
        html += `</div></div>`;
    });
    html += `</div>`;
    return html;
}

// 13. Pyramid View
function renderPyramid() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-layer-group"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="pyramid-container">
        <div class="pyramid-level level-1" style="background: linear-gradient(135deg, var(--primary-blue), var(--sky-blue)); color: white; border-color: var(--primary-blue);">
            <div class="level-title" style="color: white;">${escapeHtml(currentMindMap.central)}</div>
        </div>`;
    
    currentMindMap.branches.forEach((branch, idx) => {
        const level = Math.min(idx + 2, 5);
        html += `
            <div class="pyramid-level level-${level}">
                <div class="level-title">${escapeHtml(branch.name)}</div>
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            html += `<div style="font-size: 0.8rem; color: var(--text-light);">${branch.subBranches[0]}</div>`;
        }
        html += `</div>`;
    });
    html += `</div>`;
    return html;
}

// 14. Radar Chart
function renderRadar() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-chart-radar"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="radar-container">`;
    currentMindMap.branches.forEach(branch => {
        const value = Math.min((branch.subBranches?.length || 1) * 20, 100);
        html += `
            <div class="radar-item">
                <div class="radar-label">${escapeHtml(branch.name)}</div>
                <div class="radar-bar"><div class="radar-fill" style="width: ${value}%;"></div></div>
                <div style="font-size: 0.7rem; color: var(--text-light);">${value}%</div>
            </div>
        `;
    });
    html += `</div>`;
    return html;
}

// 15. Org Chart
function renderOrgChart() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-people-group"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="org-container">
        <div class="org-top"><i class="fas fa-crown"></i> ${escapeHtml(currentMindMap.central)}</div>
        <div class="org-level">`;
    
    currentMindMap.branches.forEach(branch => {
        html += `
            <div class="org-node">
                <div class="node-title">${escapeHtml(branch.name)}</div>
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            html += `<div class="node-sub">${escapeHtml(branch.subBranches[0])}</div>`;
        }
        html += `</div>`;
    });
    html += `</div></div>`;
    return html;
}

// 16. Presentation Mode
function renderPresentation() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-presentation"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="mindmap-container presentation-mode">`;
    html += `<div class="central-topic" style="font-size: 2.5rem; padding: 25px 50px;">${escapeHtml(currentMindMap.central)}</div>`;
    html += `<div class="branches-grid" style="gap: 30px;">`;
    
    currentMindMap.branches.forEach(branch => {
        html += `
            <div class="branch-card" style="padding: 30px; min-width: 250px;">
                <div class="branch-title" style="font-size: 1.4rem;">${escapeHtml(branch.name)}</div>
                <div class="sub-items">
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            branch.subBranches.forEach(sub => {
                html += `<div class="sub-item" style="font-size: 1rem; padding: 10px 16px;">${escapeHtml(sub)}</div>`;
            });
        }
        html += `</div></div>`;
    });
    html += `</div></div>`;
    return html;
}

// 17. Focus Mode
function renderFocus() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-crosshairs"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="mindmap-container focus-mode">`;
    html += `<div class="central-topic">${escapeHtml(currentMindMap.central)}</div>`;
    html += `<div class="branches-grid">`;
    
    currentMindMap.branches.forEach((branch, idx) => {
        const isFocused = idx === 0;
        html += `
            <div class="branch-card ${isFocused ? 'focused' : ''}">
                <div class="branch-title">${escapeHtml(branch.name)}</div>
                <div class="sub-items">
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            branch.subBranches.forEach(sub => {
                html += `<div class="sub-item">${escapeHtml(sub)}</div>`;
            });
        }
        html += `</div></div>`;
    });
    html += `</div></div>`;
    return html;
}

// 18. Split View
function renderSplit() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-columns"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="split-view">
        <div class="split-left">
            <h3 style="color: var(--primary-blue);"><i class="fas fa-list"></i> Overview</h3>
            <ul style="list-style: none; padding: 0;">`;
    
    currentMindMap.branches.forEach(branch => {
        html += `<li style="padding: 8px 0; border-bottom: 1px solid var(--sky-blue-light);">
            <strong>${escapeHtml(branch.name)}</strong> (${branch.subBranches?.length || 0} items)
        </li>`;
    });
    
    html += `</ul></div><div class="split-right">
        <h3 style="color: var(--primary-blue);"><i class="fas fa-info-circle"></i> Details</h3>
        <div style="background: var(--sky-blue-light); padding: 15px; border-radius: 12px;">
            <strong>${escapeHtml(currentMindMap.central)}</strong>
            <div style="margin-top: 10px; font-size: 0.9rem; color: var(--text-light);">
                ${currentMindMap.branches.length} main topics with ${currentMindMap.branches.reduce((sum, b) => sum + (b.subBranches?.length || 0), 0)} sub-topics
            </div>
        </div>
    </div></div>`;
    return html;
}

// 19. Auto-Summarize
function renderSummary() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-robot"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="mindmap-container">`;
    html += `<div class="central-topic"><i class="fas fa-robot"></i> AI Summary: ${escapeHtml(currentMindMap.central)}</div>`;
    html += `<div class="branches-grid">`;
    
    currentMindMap.branches.forEach(branch => {
        html += `
            <div class="branch-card" style="border-color: var(--primary-yellow);">
                <div class="branch-title" style="color: var(--primary-yellow);">${escapeHtml(branch.name)}</div>
                <div class="sub-items">
        `;
        if (branch.subBranches && branch.subBranches.length > 0) {
            const summary = branch.subBranches.slice(0, 2).join('. ');
            html += `<div class="sub-item" style="background: var(--baby-yellow-light);"><i class="fas fa-robot"></i> ${escapeHtml(summary)}</div>`;
        }
        html += `</div></div>`;
    });
    html += `</div></div>`;
    return html;
}

// 20. Smart Suggestions
function renderSuggestions() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-lightbulb"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="mindmap-container">`;
    html += `<div class="central-topic" style="background: linear-gradient(135deg, var(--primary-yellow), var(--warning));"><i class="fas fa-lightbulb"></i> AI Suggestions</div>`;
    html += `<div class="ai-suggestions">`;
    
    const suggestions = [
        'Add more details to each branch',
        'Create sub-categories for better organization',
        'Use colors to differentiate topics',
        'Add examples for each concept',
        'Link related topics together',
        'Create a summary for each branch'
    ];
    
    suggestions.forEach(suggestion => {
        html += `<span class="suggestion-tag"><i class="fas fa-lightbulb" style="color: var(--warning);"></i> ${suggestion}</span>`;
    });
    
    html += `</div></div>`;
    return html;
}

// 21. Keyword Extraction
function renderKeywords() {
    if (!currentMindMap) return '<div class="empty-state"><i class="fas fa-tags"></i><h3>No content to display</h3><p>Generate a mind map first</p></div>';
    
    let html = `<div class="mindmap-container">`;
    html += `<div class="central-topic" style="background: linear-gradient(135deg, var(--success), var(--primary-yellow));"><i class="fas fa-tags"></i> AI Keywords</div>`;
    html += `<div class="ai-keywords">`;
    
    const keywords = [];
    currentMindMap.branches.forEach(branch => {
        keywords.push({ word: branch.name, weight: Math.floor(Math.random() * 50) + 50 });
        if (branch.subBranches && branch.subBranches.length > 0) {
            branch.subBranches.slice(0, 2).forEach(sub => {
                const words = sub.split(' ');
                words.forEach(w => {
                    if (w.length > 4 && !keywords.find(k => k.word === w)) {
                        keywords.push({ word: w, weight: Math.floor(Math.random() * 40) + 30 });
                    }
                });
            });
        }
    });
    
    const sorted = keywords.sort((a, b) => b.weight - a.weight).slice(0, 15);
    sorted.forEach(kw => {
        const size = 0.8 + (kw.weight / 100) * 0.8;
        html += `<span class="keyword-tag" style="font-size: ${size}rem; border-color: ${kw.weight > 60 ? 'var(--primary-blue)' : 'var(--sky-blue)'};">${kw.word} <span class="keyword-weight">${kw.weight}%</span></span>`;
    });
    
    html += `</div></div>`;
    return html;
}

// ============================================
// MAIN RENDER FUNCTION
// ============================================

function renderCurrentView() {
    const canvas = document.getElementById('displayCanvas');
    if (!canvas) return;
    
    let html = '';
    const viewTitle = document.getElementById('viewTitle');
    const styleMap = {
        'mindmap': { title: 'Mind Map View', icon: 'fa-project-diagram' },
        'infographic': { title: 'Infographic View', icon: 'fa-chart-pie' },
        'bullet': { title: 'Bullet Points View', icon: 'fa-list-ul' },
        'timeline': { title: 'Timeline View', icon: 'fa-clock' },
        'flowchart': { title: 'Flowchart View', icon: 'fa-sitemap' },
        'cards': { title: 'Cards View', icon: 'fa-id-card' },
        'accordion': { title: 'Accordion View', icon: 'fa-chevron-down' },
        'tree': { title: 'Tree View', icon: 'fa-tree' },
        'gallery': { title: 'Gallery View', icon: 'fa-images' },
        'concept': { title: 'Concept Map', icon: 'fa-connectdevelop' },
        'fishbone': { title: 'Fishbone Diagram', icon: 'fa-fish' },
        'venn': { title: 'Venn Diagram', icon: 'fa-circle-intersection' },
        'pyramid': { title: 'Pyramid View', icon: 'fa-layer-group' },
        'radar': { title: 'Radar Chart', icon: 'fa-chart-radar' },
        'orgchart': { title: 'Org Chart', icon: 'fa-people-group' },
        'presentation': { title: 'Presentation Mode', icon: 'fa-presentation' },
        'focus': { title: 'Focus Mode', icon: 'fa-crosshairs' },
        'split': { title: 'Split View', icon: 'fa-columns' },
        'summary': { title: 'AI Summary', icon: 'fa-robot' },
        'suggestions': { title: 'AI Suggestions', icon: 'fa-lightbulb' },
        'keywords': { title: 'AI Keywords', icon: 'fa-tags' }
    };
    
    const styleInfo = styleMap[currentView] || styleMap['mindmap'];
    if (viewTitle) viewTitle.innerHTML = `<i class="fas ${styleInfo.icon}"></i> ${styleInfo.title}`;
    
    const renderMap = {
        'mindmap': renderMindMap,
        'infographic': renderInfographic,
        'bullet': renderBulletPoints,
        'timeline': renderTimeline,
        'flowchart': renderFlowchart,
        'cards': renderCards,
        'accordion': renderAccordion,
        'tree': renderTree,
        'gallery': renderGallery,
        'concept': renderConcept,
        'fishbone': renderFishbone,
        'venn': renderVenn,
        'pyramid': renderPyramid,
        'radar': renderRadar,
        'orgchart': renderOrgChart,
        'presentation': renderPresentation,
        'focus': renderFocus,
        'split': renderSplit,
        'summary': renderSummary,
        'suggestions': renderSuggestions,
        'keywords': renderKeywords
    };
    
    const renderFn = renderMap[currentView] || renderMindMap;
    html = renderFn();
    
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

function exportAsImage() {
    if (!currentMindMap) {
        showToast('Please generate a mind map first', 'error');
        return;
    }
    
    const canvas = document.getElementById('displayCanvas');
    if (!canvas) return;
    
    // Use html2canvas if available, otherwise fallback to print
    showToast('Use Print > Save as PDF for image export', 'info');
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
    // Generate Button
    document.getElementById('generateBtn').addEventListener('click', async () => {
        const text = document.getElementById('textInput').value.trim();
        if (!text) {
            showToast('Please enter content or upload a file', 'error');
            return;
        }
        updateLanguageDisplay(text);
        await generateMindMap(text);
    });
    
    document.getElementById('generateBtnMain').addEventListener('click', async () => {
        document.getElementById('generateBtn').click();
    });
    
    // Style Buttons - All 21
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.getAttribute('data-style');
            renderCurrentView();
        });
    });
    
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('mm_theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        if (themeToggle) themeToggle.innerHTML = savedTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.body.getAttribute('data-theme');
            const target = current === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', target);
            localStorage.setItem('mm_theme', target);
            themeToggle.innerHTML = target === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        });
    }
    
    // Scroll Buttons
    document.getElementById('scrollTop').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('scrollBottom').onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    
    // Zoom Controls
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
    
    // Full Screen
    document.getElementById('fullScreenBtn').addEventListener('click', () => {
        const container = document.querySelector('.viz-container');
        if (!document.fullscreenElement) {
            container.requestFullscreen?.() || container.webkitRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() || document.webkitExitFullscreen?.();
        }
    });
    
    // Print
    document.getElementById('printBtn').addEventListener('click', () => {
        window.print();
    });
    
    // Export Buttons
    document.getElementById('exportTxt').addEventListener('click', exportAsTXT);
    document.getElementById('exportDoc').addEventListener('click', exportAsDOC);
    document.getElementById('exportPdf').addEventListener('click', exportAsPDF);
    document.getElementById('exportImage').addEventListener('click', exportAsImage);
    
    // Reaction Buttons with Color
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        const emoji = btn.getAttribute('data-emoji');
        if (REACTION_COLORS[emoji]) {
            btn.style.setProperty('--reaction-color', REACTION_COLORS[emoji]);
        }
        btn.addEventListener('click', async () => {
            await addReaction(emoji);
        });
    });
    
    // Share Buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const platform = btn.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Check out this AI Mind Map Generator with 21 display styles!');
            
            if (platform === 'copy') {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied!', 'success');
                await recordShare(platform);
            } else {
                let shareUrl = '';
                if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${text}%20${url}`;
                if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                window.open(shareUrl, '_blank', 'width=600,height=400');
                await recordShare(platform);
            }
        });
    });
    
    // Home & Back Buttons
    document.getElementById('homeBtn').addEventListener('click', () => {
        window.location.href = 'https://magicrills.com';
    });
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'https://magicrills.com/category-pages/mixed-tools.html';
    });
    
    // Text Input with Auto-save
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
    
    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // Drag & Drop
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    if (dropZone) {
        dropZone.addEventListener('click', () => fileInput?.click());
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
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            if (e.target.files[0]) await handleFileUpload(e.target.files[0]);
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('DOMContentLoaded', async () => {
    initEventListeners();
    initTypewriter();
    await fetchStats();
    
    // Auto-increment usage on tool load
    await incrementUsage();
    
    // Increment view count on load
    const localStats = JSON.parse(localStorage.getItem('mm_stats') || '{}');
    localStats.views = (localStats.views || 0) + 1;
    localStorage.setItem('mm_stats', JSON.stringify(localStats));
    
    // Track view via API
    try {
        await fetch(`${API_BASE}/api/views`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                user_id: userId
            })
        });
    } catch (e) {
        // Silent fail
    }
    
    // Auto-generate if there's draft content
    const draft = localStorage.getItem('mm_draft');
    if (draft && draft.trim().length > 50) {
        setTimeout(() => {
            if (confirm('You have saved content. Generate mind map?')) {
                document.getElementById('generateBtn').click();
            }
        }, 1000);
    }
});

console.log('🚀 AI Mind Map Generator initialized with Cloudflare Workers API');
console.log(`📊 Tool: ${TOOL_NAME} (${TOOL_SLUG})`);
console.log(`🔗 API: ${API_BASE}`);
console.log(`🎨 21 Display Styles Available`);
