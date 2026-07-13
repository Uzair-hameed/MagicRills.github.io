// ============================================
// GROUP FORMATION TOOL - COMPLETE JS FILE
// Cloudflare Workers API | Grok AI Integration
// Modern UI/UX | Full Features
// ============================================

// ============================================
// API CONFIGURATION - CLOUDFLARE WORKERS
// ============================================
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';
const TOOL_SLUG = 'group-formation-tool';
const TOOL_NAME = 'Group Formation Tool';
const CATEGORY = 'Teacher';

let SESSION_ID = localStorage.getItem('session_id') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('session_id', SESSION_ID);

// ============================================
// GLOBAL VARIABLES
// ============================================
let students = [];
let groups = [];
let currentGroups = [];
let toolStats = { usage: 0, views: 0, shares: 0, followers: 0 };

// Reactions Data
let reactionsData = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
let userReactions = JSON.parse(localStorage.getItem('user_reactions') || '{}');

// Emoji mapping
const EMOJI_TO_TYPE = {
    '👍': 'like', '❤️': 'love', '😮': 'wow',
    '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate'
};

const TYPE_TO_EMOJI = {
    'like': '👍', 'love': '❤️', 'wow': '😮',
    'sad': '😢', 'angry': '😠', 'laugh': '😂', 'celebrate': '🎉'
};

const REACTION_ELEMENT_IDS = {
    'like': 'reaction-like', 'love': 'reaction-love', 'wow': 'reaction-wow',
    'sad': 'reaction-sad', 'angry': 'reaction-angry',
    'laugh': 'reaction-laugh', 'celebrate': 'reaction-celebrate'
};

// Reaction Colors - Neon Theme
const REACTION_COLORS = {
    'like': '#4e54c8',
    'love': '#ff6b6b',
    'wow': '#feca57',
    'sad': '#54a0ff',
    'angry': '#ff4757',
    'laugh': '#2ed573',
    'celebrate': '#ff9ff3'
};

// ============================================
// DOM ELEMENTS
// ============================================
const studentsTextarea = document.getElementById('students');
const groupTypeSelect = document.getElementById('groupType');
const groupSizeInput = document.getElementById('groupSize');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const randomizeBtn = document.getElementById('randomizeBtn');
const groupsContainer = document.getElementById('groupsContainer');
const fileUpload = document.getElementById('fileUpload');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const themeToggle = document.getElementById('themeToggle');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const exportWordBtn = document.getElementById('exportWordBtn');
const exportTxtBtn = document.getElementById('exportTxtBtn');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const conflictPairsInput = document.getElementById('conflictPairs');
const assignLeadersCheckbox = document.getElementById('assignLeaders');
const homeBtn = document.getElementById('homeBtn');
const backBtn = document.getElementById('backBtn');

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// LOADING SPINNER
// ============================================
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
}

// ============================================
// API CALLS - CLOUDFLARE WORKERS
// ============================================

// 1. USAGE COUNTER - POST /api/usage
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
                user_id: SESSION_ID,
                tool_name: TOOL_NAME,
                category: CATEGORY
            })
        });
        const data = await response.json();
        if (data.success) {
            const counterEl = document.getElementById('usageCounter');
            if (counterEl) counterEl.textContent = data.count || data.usage || 0;
            updateStatsDisplay(data);
        }
        return data;
    } catch (error) {
        console.warn('Usage increment failed, using localStorage fallback');
        // LocalStorage fallback
        let localUsage = parseInt(localStorage.getItem('tool_usage') || '0');
        localUsage++;
        localStorage.setItem('tool_usage', localUsage);
        const counterEl = document.getElementById('usageCounter');
        if (counterEl) counterEl.textContent = localUsage;
        return { success: false, fallback: true, count: localUsage };
    }
}

// 2. REACTIONS - POST /api/reactions
async function fetchReactions() {
    try {
        const response = await fetch(`${API_BASE}/api/reactions?tool_slug=${TOOL_SLUG}`, {
            headers: { 'X-API-Key': API_KEY }
        });
        const data = await response.json();
        if (data.success && data.reactions) {
            reactionsData = data.reactions;
            updateReactionCountsDisplay();
            saveReactionsToLocalStorage();
        } else if (data.reactions) {
            reactionsData = data.reactions;
            updateReactionCountsDisplay();
            saveReactionsToLocalStorage();
        }
        return data;
    } catch (error) {
        console.warn('Fetch reactions failed, using localStorage fallback');
        loadReactionsFromLocalStorage();
        return { success: false, fallback: true };
    }
}

async function addReaction(emoji) {
    const reactionType = EMOJI_TO_TYPE[emoji];
    
    if (!reactionType) {
        showToast('Invalid reaction', 'error');
        return;
    }
    
    if (userReactions[reactionType]) {
        showToast(`You already reacted with ${emoji}`, 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/api/reactions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                emoji: emoji, 
                user_id: SESSION_ID, 
                tool_slug: TOOL_SLUG,
                reaction_type: reactionType
            })
        });
        
        const data = await response.json();
        
        if (data.success === true || data.already_reacted === false) {
            userReactions[reactionType] = true;
            localStorage.setItem('user_reactions', JSON.stringify(userReactions));
            
            if (data.counts) {
                reactionsData = data.counts;
            } else if (data.reactions) {
                reactionsData = data.reactions;
            } else {
                reactionsData[reactionType] = (reactionsData[reactionType] || 0) + 1;
            }
            
            updateReactionCountsDisplay();
            saveReactionsToLocalStorage();
            showToast(`Thank you for your feedback! ${emoji}`, 'success');
            
        } else if (data.already_reacted === true) {
            showToast(`You already reacted with ${emoji}`, 'error');
        } else {
            // Fallback
            if (!userReactions[reactionType]) {
                reactionsData[reactionType] = (reactionsData[reactionType] || 0) + 1;
                userReactions[reactionType] = true;
                localStorage.setItem('user_reactions', JSON.stringify(userReactions));
                updateReactionCountsDisplay();
                saveReactionsToLocalStorage();
                showToast(`Thank you! ${emoji} (saved locally)`, 'success');
            }
        }
    } catch (error) {
        console.warn('Add reaction failed, using localStorage fallback');
        
        if (!userReactions[reactionType]) {
            reactionsData[reactionType] = (reactionsData[reactionType] || 0) + 1;
            userReactions[reactionType] = true;
            localStorage.setItem('user_reactions', JSON.stringify(userReactions));
            updateReactionCountsDisplay();
            saveReactionsToLocalStorage();
            showToast(`Thank you! ${emoji} (saved locally)`, 'success');
        } else {
            showToast(`You already reacted with ${emoji}`, 'error');
        }
    }
    
    showLoading(false);
}

function updateReactionCountsDisplay() {
    for (const [type, count] of Object.entries(reactionsData)) {
        const elementId = REACTION_ELEMENT_IDS[type];
        if (elementId) {
            const element = document.getElementById(elementId);
            if (element) element.textContent = count || 0;
        }
    }
    updateReactionButtonsStyle();
}

function saveReactionsToLocalStorage() {
    localStorage.setItem('tool_reactions', JSON.stringify(reactionsData));
}

function loadReactionsFromLocalStorage() {
    const saved = localStorage.getItem('tool_reactions');
    if (saved) {
        reactionsData = JSON.parse(saved);
        updateReactionCountsDisplay();
    }
}

function updateReactionButtonsStyle() {
    const reactionBtns = document.querySelectorAll('.reaction-btn');
    reactionBtns.forEach(btn => {
        const emoji = btn.getAttribute('data-emoji');
        const type = EMOJI_TO_TYPE[emoji];
        if (userReactions[type]) {
            btn.style.background = REACTION_COLORS[type] || '#4e54c8';
            btn.style.color = 'white';
            btn.style.borderColor = REACTION_COLORS[type] || '#4e54c8';
            btn.style.boxShadow = `0 0 20px ${REACTION_COLORS[type] || '#4e54c8'}80`;
        } else {
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
            btn.style.boxShadow = '';
        }
    });
}

// 3. SHARES - POST /api/shares
async function recordShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/api/shares`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                platform: platform, 
                user_id: SESSION_ID,
                tool_slug: TOOL_SLUG
            })
        });
        const data = await response.json();
        if (data.success) {
            showToast(`Shared on ${platform}!`, 'success');
            updateStatsDisplay(data);
        }
        return data;
    } catch (error) {
        console.warn('Share record failed, using localStorage fallback');
        let shares = parseInt(localStorage.getItem('tool_shares') || '0');
        shares++;
        localStorage.setItem('tool_shares', shares);
        showToast(`Shared on ${platform}! (saved locally)`, 'success');
        return { success: false, fallback: true };
    }
}

// 4. STATS - GET /api/stats
async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: { 'X-API-Key': API_KEY }
        });
        const data = await response.json();
        if (data.success) {
            toolStats = data.stats || data;
            updateStatsDisplay(data);
        }
        return data;
    } catch (error) {
        console.warn('Fetch stats failed, using localStorage fallback');
        loadStatsFromLocalStorage();
        return { success: false, fallback: true };
    }
}

function updateStatsDisplay(data) {
    if (data.usage !== undefined) {
        const el = document.getElementById('usageCounter');
        if (el) el.textContent = data.usage;
    }
    if (data.views !== undefined) {
        const el = document.getElementById('viewsCount');
        if (el) el.textContent = data.views;
    }
    if (data.shares !== undefined) {
        const el = document.getElementById('sharesCount');
        if (el) el.textContent = data.shares;
    }
    if (data.followers !== undefined) {
        const el = document.getElementById('followersCount');
        if (el) el.textContent = data.followers;
    }
}

function loadStatsFromLocalStorage() {
    const usage = parseInt(localStorage.getItem('tool_usage') || '0');
    const shares = parseInt(localStorage.getItem('tool_shares') || '0');
    const views = parseInt(localStorage.getItem('tool_views') || '0');
    const followers = parseInt(localStorage.getItem('tool_followers') || '0');
    
    const usageEl = document.getElementById('usageCounter');
    if (usageEl) usageEl.textContent = usage;
    
    const viewsEl = document.getElementById('viewsCount');
    if (viewsEl) viewsEl.textContent = views;
    
    const sharesEl = document.getElementById('sharesCount');
    if (sharesEl) sharesEl.textContent = shares;
    
    const followersEl = document.getElementById('followersCount');
    if (followersEl) followersEl.textContent = followers;
}

// ============================================
// SHARE FUNCTIONS
// ============================================
function shareOnFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    recordShare('facebook');
}

function shareOnTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=Check%20out%20this%20Group%20Formation%20Tool&url=${encodeURIComponent(window.location.href)}`, '_blank');
    recordShare('twitter');
}

function shareOnWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent('Group Formation Tool - ' + window.location.href)}`, '_blank');
    recordShare('whatsapp');
}

function shareOnLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    recordShare('linkedin');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
    recordShare('copy');
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================
function goHome() {
    window.location.href = 'https://magicrills.com';
}

function goBack() {
    window.location.href = 'https://magicrills.com/category-pages/mixed-tools.html';
}

// ============================================
// AUTO-SAVE DRAFT
// ============================================
function autoSaveDraft() {
    const draft = {
        students: studentsTextarea.value,
        groupType: groupTypeSelect.value,
        groupSize: groupSizeInput.value,
        conflictPairs: conflictPairsInput.value,
        assignLeaders: assignLeadersCheckbox.checked,
        timestamp: Date.now()
    };
    localStorage.setItem('group_tool_draft', JSON.stringify(draft));
    
    const indicator = document.getElementById('autoSaveIndicator');
    if (indicator) {
        indicator.style.opacity = '1';
        setTimeout(() => { indicator.style.opacity = '0.5'; }, 2000);
    }
}

function loadDraft() {
    const draft = localStorage.getItem('group_tool_draft');
    if (draft) {
        const data = JSON.parse(draft);
        if (studentsTextarea) studentsTextarea.value = data.students || '';
        if (groupTypeSelect) groupTypeSelect.value = data.groupType || 'balanced';
        if (groupSizeInput) groupSizeInput.value = data.groupSize || '4';
        if (conflictPairsInput) conflictPairsInput.value = data.conflictPairs || '';
        if (assignLeadersCheckbox) assignLeadersCheckbox.checked = data.assignLeaders || false;
        parseStudents();
        showToast('Draft restored', 'info');
    }
}

// ============================================
// PARSE STUDENTS
// ============================================
function parseStudents() {
    if (!studentsTextarea) return [];
    
    const text = studentsTextarea.value;
    const lines = text.split('\n');
    students = [];
    
    for (const line of lines) {
        if (line.trim() === '') continue;
        const parts = line.split(',');
        if (parts.length >= 3) {
            const name = parts[0].trim();
            const skill = parseInt(parts[1].trim());
            const social = parseInt(parts[2].trim());
            if (name && !isNaN(skill) && !isNaN(social) && skill >= 1 && skill <= 10 && social >= 1 && social <= 10) {
                students.push({ name, skill, social });
            }
        }
    }
    return students;
}

function parsePairs(input) {
    if (!input) return [];
    return input.split('\n').map(line => {
        const names = line.split(',').map(n => n.trim());
        return { a: names[0], b: names[1] };
    }).filter(p => p.a && p.b);
}

function checkConflict(s1, s2, conflicts) {
    return conflicts.some(c => (c.a === s1.name && c.b === s2.name) || (c.a === s2.name && c.b === s1.name));
}

// ============================================
// GENERATE GROUPS
// ============================================
function generateGroups() {
    parseStudents();
    const groupSize = parseInt(groupSizeInput.value);
    const groupType = groupTypeSelect.value;
    const conflicts = parsePairs(conflictPairsInput.value);
    
    if (students.length === 0) {
        showToast('Please enter student data', 'error');
        return;
    }
    
    if (groupSize < 2 || groupSize > 10) {
        showToast('Group size must be between 2 and 10', 'error');
        return;
    }
    
    showLoading(true);
    
    let remainingStudents = [...students];
    
    if (groupType === 'balanced') {
        remainingStudents.sort((a, b) => b.skill - a.skill);
    } else if (groupType === 'targeted') {
        remainingStudents.sort((a, b) => a.skill - b.skill);
    } else if (groupType === 'social') {
        remainingStudents.sort((a, b) => b.social - a.social);
    }
    
    const numGroups = Math.ceil(remainingStudents.length / groupSize);
    groups = Array(numGroups).fill().map(() => []);
    
    if (groupType === 'balanced') {
        for (let i = 0; i < remainingStudents.length; i++) {
            groups[i % numGroups].push(remainingStudents[i]);
        }
    } else {
        for (let i = 0; i < remainingStudents.length; i++) {
            const idx = Math.floor(i / groupSize);
            if (idx < groups.length) groups[idx].push(remainingStudents[i]);
        }
    }
    
    // Conflict resolution
    for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < groups[i].length; j++) {
            for (let k = j + 1; k < groups[i].length; k++) {
                if (checkConflict(groups[i][j], groups[i][k], conflicts)) {
                    for (let g = 0; g < groups.length; g++) {
                        if (g !== i && groups[g].length > 0) {
                            for (let m = 0; m < groups[g].length; m++) {
                                if (!checkConflict(groups[i][j], groups[g][m], conflicts)) {
                                    [groups[i][k], groups[g][m]] = [groups[g][m], groups[i][k]];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    if (assignLeadersCheckbox.checked) {
        groups.forEach(group => group.sort((a, b) => b.skill - a.skill));
    }
    
    currentGroups = groups;
    displayGroups();
    updateStatistics();
    incrementUsage();
    autoSaveDraft();
    showLoading(false);
    showToast('Groups generated successfully! 🎉', 'success');
}

function randomizeGroups() {
    parseStudents();
    
    if (students.length === 0) {
        showToast('Please enter student data first', 'error');
        return;
    }
    
    // Fisher-Yates shuffle
    for (let i = students.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [students[i], students[j]] = [students[j], students[i]];
    }
    
    const groupSize = parseInt(groupSizeInput.value);
    const numGroups = Math.ceil(students.length / groupSize);
    groups = Array(numGroups).fill().map(() => []);
    
    for (let i = 0; i < students.length; i++) {
        const idx = Math.floor(i / groupSize);
        if (idx < groups.length) groups[idx].push(students[i]);
    }
    
    if (assignLeadersCheckbox.checked) {
        groups.forEach(group => group.sort((a, b) => b.skill - a.skill));
    }
    
    displayGroups();
    updateStatistics();
    showToast('Groups randomized! 🔀', 'success');
}

// ============================================
// DISPLAY GROUPS
// ============================================
function displayGroups() {
    if (!groupsContainer) return;
    
    if (!groups || groups.length === 0) {
        groupsContainer.innerHTML = `<div class="placeholder">
            <i class="fas fa-lightbulb"></i> Click "Generate Groups" to start
        </div>`;
        return;
    }
    
    groupsContainer.innerHTML = '';
    
    groups.forEach((group, idx) => {
        let totalSkill = 0, totalSocial = 0;
        group.forEach(s => {
            totalSkill += s.skill;
            totalSocial += s.social;
        });
        
        const avgSkill = (totalSkill / group.length).toFixed(1);
        const avgSocial = (totalSocial / group.length).toFixed(1);
        
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';
        groupDiv.innerHTML = `
            <div class="group-header">
                <i class="fas fa-users"></i> Group ${idx + 1} (${group.length} members)
                ${assignLeadersCheckbox.checked ? `<span style="float:right"><i class="fas fa-crown"></i> Leader: ${escapeHtml(group[0]?.name || 'N/A')}</span>` : ''}
            </div>
            <div class="group-members">
                ${group.map(s => `
                    <div class="member">
                        <div><i class="fas fa-user-graduate"></i> ${escapeHtml(s.name)}</div>
                        <div>
                            <span class="member-skill"><i class="fas fa-chart-line"></i> Skill: ${s.skill}</span>
                            <span> | </span>
                            <span><i class="fas fa-heart"></i> Social: ${s.social}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="group-stats">
                <span><i class="fas fa-chart-simple"></i> Avg Skill: <strong>${avgSkill}</strong></span>
                <span><i class="fas fa-handshake"></i> Avg Social: <strong>${avgSocial}</strong></span>
            </div>
        `;
        groupsContainer.appendChild(groupDiv);
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ============================================
// UPDATE STATISTICS
// ============================================
function updateStatistics() {
    if (!students.length) return;
    
    const totalStudentsEl = document.getElementById('totalStudents');
    const totalGroupsEl = document.getElementById('totalGroups');
    const avgSkillEl = document.getElementById('avgSkill');
    const avgSocialEl = document.getElementById('avgSocial');
    const groupQualityEl = document.getElementById('groupQuality');
    const skillBarEl = document.getElementById('skillBar');
    
    if (totalStudentsEl) totalStudentsEl.textContent = students.length;
    if (totalGroupsEl) totalGroupsEl.textContent = groups.length;
    
    const totalSkill = students.reduce((sum, s) => sum + s.skill, 0);
    const totalSocial = students.reduce((sum, s) => sum + s.social, 0);
    const avgSkill = (totalSkill / students.length).toFixed(1);
    const avgSocial = (totalSocial / students.length).toFixed(1);
    
    if (avgSkillEl) avgSkillEl.textContent = avgSkill;
    if (avgSocialEl) avgSocialEl.textContent = avgSocial;
    
    // Quality score calculation
    let qualityScore = 0;
    if (groups.length > 0) {
        const groupSkills = groups.map(g => g.reduce((sum, s) => sum + s.skill, 0) / g.length);
        const mean = groupSkills.reduce((a, b) => a + b, 0) / groupSkills.length;
        const variance = groupSkills.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / groupSkills.length;
        qualityScore = Math.max(0, Math.min(100, 100 - (variance * 20)));
    }
    if (groupQualityEl) groupQualityEl.textContent = Math.round(qualityScore) + '%';
    
    if (skillBarEl) skillBarEl.style.width = `${(avgSkill / 10) * 100}%`;
}

// ============================================
// RESET FORM
// ============================================
function resetForm() {
    if (studentsTextarea) studentsTextarea.value = '';
    if (groupTypeSelect) groupTypeSelect.value = 'balanced';
    if (groupSizeInput) groupSizeInput.value = '4';
    if (conflictPairsInput) conflictPairsInput.value = '';
    if (assignLeadersCheckbox) assignLeadersCheckbox.checked = false;
    
    groups = [];
    students = [];
    
    if (groupsContainer) groupsContainer.innerHTML = '<div class="placeholder"><i class="fas fa-lightbulb"></i> Click "Generate Groups" to start</div>';
    
    const elements = ['totalStudents', 'totalGroups', 'avgSkill', 'avgSocial', 'groupQuality'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
    });
    
    const skillBar = document.getElementById('skillBar');
    if (skillBar) skillBar.style.width = '0%';
    
    localStorage.removeItem('group_tool_draft');
    showToast('Form reset! 🔄', 'info');
}

// ============================================
// LOAD SAMPLE DATA
// ============================================
function loadSampleData() {
    if (studentsTextarea) {
        studentsTextarea.value = `John Doe, 7, 8
Jane Smith, 5, 6
Michael Johnson, 9, 7
Sarah Williams, 6, 9
David Brown, 8, 5
Emily Jones, 4, 7
Robert Miller, 7, 6
Lisa Davis, 9, 8
James Wilson, 5, 5
Jessica Taylor, 6, 7
Daniel Anderson, 8, 6
Jennifer Thomas, 7, 8
Christopher Lee, 6, 4
Amanda Martinez, 8, 9
Matthew Garcia, 5, 7
Ashley Robinson, 7, 6
Joshua Clark, 9, 5
Megan Rodriguez, 6, 8
Andrew Lewis, 4, 6
Nicole Walker, 8, 7`;
    }
    parseStudents();
    showToast('Sample data loaded! 📚', 'success');
    autoSaveDraft();
}

// ============================================
// FILE UPLOAD HANDLER
// ============================================
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(evt) {
        const content = evt.target.result;
        let lines = [];
        
        if (file.name.endsWith('.csv')) {
            lines = content.split(/\r?\n/);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            try {
                const workbook = XLSX.read(content, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                lines = json.map(row => row.join(','));
            } catch (err) {
                showToast('Error parsing Excel file', 'error');
                return;
            }
        } else {
            lines = content.split(/\r?\n/);
        }
        
        const studentLines = [];
        for (let line of lines) {
            if (line.trim() && !line.toLowerCase().includes('name') && !line.toLowerCase().includes('student')) {
                studentLines.push(line);
            }
        }
        
        if (studentsTextarea) studentsTextarea.value = studentLines.join('\n');
        parseStudents();
        showToast(`${students.length} students imported! 📥`, 'success');
        autoSaveDraft();
    };
    
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.readAsBinaryString(file);
    } else {
        reader.readAsText(file);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
async function exportAsPdf() {
    if (!students.length && !groups.length) {
        showToast('No data to export', 'error');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(78, 84, 200);
    doc.text('Group Formation Report', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Students: ${students.length} | Total Groups: ${groups.length}`, 20, 30);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 38);
    
    let y = 55;
    groups.forEach((group, idx) => {
        if (y > 260) {
            doc.addPage();
            y = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(78, 84, 200);
        doc.text(`Group ${idx + 1} (${group.length} members)`, 20, y);
        y += 10;
        
        group.forEach(s => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(`${s.name} - Skill: ${s.skill}, Social: ${s.social}`, 25, y);
            y += 7;
        });
        y += 10;
    });
    
    doc.save('group-formation-report.pdf');
    showToast('PDF downloaded! 📄', 'success');
}

function exportAsWord() {
    if (!students.length && !groups.length) {
        showToast('No data to export', 'error');
        return;
    }
    
    let html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Group Formation Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #4e54c8; }
            h2 { color: #4e54c8; margin-top: 30px; }
            table { border-collapse: collapse; width: 100%; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4e54c8; color: white; }
            .header { text-align: center; margin-bottom: 30px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Group Formation Report</h1>
            <p>Total Students: ${students.length} | Total Groups: ${groups.length}</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
    `;
    
    groups.forEach((group, idx) => {
        const totalSkill = group.reduce((s, a) => s + a.skill, 0);
        const totalSocial = group.reduce((s, a) => s + a.social, 0);
        const avgSkill = (totalSkill / group.length).toFixed(1);
        const avgSocial = (totalSocial / group.length).toFixed(1);
        
        html += `
            <h2>Group ${idx + 1} (${group.length} members)</h2>
            <table>
                <thead><tr><th>Name</th><th>Skill Level</th><th>Social Dynamics</th></tr></thead>
                <tbody>
                    ${group.map(s => `<tr><td>${escapeHtml(s.name)}</td><td>${s.skill}</td><td>${s.social}</td></tr>`).join('')}
                    <tr style="background-color:#f0f0f0; font-weight:bold;">
                        <td>Group Averages</td>
                        <td>${avgSkill}</td>
                        <td>${avgSocial}</td>
                    </tr>
                </tbody>
            </table>
        `;
    });
    
    html += `</body></html>`;
    
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'group-formation-report.doc';
    link.click();
    showToast('Word document downloaded! 📝', 'success');
}

function exportAsTxt() {
    if (!students.length && !groups.length) {
        showToast('No data to export', 'error');
        return;
    }
    
    let content = '='.repeat(60) + '\n';
    content += 'GROUP FORMATION REPORT\n';
    content += '='.repeat(60) + '\n\n';
    content += `Total Students: ${students.length}\n`;
    content += `Total Groups: ${groups.length}\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n\n`;
    content += '-'.repeat(60) + '\n\n';
    
    groups.forEach((group, idx) => {
        const totalSkill = group.reduce((s, a) => s + a.skill, 0);
        const totalSocial = group.reduce((s, a) => s + a.social, 0);
        const avgSkill = (totalSkill / group.length).toFixed(1);
        const avgSocial = (totalSocial / group.length).toFixed(1);
        
        content += `GROUP ${idx + 1} (${group.length} members)\n`;
        content += '-'.repeat(30) + '\n';
        group.forEach(s => {
            content += `${s.name} | Skill: ${s.skill} | Social: ${s.social}\n`;
        });
        content += `\nAverages - Skill: ${avgSkill} | Social: ${avgSocial}\n\n`;
        content += '-'.repeat(30) + '\n\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'group-formation-report.txt';
    link.click();
    showToast('TXT file downloaded! 📃', 'success');
}

function exportAsExcel() {
    if (!students.length && !groups.length) {
        showToast('No data to export', 'error');
        return;
    }
    
    const data = [];
    groups.forEach((group, idx) => {
        group.forEach(student => {
            data.push({
                'Group Number': idx + 1,
                'Student Name': student.name,
                'Skill Level': student.skill,
                'Social Dynamics': student.social
            });
        });
    });
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Groups');
    XLSX.writeFile(wb, 'group-formation-report.xlsx');
    showToast('Excel file downloaded! 📊', 'success');
}

// ============================================
// THEME FUNCTIONS
// ============================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (themeToggle) {
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
    }
    showToast(isDark ? 'Dark mode enabled 🌙' : 'Light mode enabled ☀️', 'info');
}

// ============================================
// SCROLL FUNCTIONS
// ============================================
function scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollDown() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ============================================
// TAB HANDLING
// ============================================
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            tab.classList.add('active');
            const activeTab = document.getElementById(`${tabId}Tab`);
            if (activeTab) activeTab.classList.add('active');
        });
    });
}

// ============================================
// TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    const element = document.getElementById('typewriter-text');
    if (!element) return;
    
    const texts = [
        'Smart AI-Powered Classroom Grouping',
        'Balanced Groups with Skill Matching',
        'Targeted Learning Groups',
        'Social Dynamics Analysis',
        'Real-time Group Optimization'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(typeEffect, 500);
            return;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(typeEffect, speed);
    }
    
    typeEffect();
}

// ============================================
// INITIALIZE REACTION BUTTONS
// ============================================
function initReactionButtons() {
    const reactionBtns = document.querySelectorAll('.reaction-btn');
    reactionBtns.forEach(btn => {
        btn.removeEventListener('click', handleReactionClick);
        btn.addEventListener('click', handleReactionClick);
    });
}

function handleReactionClick(event) {
    const btn = event.currentTarget;
    const emoji = btn.getAttribute('data-emoji');
    if (emoji) {
        addReaction(emoji);
    }
}

// ============================================
// AI INTEGRATION - Grok API Ready
// ============================================
async function callAIAssistant(prompt) {
    try {
        const response = await fetch(`${API_BASE}/api/ai`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                prompt: prompt,
                tool_slug: TOOL_SLUG,
                context: { students: students, groups: groups }
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.warn('AI call failed:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
    if (generateBtn) generateBtn.addEventListener('click', generateGroups);
    if (resetBtn) resetBtn.addEventListener('click', resetForm);
    if (randomizeBtn) randomizeBtn.addEventListener('click', randomizeGroups);
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportAsPdf);
    if (exportWordBtn) exportWordBtn.addEventListener('click', exportAsWord);
    if (exportTxtBtn) exportTxtBtn.addEventListener('click', exportAsTxt);
    if (exportExcelBtn) exportExcelBtn.addEventListener('click', exportAsExcel);
    if (fileUpload) fileUpload.addEventListener('change', handleFileUpload);
    if (loadSampleBtn) loadSampleBtn.addEventListener('click', loadSampleData);
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (scrollUpBtn) scrollUpBtn.addEventListener('click', scrollUp);
    if (scrollDownBtn) scrollDownBtn.addEventListener('click', scrollDown);
    if (homeBtn) homeBtn.addEventListener('click', goHome);
    if (backBtn) backBtn.addEventListener('click', goBack);
    
    if (studentsTextarea) studentsTextarea.addEventListener('input', autoSaveDraft);
    if (groupTypeSelect) groupTypeSelect.addEventListener('change', autoSaveDraft);
    if (groupSizeInput) groupSizeInput.addEventListener('change', autoSaveDraft);
    if (conflictPairsInput) conflictPairsInput.addEventListener('input', autoSaveDraft);
    if (assignLeadersCheckbox) assignLeadersCheckbox.addEventListener('change', autoSaveDraft);
    
    // Share buttons
    const shareBtns = document.querySelectorAll('.share-btn');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.getAttribute('data-platform');
            if (platform === 'facebook') shareOnFacebook();
            else if (platform === 'twitter') shareOnTwitter();
            else if (platform === 'whatsapp') shareOnWhatsApp();
            else if (platform === 'linkedin') shareOnLinkedIn();
            else if (platform === 'copy') copyLink();
        });
    });
    
    // Reaction buttons
    initReactionButtons();
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    initTheme();
    initTabs();
    initTypewriter();
    initEventListeners();
    loadDraft();
    parseStudents();
    
    // Load stats from API with fallback
    await fetchStats();
    await fetchReactions();
    
    // Increment usage on load
    await incrementUsage();
    
    showToast('Welcome to Group Formation Tool! 🚀', 'success');
    
    // Log API info
    console.log('🔧 Tool initialized with Cloudflare Workers API');
    console.log(`📊 API Base: ${API_BASE}`);
    console.log(`🔑 Tool Slug: ${TOOL_SLUG}`);
    console.log(`👤 Session ID: ${SESSION_ID}`);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
