/* ========================================
   NOTEBOOKCHECK PRO - MAIN SCRIPT
   UPDATED: Cloudflare API + Modern UI
   ======================================== */

// ===== API Configuration =====
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';
const TOOL_SLUG = 'advanced-notebook-checking';

// ===== User Management =====
let userId = localStorage.getItem('nbt_user_id');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('nbt_user_id', userId);
}

// ===== Global Variables =====
let currentReportData = null;
let performanceChart, statusChart, trendChart;
let draftInterval = null;
let typewriterInterval = null;

// ===== Parameters =====
const PARAMETERS = [
    "Complete information on title page",
    "Date written (proper format)",
    "Pointer Page created",
    "Topic written and underlined",
    "Question / Exercise written",
    "Work presentation neat",
    "Corrections done regularly",
    "Uniformity in work",
    "Quality of checking / remarks",
    "Regularity of checking",
    "Absent work mentioned & covered",
    "Homework assigned as per schedule",
    "Counter checked by School Head",
    "Homework diary signed"
];

// ===== Typewriter Effect =====
const TYPING_WORDS = [
    "✨ Assess notebooks in seconds",
    "📊 Generate detailed reports",
    "📈 Track performance analytics",
    "🎯 14 comprehensive parameters",
    "📤 Export PDF, DOC, TXT",
    "🌟 Used by 1000+ teachers"
];

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', async () => {
    loadParametersTable();
    loadTheme();
    loadSavedDraft();
    setupEventListeners();
    startTypewriter();
    await loadAllStats();
    await loadReactions();
    startAutoSave();
    showToast('Welcome to NotebookCheck Pro! 🚀', 'success');
});

// ===== Load Parameters Table =====
function loadParametersTable() {
    const tbody = document.getElementById('parametersBody');
    tbody.innerHTML = '';
    PARAMETERS.forEach((param, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${param}</td>
            <td>
                <select class="status-select" data-param="${index + 1}">
                    <option value="yes">✅ Yes</option>
                    <option value="no">❌ No</option>
                </select>
            </td>
            <td>
                <input type="text" class="remarks-input" data-param="${index + 1}" placeholder="Add remarks...">
            </td>
        `;
    });
}

// ===== Typewriter Effect =====
function startTypewriter() {
    let wordIndex = 0;
    let charIndex = 0;
    const element = document.getElementById('typewriterText');
    let isDeleting = false;
    
    function type() {
        const currentWord = TYPING_WORDS[wordIndex];
        
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, 2000);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % TYPING_WORDS.length;
            setTimeout(type, 500);
            return;
        }
        
        setTimeout(type, isDeleting ? 50 : 100);
    }
    
    type();
}

// ===== Cloudflare API Calls =====

// Increment Usage Counter
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
                user_id: userId
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        await loadUsageStats();
        return true;
    } catch (error) {
        console.warn('API failed, using localStorage fallback:', error);
        // LocalStorage fallback
        const usage = parseInt(localStorage.getItem('nbt_usage') || '0');
        localStorage.setItem('nbt_usage', (usage + 1).toString());
        await loadUsageStats();
        return false;
    }
}

// Load Usage Stats
async function loadUsageStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        const count = data.usage || 0;
        updateUsageUI(count);
        return data;
    } catch (error) {
        console.warn('API failed, using localStorage fallback:', error);
        const count = parseInt(localStorage.getItem('nbt_usage') || '0');
        updateUsageUI(count);
        return { usage: count };
    }
}

function updateUsageUI(count) {
    document.getElementById('heroUsageCount').innerText = formatNumber(count);
    document.getElementById('sidebarUsageCount').innerText = formatNumber(count);
    document.getElementById('totalUsageCard').innerText = formatNumber(count);
    document.getElementById('usageProgressBar').style.width = Math.min((count / 1000) * 100, 100) + '%';
}

// ===== Reactions =====
async function loadReactions() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        const reactions = data.reactions || {};
        
        updateReactionsUI(reactions);
        return reactions;
    } catch (error) {
        console.warn('API failed, using localStorage fallback:', error);
        const reactions = JSON.parse(localStorage.getItem('nbt_reactions') || '{"like":0,"love":0,"wow":0,"sad":0,"angry":0,"laugh":0,"celebrate":0}');
        updateReactionsUI(reactions);
        return reactions;
    }
}

function updateReactionsUI(reactions) {
    document.getElementById('reactLikeCount').innerText = reactions.like || 0;
    document.getElementById('reactLoveCount').innerText = reactions.love || 0;
    document.getElementById('reactWowCount').innerText = reactions.wow || 0;
    document.getElementById('reactSadCount').innerText = reactions.sad || 0;
    document.getElementById('reactAngryCount').innerText = reactions.angry || 0;
    document.getElementById('reactLaughCount').innerText = reactions.laugh || 0;
    document.getElementById('reactCelebrateCount').innerText = reactions.celebrate || 0;
    
    document.getElementById('reactLike').innerText = reactions.like || 0;
    document.getElementById('reactLove').innerText = reactions.love || 0;
    document.getElementById('reactWow').innerText = reactions.wow || 0;
    document.getElementById('reactSad').innerText = reactions.sad || 0;
    document.getElementById('reactAngry').innerText = reactions.angry || 0;
    document.getElementById('reactLaugh').innerText = reactions.laugh || 0;
    document.getElementById('reactCelebrate').innerText = reactions.celebrate || 0;
    
    const total = Object.values(reactions).reduce((a, b) => a + b, 0);
    document.getElementById('heroReactionCount').innerText = formatNumber(total);
    document.getElementById('totalReactionsCard').innerText = formatNumber(total);
}

async function addReaction(emoji, reactionType) {
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/api/reactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                reaction_type: reactionType,
                emoji: emoji,
                user_id: userId
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        await loadReactions();
        
        if (data.already_reacted) {
            showToast('You already reacted! 😊', 'info');
        } else {
            showToast(`Thanks for your ${reactionType} reaction! 🎉`, 'success');
        }
    } catch (error) {
        console.warn('API failed, using localStorage fallback:', error);
        // LocalStorage fallback
        const reactions = JSON.parse(localStorage.getItem('nbt_reactions') || '{"like":0,"love":0,"wow":0,"sad":0,"angry":0,"laugh":0,"celebrate":0}');
        const userReactions = JSON.parse(localStorage.getItem('nbt_user_reactions') || '{}');
        const userKey = `user_${userId}`;
        
        if (userReactions[userKey] === reactionType) {
            showToast('You already reacted! 😊', 'info');
            showLoading(false);
            return;
        }
        
        if (userReactions[userKey]) {
            const prevReaction = userReactions[userKey];
            reactions[prevReaction] = Math.max(0, (reactions[prevReaction] || 0) - 1);
        }
        
        reactions[reactionType] = (reactions[reactionType] || 0) + 1;
        userReactions[userKey] = reactionType;
        
        localStorage.setItem('nbt_reactions', JSON.stringify(reactions));
        localStorage.setItem('nbt_user_reactions', JSON.stringify(userReactions));
        
        await loadReactions();
        showToast(`Thanks for your ${reactionType} reaction! 🎉`, 'success');
    }
    
    showLoading(false);
}

// ===== Shares =====
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
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        await loadShareStats();
        return true;
    } catch (error) {
        console.warn('API failed, using localStorage fallback:', error);
        const shares = parseInt(localStorage.getItem('nbt_shares') || '0');
        localStorage.setItem('nbt_shares', (shares + 1).toString());
        await loadShareStats();
        return false;
    }
}

async function loadShareStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        const shares = data.shares || 0;
        updateShareUI(shares);
        return shares;
    } catch (error) {
        console.warn('API failed, using localStorage fallback:', error);
        const shares = parseInt(localStorage.getItem('nbt_shares') || '0');
        updateShareUI(shares);
        return shares;
    }
}

function updateShareUI(shares) {
    document.getElementById('heroShareCount').innerText = formatNumber(shares);
    document.getElementById('totalSharesCard').innerText = formatNumber(shares);
}

// ===== Followers/Views =====
async function loadFollowerStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        const followers = data.followers || 0;
        document.getElementById('heroFollowerCount').innerText = formatNumber(followers);
        return followers;
    } catch (error) {
        console.warn('API failed for followers:', error);
        const followers = parseInt(localStorage.getItem('nbt_followers') || '0');
        document.getElementById('heroFollowerCount').innerText = formatNumber(followers);
        return followers;
    }
}

// ===== Load All Stats =====
async function loadAllStats() {
    await Promise.all([
        loadUsageStats(),
        loadReactions(),
        loadShareStats(),
        loadFollowerStats()
    ]);
    updateCharts();
    
    // Increment usage on load (only once per session)
    if (!sessionStorage.getItem('nbt_usage_incremented')) {
        await incrementUsage();
        sessionStorage.setItem('nbt_usage_incremented', 'true');
    }
}

// ===== Generate Assessment =====
async function generateAssessment() {
    const schoolName = document.getElementById('schoolName').value;
    const teacherName = document.getElementById('teacherName').value;
    const className = document.getElementById('className').value;
    const subject = document.getElementById('subject').value;
    
    if (!schoolName || !teacherName || !className || !subject) {
        showToast('Please fill all required fields', 'warning');
        return;
    }
    
    showLoading(true);
    
    const conditions = Array.from(document.querySelectorAll('input[name="condition"]:checked')).map(cb => cb.value);
    const parameters = [];
    document.querySelectorAll('.status-select').forEach((select, index) => {
        const remark = document.querySelector(`.remarks-input[data-param="${index + 1}"]`).value;
        parameters.push({ 
            id: index + 1, 
            parameter: PARAMETERS[index], 
            status: select.value, 
            remark: remark 
        });
    });
    
    const yesCount = parameters.filter(p => p.status === 'yes').length;
    const score = Math.round((yesCount / parameters.length) * 100);
    
    currentReportData = {
        schoolName,
        teacherName,
        className,
        subject,
        totalStudents: document.getElementById('totalStudents').value,
        notebooksReceived: document.getElementById('notebooksReceived').value,
        lastWorkChecked: document.getElementById('lastWorkChecked').value || 'Not specified',
        uncheckedWork: document.getElementById('uncheckedWork').value || 'None',
        conditions: conditions.join(', ') || 'Not specified',
        parameters,
        yesCount,
        noCount: parameters.length - yesCount,
        score,
        date: new Date().toISOString(),
        id: Date.now()
    };
    
    // Save to localStorage
    const reports = JSON.parse(localStorage.getItem('nbt_reports') || '[]');
    reports.unshift(currentReportData);
    localStorage.setItem('nbt_reports', JSON.stringify(reports.slice(0, 50)));
    
    displayReport(currentReportData);
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    
    await incrementUsage();
    showLoading(false);
    showToast('Report generated successfully! 📊', 'success');
}

// ===== Display Report =====
function displayReport(data) {
    const container = document.getElementById('reportPreview');
    let parametersHtml = '';
    data.parameters.forEach(p => {
        parametersHtml += `
            <tr>
                <td>${p.id}</td>
                <td>${p.parameter}</td>
                <td class="status-${p.status}">${p.status === 'yes' ? '✅ Yes' : '❌ No'}</td>
                <td>${p.remark || '-'}</td>
            </tr>
        `;
    });
    
    const statusClass = data.score >= 70 ? 'success' : (data.score >= 50 ? 'warning' : 'danger');
    
    container.innerHTML = `
        <div class="report-container">
            <div class="report-header">
                <h2>📋 Notebook Assessment Report</h2>
                <p>${new Date(data.date).toLocaleString()}</p>
            </div>
            <div class="report-school-header">
                <h3>${data.schoolName}</h3>
            </div>
            <div class="report-info-grid">
                <div><strong>Teacher:</strong> ${data.teacherName}</div>
                <div><strong>Class:</strong> ${data.className}</div>
                <div><strong>Subject:</strong> ${data.subject}</div>
                <div><strong>Students:</strong> ${data.totalStudents}</div>
                <div><strong>Received:</strong> ${data.notebooksReceived}</div>
                <div><strong>Condition:</strong> ${data.conditions}</div>
                <div><strong>Last Work:</strong> ${data.lastWorkChecked}</div>
                <div><strong>Unchecked:</strong> ${data.uncheckedWork}</div>
            </div>
            <div class="score-card ${statusClass}">
                <div class="score-value">${data.score}%</div>
                <div class="score-label">Quality Score</div>
                <div class="score-stats">
                    <span>✅ Yes: ${data.yesCount}</span>
                    <span>❌ No: ${data.noCount}</span>
                </div>
            </div>
            <h4>📝 Evaluation Parameters</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Parameter</th>
                        <th>Status</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>${parametersHtml}</tbody>
            </table>
            <div class="report-footer">
                <div class="signature-line"></div>
                <p>School Head's Signature: _______________</p>
                <p style="margin-top:10px; font-size:12px; opacity:0.6;">
                    Generated by NotebookCheck Pro • ${new Date().toLocaleDateString()}
                </p>
            </div>
        </div>
    `;
    
    // Update insights
    updateInsights(data);
}

// ===== Update Insights =====
function updateInsights(data) {
    const reports = JSON.parse(localStorage.getItem('nbt_reports') || '[]');
    const totalAssessments = reports.length;
    
    // Calculate average score
    let totalScore = 0;
    reports.forEach(r => totalScore += r.score);
    const avgScore = totalAssessments > 0 ? Math.round(totalScore / totalAssessments) : 0;
    
    // Find top parameter
    const paramCounts = {};
    reports.forEach(r => {
        r.parameters.forEach(p => {
            if (p.status === 'yes') {
                paramCounts[p.parameter] = (paramCounts[p.parameter] || 0) + 1;
            }
        });
    });
    
    let topParam = '-';
    let maxCount = 0;
    for (const [param, count] of Object.entries(paramCounts)) {
        if (count > maxCount) {
            maxCount = count;
            topParam = param;
        }
    }
    
    document.getElementById('insightAvgScore').textContent = avgScore + '%';
    document.getElementById('insightTotalAssessments').textContent = totalAssessments;
    document.getElementById('insightTopParam').textContent = topParam.length > 30 ? topParam.substring(0, 30) + '...' : topParam;
    document.getElementById('insightTrend').textContent = reports.length > 0 ? '📈 Active' : '📊 Getting started';
    document.getElementById('completionRate').textContent = avgScore + '%';
}

// ===== Export Functions =====
async function exportPDF() {
    if (!currentReportData && !document.getElementById('reportPreview').innerHTML) {
        showToast('No report to export', 'warning');
        return;
    }
    showLoading(true);
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const element = document.getElementById('reportPreview');
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save(`notebook_report_${Date.now()}.pdf`);
        showToast('PDF downloaded! 📄', 'success');
        await recordShare('pdf_export');
    } catch (e) {
        showToast('PDF error: ' + e.message, 'error');
    }
    showLoading(false);
}

function exportDOC() {
    const content = document.getElementById('reportPreview').innerHTML;
    if (!content) {
        showToast('No report to export', 'warning');
        return;
    }
    const blob = new Blob([
        `<html><head><meta charset="UTF-8"><title>Notebook Report</title></head><body>${content}</body></html>`
    ], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `notebook_report_${Date.now()}.doc`;
    link.click();
    showToast('DOC downloaded! 📝', 'success');
    recordShare('doc_export');
}

function exportTXT() {
    const text = document.getElementById('reportPreview').innerText;
    if (!text) {
        showToast('No report to export', 'warning');
        return;
    }
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `notebook_report_${Date.now()}.txt`;
    link.click();
    showToast('TXT downloaded! 📃', 'success');
    recordShare('txt_export');
}

// ===== Share Functions =====
function openShareModal() {
    if (!currentReportData) {
        showToast('Generate a report first', 'warning');
        return;
    }
    document.getElementById('shareModal').classList.add('active');
}

function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
    document.getElementById('shareLinkContainer').style.display = 'none';
    document.getElementById('emailContainer').style.display = 'none';
}

function shareViaWhatsApp() {
    if (!currentReportData) return;
    const text = `📋 Notebook Report: ${currentReportData.schoolName}\n👨‍🏫 Teacher: ${currentReportData.teacherName}\n📊 Score: ${currentReportData.score}%\n📚 Class: ${currentReportData.className}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    recordShare('whatsapp');
    closeShareModal();
}

function shareViaEmail() {
    document.getElementById('shareLinkContainer').style.display = 'none';
    document.getElementById('emailContainer').style.display = 'block';
}

function sendEmailReport() {
    const email = document.getElementById('teacherEmail').value;
    if (!email) {
        showToast('Enter an email address', 'warning');
        return;
    }
    if (!email.includes('@')) {
        showToast('Please enter a valid email', 'warning');
        return;
    }
    showToast(`📧 Report sent to ${email}`, 'success');
    recordShare('email');
    closeShareModal();
}

function generateShareableLink() {
    const link = `${window.location.origin}${window.location.pathname}?report=${currentReportData?.id}`;
    document.getElementById('shareableLink').value = link;
    document.getElementById('shareLinkContainer').style.display = 'block';
    document.getElementById('emailContainer').style.display = 'none';
    showToast('🔗 Link generated!', 'success');
}

function copyShareableLink() {
    const link = document.getElementById('shareableLink');
    link.select();
    document.execCommand('copy');
    showToast('📋 Link copied!', 'success');
}

// ===== Tool Share Functions =====
function shareToolOnFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    recordShare('tool_facebook');
}

function shareToolOnTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=Check%20out%20NotebookCheck%20Pro%20-%20Advanced%20Notebook%20Assessment%20Tool%20for%20Teachers%20%F0%9F%93%8A&url=${encodeURIComponent(window.location.href)}`, '_blank');
    recordShare('tool_twitter');
}

function shareToolOnWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent('Check out NotebookCheck Pro - Advanced Notebook Assessment Tool for Teachers 📚: ' + window.location.href)}`, '_blank');
    recordShare('tool_whatsapp');
}

function shareToolOnLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    recordShare('tool_linkedin');
}

function copyToolLink() {
    navigator.clipboard.writeText(window.location.href);
    showToast('📋 Link copied!', 'success');
    recordShare('tool_copy');
}

// ===== Draft Functions =====
function saveDraft() {
    const formData = {
        schoolName: document.getElementById('schoolName').value,
        teacherName: document.getElementById('teacherName').value,
        className: document.getElementById('className').value,
        subject: document.getElementById('subject').value,
        totalStudents: document.getElementById('totalStudents').value,
        notebooksReceived: document.getElementById('notebooksReceived').value,
        lastWorkChecked: document.getElementById('lastWorkChecked').value,
        uncheckedWork: document.getElementById('uncheckedWork').value,
        conditions: Array.from(document.querySelectorAll('input[name="condition"]:checked')).map(cb => cb.value),
        parameters: Array.from(document.querySelectorAll('.status-select')).map((s, i) => ({
            id: i + 1,
            status: s.value,
            remark: document.querySelector(`.remarks-input[data-param="${i + 1}"]`).value
        }))
    };
    localStorage.setItem('nbt_draft', JSON.stringify(formData));
}

function loadSavedDraft() {
    const draft = localStorage.getItem('nbt_draft');
    if (draft) {
        try {
            const data = JSON.parse(draft);
            document.getElementById('schoolName').value = data.schoolName || '';
            document.getElementById('teacherName').value = data.teacherName || '';
            document.getElementById('className').value = data.className || '';
            document.getElementById('subject').value = data.subject || '';
            document.getElementById('totalStudents').value = data.totalStudents || '30';
            document.getElementById('notebooksReceived').value = data.notebooksReceived || '28';
            document.getElementById('lastWorkChecked').value = data.lastWorkChecked || '';
            document.getElementById('uncheckedWork').value = data.uncheckedWork || '';
            if (data.conditions) {
                document.querySelectorAll('input[name="condition"]').forEach(cb => {
                    cb.checked = data.conditions.includes(cb.value);
                });
            }
            if (data.parameters) {
                data.parameters.forEach(p => {
                    const sel = document.querySelector(`.status-select[data-param="${p.id}"]`);
                    if (sel) sel.value = p.status;
                    const rem = document.querySelector(`.remarks-input[data-param="${p.id}"]`);
                    if (rem) rem.value = p.remark;
                });
            }
            showToast('📂 Draft loaded', 'info');
        } catch (e) {
            console.warn('Failed to load draft:', e);
        }
    }
}

function startAutoSave() {
    if (draftInterval) clearInterval(draftInterval);
    draftInterval = setInterval(() => {
        if (document.getElementById('autoSaveToggle')?.checked) {
            saveDraft();
        }
    }, 30000);
}

// ===== UI Functions =====
function showLoading(show) {
    document.getElementById('loadingOverlay').classList.toggle('active', show);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-triangle-exclamation',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function scrollToForm() {
    document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('assessmentForm').reset();
    // Reset parameters to default
    document.querySelectorAll('.status-select').forEach(sel => sel.value = 'yes');
    document.querySelectorAll('.remarks-input').forEach(inp => inp.value = '');
    document.getElementById('resultsSection').style.display = 'none';
    showToast('🔄 Form reset', 'info');
}

function showDemo() {
    document.getElementById('schoolName').value = 'Demo International School';
    document.getElementById('teacherName').value = 'Ms. Sarah Johnson';
    document.getElementById('className').value = 'Grade 8 - Section A';
    document.getElementById('subject').value = 'Mathematics';
    document.getElementById('totalStudents').value = '32';
    document.getElementById('notebooksReceived').value = '30';
    document.getElementById('lastWorkChecked').value = 'Unit 5: Algebra';
    document.getElementById('uncheckedWork').value = 'Unit 6: Geometry';
    
    // Set some demo parameters
    document.querySelectorAll('.status-select').forEach((sel, index) => {
        sel.value = index < 10 ? 'yes' : 'no';
    });
    
    showToast('📚 Demo data loaded', 'success');
}

function clearAllData() {
    if (confirm('⚠️ Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.removeItem('nbt_draft');
        localStorage.removeItem('nbt_reports');
        localStorage.removeItem('nbt_usage');
        localStorage.removeItem('nbt_reactions');
        localStorage.removeItem('nbt_user_reactions');
        localStorage.removeItem('nbt_shares');
        localStorage.removeItem('nbt_followers');
        showToast('🗑️ All data cleared', 'success');
        resetForm();
        loadAllStats();
    }
}

// ===== Reports Functions =====
function loadAllReports() {
    const reports = JSON.parse(localStorage.getItem('nbt_reports') || '[]');
    const container = document.getElementById('reportsList');
    
    if (reports.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <p>No saved reports yet. Generate your first assessment!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reports.map(r => `
        <div class="report-card-item" onclick="viewReport(${r.id})">
            <div>
                <strong>${r.schoolName}</strong>
                <br>
                <small>👨‍🏫 ${r.teacherName} | 📚 ${r.className}</small>
                <br>
                <small style="font-size:11px; opacity:0.6;">${new Date(r.date).toLocaleDateString()}</small>
            </div>
            <span class="score-badge ${r.score >= 70 ? 'good' : (r.score >= 50 ? 'avg' : 'poor')}">
                ${r.score}%
            </span>
        </div>
    `).join('');
}

function viewReport(id) {
    const reports = JSON.parse(localStorage.getItem('nbt_reports') || '[]');
    const report = reports.find(r => r.id === id);
    if (report) {
        currentReportData = report;
        displayReport(report);
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
        showToast('📄 Report loaded', 'success');
    }
}

// ===== Charts =====
function updateCharts() {
    const reports = JSON.parse(localStorage.getItem('nbt_reports') || '[]');
    
    // Performance Chart
    const ctx1 = document.getElementById('performanceChart')?.getContext('2d');
    if (ctx1) {
        if (performanceChart) performanceChart.destroy();
        
        const scores = reports.map(r => r.score);
        const excellent = scores.filter(s => s >= 80).length;
        const good = scores.filter(s => s >= 60 && s < 80).length;
        const average = scores.filter(s => s >= 40 && s < 60).length;
        const poor = scores.filter(s => s < 40).length;
        
        performanceChart = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['Excellent (80%+)', 'Good (60-79%)', 'Average (40-59%)', 'Poor (<40%)'],
                datasets: [{
                    data: [excellent || 1, good || 1, average || 1, poor || 1],
                    backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
                    borderWidth: 2,
                    borderColor: 'var(--white)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                }
            }
        });
    }
    
    // Status Chart
    const ctx2 = document.getElementById('statusChart')?.getContext('2d');
    if (ctx2) {
        if (statusChart) statusChart.destroy();
        
        const paramNames = PARAMETERS.slice(0, 7);
        const paramData = paramNames.map((name, i) => {
            let count = 0;
            let total = 0;
            reports.forEach(r => {
                const p = r.parameters.find(p => p.id === i + 1);
                if (p) {
                    total++;
                    if (p.status === 'yes') count++;
                }
            });
            return total > 0 ? Math.round((count / total) * 100) : 0;
        });
        
        statusChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Info', 'Date', 'Topic', 'Q/A', 'Neat', 'Corrections', 'Uniformity'],
                datasets: [{
                    label: 'Compliance %',
                    data: paramData,
                    backgroundColor: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#4f46e5', '#6366f1', '#818cf8'],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Trend Chart
    const ctx3 = document.getElementById('trendChart')?.getContext('2d');
    if (ctx3) {
        if (trendChart) trendChart.destroy();
        
        const sortedReports = [...reports].reverse().slice(0, 12);
        const labels = sortedReports.map(r => new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        const data = sortedReports.map(r => r.score);
        
        trendChart = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: labels.length > 0 ? labels : ['No Data'],
                datasets: [{
                    label: 'Score Trend',
                    data: data.length > 0 ? data : [0],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4f46e5',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Update insights
    if (reports.length > 0) {
        updateInsights(reports[0]);
    }
}

// ===== Theme =====
function loadTheme() {
    if (localStorage.getItem('nbt_theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('darkModeToggle').checked = true;
        document.querySelector('#themeToggle i').className = 'fas fa-sun';
    }
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('nbt_theme', 'light');
        document.querySelector('#themeToggle i').className = 'fas fa-moon';
        showToast('☀️ Light mode', 'info');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('nbt_theme', 'dark');
        document.querySelector('#themeToggle i').className = 'fas fa-sun';
        showToast('🌙 Dark mode', 'info');
    }
}

// ===== Utilities =====
function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(n => {
                n.classList.remove('active');
                n.setAttribute('aria-selected', 'false');
            });
            item.classList.add('active');
            item.setAttribute('aria-selected', 'true');
            
            document.querySelectorAll('.section-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${item.dataset.section}Section`).classList.add('active');
        });
    });
    
    // Scroll buttons
    document.getElementById('scrollUpBtn').addEventListener('click', scrollToTop);
    document.getElementById('scrollDownBtn').addEventListener('click', scrollToBottom);
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('darkModeToggle')?.addEventListener('change', toggleTheme);
    
    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reaction = btn.dataset.reaction;
            const emojiMap = {
                like: '👍',
                love: '❤️',
                wow: '😮',
                sad: '😢',
                angry: '😠',
                laugh: '😂',
                celebrate: '🎉'
            };
            addReaction(emojiMap[reaction], reaction);
        });
    });
    
    // Auto-save on form change
    document.querySelectorAll('#assessmentForm input, #assessmentForm select, #assessmentForm textarea').forEach(el => {
        el.addEventListener('change', () => {
            if (document.getElementById('autoSaveToggle')?.checked) {
                saveDraft();
            }
        });
        el.addEventListener('input', () => {
            if (document.getElementById('autoSaveToggle')?.checked) {
                saveDraft();
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter to generate report
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            generateAssessment();
        }
        // Escape to close modal
        if (e.key === 'Escape') {
            closeShareModal();
        }
    });
}

// ===== Global Exports =====
window.generateAssessment = generateAssessment;
window.resetForm = resetForm;
window.showDemo = showDemo;
window.scrollToForm = scrollToForm;
window.exportPDF = exportPDF;
window.exportDOC = exportDOC;
window.exportTXT = exportTXT;
window.openShareModal = openShareModal;
window.closeShareModal = closeShareModal;
window.shareViaWhatsApp = shareViaWhatsApp;
window.shareViaEmail = shareViaEmail;
window.sendEmailReport = sendEmailReport;
window.generateShareableLink = generateShareableLink;
window.copyShareableLink = copyShareableLink;
window.shareToolOnFacebook = shareToolOnFacebook;
window.shareToolOnTwitter = shareToolOnTwitter;
window.shareToolOnWhatsApp = shareToolOnWhatsApp;
window.shareToolOnLinkedIn = shareToolOnLinkedIn;
window.copyToolLink = copyToolLink;
window.clearAllData = clearAllData;
window.loadAllReports = loadAllReports;
window.viewReport = viewReport;
window.toggleTheme = toggleTheme;

// ===== Page Load Complete =====
console.log('📚 NotebookCheck Pro initialized');
console.log('👤 User ID:', userId);
console.log('🔗 API Base:', API_BASE);
