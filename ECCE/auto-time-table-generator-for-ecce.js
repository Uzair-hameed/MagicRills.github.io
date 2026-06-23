/**
 * ECCE Time Table Generator
 * Cloudflare Workers API Integration
 * Version: 2.0.0
 */

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'ecce-time-table-generator',
    TOOL_NAME: 'ECCE Auto Time Table Generator',
    CATEGORY: 'ECCE'
};

// ============================================================
// STORAGE KEYS
// ============================================================
const STORAGE = {
    TOOLS: 'ecce_all_tools_master',
    REACTIONS: 'ecce_reactions_v2',
    USAGE: 'ecce_usage_counts',
    SHARES: 'ecce_shares_v2',
    VIEWS: 'ecce_views_v2'
};

// ============================================================
// STATE
// ============================================================
let toolId = 'ecce_timetool';
let statsData = {
    views: 0,
    usage: 0,
    shares: 0,
    followers: 0
};

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(msg, duration = 3000) {
    const existing = document.querySelector('.toast-notify');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notify';
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// ============================================================
// TYPEWRITER ANIMATION
// ============================================================
function initTypewriter() {
    const words = [
        'Early Childhood Education',
        'Preschool Teachers',
        'Daycare Centers',
        'Nursery Classes',
        'Kindergarten',
        'Playgroup Sessions'
    ];
    let wordIndex = 0, charIndex = 0, isDeleting = false;
    const element = document.getElementById('typewriterText');
    if (!element) return;
    
    function typeEffect() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeEffect, 500);
            return;
        }
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
    typeEffect();
}

// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================
function getStorageData(key, defaultVal = {}) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultVal;
    } catch {
        return defaultVal;
    }
}

function setStorageData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn('Storage write failed:', e);
    }
}

// ============================================================
// CLOUDFLARE API CALLS
// ============================================================
async function callAPI(endpoint, method = 'GET', body = null) {
    const url = `${CONFIG.API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': CONFIG.API_KEY
    };
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('API call failed:', error);
        return null;
    }
}

// ============================================================
// USAGE COUNTER
// ============================================================
async function incrementUsage() {
    try {
        const result = await callAPI('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            tool_name: CONFIG.TOOL_NAME,
            category: CONFIG.CATEGORY
        });
        
        if (result?.success) {
            statsData.usage = result.usage_count || 0;
            updateUsageUI();
            return;
        }
        fallbackIncrementUsage();
    } catch {
        fallbackIncrementUsage();
    }
}

function fallbackIncrementUsage() {
    const usage = getStorageData(STORAGE.USAGE, {});
    usage[CONFIG.TOOL_SLUG] = (usage[CONFIG.TOOL_SLUG] || 0) + 1;
    setStorageData(STORAGE.USAGE, usage);
    statsData.usage = usage[CONFIG.TOOL_SLUG];
    updateUsageUI();
}

function updateUsageUI() {
    const usageSpan = document.getElementById('usageNumber');
    const usageDisplay = document.getElementById('usageCountDisplay');
    const heroUsage = document.getElementById('heroUsageStat');
    
    if (usageSpan) usageSpan.textContent = statsData.usage || 0;
    if (heroUsage) heroUsage.textContent = statsData.usage || 0;
    if (usageDisplay) {
        usageDisplay.innerHTML = `<i class="fas fa-rotate-right"></i> Used <span id="usageNumber">${statsData.usage || 0}</span> times`;
    }
}

// ============================================================
// VIEWS COUNTER
// ============================================================
async function incrementViews() {
    try {
        const result = await callAPI('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            tool_name: CONFIG.TOOL_NAME,
            category: CONFIG.CATEGORY,
            type: 'view'
        });
        if (result?.success) {
            statsData.views = result.views || 0;
            updateStatsUI();
            return;
        }
        fallbackIncrementViews();
    } catch {
        fallbackIncrementViews();
    }
}

function fallbackIncrementViews() {
    const views = getStorageData(STORAGE.VIEWS, {});
    views[CONFIG.TOOL_SLUG] = (views[CONFIG.TOOL_SLUG] || 0) + 1;
    setStorageData(STORAGE.VIEWS, views);
    statsData.views = views[CONFIG.TOOL_SLUG];
    updateStatsUI();
}

// ============================================================
// REACTIONS
// ============================================================
async function getReactions() {
    try {
        const result = await callAPI(`/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (result?.success) return result.reactions || {};
        return getStorageData(STORAGE.REACTIONS, {});
    } catch {
        return getStorageData(STORAGE.REACTIONS, {});
    }
}

async function addReaction(emojiKey, emojiIcon) {
    const userKey = `react_${CONFIG.TOOL_SLUG}_${emojiKey}`;
    if (sessionStorage.getItem(userKey)) {
        showToast(`⚠️ You already reacted with ${emojiIcon}!`);
        return false;
    }
    
    try {
        const result = await callAPI('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            reaction: emojiKey,
            emoji: emojiIcon
        });
        
        if (result?.success) {
            sessionStorage.setItem(userKey, 'true');
            statsData.followers = (statsData.followers || 0) + 1;
            await renderReactions();
            updateStatsUI();
            showToast(`${emojiIcon} Reaction added!`);
            return true;
        }
        return fallbackAddReaction(emojiKey, emojiIcon);
    } catch {
        return fallbackAddReaction(emojiKey, emojiIcon);
    }
}

function fallbackAddReaction(emojiKey, emojiIcon) {
    const userKey = `react_${CONFIG.TOOL_SLUG}_${emojiKey}`;
    if (sessionStorage.getItem(userKey)) {
        showToast(`⚠️ You already reacted with ${emojiIcon}!`);
        return false;
    }
    
    const reactions = getStorageData(STORAGE.REACTIONS, {});
    if (!reactions[CONFIG.TOOL_SLUG]) reactions[CONFIG.TOOL_SLUG] = {};
    if (!reactions[CONFIG.TOOL_SLUG][emojiKey]) reactions[CONFIG.TOOL_SLUG][emojiKey] = 0;
    reactions[CONFIG.TOOL_SLUG][emojiKey] += 1;
    setStorageData(STORAGE.REACTIONS, reactions);
    sessionStorage.setItem(userKey, 'true');
    statsData.followers = (statsData.followers || 0) + 1;
    renderReactions();
    updateStatsUI();
    showToast(`${emojiIcon} Reaction added!`);
    return true;
}

async function renderReactions() {
    const container = document.getElementById('reactionsContainer');
    if (!container) return;
    
    const reactions = await getReactions();
    const toolReacts = reactions[CONFIG.TOOL_SLUG] || {};
    
    const emojis = [
        { key: 'like', icon: '👍', label: 'Like' },
        { key: 'love', icon: '❤️', label: 'Love' },
        { key: 'wow', icon: '😮', label: 'Wow' },
        { key: 'sad', icon: '😢', label: 'Sad' },
        { key: 'angry', icon: '😠', label: 'Angry' },
        { key: 'laugh', icon: '😂', label: 'Laugh' },
        { key: 'celebrate', icon: '🎉', label: 'Celebrate' }
    ];
    
    container.innerHTML = emojis.map(e => `
        <button class="reaction-btn" data-emoji="${e.key}" data-icon="${e.icon}">
            ${e.icon} <span class="react-count">${toolReacts[e.key] || 0}</span>
        </button>
    `).join('');
    
    document.querySelectorAll('#reactionsContainer .reaction-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await addReaction(btn.dataset.emoji, btn.dataset.icon);
        });
    });
}

// ============================================================
// SHARES
// ============================================================
async function recordShare(platform) {
    try {
        const result = await callAPI('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform
        });
        if (result?.success) {
            statsData.shares = result.shares || 0;
            updateStatsUI();
            return;
        }
        fallbackRecordShare(platform);
    } catch {
        fallbackRecordShare(platform);
    }
}

function fallbackRecordShare(platform) {
    const shares = getStorageData(STORAGE.SHARES, {});
    shares[CONFIG.TOOL_SLUG] = (shares[CONFIG.TOOL_SLUG] || 0) + 1;
    setStorageData(STORAGE.SHARES, shares);
    statsData.shares = shares[CONFIG.TOOL_SLUG];
    updateStatsUI();
}

// ============================================================
// DASHBOARD STATS
// ============================================================
async function loadStats() {
    try {
        const result = await callAPI(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (result?.success) {
            statsData.views = result.views || 0;
            statsData.usage = result.usage || 0;
            statsData.shares = result.shares || 0;
            statsData.followers = result.followers || 0;
            updateStatsUI();
            updateUsageUI();
            return;
        }
        fallbackLoadStats();
    } catch {
        fallbackLoadStats();
    }
}

function fallbackLoadStats() {
    const usage = getStorageData(STORAGE.USAGE, {});
    const views = getStorageData(STORAGE.VIEWS, {});
    const shares = getStorageData(STORAGE.SHARES, {});
    const reactions = getStorageData(STORAGE.REACTIONS, {});
    const toolReacts = reactions[CONFIG.TOOL_SLUG] || {};
    const totalReactions = Object.values(toolReacts).reduce((a, b) => a + b, 0);
    
    statsData.usage = usage[CONFIG.TOOL_SLUG] || 0;
    statsData.views = views[CONFIG.TOOL_SLUG] || 0;
    statsData.shares = shares[CONFIG.TOOL_SLUG] || 0;
    statsData.followers = totalReactions || 0;
    updateStatsUI();
    updateUsageUI();
}

function updateStatsUI() {
    document.getElementById('statViews').textContent = statsData.views || 0;
    document.getElementById('statUsage').textContent = statsData.usage || 0;
    document.getElementById('statShares').textContent = statsData.shares || 0;
    document.getElementById('statFollowers').textContent = statsData.followers || 0;
    
    const heroTimetables = document.getElementById('heroTimetablesStat');
    const heroReactions = document.getElementById('heroReactionsStat');
    if (heroTimetables) heroTimetables.textContent = statsData.usage || 0;
    if (heroReactions) heroReactions.textContent = statsData.followers || 0;
}

// ============================================================
// SOCIAL SHARING
// ============================================================
function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=Check%20out%20this%20ECCE%20Timetable%20Generator!`;
    else if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}`;
    else if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=Check%20out%20this%20ECCE%20Timetable%20Generator!%20${url}`;
    else if (platform === 'email') shareUrl = `mailto:?subject=ECCE Timetable Tool&body=Check this amazing timetable generator: ${url}`;
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        recordShare(platform);
        showToast(`📤 Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
    }
}

function renderSocialIcons() {
    const container = document.getElementById('socialShareContainer');
    if (!container) return;
    container.innerHTML = `
        <i class="fab fa-facebook social-icon" data-social="facebook" title="Facebook"></i>
        <i class="fab fa-twitter social-icon" data-social="twitter" title="Twitter"></i>
        <i class="fab fa-linkedin social-icon" data-social="linkedin" title="LinkedIn"></i>
        <i class="fab fa-whatsapp social-icon" data-social="whatsapp" title="WhatsApp"></i>
        <i class="fas fa-envelope social-icon" data-social="email" title="Email"></i>
        <i class="fas fa-link social-icon" data-social="copy" title="Copy Link"></i>
    `;
    document.querySelectorAll('#socialShareContainer .social-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const platform = icon.dataset.social;
            if (platform === 'copy') {
                navigator.clipboard.writeText(window.location.href);
                showToast('🔗 Link copied to clipboard!');
                recordShare('copy');
                return;
            }
            shareTool(platform);
        });
    });
}

// ============================================================
// EXPOSE TO GLOBAL SCOPE
// ============================================================
window.ECCE = {
    CONFIG,
    statsData,
    showToast,
    initTypewriter,
    incrementUsage,
    incrementViews,
    addReaction,
    renderReactions,
    recordShare,
    loadStats,
    updateStatsUI,
    updateUsageUI
};

console.log('🚀 ECCE Time Table Generator loaded');
console.log('📊 Tool Slug:', CONFIG.TOOL_SLUG);
console.log('🌐 API Base:', CONFIG.API_BASE);
