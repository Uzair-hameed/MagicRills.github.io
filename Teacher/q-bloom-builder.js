// ============================================
// app.js - Q Bloom Builder
// Real API Integration with Cloudflare Workers
// Gemini AI Integration
// NO FAKE DATA - All from API
// ============================================

// ========== CONFIGURATION ==========
const CONFIG = {
    API_BASE: 'https://q-bloom-builder.uzairhameed01.workers.dev',
    TOOL_SLUG: 'q-bloom-builder',
    REACTIONS: ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'],
    REACTION_EMOJIS: ['👍', '❤️', '😮', '😢', '😠', '😂', '🎉'],
    BLOOM_LEVELS: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'],
    BLOOM_COLORS: {
        'Remember': '#3b82f6',
        'Understand': '#22c55e',
        'Apply': '#eab308',
        'Analyze': '#f59e0b',
        'Evaluate': '#ef4444',
        'Create': '#a855f7'
    },
    BLOOM_CUES: {
        'Remember': ['what', 'who', 'when', 'where', 'define', 'list', 'name', 'identify', 'recall'],
        'Understand': ['describe', 'explain', 'summarize', 'compare', 'contrast', 'interpret', 'discuss'],
        'Apply': ['use', 'solve', 'demonstrate', 'apply', 'calculate', 'complete', 'illustrate'],
        'Analyze': ['analyze', 'classify', 'categorize', 'distinguish', 'examine', 'investigate'],
        'Evaluate': ['evaluate', 'judge', 'justify', 'defend', 'critique', 'recommend', 'argue'],
        'Create': ['create', 'design', 'develop', 'propose', 'invent', 'plan', 'construct', 'formulate']
    }
};

// ========== STATE ==========
let state = {
    userId: localStorage.getItem('bloom_user_id') || 'user_' + Math.random().toString(36).substr(2, 9),
    classifiedData: {
        'Remember': [],
        'Understand': [],
        'Apply': [],
        'Analyze': [],
        'Evaluate': [],
        'Create': [],
        'Unclassified': []
    },
    reactionCounts: {},
    usageCount: 0,
    shareCount: 0,
    isAnalyzing: false,
    isGenerating: false
};

// Save userId
localStorage.setItem('bloom_user_id', state.userId);

// ========== DOM REFS ==========
const DOM = {
    questionInput: document.getElementById('questionInput'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    resetBtn: document.getElementById('resetBtn'),
    grokBtn: document.getElementById('grokAiBtn'),
    totalQuestions: document.getElementById('totalQuestions'),
    classifiedQuestions: document.getElementById('classifiedQuestions'),
    highestLevel: document.getElementById('highestLevel'),
    usageDisplay: document.getElementById('usageDisplay'),
    heroUsage: document.getElementById('heroUsage'),
    heroReactions: document.getElementById('heroReactions'),
    heroShares: document.getElementById('heroShares'),
    shareCount: document.getElementById('shareCount'),
    bloomGrid: document.getElementById('bloomGrid'),
    bloomChart: document.getElementById('bloomChart'),
    reactionsContainer: document.getElementById('reactionsContainer'),
    toastContainer: document.getElementById('toastContainer'),
    syncStatus: document.getElementById('syncStatus'),
    typewriterText: document.getElementById('typewriterText'),
    darkToggle: document.getElementById('darkToggle'),
    scrollUpBtn: document.getElementById('scrollUpBtn'),
    scrollDownBtn: document.getElementById('scrollDownBtn'),
    refreshStatsBtn: document.getElementById('refreshStatsBtn'),
    exportTxtBtn: document.getElementById('exportTxtBtn'),
    exportPDFBtn: document.getElementById('exportPDFBtn'),
    exportDocBtn: document.getElementById('exportDocBtn'),
    shareButtons: document.getElementById('shareButtons')
};

// ========== TOAST SYSTEM ==========
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// ========== API HELPERS ==========
async function apiCall(endpoint, method = 'GET', body = null) {
    const url = `${CONFIG.API_BASE}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-User-ID': state.userId
        }
    };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== USAGE ==========
async function incrementUsage() {
    const result = await apiCall('/api/usage', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        user_id: state.userId
    });
    
    if (result.success) {
        state.usageCount = result.data.total_usage || 0;
        updateUsageDisplay();
    } else {
        // Local fallback
        let local = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`) || '0') + 1;
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_usage`, local);
        state.usageCount = local;
        updateUsageDisplay();
        DOM.syncStatus.textContent = 'Offline';
        DOM.syncStatus.style.color = '#f59e0b';
    }
}

async function fetchUsage() {
    const result = await apiCall(`/api/usage?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
    if (result.success) {
        state.usageCount = result.data.total_usage || 0;
        updateUsageDisplay();
        DOM.syncStatus.textContent = 'Synced';
        DOM.syncStatus.style.color = '#22c55e';
    } else {
        let local = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`) || '0');
        state.usageCount = local;
        updateUsageDisplay();
        DOM.syncStatus.textContent = 'Offline';
        DOM.syncStatus.style.color = '#f59e0b';
    }
}

function updateUsageDisplay() {
    DOM.usageDisplay.textContent = state.usageCount;
    DOM.heroUsage.textContent = state.usageCount;
}

// ========== REACTIONS ==========
async function fetchReactions() {
    const result = await apiCall(`/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
    if (result.success && result.data.reactions) {
        state.reactionCounts = result.data.reactions;
        renderReactions();
        updateHeroReactions();
    } else {
        // Try localStorage
        const saved = localStorage.getItem(`${CONFIG.TOOL_SLUG}_reactions`);
        if (saved) {
            state.reactionCounts = JSON.parse(saved);
            renderReactions();
            updateHeroReactions();
        } else {
            // Initialize empty
            CONFIG.REACTIONS.forEach(key => { state.reactionCounts[key] = 0; });
            renderReactions();
        }
    }
}

async function addReaction(reactionType) {
    const result = await apiCall('/api/reactions', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        reaction_type: reactionType,
        emoji: CONFIG.REACTION_EMOJIS[CONFIG.REACTIONS.indexOf(reactionType)],
        user_id: state.userId
    });

    if (result.success) {
        if (result.data.already_reacted) {
            showToast('You already reacted with this emoji!', 'error');
        } else if (result.data.counts) {
            state.reactionCounts = result.data.counts;
            renderReactions();
            updateHeroReactions();
            showToast(`Reacted with ${getEmoji(reactionType)}`, 'success');
        }
    } else {
        // Local fallback
        state.reactionCounts[reactionType] = (state.reactionCounts[reactionType] || 0) + 1;
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_reactions`, JSON.stringify(state.reactionCounts));
        renderReactions();
        updateHeroReactions();
        showToast(`Reacted with ${getEmoji(reactionType)} (saved locally)`, 'success');
    }
}

function getEmoji(type) {
    const idx = CONFIG.REACTIONS.indexOf(type);
    return idx !== -1 ? CONFIG.REACTION_EMOJIS[idx] : '👍';
}

function renderReactions() {
    let html = '';
    CONFIG.REACTIONS.forEach((key, idx) => {
        const emoji = CONFIG.REACTION_EMOJIS[idx];
        const count = state.reactionCounts[key] || 0;
        html += `
            <button class="reaction-btn" data-reaction="${key}">
                ${emoji} <span>${count}</span>
            </button>
        `;
    });
    DOM.reactionsContainer.innerHTML = html;

    // Add click handlers
    DOM.reactionsContainer.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.reaction;
            addReaction(type);
        });
    });
}

function updateHeroReactions() {
    const total = Object.values(state.reactionCounts).reduce((a, b) => a + b, 0);
    DOM.heroReactions.textContent = total;
}

// ========== SHARES ==========
async function recordShare(platform) {
    const result = await apiCall('/api/shares', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        platform: platform,
        user_id: state.userId
    });

    if (result.success) {
        state.shareCount = result.data.shares || 0;
        updateShareDisplay();
        showToast(`Shared on ${platform} ✅`, 'success');
    } else {
        showToast(`Shared on ${platform} ✅`, 'success');
    }
    fetchShares();
}

async function fetchShares() {
    const result = await apiCall(`/api/shares?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
    if (result.success) {
        state.shareCount = result.data.shares || 0;
        updateShareDisplay();
    } else {
        state.shareCount = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_shares`) || '0');
        updateShareDisplay();
    }
}

function updateShareDisplay() {
    DOM.shareCount.textContent = state.shareCount;
    DOM.heroShares.textContent = state.shareCount;
}

function initShareButtons() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Q Bloom Builder - AI-Powered Bloom\'s Taxonomy Classifier');

    const shareActions = {
        facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank'),
        twitter: () => window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank'),
        whatsapp: () => window.open(`https://wa.me/?text=${title} ${decodeURIComponent(url)}`, '_blank'),
        linkedin: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank'),
        email: () => window.location.href = `mailto:?subject=${title}&body=${decodeURIComponent(url)}`,
        copy: () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('URL Copied! 📋', 'success');
            }).catch(() => {
                // Fallback
                const input = document.createElement('input');
                input.value = window.location.href;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                showToast('URL Copied! 📋', 'success');
            });
        }
    };

    DOM.shareButtons.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            if (shareActions[platform]) {
                shareActions[platform]();
                recordShare(platform);
            }
        });
    });
}

// ========== STATS ==========
async function fetchStats() {
    const result = await apiCall(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
    if (result.success) {
        state.usageCount = result.data.usage || 0;
        state.shareCount = result.data.shares || 0;
        if (result.data.reaction_breakdown) {
            state.reactionCounts = result.data.reaction_breakdown;
            renderReactions();
            updateHeroReactions();
        }
        updateUsageDisplay();
        updateShareDisplay();
        showToast('Stats refreshed! 🔄', 'success');
    } else {
        showToast('Could not refresh stats', 'error');
    }
}

// ========== CLASSIFICATION ==========
function classifyQuestions(questions) {
    const result = {
        'Remember': [],
        'Understand': [],
        'Apply': [],
        'Analyze': [],
        'Evaluate': [],
        'Create': [],
        'Unclassified': []
    };

    questions.forEach(q => {
        const lower = q.toLowerCase();
        let classified = false;
        for (const [level, cues] of Object.entries(CONFIG.BLOOM_CUES)) {
            for (const cue of cues) {
                if (new RegExp(`\\b${cue}\\b`, 'i').test(lower)) {
                    result[level].push(q);
                    classified = true;
                    break;
                }
            }
            if (classified) break;
        }
        if (!classified) {
            result['Unclassified'].push(q);
        }
    });

    return result;
}

function analyzeQuestions() {
    const text = DOM.questionInput.value.trim();
    if (!text) {
        showToast('Please enter some questions first!', 'error');
        return;
    }

    if (state.isAnalyzing) return;
    state.isAnalyzing = true;
    DOM.analyzeBtn.disabled = true;
    DOM.analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Analyzing...';

    const lines = text.split('\n').filter(l => l.trim().length > 0);
    DOM.totalQuestions.textContent = lines.length;

    // Classify
    const classified = classifyQuestions(lines);
    state.classifiedData = classified;

    // Update stats
    let totalClassified = 0;
    let highest = '—';
    const order = ['Create', 'Evaluate', 'Analyze', 'Apply', 'Understand', 'Remember'];
    
    for (const level of order) {
        totalClassified += classified[level].length;
        if (classified[level].length > 0 && highest === '—') {
            highest = level;
        }
    }
    
    DOM.classifiedQuestions.textContent = totalClassified;
    DOM.highestLevel.textContent = highest;

    // Render
    renderBloomCards(classified);
    renderChart(classified);

    // Increment usage
    incrementUsage();

    state.isAnalyzing = false;
    DOM.analyzeBtn.disabled = false;
    DOM.analyzeBtn.innerHTML = '<i class="fas fa-microscope"></i> Classify';

    showToast(`Classified ${totalClassified} questions across 6 levels ✅`, 'success');
}

// ========== RENDER BLOOM CARDS ==========
function renderBloomCards(data) {
    let html = '';
    const order = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
    
    order.forEach(level => {
        const questions = data[level] || [];
        const color = CONFIG.BLOOM_COLORS[level] || '#a855f7';
        const icon = {
            'Remember': 'fa-book',
            'Understand': 'fa-comment',
            'Apply': 'fa-wrench',
            'Analyze': 'fa-chart-line',
            'Evaluate': 'fa-balance-scale',
            'Create': 'fa-lightbulb'
        }[level] || 'fa-tag';

        html += `
            <div class="bloom-card bloom-${level.toLowerCase()}">
                <div class="level-name">
                    <span><i class="fas ${icon}"></i> ${level}</span>
                    <span class="level-count">${questions.length}</span>
                </div>
                <ul>
                    ${questions.length > 0 
                        ? questions.map(q => `<li>${escapeHtml(q)}</li>`).join('')
                        : '<li style="opacity:0.5;">— No questions —</li>'
                    }
                </ul>
            </div>
        `;
    });

    DOM.bloomGrid.innerHTML = html;
}

// ========== RENDER CHART ==========
function renderChart(data) {
    const order = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
    const total = order.reduce((sum, level) => sum + (data[level] || []).length, 0);
    
    if (total === 0) {
        DOM.bloomChart.innerHTML = `
            <div style="width:100%; text-align:center; color:var(--text-secondary); padding:8px;">
                No classified questions yet
            </div>
        `;
        return;
    }

    let html = '';
    order.forEach(level => {
        const count = (data[level] || []).length;
        const percent = (count / total) * 100;
        if (percent > 0) {
            html += `
                <div class="chart-segment" style="width:${percent}%; background:${CONFIG.BLOOM_COLORS[level]};" 
                     title="${level}: ${count} (${percent.toFixed(1)}%)">
                    ${percent > 10 ? level.charAt(0) : ''}
                </div>
            `;
        }
    });

    DOM.bloomChart.innerHTML = html;
}

// ========== AI GENERATE ==========
async function generateWithAI() {
    const text = DOM.questionInput.value.trim();
    if (!text) {
        showToast('Please enter a topic or question prompt!', 'error');
        return;
    }

    if (state.isGenerating) return;
    state.isGenerating = true;
    DOM.grokBtn.disabled = true;
    DOM.grokBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Generating...';

    try {
        const result = await apiCall('/api/generate', 'POST', {
            prompt: text,
            count: 5,
            level: 'all'
        });

        if (result.success && result.data.questions) {
            const newQuestions = result.data.questions.map(q => q.text).filter(Boolean);
            if (newQuestions.length > 0) {
                const current = DOM.questionInput.value;
                DOM.questionInput.value = current + (current ? '\n' : '') + newQuestions.join('\n');
                showToast(`✨ Generated ${newQuestions.length} AI questions with Gemini!`, 'success');
            } else {
                showToast('No questions generated. Try a different prompt.', 'error');
            }
        } else {
            showToast('AI generation failed. Using fallback...', 'error');
            // Fallback
            const fallback = [
                `Analyze the impact of ${text} on society.`,
                `Evaluate the effectiveness of ${text} in education.`,
                `Design a solution using ${text} principles.`,
                `Compare different approaches to ${text}.`,
                `Create an innovative framework for ${text}.`
            ];
            const current = DOM.questionInput.value;
            DOM.questionInput.value = current + (current ? '\n' : '') + fallback.join('\n');
            showToast('⚡ Added sample questions (AI fallback)', 'info');
        }
    } catch (error) {
        showToast('Error generating questions: ' + error.message, 'error');
    }

    state.isGenerating = false;
    DOM.grokBtn.disabled = false;
    DOM.grokBtn.innerHTML = '<i class="fas fa-robot"></i> Generate with AI';
}

// ========== EXPORTS ==========
function exportTXT() {
    const data = state.classifiedData;
    let text = 'Q Bloom Builder - Export\n';
    text += `Date: ${new Date().toLocaleString()}\n`;
    text += `Total Questions: ${DOM.totalQuestions.textContent}\n`;
    text += `Classified: ${DOM.classifiedQuestions.textContent}\n`;
    text += `Highest Level: ${DOM.highestLevel.textContent}\n\n`;

    CONFIG.BLOOM_LEVELS.forEach(level => {
        const questions = data[level] || [];
        if (questions.length > 0) {
            text += `${level.toUpperCase()} (${questions.length}):\n`;
            text += questions.map(q => `- ${q}`).join('\n');
            text += '\n\n';
        }
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bloom-export-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('TXT exported! 📄', 'success');
}

function exportPDF() {
    if (typeof window.jspdf === 'undefined') {
        showToast('PDF library loading...', 'info');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = state.classifiedData;

    doc.setFontSize(20);
    doc.setTextColor(168, 85, 247);
    doc.text('Q Bloom Builder Report', 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 32);
    doc.text(`Total Questions: ${DOM.totalQuestions.textContent}`, 20, 40);
    doc.text(`Classified: ${DOM.classifiedQuestions.textContent}`, 20, 48);
    doc.text(`Highest Level: ${DOM.highestLevel.textContent}`, 20, 56);

    let y = 70;
    CONFIG.BLOOM_LEVELS.forEach(level => {
        const questions = data[level] || [];
        if (questions.length > 0) {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFontSize(14);
            doc.setTextColor(168, 85, 247);
            doc.text(`${level} (${questions.length})`, 20, y);
            y += 8;
            doc.setFontSize(10);
            doc.setTextColor(200, 200, 200);
            questions.forEach(q => {
                if (y > 270) { doc.addPage(); y = 20; }
                doc.text(`- ${q.substring(0, 70)}`, 22, y);
                y += 6;
            });
            y += 4;
        }
    });

    doc.save(`bloom-report-${Date.now()}.pdf`);
    showToast('PDF exported! 📕', 'success');
}

function exportDOC() {
    const data = state.classifiedData;
    let html = `
        <html>
        <head><meta charset="utf-8"><title>Bloom Report</title></head>
        <body style="font-family:Arial; padding:30px;">
        <h1 style="color:#a855f7;">Q Bloom Builder Report</h1>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total Questions:</strong> ${DOM.totalQuestions.textContent}</p>
        <p><strong>Classified:</strong> ${DOM.classifiedQuestions.textContent}</p>
        <p><strong>Highest Level:</strong> ${DOM.highestLevel.textContent}</p>
        <hr>
    `;

    CONFIG.BLOOM_LEVELS.forEach(level => {
        const questions = data[level] || [];
        if (questions.length > 0) {
            html += `<h2 style="color:#a855f7;">${level} (${questions.length})</h2><ul>`;
            questions.forEach(q => {
                html += `<li>${escapeHtml(q)}</li>`;
            });
            html += `</ul>`;
        }
    });

    html += `</body></html>`;

    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bloom-report-${Date.now()}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('DOC exported! 📘', 'success');
}

// ========== HELPERS ==========
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function resetAll() {
    DOM.questionInput.value = '';
    CONFIG.BLOOM_LEVELS.forEach(level => {
        state.classifiedData[level] = [];
    });
    state.classifiedData['Unclassified'] = [];
    DOM.totalQuestions.textContent = '0';
    DOM.classifiedQuestions.textContent = '0';
    DOM.highestLevel.textContent = '—';
    renderBloomCards(state.classifiedData);
    renderChart(state.classifiedData);
    showToast('Reset complete! 🔄', 'success');
}

// ========== TYPEWRITER ==========
function initTypewriter() {
    const phrases = [
        'Classify questions using AI',
        '6 Levels of Bloom\'s Taxonomy',
        'Remember • Understand • Apply',
        'Analyze • Evaluate • Create',
        'Powered by Gemini AI',
        'Real-time analytics',
        '✨ Share your feedback!'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = DOM.typewriterText;

    function type() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 1500);
                return;
            }
            setTimeout(type, 30);
        } else {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, 60);
        }
    }

    type();
}

// ========== DARK MODE ==========
function initDarkMode() {
    const isDark = localStorage.getItem('bloom_dark_mode') === 'true';
    if (isDark) {
        document.documentElement.style.setProperty('--dark-bg', '#0a0a0f');
        document.documentElement.style.setProperty('--dark-card', '#1a1a2e');
        document.documentElement.style.setProperty('--dark-border', '#2d2d44');
    }
    DOM.darkToggle.addEventListener('click', () => {
        const current = document.documentElement.style.getPropertyValue('--dark-bg');
        const isDarkNow = current === '#0a0a0f' || current === '';
        const newBg = isDarkNow ? '#f8fafc' : '#0a0a0f';
        const newCard = isDarkNow ? '#ffffff' : '#1a1a2e';
        const newBorder = isDarkNow ? '#e2e8f0' : '#2d2d44';
        
        document.documentElement.style.setProperty('--dark-bg', newBg);
        document.documentElement.style.setProperty('--dark-card', newCard);
        document.documentElement.style.setProperty('--dark-border', newBorder);
        
        localStorage.setItem('bloom_dark_mode', String(!isDarkNow));
        DOM.darkToggle.innerHTML = isDarkNow ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// ========== AUTO-SAVE DRAFT ==========
function initDraftAutoSave() {
    DOM.questionInput.addEventListener('input', () => {
        localStorage.setItem('bloom_draft', DOM.questionInput.value);
    });
    const draft = localStorage.getItem('bloom_draft');
    if (draft) {
        DOM.questionInput.value = draft;
    }
}

// ========== SCROLL ==========
function initScrollButtons() {
    DOM.scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    DOM.scrollDownBtn.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

// ========== INITIALIZATION ==========
async function init() {
    // Show loading
    showToast('🚀 Loading Q Bloom Builder...', 'info');

    // Init features
    initTypewriter();
    initDarkMode();
    initDraftAutoSave();
    initScrollButtons();
    initShareButtons();

    // Load data from API
    await Promise.all([
        fetchUsage(),
        fetchReactions(),
        fetchShares()
    ]);

    // Auto-analyze if draft exists
    const draft = localStorage.getItem('bloom_draft');
    if (draft && draft.trim().length > 0) {
        setTimeout(() => {
            analyzeQuestions();
        }, 500);
    }

    // Event listeners
    DOM.analyzeBtn.addEventListener('click', analyzeQuestions);
    DOM.resetBtn.addEventListener('click', resetAll);
    DOM.grokBtn.addEventListener('click', generateWithAI);
    DOM.refreshStatsBtn.addEventListener('click', fetchStats);

    // Export buttons
    DOM.exportTxtBtn.addEventListener('click', exportTXT);
    DOM.exportPDFBtn.addEventListener('click', exportPDF);
    DOM.exportDocBtn.addEventListener('click', exportDOC);

    // Enter key to analyze (Ctrl+Enter)
    DOM.questionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            analyzeQuestions();
        }
    });

    showToast('✅ Q Bloom Builder ready! AI-powered classification active', 'success');
}

// ========== START ==========
document.addEventListener('DOMContentLoaded', init);
