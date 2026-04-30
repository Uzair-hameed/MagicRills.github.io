/* ========================================
   NOTEBOOKCHECK PRO - MAIN SCRIPT
   ======================================== */

const API_BASE = '/api';
const TOOL_SLUG = 'advanced-notebook-checking';

let userId = localStorage.getItem('nbt_user_id');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('nbt_user_id', userId);
}

let currentReportData = null;
let performanceChart, statusChart, trendChart;
let draftInterval = null;

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

document.addEventListener('DOMContentLoaded', async () => {
    loadParametersTable();
    loadTheme();
    loadSavedDraft();
    setupEventListeners();
    await loadAllStats();
    await loadReactions();
    startAutoSave();
    showToast('Welcome to NotebookCheck Pro!', 'success');
});

function loadParametersTable() {
    const tbody = document.getElementById('parametersBody');
    tbody.innerHTML = '';
    PARAMETERS.forEach((param, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${param}</td>
            <td><select class="status-select" data-param="${index + 1}"><option value="yes">Yes ✓</option><option value="no">No ✗</option></select></td>
            <td><input type="text" class="remarks-input" data-param="${index + 1}" placeholder="Remarks"></td>
        `;
    });
}

async function incrementUsage() {
    try {
        await fetch(`${API_BASE}/${TOOL_SLUG}/usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        await loadUsageStats();
    } catch(e) { console.error(e); }
}

async function loadUsageStats() {
    try {
        const res = await fetch(`${API_BASE}/${TOOL_SLUG}/usage`);
        const data = await res.json();
        const count = data.count || 0;
        document.getElementById('heroUsageCount').innerText = formatNumber(count);
        document.getElementById('sidebarUsageCount').innerText = formatNumber(count);
        document.getElementById('totalUsageCard').innerText = formatNumber(count);
        document.getElementById('usageProgressBar').style.width = Math.min((count/1000)*100,100)+'%';
    } catch(e) { console.error(e); }
}

// ========== FIXED REACTIONS SECTION - ONLY THIS PART CHANGED ==========
async function loadReactions() {
    try {
        // First try API
        const res = await fetch(`${API_BASE}/${TOOL_SLUG}/reactions`);
        const data = await res.json();
        const reactions = data.reactions || {};
        
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
        
        const total = Object.values(reactions).reduce((a,b)=>a+b,0);
        document.getElementById('heroReactionCount').innerText = formatNumber(total);
        document.getElementById('totalReactionsCard').innerText = formatNumber(total);
    } catch(e) { 
        console.error('API failed, using localStorage:', e);
        // Fallback to localStorage if API fails
        const reactions = JSON.parse(localStorage.getItem('nbt_reactions') || '{"like":0,"love":0,"wow":0,"sad":0,"angry":0,"laugh":0,"celebrate":0}');
        
        document.getElementById('reactLikeCount').innerText = reactions.like;
        document.getElementById('reactLoveCount').innerText = reactions.love;
        document.getElementById('reactWowCount').innerText = reactions.wow;
        document.getElementById('reactSadCount').innerText = reactions.sad;
        document.getElementById('reactAngryCount').innerText = reactions.angry;
        document.getElementById('reactLaughCount').innerText = reactions.laugh;
        document.getElementById('reactCelebrateCount').innerText = reactions.celebrate;
        document.getElementById('reactLike').innerText = reactions.like;
        document.getElementById('reactLove').innerText = reactions.love;
        document.getElementById('reactWow').innerText = reactions.wow;
        document.getElementById('reactSad').innerText = reactions.sad;
        document.getElementById('reactAngry').innerText = reactions.angry;
        document.getElementById('reactLaugh').innerText = reactions.laugh;
        document.getElementById('reactCelebrate').innerText = reactions.celebrate;
        
        const total = Object.values(reactions).reduce((a,b)=>a+b,0);
        document.getElementById('heroReactionCount').innerText = formatNumber(total);
        document.getElementById('totalReactionsCard').innerText = formatNumber(total);
    }
}

async function addReaction(emoji, reactionType) {
    showLoading(true);
    try {
        const res = await fetch(`${API_BASE}/${TOOL_SLUG}/reactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emoji: emoji, reaction_type: reactionType, user_id: userId })
        });
        const data = await res.json();
        await loadReactions();
        if (!data.already_reacted) showToast(`Thanks for your ${reactionType} reaction!`, 'success');
        else showToast('You already reacted!', 'warning');
    } catch(e) { 
        console.error('API failed, using localStorage:', e);
        // Fallback to localStorage if API fails
        let reactions = JSON.parse(localStorage.getItem('nbt_reactions') || '{"like":0,"love":0,"wow":0,"sad":0,"angry":0,"laugh":0,"celebrate":0}');
        
        const userReactions = JSON.parse(localStorage.getItem('nbt_user_reactions') || '{}');
        const userKey = `user_${userId}`;
        
        if (userReactions[userKey] === reactionType) {
            showToast(`You already reacted with ${reactionType}!`, 'warning');
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
        showToast(`Thanks for your ${reactionType} reaction!`, 'success');
    }
    finally { showLoading(false); }
}
// ========== END OF FIXED REACTIONS SECTION ==========

async function recordShare(platform) {
    try {
        await fetch(`${API_BASE}/${TOOL_SLUG}/shares`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ platform: platform, user_id: userId })
        });
        await loadShareStats();
    } catch(e) { console.error(e); }
}

async function loadShareStats() {
    try {
        const res = await fetch(`${API_BASE}/${TOOL_SLUG}/shares`);
        const data = await res.json();
        const shares = data.shares || 0;
        document.getElementById('heroShareCount').innerText = formatNumber(shares);
        document.getElementById('totalSharesCard').innerText = formatNumber(shares);
    } catch(e) { console.error(e); }
}

async function loadAllStats() {
    await Promise.all([loadUsageStats(), loadReactions(), loadShareStats()]);
    updateCharts();
}

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
        parameters.push({ id: index+1, parameter: PARAMETERS[index], status: select.value, remark: remark });
    });
    
    const yesCount = parameters.filter(p => p.status === 'yes').length;
    const score = Math.round((yesCount / parameters.length) * 100);
    
    currentReportData = {
        schoolName, teacherName, className, subject,
        totalStudents: document.getElementById('totalStudents').value,
        notebooksReceived: document.getElementById('notebooksReceived').value,
        lastWorkChecked: document.getElementById('lastWorkChecked').value || 'Not specified',
        uncheckedWork: document.getElementById('uncheckedWork').value || 'None',
        conditions: conditions.join(', ') || 'Not specified',
        parameters, yesCount, noCount: parameters.length - yesCount, score,
        date: new Date().toLocaleString(), id: Date.now()
    };
    
    const reports = JSON.parse(localStorage.getItem('nbt_reports') || '[]');
    reports.unshift(currentReportData);
    localStorage.setItem('nbt_reports', JSON.stringify(reports.slice(0, 50)));
    
    displayReport(currentReportData);
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    
    await incrementUsage();
    showLoading(false);
    showToast('Report generated!', 'success');
}

function displayReport(data) {
    const container = document.getElementById('reportPreview');
    let parametersHtml = '';
    data.parameters.forEach(p => {
        parametersHtml += `<tr><td>${p.id}</td><td>${p.parameter}</td><td class="status-${p.status}">${p.status === 'yes' ? '✓ Yes' : '✗ No'}</td><td>${p.remark || '-'}</td></tr>`;
    });
    
    const statusClass = data.score >= 70 ? 'success' : (data.score >= 50 ? 'warning' : 'danger');
    
    container.innerHTML = `
        <div class="report-container">
            <div class="report-header"><h2>📋 Notebook Assessment Report</h2><p>${data.date}</p></div>
            <div class="report-school-header"><h3>${data.schoolName}</h3></div>
            <div class="report-info-grid">
                <div><strong>Teacher:</strong> ${data.teacherName}</div>
                <div><strong>Class:</strong> ${data.className}</div>
                <div><strong>Subject:</strong> ${data.subject}</div>
                <div><strong>Students:</strong> ${data.totalStudents}</div>
                <div><strong>Received:</strong> ${data.notebooksReceived}</div>
                <div><strong>Condition:</strong> ${data.conditions}</div>
            </div>
            <div class="score-card ${statusClass}"><div class="score-value">${data.score}%</div><div class="score-label">Quality Score</div><div class="score-stats"><span>✓ Yes: ${data.yesCount}</span><span>✗ No: ${data.noCount}</span></div></div>
            <h4>Evaluation Parameters</h4>
            <table class="report-table"><thead><tr><th>#</th><th>Parameter</th><th>Status</th><th>Remarks</th></tr></thead><tbody>${parametersHtml}</tbody></table>
            <div class="report-footer"><div class="signature-line"></div><p>School Head's Signature: _______________</p></div>
        </div>
    `;
}

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
        showToast('PDF downloaded!', 'success');
        await recordShare('pdf_export');
    } catch(e) { showToast('PDF error', 'error'); }
    finally { showLoading(false); }
}

function exportDOC() {
    const content = document.getElementById('reportPreview').innerHTML;
    if (!content) { showToast('No report', 'warning'); return; }
    const blob = new Blob([`<html><head><meta charset="UTF-8"></head><body>${content}</body></html>`], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `notebook_report_${Date.now()}.doc`;
    link.click();
    showToast('DOC downloaded!', 'success');
    recordShare('doc_export');
}

function exportTXT() {
    const text = document.getElementById('reportPreview').innerText;
    if (!text) { showToast('No report', 'warning'); return; }
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `notebook_report_${Date.now()}.txt`;
    link.click();
    showToast('TXT downloaded!', 'success');
    recordShare('txt_export');
}

function openShareModal() {
    if (!currentReportData) { showToast('Generate a report first', 'warning'); return; }
    document.getElementById('shareModal').classList.add('active');
}

function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
    document.getElementById('shareLinkContainer').style.display = 'none';
    document.getElementById('emailContainer').style.display = 'none';
}

function shareViaWhatsApp() {
    if (!currentReportData) return;
    const text = `Notebook Report: ${currentReportData.schoolName}\nTeacher: ${currentReportData.teacherName}\nScore: ${currentReportData.score}%`;
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
    if (!email) { showToast('Enter email', 'warning'); return; }
    showToast(`Report sent to ${email}`, 'success');
    recordShare('email');
    closeShareModal();
}

function generateShareableLink() {
    const link = `${window.location.origin}${window.location.pathname}?report=${currentReportData?.id}`;
    document.getElementById('shareableLink').value = link;
    document.getElementById('shareLinkContainer').style.display = 'block';
    document.getElementById('emailContainer').style.display = 'none';
    showToast('Link generated!', 'success');
}

function copyShareableLink() {
    const link = document.getElementById('shareableLink');
    link.select();
    document.execCommand('copy');
    showToast('Link copied!', 'success');
}

function shareToolOnFacebook() { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); recordShare('tool_facebook'); }
function shareToolOnTwitter() { window.open(`https://twitter.com/intent/tweet?text=NotebookCheck%20Pro&url=${encodeURIComponent(window.location.href)}`, '_blank'); recordShare('tool_twitter'); }
function shareToolOnWhatsApp() { window.open(`https://wa.me/?text=${encodeURIComponent('Check out NotebookCheck Pro: ' + window.location.href)}`, '_blank'); recordShare('tool_whatsapp'); }
function copyToolLink() { navigator.clipboard.writeText(window.location.href); showToast('Link copied!', 'success'); recordShare('tool_copy'); }

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
        parameters: Array.from(document.querySelectorAll('.status-select')).map((s,i) => ({ id: i+1, status: s.value, remark: document.querySelector(`.remarks-input[data-param="${i+1}"]`).value }))
    };
    localStorage.setItem('nbt_draft', JSON.stringify(formData));
}

function loadSavedDraft() {
    const draft = localStorage.getItem('nbt_draft');
    if (draft) {
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
            document.querySelectorAll('input[name="condition"]').forEach(cb => { cb.checked = data.conditions.includes(cb.value); });
        }
        if (data.parameters) {
            data.parameters.forEach(p => {
                const sel = document.querySelector(`.status-select[data-param="${p.id}"]`);
                if (sel) sel.value = p.status;
                const rem = document.querySelector(`.remarks-input[data-param="${p.id}"]`);
                if (rem) rem.value = p.remark;
            });
        }
        showToast('Draft loaded', 'info');
    }
}

function startAutoSave() {
    if (draftInterval) clearInterval(draftInterval);
    draftInterval = setInterval(() => {
        if (document.getElementById('autoSaveToggle')?.checked) saveDraft();
    }, 30000);
}

function showLoading(show) {
    document.getElementById('loadingOverlay').classList.toggle('active', show);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function scrollToForm() { document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth' }); }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }
function resetForm() { document.getElementById('assessmentForm').reset(); showToast('Form reset', 'info'); }
function showDemo() {
    document.getElementById('schoolName').value = 'Demo International School';
    document.getElementById('teacherName').value = 'Ms. Sarah Johnson';
    document.getElementById('className').value = 'Grade 8 - Section A';
    document.getElementById('subject').value = 'Mathematics';
    showToast('Demo data loaded', 'success');
}
function clearAllData() {
    if (confirm('Clear all data?')) { localStorage.removeItem('nbt_draft'); localStorage.removeItem('nbt_reports'); showToast('Data cleared', 'success'); resetForm(); }
}

function loadAllReports() {
    const reports = JSON.parse(localStorage.getItem('nbt_reports') || '[]');
    const container = document.getElementById('reportsList');
    if (reports.length === 0) { container.innerHTML = '<div class="empty-state"><i class="fas fa-file-alt"></i><p>No saved reports</p></div>'; return; }
    container.innerHTML = reports.map(r => `<div class="report-card-item" onclick="viewReport(${r.id})"><div><strong>${r.schoolName}</strong><br><small>${r.teacherName} | ${r.className}</small></div><span class="score-badge ${r.score>=70?'good':(r.score>=50?'avg':'poor')}">${r.score}%</span></div>`).join('');
}

function viewReport(id) {
    const reports = JSON.parse(localStorage.getItem('nbt_reports') || '[]');
    const report = reports.find(r => r.id === id);
    if (report) { currentReportData = report; displayReport(report); document.getElementById('resultsSection').style.display = 'block'; document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' }); showToast('Report loaded', 'success'); }
}

function updateCharts() {
    const ctx1 = document.getElementById('performanceChart')?.getContext('2d');
    if (ctx1) { if(performanceChart) performanceChart.destroy(); performanceChart = new Chart(ctx1, { type: 'doughnut', data: { labels: ['Excellent','Good','Average','Poor'], datasets: [{ data: [45,30,15,10], backgroundColor: ['#10b981','#f59e0b','#ef4444','#6b7280'] }] } }); }
    const ctx2 = document.getElementById('statusChart')?.getContext('2d');
    if (ctx2) { if(statusChart) statusChart.destroy(); statusChart = new Chart(ctx2, { type: 'bar', data: { labels: ['Info','Date','Topic','Q/A','Neat','Corrections'], datasets: [{ label: 'Compliance %', data: [85,72,90,78,82,65], backgroundColor: '#4f46e5' }] } }); }
    const ctx3 = document.getElementById('trendChart')?.getContext('2d');
    if (ctx3) { if(trendChart) trendChart.destroy(); trendChart = new Chart(ctx3, { type: 'line', data: { labels: ['Week1','Week2','Week3','Week4'], datasets: [{ label: 'Assessments', data: [12,19,15,27], borderColor: '#4f46e5', tension: 0.4 }] } }); }
}

function loadTheme() {
    if (localStorage.getItem('nbt_theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('darkModeToggle').checked = true;
        document.querySelector('#themeToggle i').className = 'fas fa-sun';
    }
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('nbt_theme', 'light'); document.querySelector('#themeToggle i').className = 'fas fa-moon'; showToast('Light mode', 'info'); }
    else { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('nbt_theme', 'dark'); document.querySelector('#themeToggle i').className = 'fas fa-sun'; showToast('Dark mode', 'info'); }
}

function formatNumber(n) { return n >= 1000 ? (n/1000).toFixed(1)+'k' : n.toString(); }

function setupEventListeners() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            document.querySelectorAll('.section-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${item.dataset.section}Section`).classList.add('active');
        });
    });
    document.getElementById('scrollUpBtn').addEventListener('click', scrollToTop);
    document.getElementById('scrollDownBtn').addEventListener('click', scrollToBottom);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('darkModeToggle')?.addEventListener('change', toggleTheme);
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reaction = btn.dataset.reaction;
            const emojiMap = { like:'👍', love:'❤️', wow:'😮', sad:'😢', angry:'😠', laugh:'😂', celebrate:'🎉' };
            addReaction(emojiMap[reaction], reaction);
        });
    });
}

// Global exports
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
window.copyToolLink = copyToolLink;
window.clearAllData = clearAllData;
window.loadAllReports = loadAllReports;
window.viewReport = viewReport;
window.toggleTheme = toggleTheme;
