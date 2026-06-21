/* ========================================
   QUICK TRAINING AGENDA MAKER - SCRIPT
   UPDATED: CLOUDFLARE WORKERS API
   ======================================== */

// ========================================
// CONFIGURATION
// ========================================

const TOOL_SLUG = 'quick-training-agenda-maker';
const TOOL_NAME = 'Quick Training Agenda Maker';
const CATEGORY = 'Mixed-Tools';

// Cloudflare Workers API Configuration
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

// LocalStorage keys for fallback
const STORAGE_KEYS = {
    USAGE: 'qta_usage_count',
    REACTIONS: 'qta_reactions_data',
    SHARES: 'qta_shares_count',
    USER_ID: 'qta_user_id',
    DARK_MODE: 'darkMode',
    THEME: 'theme'
};

// Generate or retrieve user ID
let currentUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
if (!currentUserId) {
    currentUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    localStorage.setItem(STORAGE_KEYS.USER_ID, currentUserId);
}

let totalDays = 0;
let totalSlots = 0;
let sessionTimes = [];
let breakList = [];
let allDaysData = [];
let breakIdCounter = 0;

// DOM Elements
const step1Div = document.getElementById('step1');
const step2Div = document.getElementById('step2');
const step3Div = document.getElementById('step3');
const startCustomizeBtn = document.getElementById('startCustomizeBtn');
const backToStep1Btn = document.getElementById('backToStep1');
const backToStep2Btn = document.getElementById('backToStep2');
const generateAgendaBtn = document.getElementById('generateFinalAgenda');
const editAgainBtn = document.getElementById('editAgainBtn');
const homePageBtn = document.getElementById('homePageBtn');
const addDayButton = document.getElementById('addDayButton');
const teaBreakBtn = document.getElementById('teaBreakBtn');
const lunchBreakBtn = document.getElementById('lunchBreakBtn');
const pdfExportBtn = document.getElementById('pdfExportBtn');
const docxExportBtn = document.getElementById('docxExportBtn');
const printAgendaBtn = document.getElementById('printAgendaBtn');
const copyTextBtn = document.getElementById('copyTextBtn');
const copyUrlShareBtn = document.getElementById('copyUrlShareBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');

// ========================================
// CLOUDFLARE WORKERS API CALLS
// ========================================

async function callAPI(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
                'X-User-Id': currentUserId,
                'X-Tool-Slug': TOOL_SLUG
            }
        };
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        const url = `${API_BASE}${endpoint}`;
        console.log(`📡 API Call: ${method} ${url}`);
        
        const response = await fetch(url, options);
        
        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            console.log(`📡 API Response:`, result);
            return result;
        } else {
            const text = await response.text();
            console.log(`📡 API Response (text):`, text);
            return { success: false, error: 'Invalid response format', raw: text };
        }
    } catch (error) {
        console.error('❌ API Error:', error);
        return { success: false, error: error.message };
    }
}

// ========================================
// USAGE COUNTER - Cloudflare API
// ========================================

async function incrementUsage() {
    try {
        const result = await callAPI('/api/usage', 'POST', { 
            tool_slug: TOOL_SLUG,
            user_id: currentUserId
        });
        
        if (result.success) {
            const usageCount = result.usage || result.total_usage || 0;
            document.getElementById('globalUsageCount').innerText = usageCount;
            // Save to localStorage as fallback
            localStorage.setItem(STORAGE_KEYS.USAGE, usageCount);
            console.log('✅ Usage incremented:', usageCount);
        } else {
            // Fallback: use localStorage
            let fallbackCount = parseInt(localStorage.getItem(STORAGE_KEYS.USAGE) || '0') + 1;
            localStorage.setItem(STORAGE_KEYS.USAGE, fallbackCount);
            document.getElementById('globalUsageCount').innerText = fallbackCount;
            console.log('⚠️ Usage fallback (localStorage):', fallbackCount);
        }
        return result;
    } catch (error) {
        console.error('❌ Usage increment error:', error);
        // Fallback
        let fallbackCount = parseInt(localStorage.getItem(STORAGE_KEYS.USAGE) || '0') + 1;
        localStorage.setItem(STORAGE_KEYS.USAGE, fallbackCount);
        document.getElementById('globalUsageCount').innerText = fallbackCount;
        return { success: false };
    }
}

async function getGlobalStats() {
    try {
        const result = await callAPI(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result.success) {
            const usage = result.usage || result.total_usage || 0;
            document.getElementById('globalUsageCount').innerText = usage;
            localStorage.setItem(STORAGE_KEYS.USAGE, usage);
            
            // Update reactions if available
            if (result.reactions) {
                updateReactionCounts(result.reactions);
            }
            if (result.shares !== undefined) {
                document.getElementById('totalSharesCount').innerText = result.shares;
                localStorage.setItem(STORAGE_KEYS.SHARES, result.shares);
            }
            console.log('✅ Global stats loaded:', result);
        } else {
            loadFallbackStats();
        }
        return result;
    } catch (error) {
        console.error('❌ Global stats error:', error);
        loadFallbackStats();
        return { success: false };
    }
}

function loadFallbackStats() {
    // Load from localStorage
    const usage = parseInt(localStorage.getItem(STORAGE_KEYS.USAGE) || '0');
    document.getElementById('globalUsageCount').innerText = usage;
    
    const shares = parseInt(localStorage.getItem(STORAGE_KEYS.SHARES) || '0');
    document.getElementById('totalSharesCount').innerText = shares;
    
    // Load reactions from localStorage
    try {
        const reactionsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS) || '{}');
        updateReactionCounts(reactionsData);
    } catch (e) {
        console.log('No reactions data in localStorage');
    }
}

// ========================================
// REACTIONS - Cloudflare API
// ========================================

async function addReaction(reactionType) {
    try {
        const result = await callAPI('/api/reactions', 'POST', {
            user_id: currentUserId,
            tool_slug: TOOL_SLUG,
            reaction_type: reactionType,
            emoji: reactionType
        });
        
        if (result.success) {
            updateReactionCounts(result.counts || {});
            // Save to localStorage
            localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(result.counts || {}));
            showToast(`Reacted: ${reactionType} 👍`, 'success');
            console.log('✅ Reaction added:', reactionType, result.counts);
        } else if (result.already_reacted) {
            showToast(`You already reacted with ${reactionType}`, 'warning');
            console.log('⚠️ Already reacted:', reactionType);
        } else {
            // Fallback: update localStorage
            updateLocalReaction(reactionType);
            showToast(`Reacted: ${reactionType} (offline mode)`, 'info');
        }
        return result;
    } catch (error) {
        console.error('❌ Reaction error:', error);
        // Fallback
        updateLocalReaction(reactionType);
        showToast(`Reacted: ${reactionType} (offline mode)`, 'info');
        return { success: false };
    }
}

function updateLocalReaction(reactionType) {
    let reactions = {};
    try {
        reactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS) || '{}');
    } catch (e) {
        reactions = {};
    }
    reactions[reactionType] = (reactions[reactionType] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(reactions));
    updateReactionCounts(reactions);
}

async function getReactions() {
    try {
        const result = await callAPI('/api/reactions', 'GET');
        if (result.success && result.reactions) {
            updateReactionCounts(result.reactions);
            localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(result.reactions));
            console.log('✅ Reactions loaded:', result.reactions);
        } else {
            // Load from localStorage
            try {
                const reactionsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS) || '{}');
                updateReactionCounts(reactionsData);
            } catch (e) {
                console.log('No reactions data');
            }
        }
        return result;
    } catch (error) {
        console.error('❌ Get reactions error:', error);
        return { success: false };
    }
}

function updateReactionCounts(counts) {
    const reactions = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
    let total = 0;
    reactions.forEach(react => {
        const btn = document.querySelector(`.reaction-btn[data-reaction="${react}"]`);
        if (btn) {
            const span = btn.querySelector('span');
            const count = counts[react] || 0;
            if (span) span.innerText = count;
            total += count;
        }
    });
    document.getElementById('totalReactionsCount').innerText = total;
}

// ========================================
// SHARES - Cloudflare API
// ========================================

async function recordShare(platform) {
    try {
        const result = await callAPI('/api/shares', 'POST', {
            user_id: currentUserId,
            tool_slug: TOOL_SLUG,
            platform: platform
        });
        console.log('✅ Share recorded:', platform, result);
        if (result.success) {
            const shareCount = result.shares || result.total_shares || 0;
            document.getElementById('totalSharesCount').innerText = shareCount;
            localStorage.setItem(STORAGE_KEYS.SHARES, shareCount);
        }
        return result;
    } catch (error) {
        console.error('❌ Share record error:', error);
        // Fallback
        let shareCount = parseInt(localStorage.getItem(STORAGE_KEYS.SHARES) || '0') + 1;
        localStorage.setItem(STORAGE_KEYS.SHARES, shareCount);
        document.getElementById('totalSharesCount').innerText = shareCount;
        return { success: false };
    }
}

async function getSharesCount() {
    try {
        const result = await callAPI('/api/shares', 'GET');
        if (result.success && result.shares !== undefined) {
            document.getElementById('totalSharesCount').innerText = result.shares;
            localStorage.setItem(STORAGE_KEYS.SHARES, result.shares);
            console.log('✅ Shares count:', result.shares);
        } else {
            // Load from localStorage
            const shares = parseInt(localStorage.getItem(STORAGE_KEYS.SHARES) || '0');
            document.getElementById('totalSharesCount').innerText = shares;
        }
        return result;
    } catch (error) {
        console.error('❌ Get shares error:', error);
        const shares = parseInt(localStorage.getItem(STORAGE_KEYS.SHARES) || '0');
        document.getElementById('totalSharesCount').innerText = shares;
        return { success: false };
    }
}

// ========================================
// SOCIAL SHARING
// ========================================

async function shareOnPlatform(platform) {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent('Quick Training Agenda Maker - Create Professional Training Agendas');
    
    let shareLink = '';
    switch(platform) {
        case 'facebook':
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
            break;
        case 'twitter':
            shareLink = `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`;
            break;
        case 'whatsapp':
            shareLink = `https://wa.me/?text=${pageTitle}%20${pageUrl}`;
            break;
        case 'linkedin':
            shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
            break;
        case 'email':
            shareLink = `mailto:?subject=${pageTitle}&body=${pageUrl}`;
            break;
        default:
            return;
    }
    
    if (shareLink) {
        window.open(shareLink, '_blank', 'width=600,height=400');
    }
    
    await recordShare(platform);
    await getSharesCount();
    showToast(`Shared on ${platform}`, 'success');
}

async function copyPageUrl() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('URL copied to clipboard!', 'success');
        await recordShare('copy');
        await getSharesCount();
    } catch(err) {
        showToast('Failed to copy URL', 'error');
        console.error('Copy error:', err);
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Quick Training Agenda Maker - Initializing...');
    console.log('👤 User ID:', currentUserId);
    console.log('🔗 API Base:', API_BASE);
    console.log('🔑 API Key:', API_KEY);
    
    // Set default dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('startDateInput').value = tomorrow.toISOString().split('T')[0];
    
    const nextWeek = new Date(tomorrow);
    nextWeek.setDate(nextWeek.getDate() + 6);
    document.getElementById('endDateInput').value = nextWeek.toISOString().split('T')[0];
    
    // Load preferences
    if (localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true') {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
    
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme && savedTheme !== 'default') {
        document.body.classList.add(`theme-${savedTheme}`);
    }
    
    // Load all stats from Cloudflare API
    await getGlobalStats();
    await getReactions();
    await getSharesCount();
    
    // Event Listeners
    startCustomizeBtn.addEventListener('click', generateCustomForm);
    backToStep1Btn.addEventListener('click', () => goToStep(1));
    backToStep2Btn.addEventListener('click', () => goToStep(2));
    generateAgendaBtn.addEventListener('click', createAgenda);
    editAgainBtn.addEventListener('click', () => goToStep(1));
    homePageBtn.addEventListener('click', () => window.location.href = 'https://magicrills.com');
    addDayButton.addEventListener('click', addNewTrainingDay);
    teaBreakBtn.addEventListener('click', () => addBreakItem('Tea Break', '10:30', '10:45'));
    lunchBreakBtn.addEventListener('click', () => addBreakItem('Lunch Break', '13:00', '14:00'));
    pdfExportBtn.addEventListener('click', exportAsPDF);
    docxExportBtn.addEventListener('click', exportAsDOCX);
    printAgendaBtn.addEventListener('click', () => window.print());
    copyTextBtn.addEventListener('click', copyAgendaContent);
    copyUrlShareBtn.addEventListener('click', copyPageUrl);
    darkModeBtn.addEventListener('click', toggleDarkMode);
    scrollUpBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollDownBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.body.classList.remove('theme-ocean', 'theme-forest', 'theme-sunset', 'theme-purple', 'theme-midnight');
            if (theme !== 'default') {
                document.body.classList.add(`theme-${theme}`);
                localStorage.setItem(STORAGE_KEYS.THEME, theme);
            } else {
                localStorage.removeItem(STORAGE_KEYS.THEME);
            }
            showToast(`Theme changed to ${theme}`, 'success');
        });
    });
    
    // Reaction buttons
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reaction = btn.dataset.reaction;
            console.log('👍 Reaction clicked:', reaction);
            addReaction(reaction);
        });
    });
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        if (btn.dataset.platform === 'copy') return;
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            console.log('📤 Share clicked:', platform);
            shareOnPlatform(platform);
        });
    });
    
    console.log('✅ Initialization complete!');
});

function goToStep(step) {
    step1Div.classList.remove('active-step');
    step2Div.classList.remove('active-step');
    step3Div.classList.remove('active-step');
    
    if (step === 1) step1Div.classList.add('active-step');
    else if (step === 2) step2Div.classList.add('active-step');
    else if (step === 3) step3Div.classList.add('active-step');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// FORM GENERATION
// ========================================

async function generateCustomForm() {
    const startDateVal = document.getElementById('startDateInput').value;
    const endDateVal = document.getElementById('endDateInput').value;
    totalSlots = parseInt(document.getElementById('sessionSlots').value);
    const sessionDuration = parseInt(document.getElementById('sessionMins').value);
    
    if (!startDateVal || !endDateVal) {
        showToast('Please select both start and end dates', 'error');
        return;
    }
    
    const startDateObj = new Date(startDateVal);
    const endDateObj = new Date(endDateVal);
    
    if (endDateObj < startDateObj) {
        showToast('End date must be after start date', 'error');
        return;
    }
    
    totalDays = Math.floor((endDateObj - startDateObj) / 86400000) + 1;
    if (totalDays > 30) {
        showToast('Maximum 30 days allowed', 'error');
        return;
    }
    
    // Generate session times
    const slotsContainer = document.getElementById('slotsArea');
    slotsContainer.innerHTML = '';
    let currentTime = 9;
    
    for (let i = 1; i <= totalSlots; i++) {
        const startHour = Math.floor(currentTime);
        const startMin = (currentTime % 1) * 60;
        const endTimeVal = currentTime + (sessionDuration / 60);
        const endHour = Math.floor(endTimeVal);
        const endMin = (endTimeVal % 1) * 60;
        
        const startStr = `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`;
        const endStr = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
        
        slotsContainer.innerHTML += `
            <div class="slot-card">
                <label>Session ${i}</label>
                <input type="time" id="slotStart${i}" value="${startStr}" />
                <span>to</span>
                <input type="time" id="slotEnd${i}" value="${endStr}" />
            </div>
        `;
        currentTime = endTimeVal + 0.5;
    }
    
    // Generate days
    const daysContainer = document.getElementById('daysArea');
    daysContainer.innerHTML = '';
    breakList = [];
    breakIdCounter = 0;
    
    for (let d = 1; d <= totalDays; d++) {
        const currentDay = new Date(startDateObj);
        currentDay.setDate(currentDay.getDate() + d - 1);
        const dateDisplay = currentDay.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
        
        let sessionsHtml = '';
        for (let s = 1; s <= totalSlots; s++) {
            sessionsHtml += `
                <div class="session-card" data-session-id="${s}">
                    <button class="remove-session-btn" onclick="deleteSessionCard(this)"><i class="fas fa-times"></i></button>
                    <input type="text" class="session-title-input" placeholder="Title" value="Session ${s}" />
                    <input type="text" class="session-bullets-input" placeholder="Topics (comma separated)" value="Topic 1, Topic 2" />
                    <input type="text" class="session-trainer-input" placeholder="Trainer" value="Trainer Name" />
                </div>
            `;
        }
        
        daysContainer.innerHTML += `
            <div class="day-card" data-day-index="${d}">
                <div class="day-header" onclick="toggleDayPanel(this)">
                    <h4><i class="fas fa-calendar-day"></i> Day ${d} (${dateDisplay})</h4>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="day-sessions-panel">
                    ${sessionsHtml}
                    <button class="add-session-btn" onclick="addSessionToDayFunc(${d})">
                        <i class="fas fa-plus"></i> Add Session
                    </button>
                </div>
            </div>
        `;
    }
    
    // Increment usage in Cloudflare API
    await incrementUsage();
    
    goToStep(2);
    showToast('Customization form generated!', 'success');
}

// ========================================
// DAY AND SESSION MANAGEMENT
// ========================================

window.toggleDayPanel = function(element) {
    const panel = element.parentElement.querySelector('.day-sessions-panel');
    const icon = element.querySelector('.fa-chevron-down');
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        icon.style.transform = 'rotate(0deg)';
    } else {
        panel.style.display = 'none';
        icon.style.transform = 'rotate(-90deg)';
    }
};

window.addSessionToDayFunc = function(dayIndex) {
    const dayCard = document.querySelector(`.day-card[data-day-index="${dayIndex}"]`);
    const sessionsPanel = dayCard.querySelector('.day-sessions-panel');
    const addButton = sessionsPanel.querySelector('.add-session-btn');
    
    const newSessionHtml = `
        <div class="session-card" data-session-id="new">
            <button class="remove-session-btn" onclick="deleteSessionCard(this)"><i class="fas fa-times"></i></button>
            <input type="text" class="session-title-input" placeholder="Title" value="New Session" />
            <input type="text" class="session-bullets-input" placeholder="Topics (comma separated)" value="New Topic" />
            <input type="text" class="session-trainer-input" placeholder="Trainer" value="Trainer" />
        </div>
    `;
    addButton.insertAdjacentHTML('beforebegin', newSessionHtml);
    showToast('Session added to day', 'success');
};

window.deleteSessionCard = function(btn) {
    btn.closest('.session-card').remove();
    showToast('Session removed', 'info');
};

function addNewTrainingDay() {
    totalDays++;
    const startDateVal = document.getElementById('startDateInput').value;
    const startDateObj = new Date(startDateVal);
    const newDayDate = new Date(startDateObj);
    newDayDate.setDate(newDayDate.getDate() + totalDays - 1);
    const dateDisplay = newDayDate.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
    
    let sessionsHtml = '';
    for (let s = 1; s <= totalSlots; s++) {
        sessionsHtml += `
            <div class="session-card" data-session-id="${s}">
                <button class="remove-session-btn" onclick="deleteSessionCard(this)"><i class="fas fa-times"></i></button>
                <input type="text" class="session-title-input" placeholder="Title" value="Session ${s}" />
                <input type="text" class="session-bullets-input" placeholder="Topics (comma separated)" value="Topic 1, Topic 2" />
                <input type="text" class="session-trainer-input" placeholder="Trainer" value="Trainer" />
            </div>
        `;
    }
    
    const daysContainer = document.getElementById('daysArea');
    daysContainer.innerHTML += `
        <div class="day-card" data-day-index="${totalDays}">
            <div class="day-header" onclick="toggleDayPanel(this)">
                <h4><i class="fas fa-calendar-day"></i> Day ${totalDays} (${dateDisplay})</h4>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="day-sessions-panel">
                ${sessionsHtml}
                <button class="add-session-btn" onclick="addSessionToDayFunc(${totalDays})">
                    <i class="fas fa-plus"></i> Add Session
                </button>
            </div>
        </div>
    `;
    showToast('New day added', 'success');
}

function addBreakItem(name, defaultStart, defaultEnd) {
    breakIdCounter++;
    const breakId = breakIdCounter;
    const breaksContainer = document.getElementById('breaksArea');
    
    breaksContainer.innerHTML += `
        <div class="break-card" data-break-id="${breakId}">
            <strong>${name}</strong>
            <input type="time" class="break-start-time" value="${defaultStart}" />
            <span>to</span>
            <input type="time" class="break-end-time" value="${defaultEnd}" />
            <button class="remove-break-btn" onclick="removeBreakItem(${breakId})"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    breakList.push({ id: breakId, name: name, start: defaultStart, end: defaultEnd });
    showToast(`${name} added`, 'success');
}

window.removeBreakItem = function(breakId) {
    document.querySelector(`.break-card[data-break-id="${breakId}"]`).remove();
    breakList = breakList.filter(b => b.id !== breakId);
    showToast('Break removed', 'info');
};

// ========================================
// AGENDA GENERATION
// ========================================

function createAgenda() {
    // Get session times
    sessionTimes = [];
    for (let i = 1; i <= totalSlots; i++) {
        const startInput = document.getElementById(`slotStart${i}`);
        const endInput = document.getElementById(`slotEnd${i}`);
        if (startInput && endInput) {
            sessionTimes.push({ start: startInput.value, end: endInput.value });
        }
    }
    
    // Get all sessions data
    allDaysData = [];
    const allDayCards = document.querySelectorAll('.day-card');
    
    for (let d = 0; d < allDayCards.length; d++) {
        const dayCard = allDayCards[d];
        const sessionCards = dayCard.querySelectorAll('.session-card');
        const daySessionData = [];
        
        sessionCards.forEach(card => {
            const title = card.querySelector('.session-title-input')?.value || 'Session';
            const bulletsStr = card.querySelector('.session-bullets-input')?.value || '';
            const bullets = bulletsStr.split(',').map(b => b.trim()).filter(b => b);
            const trainer = card.querySelector('.session-trainer-input')?.value || 'Trainer';
            daySessionData.push({ title, bullets, trainer });
        });
        
        allDaysData.push(daySessionData);
    }
    
    // Update breaks
    const breakCards = document.querySelectorAll('.break-card');
    breakList = [];
    breakCards.forEach(card => {
        const name = card.querySelector('strong')?.innerText || 'Break';
        const start = card.querySelector('.break-start-time')?.value || '12:00';
        const end = card.querySelector('.break-end-time')?.value || '13:00';
        breakList.push({ id: Date.now(), name, start, end });
    });
    
    // Generate HTML table
    const startDateVal = document.getElementById('startDateInput').value;
    const startDateObj = new Date(startDateVal);
    const dateRangeText = `${startDateObj.toLocaleDateString('en-GB')} - ${new Date(startDateObj.getTime() + (allDaysData.length - 1) * 86400000).toLocaleDateString('en-GB')}`;
    
    let tableHtml = `<div class="calendar-header">📅 Training Schedule: ${dateRangeText}</div>`;
    tableHtml += `<table class="agenda-table"><thead>`;
    tableHtml += `<tr><th>Time</th>`;
    
    for (let d = 0; d < allDaysData.length; d++) {
        const dayDate = new Date(startDateObj);
        dayDate.setDate(dayDate.getDate() + d);
        const dayLabel = dayDate.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
        tableHtml += `<th>Day ${d + 1}<br><small>${dayLabel}</small></th>`;
    }
    tableHtml += `</tr></thead><tbody>`;
    
    // Combine events
    const allEvents = [];
    sessionTimes.forEach((s, idx) => allEvents.push({ type: 'session', index: idx, time: s.start }));
    breakList.forEach(b => allEvents.push({ type: 'break', data: b, time: b.start }));
    allEvents.sort((a, b) => a.time.localeCompare(b.time));
    
    allEvents.forEach(event => {
        if (event.type === 'session') {
            const sIdx = event.index;
            tableHtml += `<tr>`;
            tableHtml += `<td><strong>${sessionTimes[sIdx].start} - ${sessionTimes[sIdx].end}</strong></td>`;
            
            for (let d = 0; d < allDaysData.length; d++) {
                const sessionData = allDaysData[d][sIdx] || { title: 'Session', bullets: [], trainer: 'Trainer' };
                const bulletItems = sessionData.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('');
                tableHtml += `<td>
                    <div class="session-title-cell">${escapeHtml(sessionData.title)}</div>
                    <ul class="session-bullets-cell">${bulletItems}</ul>
                    <div class="trainer-cell"><i class="fas fa-user"></i> ${escapeHtml(sessionData.trainer)}</div>
                </td>`;
            }
            tableHtml += `</tr>`;
        } else {
            const breakData = event.data;
            tableHtml += `<tr class="break-row">`;
            tableHtml += `<td><strong>${breakData.start} - ${breakData.end}</strong><br>${escapeHtml(breakData.name)}</td>`;
            for (let i = 0; i < allDaysData.length; i++) {
                tableHtml += `<td><i class="fas fa-coffee"></i> ${escapeHtml(breakData.name)}</td>`;
            }
            tableHtml += `</tr>`;
        }
    });
    
    tableHtml += `</tbody></table>`;
    
    document.getElementById('agendaDisplay').innerHTML = tableHtml;
    goToStep(3);
    showToast('Agenda generated successfully!', 'success');
}

// ========================================
// EXPORT FUNCTIONS
// ========================================

function exportAsPDF() {
    const element = document.getElementById('agendaDisplay');
    html2canvas(element, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgWidth = 280;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`training_agenda_${new Date().toISOString().split('T')[0]}.pdf`);
        showToast('PDF exported successfully!', 'success');
    }).catch(() => {
        showToast('PDF export failed', 'error');
    });
}

function exportAsDOCX() {
    const content = document.getElementById('agendaDisplay').innerHTML;
    const style = `<style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #667eea; color: white; }
    </style>`;
    const fullHtml = `<html><head>${style}</head><body>${content}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'application/msword' });
    saveAs(blob, `training_agenda_${new Date().toISOString().split('T')[0]}.doc`);
    showToast('DOCX exported successfully!', 'success');
}

function copyAgendaContent() {
    const agendaText = document.getElementById('agendaDisplay').innerText;
    navigator.clipboard.writeText(agendaText).then(() => {
        showToast('Agenda copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toastMsg');
    const toastText = document.getElementById('toastText');
    toastText.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDark);
    updateDarkModeIcon(isDark);
    showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'success');
}

function updateDarkModeIcon(isDark) {
    const moonIcon = darkModeBtn.querySelector('.fa-moon');
    const sunIcon = darkModeBtn.querySelector('.fa-sun');
    if (!sunIcon) {
        darkModeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    } else {
        if (isDark) {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    }
}

// Premium Modal
function showPremiumModal() {
    document.getElementById('premiumModalBox').classList.add('show');
}

document.querySelector('.modal-close-btn')?.addEventListener('click', () => {
    document.getElementById('premiumModalBox').classList.remove('show');
});
document.getElementById('closeModalBtn')?.addEventListener('click', () => {
    document.getElementById('premiumModalBox').classList.remove('show');
});
