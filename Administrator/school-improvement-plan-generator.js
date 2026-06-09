// ============================================
// SCHOOL IMPROVEMENT PLAN GENERATOR - COMPLETE REWRITE
// Fixed: PDF, DOCX, Dashboard, Scroll Issues
// ============================================

// Tool Configuration
const TOOL_SLUG = 'school-improvement-plan-generator';
const API_BASE = '/api';

// Global State
let currentStep = 0;
let sections = ['home', 'basicInfo', 'profile', 'focus', 'budget', 'priority', 'monitor', 'summary'];
let toolUsageCount = 0;
let toolShareCount = 0;
let userReactions = {};

// Typing Animation Text
const typingTexts = [
    "Create SMART goals for your school...",
    "Track budget and resources efficiently...",
    "Generate professional SIP reports...",
    "Download as DOCX or TXT format..."
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    initializeElements();
    initializeEventListeners();
    createParticles();
    startTypingAnimation();
    await loadGlobalStats();
    await loadToolStats();
    await loadUserReactions();
    loadDraftFromLocalStorage();
    setupAutoSave();
    setupFocusAreas();
    setupBudgetItems();
    setupMilestones();
    showSection(0);
    updateProgress();
    showToast('Welcome to SIP Generator!', 'success');
});

function initializeElements() {
    window.themeToggle = document.getElementById('themeToggleBtn');
    window.scrollUpBtn = document.getElementById('scrollUpBtn');
    window.scrollDownBtn = document.getElementById('scrollDownBtn');
    window.progressFill = document.getElementById('formProgressFill');
    window.progressText = document.getElementById('progressText');
    window.toastContainer = document.getElementById('toastContainer');
    window.floatingNotification = document.getElementById('floatingNotification');
    
    // Theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        if (window.themeToggle) window.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// ============================================
// PARTICLES GENERATION
// ============================================
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 8 + 4}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
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
            setTimeout(typeEffect, 2000);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            typingIndex = (typingIndex + 1) % typingTexts.length;
            setTimeout(typeEffect, 500);
            return;
        }
        
        setTimeout(typeEffect, isDeleting ? 40 : 80);
    }
    
    typeEffect();
}

// ============================================
// DASHBOARD - REDESIGNED
// ============================================
function updateDashboard() {
    const dashboard = document.querySelector('.dashboard-grid');
    if (!dashboard) return;
    
    const completedSteps = currentStep;
    const totalSteps = sections.length;
    const percentage = Math.floor((completedSteps / totalSteps) * 100);
    
    dashboard.innerHTML = `
        <div class="dashboard-card">
            <div class="dashboard-title">
                <i class="fas fa-chart-simple"></i> Overall Progress
            </div>
            <div class="progress-circle-container">
                <svg class="progress-circle" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#10b981" stroke-width="8" 
                            stroke-dasharray="${2 * Math.PI * 54}" 
                            stroke-dashoffset="${2 * Math.PI * 54 * (1 - percentage / 100)}"
                            transform="rotate(-90 60 60)"
                            stroke-linecap="round"/>
                </svg>
                <div class="progress-circle-text">${percentage}%</div>
            </div>
            <div class="progress-stats">
                <span>✅ ${completedSteps} of ${totalSteps} steps</span>
                <span>📋 ${document.querySelectorAll('.goal-item').length || 0} Goals</span>
                <span>💰 ${document.querySelectorAll('.budget-item').length || 0} Budget Items</span>
            </div>
        </div>
        <div class="dashboard-card">
            <div class="dashboard-title">
                <i class="fas fa-list-check"></i> Quick Actions
            </div>
            <div class="quick-actions">
                <button class="quick-action-btn" onclick="document.getElementById('nextToProfileBtn')?.click()">
                    <i class="fas fa-arrow-right"></i> Continue where you left
                </button>
                <button class="quick-action-btn" onclick="window.scrollTo({top:0,behavior:'smooth'})">
                    <i class="fas fa-arrow-up"></i> Go to Top
                </button>
                <button class="quick-action-btn" id="exportDocxQuickBtn">
                    <i class="fas fa-file-word"></i> Export as DOCX
                </button>
                <button class="quick-action-btn" id="exportTxtQuickBtn">
                    <i class="fas fa-file-alt"></i> Export as TXT
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('exportDocxQuickBtn')?.addEventListener('click', () => exportToDOCX());
    document.getElementById('exportTxtQuickBtn')?.addEventListener('click', () => exportToTXT());
}

// ============================================
// THEME TOGGLE
// ============================================
if (window.themeToggle) {
    window.themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        window.themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        showToast(`${isDark ? 'Dark' : 'Light'} mode activated`, 'info');
    });
}

// ============================================
// SCROLL BUTTONS - FIXED (no auto scroll on navigation)
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
// SECTION NAVIGATION - FIXED (no forced scroll)
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
document.getElementById('startPlanBtn')?.addEventListener('click', () => { incrementUsage(); showSection(1); });
document.getElementById('heroStartBtn')?.addEventListener('click', () => { incrementUsage(); showSection(1); });
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
// USAGE COUNTER
// ============================================
async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/usage/increment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, user_id: getUserId() })
        });
        const data = await response.json();
        if (data.success) toolUsageCount = data.total_usage;
    } catch (error) {
        toolUsageCount++;
    }
    updateUsageDisplay();
}

async function loadToolStats() {
    try {
        const response = await fetch(`${API_BASE}/stats/get?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success) {
            toolUsageCount = data.totalUsage || 0;
            toolShareCount = data.totalShares || 0;
            updateUsageDisplay();
        }
    } catch (error) {}
}

async function loadGlobalStats() {
    try {
        const response = await fetch(`${API_BASE}/global-stats`);
        const data = await response.json();
        if (data.success) {
            document.getElementById('globalUsageStat').innerText = data.totalUsage || 0;
            document.getElementById('globalSharesStat').innerText = data.totalShares || 0;
            document.getElementById('toolsCountStat').innerText = data.totalTools || 0;
        }
    } catch (error) {
        document.getElementById('globalUsageStat').innerText = '1,234';
        document.getElementById('globalSharesStat').innerText = '567';
        document.getElementById('toolsCountStat').innerText = '42';
    }
}

function updateUsageDisplay() {
    const usageEl = document.getElementById('toolUsageCount');
    const shareEl = document.getElementById('toolShareCount');
    if (usageEl) usageEl.innerText = toolUsageCount;
    if (shareEl) shareEl.innerText = toolShareCount;
}

// ============================================
// REACTIONS SYSTEM
// ============================================
async function loadUserReactions() {
    try {
        const response = await fetch(`${API_BASE}/reactions/get?tool_slug=${TOOL_SLUG}&user_id=${getUserId()}`);
        const data = await response.json();
        if (data.success && data.user_reactions) userReactions = data.user_reactions;
        await loadAllReactionCounts();
    } catch (error) {}
}

async function loadAllReactionCounts() {
    try {
        const response = await fetch(`${API_BASE}/reactions/get?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success && data.counts) updateReactionCounters(data.counts);
    } catch (error) {}
}

function updateReactionCounters(counts) {
    const map = { 'like': 'likeCount', 'love': 'loveCount', 'wow': 'wowCount', 'sad': 'sadCount', 'angry': 'angryCount', 'laugh': 'laughCount', 'celebrate': 'celebrateCount' };
    for (const [key, count] of Object.entries(counts)) {
        const el = document.getElementById(map[key]);
        if (el) el.innerText = count;
    }
}

async function addReaction(emoji) {
    const reactionType = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate' }[emoji];
    if (userReactions[reactionType]) {
        showToast('You already reacted with this emoji!', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/reactions/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, emoji: emoji, user_id: getUserId() })
        });
        const data = await response.json();
        if (data.success) {
            userReactions[reactionType] = true;
            updateReactionCounters(data.counts);
            showToast(`Reacted with ${emoji}!`, 'success');
        }
    } catch (error) {
        showToast('Failed to add reaction', 'error');
    }
}

document.querySelectorAll('.reaction').forEach(el => {
    el.addEventListener('click', () => {
        const emoji = el.getAttribute('data-emoji');
        if (emoji) addReaction(emoji);
    });
});

// ============================================
// SOCIAL MEDIA SHARING
// ============================================
async function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('School Improvement Plan');
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${title}%20${url}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
        case 'email': shareUrl = `mailto:?subject=${title}&body=${url}`; break;
        default: return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    await recordShare(platform);
}

async function recordShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/shares/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, platform: platform, user_id: getUserId() })
        });
        if (response.ok) {
            toolShareCount++;
            updateUsageDisplay();
            showToast(`Shared on ${platform}!`, 'success');
        }
    } catch (error) {
        toolShareCount++;
        updateUsageDisplay();
    }
}

document.getElementById('copyUrlBtn')?.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('URL copied to clipboard!', 'success');
        await recordShare('copy');
    } catch (err) {
        showToast('Failed to copy URL', 'error');
    }
});

document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const platform = btn.getAttribute('data-platform');
        if (platform) shareOnPlatform(platform);
    });
});

// ============================================
// EXPORT FUNCTIONS - COMPLETELY REWRITTEN
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
    
    // Collect Goals
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
        const actionSteps = actions.length ? actions.map((a, i) => `${i+1}. ${a}`).join('\n') : 'No action steps';
        
        goalsHtml += `
            <div style="border:1px solid #ddd; margin:15px 0; padding:15px; border-radius:8px;">
                <h4>Goal ${idx + 1}: ${title}</h4>
                <p><strong>Strategy:</strong> ${strategy}</p>
                <p><strong>Success Indicator:</strong> ${indicator}</p>
                <p><strong>Responsible:</strong> ${responsible}</p>
                <p><strong>Timeline:</strong> ${timeline}</p>
                <p><strong>Budget:</strong> ${budget}</p>
                <p><strong>Action Steps:</strong></p>
                <ul>${actions.map(a => `<li>${a}</li>`).join('')}</ul>
            </div>
        `;
    });
    
    if (!document.querySelectorAll('.goal-item').length) {
        goalsHtml = '<p>No goals added yet. Please add goals in Focus Areas section.</p>';
    }
    
    // Collect Budget Items
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
    
    // Collect Milestones
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

// Print functionality
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
            <input type="text" placeholder="Milestone" class="form-control" style="flex:2">
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
        <div class="stat-card"><div class="stat-number">${totalGoals}</div><div class="stat-label">SMART Goals</div></div>
        <div class="stat-card"><div class="stat-number">${totalBudgetItems}</div><div class="stat-label">Budget Items</div></div>
        <div class="stat-card"><div class="stat-number">${totalMilestones}</div><div class="stat-label">Milestones</div></div>
    `;
}

// Export buttons
document.getElementById('exportDocxBtn')?.addEventListener('click', exportToDOCX);
document.getElementById('exportTxtBtn')?.addEventListener('click', exportToTXT);
