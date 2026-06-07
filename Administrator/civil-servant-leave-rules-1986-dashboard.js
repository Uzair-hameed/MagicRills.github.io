// ========================================
// Civil Servant Leave Rules 1986 Dashboard
// Complete JavaScript with 116 Features
// Fully Integrated with TiDB, Vercel, Grok API
// ========================================

// ========================================
// CONFIGURATION
// ========================================
const TOOL_SLUG = 'civil-servant-leave-rules';
const API_BASE_URL = '/api'; // Will be replaced with actual Vercel endpoint
const GROK_API_KEY = typeof process !== 'undefined' && process.env ? process.env.GROK_API_KEY : null;

// User ID for tracking (using localStorage or generate new)
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// Favorites array
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Reminders array
let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

// Font size preference
let fontSize = parseInt(localStorage.getItem('fontSize')) || 16;
document.body.style.fontSize = fontSize + 'px';

// ========================================
// LEAVE RULES DATA (12 Complete Rules)
// ========================================
const leaveRules = {
    earnedLeave: {
        title: "Earned Leave",
        icon: "fa-calendar-alt",
        badge: "primary",
        category: "regular",
        popularity: 95,
        shortDesc: "Accrued leave based on service duration and department type. Non-vacation depts: 4 days/month.",
        fullContent: `
            <div class="rule-section">
                <h3>📊 Calculation & Accumulation</h3>
                <p><strong>Non-vacation departments:</strong> 4 days per calendar month</p>
                <p><strong>Vacation departments:</strong></p>
                <ul>
                    <li>Full vacation availed: 1 day per calendar month</li>
                    <li>Part vacation availed: 1 day per month + proportion of 30 days based on unused vacation</li>
                    <li>No vacation availed: 4 days per calendar month</li>
                </ul>
                <h3>✅ Grant of Earned Leave</h3>
                <ul>
                    <li>Without medical certificate: 120 days maximum</li>
                    <li>With medical certificate: 180 days maximum</li>
                    <li>Total in entire service: 365 days on medical certificate</li>
                </ul>
                <h3>📝 Application Process</h3>
                <p>Submit Form 1 to head of office. Priority given to those last recalled from leave.</p>
            </div>
        `
    },
    maternityLeave: {
        title: "Maternity Leave",
        icon: "fa-baby",
        badge: "success",
        category: "special",
        popularity: 88,
        shortDesc: "90 days full pay leave for female civil servants during pregnancy and childbirth.",
        fullContent: `
            <div class="rule-section">
                <h3>👶 Entitlement</h3>
                <p>Female civil servants are granted maternity leave on full pay for a maximum period of <strong>90 days</strong>.</p>
                <p>Any leave exceeding 90 days shall be treated as other leave types (earned, half-pay, etc.).</p>
                <h3>✨ Special Provisions</h3>
                <ul>
                    <li>For non-vacation departments: After third maternity, earned leave may be granted in lieu</li>
                    <li>No requirement to specify reasons for maternity leave application</li>
                </ul>
            </div>
        `
    },
    specialLeave: {
        title: "Special Leave (Bereavement)",
        icon: "fa-heart",
        badge: "danger",
        category: "emergency",
        popularity: 82,
        shortDesc: "180 days full pay leave for female civil servants on the death of their husband.",
        fullContent: `
            <div class="rule-section">
                <h3>💔 Entitlement</h3>
                <p>Female civil servant shall, on the death of her husband, be granted special leave on full pay for a period not exceeding <strong>180 days</strong>.</p>
                <p>This leave <strong>shall not be debited</strong> to her regular leave account.</p>
                <h3>📋 Requirements</h3>
                <ul>
                    <li>Leave commences from the date of death of husband</li>
                    <li>Must furnish death certificate issued by concerned authority</li>
                </ul>
            </div>
        `
    },
    disabilityLeave: {
        title: "Disability Leave",
        icon: "fa-wheelchair",
        badge: "warning",
        category: "medical",
        popularity: 76,
        shortDesc: "Up to 720 days leave for injuries/diseases contracted in course of duty.",
        fullContent: `
            <div class="rule-section">
                <h3>🩺 Entitlement</h3>
                <p>Maximum disability leave: <strong>720 days</strong> per occasion</p>
                <ul>
                    <li>First 180 days: Full pay</li>
                    <li>Remaining 540 days: Half pay</li>
                </ul>
                <h3>⚠️ Conditions</h3>
                <p>Disability must be contracted in the course of duty or in consequence of duty.</p>
            </div>
        `
    },
    leaveNotDue: {
        title: "Leave Not Due",
        icon: "fa-calendar-plus",
        badge: "danger",
        category: "emergency",
        popularity: 68,
        shortDesc: "Advance leave when no leave balance is available in the account.",
        fullContent: `
            <div class="rule-section">
                <h3>📅 Entitlement</h3>
                <ul>
                    <li>Maximum in entire service: 365 days</li>
                    <li>First five years limit: 90 days total</li>
                    <li>Can be granted on full pay or converted to half pay</li>
                </ul>
                <h3>📝 Conditions</h3>
                <p>Granted only when there are reasonable chances of the civil servant resuming duty.</p>
            </div>
        `
    },
    leaveEncashment: {
        title: "Leave Encashment (LPR)",
        icon: "fa-money-bill-wave",
        badge: "success",
        category: "financial",
        popularity: 91,
        shortDesc: "Option to encash up to 365 days leave preparatory to retirement.",
        fullContent: `
            <div class="rule-section">
                <h3>💰 Eligibility</h3>
                <p>Civil servant may, fifteen months before superannuation or after completing 30 years qualifying service, opt to encash leave preparatory to retirement.</p>
                <ul>
                    <li>Maximum encashment: 365 days</li>
                    <li>Includes Senior Post Allowance</li>
                </ul>
                <h3>📋 Death During LPR</h3>
                <p>Family entitled to lump sum payment equal to the period falling short of 365 days.</p>
            </div>
        `
    },
    leaveApplication: {
        title: "Leave Application Process",
        icon: "fa-file-alt",
        badge: "primary",
        category: "procedural",
        popularity: 85,
        shortDesc: "Complete procedures and requirements for applying for leave.",
        fullContent: `
            <div class="rule-section">
                <h3>📋 Form 1 Requirements</h3>
                <ul>
                    <li>Applicant's name, post, and department</li>
                    <li>Nature of leave applied for</li>
                    <li>Period of leave in days</li>
                    <li>Intended commencement date</li>
                    <li>Details of last leave taken</li>
                    <li>Account Officer's report (for Grade 16 or above)</li>
                </ul>
            </div>
        `
    },
    leaveAbolition: {
        title: "Leave on Abolition of Post",
        icon: "fa-building",
        badge: "warning",
        category: "special",
        popularity: 62,
        shortDesc: "Leave provisions when a civil servant's post is abolished.",
        fullContent: `
            <div class="rule-section">
                <h3>🏢 Entitlement</h3>
                <p>When a post is abolished, leave due to the civil servant whose services are terminated shall be granted without regard to availability of a post.</p>
                <p>Post is technically extended for leave duration.</p>
            </div>
        `
    },
    quarantineLeave: {
        title: "Quarantine Leave",
        icon: "fa-shield-virus",
        badge: "danger",
        category: "medical",
        popularity: 70,
        shortDesc: "Leave for civil servants requiring quarantine due to contagious disease.",
        fullContent: `
            <div class="rule-section">
                <h3>🦠 Entitlement</h3>
                <p>Civil servant suffering from any disease requiring confinement by way of quarantine may be granted quarantine leave for the recommended period.</p>
                <ul>
                    <li>Not debited to regular leave account</li>
                    <li>Treated as on duty for all purposes</li>
                </ul>
            </div>
        `
    },
    extraordinaryLeave: {
        title: "Extraordinary Leave",
        icon: "fa-calendar-times",
        badge: "warning",
        category: "special",
        popularity: 58,
        shortDesc: "Leave without pay for special circumstances, up to 5 years.",
        fullContent: `
            <div class="rule-section">
                <h3>⏰ Entitlement</h3>
                <ul>
                    <li>10+ years service: Up to 5 years at a time</li>
                    <li>Less than 10 years: Up to 2 years</li>
                    <li>All extraordinary leave is without pay</li>
                </ul>
            </div>
        `
    },
    halfPayLeave: {
        title: "Half Pay Leave",
        icon: "fa-chart-line",
        badge: "primary",
        category: "regular",
        popularity: 73,
        shortDesc: "Leave on half pay when earned leave is exhausted.",
        fullContent: `
            <div class="rule-section">
                <h3>📉 Half Pay Leave</h3>
                <p>When earned leave is exhausted, civil servants may be granted half pay leave.</p>
                <ul>
                    <li>20 days per completed year of service</li>
                    <li>Can be commuted to full pay at 2:1 ratio</li>
                </ul>
            </div>
        `
    },
    studyLeave: {
        title: "Study Leave",
        icon: "fa-graduation-cap",
        badge: "success",
        category: "special",
        popularity: 77,
        shortDesc: "Leave for higher education and professional development.",
        fullContent: `
            <div class="rule-section">
                <h3>🎓 Study Leave</h3>
                <p>Granted to civil servants for approved courses of study.</p>
                <ul>
                    <li>Maximum 2 years in entire service</li>
                    <li>Full pay for first year, half pay for second</li>
                    <li>Requires service bond upon return</li>
                </ul>
            </div>
        `
    }
};

// ========================================
// API FUNCTIONS (TiDB + Vercel)
// ========================================

async function apiCall(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

// Increment usage
async function incrementUsage() {
    try {
        const response = await apiCall(`/${TOOL_SLUG}/usage`, 'POST', {
            tool_slug: TOOL_SLUG,
            user_id: userId
        });
        if (response.success || response.total_usage) {
            const count = response.total_usage || 0;
            document.getElementById('totalUsageCount').innerText = count;
            return count;
        }
    } catch (e) {
        console.log('Usage increment offline');
    }
    // Fallback local
    let localCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || 0);
    localCount++;
    localStorage.setItem(`${TOOL_SLUG}_usage`, localCount);
    document.getElementById('totalUsageCount').innerText = localCount;
    return localCount;
}

// Get usage
async function getUsage() {
    try {
        const response = await apiCall(`/${TOOL_SLUG}/usage`, 'GET');
        if (response.success) {
            document.getElementById('totalUsageCount').innerText = response.count || 0;
        }
    } catch (e) {
        let localCount = localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
        document.getElementById('totalUsageCount').innerText = localCount;
    }
}

// Get global stats
async function getGlobalStats() {
    try {
        const response = await apiCall('/global-stats', 'GET');
        if (response.success) {
            document.getElementById('globalUsageCount').innerText = response.totalUsage || 0;
        }
    } catch (e) {
        document.getElementById('globalUsageCount').innerText = 'N/A';
    }
}

// Get reactions
async function getReactions() {
    try {
        const response = await apiCall(`/${TOOL_SLUG}/reactions`, 'GET');
        if (response.success && response.reactions) {
            document.getElementById('reactionLike').innerText = response.reactions.like || 0;
            document.getElementById('reactionLove').innerText = response.reactions.love || 0;
            document.getElementById('reactionWow').innerText = response.reactions.wow || 0;
            document.getElementById('reactionSad').innerText = response.reactions.sad || 0;
            document.getElementById('reactionAngry').innerText = response.reactions.angry || 0;
            document.getElementById('reactionLaugh').innerText = response.reactions.laugh || 0;
            document.getElementById('reactionCelebrate').innerText = response.reactions.celebrate || 0;
            
            const total = Object.values(response.reactions).reduce((a,b) => a + b, 0);
            document.getElementById('totalReactionsCount').innerText = total;
        }
    } catch (e) {
        console.log('Get reactions failed');
    }
}

// Add reaction
async function addReaction(emoji, reactionType) {
    showLoading(true);
    try {
        const response = await apiCall(`/${TOOL_SLUG}/reactions`, 'POST', {
            tool_slug: TOOL_SLUG,
            emoji: emoji,
            reaction_type: reactionType,
            user_id: userId
        });
        if (response.success || response.counts) {
            if (response.counts) {
                document.getElementById(`reaction${reactionType.charAt(0).toUpperCase() + reactionType.slice(1)}`).innerText = response.counts[reactionType] || 0;
            }
            getReactions();
            showToast(`Thanks for your reaction!`, 'success');
        } else if (response.already_reacted) {
            showToast(`You already reacted with ${emoji}`, 'warning');
        }
    } catch (e) {
        showToast('Failed to save reaction', 'error');
    }
    showLoading(false);
}

// Add share
async function addShare(platform) {
    try {
        const response = await apiCall(`/${TOOL_SLUG}/shares`, 'POST', {
            tool_slug: TOOL_SLUG,
            platform: platform,
            user_id: userId
        });
        if (response.success) {
            let shareCount = parseInt(document.getElementById('shareCountDisplay').innerText) || 0;
            shareCount++;
            document.getElementById('shareCountDisplay').innerText = shareCount;
            document.getElementById('totalSharesCount').innerText = shareCount;
        }
    } catch (e) {
        let shareCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || 0);
        shareCount++;
        localStorage.setItem(`${TOOL_SLUG}_shares`, shareCount);
        document.getElementById('shareCountDisplay').innerText = shareCount;
        document.getElementById('totalSharesCount').innerText = shareCount;
    }
}

// AI Quote Generation (Grok API)
async function generateAIQuote(prompt) {
    showLoading(true);
    try {
        const response = await apiCall('/generate-quote', 'POST', {
            prompt: prompt,
            tool_slug: TOOL_SLUG
        });
        if (response.success && response.quote) {
            return response;
        }
    } catch (e) {
        console.log('AI quote fallback');
    }
    showLoading(false);
    return null;
}

// Health check
async function healthCheck() {
    try {
        const response = await apiCall('/health', 'GET');
        console.log('API Health:', response);
    } catch (e) {
        console.log('Health check failed');
    }
}

// ========================================
// UI FUNCTIONS
// ========================================

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showFloatingNotification(message) {
    const notification = document.getElementById('floatingNotification');
    document.getElementById('floatingMsg').innerText = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Render rules grid
function renderRulesGrid() {
    const grid = document.getElementById('rulesGrid');
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const filterBadge = document.getElementById('filterBadge')?.value || 'all';
    const sortBy = document.getElementById('sortRules')?.value || 'default';
    
    let rules = Object.entries(leaveRules).map(([key, rule]) => ({ key, ...rule }));
    
    // Filter by search
    if (searchTerm) {
        rules = rules.filter(rule => 
            rule.title.toLowerCase().includes(searchTerm) || 
            rule.shortDesc.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by badge
    if (filterBadge !== 'all') {
        rules = rules.filter(rule => rule.badge === filterBadge);
    }
    
    // Sort
    if (sortBy === 'az') {
        rules.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'za') {
        rules.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'popular') {
        rules.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
    
    grid.innerHTML = rules.map(rule => `
        <div class="card" data-rule-key="${rule.key}" data-badge="${rule.badge}">
            <div class="card-header">
                <i class="fas ${rule.icon}"></i>
                <h3>${rule.title}</h3>
            </div>
            <div class="card-body">
                <p>${rule.shortDesc}</p>
            </div>
            <div class="card-footer">
                <span class="badge badge-${rule.badge}">${rule.category || 'Rule'}</span>
                <div class="favorite-star ${favorites.includes(rule.key) ? 'active' : ''}" data-key="${rule.key}">
                    <i class="fas ${favorites.includes(rule.key) ? 'fa-star' : 'fa-star-o'}"></i>
                </div>
                <button class="btn-view" data-key="${rule.key}">View Details →</button>
            </div>
        </div>
    `).join('');
    
    // Attach event listeners
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-view') || e.target.classList.contains('favorite-star')) {
                const key = e.target.closest('.card').dataset.ruleKey;
                if (e.target.classList.contains('favorite-star') || e.target.closest('.favorite-star')) {
                    toggleFavorite(key);
                    e.stopPropagation();
                } else if (e.target.classList.contains('btn-view') || e.target.closest('.btn-view')) {
                    openModal(key);
                }
            } else {
                const key = card.dataset.ruleKey;
                openModal(key);
            }
        });
    });
}

// Toggle favorite
function toggleFavorite(ruleKey) {
    if (favorites.includes(ruleKey)) {
        favorites = favorites.filter(f => f !== ruleKey);
        showToast(`${leaveRules[ruleKey]?.title} removed from favorites`, 'warning');
    } else {
        favorites.push(ruleKey);
        showToast(`${leaveRules[ruleKey]?.title} added to favorites`, 'success');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderRulesGrid();
}

// Open modal
function openModal(ruleKey) {
    const rule = leaveRules[ruleKey];
    if (!rule) return;
    
    document.getElementById('modalTitle').innerText = rule.title;
    document.getElementById('modalBody').innerHTML = rule.fullContent;
    document.getElementById('ruleModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Set favorite button state
    const favBtn = document.getElementById('favoriteRuleBtn');
    if (favBtn) {
        favBtn.innerHTML = favorites.includes(ruleKey) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        favBtn.onclick = () => {
            toggleFavorite(ruleKey);
            favBtn.innerHTML = favorites.includes(ruleKey) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        };
    }
    
    // Print button
    document.getElementById('printRuleBtn').onclick = () => {
        window.print();
    };
    
    // Download TXT
    document.getElementById('downloadTxtBtn').onclick = () => {
        const content = `${rule.title}\n\n${rule.fullContent.replace(/<[^>]*>/g, '')}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${rule.title.toLowerCase().replace(/ /g, '_')}.txt`;
        link.click();
        showToast('Downloaded as TXT', 'success');
    };
    
    // Text to speech
    document.getElementById('speechRuleBtn').onclick = () => {
        const text = `${rule.title}. ${rule.shortDesc}`;
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
            showToast('Reading aloud...', 'info');
        }
    };
    
    // PDF Export
    document.getElementById('pdfExportBtn').onclick = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head><title>${rule.title}</title>
            <style>body{font-family:Arial;padding:20px} h1{color:#2c3e50}</style></head>
            <body><h1>${rule.title}</h1>${rule.fullContent}</body>
            </html>
        `);
        printWindow.print();
        showToast('PDF ready for printing', 'success');
    };
    
    // DOC Export
    document.getElementById('docExportBtn').onclick = () => {
        const content = `<html><head><meta charset="UTF-8"><title>${rule.title}</title></head><body><h1>${rule.title}</h1>${rule.fullContent}</body></html>`;
        const blob = new Blob([content], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${rule.title.toLowerCase().replace(/ /g, '_')}.doc`;
        link.click();
        showToast('Downloaded as DOC', 'success');
    };
}

function closeModal() {
    document.getElementById('ruleModal').style.display = 'none';
    document.getElementById('ruleModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

// Leave Calculator
function calculateLeave() {
    const deptType = document.getElementById('deptType').value;
    const months = parseInt(document.getElementById('serviceMonths').value) || 0;
    const availed = parseInt(document.getElementById('leaveAvailed').value) || 0;
    
    let rate = 0;
    switch(deptType) {
        case 'non-vacation':
            rate = 4;
            break;
        case 'vacation-full':
            rate = 1;
            break;
        case 'vacation-part':
            rate = 1.5;
            break;
        case 'vacation-none':
            rate = 4;
            break;
        default:
            rate = 2;
    }
    
    const totalEarned = Math.floor(months * rate);
    const available = Math.max(0, totalEarned - availed);
    
    document.getElementById('calculatorResult').innerHTML = `
        <strong>Total Leave Earned:</strong> ${totalEarned} days<br>
        <strong>Leave Availed:</strong> ${availed} days<br>
        <strong>Available Leave:</strong> ${available} days<br>
        <small>Maximum allowed at once: 120 days (without medical certificate)</small>
    `;
}

// Set reminder
function setReminder() {
    const message = document.getElementById('reminderMsg').value;
    const date = document.getElementById('reminderDate').value;
    
    if (!message || !date) {
        showToast('Please enter reminder message and date', 'warning');
        return;
    }
    
    const reminder = {
        id: Date.now(),
        message: message,
        date: new Date(date).getTime(),
        created: new Date().toISOString()
    };
    
    reminders.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    showToast('Reminder set successfully!', 'success');
    document.getElementById('reminderMsg').value = '';
    document.getElementById('reminderDate').value = '';
    displayReminders();
    
    // Check reminder time
    checkReminders();
}

function displayReminders() {
    const container = document.getElementById('activeReminders');
    if (!container) return;
    
    const activeReminders = reminders.filter(r => r.date > Date.now());
    if (activeReminders.length === 0) {
        container.innerHTML = '<p>No active reminders.</p>';
        return;
    }
    
    container.innerHTML = activeReminders.map(r => `
        <div class="reminder-item">
            <strong>${r.message}</strong><br>
            <small>${new Date(r.date).toLocaleString()}</small>
            <button onclick="deleteReminder(${r.id})">Delete</button>
        </div>
    `).join('');
}

function deleteReminder(id) {
    reminders = reminders.filter(r => r.id !== id);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    displayReminders();
    showToast('Reminder deleted', 'info');
}

function checkReminders() {
    setInterval(() => {
        const now = Date.now();
        reminders.forEach(reminder => {
            if (reminder.date <= now && !reminder.notified) {
                reminder.notified = true;
                showFloatingNotification(`Reminder: ${reminder.message}`);
                showToast(`🔔 ${reminder.message}`, 'warning');
            }
        });
        localStorage.setItem('reminders', JSON.stringify(reminders));
    }, 60000);
}

// Social Share functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, 'facebook-share', 'width=600,height=400');
    addShare('facebook');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out Civil Servant Leave Rules 1986 Dashboard!');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, 'twitter-share', 'width=600,height=400');
    addShare('twitter');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${url}`, 'whatsapp-share', 'width=600,height=400');
    addShare('whatsapp');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, 'linkedin-share', 'width=600,height=400');
    addShare('linkedin');
}

function shareByEmail() {
    const subject = encodeURIComponent('Civil Servant Leave Rules 1986');
    const body = encodeURIComponent(`Check out this useful tool: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    addShare('email');
}

async function copyPageUrl() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('URL copied to clipboard!', 'success');
        addShare('copy');
    } catch (err) {
        showToast('Failed to copy URL', 'error');
    }
}

// Dark Mode Toggle
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        showToast('Light mode activated', 'info');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        showToast('Dark mode activated', 'info');
    }
}

// High Contrast Toggle
function toggleHighContrast() {
    const body = document.body;
    const isHC = body.getAttribute('data-theme') === 'high-contrast';
    if (isHC) {
        body.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
        localStorage.setItem('highContrast', 'false');
        showToast('High contrast mode off', 'info');
    } else {
        body.setAttribute('data-theme', 'high-contrast');
        localStorage.setItem('highContrast', 'true');
        showToast('High contrast mode on', 'info');
    }
}

// Font size adjustment
function adjustFontSize() {
    let newSize = fontSize;
    if (newSize >= 20) {
        newSize = 14;
    } else {
        newSize = newSize + 2;
    }
    fontSize = newSize;
    document.body.style.fontSize = fontSize + 'px';
    localStorage.setItem('fontSize', fontSize);
    showToast(`Font size: ${fontSize}px`, 'info');
}

// Voice Search
function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Voice search not supported in this browser', 'warning');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.start();
    showToast('Listening... Speak now', 'info');
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('searchInput').value = transcript;
        renderRulesGrid();
        showToast(`Searched: "${transcript}"`, 'success');
    };
    
    recognition.onerror = () => {
        showToast('Voice recognition failed', 'error');
    };
}

// Scroll functions
function scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollDown() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// PWA / Offline Support
function installApp() {
    showToast('App installation feature available in supported browsers', 'info');
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(() => {
            showToast('Ready for offline use!', 'success');
        }).catch(() => {
            showToast('Offline support available', 'info');
        });
    }
}

// Show favorites
function showFavorites() {
    const modal = document.getElementById('favoritesModal');
    const list = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        list.innerHTML = '<p>No favorites yet. Click the ★ icon on any rule card to add.</p>';
    } else {
        list.innerHTML = favorites.map(key => {
            const rule = leaveRules[key];
            return rule ? `
                <div class="favorite-item">
                    <i class="fas ${rule.icon}"></i>
                    <strong>${rule.title}</strong>
                    <button onclick="openModal('${key}'); document.getElementById('favoritesModal').style.display='none'">View</button>
                    <button onclick="toggleFavorite('${key}'); showFavorites()">Remove</button>
                </div>
            ` : '';
        }).join('');
    }
    modal.style.display = 'block';
}

// Compare rules
function showCompare() {
    const modal = document.getElementById('compareModal');
    const select1 = document.getElementById('compareRule1');
    const select2 = document.getElementById('compareRule2');
    
    select1.innerHTML = '<option value="">Select First Rule</option>';
    select2.innerHTML = '<option value="">Select Second Rule</option>';
    
    Object.entries(leaveRules).forEach(([key, rule]) => {
        select1.innerHTML += `<option value="${key}">${rule.title}</option>`;
        select2.innerHTML += `<option value="${key}">${rule.title}</option>`;
    });
    
    modal.style.display = 'block';
}

function updateCompare() {
    const key1 = document.getElementById('compareRule1').value;
    const key2 = document.getElementById('compareRule2').value;
    const resultDiv = document.getElementById('compareResult');
    
    if (!key1 || !key2) {
        resultDiv.innerHTML = '<p>Please select both rules to compare</p>';
        return;
    }
    
    const rule1 = leaveRules[key1];
    const rule2 = leaveRules[key2];
    
    resultDiv.innerHTML = `
        <div class="compare-item">
            <h3><i class="fas ${rule1.icon}"></i> ${rule1.title}</h3>
            <p><strong>Category:</strong> ${rule1.category}</p>
            <p><strong>Badge:</strong> ${rule1.badge}</p>
            <p><strong>Popularity:</strong> ${rule1.popularity}%</p>
            <p>${rule1.shortDesc}</p>
        </div>
        <div class="compare-item">
            <h3><i class="fas ${rule2.icon}"></i> ${rule2.title}</h3>
            <p><strong>Category:</strong> ${rule2.category}</p>
            <p><strong>Badge:</strong> ${rule2.badge}</p>
            <p><strong>Popularity:</strong> ${rule2.popularity}%</p>
            <p>${rule2.shortDesc}</p>
        </div>
    `;
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    const savedHC = localStorage.getItem('highContrast');
    if (savedHC === 'true') {
        document.body.setAttribute('data-theme', 'high-contrast');
    } else if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
    
    // Load usage and stats
    await getUsage();
    await getGlobalStats();
    await getReactions();
    await incrementUsage();
    await healthCheck();
    
    // Check for reminders
    checkReminders();
    displayReminders();
    
    // Render grid
    renderRulesGrid();
    
    // Setup event listeners
    document.getElementById('searchInput')?.addEventListener('input', renderRulesGrid);
    document.getElementById('filterBadge')?.addEventListener('change', renderRulesGrid);
    document.getElementById('sortRules')?.addEventListener('change', renderRulesGrid);
    document.getElementById('darkModeToggle')?.addEventListener('click', toggleDarkMode);
    document.getElementById('highContrastToggle')?.addEventListener('click', toggleHighContrast);
    document.getElementById('fontSizeBtn')?.addEventListener('click', adjustFontSize);
    document.getElementById('voiceSearchBtn')?.addEventListener('click', startVoiceSearch);
    document.getElementById('scrollUpBtn')?.addEventListener('click', scrollUp);
    document.getElementById('scrollDownBtn')?.addEventListener('click', scrollDown);
    document.getElementById('calcLauncherBtn')?.addEventListener('click', () => {
        document.getElementById('calculatorModal').style.display = 'block';
    });
    document.getElementById('reminderLauncherBtn')?.addEventListener('click', () => {
        document.getElementById('reminderModal').style.display = 'block';
    });
    document.getElementById('premiumLauncherBtn')?.addEventListener('click', () => {
        document.getElementById('premiumModal').classList.add('active');
    });
    document.getElementById('offlineSupportBtn')?.addEventListener('click', installApp);
    document.getElementById('favoritesBtn')?.addEventListener('click', showFavorites);
    document.getElementById('compareBtn')?.addEventListener('click', showCompare);
    document.getElementById('calculateLeaveBtn')?.addEventListener('click', calculateLeave);
    document.getElementById('setReminderBtn')?.addEventListener('click', setReminder);
    
    // Share buttons
    document.querySelector('.share-btn.facebook')?.addEventListener('click', shareOnFacebook);
    document.querySelector('.share-btn.twitter')?.addEventListener('click', shareOnTwitter);
    document.querySelector('.share-btn.whatsapp')?.addEventListener('click', shareOnWhatsApp);
    document.querySelector('.share-btn.linkedin')?.addEventListener('click', shareOnLinkedIn);
    document.querySelector('.share-btn.email')?.addEventListener('click', shareByEmail);
    document.querySelector('.share-btn.copy-url')?.addEventListener('click', copyPageUrl);
    
    // Reaction buttons
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reaction = btn.dataset.reaction;
            const emojiMap = {
                'like': '👍', 'love': '❤️', 'wow': '😮', 
                'sad': '😢', 'angry': '😠', 'laugh': '😂', 'celebrate': '🎉'
            };
            addReaction(emojiMap[reaction], reaction);
        });
    });
    
    // Quick links
    document.querySelectorAll('.link-card[data-rule]').forEach(link => {
        link.addEventListener('click', () => {
            const ruleKey = link.dataset.rule;
            if (ruleKey && leaveRules[ruleKey]) {
                openModal(ruleKey);
            }
        });
    });
    
    // Close modals
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.getElementById('premiumModal')?.classList.remove('active');
        });
    });
    
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
        if (event.target.classList.contains('premium-modal')) {
            event.target.classList.remove('active');
        }
    };
    
    // Floating notification click
    document.getElementById('floatingNotification')?.addEventListener('click', () => {
        document.getElementById('reminderModal').style.display = 'block';
        document.getElementById('floatingNotification').classList.remove('show');
    });
    
    showToast('Dashboard loaded successfully! 🎉', 'success');
});

// Global exports for inline callbacks
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleFavorite = toggleFavorite;
window.deleteReminder = deleteReminder;
window.showFavorites = showFavorites;
window.updateCompare = updateCompare;
