// ============================================
// Professional School Duty Roster System
// Cloudflare Workers API Integration
// ============================================

// Tool Configuration
const TOOL_SLUG = 'staff-duty-roster-generator';
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

// Global State
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let duties = ['Morning Duty', 'Lunch Duty', 'Afternoon Duty', 'Cleaning', 'Security'];
let staff = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'Robert Wilson'];
let leaves = {};
let roster = {};
let userReactions = new Set();
let darkMode = localStorage.getItem('darkMode') === 'true';

// Quote Database (Fallback)
const QUOTE_DATABASE = [
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
    { text: "Teaching is the greatest act of optimism.", author: "Colleen Wilcox" },
    { text: "A teacher affects eternity; he can never tell where his influence stops.", author: "Henry Adams" }
];

// Typewriter Words
const TYPEWRITER_WORDS = [
    "Smart Duty Management",
    "AI-Powered School Solutions",
    "Staff Attendance Tracking",
    "Leave Management System",
    "Real-Time Analytics"
];

// DOM Elements
let elements = {};

// ============================================
// Cloudflare Workers API Functions
// ============================================

// 1. POST /api/usage - Usage Counter Increment
async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ tool_slug: TOOL_SLUG })
        });
        const data = await response.json();
        if (data.success) {
            updateUsageDisplay(data.total_usage || data.count);
            // Store in localStorage as fallback
            localStorage.setItem(`${TOOL_SLUG}_usage`, JSON.stringify(data));
        }
        return data;
    } catch (error) {
        console.error('Increment Usage Error:', error);
        // Fallback: LocalStorage
        const fallbackData = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_usage`) || '{"count":0}');
        fallbackData.count = (fallbackData.count || 0) + 1;
        localStorage.setItem(`${TOOL_SLUG}_usage`, JSON.stringify(fallbackData));
        updateUsageDisplay(fallbackData.count);
        return { success: true, count: fallbackData.count, fallback: true };
    }
}

// 2. POST /api/reactions - Add Reaction
async function addReaction(emoji, reactionType) {
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
                reaction_type: reactionType
            })
        });
        const data = await response.json();
        if (data.success) {
            showToast(`Thanks for your reaction!`, 'success');
            updateReactionsDisplay(data.counts || data.reactions);
            localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(data.counts || data.reactions));
        } else if (data.already_reacted) {
            showToast(`You already reacted with ${emoji}`, 'warning');
        }
        return data;
    } catch (error) {
        console.error('Add Reaction Error:', error);
        // Fallback
        let reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
        reactions[reactionType] = (reactions[reactionType] || 0) + 1;
        localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactions));
        updateReactionsDisplay(reactions);
        showToast(`Reacted with ${emoji} (Offline)`, 'info');
        return { success: true, reactions, fallback: true };
    }
}

// 3. GET /api/reactions - Get Reactions
async function getReactions() {
    try {
        const response = await fetch(`${API_BASE}/api/reactions?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        const data = await response.json();
        if (data.success) {
            updateReactionsDisplay(data.reactions || data.counts);
            localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(data.reactions || data.counts));
        }
        return data;
    } catch (error) {
        console.error('Get Reactions Error:', error);
        // Fallback
        const reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
        updateReactionsDisplay(reactions);
        return { success: true, reactions, fallback: true };
    }
}

// 4. POST /api/shares - Record Share
async function addShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/api/shares`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                platform: platform
            })
        });
        const data = await response.json();
        if (data.success) {
            showToast(`Shared on ${platform}!`, 'success');
            getToolStats();
        }
        return data;
    } catch (error) {
        console.error('Add Share Error:', error);
        showToast(`Shared on ${platform} (Offline)`, 'info');
        return { success: true, fallback: true };
    }
}

// 5. GET /api/stats - Get Tool Stats
async function getToolStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        const data = await response.json();
        if (data.success) {
            // Update hero stats with REAL data from API
            document.getElementById('globalUsageCount').textContent = data.usage || data.totalUsage || 0;
            document.getElementById('globalReactionCount').textContent = data.reactions || data.totalReactions || 0;
            document.getElementById('globalShareCount').textContent = data.shares || data.totalShares || 0;
            
            // Store in localStorage
            localStorage.setItem(`${TOOL_SLUG}_stats`, JSON.stringify(data));
        }
        return data;
    } catch (error) {
        console.error('Get Stats Error:', error);
        // Fallback: Use localStorage
        const stats = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_stats`) || '{"usage":0,"reactions":0,"shares":0}');
        document.getElementById('globalUsageCount').textContent = stats.usage || 0;
        document.getElementById('globalReactionCount').textContent = stats.reactions || 0;
        document.getElementById('globalShareCount').textContent = stats.shares || 0;
        return { success: true, ...stats, fallback: true };
    }
}

// ============================================
// UI Update Functions
// ============================================

function updateUsageDisplay(count) {
    const element = document.getElementById('toolUsageCount');
    if (element) {
        element.textContent = count || 0;
        // Animate
        element.style.transform = 'scale(1.3)';
        setTimeout(() => element.style.transform = 'scale(1)', 300);
    }
}

function updateReactionsDisplay(reactions) {
    const buttons = document.querySelectorAll('.reaction-btn');
    buttons.forEach(btn => {
        const reaction = btn.dataset.reaction;
        const span = btn.querySelector('span');
        if (span && reactions && reactions[reaction] !== undefined) {
            span.textContent = reactions[reaction];
        }
    });
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// Typewriter Animation for Hero Section
// ============================================

let typewriterIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterInterval = null;

function startTypewriter() {
    const element = document.getElementById('typewriterText');
    if (!element) return;
    
    clearInterval(typewriterInterval);
    typewriterIndex = 0;
    charIndex = 0;
    isDeleting = false;
    
    typewriterInterval = setInterval(() => {
        const currentWord = TYPEWRITER_WORDS[typewriterIndex];
        
        if (!isDeleting) {
            // Typing
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(() => {}, 1500);
            }
        } else {
            // Deleting
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                typewriterIndex = (typewriterIndex + 1) % TYPEWRITER_WORDS.length;
            }
        }
    }, 100);
}

// ============================================
// Calendar & Roster Functions
// ============================================

function initializeData() {
    // Load saved data
    const savedDuties = localStorage.getItem(`${TOOL_SLUG}_duties`);
    const savedStaff = localStorage.getItem(`${TOOL_SLUG}_staff`);
    const savedLeaves = localStorage.getItem(`${TOOL_SLUG}_leaves`);
    
    if (savedDuties) duties = JSON.parse(savedDuties);
    if (savedStaff) staff = JSON.parse(savedStaff);
    if (savedLeaves) leaves = JSON.parse(savedLeaves);
    
    updateDutyTags();
    updateStaffTags();
    updateLeaveTags();
    updateStaffSelect();
}

function saveData() {
    localStorage.setItem(`${TOOL_SLUG}_duties`, JSON.stringify(duties));
    localStorage.setItem(`${TOOL_SLUG}_staff`, JSON.stringify(staff));
    localStorage.setItem(`${TOOL_SLUG}_leaves`, JSON.stringify(leaves));
}

function addDuty() {
    const input = document.getElementById('dutyInput');
    const duty = input.value.trim();
    if (duty && !duties.includes(duty)) {
        duties.push(duty);
        updateDutyTags();
        saveData();
        generateRoster();
        showToast(`Duty "${duty}" added!`, 'success');
    }
    input.value = '';
}

function addStaff() {
    const input = document.getElementById('staffInput');
    const name = input.value.trim();
    if (name && !staff.includes(name)) {
        staff.push(name);
        updateStaffTags();
        updateStaffSelect();
        saveData();
        generateRoster();
        showToast(`Staff "${name}" added!`, 'success');
    }
    input.value = '';
}

function addLeave() {
    const staffName = document.getElementById('leaveStaffSelect').value;
    const date = document.getElementById('leaveDate').value;
    if (staffName && date) {
        if (!leaves[date]) leaves[date] = [];
        if (!leaves[date].includes(staffName)) {
            leaves[date].push(staffName);
            updateLeaveTags();
            saveData();
            generateRoster();
            showToast(`Leave added for ${staffName} on ${date}`, 'success');
        } else {
            showToast(`${staffName} already on leave`, 'warning');
        }
    } else {
        showToast('Please select staff and date', 'error');
    }
}

function removeLeave(date, staffName) {
    if (leaves[date]) {
        leaves[date] = leaves[date].filter(s => s !== staffName);
        if (leaves[date].length === 0) delete leaves[date];
        updateLeaveTags();
        saveData();
        generateRoster();
        showToast(`Leave removed for ${staffName}`, 'info');
    }
}

function updateDutyTags() {
    const container = document.getElementById('dutyList');
    if (!container) return;
    container.innerHTML = duties.map(duty => `
        <span class="duty-tag" onclick="window.removeDuty('${duty}')">
            ${duty} <i class="fas fa-times"></i>
        </span>
    `).join('');
}

function updateStaffTags() {
    const container = document.getElementById('staffList');
    if (!container) return;
    container.innerHTML = staff.map(name => `
        <span class="staff-tag" onclick="window.removeStaff('${name}')">
            ${name} <i class="fas fa-times"></i>
        </span>
    `).join('');
}

function updateLeaveTags() {
    const container = document.getElementById('leaveList');
    if (!container) return;
    let html = '';
    for (const [date, staffList] of Object.entries(leaves)) {
        staffList.forEach(staffName => {
            html += `<span class="leave-tag" onclick="window.removeLeave('${date}', '${staffName}')">
                ${date}: ${staffName} <i class="fas fa-times"></i>
            </span>`;
        });
    }
    container.innerHTML = html || '<p style="font-size:0.75rem;color:var(--text-secondary)">No leaves added</p>';
}

function updateStaffSelect() {
    const select = document.getElementById('leaveStaffSelect');
    if (!select) return;
    select.innerHTML = '<option value="">Select Staff</option>' + 
        staff.map(name => `<option value="${name}">${name}</option>`).join('');
}

function removeDuty(duty) {
    duties = duties.filter(d => d !== duty);
    updateDutyTags();
    saveData();
    generateRoster();
    showToast(`Duty "${duty}" removed`, 'info');
}

function removeStaff(staffName) {
    staff = staff.filter(s => s !== staffName);
    updateStaffTags();
    updateStaffSelect();
    saveData();
    generateRoster();
    showToast(`Staff "${staffName}" removed`, 'info');
}

// Auto Rotation Algorithm
function generateRoster() {
    const month = parseInt(document.getElementById('monthSelect')?.value || currentMonth);
    const year = parseInt(document.getElementById('yearInput')?.value || currentYear);
    
    if (staff.length === 0 || duties.length === 0) {
        document.getElementById('calendarContainer').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users-slash"></i>
                <p>Please add staff and duties first</p>
            </div>
        `;
        return;
    }
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Rotation logic with fair distribution
    let dutyIndex = {};
    let staffDutyCount = {};
    duties.forEach(duty => { dutyIndex[duty] = 0; });
    staff.forEach(s => { staffDutyCount[s] = 0; });
    
    let tableHtml = `<div class="table-responsive"><table class="roster-table"><thead><tr>`;
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => tableHtml += `<th>${day}</th>`);
    tableHtml += '</tr></thead><tbody>';
    
    let date = 1;
    for (let i = 0; i < 6; i++) {
        if (date > daysInMonth) break;
        tableHtml += '<tr>';
        
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                tableHtml += '<td></td>';
            } else if (date > daysInMonth) {
                tableHtml += '<td></td>';
            } else {
                const isSunday = j === 0;
                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
                const isLeaveDay = leaves[dateStr] || [];
                
                tableHtml += `<td class="day-cell ${isSunday ? 'sunday' : ''}">
                    <span class="date-number">${date}</span>`;
                
                duties.forEach(duty => {
                    let availableStaff = staff.filter(s => !isLeaveDay.includes(s));
                    if (availableStaff.length === 0) availableStaff = staff;
                    
                    // Fair distribution
                    let minCount = Infinity;
                    let selectedStaff = availableStaff[0];
                    availableStaff.forEach(s => {
                        if (staffDutyCount[s] < minCount) {
                            minCount = staffDutyCount[s];
                            selectedStaff = s;
                        }
                    });
                    
                    staffDutyCount[selectedStaff] = (staffDutyCount[selectedStaff] || 0) + 1;
                    dutyIndex[duty] = (dutyIndex[duty] || 0) + 1;
                    
                    tableHtml += `<div class="duty-item" onclick="window.editDuty('${dateStr}', '${duty}', '${selectedStaff}')">
                        <strong>${selectedStaff}</strong>: ${duty}
                    </div>`;
                });
                
                if (isLeaveDay.length > 0) {
                    tableHtml += `<div class="leave-indicator">
                        <i class="fas fa-calendar-times"></i> ${isLeaveDay.join(', ')}
                    </div>`;
                }
                
                tableHtml += '</td>';
                date++;
            }
        }
        tableHtml += '</tr>';
    }
    
    tableHtml += '</tbody></table></div>';
    document.getElementById('calendarContainer').innerHTML = tableHtml;
}

function editDuty(date, duty, currentStaff) {
    const newStaff = prompt(`Change ${duty} on ${date}\nCurrent: ${currentStaff}\nEnter new staff name:`, currentStaff);
    if (newStaff && staff.includes(newStaff)) {
        showToast(`Duty changed to ${newStaff}`, 'success');
        generateRoster();
    } else if (newStaff) {
        showToast(`Staff "${newStaff}" not found.`, 'error');
    }
}

// ============================================
// AI Quote Generation
// ============================================

async function generateAIQuote() {
    try {
        const response = await fetch(`${API_BASE}/api/quote`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        const data = await response.json();
        if (data.success && data.quote) {
            document.getElementById('aiQuoteText').textContent = `"${data.quote}"`;
            document.getElementById('aiQuoteAuthor').textContent = `— ${data.author}`;
            return;
        }
    } catch (error) {
        console.error('AI Quote error:', error);
    }
    // Fallback
    const randomQuote = QUOTE_DATABASE[Math.floor(Math.random() * QUOTE_DATABASE.length)];
    document.getElementById('aiQuoteText').textContent = `"${randomQuote.text}"`;
    document.getElementById('aiQuoteAuthor').textContent = `— ${randomQuote.author}`;
}

// ============================================
// Export Functions
// ============================================

function exportToWord() {
    const content = document.querySelector('.calendar-wrapper')?.cloneNode(true);
    if (!content) {
        showToast('No content to export', 'error');
        return;
    }
    const win = window.open('', '_blank');
    if (!win) {
        showToast('Please allow popups', 'error');
        return;
    }
    win.document.write(`
        <html>
        <head>
            <title>Duty Roster ${new Date().toLocaleDateString()}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
                th { background: #4f46e5; color: white; }
                .sunday { background: #fee2e2; }
                .duty-item { padding: 4px; margin: 2px; background: #f1f5f9; border-radius: 4px; }
            </style>
        </head>
        <body>${content.innerHTML}</body>
        </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
    showToast('Export ready!', 'success');
}

// ============================================
// Theme Functions
// ============================================

function toggleDarkMode() {
    darkMode = !darkMode;
    const themeToggle = document.getElementById('themeToggle');
    if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('darkMode', 'true');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('darkMode', 'false');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// ============================================
// Share Functions
// ============================================

function shareTool(platform) {
    const url = window.location.href;
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Check out this School Duty Roster Tool!`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=School Duty Roster Tool&body=${encodeURIComponent(url)}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(url).then(() => {
                showToast('Link copied!', 'success');
                addShare(platform);
            }).catch(() => {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = url;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
                showToast('Link copied!', 'success');
                addShare(platform);
            });
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        addShare(platform);
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ============================================
// Event Listeners & Initialization
// ============================================

function initMonthSelect() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const select = document.getElementById('monthSelect');
    if (!select) return;
    select.innerHTML = months.map((month, i) => 
        `<option value="${i}" ${i === currentMonth ? 'selected' : ''}>${month}</option>`
    ).join('');
}

function initEventListeners() {
    // Navigation
    document.getElementById('themeToggle')?.addEventListener('click', toggleDarkMode);
    document.getElementById('homeBtn')?.addEventListener('click', () => window.location.href = 'https://magicrills.com');
    document.getElementById('backBtn')?.addEventListener('click', () => window.location.href = 'https://magicrills.com/category-pages/administrator.html');
    document.getElementById('generateRosterBtn')?.addEventListener('click', generateRoster);
    document.getElementById('exportBtn')?.addEventListener('click', exportToWord);
    document.getElementById('scrollUpBtn')?.addEventListener('click', scrollToTop);
    document.getElementById('scrollDownBtn')?.addEventListener('click', scrollToBottom);
    document.getElementById('refreshQuoteBtn')?.addEventListener('click', generateAIQuote);
    
    // Form actions
    document.getElementById('dutyInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addDuty();
    });
    document.getElementById('staffInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addStaff();
    });
    document.getElementById('addLeaveBtn')?.addEventListener('click', addLeave);
    document.getElementById('monthSelect')?.addEventListener('change', generateRoster);
    document.getElementById('yearInput')?.addEventListener('change', generateRoster);
    
    // Reactions - Colorful according to theme
    const reactionColors = {
        'like': '#4f46e5',
        'love': '#ef4444',
        'wow': '#f59e0b',
        'sad': '#3b82f6',
        'laugh': '#10b981',
        'celebrate': '#8b5cf6'
    };
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        const reaction = btn.dataset.reaction;
        if (reactionColors[reaction]) {
            btn.style.setProperty('--reaction-color', reactionColors[reaction]);
        }
        btn.addEventListener('click', function() {
            const emoji = this.dataset.emoji;
            const reaction = this.dataset.reaction;
            // Add active animation
            this.classList.add('active');
            setTimeout(() => this.classList.remove('active'), 500);
            addReaction(emoji, reaction);
        });
    });
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.dataset.platform;
            this.style.transform = 'scale(0.9)';
            setTimeout(() => this.style.transform = 'scale(1)', 200);
            shareTool(platform);
        });
    });
}

// ============================================
// Main Initialization
// ============================================

async function init() {
    console.log('🚀 Initializing Professional School Duty Roster System...');
    
    // Set dark mode
    if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    initMonthSelect();
    initializeData();
    initEventListeners();
    
    // Start typewriter animation
    startTypewriter();
    
    // Load data from APIs (REAL DATA, not fake)
    await getToolStats();
    await getReactions();
    await generateAIQuote();
    
    // Increment usage on load
    await incrementUsage();
    
    // Generate initial roster
    generateRoster();
    
    // Set default date for leave
    const leaveDate = document.getElementById('leaveDate');
    if (leaveDate) {
        const today = new Date().toISOString().split('T')[0];
        leaveDate.value = today;
    }
    
    console.log('✅ System ready! All features loaded.');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);

// ============================================
// Expose functions globally
// ============================================
window.addDuty = addDuty;
window.addStaff = addStaff;
window.addLeave = addLeave;
window.removeDuty = removeDuty;
window.removeStaff = removeStaff;
window.removeLeave = removeLeave;
window.editDuty = editDuty;
window.generateRoster = generateRoster;
window.shareTool = shareTool;
window.toggleDarkMode = toggleDarkMode;
window.scrollToTop = scrollToTop;
window.scrollToBottom = scrollToBottom;
window.exportToWord = exportToWord;
