// ============================================
// SCHOOL IMPROVEMENT PLAN GENERATOR - CLOUDFLARE WORKERS API
// Version: 3.0 | Professional | Modern | Advanced
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const TOOL_SLUG = 'school-improvement-plan-generator';
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

// Global State
let currentStep = 0;
let sections = ['home', 'basicInfo', 'profile', 'focus', 'budget', 'priority', 'monitor', 'summary'];
let toolUsageCount = 0;
let toolShareCount = 0;
let toolViewCount = 0;
let toolFollowerCount = 0;
let userReactions = {};
let isApiAvailable = true;
let statsLoaded = false;

// Typing Animation Text
const typingTexts = [
    "Create SMART goals for your school...",
    "Track budget and resources efficiently...",
    "Generate professional SIP reports...",
    "Download as DOCX or TXT format...",
    "AI-powered school improvement planning...",
    "Data-driven decisions for better education..."
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[SIP] Initializing School Improvement Plan Generator v3.0...');
    
    initializeElements();
    initializeEventListeners();
    createParticles();
    startTypingAnimation();
    
    // Load stats with loading animation
    await Promise.all([
        loadGlobalStats(),
        loadToolStats(),
        loadUserReactions()
    ]);
    
    // Increment usage after stats are loaded
    await incrementUsage();
    
    loadDraftFromLocalStorage();
    setupAutoSave();
    setupFocusAreas();
    setupBudgetItems();
    setupMilestones();
    
    showSection(0);
    updateProgress();
    updateDashboard();
    
    console.log('[SIP] Initialization complete!');
    showToast('Welcome to SIP Generator! 🎓', 'success');
});

// ============================================
// ELEMENT INITIALIZATION
// ============================================
function initializeElements() {
    window.themeToggle = document.getElementById('themeToggleBtn');
    window.scrollUpBtn = document.getElementById('scrollUpBtn');
    window.scrollDownBtn = document.getElementById('scrollDownBtn');
    window.progressFill = document.getElementById('formProgressFill');
    window.progressText = document.getElementById('progressText');
    window.toastContainer = document.getElementById('toastContainer');
    window.floatingNotification = document.getElementById('floatingNotification');
    
    // Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        if (window.themeToggle) window.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        if (window.themeToggle) window.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// ============================================
// THEME TOGGLE
// ============================================
if (window.themeToggle) {
    window.themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        const isLight = document.body.classList.contains('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        window.themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        showToast(`${isLight ? 'Light' : 'Dark'} mode activated ✨`, 'info');
    });
}

// ============================================
// PARTICLES GENERATION
// ============================================
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    
    const colors = ['#00d4ff', '#b44dff', '#ff2d55', '#00ff88', '#ffd700', '#ff6b35'];
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 12 + 6}s`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${size * 4}px ${color}`;
        container.appendChild(particle);
    }
}

// ============================================
// TYPING ANIMATION
// ============================================
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;

function startTypingAnimation() {
    const typingElement = document.getElementById('heroTyping');
    if (!typingElement) return;
    
    function typeEffect() {
        const currentText = typingTexts[typingIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2500);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            typingIndex = (typingIndex + 1) % typingTexts.length;
            setTimeout(typeEffect, 500);
            return;
        }
        
        setTimeout(typeEffect, isDeleting ? 30 : 70);
    }
    
    typeEffect();
}

// ============================================
// DASHBOARD
// ============================================
function updateDashboard() {
    const dashboard = document.querySelector('.dashboard-grid');
    if (!dashboard) return;
    
    const completedSteps = currentStep;
    const totalSteps = sections.length;
    const percentage = Math.floor((completedSteps / totalSteps) * 100);
    
    dashboard.innerHTML = `
        <div class="dashboard-card glass-effect">
            <div class="dashboard-title">
                <i class="fas fa-chart-simple"></i> Overall Progress
            </div>
            <div class="progress-circle-container" style="display:flex; justify-content:center; align-items:center; flex-direction:column;">
                <svg class="progress-circle" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border-color)" stroke-width="8"/>
                    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--neon-blue)" stroke-width="8" 
                            stroke-dasharray="${2 * Math.PI * 54}" 
                            stroke-dashoffset="${2 * Math.PI * 54 * (1 - percentage / 100)}"
                            transform="rotate(-90 60 60)"
                            stroke-linecap="round"
                            style="transition: stroke-dashoffset 0.8s ease;"/>
                </svg>
                <div class="progress-circle-text" style="position:absolute; font-size:1.5rem; font-weight:700; color:var(--neon-blue);">${percentage}%</div>
            </div>
            <div class="progress-stats" style="display:flex; justify-content:center; gap:1.5rem; margin-top:0.75rem; font-size:0.8rem; color:var(--text-secondary);">
                <span>✅ ${completedSteps} of ${totalSteps} steps</span>
                <span>📋 ${document.querySelectorAll('.goal-item').length || 0} Goals</span>
                <span>💰 ${document.querySelectorAll('.budget-item').length || 0} Budget</span>
            </div>
        </div>
        <div class="dashboard-card glass-effect">
            <div class="dashboard-title">
                <i class="fas fa-chart-bar"></i> Tool Stats (Live)
            </div>
            <div class="stats-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <div class="stat-mini" style="background:rgba(0,212,255,0.05); padding:12px; border-radius:10px; text-align:center; border:1px solid rgba(0,212,255,0.08);">
                    <span class="stat-mini-number" style="font-size:1.5rem; font-weight:700; color:var(--neon-blue);">${toolUsageCount}</span>
                    <span class="stat-mini-label" style="font-size:0.7rem; color:var(--text-secondary); display:block;">Uses</span>
                </div>
                <div class="stat-mini" style="background:rgba(180,77,255,0.05); padding:12px; border-radius:10px; text-align:center; border:1px solid rgba(180,77,255,0.08);">
                    <span class="stat-mini-number" style="font-size:1.5rem; font-weight:700; color:var(--neon-purple);">${toolShareCount}</span>
                    <span class="stat-mini-label" style="font-size:0.7rem; color:var(--text-secondary); display:block;">Shares</span>
                </div>
                <div class="stat-mini" style="background:rgba(0,255,136,0.05); padding:12px; border-radius:10px; text-align:center; border:1px solid rgba(0,255,136,0.08);">
                    <span class="stat-mini-number" style="font-size:1.5rem; font-weight:700; color:var(--neon-green);">${toolViewCount}</span>
                    <span class="stat-mini-label" style="font-size:0.7rem; color:var(--text-secondary); display:block;">Views</span>
                </div>
                <div class="stat-mini" style="background:rgba(255,215,0,0.05); padding:12px; border-radius:10px; text-align:center; border:1px solid rgba(255,215,0,0.08);">
                    <span class="stat-mini-number" style="font-size:1.5rem; font-weight:700; color:var(--neon-yellow);">${toolFollowerCount}</span>
                    <span class="stat-mini-label" style="font-size:0.7rem; color:var(--text-secondary); display:block;">Followers</span>
                </div>
            </div>
            <div class="quick-actions" style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
                <button class="quick-action-btn" onclick="document.getElementById('nextToProfileBtn')?.click()" style="background:var(--bg-secondary); border:1px solid var(--border-color); color:var(--text-primary); padding:8px 16px; border-radius:8px; cursor:pointer; transition:var(--transition); flex:1;">
                    <i class="fas fa-arrow-right"></i> Continue
                </button>
                <button class="quick-action-btn" id="exportDocxQuickBtn" style="background:var(--bg-secondary); border:1px solid var(--border-color); color:var(--text-primary); padding:8px 16px; border-radius:8px; cursor:pointer; transition:var(--transition); flex:1;">
                    <i class="fas fa-file-word"></i> DOCX
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('exportDocxQuickBtn')?.addEventListener('click', () => exportToDOCX());
}

// ============================================
// SCROLL BUTTONS
// ============================================
if (window.scrollUpBtn) {
    window.scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
if (window.scrollDownBtn) {
    window.scrollDownBtn.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

// ============================================
// SECTION NAVIGATION
// ============================================
function showSection(index) {
    sections.forEach((section, i) => {
        const el = document.getElementById(`${section}Section`);
        if (el) {
            if (i === index) {
                el.classList.add('active-section');
                currentStep = index;
            } else {
                el.classList.remove('active-section');
            }
        }
    });
    updateProgress();
    updateDashboard();
    
    if (index === 4) updateBudgetSummary();
    if (index === 7) generateFullSummary();
}

function updateProgress() {
    const progress = ((currentStep + 1) / sections.length) * 100;
    if (window.progressFill) window.progressFill.style.width = `${progress}%`;
    if (window.progressText) window.progressText.textContent = `${Math.floor(progress)}% Complete`;
}

// Navigation Event Listeners
document.getElementById('startPlanBtn')?.addEventListener('click', () => { showSection(1); });
document.getElementById('heroStartBtn')?.addEventListener('click', () => { showSection(1); });
document.getElementById('nextToProfileBtn')?.addEventListener('click', () => showSection(2));
document.getElementById('backToBasicBtn')?.addEventListener('click', () => showSection(1));
document.getElementById('nextToFocusBtn')?.addEventListener('click', () => showSection(3));
document.getElementById('backToProfileBtn')?.addEventListener('click', () => showSection(2));
document.getElementById('nextToBudgetBtn')?.addEventListener('click', () => { updateBudgetSummary(); showSection(4); });
document.getElementById('backToFocusBtn')?.addEventListener('click', () => showSection(3));
document.getElementById('nextToPriorityBtn')?.addEventListener('click', () => showSection(5));
document.getElementById('backToBudgetBtn')?.addEventListener('click', () => showSection(4));
document.getElementById('nextToMonitorBtn')?.addEventListener('click', () => showSection(6));
document.getElementById('backToPriorityBtn')?.addEventListener('click', () => showSection(5));
document.getElementById('generatePlanFinalBtn')?.addEventListener('click', () => { generateFullSummary(); showSection(7); });
document.getElementById('editPlanBtn')?.addEventListener('click', () => showSection(0));

// ============================================
// CLOUDFLARE WORKERS API - USAGE COUNTER
// ============================================
async function incrementUsage() {
    try {
        console.log('[SIP] Incrementing usage count...');
        const response = await fetch(`${API_BASE}/api/usage`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                user_id: getUserId() 
            })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        if (data.success) {
            toolUsageCount = data.total_usage || data.usage_count || 0;
            isApiAvailable = true;
            console.log('[SIP] Usage incremented:', toolUsageCount);
        } else {
            throw new Error(data.message || 'API error');
        }
    } catch (error) {
        console.warn('[SIP] API error, using localStorage:', error.message);
        isApiAvailable = false;
        let localUsage = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`)) || 0;
        localUsage++;
        localStorage.setItem(`${TOOL_SLUG}_usage`, localUsage);
        toolUsageCount = localUsage;
    }
    updateUsageDisplay();
}

async function loadToolStats() {
    try {
        console.log('[SIP] Loading tool stats...');
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: { 'X-API-Key': API_KEY }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        if (data.success) {
            toolUsageCount = data.totalUsage || data.usage_count || 0;
            toolShareCount = data.totalShares || data.shares_count || 0;
            toolViewCount = data.totalViews || data.views_count || 0;
            toolFollowerCount = data.totalFollowers || data.followers_count || 0;
            isApiAvailable = true;
            statsLoaded = true;
            console.log('[SIP] Stats loaded:', { toolUsageCount, toolShareCount, toolViewCount, toolFollowerCount });
        } else {
            throw new Error(data.message || 'API error');
        }
    } catch (error) {
        console.warn('[SIP] API error, using localStorage:', error.message);
        isApiAvailable = false;
        toolUsageCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`)) || 0;
        toolShareCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`)) || 0;
        toolViewCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_views`)) || 0;
        toolFollowerCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_followers`)) || 0;
        statsLoaded = true;
    }
    updateUsageDisplay();
    updateDashboard();
}

async function loadGlobalStats() {
    try {
        console.log('[SIP] Loading global stats...');
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=global`, {
            headers: { 'X-API-Key': API_KEY }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('globalUsageStat').innerText = data.totalUsage || data.usage_count || 0;
            document.getElementById('globalSharesStat').innerText = data.totalShares || data.shares_count || 0;
            document.getElementById('toolsCountStat').innerText = data.totalTools || data.tools_count || 0;
            // Remove loading class
            document.querySelectorAll('.stat-number').forEach(el => el.classList.remove('loading'));
        } else {
            throw new Error(data.message || 'API error');
        }
    } catch (error) {
        console.warn('[SIP] API error for global stats:', error.message);
        // Show fallback - no "Loading..." text
        document.getElementById('globalUsageStat').innerText = '—';
        document.getElementById('globalSharesStat').innerText = '—';
        document.getElementById('toolsCountStat').innerText = '—';
        document.querySelectorAll('.stat-number').forEach(el => el.classList.remove('loading'));
    }
}

function updateUsageDisplay() {
    const usageEl = document.getElementById('toolUsageCount');
    const shareEl = document.getElementById('toolShareCount');
    if (usageEl) usageEl.innerText = toolUsageCount;
    if (shareEl) shareEl.innerText = toolShareCount;
}

// ============================================
// CLOUDFLARE WORKERS API - REACTIONS
// ============================================
async function loadUserReactions() {
    try {
        console.log('[SIP] Loading user reactions...');
        const response = await fetch(`${API_BASE}/api/reactions?tool_slug=${TOOL_SLUG}&user_id=${getUserId()}`, {
            headers: { 'X-API-Key': API_KEY }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        if (data.success && data.user_reactions) {
            userReactions = data.user_reactions;
        }
        await loadAllReactionCounts();
    } catch (error) {
        console.warn('[SIP] API error for reactions:', error.message);
        try {
            const saved = localStorage.getItem(`${TOOL_SLUG}_reactions`);
            if (saved) {
                userReactions = JSON.parse(saved);
            }
        } catch (e) {}
    }
}

async function loadAllReactionCounts() {
    try {
        const response = await fetch(`${API_BASE}/api/reactions?tool_slug=${TOOL_SLUG}`, {
            headers: { 'X-API-Key': API_KEY }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        if (data.success && data.counts) {
            updateReactionCounters(data.counts);
        }
    } catch (error) {
        console.warn('[SIP] API error for reaction counts:', error.message);
        try {
            const saved = localStorage.getItem(`${TOOL_SLUG}_reaction_counts`);
            if (saved) {
                updateReactionCounters(JSON.parse(saved));
            }
        } catch (e) {}
    }
}

function updateReactionCounters(counts) {
    const map = { 
        'like': 'likeCount', 
        'love': 'loveCount', 
        'wow': 'wowCount', 
        'sad': 'sadCount', 
        'laugh': 'laughCount', 
        'celebrate': 'celebrateCount' 
    };
    for (const [key, count] of Object.entries(counts)) {
        const el = document.getElementById(map[key]);
        if (el) el.innerText = count;
    }
    try {
        localStorage.setItem(`${TOOL_SLUG}_reaction_counts`, JSON.stringify(counts));
    } catch (e) {}
}

async function addReaction(emoji) {
    const reactionTypeMap = { 
        '👍': 'like', 
        '❤️': 'love', 
        '😮': 'wow', 
        '😢': 'sad', 
        '😂': 'laugh', 
        '🎉': 'celebrate' 
    };
    const reactionType = reactionTypeMap[emoji];
    
    if (!reactionType) {
        showToast('Invalid reaction', 'error');
        return;
    }
    
    if (userReactions[reactionType]) {
        showToast('You already reacted with this emoji!', 'warning');
        return;
    }
    
    try {
        console.log('[SIP] Adding reaction:', emoji);
        const response = await fetch(`${API_BASE}/api/reactions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                emoji: emoji, 
                user_id: getUserId() 
            })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        if (data.success) {
            userReactions[reactionType] = true;
            try {
                localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(userReactions));
            } catch (e) {}
            updateReactionCounters(data.counts);
            showToast(`Reacted with ${emoji}! 🎉`, 'success');
        } else {
            throw new Error(data.message || 'API error');
        }
    } catch (error) {
        console.warn('[SIP] API error for reaction, using fallback:', error.message);
        userReactions[reactionType] = true;
        try {
            localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(userReactions));
        } catch (e) {}
        
        let counts = {};
        try {
            const saved = localStorage.getItem(`${TOOL_SLUG}_reaction_counts`);
            if (saved) counts = JSON.parse(saved);
        } catch (e) {}
        counts[reactionType] = (counts[reactionType] || 0) + 1;
        updateReactionCounters(counts);
        showToast(`Reacted with ${emoji}! 🎉`, 'success');
    }
}

// Reaction event listeners
document.querySelectorAll('.reaction').forEach(el => {
    el.addEventListener('click', () => {
        const emoji = el.getAttribute('data-emoji');
        if (emoji) addReaction(emoji);
    });
});

// ============================================
// CLOUDFLARE WORKERS API - SHARES
// ============================================
async function recordShare(platform) {
    try {
        console.log('[SIP] Recording share:', platform);
        const response = await fetch(`${API_BASE}/api/shares`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                platform: platform, 
                user_id: getUserId() 
            })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        if (data.success) {
            toolShareCount = data.total_shares || data.shares_count || toolShareCount + 1;
            updateUsageDisplay();
            showToast(`Shared on ${platform}! 📤`, 'success');
        } else {
            throw new Error(data.message || 'API error');
        }
    } catch (error) {
        console.warn('[SIP] API error for share, using fallback:', error.message);
        toolShareCount++;
        localStorage.setItem(`${TOOL_SLUG}_shares`, toolShareCount);
        updateUsageDisplay();
        showToast(`Shared on ${platform}! 📤`, 'success');
    }
}

async function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('School Improvement Plan - SIP Generator');
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${title}%20${url}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
        case 'email': shareUrl = `mailto:?subject=${title}&body=Check out this School Improvement Plan: ${url}`; break;
        default: return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    await recordShare(platform);
}

// Share button event listeners
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const platform = btn.getAttribute('data-platform');
        if (platform) shareOnPlatform(platform);
    });
});

document.getElementById('copyUrlBtn')?.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('URL copied to clipboard! 📋', 'success');
        await recordShare('copy');
    } catch (err) {
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
        showToast('URL copied to clipboard! 📋', 'success');
        await recordShare('copy');
    }
});

// ============================================
// EXPORT FUNCTIONS
// ============================================
function generateReportHTML() {
    const schoolName = document.getElementById('schoolName')?.value || 'School Name';
    const year = document.getElementById('year')?.value || '2025';
    const district = document.getElementById('district')?.value || 'Not specified';
    const principal = document.getElementById('principal')?.value || 'Not specified';
    const vision = document.getElementById('visionStatement')?.value || 'Not specified';
    const mission = document.getElementById('missionStatement')?.value || 'Not specified';
    
    const maleStudents = document.getElementById('maleStudents')?.value || 0;
    const femaleStudents = document.getElementById('femaleStudents')?.value || 0;
    const totalStudents = parseInt(maleStudents) + parseInt(femaleStudents);
    const maleTeachers = document.getElementById('maleTeachers')?.value || 0;
    const femaleTeachers = document.getElementById('femaleTeachers')?.value || 0;
    const totalTeachers = parseInt(maleTeachers) + parseInt(femaleTeachers);
    const classrooms = document.getElementById('classrooms')?.value || 0;
    
    const facilities = Array.from(document.querySelectorAll('#facilitiesGroup input:checked')).map(cb => cb.value).join(', ') || 'None';
    const needs = Array.from(document.getElementById('needsAssessment')?.selectedOptions || []).map(opt => opt.value).join(', ') || 'None';
    
    const priority1 = document.getElementById('priority1')?.value || 'Not specified';
    const priority2 = document.getElementById('priority2')?.value || 'Not specified';
    const priority3 = document.getElementById('priority3')?.value || 'Not specified';
    const performanceTargets = document.getElementById('performanceTargets')?.value || 'Not specified';
    
    let goalsHtml = '';
    document.querySelectorAll('.goal-item').forEach((goal, idx) => {
        const title = goal.querySelector('.goal-title')?.value || 'No title';
        const strategy = goal.querySelector('.goal-strategy')?.value || 'Not specified';
        const indicator = goal.querySelector('.goal-indicator')?.value || 'Not specified';
        const responsible = goal.querySelector('.goal-responsible')?.value || 'Not specified';
        const timeline = goal.querySelector('.goal-timeline')?.value || 'Not specified';
        const budget = goal.querySelector('.goal-budget')?.value || '0';
        
        const actions = [];
        goal.querySelectorAll('.action-desc').forEach(action => {
            if (action.value) actions.push(action.value);
        });
        
        goalsHtml += `
            <div style="border:1px solid #ddd; margin:15px 0; padding:15px; border-radius:8px;">
                <h4>Goal ${idx + 1}: ${title}</h4>
                <p><strong>Strategy:</strong> ${strategy}</p>
                <p><strong>Success Indicator:</strong> ${indicator}</p>
                <p><strong>Responsible:</strong> ${responsible}</p>
                <p><strong>Timeline:</strong> ${timeline}</p>
                <p><strong>Budget:</strong> $${budget}</p>
                <p><strong>Action Steps:</strong></p>
                <ul>${actions.map(a => `<li>${a}</li>`).join('')}</ul>
            </div>
        `;
    });
    
    if (!document.querySelectorAll('.goal-item').length) {
        goalsHtml = '<p>No goals added yet. Please add goals in Focus Areas section.</p>';
    }
    
    let budgetHtml = '';
    let totalBudgetAllocated = 0;
    document.querySelectorAll('.budget-item').forEach(item => {
        const name = item.querySelector('input[placeholder="Item name"]')?.value;
        const amount = parseFloat(item.querySelector('.budget-amount')?.value) || 0;
        if (name) {
            budgetHtml += `<tr><td>${name}</td><td>$${amount}</td></tr>`;
            totalBudgetAllocated += amount;
        }
    });
    
    let milestonesHtml = '';
    document.querySelectorAll('.milestone-item').forEach(item => {
        const name = item.querySelector('input[placeholder="Milestone name"]')?.value;
        const date = item.querySelector('input[type="date"]')?.value || 'No date';
        const status = item.querySelector('select')?.value || 'Not Started';
        if (name) {
            milestonesHtml += `<tr><td>${name}</td><td>${date}</td><td>${status}</td></tr>`;
        }
    });
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>School Improvement Plan - ${schoolName}</title>
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
                h1 { color: #6366f1; border-bottom: 3px solid #6366f1; padding-bottom: 10px; }
                h2 { color: #10b981; margin-top: 30px; border-bottom: 2px solid #10b981; padding-bottom: 5px; }
                h3 { color: #f59e0b; }
                table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background: #6366f1; color: white; }
                .header { text-align: center; margin-bottom: 30px; }
                .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
                .info-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 15px; background: #f8f9fa; padding: 20px; border-radius: 10px; }
                .info-item { margin: 5px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${schoolName}</h1>
                <h2>School Improvement Plan ${year}</h2>
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
            
            <h2>1. Basic Information</h2>
            <div class="info-grid">
                <div class="info-item"><strong>District/Region:</strong> ${district}</div>
                <div class="info-item"><strong>Principal:</strong> ${principal}</div>
                <div class="info-item"><strong>Vision:</strong> ${vision}</div>
                <div class="info-item"><strong>Mission:</strong> ${mission}</div>
            </div>
            
            <h2>2. School Profile</h2>
            <table>
                <tr><th>Metric</th><th>Value</th></tr>
                <tr><td>Boys</td><td>${maleStudents}</td></tr>
                <tr><td>Girls</td><td>${femaleStudents}</td></tr>
                <tr><td>Total Students</td><td>${totalStudents}</td></tr>
                <tr><td>Male Teachers</td><td>${maleTeachers}</td></tr>
                <tr><td>Female Teachers</td><td>${femaleTeachers}</td></tr>
                <tr><td>Total Teachers</td><td>${totalTeachers}</td></tr>
                <tr><td>Classrooms</td><td>${classrooms}</td></tr>
                <tr><td>Facilities</td><td>${facilities}</td></tr>
                <tr><td>Needs Assessment</td><td>${needs}</td></tr>
            </table>
            
            <h2>3. SMART Goals and Strategies</h2>
            ${goalsHtml}
            
            <h2>4. Budget Planning</h2>
            <p><strong>Currency:</strong> ${document.getElementById('currencySelect')?.value || 'USD'}</p>
            <p><strong>Total Budget:</strong> $${document.getElementById('totalBudget')?.value || 0}</p>
            <table>
                <tr><th>Item</th><th>Amount</th></tr>
                ${budgetHtml || '<tr><td colspan="2">No budget items added</td></tr>'}
                <tr style="background:#f0f0f0; font-weight:bold;"><td>Total Allocated</td><td>$${totalBudgetAllocated}</td></tr>
            </table>
            
            <h2>5. Priority Areas</h2>
            <ol>
                <li>${priority1}</li>
                <li>${priority2}</li>
                <li>${priority3}</li>
            </ol>
            <p><strong>Performance Targets:</strong> ${performanceTargets}</p>
            
            <h2>6. Monitoring and Evaluation</h2>
            <p><strong>Monitoring Tools:</strong> ${document.getElementById('monitoringTools')?.value || 'Not specified'}</p>
            <p><strong>Frequency:</strong> ${document.getElementById('monitoringFrequency')?.value || 'Not specified'}</p>
            <table>
                <tr><th>Milestone</th><th>Due Date</th><th>Status</th></tr>
                ${milestonesHtml || '<tr><td colspan="3">No milestones added</td></tr>'}
            </table>
            
            <div class="footer">
                <p>School Improvement Plan - Generated using SIP Generator Tool</p>
                <p>Plan ID: ${TOOL_SLUG}_${Date.now()}</p>
            </div>
        </body>
        </html>
    `;
}

async function exportToDOCX() {
    try {
        showToast('Generating DOCX document...', 'info');
        const htmlContent = generateReportHTML();
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const link = document.createElement('a');
        const schoolName = document.getElementById('schoolName')?.value || 'SIP';
        link.href = URL.createObjectURL(blob);
        link.download = `${schoolName.replace(/\s+/g, '_')}_SIP_${new Date().toISOString().slice(0,10)}.doc`;
        link.click();
        URL.revokeObjectURL(link.href);
        showToast('DOCX downloaded successfully!', 'success');
        await recordShare('docx_export');
    } catch (error) {
        console.error('DOCX error:', error);
        showToast('Error generating DOCX: ' + error.message, 'error');
    }
}

function exportToTXT() {
    try {
        const schoolName = document.getElementById('schoolName')?.value || 'School Name';
        const year = document.getElementById('year')?.value || '2025';
        
        let content = `SCHOOL IMPROVEMENT PLAN\n`;
        content += `======================\n\n`;
        content += `School Name: ${schoolName}\n`;
        content += `Year: ${year}\n`;
        content += `Generated: ${new Date().toLocaleString()}\n\n`;
        
        content += `BASIC INFORMATION\n`;
        content += `-----------------\n`;
        content += `District: ${document.getElementById('district')?.value || 'N/A'}\n`;
        content += `Principal: ${document.getElementById('principal')?.value || 'N/A'}\n`;
        content += `Vision: ${document.getElementById('visionStatement')?.value || 'N/A'}\n`;
        content += `Mission: ${document.getElementById('missionStatement')?.value || 'N/A'}\n\n`;
        
        content += `SCHOOL PROFILE\n`;
        content += `--------------\n`;
        content += `Boys: ${document.getElementById('maleStudents')?.value || 0}\n`;
        content += `Girls: ${document.getElementById('femaleStudents')?.value || 0}\n`;
        content += `Male Teachers: ${document.getElementById('maleTeachers')?.value || 0}\n`;
        content += `Female Teachers: ${document.getElementById('femaleTeachers')?.value || 0}\n`;
        content += `Classrooms: ${document.getElementById('classrooms')?.value || 0}\n\n`;
        
        content += `GOALS\n`;
        content += `-----\n`;
        document.querySelectorAll('.goal-item').forEach((goal, idx) => {
            content += `Goal ${idx + 1}: ${goal.querySelector('.goal-title')?.value || 'No title'}\n`;
            content += `  Strategy: ${goal.querySelector('.goal-strategy')?.value || 'N/A'}\n`;
            content += `  Responsible: ${goal.querySelector('.goal-responsible')?.value || 'N/A'}\n`;
            content += `  Timeline: ${goal.querySelector('.goal-timeline')?.value || 'N/A'}\n`;
            content += `  Budget: ${goal.querySelector('.goal-budget')?.value || '0'}\n`;
            content += `  Actions:\n`;
            goal.querySelectorAll('.action-desc').forEach(action => {
                if (action.value) content += `    - ${action.value}\n`;
            });
            content += `\n`;
        });
        
        content += `PRIORITIES\n`;
        content += `----------\n`;
        content += `1. ${document.getElementById('priority1')?.value || 'N/A'}\n`;
        content += `2. ${document.getElementById('priority2')?.value || 'N/A'}\n`;
        content += `3. ${document.getElementById('priority3')?.value || 'N/A'}\n`;
        content += `Performance Targets: ${document.getElementById('performanceTargets')?.value || 'N/A'}\n\n`;
        
        content += `MONITORING\n`;
        content += `----------\n`;
        content += `Tools: ${document.getElementById('monitoringTools')?.value || 'N/A'}\n`;
        content += `Frequency: ${document.getElementById('monitoringFrequency')?.value || 'N/A'}\n`;
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${schoolName.replace(/\s+/g, '_')}_SIP.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
        showToast('TXT downloaded successfully!', 'success');
    } catch (error) {
        console.error('TXT error:', error);
        showToast('Error generating TXT', 'error');
    }
}

document.getElementById('printPlanBtn')?.addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generateReportHTML());
    printWindow.document.close();
    printWindow.print();
});

// ============================================
// AUTO-SAVE DRAFT
// ============================================
function setupAutoSave() {
    setInterval(() => saveDraftToLocalStorage(), 30000);
}

function saveDraftToLocalStorage() {
    const formData = {};
    document.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.id) formData[el.id] = el.value;
    });
    localStorage.setItem(`${TOOL_SLUG}_draft`, JSON.stringify(formData));
    showFloatingNotification('Draft auto-saved');
}

function loadDraftFromLocalStorage() {
    const saved = localStorage.getItem(`${TOOL_SLUG}_draft`);
    if (saved) {
        const formData = JSON.parse(saved);
        for (const [id, value] of Object.entries(formData)) {
            const el = document.getElementById(id);
            if (el) el.value = value;
        }
        showToast('Draft loaded from previous session', 'info');
    }
}

document.getElementById('loadDraftBtn')?.addEventListener('click', () => {
    loadDraftFromLocalStorage();
    showToast('Draft loaded!', 'success');
});

// ============================================
// PREMIUM MODAL
// ============================================
const premiumModal = document.getElementById('premiumModal');
document.getElementById('heroPremiumBtn')?.addEventListener('click', () => {
    if (premiumModal) premiumModal.style.display = 'flex';
});
document.querySelector('.premium-modal-close')?.addEventListener('click', () => {
    if (premiumModal) premiumModal.style.display = 'none';
});
document.getElementById('closePremiumBtn')?.addEventListener('click', () => {
    if (premiumModal) premiumModal.style.display = 'none';
});

// ============================================
// TOAST & FLOATING NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    if (window.toastContainer) window.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

let floatingTimeout;
function showFloatingNotification(message) {
    const msgSpan = document.getElementById('floatingMsg');
    if (msgSpan) msgSpan.innerText = message;
    if (window.floatingNotification) window.floatingNotification.classList.remove('hidden');
    clearTimeout(floatingTimeout);
    floatingTimeout = setTimeout(() => {
        if (window.floatingNotification) window.floatingNotification.classList.add('hidden');
    }, 2000);
}

// ============================================
// UTILITIES
// ============================================
function getUserId() {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('user_id', userId);
    }
    return userId;
}

function updateBudgetSummary() {
    let total = 0;
    document.querySelectorAll('.budget-amount').forEach(input => {
        total += parseFloat(input.value) || 0;
    });
    const summary = document.getElementById('budgetSummary');
    if (summary) summary.innerHTML = `Total Allocated: $${total}`;
}

// ============================================
// FOCUS AREAS SETUP
// ============================================
function setupFocusAreas() {
    const container = document.getElementById('focusAreasContainer');
    if (!container) return;
    
    const areas = ['Leadership & Management', 'Teaching & Learning', 'Student Performance', 'Parental Involvement', 'Infrastructure & Resources', 'Professional Development'];
    
    container.innerHTML = areas.map(area => `
        <div class="focus-area">
            <h3><i class="fas fa-bullseye"></i> ${area}</h3>
            <div class="goals-container"></div>
            <button class="btn-secondary small add-goal-btn" data-area="${area}">+ Add Goal</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.add-goal-btn').forEach(btn => {
        btn.addEventListener('click', () => addGoal(btn.getAttribute('data-area')));
    });
}

function addGoal(areaName) {
    const containers = document.querySelectorAll('.goals-container');
    let targetContainer = null;
    
    for (let i = 0; i < containers.length; i++) {
        if (containers[i].parentElement.querySelector('h3')?.innerText.includes(areaName)) {
            targetContainer = containers[i];
            break;
        }
    }
    
    if (!targetContainer) return;
    
    const goalId = 'goal_' + Date.now();
    const goalHtml = `
        <div class="goal-item" id="${goalId}">
            <div style="display:flex; justify-content:space-between;">
                <h4>🎯 SMART Goal</h4>
                <button class="remove-btn remove-goal">✕</button>
            </div>
            <input type="text" class="form-control goal-title" placeholder="Enter SMART goal" style="margin:10px 0">
            <textarea class="form-control goal-strategy" placeholder="Strategy" rows="2"></textarea>
            <div class="form-row" style="margin-top:10px">
                <input type="text" class="form-control goal-indicator" placeholder="Success indicator">
                <input type="text" class="form-control goal-responsible" placeholder="Responsible person">
            </div>
            <div class="form-row">
                <input type="text" class="form-control goal-timeline" placeholder="Timeline">
                <input type="number" class="form-control goal-budget" placeholder="Budget">
            </div>
            <div class="actions-container"></div>
            <button class="btn-secondary small add-action-btn" style="margin-top:10px">+ Add Action</button>
        </div>
    `;
    targetContainer.insertAdjacentHTML('beforeend', goalHtml);
    
    const goalDiv = document.getElementById(goalId);
    goalDiv.querySelector('.remove-goal').addEventListener('click', () => goalDiv.remove());
    goalDiv.querySelector('.add-action-btn').addEventListener('click', () => addAction(goalId));
}

function addAction(goalId) {
    const container = document.querySelector(`#${goalId} .actions-container`);
    const actionHtml = `
        <div class="action-item">
            <input type="text" class="form-control action-desc" placeholder="Action step" style="flex:1">
            <button class="remove-btn remove-action">✕</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', actionHtml);
    container.lastElementChild.querySelector('.remove-action').addEventListener('click', function() {
        this.parentElement.remove();
    });
}

// ============================================
// BUDGET ITEMS SETUP
// ============================================
function setupBudgetItems() {
    const container = document.getElementById('budgetItemsContainer');
    if (!container) return;
    
    document.getElementById('addBudgetItemBtn')?.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'budget-item';
        div.style.display = 'flex';
        div.style.gap = '0.5rem';
        div.style.marginBottom = '0.5rem';
        div.innerHTML = `
            <input type="text" placeholder="Item name" class="form-control" style="flex:2">
            <input type="number" placeholder="Amount" class="form-control budget-amount" style="flex:1">
            <button class="remove-btn remove-budget-item">✕</button>
        `;
        container.appendChild(div);
        div.querySelector('.remove-budget-item').addEventListener('click', () => div.remove());
        div.querySelector('.budget-amount').addEventListener('change', () => updateBudgetSummary());
    });
}

// ============================================
// MILESTONES SETUP
// ============================================
function setupMilestones() {
    const container = document.getElementById('milestonesContainer');
    if (!container) return;
    
    document.getElementById('addMilestoneBtn')?.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'milestone-item';
        div.style.display = 'flex';
        div.style.gap = '0.5rem';
        div.style.marginBottom = '0.5rem';
        div.innerHTML = `
            <input type="text" placeholder="Milestone name" class="form-control" style="flex:2">
            <input type="date" class="form-control" style="flex:1">
            <select class="form-control" style="flex:1"><option>Not Started</option><option>In Progress</option><option>Completed</option></select>
            <button class="remove-btn remove-milestone">✕</button>
        `;
        container.appendChild(div);
        div.querySelector('.remove-milestone').addEventListener('click', () => div.remove());
    });
}

// ============================================
// GENERATE FULL SUMMARY
// ============================================
function generateFullSummary() {
    const summaryDiv = document.getElementById('planSummary');
    if (!summaryDiv) return;
    
    const schoolName = document.getElementById('schoolName')?.value || 'School Name';
    const year = document.getElementById('year')?.value || '2025';
    
    summaryDiv.innerHTML = `
        <div style="text-align:center; margin-bottom:20px;">
            <h2>${schoolName}</h2>
            <h3>School Improvement Plan ${year}</h3>
            <hr>
        </div>
        <div class="summary-stats">
            ${generateSummaryStats()}
        </div>
        <div class="summary-section">
            <h3>📋 Basic Information</h3>
            <p><strong>School Name:</strong> ${schoolName}</p>
            <p><strong>District:</strong> ${document.getElementById('district')?.value || 'N/A'}</p>
            <p><strong>Principal:</strong> ${document.getElementById('principal')?.value || 'N/A'}</p>
            <p><strong>Vision:</strong> ${document.getElementById('visionStatement')?.value || 'N/A'}</p>
            <p><strong>Mission:</strong> ${document.getElementById('missionStatement')?.value || 'N/A'}</p>
        </div>
        <div class="summary-section">
            <h3>🏫 School Profile</h3>
            <p><strong>Students:</strong> Boys: ${document.getElementById('maleStudents')?.value || 0}, Girls: ${document.getElementById('femaleStudents')?.value || 0}</p>
            <p><strong>Teachers:</strong> Male: ${document.getElementById('maleTeachers')?.value || 0}, Female: ${document.getElementById('femaleTeachers')?.value || 0}</p>
            <p><strong>Classrooms:</strong> ${document.getElementById('classrooms')?.value || 0}</p>
        </div>
        <div class="summary-section">
            <h3>🎯 Priority Areas</h3>
            <ol>
                <li>${document.getElementById('priority1')?.value || 'N/A'}</li>
                <li>${document.getElementById('priority2')?.value || 'N/A'}</li>
                <li>${document.getElementById('priority3')?.value || 'N/A'}</li>
            </ol>
        </div>
    `;
}

function generateSummaryStats() {
    const totalGoals = document.querySelectorAll('.goal-item').length;
    const totalBudgetItems = document.querySelectorAll('.budget-item').length;
    const totalMilestones = document.querySelectorAll('.milestone-item').length;
    
    return `
        <div class="stat-summary-card"><i class="fas fa-bullseye"></i><div class="value">${totalGoals}</div><div class="label">SMART Goals</div></div>
        <div class="stat-summary-card"><i class="fas fa-coins"></i><div class="value">${totalBudgetItems}</div><div class="label">Budget Items</div></div>
        <div class="stat-summary-card"><i class="fas fa-flag-checkered"></i><div class="value">${totalMilestones}</div><div class="label">Milestones</div></div>
    `;
}

// Export buttons
document.getElementById('exportDocxBtn')?.addEventListener('click', exportToDOCX);
document.getElementById('exportTxtBtn')?.addEventListener('click', exportToTXT);

// ============================================
// INITIALIZE EVENT LISTENERS
// ============================================
function initializeEventListeners() {
    console.log('[SIP] Event listeners initialized');
    // Theme toggle is handled above
}
