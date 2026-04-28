// ============================================
// SCHOOL EVENT CALCULATOR - COMPLETE VERSION
// 54+ FEATURES WITH TiDB INTEGRATION
// ============================================

const TOOL_SLUG = 'school-event-calculator';
const API_BASE_URL = window.location.origin;

// Global variables
let costChart = null;
let roiChart = null;

// ============================================
// TiDB API FUNCTIONS
// ============================================

async function trackToolUsage() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tool/usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolSlug: TOOL_SLUG })
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('usedCount').innerText = data.totalCount || 0;
        }
    } catch (error) {
        let localCount = localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
        document.getElementById('usedCount').innerText = localCount;
    }
}

async function getToolStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tool/stats?slug=${TOOL_SLUG}`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('usedCount').innerText = data.usageCount || 0;
            document.getElementById('shareCount').innerText = data.shareCount || 0;
            if (data.reactions) updateReactionCounts(data.reactions);
        }
    } catch (error) {
        loadLocalStats();
    }
}

async function addReaction(emojiType) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tool/reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolSlug: TOOL_SLUG, emojiType })
        });
        if (response.ok) {
            const data = await response.json();
            updateReactionCounts(data.reactions);
            showToast(`You reacted with ${getEmojiName(emojiType)}!`, 'success');
            highlightReactionButton(emojiType);
        } else if (response.status === 409) {
            showToast('You already reacted with this emoji!', 'info');
        }
    } catch (error) {
        incrementLocalReaction(emojiType);
    }
}

async function trackShare(platform) {
    try {
        await fetch(`${API_BASE_URL}/api/tool/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolSlug: TOOL_SLUG, shareType: platform })
        });
    } catch (error) {}
}

function updateReactionCounts(reactions) {
    const emojis = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
    emojis.forEach(emoji => {
        const el = document.getElementById(`${emoji}Count`);
        if (el && reactions[emoji]) el.innerText = reactions[emoji];
    });
}

function highlightReactionButton(emojiType) {
    const buttons = document.querySelectorAll('.reaction-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.emoji === emojiType) {
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 1000);
        }
    });
}

function getEmojiName(emojiType) {
    const names = {
        like: '👍 Like', love: '❤️ Love', wow: '😮 Wow',
        sad: '😢 Sad', angry: '😠 Angry', laugh: '😂 Laugh', celebrate: '🎉 Celebrate'
    };
    return names[emojiType] || emojiType;
}

function incrementLocalReaction(emojiType) {
    let reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    reactions[emojiType] = (reactions[emojiType] || 0) + 1;
    localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactions));
    updateReactionCounts(reactions);
}

function loadLocalStats() {
    document.getElementById('usedCount').innerText = localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
    document.getElementById('shareCount').innerText = localStorage.getItem(`${TOOL_SLUG}_shares`) || 0;
    const reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    updateReactionCounts(reactions);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// CALCULATION FUNCTIONS
// ============================================

function calculateEventImpact() {
    // Get all input values
    const eventName = document.getElementById('eventName').value || 'Unnamed Event';
    const studentCount = parseFloat(document.getElementById('studentCount').value) || 0;
    const studentHours = parseFloat(document.getElementById('studentHours').value) || 0;
    const participationRate = parseFloat(document.getElementById('participationRate').value) || 0;
    const satisfactionScore = parseFloat(document.getElementById('satisfactionScore').value) || 0;
    
    const staffCount = parseFloat(document.getElementById('staffCount').value) || 0;
    const staffHours = parseFloat(document.getElementById('staffHours').value) || 0;
    const staffRate = parseFloat(document.getElementById('staffRate').value) || 0;
    const teacherFeedback = parseFloat(document.getElementById('teacherFeedback').value) || 0;
    
    // Costs
    const materialsCost = parseFloat(document.getElementById('materialsCost').value) || 0;
    const venueCost = parseFloat(document.getElementById('venueCost').value) || 0;
    const technologyCost = parseFloat(document.getElementById('technologyCost').value) || 0;
    const foodCost = parseFloat(document.getElementById('foodCost').value) || 0;
    const equipmentCost = parseFloat(document.getElementById('equipmentCost').value) || 0;
    const marketingCost = parseFloat(document.getElementById('marketingCost').value) || 0;
    
    // Income
    const ticketIncome = parseFloat(document.getElementById('ticketIncome').value) || 0;
    const sponsorshipIncome = parseFloat(document.getElementById('sponsorshipIncome').value) || 0;
    const donationIncome = parseFloat(document.getElementById('donationIncome').value) || 0;
    const vendorIncome = parseFloat(document.getElementById('vendorIncome').value) || 0;
    
    // Benefits
    const learningValue = parseFloat(document.getElementById('learningValue').value) || 0;
    const engagementValue = parseFloat(document.getElementById('engagementValue').value) || 0;
    const skillValue = parseFloat(document.getElementById('skillValue').value) || 0;
    const longTermValue = parseFloat(document.getElementById('longTermValue').value) || 0;
    
    // Calculations
    const staffCost = staffCount * staffHours * staffRate;
    const resourceCost = materialsCost + venueCost + technologyCost + foodCost + equipmentCost + marketingCost;
    const totalCost = staffCost + resourceCost;
    const totalIncome = ticketIncome + sponsorshipIncome + donationIncome + vendorIncome;
    const netCost = totalCost - totalIncome;
    
    const totalStudentHours = studentCount * studentHours * (participationRate / 100);
    const totalStaffHours = staffCount * staffHours;
    const totalHours = totalStudentHours + totalStaffHours;
    
    const totalBenefitValue = learningValue + engagementValue + skillValue + longTermValue;
    const netImpact = totalBenefitValue - netCost;
    const roiPercentage = netCost > 0 ? ((netImpact / netCost) * 100) : (totalBenefitValue > 0 ? 100 : 0);
    const costPerStudent = studentCount > 0 ? (netCost / studentCount) : 0;
    const costPerHour = totalHours > 0 ? (netCost / totalHours) : 0;
    
    // Efficiency Rating
    let efficiencyRating = 'Poor';
    if (roiPercentage >= 100) efficiencyRating = 'Excellent';
    else if (roiPercentage >= 50) efficiencyRating = 'Good';
    else if (roiPercentage >= 0) efficiencyRating = 'Fair';
    
    // Learning Outcomes Score
    const learningOutcomeScore = ((satisfactionScore / 10) * 0.4 + (teacherFeedback / 10) * 0.3 + (participationRate / 100) * 0.3) * 100;
    
    // Hide placeholder and show results
    document.getElementById('placeholder').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('costCard').style.display = 'block';
    document.getElementById('financialCard').style.display = 'block';
    document.getElementById('roiCard').style.display = 'block';
    document.getElementById('chartCard').style.display = 'block';
    document.getElementById('recommendationsCard').style.display = 'block';
    document.getElementById('exportCard').style.display = 'block';
    
    // Update Summary Stats
    document.getElementById('summaryStats').innerHTML = `
        <div class="result-item">
            <div class="result-label">🎯 Event Name</div>
            <div class="result-value">${eventName}</div>
        </div>
        <div class="result-item">
            <div class="result-label">👥 Participants</div>
            <div class="result-value">${studentCount.toLocaleString()} Students | ${staffCount.toLocaleString()} Staff</div>
        </div>
        <div class="result-item">
            <div class="result-label">📊 Participation Rate</div>
            <div class="result-value">${participationRate}%</div>
        </div>
        <div class="metric-item">
            <span>Student Satisfaction</span>
            <strong>${satisfactionScore}/10 ⭐</strong>
        </div>
        <div class="metric-item">
            <span>Teacher Feedback</span>
            <strong>${teacherFeedback}/10 ⭐</strong>
        </div>
        <div class="metric-item">
            <span>Learning Outcome Score</span>
            <strong>${learningOutcomeScore.toFixed(1)}%</strong>
        </div>
    `;
    
    // Update Cost Breakdown
    document.getElementById('costBreakdown').innerHTML = `
        <div class="metric-item"><span>👨‍🏫 Staff Cost</span><strong>PKR ${formatNumber(staffCost)}</strong></div>
        <div class="metric-item"><span>📦 Materials</span><strong>PKR ${formatNumber(materialsCost)}</strong></div>
        <div class="metric-item"><span>🏢 Venue</span><strong>PKR ${formatNumber(venueCost)}</strong></div>
        <div class="metric-item"><span>💻 Technology</span><strong>PKR ${formatNumber(technologyCost)}</strong></div>
        <div class="metric-item"><span>🍔 Food/Catering</span><strong>PKR ${formatNumber(foodCost)}</strong></div>
        <div class="metric-item"><span>🎤 Equipment</span><strong>PKR ${formatNumber(equipmentCost)}</strong></div>
        <div class="metric-item"><span>📢 Marketing</span><strong>PKR ${formatNumber(marketingCost)}</strong></div>
        <div class="metric-item highlight"><span>💰 Total Cost</span><strong>PKR ${formatNumber(totalCost)}</strong></div>
    `;
    
    // Update Financial Analysis
    document.getElementById('financialAnalysis').innerHTML = `
        <div class="metric-item"><span>🎟️ Ticket Sales</span><strong>PKR ${formatNumber(ticketIncome)}</strong></div>
        <div class="metric-item"><span>🤝 Sponsorship</span><strong>PKR ${formatNumber(sponsorshipIncome)}</strong></div>
        <div class="metric-item"><span>🎁 Donations</span><strong>PKR ${formatNumber(donationIncome)}</strong></div>
        <div class="metric-item"><span>🏪 Vendor Stalls</span><strong>PKR ${formatNumber(vendorIncome)}</strong></div>
        <div class="metric-item"><span>📈 Total Income</span><strong>PKR ${formatNumber(totalIncome)}</strong></div>
        <div class="metric-item highlight"><span>💰 Net Cost (After Income)</span><strong>PKR ${formatNumber(netCost)}</strong></div>
    `;
    
    // Update ROI Metrics
    document.getElementById('roiMetrics').innerHTML = `
        <div class="metric-item"><span>📚 Educational Value</span><strong>PKR ${formatNumber(learningValue)}</strong></div>
        <div class="metric-item"><span>😊 Engagement Value</span><strong>PKR ${formatNumber(engagementValue)}</strong></div>
        <div class="metric-item"><span>🏆 Skill Development</span><strong>PKR ${formatNumber(skillValue)}</strong></div>
        <div class="metric-item"><span>📈 Long-term Impact</span><strong>PKR ${formatNumber(longTermValue)}</strong></div>
        <div class="metric-item"><span>🎯 Total Benefit Value</span><strong>PKR ${formatNumber(totalBenefitValue)}</strong></div>
        <div class="metric-item"><span>⚡ Net Impact</span><strong>PKR ${formatNumber(netImpact)}</strong></div>
        <div class="metric-item highlight"><span>📊 ROI Percentage</span><strong>${roiPercentage.toFixed(1)}%</strong></div>
        <div class="metric-item"><span>👤 Cost per Student</span><strong>PKR ${formatNumber(costPerStudent)}</strong></div>
        <div class="metric-item"><span>⏱️ Cost per Hour</span><strong>PKR ${formatNumber(costPerHour)}</strong></div>
        <div class="metric-item"><span>🏅 Efficiency Rating</span><strong class="efficiency-badge efficiency-${efficiencyRating}">${efficiencyRating}</strong></div>
    `;
    
    // Update Charts
    updateCharts(totalCost, staffCost, resourceCost, totalIncome, netCost, totalBenefitValue);
    
    // Update Recommendations
    updateRecommendations(roiPercentage, participationRate, satisfactionScore, teacherFeedback, netCost, totalIncome);
    
    // Track usage
    trackToolUsage();
    
    // Store results for export
    window.calculationResults = {
        eventName, studentCount, staffCount, participationRate, satisfactionScore, teacherFeedback,
        staffCost, materialsCost, venueCost, technologyCost, foodCost, equipmentCost, marketingCost, totalCost,
        ticketIncome, sponsorshipIncome, donationIncome, vendorIncome, totalIncome, netCost,
        learningValue, engagementValue, skillValue, longTermValue, totalBenefitValue, netImpact,
        roiPercentage, costPerStudent, costPerHour, efficiencyRating, learningOutcomeScore
    };
}

function updateCharts(totalCost, staffCost, resourceCost, totalIncome, netCost, totalBenefitValue) {
    // Cost Breakdown Chart
    const ctx1 = document.getElementById('costChart').getContext('2d');
    if (costChart) costChart.destroy();
    costChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Staff Cost', 'Resources & Materials'],
            datasets: [{ data: [staffCost, resourceCost], backgroundColor: ['#ff6b6b', '#ffa500'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }
    });
    
    // ROI Chart
    const ctx2 = document.getElementById('roiChart').getContext('2d');
    if (roiChart) roiChart.destroy();
    roiChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Net Cost', 'Total Benefit', 'Net Impact'],
            datasets: [{ label: 'Amount (PKR)', data: [netCost, totalBenefitValue, totalBenefitValue - netCost], backgroundColor: ['#ffa500', '#48bb78', '#4299e1'], borderRadius: 8 }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: v => 'PKR ' + (v / 1000) + 'k' } } } }
    });
}

function updateRecommendations(roiPercentage, participationRate, satisfactionScore, teacherFeedback, netCost, totalIncome) {
    const recDiv = document.getElementById('recommendations');
    let recommendations = [];
    
    if (roiPercentage < 50) {
        recommendations.push('📉 Your ROI is below 50%. Consider reducing costs or increasing sponsorship income.');
    }
    if (participationRate < 70) {
        recommendations.push('👥 Participation rate is low. Improve marketing and student outreach.');
    }
    if (satisfactionScore < 7) {
        recommendations.push('😊 Student satisfaction needs improvement. Collect feedback for better planning.');
    }
    if (teacherFeedback < 7) {
        recommendations.push('👨‍🏫 Teacher feedback indicates areas for improvement. Organize better training.');
    }
    if (netCost > 0 && totalIncome === 0) {
        recommendations.push('💰 No income sources added. Consider ticket sales, sponsorships, or donations.');
    }
    if (recommendations.length === 0) {
        recommendations.push('🎉 Excellent planning! Your event metrics look great. Keep up the good work!');
    }
    recommendations.push('💡 Pro tip: Export this report to share with your team and stakeholders.');
    
    recDiv.innerHTML = recommendations.map(rec => `<div class="recommendation-item"><i class="fas fa-lightbulb"></i> ${rec}</div>`).join('');
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function exportToExcel() {
    if (!window.calculationResults) { showToast('Please calculate first!', 'error'); return; }
    const r = window.calculationResults;
    const data = [
        ['Metric', 'Value'], ['Event Name', r.eventName], ['Total Students', r.studentCount], ['Total Staff', r.staffCount],
        ['Participation Rate', r.participationRate + '%'], ['Student Satisfaction', r.satisfactionScore + '/10'],
        ['Teacher Feedback', r.teacherFeedback + '/10'], ['Total Cost', r.totalCost], ['Total Income', r.totalIncome],
        ['Net Cost', r.netCost], ['Total Benefit Value', r.totalBenefitValue], ['Net Impact', r.netImpact],
        ['ROI Percentage', r.roiPercentage + '%'], ['Cost per Student', r.costPerStudent], ['Cost per Hour', r.costPerHour],
        ['Efficiency Rating', r.efficiencyRating], ['Learning Outcome Score', r.learningOutcomeScore.toFixed(1) + '%']
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Event Report');
    XLSX.writeFile(wb, `event_report_${r.eventName.replace(/\s+/g, '_')}.xlsx`);
    showToast('Excel report downloaded!', 'success');
}

function exportToWord() {
    if (!window.calculationResults) { showToast('Please calculate first!', 'error'); return; }
    const r = window.calculationResults;
    const html = `
        <html><head><meta charset="utf-8"><title>Event Report - ${r.eventName}</title>
        <style>body{font-family:Arial;margin:20px}h1{color:#ff6b6b}.metric{margin:10px 0;padding:10px;background:#f5f5f5}</style>
        </head><body><h1>🎓 School Event Impact Report</h1><h2>${r.eventName}</h2>
        <div class="metric"><strong>Students:</strong> ${r.studentCount}</div><div class="metric"><strong>Staff:</strong> ${r.staffCount}</div>
        <div class="metric"><strong>Participation Rate:</strong> ${r.participationRate}%</div><div class="metric"><strong>Student Satisfaction:</strong> ${r.satisfactionScore}/10</div>
        <div class="metric"><strong>Teacher Feedback:</strong> ${r.teacherFeedback}/10</div><div class="metric"><strong>Total Cost:</strong> PKR ${formatNumber(r.totalCost)}</div>
        <div class="metric"><strong>Total Income:</strong> PKR ${formatNumber(r.totalIncome)}</div><div class="metric"><strong>Net Cost:</strong> PKR ${formatNumber(r.netCost)}</div>
        <div class="metric"><strong>Total Benefit:</strong> PKR ${formatNumber(r.totalBenefitValue)}</div><div class="metric"><strong>Net Impact:</strong> PKR ${formatNumber(r.netImpact)}</div>
        <div class="metric"><strong>ROI:</strong> ${r.roiPercentage.toFixed(1)}%</div><div class="metric"><strong>Efficiency Rating:</strong> ${r.efficiencyRating}</div>
        <div class="metric"><strong>Learning Outcome Score:</strong> ${r.learningOutcomeScore.toFixed(1)}%</div>
        </body></html>
    `;
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `event_report_${r.eventName.replace(/\s+/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Word report downloaded!', 'success');
}

function printResults() { window.print(); }

function formatNumber(num) { return Math.round(num).toLocaleString('en-PK'); }

// ============================================
// SHARE FUNCTIONS
// ============================================

function shareOnFacebook() { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); trackShare('facebook'); showToast('Shared on Facebook!', 'success'); }
function shareOnTwitter() { window.open(`https://twitter.com/intent/tweet?text=School%20Event%20Calculator&url=${encodeURIComponent(window.location.href)}`, '_blank'); trackShare('twitter'); showToast('Shared on Twitter!', 'success'); }
function shareOnLinkedIn() { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'); trackShare('linkedin'); showToast('Shared on LinkedIn!', 'success'); }
function shareOnWhatsApp() { window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank'); trackShare('whatsapp'); showToast('Shared on WhatsApp!', 'success'); }
function shareByEmail() { window.location.href = `mailto:?subject=School%20Event%20Calculator&body=${encodeURIComponent(window.location.href)}`; trackShare('email'); showToast('Email opened!', 'info'); }
async function copyPageLink() { await navigator.clipboard.writeText(window.location.href); trackShare('copy'); showToast('Link copied!', 'success'); }

function setupScrollButtons() {
    const upBtn = document.getElementById('scrollUpBtn');
    const downBtn = document.getElementById('scrollDownBtn');
    window.addEventListener('scroll', () => { upBtn.style.display = window.scrollY > 200 ? 'flex' : 'none'; });
    upBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    downBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
}

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    getToolStats();
    trackToolUsage();
    
    document.getElementById('calculateBtn').addEventListener('click', calculateEventImpact);
    document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);
    document.getElementById('exportWordBtn').addEventListener('click', exportToWord);
    document.getElementById('printBtn').addEventListener('click', printResults);
    
    // Real-time updates on input change
    const inputs = ['studentCount', 'staffCount', 'materialsCost', 'venueCost', 'technologyCost', 'foodCost'];
    inputs.forEach(id => { document.getElementById(id).addEventListener('input', calculateEventImpact); });
    
    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.emoji));
    });
    
    // Share buttons
    document.querySelector('.share-btn.facebook')?.addEventListener('click', shareOnFacebook);
    document.querySelector('.share-btn.twitter')?.addEventListener('click', shareOnTwitter);
    document.querySelector('.share-btn.linkedin')?.addEventListener('click', shareOnLinkedIn);
    document.querySelector('.share-btn.whatsapp')?.addEventListener('click', shareOnWhatsApp);
    document.querySelector('.share-btn.email')?.addEventListener('click', shareByEmail);
    document.querySelector('.share-btn.copy-link')?.addEventListener('click', copyPageLink);
    
    setupScrollButtons();
    
    // Set default date
    document.getElementById('eventDate').value = new Date().toISOString().split('T')[0];
    
    showToast('Welcome to School Event Calculator!', 'success');
});
