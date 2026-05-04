// FILE: mathematics-models-idea-generator.js
// ============================================
// CONFIGURATION
// ============================================

const API_BASE = '/api';
const TOOL_SLUG = 'mathematics-models-idea-generator';
let currentUserId = localStorage.getItem('userId') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem('userId', currentUserId);

let isDarkMode = localStorage.getItem('darkMode') === 'true';
let reactionsData = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
let userReactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_user_reactions`) || '{}');

// 15 Assessment Criteria
const CRITERIA = [
    { id: 'accuracy', name: 'Mathematical Accuracy', weight: 2.0, maxScore: 10, description: 'Correct application of mathematical concepts' },
    { id: 'understanding', name: 'Conceptual Understanding', weight: 1.5, maxScore: 10, description: 'Depth of understanding of the topic' },
    { id: 'construction', name: 'Model Construction Quality', weight: 1.5, maxScore: 10, description: 'Neatness, durability, and precision' },
    { id: 'creativity', name: 'Creativity & Innovation', weight: 1.5, maxScore: 10, description: 'Original ideas and creative approach' },
    { id: 'presentation', name: 'Presentation & Explanation', weight: 1.0, maxScore: 10, description: 'Clarity and confidence in explaining' },
    { id: 'material', name: 'Material Usage (Low-cost)', weight: 1.0, maxScore: 10, description: 'Effective use of available/recycled materials' },
    { id: 'effort', name: 'Effort & Hard Work', weight: 1.0, maxScore: 10, description: 'Visible effort and dedication' },
    { id: 'originality', name: 'Originality', weight: 1.0, maxScore: 10, description: 'Unique approach and personal touch' },
    { id: 'problemSolving', name: 'Problem Solving Skills', weight: 1.5, maxScore: 10, description: 'Ability to solve related problems' },
    { id: 'application', name: 'Real-World Application', weight: 1.0, maxScore: 10, description: 'Connection to real-life situations' },
    { id: 'collaboration', name: 'Collaboration & Teamwork', weight: 1.0, maxScore: 10, description: 'Working effectively with others' },
    { id: 'timeManagement', name: 'Time Management', weight: 1.0, maxScore: 10, description: 'Submission within deadline' },
    { id: 'documentation', name: 'Documentation & Labels', weight: 1.0, maxScore: 10, description: 'Proper labeling and written work' },
    { id: 'aesthetics', name: 'Aesthetics & Design', weight: 0.5, maxScore: 10, description: 'Visual appeal and design quality' },
    { id: 'functionality', name: 'Functionality & Working', weight: 1.5, maxScore: 10, description: 'Model works as intended' }
];

let assessmentChart = null;

// ============================================
// DOM Elements
// ============================================

const elements = {
    educationLevel: document.getElementById('educationLevel'),
    mathCategory: document.getElementById('mathCategory'),
    specificTopic: document.getElementById('specificTopic'),
    generateBtn: document.getElementById('generateBtn'),
    randomBtn: document.getElementById('randomBtn'),
    clearBtn: document.getElementById('clearBtn'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    resultsContainer: document.getElementById('resultsContainer'),
    modelContent: document.getElementById('modelContent'),
    usageCount: document.getElementById('usageCount'),
    themeToggle: document.getElementById('themeToggle'),
    scrollUpBtn: document.getElementById('scrollUpBtn'),
    scrollDownBtn: document.getElementById('scrollDownBtn'),
    copyBtn: document.getElementById('copyBtn'),
    exportPDFBtn: document.getElementById('exportPDFBtn'),
    exportDocBtn: document.getElementById('exportDocBtn'),
    openAssessmentBtn: document.getElementById('openAssessmentBtn'),
    assessmentModal: document.getElementById('assessmentModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    shareCount: document.getElementById('shareCount')
};

// ============================================
// Helper Functions
// ============================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading() {
    elements.loadingSpinner.style.display = 'block';
    elements.resultsContainer.style.display = 'none';
}

function hideLoading() {
    elements.loadingSpinner.style.display = 'none';
    elements.resultsContainer.style.display = 'block';
}

// ============================================
// API Calls
// ============================================

async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: currentUserId })
        });
        const data = await response.json();
        if (data.total_usage && elements.usageCount) elements.usageCount.textContent = data.total_usage;
        return data;
    } catch (error) { return null; }
}

async function getUsage() {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/usage`);
        const data = await response.json();
        if (data.count && elements.usageCount) elements.usageCount.textContent = data.count;
        return data;
    } catch (error) { return null; }
}

async function addReaction(emoji) {
    const emojiMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😂': 'laugh', '🎉': 'celebrate' };
    if (userReactions[emoji]) { showToast('You already reacted with this emoji!', 'info'); return false; }
    
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/reactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emoji, user_id: currentUserId })
        });
        const data = await response.json();
        if (data.success !== false) {
            userReactions[emoji] = true;
            localStorage.setItem(`${TOOL_SLUG}_user_reactions`, JSON.stringify(userReactions));
            if (data.counts) reactionsData = data.counts;
            else reactionsData[emojiMap[emoji]] = (reactionsData[emojiMap[emoji]] || 0) + 1;
            updateReactionUI();
            showToast(`Thanks for your feedback!`, 'success');
            return true;
        }
        return true;
    } catch (error) {
        if (!userReactions[emoji]) {
            userReactions[emoji] = true;
            localStorage.setItem(`${TOOL_SLUG}_user_reactions`, JSON.stringify(userReactions));
            reactionsData[emojiMap[emoji]] = (reactionsData[emojiMap[emoji]] || 0) + 1;
            updateReactionUI();
            showToast(`Thanks for your feedback!`, 'success');
        }
        return true;
    }
}

async function getReactions() {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/reactions`);
        const data = await response.json();
        if (data.reactions) { reactionsData = data.reactions; updateReactionUI(); }
        return data;
    } catch (error) { return null; }
}

function updateReactionUI() {
    const emojiMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😂': 'laugh', '🎉': 'celebrate' };
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        const emoji = btn.getAttribute('data-emoji');
        const count = reactionsData[emojiMap[emoji]] || 0;
        const countSpan = btn.querySelector('.reaction-count');
        if (countSpan) countSpan.textContent = count;
        if (userReactions[emoji]) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

async function addShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/shares`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ platform, user_id: currentUserId })
        });
        if (elements.shareCount) {
            let current = parseInt(elements.shareCount.textContent) || 0;
            elements.shareCount.textContent = current + 1;
        }
        showToast(`Shared on ${platform}!`, 'success');
        return response;
    } catch (error) { return null; }
}

// ============================================
// Generate Model Ideas
// ============================================

async function generateModelIdeas() {
    const educationLevel = elements.educationLevel.value;
    const mathCategory = elements.mathCategory.value;
    const specificTopic = elements.specificTopic.value;
    if (!educationLevel || !mathCategory) { showToast('Please select both fields', 'error'); return; }
    showLoading();
    try {
        const prompt = `Generate 3 detailed mathematics model ideas for ${educationLevel} level focusing on ${mathCategory}. ${specificTopic ? `Specifically about ${specificTopic}.` : ''}
        For each model provide: Title, Concept explanation, Materials needed (low-cost), Step-by-step guide, Learning outcomes.`;
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer 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', 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'deepseek/deepseek-chat-v3.1:free', messages: [{ role: 'user', content: prompt }] })
        });
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        displayResults(data.choices[0].message.content);
        await incrementUsage();
    } catch (error) {
        displayFallbackResults();
        showToast('Using offline model ideas', 'info');
    }
    hideLoading();
}

function displayResults(content) {
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/### (.*?)\n/g, '<h4><i class="fas fa-cube"></i> $1</h4>').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    elements.modelContent.innerHTML = `<div class="models-container">${formatted}</div>`;
}

function displayFallbackResults() {
    elements.modelContent.innerHTML = `<div class="models-container">
        <div class="model-card"><h4>3D Geometric Shapes</h4><p>Create physical 3D shapes using cardboard to understand vertices, edges, and faces.</p></div>
        <div class="model-card"><h4>Algebra Balance</h4><p>Use cardboard and cups to create a balance scale for understanding equations.</p></div>
        <div class="model-card"><h4>Fraction Circles</h4><p>Create circular fraction models using paper plates to visualize fractions.</p></div>
    </div>`;
}

// ============================================
// Professional Assessment Tool (15 Criteria)
// ============================================

function openAssessmentTool() {
    const modalBody = document.getElementById('assessmentModalBody');
    const topic = elements.specificTopic.value || 'Mathematics Model';
    const level = elements.educationLevel.options[elements.educationLevel.selectedIndex]?.text || 'General';
    
    let criteriaHtml = '<div class="criteria-grid">';
    CRITERIA.forEach((c, idx) => {
        criteriaHtml += `
            <div class="criteria-card">
                <div class="criteria-label">
                    <span><strong>${idx + 1}. ${c.name}</strong> <small>(${c.weight}x)</small></span>
                    <span>${c.description}</span>
                </div>
                <input type="range" class="criteria-slider" data-criteria="${c.id}" min="0" max="${c.maxScore}" value="7" step="1" style="width: 100%">
                <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                    <span>0</span>
                    <span><input type="number" class="score-input" data-criteria="${c.id}" min="0" max="${c.maxScore}" value="7" style="width: 60px; text-align: center;"></span>
                    <span>${c.maxScore}</span>
                </div>
                <div class="weighted-score" id="weighted-${c.id}" style="font-size: 0.8rem; margin-top: 5px;">Weighted: 0</div>
            </div>
        `;
    });
    criteriaHtml += '</div>';
    
    modalBody.innerHTML = `
        <div class="assessment-report" id="assessmentReport">
            <div class="report-header" style="text-align: center; margin-bottom: 1.5rem;">
                <h2><i class="fas fa-clipboard-list"></i> Comprehensive Student Assessment Report</h2>
                <p>Model: ${topic} | Level: ${level} | Date: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                <div><label>Student Name:</label> <input type="text" id="studentName" class="assessment-input" placeholder="Enter student name"></div>
                <div><label>Roll Number:</label> <input type="text" id="rollNumber" class="assessment-input" placeholder="Enter roll number"></div>
                <div><label>Class/Section:</label> <input type="text" id="classSection" class="assessment-input" placeholder="Class & Section"></div>
            </div>
            
            ${criteriaHtml}
            
            <div class="score-summary" id="scoreSummary"></div>
            
            <div class="chart-container">
                <canvas id="assessmentChart" width="400" height="400"></canvas>
            </div>
            
            <h3><i class="fas fa-trophy"></i> Strengths</h3>
            <div id="strengthsList"></div>
            
            <h3><i class="fas fa-exclamation-triangle"></i> Areas for Improvement</h3>
            <div id="weaknessesList"></div>
            
            <h3><i class="fas fa-rocket"></i> Actionable Recommendations</h3>
            <div id="improvementsList"></div>
            
            <div class="teacher-suggestion">
                <h4><i class="fas fa-chalkboard-user"></i> Teacher's Detailed Comments</h4>
                <textarea id="teacherSuggestions" rows="4" class="assessment-textarea" placeholder="Write your personalized feedback, suggestions for parents, and next steps for the student..."></textarea>
            </div>
            
            <div class="report-actions">
                <button class="btn-primary" id="calculateAssessmentBtn"><i class="fas fa-calculator"></i> Calculate & Generate Full Report</button>
                <button class="btn-outline" id="downloadReportBtn"><i class="fas fa-download"></i> Download PDF Report</button>
                <button class="btn-outline" id="printReportBtn"><i class="fas fa-print"></i> Print Report</button>
                <button class="btn-outline" id="saveReportBtn"><i class="fas fa-save"></i> Save Report</button>
            </div>
        </div>
    `;
    
    // Add event listeners for sliders and inputs
    CRITERIA.forEach(c => {
        const slider = document.querySelector(`.criteria-slider[data-criteria="${c.id}"]`);
        const input = document.querySelector(`.score-input[data-criteria="${c.id}"]`);
        if (slider && input) {
            slider.addEventListener('input', (e) => { input.value = e.target.value; calculateAssessment(); });
            input.addEventListener('input', (e) => { slider.value = e.target.value; calculateAssessment(); });
        }
    });
    
    document.getElementById('calculateAssessmentBtn')?.addEventListener('click', calculateAssessment);
    document.getElementById('downloadReportBtn')?.addEventListener('click', () => downloadAssessmentReport());
    document.getElementById('printReportBtn')?.addEventListener('click', () => window.print());
    document.getElementById('saveReportBtn')?.addEventListener('click', saveAssessmentReport);
    
    elements.assessmentModal.classList.add('active');
    calculateAssessment();
}

function calculateAssessment() {
    let totalWeightedScore = 0;
    let totalMaxWeighted = 0;
    let scores = {};
    
    CRITERIA.forEach(c => {
        let score = parseInt(document.querySelector(`.score-input[data-criteria="${c.id}"]`)?.value) || 0;
        let weightedScore = score * c.weight;
        let maxWeighted = c.maxScore * c.weight;
        totalWeightedScore += weightedScore;
        totalMaxWeighted += maxWeighted;
        scores[c.id] = score;
        document.getElementById(`weighted-${c.id}`).innerHTML = `Weighted: ${weightedScore} / ${maxWeighted}`;
    });
    
    let percentage = (totalWeightedScore / totalMaxWeighted) * 100;
    let totalMarks = totalWeightedScore.toFixed(1);
    let maxMarks = totalMaxWeighted;
    
    let grade = 'F', gradeClass = 'grade-F';
    if (percentage >= 95) { grade = 'A+'; gradeClass = 'grade-A-plus'; }
    else if (percentage >= 85) { grade = 'A'; gradeClass = 'grade-A'; }
    else if (percentage >= 75) { grade = 'B+'; gradeClass = 'grade-B'; }
    else if (percentage >= 65) { grade = 'B'; gradeClass = 'grade-B'; }
    else if (percentage >= 55) { grade = 'C'; gradeClass = 'grade-C'; }
    else if (percentage >= 45) { grade = 'D'; gradeClass = 'grade-D'; }
    
    document.getElementById('scoreSummary').innerHTML = `
        <div class="score-circle" style="background: conic-gradient(var(--baby-orange) 0deg ${percentage * 3.6}deg, var(--gray-200) ${percentage * 3.6}deg 360deg)">
            <div class="score-value">${Math.round(percentage)}%</div>
            <div class="score-label">Percentage</div>
        </div>
        <div style="text-align: center">
            <span class="grade-badge ${gradeClass}">Grade: ${grade}</span>
            <p><strong>Total Score:</strong> ${totalMarks} / ${maxMarks}</p>
            <p><strong>Performance Level:</strong> ${percentage >= 75 ? 'Excellent' : percentage >= 60 ? 'Good' : percentage >= 45 ? 'Satisfactory' : 'Needs Improvement'}</p>
        </div>
    `;
    
    // Generate strengths (scores >= 7)
    let strengths = [];
    let weaknesses = [];
    let improvements = [];
    
    CRITERIA.forEach(c => {
        let score = scores[c.id];
        if (score >= 8) strengths.push(`${c.name}: Excellent performance (${score}/10)`);
        else if (score >= 6) strengths.push(`${c.name}: Good effort (${score}/10)`);
        else if (score <= 4) weaknesses.push(`${c.name}: Needs significant improvement (${score}/10) - ${c.description}`);
        else if (score <= 5) weaknesses.push(`${c.name}: Could be better (${score}/10) - Focus on ${c.description.toLowerCase()}`);
    });
    
    CRITERIA.forEach(c => {
        let score = scores[c.id];
        if (score <= 5) {
            if (c.id === 'accuracy') improvements.push('Practice more problems related to the mathematical concept. Review fundamentals.');
            else if (c.id === 'construction') improvements.push('Pay more attention to measurements and neatness. Use a ruler for precision.');
            else if (c.id === 'presentation') improvements.push('Prepare key points before presenting. Practice explaining to family members.');
            else if (c.id === 'material') improvements.push('Look for creative recycled materials at home like bottles, boxes, and newspapers.');
            else improvements.push(`Focus on improving ${c.name}. Review the feedback and try again.`);
        }
    });
    
    if (strengths.length === 0) strengths.push('Student shows basic understanding. Keep working hard!');
    if (weaknesses.length === 0) weaknesses.push('No major weaknesses identified. Student is performing well!');
    if (improvements.length === 0) improvements.push('Continue the good work! Try exploring advanced concepts.');
    
    document.getElementById('strengthsList').innerHTML = strengths.map(s => `<div class="strength-item"><i class="fas fa-star" style="color: var(--green)"></i> ${s}</div>`).join('');
    document.getElementById('weaknessesList').innerHTML = weaknesses.map(w => `<div class="weakness-item"><i class="fas fa-exclamation-circle" style="color: var(--red)"></i> ${w}</div>`).join('');
    document.getElementById('improvementsList').innerHTML = improvements.map(i => `<div class="improvement-item"><i class="fas fa-arrow-up" style="color: var(--yellow)"></i> ${i}</div>`).join('');
    
    // Update chart
    if (assessmentChart) assessmentChart.destroy();
    const ctx = document.getElementById('assessmentChart')?.getContext('2d');
    if (ctx) {
        assessmentChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: CRITERIA.map(c => c.name),
                datasets: [{
                    label: 'Scores (0-10)',
                    data: CRITERIA.map(c => scores[c.id]),
                    backgroundColor: 'rgba(255,159,74,0.2)',
                    borderColor: 'var(--baby-orange)',
                    borderWidth: 2,
                    pointBackgroundColor: 'var(--baby-sky)',
                    pointBorderColor: '#fff',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: { r: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } } },
                plugins: { tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}/10` } } }
            }
        });
    }
}

function downloadAssessmentReport() {
    const reportElement = document.getElementById('assessmentReport');
    if (!reportElement) { showToast('Generate report first', 'error'); return; }
    const studentName = document.getElementById('studentName')?.value || 'Student';
    const opt = { margin: [0.5, 0.5, 0.5, 0.5], filename: `${studentName}_assessment_report.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, letterRendering: true }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } };
    html2pdf().set(opt).from(reportElement).save();
    showToast('Report downloaded!', 'success');
}

function saveAssessmentReport() {
    const studentName = document.getElementById('studentName')?.value || 'Student';
    const reportData = {
        studentName: studentName,
        rollNumber: document.getElementById('rollNumber')?.value,
        classSection: document.getElementById('classSection')?.value,
        date: new Date().toISOString(),
        scores: {}
    };
    CRITERIA.forEach(c => {
        reportData.scores[c.id] = parseInt(document.querySelector(`.score-input[data-criteria="${c.id}"]`)?.value) || 0;
    });
    reportData.teacherComments = document.getElementById('teacherSuggestions')?.value || '';
    localStorage.setItem(`${TOOL_SLUG}_report_${Date.now()}`, JSON.stringify(reportData));
    showToast('Report saved locally!', 'success');
}

// ============================================
// Export Functions
// ============================================

function exportToPDF() { if (elements.modelContent.innerHTML) html2pdf().from(elements.modelContent).save(); else showToast('Generate models first', 'error'); }
function exportToWord() { const blob = new Blob([`<html><head><meta charset="utf-8"><title>Math Models</title></head><body>${elements.modelContent.innerHTML}</body></html>`], { type: 'application/msword' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'math-models.doc'; link.click(); URL.revokeObjectURL(link.href); showToast('Word document downloaded!', 'success'); }
function copyToClipboard() { navigator.clipboard.writeText(elements.modelContent.innerText); showToast('Copied!', 'success'); }

// ============================================
// Theme, Random, Clear, Scroll
// ============================================

function initTheme() { if (isDarkMode) { document.body.classList.add('dark'); elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; } else { document.body.classList.remove('dark'); elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; } }
function toggleTheme() { isDarkMode = !isDarkMode; localStorage.setItem('darkMode', isDarkMode); initTheme(); showToast(`${isDarkMode ? 'Dark' : 'Light'} mode`, 'info'); }
function randomTopic() { const topics = ['Pythagorean Theorem', 'Quadratic Equations', 'Circle Properties', 'Trigonometry', 'Linear Equations', 'Probability']; elements.specificTopic.value = topics[Math.floor(Math.random() * topics.length)]; elements.mathCategory.value = 'shapes'; showToast('Random topic selected', 'info'); }
function clearForm() { elements.educationLevel.value = ''; elements.mathCategory.value = ''; elements.specificTopic.value = ''; showToast('Form cleared', 'info'); }
function scrollUp() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollDown() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

// ============================================
// Event Listeners & Initialization
// ============================================

function setupEventListeners() {
    elements.generateBtn.addEventListener('click', generateModelIdeas);
    elements.randomBtn.addEventListener('click', randomTopic);
    elements.clearBtn.addEventListener('click', clearForm);
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.scrollUpBtn.addEventListener('click', scrollUp);
    elements.scrollDownBtn.addEventListener('click', scrollDown);
    elements.copyBtn?.addEventListener('click', copyToClipboard);
    elements.exportPDFBtn?.addEventListener('click', exportToPDF);
    elements.exportDocBtn?.addEventListener('click', exportToWord);
    elements.openAssessmentBtn?.addEventListener('click', openAssessmentTool);
    elements.closeModalBtn?.addEventListener('click', () => elements.assessmentModal.classList.remove('active'));
    elements.assessmentModal?.addEventListener('click', (e) => { if (e.target === elements.assessmentModal) elements.assessmentModal.classList.remove('active'); });
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const platform = btn.getAttribute('data-platform');
            if (platform === 'copy') { navigator.clipboard.writeText(window.location.href); showToast('Link copied!', 'success'); return; }
            const url = `https://${platform === 'facebook' ? 'www.facebook.com/sharer/sharer.php?u=' : platform === 'twitter' ? 'twitter.com/intent/tweet?text=' : platform === 'whatsapp' ? 'wa.me/?text=' : ''}${encodeURIComponent(window.location.href)}`;
            if (url) window.open(url, '_blank');
            await addShare(platform);
        });
    });
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.getAttribute('data-emoji')));
    });
}

async function init() {
    initTheme();
    setupEventListeners();
    await getUsage();
    await getReactions();
    showToast('Mathematics Models Generator ready!', 'success');
}

init();
