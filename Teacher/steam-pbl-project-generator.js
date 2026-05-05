// ============================================
// STEAM PBL PROJECT GENERATOR - FULLY INTEGRATED
// TiDB + Vercel + Grok API + Reactions + Usage Counter
// Version 4.0 - Production Ready with Real APIs
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const TOOL_SLUG = 'steam-pbl-project-generator';
const API_BASE = '/api'; // This will work with Vercel deployment

// Generate unique session ID
let sessionId = localStorage.getItem('session_id');
if (!sessionId) {
    sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('session_id', sessionId);
}

// Chart instances
let strengthChart = null;
let weaknessChart = null;
let improvementChart = null;

// Current assessment data
let currentAssessmentData = null;
let currentTotalMarks = 100;
let currentProjectData = null;

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    gradeLevel: document.getElementById('grade-level'),
    subjectFocus: document.getElementById('subject-focus'),
    complexity: document.getElementById('complexity'),
    keywords: document.getElementById('keywords'),
    generateBtn: document.getElementById('generate-btn'),
    randomBtn: document.getElementById('random-btn'),
    resetBtn: document.getElementById('reset-btn'),
    resultContainer: document.getElementById('result-container'),
    projectTitle: document.getElementById('project-title'),
    projectDescription: document.getElementById('project-description'),
    projectSteps: document.getElementById('project-steps'),
    projectResources: document.getElementById('project-resources'),
    assemblySteps: document.getElementById('assembly-steps'),
    rubricContent: document.getElementById('rubric-content'),
    copyProjectBtn: document.getElementById('copy-project-btn'),
    saveProjectBtn: document.getElementById('save-project-btn'),
    exportTxtBtn: document.getElementById('export-txt-btn'),
    exportDocBtn: document.getElementById('export-doc-btn'),
    exportPdfBtn: document.getElementById('export-pdf-btn'),
    exportCsvBtn: document.getElementById('export-csv-btn'),
    darkModeToggle: document.getElementById('dark-mode-toggle'),
    premiumBtn: document.getElementById('premium-btn-header'),
    premiumModal: document.getElementById('premium-modal'),
    scrollUp: document.getElementById('scroll-up'),
    scrollDown: document.getElementById('scroll-down'),
    loadingOverlay: document.getElementById('loading-overlay'),
    toastContainer: document.getElementById('toast-container'),
    toolUsageCount: document.getElementById('tool-usage-count'),
    toolReactionCount: document.getElementById('tool-reaction-count'),
    globalUsageCount: document.getElementById('global-usage-count'),
    globalReactionsCount: document.getElementById('global-reactions-count'),
    globalSharesCount: document.getElementById('global-shares-count'),
    shareCount: document.getElementById('share-count'),
    reactionLike: document.getElementById('reaction-like'),
    reactionLove: document.getElementById('reaction-love'),
    reactionWow: document.getElementById('reaction-wow'),
    reactionSad: document.getElementById('reaction-sad'),
    reactionAngry: document.getElementById('reaction-angry'),
    reactionLaugh: document.getElementById('reaction-laugh'),
    reactionCelebrate: document.getElementById('reaction-celebrate'),
    downloadChecklistBtn: document.getElementById('download-checklist-btn'),
    uploadChecklistBtn: document.getElementById('upload-checklist-btn'),
    analyzeOnlineBtn: document.getElementById('analyze-online-btn'),
    checklistFileInput: document.getElementById('checklist-file-input'),
    analysisContainer: document.getElementById('analysis-container'),
    exportReportPdf: document.getElementById('export-report-pdf'),
    printReport: document.getElementById('print-report'),
    dbStatusText: document.getElementById('db-status-text')
};

// Reaction mapping
const reactionMap = {
    '👍': 'like', '❤️': 'love', '😮': 'wow',
    '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading() { elements.loadingOverlay.style.display = 'flex'; }
function hideLoading() { elements.loadingOverlay.style.display = 'none'; }

// ============================================
// API CALLS (Real TiDB + Vercel Integration)
// ============================================

// Generic API caller for tool-specific endpoints
async function apiCall(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE}/${TOOL_SLUG}/${endpoint}`;
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

// Direct API calls for global endpoints
async function directApiCall(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE}${endpoint}`;
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

// Check database health
async function checkDatabaseHealth() {
    try {
        const result = await directApiCall('/health', 'GET');
        if (result.success && result.database === 'connected') {
            elements.dbStatusText.innerHTML = '✅ Live Database Connected';
            elements.dbStatusText.style.color = '#10b981';
            return true;
        } else {
            elements.dbStatusText.innerHTML = '⚠️ Using Local Fallback';
            elements.dbStatusText.style.color = '#fbbf24';
            return false;
        }
    } catch (error) {
        elements.dbStatusText.innerHTML = '🔌 Offline Mode';
        elements.dbStatusText.style.color = '#ef4444';
        return false;
    }
}

// Usage Counter APIs
async function incrementUsage() {
    const result = await apiCall('usage', 'POST', { user_id: sessionId });
    if (result.success && result.total_usage) {
        elements.toolUsageCount.textContent = result.total_usage;
    } else {
        // Fallback to localStorage if API fails
        let count = parseInt(localStorage.getItem('tool_usage_count') || 0) + 1;
        localStorage.setItem('tool_usage_count', count);
        elements.toolUsageCount.textContent = count;
    }
    await fetchGlobalStats();
}

async function fetchUsage() {
    const result = await apiCall('usage', 'GET');
    if (result.success) {
        elements.toolUsageCount.textContent = result.count || 0;
    } else {
        let count = parseInt(localStorage.getItem('tool_usage_count') || 0);
        elements.toolUsageCount.textContent = count;
    }
}

// Reactions APIs
async function addReaction(emoji, reactionType) {
    // Check if user already reacted (local check)
    const reacted = localStorage.getItem(`reacted_${reactionType}`);
    if (reacted) {
        showToast(`${emoji} You already reacted with this emoji!`, 'info');
        return;
    }
    
    const result = await apiCall('reactions', 'POST', {
        emoji: emoji,
        reaction_type: reactionType,
        user_id: sessionId
    });
    
    if (result.success) {
        localStorage.setItem(`reacted_${reactionType}`, 'true');
        await fetchReactions();
        showToast(`${emoji} Added! Thanks for your feedback!`, 'success');
    } else if (result.already_reacted) {
        localStorage.setItem(`reacted_${reactionType}`, 'true');
        showToast(`${emoji} You already reacted!`, 'info');
    } else {
        showToast('Failed to add reaction', 'error');
    }
}

async function fetchReactions() {
    const result = await apiCall('reactions', 'GET');
    if (result.success && result.reactions) {
        elements.reactionLike.textContent = result.reactions.like || 0;
        elements.reactionLove.textContent = result.reactions.love || 0;
        elements.reactionWow.textContent = result.reactions.wow || 0;
        elements.reactionSad.textContent = result.reactions.sad || 0;
        elements.reactionAngry.textContent = result.reactions.angry || 0;
        elements.reactionLaugh.textContent = result.reactions.laugh || 0;
        elements.reactionCelebrate.textContent = result.reactions.celebrate || 0;
        
        const total = Object.values(result.reactions).reduce((a, b) => a + b, 0);
        elements.toolReactionCount.textContent = total;
    }
}

// Shares APIs
async function addShare(platform) {
    const result = await apiCall('shares', 'POST', {
        platform: platform,
        user_id: sessionId
    });
    if (result.success) {
        await fetchShares();
        showToast(`Shared on ${platform}!`, 'success');
    }
}

async function fetchShares() {
    const result = await apiCall('shares', 'GET');
    if (result.success) {
        elements.shareCount.textContent = result.shares || 0;
    }
}

// Global Stats API
async function fetchGlobalStats() {
    const result = await directApiCall('/global-stats', 'GET');
    if (result.success) {
        elements.globalUsageCount.textContent = result.totalUsage || 0;
        elements.globalSharesCount.textContent = result.totalShares || 0;
    }
}

// ============================================
// AI PROJECT GENERATION (via Grok API through backend)
// ============================================
async function generateProjectWithAI(grade, subject, complexity, keywords) {
    showLoading();
    
    try {
        // Call the backend API that will use Grok API
        const response = await fetch(`${API_BASE}/generate-pbl-project`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grade,
                subject,
                complexity,
                keywords: keywords || '',
                tool_slug: TOOL_SLUG
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.project) {
                hideLoading();
                return data.project;
            }
        }
        throw new Error('AI generation failed');
    } catch (error) {
        console.log('AI API error, using fallback generation:', error);
        hideLoading();
        return generateFallbackProject(grade, subject, complexity, keywords);
    }
}

// Fallback Project Generator (when API is unavailable)
function generateFallbackProject(grade, subject, complexity, keywords) {
    const topics = keywords ? keywords.split(',').map(t => t.trim()) : 
        ['Renewable Energy', 'Space Exploration', 'Robotics', 'Ecosystem', 'Artificial Intelligence', 'Climate Change'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    const complexitySettings = {
        beginner: { steps: 4, assembly: 4, duration: '1-2 weeks' },
        intermediate: { steps: 6, assembly: 6, duration: '3-4 weeks' },
        advanced: { steps: 8, assembly: 8, duration: '5+ weeks' }
    };
    const settings = complexitySettings[complexity] || complexitySettings.intermediate;
    
    const subjects = {
        science: 'Science', technology: 'Technology', engineering: 'Engineering',
        arts: 'Arts', math: 'Mathematics', integrated: 'STEAM'
    };
    const subjectArea = subjects[subject] || 'STEAM';
    
    const title = `${subjectArea} ${topic} Challenge`;
    const description = `Students will explore ${topic} through a ${subject} lens, developing innovative solutions to real-world problems. This ${settings.duration} project challenges students to apply critical thinking, collaboration, and creativity.`;
    
    const steps = [
        `🔍 Research and explore ${topic} concepts`,
        `💡 Identify key problems related to ${topic}`,
        `🧠 Brainstorm innovative solutions`,
        `🎨 Design and prototype your solution`,
        `⚙️ Test and iterate based on feedback`,
        `📊 Prepare final presentation`,
        `🎤 Present to authentic audience`,
        `📝 Reflect on learning and process`
    ];
    while (steps.length > settings.steps) steps.pop();
    
    const resources = [
        { type: 'video', title: `Introduction to ${topic}`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+education` },
        { type: 'website', title: `${topic} Learning Resources`, url: `https://www.khanacademy.org/search?search_query=${encodeURIComponent(topic)}` },
        { type: 'book', title: `The ${topic} Handbook`, author: 'Expert Educator' }
    ];
    
    const assembly = [];
    const phaseNames = ['Planning & Research', 'Design & Development', 'Testing & Refinement', 'Presentation & Reflection'];
    for (let i = 0; i < settings.assembly; i++) {
        assembly.push({
            step: `Phase ${i + 1}: ${phaseNames[i] || 'Project Work'}`,
            teacherTip: `Provide scaffolding and checkpoints for students at this phase`,
            studentInstruction: `Document your progress and note any challenges faced`
        });
    }
    
    const assessment = [
        { criteria: "Research & Information Gathering", marks: 8, score: 0 },
        { criteria: "Problem Identification & Analysis", marks: 7, score: 0 },
        { criteria: "Creativity & Innovation in Solution", marks: 8, score: 0 },
        { criteria: "Design & Prototype Development", marks: 7, score: 0 },
        { criteria: "Technical Execution & Accuracy", marks: 7, score: 0 },
        { criteria: "Collaboration & Teamwork", marks: 6, score: 0 },
        { criteria: "Communication & Presentation", marks: 7, score: 0 },
        { criteria: "Critical Thinking & Problem Solving", marks: 7, score: 0 },
        { criteria: "Use of Resources & Materials", marks: 5, score: 0 },
        { criteria: "Time Management & Planning", marks: 5, score: 0 },
        { criteria: "Reflection & Self-Assessment", marks: 6, score: 0 },
        { criteria: "Connection to Real-World Context", marks: 7, score: 0 },
        { criteria: "Integration of STEAM Concepts", marks: 8, score: 0 },
        { criteria: "Final Product Quality", marks: 6, score: 0 },
        { criteria: "Overall Impact & Innovation", marks: 6, score: 0 }
    ];
    
    return { title, description, steps, resources, assembly, assessment };
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================
function displayProject(project) {
    currentProjectData = project;
    
    elements.projectTitle.textContent = project.title;
    elements.projectDescription.textContent = project.description;
    
    elements.projectSteps.innerHTML = '';
    project.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        elements.projectSteps.appendChild(li);
    });
    
    elements.projectResources.innerHTML = '';
    project.resources.forEach(resource => {
        const div = document.createElement('div');
        if (resource.type === 'book') {
            div.innerHTML = `<div class="resource-link"><i class="fas fa-book"></i> <strong>${resource.title}</strong> by ${resource.author}</div>`;
        } else {
            div.innerHTML = `<a href="${resource.url}" target="_blank" class="resource-link"><i class="fas fa-${resource.type === 'video' ? 'video' : 'globe'}"></i> ${resource.title}</a>`;
        }
        elements.projectResources.appendChild(div);
    });
    
    // Display Assembly Guide
    elements.assemblySteps.innerHTML = '';
    if (project.assembly && project.assembly.length) {
        project.assembly.forEach((step, idx) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'assembly-step';
            stepDiv.innerHTML = `
                <h4><span class="step-number">${idx + 1}</span> ${step.step}</h4>
                <div class="teacher-tip"><strong>🏫 Teacher Tip:</strong> ${step.teacherTip}</div>
                <div class="student-instruction"><strong>📚 Student Instruction:</strong> ${step.studentInstruction}</div>
            `;
            elements.assemblySteps.appendChild(stepDiv);
        });
    }
    
    // Display Assessment Checklist
    displayAssessmentChecklist(project.assessment);
    elements.resultContainer.style.display = 'block';
    elements.resultContainer.scrollIntoView({ behavior: 'smooth' });
}

function displayAssessmentChecklist(assessment) {
    if (!assessment || !assessment.length) return;
    
    let tableHtml = `<table class="checklist-table">
        <thead>
            <tr><th width="45%">Assessment Criteria</th>
                <th width="10%">Marks</th>
                <th width="20%">Obtained (0-${Math.max(...assessment.map(a=>a.marks))})</th>
                <th width="25%">Feedback</th>
            </tr>
        </thead>
        <tbody>`;
    
    let totalAllocated = 0;
    assessment.forEach((item, idx) => {
        totalAllocated += item.marks;
        tableHtml += `
            <tr data-criteria-idx="${idx}" data-criteria-name="${item.criteria}" data-max-marks="${item.marks}">
                <td><strong>${idx + 1}. ${item.criteria}</strong></td>
                <td style="text-align: center;">${item.marks}</td>
                <td><input type="number" class="marks-obtained" min="0" max="${item.marks}" value="0" step="1" style="width: 80px; padding: 6px;"></td>
                <td><input type="text" class="remarks-input" placeholder="Add feedback..." style="width: 100%; padding: 6px;"></td>
            </tr>
        `;
    });
    
    tableHtml += `
        <tr class="total-marks-row">
            <td><strong>TOTAL SCORE</strong></td>
            <td style="text-align: center;"><strong>${totalAllocated}</strong></td>
            <td><strong id="total-marks-obtained">0</strong></td>
            <td><strong id="percentage-display">0%</strong></td>
        </tr>
    </tbody></table>`;
    
    elements.rubricContent.innerHTML = tableHtml;
    currentTotalMarks = totalAllocated;
    
    document.querySelectorAll('.marks-obtained').forEach(input => {
        input.addEventListener('change', () => updateTotalMarks());
        input.addEventListener('input', () => updateTotalMarks());
    });
    
    updateTotalMarks();
}

function updateTotalMarks() {
    const inputs = document.querySelectorAll('.marks-obtained');
    let total = 0;
    const criteriaScores = [];
    
    inputs.forEach((input, idx) => {
        let val = parseInt(input.value) || 0;
        const max = parseInt(input.closest('tr').getAttribute('data-max-marks')) || 0;
        if (val > max) val = max;
        if (val < 0) val = 0;
        input.value = val;
        total += val;
        
        const criteriaName = input.closest('tr').getAttribute('data-criteria-name') || `Criteria ${idx + 1}`;
        const allocated = max;
        const percentage = allocated > 0 ? (val / allocated) * 100 : 0;
        criteriaScores.push({ name: criteriaName, obtained: val, allocated, percentage });
    });
    
    document.getElementById('total-marks-obtained').textContent = total;
    const percentage = currentTotalMarks > 0 ? ((total / currentTotalMarks) * 100).toFixed(1) : 0;
    document.getElementById('percentage-display').textContent = `${percentage}%`;
    
    currentAssessmentData = { totalObtained: total, totalAllocated: currentTotalMarks, percentage: parseFloat(percentage), criteriaScores };
}

// ============================================
// ASSESSMENT ANALYSIS
// ============================================
function analyzeOnline() {
    updateTotalMarks();
    if (currentAssessmentData) {
        performAssessmentAnalysis();
        showToast('✅ Analysis complete! Check your detailed report.', 'success');
    } else {
        showToast('Please enter marks in the checklist first', 'error');
    }
}

function performAssessmentAnalysis() {
    if (!currentAssessmentData) return;
    
    const { totalObtained, totalAllocated, percentage, criteriaScores } = currentAssessmentData;
    
    document.getElementById('total-score').textContent = totalObtained;
    document.getElementById('total-marks').textContent = `/ ${totalAllocated}`;
    document.getElementById('percentage').textContent = `${percentage}%`;
    
    let grade = 'F';
    let gradeColor = '#ef4444';
    if (percentage >= 90) { grade = 'A+'; gradeColor = '#10b981'; }
    else if (percentage >= 80) { grade = 'A'; gradeColor = '#22c55e'; }
    else if (percentage >= 70) { grade = 'B'; gradeColor = '#fbbf24'; }
    else if (percentage >= 60) { grade = 'C'; gradeColor = '#f97316'; }
    else if (percentage >= 50) { grade = 'D'; gradeColor = '#f59e0b'; }
    
    const gradeSpan = document.getElementById('grade-letter');
    gradeSpan.textContent = grade;
    gradeSpan.style.color = gradeColor;
    
    const strengths = criteriaScores.filter(c => c.percentage >= 75);
    const weaknesses = criteriaScores.filter(c => c.percentage >= 50 && c.percentage < 75);
    const improvements = criteriaScores.filter(c => c.percentage < 50);
    
    document.getElementById('strength-list').innerHTML = strengths.length ? strengths.map(c => `<li>${c.name}: ${c.percentage.toFixed(1)}% (${c.obtained}/${c.allocated})</li>`).join('') : '<li>Keep working hard!</li>';
    document.getElementById('weakness-list').innerHTML = weaknesses.length ? weaknesses.map(c => `<li>${c.name}: ${c.percentage.toFixed(1)}% - Needs attention</li>`).join('') : '<li>No major weaknesses!</li>';
    document.getElementById('improvement-list').innerHTML = improvements.length ? improvements.map(c => `<li>${c.name}: ${c.percentage.toFixed(1)}% - Critical</li>`).join('') : '<li>Excellent performance!</li>';
    
    document.getElementById('teacher-guidelines').innerHTML = `
        <li>Focus on areas below 50%: ${improvements.map(c => c.name).join(', ') || 'None'}</li>
        <li>Provide additional scaffolding and one-on-one support</li>
        <li>Use differentiated instruction techniques</li>
        <li>Schedule regular checkpoints and feedback sessions</li>
    `;
    
    document.getElementById('student-guidelines').innerHTML = `
        <li>Review criteria below 50%: ${improvements.map(c => c.name).join(', ') || 'None'}</li>
        <li>Seek help from teacher or peers for challenging concepts</li>
        <li>Practice more on areas that need improvement</li>
        <li>Set specific goals for each criteria</li>
    `;
    
    createCharts(criteriaScores);
    elements.analysisContainer.style.display = 'block';
    elements.analysisContainer.scrollIntoView({ behavior: 'smooth' });
}

function createCharts(criteriaScores) {
    const labels = criteriaScores.map(c => c.name.length > 20 ? c.name.substring(0, 18) + '...' : c.name);
    const percentages = criteriaScores.map(c => c.percentage);
    
    const strengthCtx = document.getElementById('strengthChart')?.getContext('2d');
    if (strengthCtx) {
        if (strengthChart) strengthChart.destroy();
        strengthChart = new Chart(strengthCtx, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Score (%)', data: percentages, backgroundColor: 'rgba(16, 185, 129, 0.7)', borderColor: '#10b981' }] },
            options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }
        });
    }
    
    const weaknessCtx = document.getElementById('weaknessChart')?.getContext('2d');
    if (weaknessCtx) {
        if (weaknessChart) weaknessChart.destroy();
        const marksLost = currentAssessmentData.totalAllocated - currentAssessmentData.totalObtained;
        weaknessChart = new Chart(weaknessCtx, {
            type: 'doughnut',
            data: { labels: ['Obtained', 'Lost'], datasets: [{ data: [currentAssessmentData.totalObtained, marksLost], backgroundColor: ['#10b981', '#ef4444'] }] },
            options: { responsive: true }
        });
    }
    
    const improvementCtx = document.getElementById('improvementChart')?.getContext('2d');
    if (improvementCtx) {
        if (improvementChart) improvementChart.destroy();
        improvementChart = new Chart(improvementCtx, {
            type: 'radar',
            data: { labels, datasets: [{ label: 'Score %', data: percentages, backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: '#8b5cf6' }] },
            options: { responsive: true, scales: { r: { beginAtZero: true, max: 100 } } }
        });
    }
}

// ============================================
// CHECKLIST DOWNLOAD / UPLOAD
// ============================================
function downloadChecklist() {
    const checklistData = {
        tool: TOOL_SLUG,
        timestamp: new Date().toISOString(),
        projectTitle: elements.projectTitle.textContent,
        totalMarks: currentTotalMarks,
        criteria: []
    };
    
    document.querySelectorAll('.checklist-table tbody tr:not(.total-marks-row)').forEach(row => {
        const criteria = row.querySelector('td:first-child')?.innerText || '';
        const marksAllocated = parseInt(row.querySelector('td:nth-child(2)')?.innerText || 0);
        checklistData.criteria.push({ criteria, marksAllocated, marksObtained: 0, remarks: '' });
    });
    
    const blob = new Blob([JSON.stringify(checklistData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checklist_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Checklist downloaded!', 'success');
}

function uploadChecklist() {
    elements.checklistFileInput.click();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.criteria && data.criteria.length) {
                const inputs = document.querySelectorAll('.marks-obtained');
                data.criteria.forEach((item, idx) => {
                    if (inputs[idx]) inputs[idx].value = item.marksObtained || 0;
                });
                updateTotalMarks();
                performAssessmentAnalysis();
                showToast('Checklist uploaded and analyzed!', 'success');
            }
        } catch (error) {
            showToast('Error parsing file', 'error');
        }
    };
    reader.readAsText(file);
    elements.checklistFileInput.value = '';
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function getProjectText() {
    let text = `STEAM PBL PROJECT\n=================\n\nTITLE: ${elements.projectTitle.textContent}\n\nDESCRIPTION:\n${elements.projectDescription.textContent}\n\nPROJECT STEPS:\n`;
    Array.from(elements.projectSteps.querySelectorAll('li')).forEach((step, i) => text += `${i+1}. ${step.textContent}\n`);
    return text;
}

function exportTXT() {
    const blob = new Blob([getProjectText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('TXT exported!', 'success');
}

function exportDOC() {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>STEAM Project</title></head><body>${getProjectText().replace(/\n/g, '<br>')}</body></html>`;
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_${Date.now()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('DOC exported!', 'success');
}

function exportCSV() {
    let csv = "Criteria,Marks Allocated,Marks Obtained,Percentage,Remarks\n";
    document.querySelectorAll('.checklist-table tbody tr:not(.total-marks-row)').forEach(row => {
        const criteria = row.querySelector('td:first-child')?.innerText || '';
        const allocated = row.querySelector('td:nth-child(2)')?.innerText || '0';
        const obtained = row.querySelector('.marks-obtained')?.value || '0';
        const remarks = row.querySelector('.remarks-input')?.value || '';
        const pct = allocated > 0 ? ((parseInt(obtained) / parseInt(allocated)) * 100).toFixed(1) : 0;
        csv += `"${criteria}",${allocated},${obtained},${pct},"${remarks}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported!', 'success');
}

async function exportPDF() {
    showLoading();
    try {
        const element = elements.resultContainer;
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`steam_project_${Date.now()}.pdf`);
        showToast('PDF exported!', 'success');
    } catch (error) {
        showToast('PDF export failed', 'error');
    }
    hideLoading();
}

async function exportReportPDF() {
    showLoading();
    try {
        const element = elements.analysisContainer;
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`report_${Date.now()}.pdf`);
        showToast('Report exported!', 'success');
    } catch (error) {
        showToast('Report export failed', 'error');
    }
    hideLoading();
}

function printReport() {
    window.print();
}

// ============================================
// SHARE FUNCTIONS
// ============================================
function shareToFacebook() { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('facebook'); }
function shareToTwitter() { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('STEAM PBL Generator')}&url=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('twitter'); }
function shareToWhatsApp() { window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('whatsapp'); }
function shareToLinkedIn() { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('linkedin'); }
function shareToEmail() { window.location.href = `mailto:?subject=STEAM PBL Generator&body=${encodeURIComponent(window.location.href)}`; addShare('email'); }
async function copyURL() { await navigator.clipboard.writeText(window.location.href); showToast('Link copied!', 'success'); addShare('copy'); }

// ============================================
// EVENT HANDLERS
// ============================================
async function handleGenerate() {
    const grade = elements.gradeLevel.value;
    const subject = elements.subjectFocus.value;
    if (!grade || !subject) {
        showToast('Please select Grade Level and STEAM Focus', 'error');
        return;
    }
    
    showLoading();
    await incrementUsage();
    const project = await generateProjectWithAI(grade, subject, elements.complexity.value, elements.keywords.value);
    displayProject(project);
    hideLoading();
    showToast('Project generated successfully! 🎉', 'success');
}

function randomProject() {
    const grades = ['k-2', '3-5', '6-8', '9-12', 'college'];
    const subjects = ['science', 'technology', 'engineering', 'arts', 'math', 'integrated'];
    elements.gradeLevel.value = grades[Math.floor(Math.random() * grades.length)];
    elements.subjectFocus.value = subjects[Math.floor(Math.random() * subjects.length)];
    elements.complexity.value = ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)];
    showToast('Random selections applied! Click Generate', 'success');
}

function resetForm() {
    elements.gradeLevel.value = '';
    elements.subjectFocus.value = '';
    elements.complexity.value = 'intermediate';
    elements.keywords.value = '';
    showToast('Form reset', 'info');
}

function copyProject() {
    navigator.clipboard.writeText(getProjectText());
    showToast('Copied to clipboard!', 'success');
}

function saveProject() {
    if (currentProjectData) {
        const saved = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        saved.push({ ...currentProjectData, savedAt: new Date().toISOString() });
        localStorage.setItem('savedProjects', JSON.stringify(saved));
        showToast('Project saved to browser!', 'success');
    }
}

function setupReactions() {
    document.querySelectorAll('.reaction').forEach(reaction => {
        reaction.addEventListener('click', async () => {
            const emoji = reaction.getAttribute('data-emoji');
            const type = reaction.getAttribute('data-type');
            if (emoji && type) await addReaction(emoji, type);
        });
    });
}

function initDarkMode() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.body.setAttribute('data-theme', 'dark');
    elements.darkModeToggle.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        if (current === 'dark') {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            elements.darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            elements.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        showToast(`${localStorage.getItem('theme') === 'dark' ? 'Dark' : 'Light'} mode`, 'info');
    });
}

function initPremiumModal() {
    const modal = elements.premiumModal;
    const closeBtn = modal.querySelector('.premium-modal-close');
    elements.premiumBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
}

function initScrollButtons() {
    elements.scrollUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    elements.scrollDown.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    window.addEventListener('scroll', () => {
        elements.scrollUp.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    // Check database connection
    await checkDatabaseHealth();
    
    // Fetch all data from APIs
    await fetchUsage();
    await fetchReactions();
    await fetchShares();
    await fetchGlobalStats();
    
    // Setup event listeners
    elements.generateBtn.addEventListener('click', handleGenerate);
    elements.randomBtn.addEventListener('click', randomProject);
    elements.resetBtn.addEventListener('click', resetForm);
    elements.copyProjectBtn?.addEventListener('click', copyProject);
    elements.saveProjectBtn?.addEventListener('click', saveProject);
    elements.exportTxtBtn?.addEventListener('click', exportTXT);
    elements.exportDocBtn?.addEventListener('click', exportDOC);
    elements.exportPdfBtn?.addEventListener('click', exportPDF);
    elements.exportCsvBtn?.addEventListener('click', exportCSV);
    elements.downloadChecklistBtn?.addEventListener('click', downloadChecklist);
    elements.uploadChecklistBtn?.addEventListener('click', uploadChecklist);
    elements.analyzeOnlineBtn?.addEventListener('click', analyzeOnline);
    elements.checklistFileInput?.addEventListener('change', handleFileUpload);
    elements.exportReportPdf?.addEventListener('click', exportReportPDF);
    elements.printReport?.addEventListener('click', printReport);
    
    // Share buttons
    document.getElementById('share-facebook')?.addEventListener('click', shareToFacebook);
    document.getElementById('share-twitter')?.addEventListener('click', shareToTwitter);
    document.getElementById('share-whatsapp')?.addEventListener('click', shareToWhatsApp);
    document.getElementById('share-linkedin')?.addEventListener('click', shareToLinkedIn);
    document.getElementById('share-email')?.addEventListener('click', shareToEmail);
    document.getElementById('share-copy')?.addEventListener('click', copyURL);
    
    // UI Features
    setupReactions();
    initDarkMode();
    initPremiumModal();
    initScrollButtons();
    
    // Load last project if exists
    const lastProject = localStorage.getItem('lastProject');
    if (lastProject) {
        try { displayProject(JSON.parse(lastProject)); } catch(e) {}
    }
    
    console.log('✅ STEAM PBL Project Generator v4.0 - Fully Integrated with TiDB + Grok API');
    showToast('Welcome! Database connected. Generate your first project! 🚀', 'success');
}

// Start the app
init();
