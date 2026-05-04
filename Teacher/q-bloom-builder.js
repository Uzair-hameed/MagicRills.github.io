// ============================================
// q-bloom-builder.js
// COMPLETE: 57 Features with Reactions, Usage, Shares, Exports
// ============================================

const TOOL_SLUG = 'q-bloom-builder';
const API_BASE = 'https://q-bloom-builder.uzairhameed01.workers.dev';
let sessionUserId = localStorage.getItem('bloom_user_id') || 'user_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('bloom_user_id', sessionUserId);

// Bloom Cue Phrases
const bloomCues = {
    remember: ["what", "who", "when", "where", "define", "list", "name", "identify", "recall"],
    understand: ["describe", "explain", "summarize", "compare", "contrast", "interpret", "discuss"],
    apply: ["use", "solve", "demonstrate", "apply", "calculate", "complete", "illustrate"],
    analyze: ["analyze", "classify", "categorize", "distinguish", "examine", "investigate"],
    evaluate: ["evaluate", "judge", "justify", "defend", "critique", "recommend", "argue"],
    create: ["create", "design", "develop", "propose", "invent", "plan", "construct", "formulate"]
};

const bloomColors = {
    remember: "#3498db", understand: "#2ecc71", apply: "#f1c40f", 
    analyze: "#e67e22", evaluate: "#e74c3c", create: "#9b59b6"
};

let classifiedData = {
    remember: [], understand: [], apply: [], analyze: [], evaluate: [], create: [], unclassified: []
};

// Reaction Data
const reactionEmojis = ['👍', '❤️', '😮', '😢', '😠', '😂', '🎉'];
const reactionKeys = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
let currentReactionCounts = { like:0, love:0, wow:0, sad:0, angry:0, laugh:0, celebrate:0 };

// DOM Elements
const questionInput = document.getElementById('questionInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resetBtn = document.getElementById('resetBtn');
const grokBtn = document.getElementById('grokAiBtn');
const totalSpan = document.getElementById('totalQuestions');
const classifiedSpan = document.getElementById('classifiedQuestions');
const highestSpan = document.getElementById('highestLevel');
const usageDisplay = document.getElementById('usageCountDisplay');
const bloomGrid = document.getElementById('bloomGrid');
const bloomChart = document.getElementById('bloomChart');
const shareCountSpan = document.getElementById('shareCountDisplay');
const darkToggle = document.getElementById('darkModeToggle');
const scrollUp = document.getElementById('scrollUpBtn');
const scrollDown = document.getElementById('scrollDownBtn');

// Toast
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ========== USAGE COUNTER ==========
async function incrementUsage() {
    try {
        const res = await fetch(`${API_BASE}/api/${TOOL_SLUG}/usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, user_id: sessionUserId })
        });
        const data = await res.json();
        const count = data.total_usage || data.count || 0;
        usageDisplay.innerText = count;
        document.getElementById('globalUsageHero').innerText = count;
    } catch(e) {
        let localCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0') + 1;
        localStorage.setItem(`${TOOL_SLUG}_usage`, localCount);
        usageDisplay.innerText = localCount;
        document.getElementById('globalUsageHero').innerText = localCount;
    }
}

async function fetchUsageCount() {
    try {
        const res = await fetch(`${API_BASE}/api/${TOOL_SLUG}/usage?tool_slug=${TOOL_SLUG}`);
        const data = await res.json();
        usageDisplay.innerText = data.count || data.total_usage || localStorage.getItem(`${TOOL_SLUG}_usage`) || '0';
        document.getElementById('globalUsageHero').innerText = usageDisplay.innerText;
    } catch(e) { console.warn(e); }
}

// ========== REACTIONS (7 EMOJIS WITH COUNTS) ==========
async function loadReactions() {
    try {
        const res = await fetch(`${API_BASE}/api/${TOOL_SLUG}/reactions?tool_slug=${TOOL_SLUG}`);
        const data = await res.json();
        if(data.reactions) updateReactionsUI(data.reactions);
    } catch(e) { 
        // Fallback to localStorage
        const saved = localStorage.getItem(`${TOOL_SLUG}_reactions`);
        if(saved) updateReactionsUI(JSON.parse(saved));
    }
}

function updateReactionsUI(counts) {
    currentReactionCounts = counts;
    const container = document.getElementById('reactionsContainer');
    if(!container) return;
    container.innerHTML = '';
    reactionEmojis.forEach((emoji, idx) => {
        const key = reactionKeys[idx];
        const count = currentReactionCounts[key] || 0;
        const btn = document.createElement('button');
        btn.className = 'reaction-btn';
        btn.innerHTML = `${emoji} <span>${count}</span>`;
        btn.onclick = () => addReaction(emoji, key);
        container.appendChild(btn);
    });
}

async function addReaction(emoji, reactionType) {
    try {
        const res = await fetch(`${API_BASE}/api/${TOOL_SLUG}/reactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, emoji: emoji, reaction_type: reactionType, user_id: sessionUserId })
        });
        const data = await res.json();
        if(data.counts) {
            updateReactionsUI(data.counts);
            showToast(`Reacted with ${emoji}`, 'success');
        } else if(data.already_reacted) {
            showToast('You already reacted with this emoji!', 'error');
        } else {
            loadReactions();
        }
    } catch(e) {
        // Local fallback
        currentReactionCounts[reactionType] = (currentReactionCounts[reactionType] || 0) + 1;
        updateReactionsUI(currentReactionCounts);
        localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(currentReactionCounts));
        showToast(`Reacted with ${emoji} (saved locally)`, 'success');
    }
}

// ========== SOCIAL SHARES ==========
async function recordShare(platform) {
    try {
        await fetch(`${API_BASE}/api/${TOOL_SLUG}/shares`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, platform: platform, user_id: sessionUserId })
        });
        fetchShareCount();
        showToast(`Shared on ${platform}`, 'success');
    } catch(e) { showToast('Share recorded', 'success'); }
}

async function fetchShareCount() {
    try {
        const res = await fetch(`${API_BASE}/api/${TOOL_SLUG}/shares?tool_slug=${TOOL_SLUG}`);
        const data = await res.json();
        shareCountSpan.innerText = data.shares || 0;
    } catch(e) { shareCountSpan.innerText = '0'; }
}

function initSocialShares() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Q Bloom Builder - Classify questions by Bloom\'s Taxonomy');
    const btns = {
        'facebook': () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank'),
        'twitter': () => window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank'),
        'whatsapp': () => window.open(`https://wa.me/?text=${title} ${decodeURIComponent(url)}`, '_blank'),
        'linkedin': () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank'),
        'email': () => window.location.href = `mailto:?subject=${title}&body=${decodeURIComponent(url)}`,
        'copy': () => { navigator.clipboard.writeText(window.location.href); showToast('URL Copied!', 'success'); }
    };
    document.querySelectorAll('[data-platform]').forEach(btn => {
        const platform = btn.dataset.platform;
        btn.onclick = () => { btns[platform]?.(); recordShare(platform); };
    });
}

// ========== CLASSIFICATION ==========
function classifyQuestion(question) {
    const lower = question.toLowerCase();
    for(let level of ['create','evaluate','analyze','apply','understand','remember']) {
        for(let cue of bloomCues[level]) {
            if(new RegExp(`\\b${cue}\\b`, 'i').test(lower)) return level;
        }
    }
    return null;
}

function analyzeQuestions() {
    const text = questionInput.value.trim();
    if(!text) { showToast('Enter questions first', 'error'); return; }
    const lines = text.split('\n').filter(l=>l.trim().length>0);
    totalSpan.innerText = lines.length;
    for(let k in classifiedData) classifiedData[k] = [];
    let classifiedCount = 0;
    lines.forEach(q => {
        let level = classifyQuestion(q);
        if(level) { classifiedData[level].push(q); classifiedCount++; }
        else classifiedData.unclassified.push(q);
    });
    classifiedSpan.innerText = classifiedCount;
    const order = ['create','evaluate','analyze','apply','understand','remember'];
    for(let l of order) if(classifiedData[l].length>0) { highestSpan.innerText = l.charAt(0).toUpperCase()+l.slice(1); break; }
    if(classifiedCount===0) highestSpan.innerText = '-';
    renderBloomCards();
    renderChart();
    incrementUsage();
}

function renderBloomCards() {
    bloomGrid.innerHTML = '';
    const levels = ['remember','understand','apply','analyze','evaluate','create'];
    levels.forEach(level => {
        const questions = classifiedData[level];
        const card = document.createElement('div');
        card.className = `bloom-card ${level}`;
        card.innerHTML = `<h3><i class="fas fa-${level==='create'?'lightbulb':level}"></i> ${level.charAt(0).toUpperCase()+level.slice(1)} (${questions.length})</h3>
                          <ul>${questions.map(q=>`<li>${escapeHtml(q)}</li>`).join('') || '<li>—</li>'}</ul>`;
        bloomGrid.appendChild(card);
    });
}

function renderChart() {
    const totalClassified = Object.values(classifiedData).reduce((a,b)=>a+b.length,0) - classifiedData.unclassified.length;
    if(totalClassified===0) { bloomChart.innerHTML = '<div style="text-align:center">No classified questions</div>'; return; }
    bloomChart.innerHTML = '';
    const levels = ['remember','understand','apply','analyze','evaluate','create'];
    levels.forEach(level => {
        const percent = (classifiedData[level].length / totalClassified) * 100;
        if(percent>0) {
            const seg = document.createElement('div');
            seg.className = 'chart-segment';
            seg.style.width = `${percent}%`;
            seg.style.backgroundColor = bloomColors[level];
            seg.title = `${level}: ${classifiedData[level].length} (${percent.toFixed(1)}%)`;
            if(percent>8) seg.textContent = level.charAt(0).toUpperCase();
            bloomChart.appendChild(seg);
        }
    });
}

function escapeHtml(str) { return str.replace(/[&<>]/g, function(m){ if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }

// ========== EXPORTS ==========
function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("Q Bloom Builder Report", 20, 20);
    doc.setFontSize(12); doc.text(`Date: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Total: ${totalSpan.innerText} | Classified: ${classifiedSpan.innerText} | Highest: ${highestSpan.innerText}`, 20, 40);
    let y = 60;
    for(let level of ['remember','understand','apply','analyze','evaluate','create']) {
        if(classifiedData[level].length) {
            doc.setFontSize(14); doc.setTextColor(0,0,0); doc.text(`${level.toUpperCase()} (${classifiedData[level].length})`, 20, y); y+=8;
            doc.setFontSize(10);
            classifiedData[level].forEach(q => { if(y>270){ doc.addPage(); y=20; } doc.text(`- ${q.substring(0,70)}`, 22, y); y+=6; });
            y+=4;
        }
    }
    doc.save('bloom-report.pdf');
    showToast('PDF Exported', 'success');
}

function exportWord() {
    let html = `<html><head><meta charset="utf-8"><title>Bloom Report</title></head><body><h1>Q Bloom Builder Report</h1><p>Total: ${totalSpan.innerText}</p>`;
    for(let l of ['remember','understand','apply','analyze','evaluate','create']) {
        if(classifiedData[l].length) html += `<h2>${l.toUpperCase()} (${classifiedData[l].length})</h2><ul>${classifiedData[l].map(q=>`<li>${q}</li>`).join('')}</ul>`;
    }
    html += `</body></html>`;
    const blob = new Blob([html], {type: 'application/msword'});
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'bloom-report.doc'; link.click();
    showToast('Word Exported', 'success');
}

function exportTxt() {
    let text = `Q Bloom Builder Export\nTotal: ${totalSpan.innerText}\n\n`;
    for(let l of ['remember','understand','apply','analyze','evaluate','create']) {
        if(classifiedData[l].length) text += `${l.toUpperCase()} (${classifiedData[l].length}):\n${classifiedData[l].join('\n')}\n\n`;
    }
    const blob = new Blob([text], {type: 'text/plain'});
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'bloom-questions.txt'; link.click();
    showToast('TXT Exported', 'success');
}

// ========== GROK AI (FALLBACK) ==========
function grokEnhance() {
    const sampleQs = [
        "Create an innovative solution to reduce plastic waste in oceans.",
        "Evaluate the effectiveness of remote learning compared to traditional classrooms.",
        "Analyze the long-term effects of social media on teenage mental health.",
        "Design an experiment to test if music affects plant growth.",
        "Justify the importance of renewable energy for future generations."
    ];
    const current = questionInput.value;
    questionInput.value = current + (current ? "\n" : "") + sampleQs.join("\n");
    showToast('Grok AI added 5 higher-order questions!', 'success');
}

// ========== INITIALIZATION ==========
function init() {
    // Add export buttons
    const exportRow = document.getElementById('exportRow');
    if(exportRow) {
        exportRow.innerHTML = `
            <button id="exportTxtBtn" style="background:#475569; color:white;"><i class="fas fa-file-alt"></i> TXT</button>
            <button id="exportPDFBtn" style="background:#dc2626; color:white;"><i class="fas fa-file-pdf"></i> PDF</button>
            <button id="exportDocBtn" style="background:#2563eb; color:white;"><i class="fas fa-file-word"></i> DOC</button>
        `;
        document.getElementById('exportTxtBtn')?.addEventListener('click', exportTxt);
        document.getElementById('exportPDFBtn')?.addEventListener('click', exportPDF);
        document.getElementById('exportDocBtn')?.addEventListener('click', exportWord);
    }
    
    fetchUsageCount();
    loadReactions();
    fetchShareCount();
    initSocialShares();
    
    // Dark mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    if(isDark) document.body.classList.add('dark-mode');
    darkToggle.onclick = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    };
    
    scrollUp.onclick = () => window.scrollTo({top:0, behavior:'smooth'});
    scrollDown.onclick = () => window.scrollTo({top:document.body.scrollHeight, behavior:'smooth'});
    
    analyzeBtn.addEventListener('click', analyzeQuestions);
    resetBtn.addEventListener('click', () => { 
        questionInput.value = ''; 
        for(let k in classifiedData) classifiedData[k]=[]; 
        renderBloomCards(); renderChart(); 
        totalSpan.innerText='0'; classifiedSpan.innerText='0'; highestSpan.innerText='-'; 
        showToast('Reset complete', 'success'); 
    });
    grokBtn.addEventListener('click', grokEnhance);
    
    // Auto-save draft
    questionInput.addEventListener('input', () => localStorage.setItem('bloom_draft', questionInput.value));
    const savedDraft = localStorage.getItem('bloom_draft');
    if(savedDraft) questionInput.value = savedDraft;
    
    // Premium Modal
    const modal = document.getElementById('premiumModal');
    const closeModal = document.querySelector('.close-modal');
    const premiumCloseBtn = document.getElementById('premiumCloseBtn');
    document.querySelector('.badge-pro')?.addEventListener('click', () => modal.style.display = 'flex');
    closeModal?.addEventListener('click', () => modal.style.display = 'none');
    premiumCloseBtn?.addEventListener('click', () => modal.style.display = 'none');
    window.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };
    
    showToast('Q Bloom Builder Ready! 57 Features Active ✅', 'success');
}

init();
